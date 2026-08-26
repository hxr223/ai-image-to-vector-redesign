#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function usage() {
  console.log(`Usage: node scripts/compare_images.js <before.png> <after.png> [options]

Create a problem crop and side-by-side detail comparison.

Options:
  --crop <x,y,w,h>          Crop rectangle from both images. Default: center crop
  --out-crop <file>         Problem crop path. Default: problem-crop.png
  --out-compare <file>      Comparison path. Default: detail-comparison.png
  --label-before <text>     Default: Original raster
  --label-after <text>      Default: Rebuilt output

Example:
  node scripts/compare_images.js original.png output/publish-3x.png --crop 80,760,860,220
`);
}

function parseArgs(argv) {
  const args = {
    before: null,
    after: null,
    outCrop: "problem-crop.png",
    outCompare: "detail-comparison.png",
    labelBefore: "Original raster",
    labelAfter: "Rebuilt output"
  };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--help" || value === "-h") args.help = true;
    else if (value === "--crop") args.crop = argv[++i];
    else if (value === "--out-crop") args.outCrop = argv[++i];
    else if (value === "--out-compare") args.outCompare = argv[++i];
    else if (value === "--label-before") args.labelBefore = argv[++i];
    else if (value === "--label-after") args.labelAfter = argv[++i];
    else if (!args.before) args.before = value;
    else if (!args.after) args.after = value;
    else throw new Error(`Unexpected argument: ${value}`);
  }
  return args;
}

function requirePlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    throw new Error("Playwright is required for image comparison. Run `npm install` first.");
  }
}

function browserLaunchOptions() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  ];
  const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
  return executablePath ? { executablePath } : {};
}

function parseCrop(crop) {
  if (!crop) return null;
  const values = crop.split(",").map((value) => Number(value.trim()));
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    throw new Error("--crop must be x,y,w,h");
  }
  const [x, y, width, height] = values;
  return { x, y, width, height };
}

function imageDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

async function imageSize(page, filePath) {
  return page.evaluate((src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  }), imageDataUrl(filePath));
}

async function makeComparison(page, beforePath, afterPath, crop, labels) {
  return page.evaluate(async ({ beforeSrc, afterSrc, crop, labels }) => {
    function load(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Could not load ${src}`));
        image.src = src;
      });
    }

    const before = await load(beforeSrc);
    const after = await load(afterSrc);
    const naturalCrop = crop || {
      x: Math.round(before.naturalWidth * 0.12),
      y: Math.round(before.naturalHeight * 0.58),
      width: Math.round(before.naturalWidth * 0.76),
      height: Math.round(before.naturalHeight * 0.18)
    };
    const scaleX = after.naturalWidth / before.naturalWidth;
    const scaleY = after.naturalHeight / before.naturalHeight;
    const afterCrop = {
      x: Math.round(naturalCrop.x * scaleX),
      y: Math.round(naturalCrop.y * scaleY),
      width: Math.round(naturalCrop.width * scaleX),
      height: Math.round(naturalCrop.height * scaleY)
    };

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = naturalCrop.width;
    cropCanvas.height = naturalCrop.height;
    cropCanvas.getContext("2d").drawImage(
      before,
      naturalCrop.x,
      naturalCrop.y,
      naturalCrop.width,
      naturalCrop.height,
      0,
      0,
      naturalCrop.width,
      naturalCrop.height
    );

    const displayWidth = 960;
    const displayHeight = Math.round(displayWidth * naturalCrop.height / naturalCrop.width);
    const labelHeight = 54;
    const gap = 18;
    const canvas = document.createElement("canvas");
    canvas.width = displayWidth * 2 + gap;
    canvas.height = displayHeight + labelHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111827";
    ctx.font = "700 28px Arial, sans-serif";
    ctx.fillText(labels.before, 0, 36);
    ctx.fillText(labels.after, displayWidth + gap, 36);
    ctx.drawImage(before, naturalCrop.x, naturalCrop.y, naturalCrop.width, naturalCrop.height, 0, labelHeight, displayWidth, displayHeight);
    ctx.drawImage(after, afterCrop.x, afterCrop.y, afterCrop.width, afterCrop.height, displayWidth + gap, labelHeight, displayWidth, displayHeight);

    return {
      cropDataUrl: cropCanvas.toDataURL("image/png"),
      compareDataUrl: canvas.toDataURL("image/png")
    };
  }, {
    beforeSrc: imageDataUrl(beforePath),
    afterSrc: imageDataUrl(afterPath),
    crop,
    labels
  });
}

function writeDataUrl(filePath, dataUrl) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  if (!args.before || !args.after) {
    usage();
    process.exitCode = 1;
    return;
  }

  const beforePath = path.resolve(args.before);
  const afterPath = path.resolve(args.after);
  if (!fs.existsSync(beforePath)) throw new Error(`Before image not found: ${beforePath}`);
  if (!fs.existsSync(afterPath)) throw new Error(`After image not found: ${afterPath}`);

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch(browserLaunchOptions());
  const page = await browser.newPage();
  const beforeSize = await imageSize(page, beforePath);
  const crop = parseCrop(args.crop);
  const result = await makeComparison(page, beforePath, afterPath, crop, {
    before: args.labelBefore,
    after: args.labelAfter
  });
  await browser.close();

  writeDataUrl(path.resolve(args.outCrop), result.cropDataUrl);
  writeDataUrl(path.resolve(args.outCompare), result.compareDataUrl);
  console.log(JSON.stringify({
    before: beforePath,
    after: afterPath,
    beforeSize,
    crop: crop || "auto",
    files: [path.resolve(args.outCrop), path.resolve(args.outCompare)]
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
