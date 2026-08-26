# QA Checklist

Run these checks before presenting final deliverables. The goal is to catch ordinary publishing failures before the user sees them.

## Composition Checks

- The full design renders and is not blank.
- No important content is cropped.
- There are no accidental outer white borders.
- Embedded raster assets appear in the exported files.
- The final aspect ratio matches the intended delivery channel.

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
- PDF opens and keeps vector text/shapes sharp where applicable.
- SVG or HTML source references local assets correctly.
- File names match the expected output package.

Use `scripts/qa_artwork.js` for mechanical package checks:

```bash
npm run qa -- output --min-long-edge 4096 --require publish-4k.png,print.pdf
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
