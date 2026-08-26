#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const PRESETS = {
  general: { width: 1080, height: 1350 },
  "wechat-long": { width: 1080, height: 1920 },
  "wechat-inline": { width: 1080, height: 720 },
  xiaohongshu: { width: 1080, height: 1440 },
  "social-square": { width: 1080, height: 1080 },
  "presentation-cover": { width: 1920, height: 1080 },
  "a4-print": { width: 1240, height: 1754 }
};

function usage() {
  console.log(`Usage: node scripts/export_artwork.js <source.html|source.svg> [options]

Export rebuilt artwork to PNG/PDF and copy source files into a stable output package.

Options:
  --out <dir>              Output directory. Default: output
  --preset <name>          ${Object.keys(PRESETS).join(", ")}
  --width <px>             Override viewport width
  --height <px>            Override viewport height
  --scale <number>         PNG scale factor. Default: 3
  --formats <list>         Comma list: png,pdf,svg. Default: png,pdf,svg
  --four-k                 Also export publish-4k.png with long edge at least 4096px
  --transparent            Omit PNG background

Examples:
  node scripts/export_artwork.js output/source.html --out output --preset xiaohongshu --four-k
  node scripts/export_artwork.js output/source.svg --out output --scale 4
`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    out: "output",
    preset: "general",
    scale: 3,
    formats: ["png", "pdf", "svg"],
    fourK: false,
    transparent: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--help" || value === "-h") args.help = true;
    else if (value === "--out") args.out = argv[++i];
    else if (value === "--preset") args.preset = argv[++i];
    else if (value === "--width") args.width = Number(argv[++i]);
    else if (value === "--height") args.height = Number(argv[++i]);
    else if (value === "--scale") args.scale = Number(argv[++i]);
    else if (value === "--formats") args.formats = argv[++i].split(",").map((item) => item.trim()).filter(Boolean);
    else if (value === "--four-k") args.fourK = true;
    else if (value === "--transparent") args.transparent = true;
    else if (!args.input) args.input = value;
    else throw new Error(`Unexpected argument: ${value}`);
  }

  return args;
}

function requirePlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    throw new Error("Playwright is required for export. Run `npm install` in this skill folder first.");
  }
}

function readSvgDimensions(inputPath) {
  if (path.extname(inputPath).toLowerCase() !== ".svg") return null;
  const source = fs.readFileSync(inputPath, "utf8");
  const svgTag = source.match(/<svg\b[^>]*>/i)?.[0] ?? "";
  const width = Number(svgTag.match(/\bwidth=["']?([0-9.]+)/i)?.[1]);
  const height = Number(svgTag.match(/\bheight=["']?([0-9.]+)/i)?.[1]);
  if (width > 0 && height > 0) return { width: Math.round(width), height: Math.round(height) };
  const viewBox = svgTag.match(/\bviewBox=["']\s*[-0-9.]+\s+[-0-9.]+\s+([0-9.]+)\s+([0-9.]+)/i);
  if (viewBox) return { width: Math.round(Number(viewBox[1])), height: Math.round(Number(viewBox[2])) };
  return null;
}

function dimensionsFor(args) {
  if (!PRESETS[args.preset]) throw new Error(`Unknown preset: ${args.preset}`);
  const svgDims = args.input ? readSvgDimensions(path.resolve(args.input)) : null;
  const preset = PRESETS[args.preset];
  const width = args.width || svgDims?.width || preset.width;
  const height = args.height || svgDims?.height || preset.height;
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    throw new Error("Width and height must be positive numbers.");
  }
  if (!Number.isFinite(args.scale) || args.scale <= 0) throw new Error("Scale must be a positive number.");
  return { width: Math.round(width), height: Math.round(height) };
}

function copySource(inputPath, outDir) {
  const ext = path.extname(inputPath).toLowerCase();
  const sourceName = ext === ".svg" ? "source.svg" : "source.html";
  const sourceOut = path.join(outDir, sourceName);
  fs.copyFileSync(inputPath, sourceOut);
  if (ext === ".svg") fs.copyFileSync(inputPath, path.join(outDir, "editable.svg"));
  return sourceOut;
}

function browserLaunchOptions() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  ];
  const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
  return executablePath ? { executablePath } : {};
}

async function screenshot(page, outPath, scale, width, height, transparent) {
  await page.setViewportSize({ width, height });
  await page.screenshot({
    path: outPath,
    fullPage: false,
    omitBackground: transparent
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  if (!args.input) {
    usage();
    process.exitCode = 1;
    return;
  }

  const inputPath = path.resolve(args.input);
  if (!fs.existsSync(inputPath)) throw new Error(`Input file not found: ${inputPath}`);
  const ext = path.extname(inputPath).toLowerCase();
  if (![".html", ".htm", ".svg"].includes(ext)) throw new Error("Input must be an HTML or SVG file.");

  const formats = new Set(args.formats);
  const { chromium } = requirePlaywright();
  const { width, height } = dimensionsFor(args);
  const outDir = path.resolve(args.out);
  fs.mkdirSync(outDir, { recursive: true });

  const sourceOut = copySource(inputPath, outDir);
  const browser = await chromium.launch(browserLaunchOptions());
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: args.scale
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(inputPath).href, { waitUntil: "networkidle" });

  const written = [sourceOut];
  if (ext === ".svg") written.push(path.join(outDir, "editable.svg"));

  if (formats.has("png")) {
    const pngPath = path.join(outDir, `publish-${args.scale}x.png`);
    await screenshot(page, pngPath, args.scale, width, height, args.transparent);
    written.push(pngPath);
  }

  if (args.fourK) {
    const fourKScale = Math.max(args.scale, Math.ceil((4096 / Math.max(width, height)) * 100) / 100);
    await context.close();
    const highContext = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: fourKScale
    });
    const highPage = await highContext.newPage();
    await highPage.goto(pathToFileURL(inputPath).href, { waitUntil: "networkidle" });
    const png4kPath = path.join(outDir, "publish-4k.png");
    await screenshot(highPage, png4kPath, fourKScale, width, height, args.transparent);
    written.push(png4kPath);
    await highContext.close();
  } else {
    await context.close();
  }

  if (formats.has("pdf")) {
    const pdfContext = await browser.newContext({ viewport: { width, height } });
    const pdfPage = await pdfContext.newPage();
    await pdfPage.goto(pathToFileURL(inputPath).href, { waitUntil: "networkidle" });
    const pdfPath = path.join(outDir, "print.pdf");
    await pdfPage.pdf({
      path: pdfPath,
      width: `${width}px`,
      height: `${height}px`,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    written.push(pdfPath);
    await pdfContext.close();
  }

  await browser.close();

  const report = {
    input: inputPath,
    outputDirectory: outDir,
    preset: args.preset,
    viewport: { width, height },
    scale: args.scale,
    fourK: args.fourK,
    files: written.map((file) => path.relative(outDir, file))
  };
  fs.writeFileSync(path.join(outDir, "export-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
