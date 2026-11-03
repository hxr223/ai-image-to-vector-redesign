# Faithful repair

Use original image pixels as the coordinate system. `source.width/height` must equal the decoded image dimensions; `rect` is [x,y,width,height]. Preview coordinates must be converted by originalWidth/displayWidth and originalHeight/displayHeight, then verified with the numbered annotation. Do not repeatedly estimate crop positions from a resized screenshot.

Create regions before altering pixels, and keep the manifest fixed during evaluation. Regions should tightly enclose text interiors plus necessary antialiasing margin, not whole decorative frames. Each entry maps one text block to its intended copy; `textRect` optionally identifies the smaller glyph area within the allowed repair rectangle.

```json
{
  "mode": "faithful-repair",
  "source": {"width": 1080, "height": 1440},
  "regions": [
    {"id": "plaque-1", "rect": [300,400,100,100],
     "text": "龘", "direction": "horizontal",
     "treatment": "local-clean-and-retype", "material": "gold foil"}
  ]
}
```

Run:

```sh
node scripts/review_regions.js original.png regions.json output/review
node scripts/review_regions.js original.png regions.json output/review output/publish-1x.png
npm run compare -- original.png output/publish-4k.png --full --out-compare output/comparison.png
```

The helper validates bounds and dimensions, produces numbered regions, and optionally checks changes outside allowed regions after normalizing the result to source size. It reports a pixel-difference diagnostic, NOT a visual-fidelity score. Resampling, compression and color conversion can create differences. A failed outside-region check needs investigation; a pass still needs text, material and composition review. Do not enlarge allowed regions to excuse a changed design.

For cleaning, use flat fills only on genuinely flat text interiors. For textured or intersecting backgrounds, use a local repair or available image-editing tool, then composite ONLY the declared region back onto the original. Never use a newly generated whole image as the repaired background. Inspect repaired interiors for seams, ghosts and damage to illustration. If tools cannot preserve the area, deliver it as unresolved instead of claiming success.

Retype each block in place. Match type category, weight, spacing, orientation and effect; gold can use an SVG text mask filled with a texture. If the font/effect cannot be matched, mark fidelity partial. Preserve separate plaques, dividers and decorative frames. Existing correct text may remain raster if outside the requested editable scope; disclose this clearly.

Review: full canvas side by side first; each repaired text region at readable scale next; untouched details last. Report file validity, text accuracy and visual fidelity separately. A reformatted layout requires redesign mode and must not be labelled faithful repair.
