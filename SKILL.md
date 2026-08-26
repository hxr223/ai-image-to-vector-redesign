---
name: ai-image-to-vector-redesign
description: Finish flattened GPT Image 2 design outputs by rebuilding text and layout into sharp, editable SVG/PDF/high-resolution PNG deliverables. Use for AI-generated posters, long images, infographics, flyers, social cards, and marketing graphics when upscaling or tracing would not fix blurry text or layout artifacts.
---

# AI Image To Vector Redesign

Use this skill when the user wants a GPT Image 2 output or similar AI-generated design made clearer, editable, scalable, or suitable for real publishing.

This is a design reconstruction workflow, not a generic vectorizer. Treat the source image as a visual reference for a new maintainable artwork source.

## Core Promise

GPT Image 2 can produce beautiful flattened concepts. This skill turns those concepts into publish-ready deliverables by rebuilding the parts that need to be crisp and editable:

- Retype important text as real text or clean outlines.
- Redraw layout elements as vector shapes.
- Preserve complex image regions as embedded raster assets when vector tracing would degrade them.
- Export practical files for publishing, sharing, review, and future edits.

## First Inspection

Before rebuilding, inspect the source image and name the delivery risks that matter:

- Flattened or blurry text, fake glyphs, malformed small copy, or uncertain numbers.
- Cards, borders, badges, icons, charts, and separators that are visually present but not editable.
- Photos, product renders, painterly backgrounds, or complex illustrations that should remain raster.
- Extra white borders, cropping issues, poor aspect ratio, or low-resolution output.
- The likely publishing channel: chat app, WeChat, Enterprise WeChat, Xiaohongshu, social feed, client PDF, print, or archive.

If the image is not a GPT Image 2 output but has the same flattened AI-design problems, apply the same judgment.

## Text Accuracy

Do not claim correctness from blurry AI-generated pixels. When text matters, follow [references/text-confirmation.md](references/text-confirmation.md):

- Extract or draft the visible text.
- Mark unreadable, suspicious, or low-confidence regions.
- Ask the user to confirm final copy before rebuilding those regions.
- Use only confirmed text for final deliverables.

If the user explicitly says the exact text does not matter, state that assumption in the delivery notes.

## Reconstruction Strategy

Choose the least noisy strategy for each region:

- Use vector text and shapes for headings, body copy, labels, cards, borders, lines, simple icons, badges, bullets, arrows, charts, and repeated layout elements.
- Use embedded raster assets for photos, product images, painterly backgrounds, detailed illustrations, complex logos, and visual regions that do not need editing.
- Use a hybrid result when the design combines editable text/layout with complex background imagery.
- Avoid full-image vector tracing for AI posters or scenic backgrounds; it usually creates noisy paths and does not fix text.
- Prioritize readable, non-overlapping text over pixel-perfect imitation of malformed source details.

## Expected Output Package

When producing files, prefer a stable package:

- `source.html` or `source.svg` as the maintainable source.
- `editable.svg` for editability and archive.
- `publish-3x.png` for chat, social, and mobile publishing.
- `print.pdf` for client review or print.
- `qa-report.md` describing the reconstruction, confirmed text status, export preset, and final checks.

Choose platform settings from [references/export-presets.md](references/export-presets.md) when the user gives a delivery channel.

## Workflow

1. Inspect the image dimensions, content type, text risk, and delivery channel.
2. Confirm final text when accuracy matters.
3. Decide which regions are vector reconstruction and which remain embedded raster.
4. Rebuild the artwork with maintainable SVG or HTML/CSS that can export SVG/PNG/PDF.
5. Export the chosen deliverables with the correct aspect ratio and scale.
6. Run the visual checks in [references/qa-checklist.md](references/qa-checklist.md) before presenting the result.

## Export Notes

When using Chrome headless to export high-resolution PNG from an SVG, keep the viewport at the artwork's CSS pixel size and scale the device pixel ratio. Do not merely enlarge the viewport, because that can create a larger canvas with unused white space.

Example:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --force-device-scale-factor=4 \
  --screenshot=/path/to/output-4x.png \
  --window-size=1024,1535 \
  file:///path/to/source.svg
```

This turns a `1024 x 1535` artwork into a `4096 x 6140` PNG without adding side whitespace.

For PDF, print the SVG or HTML source directly from the browser when native vector output is acceptable. Embedded photos remain raster inside the PDF.

## Delivery Language

Be explicit about what is actually vector:

- Say "text and layout are vector; photo/background areas are embedded raster" for hybrid work.
- Say "this fixes blur by reconstruction, not by recovering the original pixels" when explaining the method.
- For chat platforms, recommend the high-resolution PNG as the practical delivery file and PDF/SVG as source or print files.
