#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function usage() {
  console.log(`Usage: node scripts/inspect_image.js <input.png|jpg|jpeg> [--json]

Report basic image dimensions and likely publishing risks for a GPT Image 2 design.

Example:
  node scripts/inspect_image.js original.png
`);
}

function parseArgs(argv) {
  const args = { input: null, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--help" || value === "-h") args.help = true;
    else if (value === "--json") args.json = true;
    else if (!args.input) args.input = value;
    else throw new Error(`Unexpected argument: ${value}`);
  }
  return args;
}

function readPngSize(buffer) {
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return {
    type: "png",
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function readJpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        type: "jpeg",
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += 2 + length;
  }
  return null;
}

function classify(size) {
  const longEdge = Math.max(size.width, size.height);
  const shortEdge = Math.min(size.width, size.height);
  const aspectRatio = Number((size.width / size.height).toFixed(3));
  const orientation = size.width === size.height ? "square" : size.width > size.height ? "landscape" : "portrait";
  const risks = [];

  if (longEdge < 2000) risks.push("low source resolution for 4K-style delivery");
  if (shortEdge < 900) risks.push("small copy may fail after platform compression");
  if (orientation === "portrait" && aspectRatio < 0.6) risks.push("long-image layout should be checked for tiny text");
  if (orientation === "landscape" && aspectRatio > 2) risks.push("wide layout may need platform-specific crop review");

  return { longEdge, shortEdge, aspectRatio, orientation, risks };
}

function main() {
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
  const buffer = fs.readFileSync(inputPath);
  const size = readPngSize(buffer) || readJpegSize(buffer);
  if (!size) throw new Error("Only PNG and JPEG dimensions are supported.");
  const result = {
    input: inputPath,
    type: size.type,
    width: size.width,
    height: size.height,
    ...classify(size)
  };

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Input: ${result.input}`);
    console.log(`Type: ${result.type}`);
    console.log(`Dimensions: ${result.width}x${result.height}`);
    console.log(`Aspect ratio: ${result.aspectRatio} (${result.orientation})`);
    console.log(`Long edge: ${result.longEdge}px`);
    console.log(`Risks: ${result.risks.length ? result.risks.join("; ") : "none from dimensions alone"}`);
    console.log("Manual review still required: text accuracy, source-text ghosts, crop, and asset fidelity.");
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
