const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {execFileSync,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const run=(script,args)=>execFileSync(process.execPath,[path.join(root,'scripts',script),...args],{encoding:'utf8'});
test('region diagnostics detect protected changes and reject coordinate errors; QA preserves manual review',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'faithful-repair-'));
 const chrome=['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Chromium.app/Contents/MacOS/Chromium'].find(fs.existsSync);
 const browser=await chromium.launch(chrome?{executablePath:chrome}:{});
 try {
  const p=await browser.newPage();
  for(const [name,rect] of [['original',null],['inside',[12,12,3,3]],['outside',[70,70,3,3]]]){
   const uri=await p.evaluate(r=>{const c=document.createElement('canvas');c.width=100;c.height=100;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,100,100);if(r){x.fillStyle='black';x.fillRect(...r);}return c.toDataURL();},rect);
   fs.writeFileSync(path.join(dir,name+'.png'),Buffer.from(uri.split(',')[1],'base64'));
  }
 }finally{await browser.close();}
 try {
 const manifest=path.join(dir,'regions.json');
 const spec={source:{width:100,height:100},regions:[{id:'text',rect:[10,10,20,20],text:'龘'}]};
 fs.writeFileSync(manifest,JSON.stringify(spec));
 const inspect=name=>{const prefix=path.join(dir,name+'-review');run('review_regions.js',[path.join(dir,'original.png'),manifest,prefix,path.join(dir,name+'.png')]);return JSON.parse(fs.readFileSync(prefix+'.json')).diagnostic;};
 assert.equal(inspect('inside').changedPixels,0);
 assert.equal(inspect('outside').changedPixels,9);
 spec.regions[0].rect=[95,0,20,20];fs.writeFileSync(manifest,JSON.stringify(spec));
 assert.notEqual(spawnSync(process.execPath,[path.join(root,'scripts/review_regions.js'),path.join(dir,'original.png'),manifest,path.join(dir,'invalid')]).status,0);
 fs.writeFileSync(path.join(dir,'source.svg'),'<svg xmlns="http://www.w3.org/2000/svg"/>');
 fs.writeFileSync(path.join(dir,'qa-report.md'),'MANUAL FIDELITY FAILED');
 run('qa_artwork.js',[dir,'--require','original.png','--min-long-edge','100']);
 assert.equal(fs.readFileSync(path.join(dir,'qa-report.md'),'utf8'),'MANUAL FIDELITY FAILED');
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'qa-mechanical.json'))).visualFidelityStatus,'not-checked');
 run('compare_images.js',[path.join(dir,'original.png'),path.join(dir,'inside.png'),'--full','--out-crop',path.join(dir,'crop.png'),'--out-compare',path.join(dir,'full.png')]);
 const png=fs.readFileSync(path.join(dir,'crop.png'));assert.equal(png.readUInt32BE(16),100);assert.equal(png.readUInt32BE(20),100);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
