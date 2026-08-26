# Export Presets

Choose the export target based on where the final design will be used. When the user does not specify a channel, provide a general high-resolution PNG plus editable SVG and PDF.

## General Rules

- Keep the artwork viewport at the intended CSS pixel size.
- Increase PNG resolution with device scale factor or equivalent raster scale.
- Avoid adding outer whitespace during export.
- Inspect the final exported file, not only the source SVG or HTML.

## Common Presets

### General Publish PNG

Use for ordinary sharing or uploads when no platform is specified.

- Export: `publish-3x.png`
- Scale: 3x or higher when text is small.
- Also provide: `editable.svg`, `print.pdf`.

### WeChat Or Enterprise WeChat Long Image

Use for long posters, notices, training material, and internal sharing.

- Export a high-resolution PNG.
- Keep text large enough to survive mobile compression.
- Prefer PNG as the practical delivery file.
- Provide SVG/PDF as source or archive files.

### WeChat Article Inline Image

Use for article graphics and section images.

- Export a crisp PNG at the intended article width.
- Avoid tiny captions and dense text.
- Check that the exported image has no extra top or side border.

### Xiaohongshu Post

Use for social graphics that need strong mobile readability.

- Prefer 3:4, 4:5, or square formats when the user asks for social posting.
- Keep titles and key details readable on a phone.
- Export PNG at 3x or higher.

### Presentation Cover

Use for slide covers or webinar cards.

- Prefer 16:9 unless the user provides another size.
- Export PNG for insertion into decks.
- Provide PDF/SVG when the user needs editing or review.

### A4 Print PDF

Use for print, handouts, or formal review.

- Export PDF from SVG/HTML so text and vector shapes remain sharp.
- Embedded photos remain raster.
- Also export a PNG preview for quick inspection.
