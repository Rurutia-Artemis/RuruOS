# RuruOS 微信文章：公开 HTML 恢复与确定性验证

当公共 reader 已返回正文、但没有图片或发布时间时，使用这套补全路径。只适用于公开页面；不使用登录态、Cookie 或账号操作。

## 0. Provider-independent public fetch fallback

If the configured generic page extractor is unavailable or returns an empty result, do not treat that setup state as evidence that the article is blocked. Fetch the same public URL once with an ordinary browser User-Agent, save the raw HTML outside the vault, and run the bundled standard-library extractor:

```bash
curl -L --fail --silent --show-error --compressed \
  -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36' \
  '<wechat-url>' -o '<temp>/article.html'

python3 scripts/extract-public-wechat-html.py \
  '<temp>/article.html' '<temp>/extracted.json'
```

Verify the saved byte count and inspect `content_chars`, `image_count`, metadata, and ordered events before proceeding. If the HTML is a verification page, make only the single mobile public retry described in `wechat-public-page-types.md`; never add cookies, tokens, QR interaction, or account state. This is a provider-independent public retrieval path, not a claim that any particular extractor is permanently broken.

## 1. Reader 不是图片完成信号

`status: extracted` 只说明拿到了可读文本，不代表版式、图片和发布日期完整。若 reader 输出目录只有 Markdown：

1. 公开请求原始文章 HTML。
2. 普通文章定位 `#js_content`，备用 `.rich_media_content`。
3. 按 DOM 顺序读取 `img[data-src]`，无 `data-src` 时再读 `src`。
4. 记录每张图前后的最近正文块，用于决定嵌入位置和图注。
5. 图片卡片页仍按 `wechat-public-page-types.md` 的独立分支处理，不要混用普通文章规则。

## 2. 现代页面元数据回退

页面可见的 `#publish_time` 以及旧式 `var nickname` / `var publish_time` 可能为空。现代公开页常把文章级元数据放在 `window.cgiDataNew` 中，按以下顺序回退：

| 字段 | 优先来源 | 备用来源 |
|---|---|---|
| 标题 | `og:title` | `cgiDataNew.title`、`msg_title` |
| 公众号名 | `cgiDataNew.nick_name` | `nickname`、页面账号区域 |
| 作者 | `cgiDataNew.author` | `meta[name=author]`、正文署名 |
| 发布时间 | `cgiDataNew.create_time` | `publish_time`、Unix 时间字段 `ori_create_time` / `ct` |
| 摘要 | `og:description` | `cgiDataNew.desc`、`msg_desc` |

- `author` 是文章作者，`nick_name` 是公众号账号名，不要混写。RuruOS frontmatter 只有 `author` 时，把公众号名放进正文的「文章来源」卡片。
- Unix 时间戳用页面对应时区转换；微信公众号内容通常按中国标准时间解释。
- 在笔记正文或完成回复里明确说明“发布时间由公开 HTML 时间戳还原”，不要伪装成页面直接展示。
- 若存在多个相近时间戳，优先文章级 `create_time` / `ori_create_time` / `ct`，不要使用抓取时间或页面资源时间。

### 元数据一致性检查

微信公开页的分享摘要可能滞后于正文，甚至残留另一个主题的文案。恢复完成后做一次交叉判断：

1. 比较 `og:title`、`cgiDataNew.title`、正文首段与完整 `#js_content` 的主题是否一致。
2. 如果标题与足量、连贯的正文一致，而 `og:description` 单独冲突，把描述视为陈旧分享元数据；不要用它改标题、改分类或判定提取失败。
3. 正文标题和主体内容作为 canonical evidence；在 `来源与备注` 简短记录“公开页面摘要字段与正文不一致，本文以页面标题及完整正文为准”。
4. 如果标题、正文和摘要三者都互相冲突，不能靠猜测选一个；按残缺/不确定内容路由到 live `AGENTS.md` 指定的 Queue。

### `cgiDataNew` 的实际解析形态

`window.cgiDataNew` 通常是 JavaScript 对象字面量而非严格 JSON：键可能不加引号，值可能使用单引号。不要假设它能直接交给 `json.loads`，也不要只搜索双引号形式的字段。

1. 先定位 `window.cgiDataNew = {`，在有界片段或括号平衡得到的对象范围内解析，避免命中广告脚本中的同名字段。
2. 同时兼容 `key: 'value'`、`key: "value"` 和数字值；至少读取 `nick_name`、`author`、`title`、`create_time`、`ori_create_time`。
3. `create_time` 若已是 `YYYY-MM-DD HH:MM`，优先直接使用；`ori_create_time` / `ct` 多为 Unix 秒，仅在格式化时间缺失时按中国标准时间转换。
4. 若全页存在多个 `nick_name`，只采用文章级 `cgiDataNew` 对象中的值。
5. 页面若被压缩成极少数超长行，逐行搜索可能不实用；可用小型 Python 解析器读取本地 HTML、定位对象边界并只打印目标字段。这是页面解析回退，不是访问控制绕过。

### 标准库提取脚本的实际输出结构

`scripts/extract-public-wechat-html.py` 输出的是恢复证据，不是已经归一化的文章对象。当前字段包括：

- `document_title`
- `meta`（如 `og:title`、`description`、`author`）
- `public_fields`（如 `account`、`visible_author`、`published_at`）
- `content_text`、`content_chars`
- `events`（按正文顺序排列的 `text` / `image` 事件）
- `links`、`image_count`、`text_event_count`

不要直接假设输出有顶层 `title`、`author`、`account`、`images` 或 `published_at`。应按上述结构归一化：标题优先 `meta["og:title"]`；作者与账号分别读取 `meta["author"]` / `public_fields`；图片从 `events` 中筛选 `type: image`，正文从 `events` 和 `content_text` 交叉核对。先查看实际键集合，再写后续下载或排版脚本，避免把完整提取误判为空。

### 正文没有可提取外链时的资源地址恢复

文章有时只在截图里展示 GitHub 仓库或产品地址，正文 `links` 为空。此时：

1. 先从截图读取可见的仓库名、组织／用户名、版本和简介；看不清的 owner 不要猜。
2. 提交作者、截图账号名或 commit author 只能作为候选线索，不能单独证明仓库 owner。
3. 仅对有截图证据支持的候选公开 URL 做一次无登录可达性验证；成功后才可写入笔记。
4. 在「来源与备注」明确标注“正文无可提取超链接；地址由公开截图恢复并验证”，把恢复事实与原文直接链接区分开。
5. 若多个候选都可达或截图证据不足，只保留仓库名，不补完整 URL。

## 3. 正文图片筛选与语义终点

先保存并审阅 `#js_content` 中的全部图片，再做内容筛选。现代页面可能把装饰图、作者卡和微信交互 UI 也放进 `#js_content` 或其解析范围，所以“容器内全部图片”不是完成标准：

- 保留：论证截图、流程图、架构图、步骤图、示例结果、章节内容插图。
- 删除：二维码、关注卡、作者自荐卡、互动引导、广告和无关页尾推广。
- 进入 footer 区的强信号包括：`微信扫一扫`、`关注该公众号`、`使用小程序`；`jump_author_avatar` / `作者头像`；关注卡、公众号矩阵；或正文结论后连续出现极扁装饰图。遇到这些信号后，后续图片默认丢弃，除非有明确正文证据。
- 不要仅按图片编号硬截断；不同文章的正文图数量不同。
- 对多图文章先生成带编号的 contact sheet 做总览；只对承载事实或文字较密的关键图片单独视觉读取。
- 图片文字包含流程、组件、数字或检查结果时，必须在 Markdown 中提供可搜索转写；看不清的图标或标签应保守描述，不猜测。
- 对下载文件计算 SHA-256 识别完全重复资源。原文若在不同段落重复嵌入同一图，阅读顺序仍应保留；可复用一个附件或保留两个顺序文件，但在备注中说明。
- 正文只引用本地附件，不保留 `mmbiz.qpic.cn` 热链。

## 4. 写入后的确定性验证

最终报告成功前至少检查：

1. Frontmatter 的字段集合与顺序符合当前 `AGENTS.md`，无额外字段；再用真实 YAML 解析器验证语法，不只做字符串检查。
2. `source_url` 与 `dedup_key` 精确匹配。
3. 每个 Obsidian 图片引用都存在；引用数、唯一引用数和保留附件数一致。
4. 所有图片可被真实解码，扩展名与格式合理。
5. 正文没有微信图片热链。
6. Python / JSON 等代码示例能分别通过语法解析。
7. 正文不存在二维码、进群、点赞、关注等尾部推广内容；“已删除推广”的说明避免重复写出这些噪声词，以免自动检查误报。
8. 回读笔记开头与结尾，确认来源卡、摘要、速读、原文整理、可复用结论和来源备注齐全。
9. 用 `git status --short -- <note> <attachments>` 确认本次只新增或修改预期目标。

## 5. 完成回复中的不确定项

只报告真正的不确定或派生信息，例如：

- 发布时间来自 `ct/create_time`，不是页面可见字段。
- 图片中的无标签图标只能描述为“多种输入”，不能臆测具体来源。

不要把已经验证通过的本地图片、Frontmatter 或代码块描述成不确定项。