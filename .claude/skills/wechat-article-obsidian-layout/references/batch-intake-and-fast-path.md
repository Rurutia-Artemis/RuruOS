# Batch Intake and Fast Path

Use this reference when the user sends multiple WeChat Official Account links or asks why one article takes a long time. Preserve quality while avoiding routine per-image/per-step overhead.

## Intake behaviour

- Acknowledge each link briefly so the user can keep sending; do not make them wait for one article before sending the next.
- Deduplicate by `source_url` / `dedup_key` before extraction.
- Independent links may be processed concurrently, up to the runtime's safe concurrency limit (normally 3). Keep final verification per note explicit.
- In WeChat, report only meaningful milestones: received, blocked/needs input, completed. Do not narrate routine fetch/download/readback calls.

## One-fetch fast path

1. Fetch the public page once with no login, cookies, QR scan, or account action.
2. In the same parse, collect title, account/author, publication timestamp, source URL, body blocks, section headings, ordered image URLs, and page-type markers.
3. Choose the page branch:
   - Rich-text article: `#js_content`; recover text/heading order and `img[data-src]`.
   - Image-card/carousel: no `#js_content`, but `share_content_page`, `item_show_type: '8'`, or `picture_page_info_list`; use meta description plus ordered card images.
4. Batch-download main images to the RuruOS attachment domain allowed by live `AGENTS.md`.
5. Use vision selectively:
   - Required for image-led cards, diagrams, screenshots carrying facts, and ambiguous images.
   - Optional for decorative images or screenshots whose role is already established by surrounding text.
   - Never spend one vision call per image by habit; group or infer only when evidence is sufficient.
6. Render the note once, then run one verification pass: schema fields, dedup key, image embed count, missing files, official/source links, footer noise, and body completeness.

## Image filtering

Keep:

- Images inside the article's content sequence that contribute evidence or reading rhythm.
- `picture_page_info_list[].cdn_url` entries for image-card posts.

Discard:

- `og:image` cover when it duplicates article content.
- Account avatars, QR images, follow/like/share graphics, sponsor cards, recommendation cards.
- Nested `watermark_info.cdn_url` assets and UI chrome.

## Completion reply

Keep the WeChat reply compact:

```text
已处理：<标题>
位置：<RuruOS 相对路径>
图片：<N> 张已本地化；广告/二维码已清理
```

Mention exceptional handling only when relevant, e.g. “本篇为图片卡片页，已把图中文字转成可搜索表格/代码块”。

## Verification rule

Faster processing must not weaken completion criteria. Never report success until the final Markdown exists, all referenced local images exist, and incomplete/blocked content is clearly routed according to the live RuruOS schema.
