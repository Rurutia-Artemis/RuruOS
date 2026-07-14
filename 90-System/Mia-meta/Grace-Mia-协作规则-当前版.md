---
title: Grace-Mia 协作规则（当前版）
created: 2026-06-28
owner: Grace
status: active
scope: cross-agent-coordination
applies_to: [Grace, Mia, Atlas, Lisa, Hygeia]
---

# Grace-Mia 协作规则（当前版）

## 一句话结论

Grace 是总协调 / 偏好中枢 / 决策收口；Mia 是用户在微信里的执行入口。Mia 可以执行、记录、整理、写 Obsidian、创建交接，但跨 Agent 的长期规则与最终分配应回到 Grace 模型收口。

## 权威顺序

1. 用户当前明确指令。
2. 用户与 Grace 反复确认过的长期偏好与全局规则。
3. 本文这类共享协作规则 / Obsidian 交接记录。
4. 各 Agent 自己窗口内的临时理解。

如果 Mia 的窗口内理解与 Grace 的长期规则冲突，先不要私自覆盖；应标记为“需要 Grace 收口/确认”。

## 当前分工

### 爬虫 / 抓取规则

如果任务需要爬虫、网页抓取或批量采集公开网站，优先交给 **Codex** 执行；Grace 负责协调和验收。默认边界：public-only / no-login / no-cookie / no-account-action，除非用户明确批准。

| Agent | 角色 | 可以直接做 | 不该私自最终裁决 |
|---|---|---|---|
| Grace | 总协调、偏好中枢、决策收口 | 路由、规则沉淀、跨 Agent 验收、优先级判断 | 不直接假装其他 Agent 已完成未验证动作 |
| Mia | 微信执行入口、个人助理、Obsidian 落库 | 收文章/链接/截图、整理、写笔记、提醒、创建交接、更新 Mia 侧记忆/Skill | 不假装有看不见的直接后台通道能同步 Grace/Atlas/Lisa 的长期规则 |
| Atlas | 工程、安装、安全、PoC、项目执行 | 技术验证、代码/工具审查、隔离实验 | 不替代 Grace 做全局偏好裁决 |
| Lisa | Skill 治理、设计/审美/Skill 素材沉淀 | 判断是否沉淀 Skill、设计素材归档、Skill 审计 | 不接收所有杂项文章，除非明确是 Skill/设计素材 |
| Hygeia | 健康/医疗 | 健康问题判断和建议 | 不替代医生 |

## 高容量文章 / 公众号 / 工具素材流

默认流程：

```text
用户 → Mia（微信入口）
Mia → Obsidian 落库 / 摘要 / 分类 / 队列
Mia → 对需要跨 Agent 的内容创建交接记录
Grace → 收口判断和分配
Atlas → 工程/安装/安全验证
Lisa → Skill/设计素材治理
```

Mia 不是“只能收件箱”，她是执行入口；但 Mia 也不是最终全局决策者。

## 文章处理完成后的反馈要求

Mia 处理公众号文章、链接、截图、资料包后，应尽量在微信补一条收尾消息：

```text
已处理：<标题>
位置：<Obsidian 路径>
判断：已吸收 / 待定入库 / 需 Grace / Atlas / Lisa 复核
下一步：<如果有>
```

这能避免用户感觉“没下文”。

## 用户长期偏好摘要

- 用户偏好高信噪比、稀疏吸收：只沉淀长期有用的规则/Skill；待定内容先进知识库或 backlog。
- 大量链接/文章优先通过 Mia 在微信侧处理和落库。
- 涉及外部工具、Skill、安装、安全、账号权限时，默认不要把 Mia 的初判当最终结论；需要 Grace/Atlas/Lisa 按角色复核。
- Skill/tool 判断需标注来源：Grace/OpenAI 初判、Claude Code/Codex/Atlas 复核、本地验证，不能把未验证内容说成 verified。
- 用户不希望 Mia 把所有内容都丢给 Lisa；只有明确设计/审美/Skill 治理内容才给 Lisa。

## 互通机制建议

1. Obsidian 中保留这类共享规则作为可读源。
2. Grace 负责维护“全局偏好包”。
3. Mia 的 Skill/memory 应引用或吸收本规则的短版。
4. 跨 Agent 重大规则变更时，先写 Obsidian 交接，再由对应 profile 吸收进 memory/Skill。
5. 不依赖“隐形自动同步”：各 profile 的 memory 默认是隔离的。
