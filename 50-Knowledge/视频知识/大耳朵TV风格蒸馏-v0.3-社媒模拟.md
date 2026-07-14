---
title: 大耳朵TV风格蒸馏 v0.3｜简介语气补充与社媒账号模拟
created: 2026-06-28
status: preliminary
model_provenance:
  metadata_collection: Atlas/browser + Grace/OpenAI verification
  description_extraction: Grace/OpenAI local CSV analysis
  analysis: Grace/OpenAI
  claude_review: pending
source_notes:
  - Mia/VideoKnowledge/大耳朵TV风格蒸馏-v0.2.md
  - /tmp/daerduo-final/videos_merged.csv
limits:
  - public_metadata_and_descriptions_only
  - no_bulk_ASR_yet
  - yt-dlp_public_subtitle_attempt_failed_http_412
---

# 大耳朵TV风格蒸馏 v0.3｜简介语气补充与社媒账号模拟

## 1. 本次新增

v0.2 已有 334 条视频元数据，适合标题/结构分析。  
本次继续从本地落盘 CSV 的 **330 条视频简介** 抽取口吻线索：

| 简介特征 | 命中数 |
|---|---:|
| `感谢收看` | 319 |
| `喜欢请三连` | 313 |
| `大家好` | 236 |
| `嗨喽` 开头 | 233 |
| `今天分享` | 157 |
| `真实体验/使用` | 7 |
| `独家赞助` | 3 |

结论：大耳朵TV的可模拟部分主要是：

- 开头友好固定句：`嗨喽，大家好，今天分享...`
- 主体强结论：先讲值不值 / 要不要 / 该不该。
- 标题堆关键词：产品、场景、对比、维度。
- 结尾短促：`感谢收看！喜欢请三连！`
- 可信度来自“真实使用时间 + 优缺点 + 谁适合/谁不适合”。

## 2. 仍然缺的素材

尝试用 `yt-dlp --list-subs` 抽取代表视频字幕，失败：

```text
ERROR: [BiliBili] ... Unable to download JSON metadata: HTTP Error 412: Precondition Failed
```

所以目前还不能声称已经掌握完整口头禅、语速、转场句和镜头语言。若要更精确，需要后续走浏览器签名/本地 Worker/人工样本 ASR 路线，至少抽 8 条代表视频。

## 3. 用在用户社媒账号上的“结构借鉴版”

### 标题

```text
【AI新手必看】真实使用 Mia 一天后，我发现 AI 助理最大的优点和缺点！｜Obsidian / 微信文章 / 内容中台
```

### 小红书正文版

```text
嗨喽，大家好，今天分享一个我真实踩到的 AI 助理问题。

我把一堆公众号文章发给 Mia，本来以为它没下文了。
结果回头一查，文章其实已经全部进了 Obsidian：
有本地快照、有标题、有路径，有些还已经标好了要给 Lisa 或 Atlas 复核。

所以我先说结论：
AI 助理最大的问题，不是不会干活，而是“干完了你不知道”。

这件事的最大优点是：
你的微信收藏不会再变成黑洞。
它可以从一条转发链接，变成一条有状态的知识资产。

但最大缺点也很明显：
如果没有最后那句反馈——已处理、位置、判断、下一步——用户体感上就等于没发生。

所以我现在给 Mia 加了一个硬规则：
每篇文章处理完，都必须告诉我它去了哪里，以及下一步归谁。

如果你也想做 AI 工作流，别先追求全自动。
先把这一步做好：让每条信息都有位置、有状态、有负责人。
```

### X 英文短帖版

```text
Most AI assistants don't fail because they do nothing.
They fail because they do the work invisibly.

I forwarded a batch of WeChat articles to my assistant and thought they disappeared.
They were actually saved into Obsidian, classified, and routed.

The missing piece was not automation.
It was closure:
- processed
- saved at
- decision
- next owner

Invisible work feels like no work.
```

### Reddit 讨论版

```text
I'm testing a personal AI assistant workflow where forwarded articles are saved locally into Obsidian, classified, and routed to different agents.

The surprising failure mode wasn't extraction.
It was feedback.

If the assistant processes everything but doesn't report back with path + status + next step, the user assumes nothing happened.

Curious if others building personal AI workflows have hit the same problem: invisible automation feels like broken automation.
```

## 4. 后续 ASR 样本队列

优先抽这些类型各 1-2 条：

1. iOS / 苹果系统更新型。
2. 真实使用 N 天评测型。
3. 买前必看 / 购买指南型。
4. VLOG / Q&A 型。
5. 高热视频：AR 眼镜 / Mac mini / AirPods / Switch 2。

目标：补齐真实口播节奏、转场句、缺点铺垫方式、赞助说明方式。
