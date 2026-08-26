# AI Image To Vector Redesign

GPT Image 2 can create beautiful flattened designs. This skill turns them into sharp, editable, publish-ready SVG/PDF/PNG deliverables by rebuilding text and layout instead of upscaling pixels.

## The Problem

AI-generated posters, flyers, infographics, and social graphics often look good at first glance, but they are still flattened raster images.

Common delivery problems include:

- Text is baked into pixels, so typos, dates, prices, names, and legal copy are hard to fix.
- Small text may look acceptable in chat, but becomes blurry after social-platform compression.
- Cards, borders, icons, charts, badges, and separators are not editable design objects.
- Regenerating the image to fix one word can change the entire composition.
- The final image is often not ready for print, client review, or platform-specific publishing.

## What This Skill Does

This is not a tracing or upscaling workflow.

The source image is treated as a visual reference. The skill reconstructs the design as maintainable artwork:

- Important text is retyped as real editable text or clean outlines.
- Layout elements are redrawn as vector shapes.
- Photos, painterly backgrounds, product renders, and complex illustrations are preserved as embedded raster assets.
- Practical delivery files are exported for publishing, sharing, and editing.

## Output Package

A complete reconstruction should produce:

- `source.html` or `source.svg` as the maintainable source.
- `editable.svg` for editing and archive.
- `publish-3x.png` for chat, social, and mobile publishing.
- `print.pdf` for review and print.
- `qa-report.md` explaining what was rebuilt, what remains raster, and what was checked.

## Usage

Install this folder as a Codex or Claude-compatible skill, then ask the agent to rebuild a GPT Image 2 design:

```text
Use ai-image-to-vector-redesign to turn this GPT Image 2 poster into a publish-ready SVG/PDF/high-resolution PNG package.
```

When text accuracy matters, provide the final copy or confirm the agent's extracted text before reconstruction.

## How It Differs From Upscaling Or Tracing

Upscaling makes the pixels larger. It does not make fake or blurry text trustworthy.

Vector tracing converts pixels into paths. It can be useful for simple logos or icons, but it usually creates noisy paths for AI posters and still leaves text difficult to edit.

This skill rebuilds the design semantically: text becomes text, layout becomes vector structure, and complex image regions remain raster when that preserves quality.

## Examples

See [examples/README.md](examples/README.md) for the case format. Each example should show the original GPT Image 2 output, problem crops, rebuilt result, detail comparison, exported files, and QA notes.

## Roadmap

- GPT Image 2 delivery-risk diagnosis.
- Confirmed text workflow.
- Layered vector/raster reconstruction strategy.
- Stable output package.
- Platform export presets.
- Automatic QA checklist.
- Before/after example cases.
- Lightweight export and QA scripts.
