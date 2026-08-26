#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function usage() {
  console.log(`Usage: node scripts/draft_text.js <image-path> [options]

Create a confirmed-text.md draft for an AI-generated design.

Options:
  --out <file>          Output markdown path. Default: confirmed-text.md
  --title <text>        Case title
  --copy <file>         Plain text file containing confirmed final copy
  --uncertain <text>    Add an uncertain region note. Can be repeated.

Example:
  node scripts/draft_text.js original.png --copy final-copy.txt --uncertain "footer: blurry legal text"
`);
}

function parseArgs(argv) {
  const args = { image: null, out: "confirmed-text.md", title: "Confirmed Text Draft", uncertain: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--help" || value === "-h") args.help = true;
    else if (value === "--out") args.out = argv[++i];
    else if (value === "--title") args.title = argv[++i];
    else if (value === "--copy") args.copy = argv[++i];
    else if (value === "--uncertain") args.uncertain.push(argv[++i]);
    else if (!args.image) args.image = value;
    else throw new Error(`Unexpected argument: ${value}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  if (!args.image) {
    usage();
    process.exitCode = 1;
    return;
  }

  const imagePath = path.resolve(args.image);
  if (!fs.existsSync(imagePath)) throw new Error(`Image not found: ${imagePath}`);
  const copyText = args.copy ? fs.readFileSync(path.resolve(args.copy), "utf8").trim() : "";
  const uncertain = args.uncertain.length ? args.uncertain : ["Review all small or blurry text before rebuilding."];

  const markdown = `# ${args.title}

## Source

- Image: \`${path.basename(imagePath)}\`
- Status: draft

## Confirmed Final Copy

\`\`\`text
${copyText || "Paste or confirm final copy here before rebuilding."}
\`\`\`

## Uncertain Source Regions

${uncertain.map((item) => `- ${item}`).join("\n")}

## Rule

Do not claim text accuracy from blurry AI-generated pixels. Rebuild final deliverables from confirmed copy only.
`;

  fs.writeFileSync(path.resolve(args.out), markdown);
  console.log(`Wrote ${path.resolve(args.out)}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
