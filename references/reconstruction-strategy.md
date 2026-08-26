# Reconstruction Strategy

Choose reconstruction by region. Do not use one method for the whole image unless the image is genuinely simple.

## Rebuild As Text

Use real editable text or clean text outlines for:

- Titles, subtitles, body copy, labels, captions, buttons, prices, dates, names, and legal copy.
- Text that must survive 3x or 4K export.
- Text the user may edit later.

Use confirmed copy whenever correctness matters.

## Redraw As Vector

Use SVG or HTML/CSS vector-like structure for:

- Cards, borders, panels, separators, ribbons, badges, bullets, arrows, simple icons, simple charts, and geometric decorations.
- Repeated visual elements that should align cleanly.
- Background blocks and color fields that can be described with shapes or CSS.

## Preserve As Raster

Use embedded raster assets for:

- Photos, product renders, painterly backgrounds, scenic AI art, detailed illustrations, complex logos, and high-texture regions.
- Areas that are visually important but do not need independent editing.

## Avoid

- Full-image vector tracing for complex AI posters.
- Inventing exact copy from blurry pixels.
- Covering old text with opaque patches while leaving visible source-text ghosts.
- Exporting a large PNG without checking whether the source layout actually rendered at the intended size.
