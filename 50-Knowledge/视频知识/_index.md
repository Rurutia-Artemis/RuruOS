---
schema_version: 1
type: index
title: Mia Video Knowledge
updated: "2026-06-27"
---

# Mia Video Knowledge

视频转写、摘要和二次分类后的知识沉淀。

```dataview
TABLE title, category, design_relevance, digestion_status
FROM "50-Knowledge/视频知识"
WHERE type = "video_knowledge"
SORT updated DESC
```
