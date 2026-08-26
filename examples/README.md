# Examples

Each example should prove the value of reconstruction over upscaling or tracing.

## Recommended Case Structure

```text
case-name/
  original.png
  problem-crop.png
  rebuilt-preview.png
  detail-comparison.png
  output/
    source.html
    editable.svg
    publish-3x.png
    print.pdf
    qa-report.md
```

## What To Document

For each case, include a short note covering:

- What GPT Image 2 produced well.
- Why the original image was not publish-ready.
- Which text was confirmed or replaced.
- Which elements were rebuilt as vector.
- Which regions remain embedded raster.
- Which platform preset was used.
- What QA checks passed.

## First Case Targets

- Event poster with blurry or unreliable text.
- WeChat-style long infographic with small copy and cards.
- Product promotion card with a raster product render and editable layout text.
