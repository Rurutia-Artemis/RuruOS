# Perplexity API 使用策略

更新时间：2026-06-30

## 当前分配

| Agent/Profile | 是否配置 Perplexity key | 决策 |
|---|---:|---|
| Grace | 是 | 主协调、市场判断、每日雷达、跨项目研究默认可用 |
| Lisa | 是 | 已配置；用于 Skill/工具/文章/方法论调研与治理判断 |
| Mia | 否 | 暂不给默认 key；由 Grace 按任务触发，避免媒体 intake 高流量误消耗 |
| Atlas | 否 | 暂不给默认 key；工程验证优先本地/官方文档/代码，市场或安全情报由 Grace/Lisa 提供 Perplexity 结果 |
| Hygeia | 否 | 不配置；健康问题不以网页搜索替代专业判断，必要时由 Grace 单次检索并标注来源 |

## 为什么先给 Lisa

Lisa 负责 Skill 治理、工具价值判断、文章转 Skill、外部方法论吸收。此类任务需要高质量来源、对比和引用，适合 Perplexity。

Lisa 使用边界：

- 默认用 `sonar-pro`；
- 重要 Skill 审计/工具选型才用 `sonar-deep-research`；
- 任何结论默认标为 `Perplexity-cited` 或 `Lisa preliminary`；
- 只有经过 Claude 交叉验证 + 本地 PoC/测试后才标 `verified`；
- 不把 API key 写入 Skill、Obsidian、prompt 或日志。

## Mia 是否给 key

暂不默认给。

原因：

- Mia 主要是 intake / inbox / Obsidian 队列 / 生活助理，不应在大量链接、视频、素材处理中自动触发付费深研；
- Mia 的任务很多是整理、归档、摘要，不一定需要 citation-backed deep research；
- 如果以后 Mia 有明确“每周资料队列研究汇总”或“指定主题调研”，可以给 Mia 配 key，但要加预算/频率约束。

Mia 当前推荐用法：

1. Mia 收集/归档/去重；
2. Grace 判断是否值得调研；
3. Grace 或 Lisa 用 Perplexity 研究；
4. 结果回写 Obsidian。

## Atlas 是否给 key

暂不默认给。

原因：

- Atlas 是工程/项目执行角色，主要任务是代码、PoC、安全、CLI、部署、验证；
- Atlas 容易在调试中高频调用工具，不适合默认挂研究 key；
- 工程任务优先使用官方文档、源码、本地测试、GitHub/包管理器信息；需要市场/竞品/安全情报时由 Grace/Lisa 提供 Perplexity 研究包。

可给 Atlas 的条件：

- Atlas 正在做工具选型、竞品 PoC、安全情报、技术路线调研；
- 需要在工程上下文里直接调用 Perplexity；
- Grace 明确授权该任务可用；
- 仍需避免在代码仓库、日志、测试输出中泄露 key。

## 何时用 Perplexity

优先用：

- 市场研究、竞品、价格锚点；
- 日本/中国/全球跨语言公开资料搜索；
- 工具/Skill/Agent 方法论价值判断；
- 需要 citations/search_results 的决策前研究；
- 每日/每周雷达扫描。

不用或少用：

- 已知 URL 的简单摘录；
- 本地文件、代码、日志、Git 历史；
- 简单事实或低价值问题；
- 医疗建议直接替代医生判断；
- 高并发媒体 intake。

## 模型选择

| 场景 | 模型 |
|---|---|
| 普通市场搜索/竞品/价格 | `sonar-pro` |
| 复杂长报告/尽调/季度策略 | `sonar-deep-research` |
| 快速事实核验 | `sonar-pro` + low/medium context |

## 成本观测

2026-06-30 实测：

- 日本市场复核：`sonar-pro + high`，约 81.75 秒，15 citations，成本约 `$0.12062`；
- MEO 诊断项研究：`sonar-pro + medium`，15 citations，成本约 `$0.07086`。

结论：成本可接受，可以多用，但仍要区分高价值研究与普通整理。

## 安全规则

- key 不进聊天、不进 Obsidian、不进 Git、不进 prompt；
- key 只放 profile `.env`，文件权限 `0600`；
- 如果 key 曾暴露在聊天，应轮换；
- 新 key 用本机隐藏输入脚本写入，不再粘贴聊天。
