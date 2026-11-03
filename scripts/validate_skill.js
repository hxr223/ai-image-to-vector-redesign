#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function extractFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : null;
}

function checkSkill(root) {
  const skillPath = path.join(root, "SKILL.md");
  if (!fs.existsSync(skillPath)) {
    fail("Missing SKILL.md");
    return;
  }

  const body = read(skillPath);
  const frontmatter = extractFrontmatter(body);
  if (!frontmatter) fail("SKILL.md is missing YAML frontmatter.");
  if (!/^name:\s*ai-image-to-vector-redesign\s*$/m.test(frontmatter || "")) {
    fail("SKILL.md frontmatter must declare name: ai-image-to-vector-redesign");
  }
  if (!/^description:\s*\S.+$/m.test(frontmatter || "")) {
    fail("SKILL.md frontmatter must include a non-empty description.");
  }

  const links = [...body.matchAll(/\]\((references\/[^)]+)\)/g)].map((match) => match[1]);
  for (const link of links) {
    if (!fs.existsSync(path.join(root, link))) fail(`Broken SKILL.md reference link: ${link}`);
  }
}

function checkRequiredFiles(root) {
  const required = [
    "README.md",
    "agents/openai.yaml",
    "references/text-confirmation.md",
    "references/faithful-repair.md",
    "scripts/review_regions.js",
    "references/export-presets.md",
    "references/qa-checklist.md",
    "templates/poster.html",
    "templates/long-image.html",
    "templates/social-card.html",
    "templates/qa-report.md",
    "scripts/export_artwork.js",
    "scripts/qa_artwork.js",
    "scripts/draft_text.js",
    "scripts/compare_images.js",
    "scripts/build_examples.js",
    "scripts/init_case.js"
  ];

  for (const file of required) {
    if (!fs.existsSync(path.join(root, file))) fail(`Missing required file: ${file}`);
  }
}

function main() {
  const root = path.resolve(process.argv[2] || ".");
  checkSkill(root);
  checkRequiredFiles(root);
  if (!process.exitCode) console.log("Skill package is valid.");
}

main();
