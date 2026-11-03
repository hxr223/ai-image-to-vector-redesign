#!/usr/bin/env node
"use strict";
// Source-pixel annotation and outside-region diagnostics; not an aesthetic score.
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
function data(file) { const b=fs.readFileSync(file); return `data:${b[0]===137?'image/png':'image/jpeg'};base64,${b.toString('base64')}`; }
async function main() {
  const [original, manifest, out, after] = process.argv.slice(2);
  if (!out) throw new Error('Usage: node scripts/review_regions.js original.png regions.json output-prefix [after.png]');
  const spec=JSON.parse(fs.readFileSync(manifest,'utf8'));
  if (!spec.source || !Array.isArray(spec.regions) || !spec.regions.length) throw new Error('Expected source and nonempty regions');
  const {width:w,height:h}=spec.source;
  if (![w,h].every(v=>Number.isInteger(v)&&v>0)) throw new Error('Invalid source dimensions');
  const ids=new Set();
  for(const r of spec.regions) {
    if(typeof r.id!=='string'||!r.id||ids.has(r.id)) throw new Error('Region ids must be unique'); ids.add(r.id);
    const a=r.rect;
    if(!Array.isArray(a)||a.length!==4||!a.every(Number.isInteger)||a[0]<0||a[1]<0||a[2]<=0||a[3]<=0||a[0]+a[2]>w||a[1]+a[3]>h) throw new Error(`Invalid source-pixel bounds: ${r.id}`);
  }
  const chrome=['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Chromium.app/Contents/MacOS/Chromium'].find(fs.existsSync);
  const browser=await chromium.launch(chrome?{executablePath:chrome}:{});
  let result;
  try {
    const page=await browser.newPage();
    result=await page.evaluate(async({src,dst,spec})=>{
      async function load(uri){const im=new Image();im.src=uri;await im.decode();return im;}
      const im=await load(src), w=im.naturalWidth,h=im.naturalHeight;
      if(w!==spec.source.width||h!==spec.source.height) throw new Error('Manifest dimensions differ from decoded original');
      const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);
      const base=ctx.getImageData(0,0,w,h).data;
      const mask=new Uint8Array(w*h);
      for(const r of spec.regions){const [x,y,rw,rh]=r.rect;for(let yy=y;yy<y+rh;yy++)mask.fill(1,yy*w+x,yy*w+x+rw);ctx.strokeStyle='#ff2b63';ctx.lineWidth=2;ctx.strokeRect(x,y,rw,rh);ctx.font='bold 18px sans-serif';const label=r.id;const tw=ctx.measureText(label).width;ctx.fillStyle='#ff2b63';ctx.fillRect(x,Math.max(0,y-22),tw+8,22);ctx.fillStyle='white';ctx.fillText(label,x+4,Math.max(18,y-5));}
      const annotation=c.toDataURL('image/png');
      let diagnostic=null, diff=null;
      if(dst){const a=await load(dst);if(Math.abs(a.naturalWidth/a.naturalHeight-w/h)>0.0001)throw new Error('After aspect ratio differs from source');ctx.clearRect(0,0,w,h);ctx.drawImage(a,0,0,w,h);const pixels=ctx.getImageData(0,0,w,h).data;const heat=ctx.createImageData(w,h);let count=0,changed=0,total=0,allowed=0;
        for(let i=0;i<w*h;i++){const k=i*4;let d=0;for(let j=0;j<4;j++)d=Math.max(d,Math.abs(base[k+j]-pixels[k+j]));if(mask[i])allowed++;else{count++;total+=d;if(d>10)changed++;}heat.data[k]=mask[i]?60:(d>10?255:0);heat.data[k+1]=mask[i]?80:0;heat.data[k+2]=mask[i]?180:0;heat.data[k+3]=255;}
        if(!count)throw new Error('No protected pixels remain');ctx.putImageData(heat,0,0);diff=c.toDataURL('image/png');diagnostic={scope:'outside-declared-regions-only',threshold:10,protectedPixels:count,allowedAreaFraction:allowed/(w*h),changedPixels:changed,changedFraction:changed/count,meanMaxChannelDifference:total/count,visualStatus:'not-checked',textStatus:'not-checked'};
      }
      return {annotation,diff,diagnostic};
    },{src:data(original),dst:after?data(after):null,spec});
  } finally {await browser.close();}
  fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});
  const save=(name,uri)=>fs.writeFileSync(`${out}-${name}.png`,Buffer.from(uri.split(',')[1],'base64'));
  save('regions',result.annotation);if(result.diff)save('outside-diff',result.diff);
  const report={source:spec.source,regions:spec.regions.length,diagnostic:result.diagnostic};
  fs.writeFileSync(`${out}.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
