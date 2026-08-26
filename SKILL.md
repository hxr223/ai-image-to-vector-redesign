---
name: ai-image-to-vector-redesign
description: Rebuild AI-generated raster designs into sharp deliverables by retyping text, redrawing layout elements as vectors, and exporting SVG/PDF/high-resolution PNG. Use when simple upscaling would not fix blurry text or layout artifacts.
---

# AI Image To Vector Redesign

Use this skill when the user wants an AI-generated image, poster, infographic, flyer, long image, or screenshot-like design made clearer, editable, scalable, or suitable for print/social sharing.

## Core Judgment

Treat the source image as a visual reference, not as recoverable source artwork.

- Blurry or malformed text should be retyped as real text or converted to clean text outlines; do not promise to restore it from pixels.
- Flat layout elements such as cards, borders, icons, charts, separators, bullets, badges, ribbons, and decorative line art should usually be redrawn as SVG/vector shapes.
- Photographic, painterly, or highly textured areas should usually remain raster, be cropped/cleaned, be replaced with a higher-resolution source, or be regenerated. Do not force full-image vector tracing when it will create noisy paths.
- For messaging apps or platforms with poor SVG support, export a high-resolution PNG from the vector source. For print or review, also provide PDF when useful.

## Workflow

1. Inspect the image dimensions, content type, and likely delivery channel. Explain any platform limitation, such as chat apps rasterizing or compressing SVG previews.
2. Ask for or extract final text when text accuracy matters. If the image text is AI-generated or blurry, require user-confirmed copy before claiming correctness.
3. Decide the reconstruction strategy:
   - Pure vector for simple diagrams, logos, icons, and text-heavy flat graphics.
   - Hybrid vector plus embedded raster for designs with photos, realistic backgrounds, product shots, or AI scenic areas.
4. Rebuild the design with a maintainable source file, preferably SVG or HTML/CSS that generates SVG/PNG/PDF. Match the original style closely but prioritize readable, non-overlapping text.
5. Export deliverables according to use:
   - `SVG` for editability/scalability.
   - `PDF` for print or file sharing.
   - High-resolution `PNG` for WeChat, Enterprise WeChat, social apps, or places that only accept bitmap images.
6. Visually inspect the result at full composition scale and at text-detail scale. Fix white borders, cropped content, text overlap, accidental source-text ghosts, and layout shifts before presenting it.

## Export Notes

When using Chrome headless to export high-resolution PNG from an SVG, keep the viewport at the artwork's CSS pixel size and scale the device pixel ratio. Do not merely enlarge the viewport, because that can create a larger canvas with unused white space.

Example:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --force-device-scale-factor=4 \
  --screenshot=/path/to/output-4k.png \
  --window-size=1024,1535 \
  file:///path/to/source.svg
```

This turns a `1024 x 1535` artwork into a `4096 x 6140` PNG without adding side whitespace.

For PDF, print the SVG/HTML source directly from the browser when native vector output is acceptable. Note that embedded photos remain raster inside the PDF.

## Delivery Language

Be explicit about what is actually vector:

- Say "text and layout are vector; photo/background areas are embedded raster" for hybrid work.
- Say "this fixes blur by reconstruction, not by recovering the original pixels" when explaining the method.
- For chat platforms, recommend the high-resolution PNG as the practical delivery file and PDF/SVG as source or print files.
