# Code-screenshot-heavy WeChat articles

Use this recovery pattern when a WeChat article teaches CSS, UI implementation, terminal usage, or another topic where most examples are screenshots rather than selectable text.

## Recovery sequence

1. Extract ordered `text` and `image` events from the public article container.
2. Download every candidate正文 image to a temporary directory and verify signatures and dimensions.
3. Build one numbered contact sheet to classify the whole sequence:
   - comparison/hero figures;
   - code screenshots;
   - information diagrams;
   - decorative or footer interaction strips.
4. Use the contact sheet only for classification. Open each code screenshot at full resolution for exact transcription; do not OCR code from a reduced contact sheet.
5. Preserve every argument-bearing screenshot locally and place it at its original point in the note. Add a fenced code block immediately after the figure so the example remains searchable and copyable.
6. For information diagrams, add a compact searchable transcription of the hierarchy, comparison, labels, and conclusion. Do not guess unreadable microcopy.
7. Remove footer interaction artwork only when its DOM position and surrounding closing text identify it as non-article content. Do not filter merely because an image is short or decorative-looking.

## Code transcription rules

- Preserve selectors, comments, custom-property names, units, punctuation, and numeric values exactly.
- Keep modern syntax such as `rgb(15 23 42 / 0.08)` rather than silently rewriting it to legacy syntax.
- If a character is genuinely unreadable, mark it as unresolved in working notes instead of inventing code. Resolve from surrounding prose only when the article itself provides the same snippet.
- The Markdown code block is a searchable transcription of the source screenshot, not an independently tested replacement. Do not “improve” the author’s code during intake.

## Image accounting

Record both the raw and filtered counts:

```text
DOM candidate images = retained正文 images + explicitly filtered footer/noise images
retained正文 images = local attachment files = Markdown embeds
```

Also verify:

- every embed resolves to a local file;
- every file has a valid PNG/JPEG/GIF signature;
- no WeChat media host remains in the note;
- code screenshots and information diagrams have searchable text nearby;
- the final narrow scan reports no footer-interaction phrases.

A typical valid result may be `16 DOM candidates = 15 retained + 1 footer strip`, followed by `15 local files = 15 embeds`. The numbers are examples, not fixed expectations.