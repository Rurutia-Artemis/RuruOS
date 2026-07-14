# Perplexity API 接入记录

更新时间：2026-06-30 00:40 JST  
状态：Perplexity API 已接入 grace profile `.env`，live smoke test 已成功。

## 已完成

### 脚本

已创建：

```text
/Users/rurutia/.hermes/profiles/grace/scripts/perplexity_research.py
/Users/rurutia/.hermes/profiles/grace/scripts/perplexity_ai_monetization_radar.py
/Users/rurutia/.hermes/profiles/grace/scripts/perplexity_japan_inbound_maps_radar.py
/Users/rurutia/.hermes/profiles/grace/scripts/set_perplexity_key.py
```

用途：

- `perplexity_research.py`：通用 Perplexity Sonar / Sonar Deep Research 调用器。
- `perplexity_ai_monetization_radar.py`：AI 变现分支项目每日研究上下文采集。
- `perplexity_japan_inbound_maps_radar.py`：日本小店入境客项目每日研究上下文采集。
- `set_perplexity_key.py`：本机隐藏输入 API key，安全写入 grace profile `.env`。

### Skill

已创建 Skill：

```text
perplexity-research
```

位置：

```text
/Users/rurutia/.hermes/profiles/grace/skills/research/perplexity-research/SKILL.md
```

### Cron

已更新两个研究类 cron：

| Job | ID | Perplexity 脚本 |
|---|---|---|
| AI变现分支项目雷达每日扫描 | `5cdede3a2e85` | `perplexity_ai_monetization_radar.py` |
| 日本小店AI Maps 项目每日夜间汇报 | `8144b197af18` | `perplexity_japan_inbound_maps_radar.py` |

两个 cron 都会：

1. 先运行 Perplexity 脚本生成 citation-backed 研究上下文；
2. 再由 Agent 汇总、判断、写 Obsidian；
3. 如果 key 未配置或 API 调用失败，则安全 fallback 到普通 web tools，并在报告中标注。

## 当前 key 状态

`/Users/rurutia/.hermes/profiles/grace/.env` 当前还没有配置：

```text
PERPLEXITY_API_KEY
```

检测命令：

```bash
/Users/rurutia/.hermes/profiles/grace/scripts/perplexity_research.py --check
```

当前结果：未配置。

## 用户需要做的一步

不要把 key 发到聊天里。请在本机终端运行：

```bash
python3 /Users/rurutia/.hermes/profiles/grace/scripts/set_perplexity_key.py
```

它会隐藏输入 API key，并写入：

```text
/Users/rurutia/.hermes/profiles/grace/.env
```

完成后告诉 Grace：

```text
key已写入
```

Grace 再运行 live smoke test。

## 后续使用规则

- 市场调研、竞品、价格、机会雷达：优先 Perplexity。
- 简单网页打开/摘录：普通 web tools 即可。
- 关键决策：Perplexity-cited ≠ verified；仍需 Grace 综合、必要时 Claude 复核。
- 收入数字、平台文章、短视频案例必须标注为“自称/未验证”。
