# 批量链接入库队列

当用户一次发送 3 个以上链接，或明确表示将连续大量转发时，使用本流程。它补充单篇文章排版流程，不替代正文抓取与验证规则。

## 目标

- 用户可以继续发链接，不必等上一篇完成。
- 队列状态可恢复；Gateway 或当前会话重启后不会丢失未处理链接。
- 并发有上限，避免多个 worker 同时修改同一文件或把上下文与 Token 成本放大。
- 子代理负责单篇制作，父代理负责真实回读、队列状态和下一篇调度。

## 1. 接收与归一化

1. 提取消息内所有 `http` / `https` URL，先判断哪些参数是公开资源定位所必需，哪些只是分享、追踪或凭据参数。
2. **持久队列只保存可公开复用的 canonical URL。** 微信单篇优先归一化到稳定的 `/s/<article-id>`；小红书笔记归一化到 `/explore/<note-id>`。不得把 `xsec_token`、`shareRedId`、`share_id`、`code`、Cookie、登录 token 或同类分享凭据写入队列、笔记、交接、日志摘要或用户回复。若某个分享参数仅在当前会话中暂时帮助打开公开页面，可在内存中短暂使用并在输出中写作 `[REDACTED]`，但落盘前必须删除；如果删除后无法公开访问，则按 blocked / `needs_review` 处理，不保留凭据来维持抓取。
3. 按 canonical URL 去重，并检查当前队列和 RuruOS 中已有的 `source_url` / `dedup_key`。不要按整条带追踪参数的分享 URL 去重，否则同一内容会因参数不同重复入队。
4. 分类：
   - `article`：微信公众号单篇 `/s/...`
   - `topic`：公众号专题页 `/mp/appmsgtopic...`
   - `xiaohongshu`：小红书公开笔记
   - `other`：其他公开网页
5. 向用户只回报：收到数、去重后数量、类型分布、当前并发状态；不要逐条复述长 URL。

## 2. 持久队列

队列是任务进度，不写 memory。保存在当前 profile，例如：

`~/.hermes/profiles/<profile>/queues/content-intake-YYYY-MM-DD-HHMMSS.json`

推荐字段：

```json
{
  "batch_id": "content-intake-...",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",
  "workflow": "wechat-article-obsidian-layout-vX.Y.Z",
  "summary": {
    "received": 0,
    "unique": 0,
    "processing": 0,
    "pending": 0,
    "completed": 0,
    "needs_review": 0,
    "failed": 0
  },
  "items": [
    {
      "id": 1,
      "type": "article",
      "status": "pending",
      "url": "https://..."
    }
  ]
}
```

状态只使用：`pending`、`processing`、`completed`、`failed`、`needs_review`。其中 `needs_review` 是“处理已终止但内容不完整／公开来源不可验证”的终态，不得计入 `completed`；`failed` 用于没有产出可复核记录或持久化／验证本身失败。用户侧可以汇报“全部处理结束”，但必须分开报告“完整入库 N、待复核 M”。完成后可追加 `delegation_id`、`article_path`、`image_count`、`verified`；失败时记录简短 `error`，不要把大段日志塞入队列。

**队列文件只由父代理／调度者写。** Worker 永远不得修改 manifest。更新时先重新读取磁盘上的最新 JSON，按 item `id` 修改对象，再用临时文件 + 原子替换或等价的完整 JSON 写入；不要依赖单行 JSON 或固定缩进做脆弱的文本补丁，因为格式化、并发写入或恢复脚本都可能改变排版。若编辑工具提示 sibling / concurrent modification，必须停止沿用旧快照，重新读取并合并最新状态后再写。每次写回后立即重新解析 JSON，并核对 items 总数、ID/URL 唯一性、合法状态、processing/pending/completed 计数和 `summary` 一致性。

每次新增、派发、完成或恢复项目后，都要重新解析 JSON 并核对：ID 唯一、URL 唯一、状态合法、`summary` 与真实 items 计数一致。不要只手工修改汇总数字。使用确定性脚本：

```bash
# 只读检查；不一致时退出 1
python3 scripts/reconcile_content_queue.py /absolute/path/to/queue.json

# 验证后原子更新 summary，并把 updated_at 统一写为 UTC Z
python3 scripts/reconcile_content_queue.py /absolute/path/to/queue.json --write
```

脚本保留 `summary.received`，因为专题页展开子文章后，“用户提交数”可以小于“实际排队数”；实际队列总数写入 `summary.queued`。

## 3. 有界并发

1. 查询或依据当前 delegation 并发上限，只填充空闲槽位；默认最多 3 个 worker。
2. 每个 worker 只处理一条队列项，避免同一代理同时制作多篇而超过 turn 或上下文上限。
3. worker 的指令必须自包含，并要求它：
   - 先读当前 RuruOS `AGENTS.md` 与本 Skill；
   - 遵守 `public-only / no-login / no-cookie / no-account-action`；
   - 先去重，再抓取、图片本地化、富排版和回读验证；
   - 不安装文章提到的工具；
   - 不编辑队列文件；
   - 返回文章绝对路径、附件清单、图片数、验证结果和不确定项。
4. 子代理的文件写入是外部副作用。父代理必须实际回读文件并检查附件，不能只相信子代理总结。
5. delegation 本身不是持久任务；持久性来自 JSON 队列。会话恢复后，把仍为 `processing` 但无活跃 worker 的项目改回 `pending` 再调度。
6. 长文章优先为每个队列项分别发起单任务 delegation，而不是把多篇绑在一个 batch 结果里。独立任务完成后可立即回收槽位；批次结果会等待所有子任务，父会话中断时还可能把已经写出文件的任务统一报告为 interrupted。
7. **中断后先找产物，再重派。** 收到 `interrupted`、超时或无 summary 时，先按 `source_url` 搜索 `20-Reading/Articles/`，再核对 frontmatter、正文长度、图片引用与附件。若产物完整，按恢复产物验收并标记 `completion_source: artifact_recovery_after_interruption`；只有找不到可验证成品时，才把项目改回 `pending` 或重新派发。这样可避免重复文章和重复附件。
8. **不要让缺失通知长期占住并发位。** 即使系统尚未发出 `interrupted`，只要某个 `processing` 项明显久于同批同类任务，或连续多轮只有其他任务完成而它没有 summary，就主动按精确 `source_url` 扫描 `Articles/` 与 `Queue/`。找到成品后必须先做父代理完整验收；完整则标记 `completion_source: artifact_recovery_from_stale_processing`、释放槽位并补新任务，残缺则保持诚实状态，不得仅凭文件存在标记完成。异步通知是调度信号，不是成品存在性的唯一真相。

## 4. 父代理验收

每篇至少检查：

- 成品文件存在并符合当前 `article` schema；
- `source_url` 与 `dedup_key` 正确；
- 图片引用数、唯一数与实际附件一致，无缺图；
- 无 `mmbiz.qpic.cn` / `mmbiz.qlogo.cn` 等微信远程热链；
- 无二维码、关注、进群、赞赏、点赞三连等尾部噪声；
- 信息图关键文字已经转成可搜索正文、表格或代码块；
- 抓取或发布时间不确定项已如实写明。
- 若微信二次访问返回限制页，区分“成品文件已验证”和“原页图片数量未独立复核”。可将队列项标记为 `verified: true`，同时加简短的 `image_count_verification: source_recheck_blocked_by_wechat`；不要把 0 张图或子代理报告当作已与原页确认的事实。

验收通过后：

1. 将队列项改为 `completed`，写入 `verified: true`、成品路径和图片数；
2. 更新 summary 计数与 `updated_at`；
3. 立即从 `pending` 中补一个新任务到空闲槽位；
4. 只向用户简短报告标题、图片数、是否验证通过和“已自动接上下一篇”。

## 5. 特殊链接

### 公众号专题页

将专题页视为“合集入口”，不是普通单篇。公开解析专题标题、简介和文章链接，先去重并制作专题索引。

- 若用户明确要求全量处理，且去重后的新增子文章不超过 20 条、也不会让当前队列规模翻倍，可将独立文章追加为新队列项。
- 若新增子文章超过 20 条，或会让当前队列规模超过原来的 2 倍，默认只保存完整专题索引与可追溯子链接，队列项记录 `children_enqueued: false`；不要自动制造数百篇任务。向用户简短说明规模，并等待其明确选择全量、精选或不展开。
- 若页面要求登录或内容不完整，标记 `needs_review`，不可假装已展开全部文章。

公开专题页的可验证展开方法：

1. 首次请求 `/mp/appmsgtopic?...` 时不携带 Cookie，只使用普通公开浏览器 UA。解析 `window.cgiData` 中的 `topic.topic`、`topic.item_count`、`topic.read_count`、`topic.topic_hash`、首批 `topic_msgs` 和 `topic_paging`。
2. 翻页接口仍是公开 GET `/mp/appmsgtopic`，参数为 `action=topic_list`、`topic=<专题名>`、`paging=<上一页 topic_paging>`、`sort_type=<0|1>`，并保留原页的 `from` / `from_biz` / `from_msgid` / `from_itemidx` / `appid` 参数；不得携带用户 Cookie、登录态或执行账号动作。
3. `sort_type=0` 是“推荐”，可能只返回前 100 条；`sort_type=1` 是“最新”，首次可从空 `paging` 开始，往往能展开完整列表。分别分页到空批次或空 paging，按完整 `jump_url` 合并去重。
4. 只有当唯一 URL 数等于公开 `topic.item_count` 时，才能把索引视为按页面计数完整；否则进 `20-Reading/Queue/` 并如实记录 `extraction_status: failed` / `needs_review: true`（以实时 `AGENTS.md` 为准）。
5. 每条保留 `title`、`jump_url`、`send_time` 和 `biz_info.nick_name`。图片卡片的 `title` 可能为空，必须标“页面未提供标题”，不要用摘要、OCR 或账号文案猜标题。
6. 专题索引正文说明首次可见数、推荐/最新展开数、合并去重数、页面声明总数和无标题项数量。只本地化真正必要的专题头图；头像、卡片封面、二维码和推广素材默认不要保存。
7. 子文章只返回父代理或持久队列调度者；专题 worker 不直接处理子文章、不修改队列。父代理追加前还要按子文章 `source_url` 与 RuruOS `Articles/` / `Queue/` 去重。

### 小红书

- 队列与最终笔记只保存 `/explore/<note-id>` canonical URL；分享 token、追踪参数和账号相关参数不得落盘。
- 只抓公开可见内容，公开网页抓取或批量采集优先交给 Codex 执行，但 prompt 必须明确 `public-only / no-login / no-cookie / no-account-action / no-bypass`，并禁止读取或复用浏览器登录态。若 standalone Codex 在真正访问页面前因模型、CLI、推理档位或可选 MCP 初始化失败，先按 `codex-public-intake-runner-recovery.md` 恢复 runner；这类错误不是来源不可访问，也不得提前标记 `needs_review`。
- 先查 `source_url` 去重。若公开页面可完整读取，按实时 `AGENTS.md` 写入对应 article schema，并本地化公开图片、转写图中文字、验证附件与热链。
- 遇到登录墙、验证码、动态 token 失效或正文／图片不完整时，不得把标题、摘要或残缺截图伪装成完整笔记。只保存可验证公开部分，并按实时 schema 进入 `20-Reading/Queue/` / `needs_review`，明确缺失范围和阻塞原因。
- 不执行点赞、关注、收藏、评论、发布、扫码或其他账号操作；不得为了提高完整率绕过访问控制。

## 6. 模型分层与升级条件

批量入库通常由“父代理协调 + 单篇 worker + 确定性脚本”组成，不需要所有环节都使用旗舰模型。

- **协调层**：使用平衡档模型，负责去重、队列状态、交接判断、父代理验收和异常分流。
- **常规 worker**：使用轻量档模型，处理公开正文提取、章节整理、图片下载、图注和确定性检查；必须保留父代理回读，不能用更强模型替代验证。
- **升级到旗舰档**：仅限公开抓取反复受阻、图片卡片／复杂表格／混合媒体边界模糊、中断产物恢复、跨 Agent 长期规则或安全决策。
- **模型映射**：按「轻量 worker／均衡协调／困难任务旗舰升级」的分层原则映射到你所在平台当前的型号即可，不写死具体 slug。
- 机械抓取、固定 schema 写入和确定性校验不要默认使用 `-pro` 或最高推理强度；更高用量不能替代父代理回读与脚本验证。
- delegation 在派发时锁定模型；修改配置不会改变正在运行的 worker，只影响之后启动的任务。
- 为保持同一批次质量一致，不在批次中途切换默认模型。用户要求调整时，把目标配置写入队列的 `post_batch_action`，等所有 items 进入终态后再应用并验证。
- 模型列表和层级可能变化；配置前用你所在平台的模型列表命令检查。型号变化时保留“轻量 worker／均衡协调／困难任务旗舰升级”的分层原则，不把旧 slug 当作永久依赖。

## 7. 成本控制

- 批量接收、去重、队列写入和只读检查应合并调用。
- 不把完整原始 HTML 或巨大的 DOM 解析结果反复送回上下文；脚本在本地提取标题、正文块、候选图片和元数据，只返回精简结构。
- 只有信息图、图中文字或正文/广告边界不明确时才调用视觉分析。
- 不为每个常规工具调用发送进度消息；只在接收批次、单篇完成、失败或需要复核时更新。
