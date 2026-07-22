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
| `AI与Coding/` | AI、Claude Code、Codex 与 Skills、Agent 工程、Vibe Coding（按现有子目录归类）；skill 聚合档案统一进 `Skill档案/`（一个 skill 一份 `Skill-<名称>.md`，`type: skill_note`，多篇文章介绍同一 skill 只维护这一份） |
| `商业与变现/` | 商业模式、变现案例、市场研究、深度报告 |
| `设计与审美/` | 设计知识与素材；配色卡统一进 `配色参考卡/`（命名沿用 `色所｜标题｜ID` 格式，ID 用于去重） |
| `游戏设计/` | 游戏相关分析与设计笔记 |
| `社媒观察/` | 社媒账号观察、平台抓取、选题策略（子目录：`AI账号观察/`、`小红书/`） |
| `工具观察/` | 新工具/GitHub 趋势/插件评估；深度报告进 `报告/` |
| `视频知识/` | 视频内容蒸馏、风格分析；原始转写进 `_raw_transcripts/` |
| `文档与方案/` | 成品文档、方案书、计划书、申请追踪 |

拿不准主题的 → `20-Reading/Queue/` + `needs_review: true`，禁止新建主题目录。

**浓缩管线（插件自动跑，Agent 知悉即可，不要代跑）**：用户点「标记已读」或「珍藏」后，插件后台自动浓缩该文——普通文章生成 `type: distilled_note` 浓缩笔记进对应主题目录（笔记自带要点节选与 `source_url`，不依赖原文存活）；skill 类文章并进 `AI与Coding/Skill档案/` 的对应档案。浓缩完成后，原文若无 `starred: true` 会被移入 vault 根目录 `.trash/`（可恢复）。Agent 不要动 `.trash/`，也不要给文章写 `distilled`/`starred` 字段。

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

已入库文章的 frontmatter 可能带 `note`（用户在阅读器里写的备注）、`starred: true`（用户珍藏，永久保留不参与自动清除）、`distilled: true`（浓缩管线标记）字段——都由界面或浓缩管线写入，Agent 一律保留原样，不改不删不代写。

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

**观影管线（Mia 必读）**：用户发来观影推荐文章/剧名时，提取剧目信息写入本文件夹，`status` 一律写 `待定`——用户会在中枢 App 的「待归类」区自己点进详情页决定追不追。正文放推荐理由、来源文章链接、外部评分。封面与简介不用你手动找，照下面的抓取标准走。
**分季**：多季剧按季建档（跟随豆瓣分季条目）——标题带季号（如《龙之家族 第三季》），`episodes` 填该季集数，海报用该季的；推荐没指明季数的默认最新一季。

#### 剧集资料抓取标准（写完剧集笔记必须做，不许跳）

补的是四样：**封面 / 简介 / 豆瓣评分 / IMDb 评分**。分两层，先跑第一层，第一层填不上的才轮到你自己动手。

##### 第一层：先跑脚本，别自己想办法查

建档 / 改档之后，对每个新写的剧集笔记跑一遍：

```bash
python3 90-System/Scripts/drama-facts.py 30-Media/Dramas/<剧名>.md
# 一次补全库缺的：python3 90-System/Scripts/drama-facts.py --all
```

脚本走的全是结构化接口，只补空缺，已有字段和正文一字不动，**永不编造**。跑完把输出行贴进回执。**没跑脚本 = 这条剧集入库不算完成。**

它内部的级联顺序（你手动补时按同一套走，别另发明）：

| 要补的 | 顺位 1 | 顺位 2 | 顺位 3 | 顺位 4 |
|---|---|---|---|---|
| 封面 | 豆瓣 `subject_suggest` 的 `img`，`/s_ratio_poster/`→`/l_ratio_poster/` | IMDb `primaryImage`（千像素级原图） | TVmaze `image.original` | iTunes `artworkUrl100`→`800x800bb` |
| 简介 | 豆瓣 rexxar 的 `intro`（中文，直接用） | IMDb `plot.plotText`（英文→翻译） | TVmaze `summary`（英文→翻译） | 联网搜 |
| 豆瓣评分 | 豆瓣 `j/subject_abstract` 的 `rate` | — | — | — |
| IMDb 评分 | IMDb `ratingsSummary.aggregateRating` | — | — | — |

接口地址：
- 豆瓣条目：`https://movie.douban.com/j/subject_suggest?q=<剧名>` → 拿 `id`、`sub_title`（英文原名）、`img`、`year`
- 豆瓣分与集数：`https://movie.douban.com/j/subject_abstract?subject_id=<id>` → `rate`、`episodes_count`
- 豆瓣简介：`https://m.douban.com/rexxar/api/v2/tv/<id>`（电影条目换 `/movie/`）→ `intro`
- IMDb 条目：`https://v3.sg.media-imdb.com/suggestion/x/<小写查询词>.json` → `d[].id`（tt 号）、`l`（英文名）、`y`、`qid`（类型）
- IMDb 详情：POST `https://api.graphql.imdb.com/`，body `{"query":"query{title(id:\"tt…\"){originalTitleText{text} releaseYear{year} ratingsSummary{aggregateRating} primaryImage{url} plot{plotText{plainText}}}}"}`
- TVmaze：`https://api.tvmaze.com/search/shows?q=<原名>`　　iTunes：`https://itunes.apple.com/search?term=<原名>&entity=tvSeason`

请求要点（踩过的坑，别重踩）：
- 豆瓣接口带桌面 UA；rexxar 还要带 `Referer: https://m.douban.com/movie/subject/<id>/`。
- **下载豆瓣海报必须带 `Referer: https://movie.douban.com/`**——`img*.doubanio.com` 有防盗链，不带一律回 418（带 UA 没用）。接口只要 UA、图床只要 Referer，是两套限制。
- 豆瓣连打十几条就开始静默返空数组，**每次请求之间隔 2.5 秒**；所有查询词都返空时先当限流处理，歇久一点重试一轮再判定「查不到」。
- **TVmaze 只有剧集，没有电影**——《怒火救援》《K-POP：猎魔女团》这类查不到分就是因为这个。IMDb 那条路电影剧集通吃，优先走它。
- **先从豆瓣把英文原名学回来**（条目的 `sub_title`，按 `/` 拆取第一个有拉丁字母且无汉字的段），写进 `title_original`，再拿它去搜 IMDb / TVmaze / iTunes——这三个都是英文库，拿中文剧名去问命中率差一大截。原名只写 `title_original`，**不要往 `title` 里加括号**：title 是文件名与全库显示名。

##### 命中判定（对不上就当没查到，宁可留空也不许张冠李戴）

- **豆瓣**：季号一致（我们的标题不带季号时，豆瓣的「第一季」也算）＋ 年份差 ≤1 ＋ 中文名去季号或原名与查询词相等。三条缺一不可。
- **IMDb**：**别拿年份当主要判据**——IMDb 的年份是「剧集首播年」，我们库里的是「该季年份」。用英文名查时只认「去掉季号后名字完全相等」的条目（《怪奇物语 第五季》要配到 `Stranger Things` 主条目，不是 2025 年那个同名花絮）；用中文名查时才用年份卡一道。
- **两侧交叉验证**：标题不带季号、而豆瓣与 IMDb 认的年份差 >2，多半是**同名不同作品**（《怒火救援》＝ Netflix 2026 剧，豆瓣首条却是 2004 年丹泽尔那部电影）。这时以笔记里的 `year` 为准取其中一边；`year` 是空的就**两边分数都别写**，标出来等人判。

##### 第二层：第一层填不上的，你上（这才是你联网搜索的用武之地）

脚本跑完会打印一张「交接单」，列出每部剧还缺什么、以及能拿到的英文原文。照单干：

1. **简介**：交接单给了英文原文的，**直接翻成中文**，不必再搜——两三句、剧情梗概、不剧透关键反转、不要「本剧讲述了」这种腔调。没给原文的才去联网查中文简介。写进正文 `## 简介`，排在 `## 看点` 之前。
2. **封面**：联网找该剧海报直链（尽量竖版高清），下载存 `30-Media/Posters/<剧名>.jpg`，再把 `poster` 改成 `"[[30-Media/Posters/<剧名>.jpg]]"`。下载不下来就别写这个字段。
3. **评分**：联网查真实分数，只填 `external_rating` 的 `douban` / `imdb`（纯数字）。
4. **`notes`**：为空时补一句话推荐语（不剧透）。

##### 三条铁律（违反了这条剧集就算没做完）

1. **只补点名缺的字段**，其余 frontmatter 与正文一字不动。
2. **查不到就留空。** 绝不编造分数，不许写「约 8.0」「大概 7 分」，不许拿别的季或同名作品的分数顶替。
3. **不确定是不是同一部剧**（年份对不上、季数对不上、类型对不上）**就当查不到。**

中枢 App 的「补全」钮走的是同一套两层规则（插件 `main.js` 的 `dataMixin.fetchDramaFacts` + `aiPatchDramas`）。**规则改一边，另一边必须跟着改**：脚本 = `90-System/Scripts/drama-facts.py`，插件 = `dataMixin`。


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

账本正文怎么写才能渲染出占比条/对账单/时间线（呈现契约）、以及记账常见任务的完整菜谱：见 `docs/记账指南.md`。

## Mia 专用

- 抓取失败/提取不完整的文章：写入 `20-Reading/Queue/`，`extraction_status: failed`。
- **入库前自查（TTS/转写来源必查）**：正文乱码字符明显、大段无意义重复、残缺不足 200 字且无信息量的，一律不进 `Articles/`——进 `20-Reading/Queue/` 标 `extraction_status: failed`；拿不准的标 `needs_review: true`。垃圾进库会污染中枢和浓缩管线。
- 旧 vault（`~/Documents/Obsidian Vault`）已冻结为只读备份，一切新内容写本 vault。
