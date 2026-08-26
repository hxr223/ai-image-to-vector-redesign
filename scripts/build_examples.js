#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");

const cases = [
  {
    slug: "event-poster",
    preset: "xiaohongshu",
    crop: "80,720,880,250",
    title: "HARBOR LIGHTS CREATIVE NIGHT",
    subtitle: "A one-night meetup for designers, builders, and visual storytellers.",
    copy: `HARBOR LIGHTS CREATIVE NIGHT

A one-night meetup for designers, builders, and visual storytellers.

Friday, October 16, 2026
7:00 PM - 10:00 PM

Pier 27 Studio Hall
San Francisco, CA

Talks
Maya Chen - Designing With Motion
Jon Bell - Systems That Feel Human
Ari Patel - From Prompt To Poster

Live demos, portfolio reviews, and open studio networking.

Early Bird Tickets: $24
Reserve your seat at harborlights.example

Hosted by Studio North
Partners: Canvas Lab / Pixel Foundry / Bay Type Club`,
    svg: eventPosterSvg
  },
  {
    slug: "wechat-long-image",
    preset: "wechat-long",
    crop: "70,790,760,330",
    title: "MICRO HABITS FOR DEEP WORK",
    subtitle: "Small actions. Big focus. A mobile-first guide for protecting your best attention.",
    copy: `MICRO HABITS FOR DEEP WORK

Small actions. Big focus.
Tiny habits that protect your attention and multiply your output.

01 Plan Your Focus
Pick one priority before you open your inbox.
Time block a specific deep-work session.
Define what done looks like before you start.

02 Start Strong
Remove major distractions from sight.
Use a focus timer for 50 to 90 minutes.
Create a short start ritual that tells your brain it is time to work.

03 Recover To Go Deeper
Take a real break.
Get light and air.
Hydrate and fuel.
End with a close: review progress and plan the next step.

Daily Micro Habit Checklist
I chose my number-one priority.
I scheduled my deep-work block.
I removed major distractions.
I worked in a focused block.
I took a real break and moved.
I closed the day with a review.`,
    svg: deepWorkSvg
  },
  {
    slug: "product-social-card",
    preset: "social-square",
    crop: "60,650,520,270",
    title: "AEROSIP GO",
    subtitle: "Self-cleaning insulated bottle",
    copy: `AEROSIP GO
Self-cleaning insulated bottle

Launch Offer
$49
Was $69

Cold for 24 hours
UV-C cap
20 oz | Leakproof

SHOP NOW
aerosip.example

Offer ends Sep 30, 2026. US only.`,
    svg: productSvg
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
  return `<text x="${x}" y="${y}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(text)}</text>`;
}

function roundedRect(x, y, width, height, fill, stroke = "none", radius = 8, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" opacity="${opacity}"/>`;
}

function eventPosterSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1440" viewBox="0 0 1080 1440">
  <defs>
    <linearGradient id="stage" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#123f46"/>
      <stop offset="0.52" stop-color="#f2eee5"/>
      <stop offset="1" stop-color="#e85c4a"/>
    </linearGradient>
  </defs>
  ${roundedRect(0, 0, 1080, 1440, "url(#stage)", "none", 0)}
  <circle cx="108" cy="138" r="180" fill="#0f6d72" opacity="0.55"/>
  <circle cx="990" cy="78" r="260" fill="#15191e" opacity="0.35"/>
  ${roundedRect(92, 112, 896, 1216, "#f8f1e5", "#17323a", 8, 0.94)}
  ${line("DESIGN  CODE  CREATE", 286, 260, 32, "#27313a", 700, 'letter-spacing="8"')}
  ${line("VECTOR", 190, 420, 150, "#df5143", 900)}
  ${line("SUMMIT", 198, 565, 128, "#0e5560", 900)}
  <line x1="360" y1="620" x2="720" y2="620" stroke="#1d2b32" stroke-width="3"/>
  ${line("A CONFERENCE FOR CREATORS", 262, 680, 34, "#24313a", 700)}
  ${line("DESIGNERS, BUILDERS, AND DIGITAL THINKERS", 188, 722, 30, "#24313a", 700)}
  ${roundedRect(140, 780, 372, 118, "#df5143", "none", 8)}
  ${roundedRect(568, 780, 372, 118, "#0f7377", "none", 8)}
  ${line("JUNE 14-16, 2026", 190, 850, 34, "#fff8ef", 800)}
  ${line("HARBOR HALL", 642, 840, 34, "#fff8ef", 800)}
  ${line("PORTLAND, OR", 660, 876, 26, "#fff8ef", 600)}
  ${roundedRect(230, 948, 620, 118, "#182227", "none", 4, 0.96)}
  ${line("THREE DAYS OF INSPIRATION", 318, 1000, 30, "#f26452", 800)}
  ${line("Talks, workshops, and live design demos.", 330, 1042, 24, "#ffffff", 500)}
  ${roundedRect(130, 1110, 820, 74, "#0e5560", "none", 8)}
  ${line("30+ SPEAKERS", 174, 1158, 24, "#fff8ef", 800)}
  ${line("LIVE DEMOS", 468, 1158, 24, "#fff8ef", 800)}
  ${line("CONNECT & GROW", 700, 1158, 24, "#fff8ef", 800)}
  ${line("STAY IN THE LOOP", 120, 1268, 30, "#1c2a31", 800)}
  ${line("Updates and announcements", 120, 1308, 24, "#df5143", 700)}
  ${line("#VECTORSSUMMIT", 700, 1268, 26, "#df5143", 800)}
</svg>`;
}

function deepWorkSvg() {
  const cards = [
    ["01", "Plan Your Focus", "Pick one priority. Time block it. Define done."],
    ["02", "Start Strong", "Remove distractions. Use a focus timer."],
    ["03", "Recover To Go Deeper", "Take a break. Get light. Hydrate. Close well."],
    ["04", "Deep Day Checklist", "Priority chosen. Block scheduled. Session completed."]
  ];
  const cardSvg = cards.map((card, index) => {
    const y = 650 + index * 300;
    return `
  ${roundedRect(86, y, 908, 230, "#ffffff", "#dfe7d9", 8)}
  <circle cx="150" cy="${y + 74}" r="42" fill="${index === 1 ? "#2d6a99" : index === 2 ? "#d19a17" : "#597d43"}"/>
  ${line(card[0], 132, y + 88, 38, "#ffffff", 800)}
  ${line(card[1], 230, y + 82, 42, index === 1 ? "#2d6a99" : index === 2 ? "#b87900" : "#456737", 800)}
  ${line(card[2], 230, y + 136, 28, "#526170", 500)}
  <line x1="230" y1="${y + 164}" x2="900" y2="${y + 164}" stroke="#d8e0d2" stroke-width="2"/>
  ${line("Rebuilt as real text and vector cards", 230, y + 204, 24, "#6e7b69", 600)}`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="2400" viewBox="0 0 1080 2400">
  ${roundedRect(0, 0, 1080, 2400, "#f7f3e7", "none", 0)}
  ${roundedRect(0, 0, 1080, 580, "#eef4df", "none", 0)}
  <circle cx="860" cy="120" r="210" fill="#dfe9d0"/>
  <circle cx="930" cy="228" r="132" fill="#9db887"/>
  ${line("MICRO", 78, 160, 104, "#2f4c25", 900)}
  ${line("HABITS", 78, 282, 104, "#2f4c25", 900)}
  ${line("FOR", 238, 380, 48, "#55733d", 800)}
  ${line("DEEP WORK", 78, 492, 84, "#172336", 900)}
  ${line("Small actions. Big focus.", 78, 560, 30, "#526170", 500)}
  ${cardSvg}
  ${roundedRect(86, 1884, 908, 260, "#ffffff", "#e1dfd6", 8)}
  ${line("SHALLOW DAY VS DEEP DAY", 316, 1948, 34, "#172336", 800)}
  ${roundedRect(170, 1995, 320, 26, "#b7c9db", "none", 6)}
  ${roundedRect(590, 1995, 320, 26, "#91a970", "none", 6)}
  ${line("Shallow Day", 266, 2016, 18, "#172336", 700)}
  ${line("Deep Day", 704, 2016, 18, "#ffffff", 700)}
  ${line("Many tasks, little progress", 176, 2074, 24, "#526170", 500)}
  ${line("Fewer tasks, real progress", 590, 2074, 24, "#526170", 500)}
  ${line("Constant context switching", 176, 2118, 24, "#526170", 500)}
  ${line("Long blocks of focus", 590, 2118, 24, "#526170", 500)}
  ${line("This example demonstrates confirmed text, vector cards, and a 4K-safe long PNG export.", 86, 2286, 24, "#ffffff", 500)}
  ${roundedRect(0, 2220, 1080, 180, "#55733d", "none", 0)}
</svg>`;
}

function productSvg() {
  const featureChips = ["Cold for 24 hours", "UV-C cap", "20 oz | Leakproof"]
    .map((item, index) => {
      const y = 690 + index * 70;
      return `${roundedRect(72, y, 430, 48, "#f8fffb", "none", 8)}${line(item, 102, y + 34, 28, "#14202b", 700)}`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <clipPath id="productCrop"><rect x="610" y="120" width="330" height="780" rx="8"/></clipPath>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#00666b"/>
      <stop offset="0.58" stop-color="#00a5a4"/>
      <stop offset="1" stop-color="#f36d57"/>
    </linearGradient>
  </defs>
  ${roundedRect(0, 0, 1080, 1080, "url(#bg)", "none", 0)}
  <circle cx="920" cy="720" r="380" fill="#f36d57" opacity="0.86"/>
  <image href="../original.png" x="46" y="50" width="1086" height="1086" clip-path="url(#productCrop)" preserveAspectRatio="none"/>
  ${line("AEROSIP", 74, 164, 88, "#ffffff", 900)}
  ${line("GO", 74, 286, 132, "#ff7b63", 900)}
  ${line("Self-cleaning bottle", 78, 358, 38, "#e9feff", 800)}
  ${roundedRect(72, 420, 430, 236, "#ff785f", "#ffd4ca", 8)}
  ${line("LAUNCH OFFER", 128, 482, 32, "#ffffff", 800)}
  ${line("$49", 126, 604, 116, "#ffffff", 900)}
  ${line("Was $69", 330, 604, 32, "#ffe4de", 700)}
  ${featureChips}
  ${roundedRect(72, 930, 430, 86, "#ff785f", "#ffd4ca", 8)}
  ${line("SHOP NOW", 174, 986, 44, "#ffffff", 900)}
  ${line("aerosip.example", 650, 950, 28, "#ffffff", 800)}
  ${line("Offer ends Sep 30, 2026. US only.", 622, 994, 22, "#f8fffb", 500)}
</svg>`;
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

function main() {
  for (const item of cases) {
    const dir = path.join(ROOT, "examples", item.slug);
    const out = path.join(dir, "output");
    fs.mkdirSync(out, { recursive: true });

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
      "Original small text is treated as unreliable AI raster text."
    ], ROOT);

    write(path.join(out, "source.svg"), item.svg());
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
      path.join(dir, "detail-comparison.png")
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
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
