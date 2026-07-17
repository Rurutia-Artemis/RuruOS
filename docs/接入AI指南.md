# 接入 AI 指南

RuruOS 的数据层是纯 markdown + frontmatter，所以**任何**能读写文件或输出文本的智能体都能接入。插件内置的 AI 按钮也不绑定某一家——本机装了哪个 agent CLI，就用哪个。

## 先分清：哪些功能联网免费、哪些消耗 AI 额度

| 功能 | 走什么 | 花钱吗 |
|---|---|---|
| 搜剧、选海报、分季、集数 | TVmaze / 豆瓣 免费公开 API | 不花 |
| 天气卡 | Open-Meteo 免费 API | 不花 |
| 农历、小黄历、时钟 | 本地推算，零网络 | 不花 |
| 「补剧集资料」（建档后自动补中文名/评分/简介） | 本机 AI CLI | 消耗该 AI 的额度 |
| 「搜评分」「收录简介」按钮 | 本机 AI CLI | 消耗该 AI 的额度 |
| 已读/珍藏自动浓缩归档、「整理」按钮 | 本机 AI CLI | 消耗该 AI 的额度 |
| 中文剧名转译兜底（豆瓣也搜不到时才触发） | 本机 AI CLI | 消耗很少 |

**自动浓缩归档**（v1.1）：在阅读器点「标记已读」或「☆ 珍藏」，后台自动把这一篇提炼成 5-10 条要点笔记放进 `50-Knowledge/` 对应主题目录；介绍同一个 AI skill 的文章会聚合进同一份 `Skill档案/`。浓缩完，非珍藏的原文移进库内 `.trash/`——**不会永久删除**；珍藏的原文永久保留，主屏「知识沉淀」卡的「珍藏」筛选就是它们的书架。触发时机只有你自己点已读/珍藏，一次跑一篇。
**整理按钮**：图书馆管理员——补漏浓缩、清走已浓缩的非珍藏文章、skill 档案合并去重、散落笔记归位。手动触发，后台跑完弹通知。

## 插件 AI 按钮：装哪个工具都行

插件启动时按顺序探测本机装了哪个 agent CLI，第一个找到的就当引擎：

| 引擎 | 工具 | 说明 |
|---|---|---|
| `claude` | [Claude Code](https://claude.com/claude-code)（Anthropic） | 参考实现，联网查证支持最完整 |
| `codex` | [Codex CLI](https://github.com/openai/codex)（OpenAI） | 走 `codex exec` 非交互模式 |
| `gemini` | [Gemini CLI](https://github.com/google-gemini/gemini-cli)（Google） | `-p` + `--yolo` |
| `qwen` | [Qwen Code](https://github.com/QwenLM/qwen-code)（阿里通义） | 同 Gemini 用法，国内直连 |
| `iflow` | [iFlow CLI 心流](https://github.com/iflow-ai/iflow-cli) | 同 Gemini 用法，国内直连 |
| `opencode` | [OpenCode](https://github.com/sst/opencode) | `opencode run`，可自配任意模型 |

装好任意一个并登录，重载 Obsidian，AI 按钮即激活（启动通知会显示当前引擎名）。

- **强制指定某家**：`.obsidian/plugins/obos-home/main.js` 顶部「公开版配置区」，`AI_ENGINE_FORCE = 'codex'`
- **装在非常规路径**：往对应引擎的 `bins` 数组加你的绝对路径
- **想接列表外的工具**（国内外新工具层出不穷）：在 `AI_ENGINES` 里照格式加一项，只需要它满足两个条件——支持非交互执行一句 prompt、能在工作目录里改文件。三套参数：`edit`（改文件任务）、`editWeb`（需联网查证的任务）、`ask`（快问快答取最后一行输出）

**坦白局**：六个引擎里我们只实测过 Claude Code（作者自用），其余五家的参数按各家官方文档配置，没跑过真机。哪家参数不对，改 `AI_ENGINES` 里那一行就能修——欢迎提 PR。另注：各家 CLI 的联网能力不同——claude 通过 `--allowedTools` 显式放行搜索；其他引擎能不能查豆瓣/IMDb 取决于该工具自身的联网设定。

## 对话式整理入库（不走按钮也行）

- **Claude Code**：终端 `cd` 到库目录跑 `claude`，自动读 `CLAUDE.md` / `AGENTS.md`，直接说「把这篇文章收进库里」「帮我把这部剧建档」
- **Codex / Qwen Code / iFlow**：同样 `cd` 到库目录启动，`AGENTS.md` 自动生效（这三家都认这个文件）
- **其他 CLI**：在它的规则文件里写一行「写入本库前先完整阅读 AGENTS.md 并严格遵守」

## 聊天型 / 云端智能体（Hermes、Grok、ChatGPT、Coze/扣子…）

它们碰不到你的文件系统也没关系：

1. 把根目录的 **`给智能体的说明书.md`** 全文设为它的系统提示词（或上传为知识文件）
2. 之后把文章链接、剧名、账目丢给它，让它**输出符合规范的完整 markdown 文件内容**（含 frontmatter）
3. 你把输出保存为 `.md` 文件放进说明书指定的目录——文件一落地，中枢界面自动更新

如果你的智能体平台带文件系统/仓库写入能力，直接让它按说明书写入对应目录即可，效果与本地 CLI 相同。
