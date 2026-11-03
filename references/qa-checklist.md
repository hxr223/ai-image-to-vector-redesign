# QA Checklist

Run these checks before presenting final deliverables. The goal is to catch ordinary publishing failures before the user sees them.

## Composition Checks

- The full design renders and is not blank.
- No important content is cropped.
- There are no accidental outer white borders.
- Embedded raster assets appear in the exported files.
- The final aspect ratio matches the intended delivery channel.

## Fidelity Checks

- Full-canvas before/after comparison exists, not only a convenient detail crop.
- Background, illustration extent, separate frames, alignment and text direction are preserved in faithful-repair mode.
- Texture/effects and font substitutions are explicitly reviewed; unresolved changes mean partial/failed fidelity.
- Region manifest was fixed before repair; unexpected outside-region changes were investigated.
- File validity, text accuracy and visual fidelity are reported separately. Automated package checks cannot approve visual quality.

## Text Checks

- Important text uses confirmed copy when accuracy matters.
- Text does not overflow its container.
- Line breaks are intentional.
- Small text remains readable in the high-resolution PNG.
- No blurry source-text ghosts remain behind rebuilt text.

## Vector/Raster Checks

- Rebuilt text and layout elements are vector when promised.
- Photos, product renders, painterly backgrounds, and complex illustrations are honestly described as embedded raster.
- No full-image vector trace was used as a fake editable result for complex AI designs.

## Export Checks

- PNG resolution matches the requested scale, such as 3x.
- `publish-4k.png` has a long edge of at least 4096px when 4K was requested.
- PDF opens and keeps vector text/shapes sharp where applicable. Browser filters may rasterize text: inspect PDF font/path/image structure before promising vector text. SVG editability alone does not prove PDF editability.
- SVG or HTML source references local assets correctly.
- File names match the expected output package.

Use `scripts/qa_artwork.js` for mechanical package checks. It writes `qa-mechanical.json` and `qa-mechanical.md`, never the manual `qa-report.md`:

```bash
npm run qa -- output --min-long-edge 4096 --require publish-4k.png,print.pdf
```

Use `scripts/compare_images.js` to create problem crops and before/after detail comparisons:

```bash
npm run compare -- original.png output/publish-3x.png --crop 80,760,860,220
```

## QA Report Template

```md
# QA Report

## Reconstruction Summary

- Vector rebuilt:
- Embedded raster:
- Confirmed text status:
- Export preset:

## Checks

- Full render:
- Borders/cropping:
- Text overflow:
- Asset loading:
- PNG scale:
- PDF/SVG:

## Notes

```
