---
schema_version: 1
type: index
title: Xiaohongshu Captures
updated: "2026-06-27"
---

# Xiaohongshu Captures

小红书公开链接/截图/导出文本的低风险收集入口。公开提取失败时保留 blocked 状态，不伪造内容。

```dataview
TABLE title, category, extraction_status, design_relevance, source_url
FROM "50-Knowledge/社媒观察/小红书"
WHERE type = "social_capture"
SORT updated DESC
```
