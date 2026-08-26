#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function usage() {
  console.log(`Usage: node scripts/qa_artwork.js <output-dir> [options]

Check a reconstructed output package for common publishing failures.

Options:
  --min-long-edge <px>     Expected minimum long edge for PNG files. Default: 3000
  --require <list>         Comma list of required files. Default: publish-3x.png,print.pdf

Example:
  node scripts/qa_artwork.js output --min-long-edge 4096 --require publish-4k.png,print.pdf
`);
}

function parseArgs(argv) {
  const args = {
    dir: null,
    minLongEdge: 3000,
    require: ["publish-3x.png", "print.pdf"]
  };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--help" || value === "-h") args.help = true;
    else if (value === "--min-long-edge") args.minLongEdge = Number(argv[++i]);
    else if (value === "--require") args.require = argv[++i].split(",").map((item) => item.trim()).filter(Boolean);
    else if (!args.dir) args.dir = value;
    else throw new Error(`Unexpected argument: ${value}`);
  }
  return args;
}

function pngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`${filePath} is not a PNG file.`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function fileLooksNonEmpty(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).size > 128;
}

function checkRequired(outDir, names, issues) {
  for (const name of names) {
    const filePath = path.join(outDir, name);
    if (!fileLooksNonEmpty(filePath)) issues.push(`Missing or empty required file: ${name}`);
  }
}

function checkPngs(outDir, minLongEdge, required, issues, notes) {
  const allPngs = fs.readdirSync(outDir).filter((name) => name.toLowerCase().endsWith(".png"));
  const requiredPngs = required.filter((name) => name.toLowerCase().endsWith(".png"));
  const namesToEnforce = requiredPngs.length ? requiredPngs : allPngs;

  for (const name of allPngs) {
    const filePath = path.join(outDir, name);
    const size = pngSize(filePath);
    const longEdge = Math.max(size.width, size.height);
    notes.push(`${name}: ${size.width}x${size.height}`);
    if (!namesToEnforce.includes(name)) continue;
    if (longEdge < minLongEdge) {
      issues.push(`${name} long edge ${longEdge}px is below expected ${minLongEdge}px.`);
    }
  }
}

function hasSource(outDir) {
  return ["source.html", "source.svg", "editable.svg"].some((name) => fs.existsSync(path.join(outDir, name)));
}

function writeMarkdownReport(outDir, issues, notes) {
  const status = issues.length ? "Needs attention" : "Passed";
  const body = `# QA Report

## Status

${status}

## Checks

- Source file present: ${hasSource(outDir) ? "yes" : "no"}
- Output dimensions: ${notes.length ? notes.join("; ") : "no PNG files found"}
- Required files: ${issues.some((issue) => issue.startsWith("Missing")) ? "missing files found" : "present"}

## Issues

${issues.length ? issues.map((issue) => `- ${issue}`).join("\n") : "- None found by automated checks."}

## Manual Review Still Required

- Confirm text accuracy against user-approved copy.
- Inspect full composition for white borders, cropping, asset loading, and source-text ghosts.
- Inspect text-detail crops when small copy matters.
`;
  fs.writeFileSync(path.join(outDir, "qa-report.md"), body);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  if (!args.dir) {
    usage();
    process.exitCode = 1;
    return;
  }

  const outDir = path.resolve(args.dir);
  if (!fs.existsSync(outDir)) throw new Error(`Output directory not found: ${outDir}`);
  if (!Number.isFinite(args.minLongEdge) || args.minLongEdge <= 0) throw new Error("Minimum long edge must be positive.");

  const issues = [];
  const notes = [];
  if (!hasSource(outDir)) issues.push("Missing source.html, source.svg, or editable.svg.");
  checkRequired(outDir, args.require, issues);
  checkPngs(outDir, args.minLongEdge, args.require, issues, notes);
  writeMarkdownReport(outDir, issues, notes);

  const result = { status: issues.length ? "failed" : "passed", issues, notes };
  console.log(JSON.stringify(result, null, 2));
  if (issues.length) process.exitCode = 1;
}

main();
