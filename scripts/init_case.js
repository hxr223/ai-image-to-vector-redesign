#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function usage() {
  console.log(`Usage: node scripts/init_case.js <case-name> [--root examples]

Create a standard before/after example case folder.

Example:
  node scripts/init_case.js event-poster
`);
}

function parseArgs(argv) {
  const args = { root: "examples", name: null };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--help" || value === "-h") {
      args.help = true;
    } else if (value === "--root") {
      args.root = argv[++i];
    } else if (!args.name) {
      args.name = value;
    } else {
      throw new Error(`Unexpected argument: ${value}`);
    }
  }
  return args;
}

function safeCaseName(name) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    throw new Error("Case name must use lowercase letters, numbers, and hyphens.");
  }
  return name;
}

function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, content);
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  if (!args.name) {
    usage();
    process.exitCode = 1;
    return;
  }

  const name = safeCaseName(args.name);
  const caseDir = path.resolve(args.root, name);
  const outputDir = path.join(caseDir, "output");
  const workDir = path.join(caseDir, "work");

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(workDir, { recursive: true });

  const readme = `# ${name}

## Source

- Original GPT Image 2 output: \`original.png\`
- Problem crop: \`problem-crop.png\`

## Problem

- What looks good:
- What prevents publishing:
- Text risks:
- Resolution or platform risks:

## Reconstruction

- Confirmed text:
- Vector rebuilt:
- Embedded raster:
- Export preset:

## Outputs

- \`output/source.html\` or \`output/source.svg\`
- \`output/editable.svg\`
- \`output/publish-3x.png\`
- \`output/publish-4k.png\`
- \`output/print.pdf\`
- \`output/qa-report.md\`
`;

  const created = [];
  if (writeIfMissing(path.join(caseDir, "README.md"), readme)) created.push("README.md");
  if (writeIfMissing(path.join(outputDir, ".gitkeep"), "")) created.push("output/.gitkeep");
  if (writeIfMissing(path.join(workDir, ".gitkeep"), "")) created.push("work/.gitkeep");

  console.log(`Created ${caseDir}`);
  if (created.length) console.log(`Initialized: ${created.join(", ")}`);
}

main();
