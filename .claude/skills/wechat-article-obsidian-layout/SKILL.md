---
name: wechat-article-obsidian-layout
description: "Use when converting WeChat Official Account articles or public article snapshots into Obsidian notes with a visually faithful Chinese Markdown layout by default, even when the user only sends a link: source card, section rhythm, highlighted subheads, code blocks, article images/figures, ad removal, and concise article digestion."
version: 1.5.2
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [wechat, obsidian, markdown, article-layout, screenshots, chinese-notes]
    related_skills: [mia-wechat-intake, obsidian]
---

# WeChat Article → Obsidian Layout

## Overview

Use this skill when the user sends a WeChat Official Account article link, with or without screenshots, and wants the article moved into Obsidian with the same “感觉” as a well-formatted public account post.

The user's long screenshot is a **baseline style reference**, not a required future input. When the user only sends a public account link, infer the layout from the article itself and still produce a rich note.

The user has approved the current default presentation: source card, Mia summary,速读, clear Chinese section hierarchy, local images with captions, searchable transcription for infographic text, and removal of ads / QR / follow prompts. Apply it automatically to future links without asking for layout confirmation. In WeChat replies, acknowledge intake and report completion briefly; do not narrate routine processing.

Goal: produce an Obsidian Markdown note that is not a flat text dump. Preserve the article's reading rhythm: title, source card, intro, numbered sections, visual callouts, highlighted subheads, code blocks, article images/figures, figure captions, and a short Mia digestion layer. Remove ads and follow/QR/footer noise.

This is a **layout and digestion skill**, not a crawler. Use `mia-wechat-intake` for link intake / local snapshot, and `obsidian` for vault operations. For multiple links or speed-sensitive intake, load `references/batch-intake-and-fast-path.md`.

## When to Use

Use when:

- User sends `mp.weixin.qq.com/s/...` and wants it saved/read in Obsidian, even if they only send the link.
- User says “转到 Obsidian / 保存到 OB / 按公众号排版 / 同样的感觉”.
- A screenshot was provided as a one-time reference style; apply that baseline to future links without asking for another screenshot.
- Worker extraction produced flattened text and the article needs manual structure restoration.
- The article contains visual rhythms such as numbered sections, colored divider marks, highlighted mini-headings, diagrams, code screenshots, comparison blocks, inline images, or figure captions.

Do not use for:

- Pure archive-only article snapshots where the user does not care about readability.
- Private chat screenshots or non-article images.

Design-material routing after article intake:

- When the article's main subject is color palettes or gradient references, still use this Skill for the article conversion, then create an Obsidian handoff record under the existing `10-Projects/审美罗盘/` project for your design-review role/process by default (skip if you have none).
- When the article itself is a design, layout, theme-generator, or visual Skill case study, also create a concise handoff under the existing `10-Projects/审美罗盘/` project. Record the reusable mechanisms (for example theme variables, component libraries, mapping rules, and deterministic validation), but leave final Skill classification and governance to your design-review role.
- Treat palette material as `color_only` evidence for future color Skills; do not interpret it as a request to change the Obsidian theme.
- Mia may record the source, local assets, searchable HEX values, suggested families, and design mechanisms, but must not directly edit any machine-readable palette library owned by another role or make the final Skill-governance decision.
- If a handoff implies installing, executing, or security-testing a referenced repository, record that a dedicated security-review role (or the user) must perform the safety review / read-only PoC; article intake itself never installs the tool.
- Before creating a new handoff, search the existing project handoffs by repository URL, source topic, and reusable mechanism. When a new article covers the same repository or governance question, append it as a supplemental source and merge only the new evidence into the existing handoff instead of creating one handoff per article. Create a separate handoff only when the target owner, decision boundary, or reusable mechanism is materially different. Keep the source list explicit so consolidation never hides provenance.

## Batch Intake and Throughput

When the user sends many links, keep intake responsive without lowering completion quality:

- Acknowledge each link briefly and let the user continue sending; do not require one article to finish before accepting the next.
- Deduplicate first, then process independent links concurrently within the runtime's safe limit.
- Use the deterministic fast path: one public fetch, one structure/image parse, batch image download, selective vision, one note write, and one final verification pass.
- Do not run vision on every image by habit. Reserve it for image-led cards, diagrams, screenshots carrying facts, or ambiguous images; infer decorative or already-contextualized images only when evidence is sufficient.
- On WeChat, report only received, blocked/needs-input, and completed states. Do not narrate routine tool calls or every image check.
- Faster processing never relaxes the finish line: the Markdown file and every referenced image must exist before reporting success.
- Do not default every mechanical intake task to the strongest available model or highest reasoning usage. The user prefers tiered routing: use a balanced model at medium reasoning for Mia’s coordination and judgment, a lightweight model for routine single-article workers, and escalate only blocked extraction, mixed-media ambiguity, recovery, or cross-Agent decisions to the flagship tier. Keep the tiering principle — balanced model for coordination, lightweight for routine workers, flagship only for escalation — and map it to whatever lineup your platform currently offers.

See `references/batch-intake-and-fast-path.md` for page branches, image filtering, selective vision, and the compact completion reply. For durable queue state, bounded background workers, parent-side verification, recovery after a Gateway/session restart, topic-page expansion, and public-only Xiaohongshu intake, follow `references/bulk-intake-queue.md`. When a standalone Codex public-intake runner fails before or during source access, load `references/codex-public-intake-runner-recovery.md` to distinguish runner/config failures from true source blocking, apply safe per-run overrides, and preserve correct `completed` / `needs_review` / `failed` semantics. After every queue mutation, run `scripts/reconcile_content_queue.py` in read-only mode first, then rerun with `--write` if it reports drift, and finally rerun read-only to confirm `ok: true`. New minimal manifests must still include the reconciler's full summary dimensions (`received`, `unique`, `article_links`, `processing`, `pending`, `queued`, `completed`, `needs_review`, `failed`) and should use the canonical timestamp emitted by reconciliation; otherwise a manually created “completed” queue can remain structurally inconsistent even when its article artifact is valid. This prevents duplicate IDs/URLs, invalid statuses, mixed timestamp formats, and stale summary counts from accumulating.

## Required Inputs

Collect or derive:

1. `source_url` — original article URL.
2. `source_title`, `author`, `account`, `published_at` if available.
3. Extracted article text from Worker or public extraction.
4. Article layout details when available: visual hierarchy, blocks, captions, code blocks, inline images, diagram images, and ad/footer areas. Derive these from the page HTML / extracted assets first; use user screenshots only as optional reference evidence.
5. Target Obsidian note path under the user's vault.

If article extraction is blocked but screenshot is readable, build the note from screenshot-visible content and mark it for review using fields allowed by the current vault schema. If image download is blocked, keep image placeholders/captions and mark the failure in the body; do not silently drop important figures.

## RuruOS Writing Contract

The current canonical vault is `<你的 RuruOS vault 路径>`. Before writing, read `<你的 RuruOS vault 路径>/AGENTS.md`; that file overrides older examples in this Skill.

- Complete WeChat articles go to `20-Reading/Articles/`; failed or incomplete extraction goes to `20-Reading/Queue/`.
- Use the exact `article` frontmatter schema defined in `AGENTS.md`. Do not add legacy fields such as `schema_version`, `layout_style`, `platform`, or `extraction_status` to a completed article unless the current schema explicitly allows them.
- Save local images only in an attachment domain allowed by `AGENTS.md`. For AI/Agent/Skill/tool-list articles, use `99-Attachments/Mia/toolwatch/` and date-prefixed filenames.
- Any legacy vault is read-only. A Worker or reader output under another path may be used as temporary extraction evidence, but the final note and assets must be written only to RuruOS.
- Check `source_url` or `dedup_key` before creating a note. Count **unique matched note paths**, not raw matching lines: one valid article normally repeats the URL in `source_url`, `dedup_key`, and the source card. Before writing, zero unique paths justifies creation; one unique path means update that note; multiple unique paths require duplicate review. After writing, several line hits in one file still represent one canonical note. For WeChat URLs, prefer searching the stable `/s/<article-id>` token when an escaped full-URL regex returns an implausible zero; then inspect the matched file to confirm both `source_url` and `dedup_key` rather than treating the fallback search alone as proof.
- Preserve multi-party attribution without collapsing roles. When public metadata exposes an account and page author, while the body separately names an original author plus translator/editor/illustrator, keep the live-schema `author` field aligned with the public page author and list the other roles separately in the source card. If the body names an original source but the extracted `links` contain no original URL, preserve the attribution text and explicitly note the missing link; never guess or synthesize a URL.
- If the user identifies a queue item, job record, or snapshot as **read-only provenance** (for example, “do not edit queue item 17”), treat that record as immutable: read it only when needed and write the completed article/assets directly to canonical RuruOS locations. Snapshot the protected path's scoped status before work; afterward run scoped `git status --short -- <protected-path> <note> <attachments>` and `git diff -- <protected-path>`. Empty protected-path output proves untouched only when its baseline was also empty; otherwise compare against the recorded baseline rather than claiming a dirty file was unchanged from the final status alone.
- A dirty vault is not itself a blocker. Record the pre-existing dirty state, avoid unrelated files, and use scoped status/diff checks for the exact note and attachments created by this intake.

## Layout Principles

### 1. Keep a quiet Chinese-first note

Use Chinese headings and short labels. Avoid noisy English unless the article itself uses it.

Recommended top structure for the current RuruOS vault:

```markdown
---
type: article
title: "..."
source: wechat
source_url: "https://..."
author: "..."
category: ai-coding
status: unread
read_at: ""
rating: ""
dedup_key: "url:https://..."
added: 2026-07-15
---

# 文章标题

> [!info] 文章来源
> 公众号：...
> 作者：...
> 原文：...
> 发布时间：...

> [!abstract] Mia 摘要
> 一句话讲清文章核心。

## 速读
- 关键点 1
- 关键点 2
- 关键点 3

## 原文整理
...
```

Treat the schema example as illustrative only: resolve `category`, `added`, and every allowed field from the live `AGENTS.md`; never invent extra frontmatter keys.

### 2. Mimic WeChat visual rhythm in Markdown

Map visual elements like this:

| WeChat visual element | Obsidian Markdown equivalent |
| --- | --- |
| Red vertical bar before big section | `## 一、标题` plus a short opening paragraph; optionally add `> [!note] 本节要点` |
| Pink highlighted subhead | `### ==小标题==` or `<mark>小标题</mark>` |
| Dark code screenshot / code card | fenced code block with language when known |
| Diagram image | local attachment embed `![[path/to/image.png]]` plus `*图 1 · caption*` |
| Comparison before/after | two callouts: `> [!failure] 原来` and `> [!success] 优化后` |
| Source / author card | top `> [!info] 文章来源` |
| End ads / account QR / likes | omit unless user asks for a full visual archive |

### 3. Preserve section order, not pixel-perfect styling

Keep the original numbered sections and examples. Do not try to reproduce phone UI chrome, like/read counters, ads, or bottom recommendation cards in the main note.

If screenshots matter as evidence, save them as attachments and add a compact “截图参考” link near the top:

```markdown
> [!example] 截图参考
> ![[99-Attachments/Mia/<allowed-domain>/YYYY-MM-DD-example-long-screenshot.jpg]]
```

For very long screenshots, prefer a link line rather than embedding huge image inline:

```markdown
截图：[[99-Attachments/Mia/<allowed-domain>/YYYY-MM-DD-example-long-screenshot.jpg|长截图参考]]
```

## Transformation Workflow

1. **Extract publicly, then target RuruOS.** Use a public-only reader first. If the configured generic extractor is unavailable or returns empty content, use the provider-independent public HTML fallback in `references/ruruos-public-html-recovery-and-validation.md`; treat the fetch result, not extractor setup state, as evidence of whether the article is accessible. Before invoking the local Worker, check its reported `vault_path`; if it still points to the frozen old vault, do not enqueue a new write there. Use its reader output only as temporary evidence or use the public `wechat-article-reader` directly. Completion: readable source text exists without login/cookies, or the article is honestly marked blocked.
2. **Recover structure, metadata, and assets from the public HTML.** Flat readers may preserve text while losing headings, image order, emphasis, account metadata, publication time, and table boundaries. Inspect the WeChat `#js_content` container, recover `data-src` images in document order, and map visible headings/numbered labels back to Markdown. For modern pages, parse `window.cgiDataNew` as a JavaScript object shape rather than assuming strict JSON; follow `references/ruruos-public-html-recovery-and-validation.md` for single-quoted fields, article-scoped metadata, time fallbacks, semantic footer truncation, and conflicting share metadata. A stale or unrelated `og:description` must not override a coherent `og:title` plus complete `#js_content`; use the title and full body as canonical, and record the mismatch in `来源与备注`. When BeautifulSoup/lxml is unavailable, run the standard-library helper `scripts/extract-public-wechat-html.py INPUT.html OUTPUT.json`; it emits metadata, account/publication fields, ordered text/image events, and article links. Exit code `2` deliberately hands off to the image-card or blocked-page branch: if the public HTML has `item_show_type: '8'` plus `picture_page_info_list`, run `scripts/extract-public-wechat-image-card.py INPUT.html OUTPUT.json`. That helper decodes literal `\\xHH` description escapes without damaging Chinese text, parses article-level `cgiDataNew`, uses bracket balancing, and emits exactly one first-level `cdn_url` per card so nested watermark URLs are excluded. Dense runs of short `section` events may be flattened table cells rather than headings or bullets; reconstruct them only when repeated column patterns are supported by nearby prose or images, following `references/rich-text-table-recovery.md`. Completion: title, source URL, author/account, publication time when public, raw content, ordered image list, section boundaries, and recoverable tables are visible.
3. **Infer the original article layout.** Identify title, section headings, highlighted subheads, diagrams, code blocks, figure captions, and footer/ad areas from the article itself. If a user screenshot exists, use it only as style reference. Completion: a short list of layout features is available.
4. **Create or rewrite the Obsidian note.** Keep YAML fields, then replace the flat dump with a rich Markdown structure. Completion: note body has source card, Mia summary,速读,原文整理, article images/figure captions, and preserved section hierarchy.
5. **Attach article images.** Download public article images into the attachment domain permitted by the live RuruOS `AGENTS.md`; use `99-Attachments/Mia/toolwatch/` for AI/Agent/Skill/tool articles, with date-prefixed filenames. Embed each image near its original paragraph and add a concise evidence-based caption. Completion: the final note references local RuruOS attachments, not WeChat hotlinks, cache paths, or the frozen old vault.
6. **Verify.** Read back the note (first 150 lines plus the remainder) and run the deterministic checker in `scripts/verify_ruruos_wechat_note.py`. It validates the article frontmatter shape, source URL/dedup key, required rich-layout sections, local image existence and PNG/JPEG/GIF signatures, absence of WeChat hotlinks, and common footer noise. Then parse the frontmatter with a real YAML parser; the deterministic key/order checks are not a YAML syntax parser. Preserve source GIFs as GIF by default rather than converting solely for verification. See `references/animated-media-and-yaml-verification.md` for the dependency-free macOS YAML command, GIF signature/frame checks, and completion criteria. Example:

```bash
python3 scripts/verify_ruruos_wechat_note.py \
  --vault <你的 RuruOS vault 路径> \
  --note '20-Reading/Articles/<标题>.md' \
  --source-url 'https://mp.weixin.qq.com/s/<id>' \
  --expected-images 4
```

For image-heavy comparison articles, verify a three-way count: filtered DOM正文图数 = downloaded local files = Markdown embeds. When the first image is a comparison montage followed by one screenshot per variant, preserve the montage and every individual result, map them by DOM order, and add searchable captions/transcriptions for both the overview and each variant.

For CSS/UI/tutorial articles dominated by code screenshots, follow `references/code-screenshot-heavy-articles.md`: classify the full sequence with a numbered contact sheet, transcribe code only from full-resolution images, preserve exact syntax in fenced blocks, add searchable diagram text, and account for raw DOM candidates separately from explicitly filtered footer images.

For image-card listicles, keep **visible card text** and **metadata-supplied canonical names** distinct. Transcribe the card wording faithfully in a searchable block; if the public description supplies an English Skill/tool slug that is absent from the image, use it in the structured heading but explicitly label it as coming from the public summary. Do not silently replace awkward visible wording, turn a translated card label into a repository name, or imply that statistics on the card were independently verified. If full repository URLs are missing, preserve the generic install pattern but state that it is not directly reproducible without repository lookup.

After the checker passes, run a narrow final scan for remote image Markdown, WeChat media hosts, and footer interaction phrases. Scope footer-noise judgment to article content rather than treating a provenance sentence such as “已去除互动推广话术” as leaked footer content; phrasing the provenance generically also avoids false positives in simpler scanners.

If an important screenshot is visibly cropped, separate what is directly readable from what the surrounding article text supplies, and state that provenance in `来源与备注` rather than silently presenting reconstructed details as fully visible OCR.

### Public page-type recovery

WeChat exposes at least two public article shapes: normal rich-text pages and image-card/carousel pages. Detect the page shape before extracting; do not treat a short meta description as a complete article when the real content lives in images.

Load `references/wechat-public-page-types.md` for the exact signals, public-only extraction branches, main-image selection rules, escape decoding, vision-to-Markdown mappings, and completion checks. For normal rich-text pages whose reader output lacks account metadata, images, or a trustworthy body endpoint, also load `references/ruruos-public-html-recovery-and-validation.md` for `window.cgiDataNew` metadata recovery, semantic footer cutoffs, duplicate-image handling, and deterministic RuruOS verification.

## Article Digestion Rules

Always include:

- `Mia 摘要` — 1-3 sentences.
- `速读` — 3-6 bullets.
- `原文整理` — structured article content in original order.
- Article images / diagrams that are part of the main argument, saved as local attachments when possible.
- `可复用结论` — only if the article has reusable workflow/design/skill lessons.
- `来源与备注` — source link, image/screenshot attachment references, extraction status.

Always remove from the main note unless the user asks for a full archive:

- Ads, sponsor cards, paid-course blocks, QR codes, follow prompts, “点赞/在看/转发” prompts, bottom recommendation cards, and unrelated account promotion.

When the article is about Skills / Agents / workflows, also include:

```markdown
## 可复用结论
- 触发边界：...
- 指令层：...
- 资源层：...
- 验证方式：...
```

This helps later Skill updates without rereading the whole article.

## Formatting Template

```markdown
# {{title}}

> [!info] 文章来源
> 公众号：{{account}}
> 作者：{{author}}
> 原文：{{source_url}}
> 保存时间：{{created_at}}

> [!abstract] Mia 摘要
> {{one_sentence_summary}}

## 速读
- {{point_1}}
- {{point_2}}
- {{point_3}}

## 原文整理

## 一、{{section_1_title}}

{{section_1_body}}

> [!note] 本节要点
> {{section_1_takeaway}}

*图 1 · {{caption}}*

## 二、{{section_2_title}}

### =={{highlight_subhead}}==

{{body}}

```{{language}}
{{code_or_example}}
```

> [!failure] 原来
> {{before}}

> [!success] 优化后
> {{after}}

## 可复用结论
- {{reusable_lesson}}

## 来源与备注
- 原文：{{source_url}}
- 截图：{{screenshot_ref}}
- 提取状态：{{extraction_status}}
```

## Common Pitfalls

1. **Flat text dump.** Worker extraction often collapses headings, captions, images, and code. Restore structure manually from text + article layout evidence.
2. **Asking for screenshots every time.** The long screenshot is a baseline reference only. Future WeChat links should be richly formatted from the article itself whenever public extraction allows it.
3. **Dropping article images.** Diagrams, comparison images, and important inline figures should be saved locally and embedded near the relevant paragraph. If download fails, keep a clear placeholder and note the failure.
4. **Over-embedding reference screenshots.** Huge screenshots make Obsidian notes hard to read. Save them locally; link or embed only when useful.
5. **Keeping WeChat footer noise.** Likes, QR codes, ads, follow prompts, paid-course blocks, and recommendation cards are not article substance. Omit from the main note unless archiving the visual page.
6. **Breaking YAML with colons.** Quote titles and URLs with punctuation.
7. **Confusing source and digestion.** Keep `原文整理` separate from `Mia 摘要 / 可复用结论` so future review can distinguish article content from Mia's interpretation.
8. **Pretending blocked content was extracted.** If only screenshots were used, say so. Follow the live RuruOS `AGENTS.md`: incomplete captures belong in `20-Reading/Queue/` with only schema-allowed review markers; do not invent fields in a completed article.
9. **Trusting stale share metadata over the article body.** WeChat pages can expose an `og:description` or share summary left over from a different topic while `og:title` and a complete `#js_content` agree with each other. Do not retitle, misclassify, or reject the article from the description alone; use the coherent title + full body as canonical and disclose the mismatch in `来源与备注`.
10. **Converting GIFs just to satisfy the checker.** Preserve genuine article GIFs in their original format; APNG conversion can multiply attachment size. The verifier accepts PNG/JPEG/GIF signatures. Convert only for a demonstrated reader-compatibility need, then verify the output frame count.
11. **Treating frontmatter key checks as YAML parsing.** The deterministic verifier checks schema shape and key order but does not prove YAML syntax. Run a real parser before completion; use the Ruby Psych fallback in `references/animated-media-and-yaml-verification.md` when PyYAML is absent.
12. **Treating screenshot-era counters as live facts.** A title may round a metric (for example “5 万 Star”) while an embedded screenshot shows the exact count at capture time. Preserve the original title, transcribe the screenshot value as source-time evidence, and label the relationship explicitly; do not rewrite the article from a later live count or present screenshot metrics as independently verified.
13. **Rendering combined label-and-body headings as giant headings.** WeChat HTML often puts both the label and its paragraph in one `h3`, such as `为什么有效？ <body>`、`怎么抄到精髓？ <body>` or `硬核数据： <claim>`. Split the short label from the body: render the first two as highlighted mini-headings plus normal paragraphs, and render data claims as a `> [!quote] 文中数据（未独立核验）` callout. Never turn the entire claim into a highlighted heading.
14. **Assuming zero-padded brace expansion works on macOS.** The system Bash may expand `{01..12}` as `1 ... 12`, causing checks to silently miss files named `-01` through `-09`. For attachment verification and hashing, use a fixed-width glob such as `*-??.jpg`, enumerate paths from Markdown/JSON, or loop with `printf '%02d'`. Treat a partial decode/hash list as a failed verification and rerun before completion.
15. **Treating every footer-keyword hit as leaked footer noise.** A word such as `点赞` may occur in substantive article prose (for example, a micro-interaction example). Run the deterministic scanner, then inspect any narrow-scan hit in context; remove only actual footer/promotion content rather than deleting legitimate source material to force a zero count.
16. **Silently completing an incomplete enumeration.** An article may announce “六个域 / 十条原则” but explicitly name fewer items in the extracted body, while the accompanying screenshot also omits the full table. Count the named items before formatting. Preserve the source heading, do not invent the missing item, and disclose the mismatch in `来源与备注`. Likewise, distinguish fields directly visible in a screenshot from facts supplied only by surrounding prose; label each provenance instead of making the screenshot appear to prove more than it shows.
17. **Treating zero正文图片 as failed extraction.** A public WeChat page can contain a complete, coherent `#js_content` article while the filtered正文 image count is zero; this is a valid text-only article, not an extraction failure. Validate `content_chars`, ordered text events, title/account/time metadata, and the actual DOM image scope separately. Use `--expected-images 0`, report zero new attachments, and do not save cover/avatar/QR/interaction assets merely to make the note appear image-rich.
18. **Overstating “完整入库” after cleanup.** “完整” means all substantive article prose and structure are preserved, not that ads, recommendations, paid blocks, comment prompts, or account promotion remain. Keep the original section order and claims, remove footer noise, and state the removed-material classes plus any unverified source figures in `来源与备注`.

## Verification Checklist

- [ ] The note has valid YAML frontmatter matching the live RuruOS `article` schema exactly; no legacy or invented fields were added, and a real YAML parser loaded it as a mapping.
- [ ] Animated正文 media remains in its original GIF format unless conversion was required for reader compatibility; all PNG/JPEG/GIF signatures and any converted animation frame counts were verified.
- [ ] Original title, author/account, source URL, and publication date are preserved; extraction limitations, if any, are stated in the body or routed to Queue according to `AGENTS.md`.
- [ ] The note starts with source card + Mia summary +速读.
- [ ] Original numbered sections are visible and in order.
- [ ] Highlighted subheads/code/figures/comparison blocks are represented in Markdown.
- [ ] Important article images/diagrams are downloaded to local attachments and embedded near the right section, or download failure is explicitly noted.
- [ ] Screenshot-only metrics, rankings, and quoted claims are labeled as source-time evidence; rounded title claims and exact screenshot values are reconciled without silently updating the source.
- [ ] Claimed item counts (“六个域”, “十条原则”) match the explicitly recovered items; if not, the note preserves the source wording, does not invent missing entries, and records the mismatch. Screenshot-visible fields are separated from facts supplied only by prose.
- [ ] Reference screenshots, if any, are treated as optional baseline evidence rather than required input.
- [ ] Ads, QR/follow prompts, like/share prompts, and footer recommendation cards are removed from the main note.
- [ ] The written note was read back before reporting completion.
- [ ] The completion reply reports the exact Markdown path, attachment directory and count, deterministic verification result, and any unresolved uncertainty; do not report a generic “已入库” without these artifacts.
- [ ] The completion reply mentions queue IDs, protected records, handoffs, or untouched files only when the user actually supplied or requested them in the current task and the claim was verified. Never import unrelated operational details from another intake or prior session.
