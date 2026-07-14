---
type: atlas_handoff
status: implemented_needs_light_review
created: 2026-06-28
related_skill: wechat-article-reader
scope: Codex and Claude Code global skills
---

# 给 Atlas：微信公众号文章读取 Skill

## 背景

用户要求做一个 Skill，让 Codex 和 Claude Code 能读取微信公众号文章。

## 已实施

创建并安装本地 Skill：

- 共享入口：`/Users/rurutia/.agents/skills/wechat-article-reader/`
- Claude Code：`/Users/rurutia/.claude/skills/wechat-article-reader/`
- Codex：`/Users/rurutia/.codex/skills/wechat-article-reader/`

包含：

- `SKILL.md`
- `scripts/read_wechat_article.py`

## 边界

- 只读取公开 `mp.weixin.qq.com/s/...` 页面。
- 不使用 cookies。
- 不登录。
- 不扫码。
- 不做账号动作。
- 不批量爬取。
- 被阻断时返回 blocked，不绕过。

## 验证结果

测试 URL：`https://mp.weixin.qq.com/s/2XBfezdhYY5aFHapXJoQog`

结果：

- `status: extracted`
- 标题：`claude code 别裸奔！装上这3个mcp，效率暴增500%。`
- 输出：`/private/tmp/wechat-skill-test/claude-code-别裸奔-装上这3个mcp-效率暴增500-604cd3779b.md`
- 正文长度：2193 字符

`npx skills list` 已显示：

- `wechat-article-reader` → Codex, Claude Code

SkillSpector 扫描：

- Score：14/100
- Severity：LOW
- Recommendation：SAFE

静态扫描提示为声明权限/自主决策类保守提示；实际脚本只有公开 HTTP GET 和写入用户指定目录的 Markdown。

## 建议 Atlas 后续轻量复核

- 检查脚本是否需要进一步限制输出目录。
- 检查是否要把它包成正式 repo skill，方便后续 `npx skills add` 管理。
- 如果未来要支持更复杂的公众号/图文/图片保留，应另做 Worker 能力，不要在这个 Skill 里引入登录态。
