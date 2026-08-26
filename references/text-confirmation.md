# Text Confirmation

AI-generated design text can be visually plausible without being reliable. Treat important text as content that must be confirmed, not as pixels to recover.

## When Confirmation Is Required

Ask for user confirmation when the design includes:

- Names, titles, dates, prices, phone numbers, addresses, URLs, QR-code labels, legal copy, medical or financial claims, or brand wording.
- Small text that is blurry, compressed, malformed, or partially hidden.
- Chinese, mixed-language, numeric, or table-like content that the model might misread.
- Any copy that will be printed, published, sent to clients, or reused as a template.

## Workflow

1. Draft a text list from the visible image.
2. Mark uncertain regions with plain labels such as `unreadable`, `low confidence`, or `looks like fake glyphs`.
3. Ask the user to confirm the final copy or provide replacement text.
4. Rebuild with confirmed text only.
5. Record the confirmation status in `qa-report.md`.

## Delivery Note Language

Use direct wording:

```text
Text was rebuilt from user-confirmed copy.
```

or:

```text
Some text was visually approximated because exact copy was not provided.
```

Do not say text was recovered from the image unless the source text was genuinely clear enough to read.
