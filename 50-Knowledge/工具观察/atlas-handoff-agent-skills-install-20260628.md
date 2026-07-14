---
type: atlas_handoff
status: atlas_reviewed
created: 2026-06-28
source: GitHub Trending Weekly 2026-06-27
related_note: Mia/ToolWatch/github-trending-weekly-20260627.md
---

# 给 Atlas：Agent / Skill 工具安装与后续评估

用户授权：“觉得有用就安装”。Mia 已完成第一轮安全安装/撤回。

## 已安装给 Claude Code + Codex 的 Skills

安装路径：`~/.agents/skills/`，通过 `npx skills add ... -g -a claude-code codex --copy -y` 安装。

### addyosmani/agent-skills（已选装 13 个）

- `using-agent-skills`
- `context-engineering`
- `source-driven-development`
- `spec-driven-development`
- `planning-and-task-breakdown`
- `incremental-implementation`
- `test-driven-development`
- `debugging-and-error-recovery`
- `code-review-and-quality`
- `code-simplification`
- `security-and-hardening`
- `documentation-and-adrs`
- `doubt-driven-development`

用途：工程 Agent 的规范、计划、实现、测试、Review、安全、文档与上下文管理。

### phuryn/pm-skills（已选装 14 个）

- `interview-script`
- `summarize-interview`
- `opportunity-solution-tree`
- `identify-assumptions-existing`
- `identify-assumptions-new`
- `prioritize-assumptions`
- `prioritize-features`
- `create-prd`
- `strategy-red-team`
- `pre-mortem`
- `metrics-dashboard`
- `north-star-metric`
- `product-strategy`
- `gtm-strategy`

用途：产品发现、PRD、优先级、策略红队、指标与 GTM。

## 已安装工具

### Headroom

- 安装方式：`pipx install 'headroom-ai[all]'`
- 版本：`headroom 0.27.0`
- 可执行文件：`/Users/rurutia/.local/bin/headroom`
- 已执行：`headroom doctor`
- 当前状态：已安装但未 wrap Claude/Codex；doctor 显示 proxy 未运行、Claude/Codex 尚未路由。
- 建议：Atlas 评估后再决定是否执行 `headroom wrap claude` / `headroom wrap codex`，不要由 Mia 直接改 agent 路由。

### SkillSpector

- 安装方式：先 `brew install python@3.13`，再 `pipx install --python /opt/homebrew/bin/python3.13 git+https://github.com/NVIDIA/SkillSpector.git`
- 版本：`skillspector 2.3.7`
- 可执行文件：`/Users/rurutia/.local/bin/skillspector`
- 用途：外部 Skill 安全扫描。

## 已撤回 / 暂缓

### mvanhorn/last30days-skill

- 起初已安装，但 `skillspector scan --no-llm` 报告：`CRITICAL / DO NOT INSTALL`。
- 已执行撤回：`npx skills remove last30days -g -a claude-code codex -y`
- 报告位置：`Mia/ToolWatch/reports/skillspector-last30days-20260628.md`
- 建议：Atlas 先审计脚本权限、cookie 读取、平台抓取、依赖与密钥边界，再决定是否重新安装或改为隔离运行。

### Agent-Reach

- 本机 pipx 里已存在：`agent-reach 1.5.0`。
- 未在本轮新装。
- 风险：多平台抓取、cookie/登录、隐私与合规。
- 建议：Atlas 检查 `agent-reach doctor` 与配置边界后再启用给生产 Agent。

## 暂不安装

- `open-notebook`：观察，不替换 Obsidian。
- `tolaria`：观察，AGPL 许可需谨慎。
- `apple/container`：基础设施方向，非 Mia 当前所需。
- `iptv-org/iptv`：无关，忽略。

## Atlas 下一步建议

1. 用 SkillSpector 批量扫描新装的 `~/.agents/skills/*`，建立 baseline。
2. 对 `last30days` 做人工安全审计；如果要用，优先隔离环境运行。
3. 对 Headroom 先在临时 Codex/Claude 会话测试，再决定是否 wrap 常用 Agent。
4. 如需接入 Agent-Reach，先明确 cookie/登录/平台合规边界。
