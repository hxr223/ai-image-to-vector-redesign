# Delivery Diagnosis

Use this checklist before rebuilding a GPT Image 2 design. The goal is to explain why the original flattened image is not yet publish-ready and what kind of reconstruction is needed.

## Visual Risks To Name

- Blurry, fake, malformed, or low-confidence text.
- Small text likely to fail after chat or social-platform compression.
- Important numbers, dates, prices, names, or claims that need confirmation.
- White borders, unintended margins, or cropped edges.
- Layout elements that look designed but are not editable: cards, badges, rules, labels, arrows, simple charts, and icons.
- Complex imagery that should remain raster: photos, product renders, painterly scenes, detailed logos, and dense illustrations.

## Dimension And Export Risks

Use `scripts/inspect_image.js` for a quick metadata pass:

```bash
npm run inspect -- input.png
```

The script reports dimensions, aspect ratio, long edge, and likely export risk. Treat it as mechanical evidence, not as a replacement for visual inspection.

## Diagnosis Summary Format

```text
Source:
Likely source type:
Publishing target:
Main risks:
Text confirmation needed:
Vector reconstruction:
Embedded raster:
Recommended outputs:
```
