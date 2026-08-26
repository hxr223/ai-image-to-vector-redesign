#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const FONT = "PingFang SC, Hiragino Sans GB, STHeiti, Songti SC, Microsoft YaHei, Arial, sans-serif";

const cases = [
  {
    slug: "event-poster",
    preset: "xiaohongshu",
    crop: "60,80,960,430",
    title: "爨字旧巷字体夜校",
    copy: `爨字旧巷字体夜校

生僻字专项：龘、齉、爨、鬱、麤、靐、饕餮

2026年10月16日 周五
19:30-22:10

苏州旧巷书房  澄湖厅二层

课程安排
19:30  旧招牌里的异体字
20:10  从“爨宝子碑”到现代标题字
20:50  海报小字的可读性修复
21:30  现场重建：糊字、错字、伪字

报名费 128 元
限额 36 人

请携带一张你想修复的 AI 海报。
报名：glyphnight.example`,
    goodSvg: eventPosterSvg
  },
  {
    slug: "wechat-long-image",
    preset: "wechat-long",
    crop: "70,510,920,430",
    title: "古籍数字化交付清单",
    copy: `古籍数字化交付清单

从扫描图到可校对、可检索、可归档的高清长图

01 先校字
核对讹、衍、脱、倒四类错误。
重点复核：龘、齉、爨、鬱、麤、靐、囍、鹱。
人名、地名、纪年、卷次不得依赖 AI 猜测。

02 再排版
标题、眉批、夹注、脚注分层处理。
竖排原文保留阅读节奏，横排释文保证手机可读。
凡例、版本说明、钤印位置单独标注。

03 后导出
公众号长图：宽 1080，长边按内容延展。
审校 PDF：保留页码、来源、校对人和日期。
归档 SVG：文字可选中，图层可复查。

交付提醒
不要把低清扫描图直接放大。
不要把无法确认的字写成确定结论。
所有生僻字必须进入 confirmed-text.md。`,
    goodSvg: longImageSvg
  },
  {
    slug: "product-social-card",
    preset: "social-square",
    crop: "54,70,720,390",
    title: "霜鹭冻干茶",
    copy: `霜鹭冻干茶  鎏金桂花乌龙

首发价 99 元 / 12 枚
第二件 8.25 折

0 蔗糖  0 香精  0 反式脂肪

甄选桂花、乌龙、冻干茶萃
3 秒即溶，冷水也能冲开

生僻字批注：鹭、鎏、甄、萃、饕、鬱

今晚 23:59 截止
snowheron.example`,
    goodSvg: productSvg
  }
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function line(text, x, y, size, fill = "#14202b", weight = 500, extra = "") {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(text)}</text>`;
}

function textBlock(lines, x, y, size, fill = "#14202b", weight = 500, leading = Math.round(size * 1.45), extra = "") {
  return lines.map((text, index) => line(text, x, y + index * leading, size, fill, weight, extra)).join("\n  ");
}

function roundedRect(x, y, width, height, fill, stroke = "none", radius = 8, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" opacity="${opacity}"/>`;
}

function svgFrame(width, height, body, defs = "") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${defs}
  ${body}
</svg>`;
}

function eventPosterSvg() {
  return svgFrame(1080, 1440, `
  ${roundedRect(0, 0, 1080, 1440, "#f7efe2", "none", 0)}
  ${roundedRect(52, 52, 976, 1336, "#fffaf1", "#17202a", 8)}
  ${line("爨字旧巷", 92, 190, 112, "#111827", 900)}
  ${line("字体夜校", 92, 314, 112, "#111827", 900)}
  ${roundedRect(92, 382, 896, 82, "#d9553f", "none", 8)}
  ${line("生僻字专项：龘、齉、爨、鬱、麤、靐、饕餮", 122, 436, 38, "#fffaf1", 850)}
  ${roundedRect(92, 526, 420, 126, "#163b45", "none", 8)}
  ${line("2026年10月16日 周五", 126, 582, 34, "#ffffff", 800)}
  ${line("19:30-22:10", 126, 626, 38, "#f7c948", 900)}
  ${roundedRect(568, 526, 420, 126, "#f2d186", "none", 8)}
  ${line("苏州旧巷书房", 610, 584, 34, "#111827", 850)}
  ${line("澄湖厅二层", 610, 628, 34, "#111827", 850)}
  ${line("课程安排", 92, 766, 46, "#d9553f", 900)}
  ${textBlock([
    "19:30  旧招牌里的异体字",
    "20:10  从“爨宝子碑”到现代标题字",
    "20:50  海报小字的可读性修复",
    "21:30  现场重建：糊字、错字、伪字"
  ], 116, 842, 35, "#111827", 720, 64)}
  ${roundedRect(92, 1134, 896, 94, "#111827", "none", 8)}
  ${line("报名费 128 元  |  限额 36 人", 160, 1195, 42, "#ffffff", 900)}
  ${line("请携带一张你想修复的 AI 海报", 116, 1300, 34, "#163b45", 800)}
  ${line("报名：glyphnight.example", 650, 1300, 30, "#d9553f", 850)}`);
}

function longImageSvg() {
  return svgFrame(1080, 2400, `
  ${roundedRect(0, 0, 1080, 2400, "#f2f3ed", "none", 0)}
  ${roundedRect(58, 58, 964, 2284, "#fffdf7", "#1f3529", 8)}
  ${line("古籍数字化", 92, 176, 82, "#17251d", 900)}
  ${line("交付清单", 92, 270, 82, "#17251d", 900)}
  ${line("从扫描图到可校对、可检索、可归档的高清长图", 96, 348, 32, "#536158", 700)}
  ${section("01", "先校字", [
    "核对讹、衍、脱、倒四类错误。",
    "重点复核：龘、齉、爨、鬱、麤、靐、囍、鹱。",
    "人名、地名、纪年、卷次不得依赖 AI 猜测。"
  ], 96, 500, "#34543f")}
  ${section("02", "再排版", [
    "标题、眉批、夹注、脚注分层处理。",
    "竖排原文保留阅读节奏，横排释文保证手机可读。",
    "凡例、版本说明、钤印位置单独标注。"
  ], 96, 960, "#925f22")}
  ${section("03", "后导出", [
    "公众号长图：宽 1080，长边按内容延展。",
    "审校 PDF：保留页码、来源、校对人和日期。",
    "归档 SVG：文字可选中，图层可复查。"
  ], 96, 1420, "#385f88")}
  ${roundedRect(96, 1900, 888, 280, "#17251d", "none", 8)}
  ${line("交付提醒", 140, 1980, 46, "#f8d77f", 900)}
  ${textBlock([
    "不要把低清扫描图直接放大。",
    "不要把无法确认的字写成确定结论。",
    "所有生僻字必须进入 confirmed-text.md。"
  ], 140, 2054, 34, "#ffffff", 700, 54)}
  ${line("AI Image To Vector Redesign / Example Case", 96, 2284, 26, "#6a736b", 700)}`);
}

function section(index, title, rows, x, y, color) {
  return `
  ${roundedRect(x, y, 888, 348, "#ffffff", "#d9ded2", 8)}
  <circle cx="${x + 66}" cy="${y + 76}" r="46" fill="${color}"/>
  ${line(index, x + 40, y + 92, 40, "#ffffff", 900)}
  ${line(title, x + 140, y + 92, 50, color, 900)}
  ${textBlock(rows, x + 64, y + 164, 34, "#1f2933", 650, 58)}
  `;
}

function productSvg() {
  return svgFrame(1080, 1080, `
  <defs>
    <linearGradient id="productBg" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#f7eee5"/>
      <stop offset="0.55" stop-color="#f6c865"/>
      <stop offset="1" stop-color="#4f8f94"/>
    </linearGradient>
  </defs>
  ${roundedRect(0, 0, 1080, 1080, "url(#productBg)", "none", 0)}
  ${roundedRect(52, 52, 976, 976, "#fffaf2", "none", 8, 0.92)}
  <ellipse cx="818" cy="550" rx="160" ry="330" fill="#e4f0f0"/>
  <rect x="742" y="248" width="152" height="560" rx="76" fill="#ffffff" stroke="#284449" stroke-width="4"/>
  <rect x="776" y="190" width="84" height="88" rx="24" fill="#74aeb1" stroke="#284449" stroke-width="4"/>
  ${line("霜鹭冻干茶", 72, 162, 68, "#111827", 900)}
  ${line("鎏金桂花乌龙", 72, 244, 60, "#81551a", 900)}
  ${roundedRect(72, 302, 580, 136, "#111827", "none", 8)}
  ${line("首发价 99 元 / 12 枚", 106, 364, 40, "#ffffff", 900)}
  ${line("第二件 8.25 折", 106, 416, 42, "#f6c865", 900)}
  ${roundedRect(72, 500, 554, 70, "#f6c865", "none", 8)}
  ${line("0 蔗糖  0 香精  0 反式脂肪", 104, 548, 32, "#111827", 850)}
  ${textBlock([
    "甄选桂花、乌龙、冻干茶萃",
    "3 秒即溶，冷水也能冲开",
    "生僻字批注：鹭、鎏、甄、萃、饕、鬱"
  ], 82, 654, 34, "#17202a", 700, 58)}
  ${roundedRect(72, 872, 554, 90, "#4f8f94", "none", 8)}
  ${line("今晚 23:59 截止", 112, 930, 40, "#ffffff", 900)}
  ${line("snowheron.example", 718, 946, 30, "#17202a", 850)}`);
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

function requirePlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    throw new Error("Playwright is required to generate example originals. Run `npm install` first.");
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

async function renderOriginal(browser, svg, outputPath) {
  const match = svg.match(/width="(\d+)" height="(\d+)"/);
  if (!match) throw new Error("Could not read SVG dimensions");
  const width = Number(match[1]);
  const height = Number(match[2]);
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #fff; }
    .frame {
      width: ${width}px;
      height: ${height}px;
      filter: blur(2.4px) contrast(0.84) saturate(0.92);
      opacity: 0.9;
      transform: translateZ(0);
    }
    svg { display: block; width: ${width}px; height: ${height}px; }
  </style>
</head>
<body><div class="frame">${svg}</div></body>
</html>`);
  await page.locator(".frame").screenshot({ path: outputPath });
  await page.close();
}

async function main() {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch(browserLaunchOptions());

  try {
    for (const item of cases) {
      const dir = path.join(ROOT, "examples", item.slug);
      const out = path.join(dir, "output");
      fs.mkdirSync(out, { recursive: true });

      await renderOriginal(browser, item.goodSvg(), path.join(dir, "original.png"));

      const finalCopy = path.join(dir, "final-copy.txt");
      write(finalCopy, `${item.copy}\n`);
      run("node", [
        path.join(ROOT, "scripts", "draft_text.js"),
        path.join(dir, "original.png"),
        "--copy",
        finalCopy,
        "--out",
        path.join(dir, "confirmed-text.md"),
        "--title",
        `${item.title} Confirmed Text`,
        "--uncertain",
        "Original text is intentionally treated as unreliable flattened AI raster text."
      ], ROOT);

      write(path.join(out, "source.svg"), item.goodSvg());
      run("node", [
        path.join(ROOT, "scripts", "export_artwork.js"),
        path.join(out, "source.svg"),
        "--out",
        out,
        "--preset",
        item.preset,
        "--four-k"
      ], ROOT);
      run("node", [
        path.join(ROOT, "scripts", "compare_images.js"),
        path.join(dir, "original.png"),
        path.join(out, "publish-3x.png"),
        "--crop",
        item.crop,
        "--out-crop",
        path.join(dir, "problem-crop.png"),
        "--out-compare",
        path.join(dir, "detail-comparison.png"),
        "--label-before",
        "原始 AI 位图文字",
        "--label-after",
        "重建后的清晰文字"
      ], ROOT);
      run("node", [
        path.join(ROOT, "scripts", "qa_artwork.js"),
        out,
        "--min-long-edge",
        "4096",
        "--require",
        "publish-4k.png,print.pdf,editable.svg"
      ], ROOT);
      fs.copyFileSync(path.join(out, "publish-3x.png"), path.join(dir, "rebuilt-preview.png"));
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
