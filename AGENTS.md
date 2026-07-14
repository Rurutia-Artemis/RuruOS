# RuruOS Agent 写入规范

> 用户刚拿到这个库、还没搭建好？先按根目录《AI搭建指南.md》把系统搭起来，再回来遵守本规范。

本 vault 是 Lulu 的个人知识系统中枢。所有 Agent（Codex、Claude Code、Mia/Hermes）向本 vault 写入内容时，**必须**遵守本文件。不确定放哪时，写入 `20-Reading/Queue/` 并在 frontmatter 标 `needs_review: true`，禁止自创文件夹。

## 目录职责（唯一权威）

| 路径 | 放什么 | 谁写 |
|---|---|---|
| `10-Projects/<项目名>/` | 项目笔记。一个项目一个文件夹，入口固定叫 `项目主页.md` | 所有 Agent |
| `10-Projects/项目池/` | 还没立项的想法、点子记录 | 所有 Agent |
| `10-Projects/_旧项目档案/` | 旧项目冻结档案 | 仅人工 |
| `20-Reading/Articles/` | 抓取的文章（微信公众号、小红书、网页），全部平铺，**不建子文件夹** | Mia / Codex |
| `20-Reading/Queue/` | 抓取管线中转区、待人工分类内容（不确定放哪的也进这里） | Mia |
| `30-Media/Dramas/` | 剧集，一剧一笔记 | Mia |
| `30-Media/Posters/` | 剧集海报图片 | Mia |
| `40-Life/Tasks/` | 待办，一条一笔记 | Mia |
| `40-Life/Calendar/` | 日程事件，一事件一笔记 | Mia |
| `40-Life/Finance/流水/` | 日常账目流水，一笔一笔记（schema 见下） | Mia |
| `40-Life/Finance/` | 项目账本（`type: ledger`）与记账元文档 | Mia |
| `40-Life/Finance/原始表格/` | 账目原始表格/附件的占位记录 | Mia |
| `40-Life/Journal/` | 日常随手记 | Mia |
| `50-Knowledge/<主题>/` | 沉淀后的知识笔记，按固定 8 个主题目录归类（见下节） | 所有 Agent |
| `90-System/` | 模板、脚本、规范。**Agent 不得自动写入**，仅人工维护 | 仅人工 |
| `99-Attachments/Mia/<域>/` | Mia 抓取的图片等附件，按域分子目录：`design` `dramas` `social` `toolwatch` `video`，文件名带日期前缀 | Mia |
| `99-Attachments/审美罗盘/`、`99-Attachments/AI视频知识/` | 旧 vault 迁入的历史图片附件（配色卡、视频截图），被笔记嵌入引用，只读不新增 | 仅人工 |

## 50-Knowledge 主题目录（固定 8 个，不得新建）

| 主题 | 放什么 |
|---|---|
| `AI与Coding/` | AI、Claude Code、Codex 与 Skills、Agent 工程、Vibe Coding（按现有子目录归类） |
| `商业与变现/` | 商业模式、变现案例、市场研究、深度报告 |
| `设计与审美/` | 设计知识与素材；配色卡统一进 `配色参考卡/`（命名沿用 `色所｜标题｜ID` 格式，ID 用于去重） |
| `游戏设计/` | 游戏相关分析与设计笔记 |
| `社媒观察/` | 社媒账号观察、平台抓取、选题策略（子目录：`AI账号观察/`、`小红书/`） |
| `工具观察/` | 新工具/GitHub 趋势/插件评估；深度报告进 `报告/` |
| `视频知识/` | 视频内容蒸馏、风格分析；原始转写进 `_raw_transcripts/` |
| `文档与方案/` | 成品文档、方案书、计划书、申请追踪 |

拿不准主题的 → `20-Reading/Queue/` + `needs_review: true`，禁止新建主题目录。

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
category: ai-coding     # ai-coding | 商业变现 | 设计 | 剧集推荐 | 游戏 | 生活 | 其他（判定规则见下）
status: unread          # unread | reading | read（已读由用户在视图里点击切换，Agent 只写 unread）
read_at: ""
rating: ""
dedup_key: url:xxxx
added: 2026-07-10
```

正文：frontmatter 之后直接放提取的文章 markdown 全文，保留图片。

已入库文章的 frontmatter 可能带 `note` 字段（用户在阅读器里写的备注），Agent 一律保留原样，不改不删。

**category 判定规则（按文章主体内容判断，不是按提到了什么）：**

| 分类 | 判定标准（标题/正文出现这类信号） | 例子 |
|---|---|---|
| `剧集推荐` | 推荐/测评电视剧、电影、综艺；出现剧名、"这部剧"、集数、演员 | 《第二集直接炸了，这部新剧太生猛了》 |
| `商业变现` | 主体讲赚钱、创业、一人公司、变现案例、商业模式；信号词：赚、收入、变现、美元、年入 | 《油管大神Dan Koe…赚到100万美元》《每天4小时，年入1400万》 |
| `ai-coding` | AI 工具、Claude/Codex/Agent/Skill、编程、效率工具、Obsidian 等软件玩法 | 《Claude Code最强使用指南》 |
| `设计` | 配色、排版、UI、品牌、美学本身是主体 | 《配色灵感｜9组品牌设计配色》 |
| `游戏` | 游戏内容、游戏设计 | |
| `生活` | 美食、旅行、健康、日常 | |
| `其他` | 确实不属于以上任何一类才用，**不是拿不准的兜底** | |

**入库前整理（必须做完才能放进 Articles，尤其语音/视频转写来源）：**

1. **分段**：正文按语义分段，每段 2-4 句、段间空行。一整坨不分段的长文禁止直接入库。
2. **清杂**：口水词、重复句、乱码、转写错误、广告导流、抽奖引流全部删除；正文残缺或提取失败的进 `Queue/` 标 `extraction_status: failed`，不进 Articles。
3. **保留**：观点、事实、数字、图片、代码块、原文链接——整理是删杂质，不是删信息。
4. 标题按通用规则清洗，`dedup_key` 查重，分类按上表判定。
5. 剧集推荐类文章另走观影管线：提取剧目写 `30-Media/Dramas/`，并抓豆瓣/IMDb 评分填 `external_rating`。

判定顺序：文章「用 AI 赚钱」这类跨界的，看落点——教赚钱的归 `商业变现`，教工具用法的归 `ai-coding`。剧集推荐类文章除了归类，还要按观影管线提取剧目写入 `30-Media/Dramas/`。拿不准的进 `20-Reading/Queue/` 让人来定，不要扔进「其他」。

### 剧集 `30-Media/Dramas/`

```yaml
type: drama
title: "中文名"
title_original: "原名/英文名（尽量填，用于自动搜封面）"
poster: "[[30-Media/Posters/<文件名>.jpg]]"   # 必须是 wikilink 格式；没有海报可留空，App 内可一键联网搜
country: 韩国
year: 2026
genre:
  - 悬疑
platform: Netflix
episodes: 10            # 总集数，未知写 0
current_episode: 0      # 看到第几集
external_rating:        # 外部评分，建剧时尽量抓全（豆瓣搜剧名、IMDb 搜原名），中枢追剧墙直接显示
  douban: ""            # 如 8.2，查不到留空
  imdb: ""              # 如 7.9，查不到留空
status: 待定            # 待定 | 想看 | 在追 | 看完 | 弃剧
rating: ""
# pinned: true          # 置顶（追剧墙排最前）。用户在详情页自己点，Mia 建剧不写、已有的保留勿动
notes: "一句话推荐语（从来源文章提炼）"
added: 2026-07-10
```

**观影管线（Mia 必读）**：用户发来观影推荐文章/剧名时，提取剧目信息写入本文件夹，`status` 一律写 `待定`——用户会在中枢 App 的「待归类」区自己点进详情页决定追不追。正文放推荐理由、来源文章链接、外部评分。有海报就下载到 `30-Media/Posters/`（文件名与剧名一致）；没有就留空，App 会自动联网搜封面。
**分季**：多季剧按季建档（跟随豆瓣分季条目）——标题带季号（如《龙之家族 第三季》），`episodes` 填该季集数，海报用该季的；推荐没指明季数的默认最新一季。

### 待办 `40-Life/Tasks/`

```yaml
type: task
title: "事项内容"
due: 2026-07-11         # 无截止日期留空
done: false
priority: 中            # 高 | 中 | 低
kind: 普通              # 紧急 | 普通 | 长期（中枢按此排序显示，紧急置顶红标、长期青标）
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

### 账目流水 `40-Life/Finance/流水/`

日常收支一笔一笔记，文件名固定 `YYYY-MM-DD 标题.md`（如 `2026-07-10 全家便利店.md`）：

```yaml
type: transaction
title: "一句话说明这笔账"
date: 2026-07-10        # 发生日期
amount: 128             # 数字，一律正数
currency: JPY           # JPY | CNY | AUD | USD
direction: 支出          # 支出 | 收入
category: 餐饮           # 餐饮 | 交通 | 购物 | 订阅 | 居住 | 娱乐 | 医疗 | 投资 | 项目 | 其他
ledger: ""              # 关联项目账本标题（如 海边咖啡店创业），日常消费留空
note: ""
added: 2026-07-10
```

正文可留空；有截图/表格来源时正文里注明并把占位记录放 `原始表格/`。

### 项目账本 `40-Life/Finance/`

大项目的持续账本（如 海边咖啡店创业），一本一笔记，放 Finance 根目录。中枢账目卡直接读取 `total` 与 `currency`，**账本内容更新后必须同步更新这两个字段**：

```yaml
type: ledger
title: "海边咖啡店创业"
currency: JPY
total: 2865000          # 当前累计金额，数字。余额/欠款类账本直接写负数（如 -128000），中枢自动红色显示
status: active          # active | closed
updated: 2026-07-10
```

正文放明细表格、占比、更新记录。单笔新支出同时属于某个项目账本时：流水照记（`ledger` 字段填账本标题），并更新账本正文与 `total`。

## Mia 专用

- 抓取失败/提取不完整的文章：写入 `20-Reading/Queue/`，`extraction_status: failed`。
- **入库前自查（TTS/转写来源必查）**：正文乱码字符明显、大段无意义重复、残缺不足 200 字且无信息量的，一律不进 `Articles/`——进 `20-Reading/Queue/` 标 `extraction_status: failed`；拿不准的标 `needs_review: true`。垃圾进库会污染中枢和浓缩管线。
- 旧 vault（`~/Documents/Obsidian Vault`）已冻结为只读备份，一切新内容写本 vault。
