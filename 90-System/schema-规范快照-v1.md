# OBOS Agent 写入规范

本 vault 是 Lulu 的个人知识系统中枢。所有 Agent（Codex、Claude Code、Mia/Hermes）向本 vault 写入内容时，**必须**遵守本文件。不确定放哪时，写入 `20-Reading/Queue/` 并在 frontmatter 标 `needs_review: true`，禁止自创文件夹。

## 目录职责（唯一权威）

| 路径 | 放什么 | 谁写 |
|---|---|---|
| `10-Projects/<项目名>/` | 项目笔记。一个项目一个文件夹，入口固定叫 `项目主页.md` | 所有 Agent |
| `20-Reading/Articles/` | 抓取的文章（微信公众号、小红书、网页），全部平铺，**不建子文件夹** | Mia / Codex |
| `20-Reading/Queue/` | 抓取管线中转区、待人工分类内容 | Mia |
| `30-Media/Dramas/` | 剧集，一剧一笔记 | Mia |
| `30-Media/Posters/` | 剧集海报图片 | Mia |
| `40-Life/Tasks/` | 待办，一条一笔记 | Mia |
| `40-Life/Calendar/` | 日程事件，一事件一笔记 | Mia |
| `40-Life/Finance/` | 账目记录 | Mia |
| `40-Life/Journal/` | 日常随手记 | Mia |
| `50-Knowledge/` | 沉淀后的知识笔记（读完文章提炼的内容放这里） | 所有 Agent |
| `90-System/` | 模板、脚本、规范。**Agent 不得自动写入**，仅人工维护 | 仅人工 |

## 通用规则

1. 文件名 = 内容标题，去掉 `\/:*?"<>|#^[]` 字符，最长 60 字符。
2. 分类靠 frontmatter 属性，**不靠移动文件、不靠子文件夹**。
3. 写入前用 `dedup_key`（或 `source_url`）检查同目录是否已存在，存在则更新原文件，不新建。
4. 日期一律 `YYYY-MM-DD`，时间戳一律 ISO 8601。
5. frontmatter 字段名固定小写下划线，不得增删改名；需要新字段先改本规范。

## Frontmatter Schema

### 文章 `20-Reading/Articles/`

```yaml
type: article
title: "文章标题"
source: wechat          # wechat | xiaohongshu | web
source_url: https://...
author: "作者"
category: ai-coding     # ai-coding | 商业变现 | 设计 | 游戏 | 生活 | 其他
status: unread          # unread | reading | read（已读由用户在视图里点击切换，Agent 只写 unread）
read_at: ""
rating: ""
dedup_key: url:xxxx
added: 2026-07-10
```

正文：frontmatter 之后直接放提取的文章 markdown 全文，保留图片。

### 剧集 `30-Media/Dramas/`

```yaml
type: drama
title: "中文名"
title_original: "原名（可选）"
poster: "[[30-Media/Posters/<文件名>.jpg]]"   # 必须是 wikilink 格式
country: 韩国
year: 2026
genre:
  - 悬疑
platform: Netflix
episodes: 10            # 总集数，未知写 0
current_episode: 0      # 看到第几集
status: 想看            # 想看 | 在追 | 看完 | 弃剧
rating: ""
notes: "一句话推荐语"
added: 2026-07-10
```

海报：下载到 `30-Media/Posters/`，文件名与剧名一致。

### 待办 `40-Life/Tasks/`

```yaml
type: task
title: "事项内容"
due: 2026-07-11         # 无截止日期留空
done: false
priority: 中            # 高 | 中 | 低
reminder_id: ""         # 苹果提醒事项配对 ID，同步脚本维护，Agent 不要动
added: 2026-07-10
```

### 日程 `40-Life/Calendar/`

```yaml
type: event
title: "事件名"
start: 2026-07-11T14:00
end: 2026-07-11T15:00
location: ""
calendar_id: ""         # 苹果日历配对 ID，同步脚本维护，Agent 不要动
added: 2026-07-10
```

### 项目 `10-Projects/<项目名>/项目主页.md`

```yaml
type: project
title: "项目名"
status: 进行中          # 构思 | 进行中 | 暂停 | 完成
priority: 中
code_path: "~/Lulu Code/<项目名>"
updated: 2026-07-10
```

### 账目 `40-Life/Finance/`

迁移旧 vault `记账/` 后定稿，暂不写入。

## Mia 专用

- 抓取失败/提取不完整的文章：写入 `20-Reading/Queue/`，`extraction_status: failed`。
- 旧 vault（`~/Documents/Obsidian Vault`）已冻结为只读备份，一切新内容写本 vault。
