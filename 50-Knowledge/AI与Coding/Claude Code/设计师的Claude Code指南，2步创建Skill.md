---
title: 设计师的 Claude Code 指南，2步创建 Skill
author:
platform: xiaohongshu
date:
url: "https://www.xiaohongshu.com/discovery/item/6a3d2d370000000011012ac6?source=webshare&xhsshare=pc_web&xsec_token=ABFP0Qr0ky4wxA3lysa8XH9J0flFvPwLDerpQID-UjOqk=&xsec_source=pc_share"
tags: [howto用好AI, vibecoding, 人工智能, 设计师, claude, ai工具, 大模型, 教程, 设计教程, 自学]
category: AI
workflow: ai-video
review_status: reviewed
duration: 270.583
---
# Summary
这条视频是「设计师 Claude Code 指南」第二期，重点解释 Skill 在 Design Stack 里的位置，以及如何用官方 Skill Creator 创建自己的 Skill。核心观点是：MCP 负责让 Claude Code 访问工具和外部资源，而 Skill 负责告诉 Claude Code 如何以正确流程使用这些能力。对设计师来说，Skill 像一份专项培训手册，可以把设计工作流、质量标准、Figma 规范、浏览器调研方法固化下来，减少 agent 走弯路和浪费 token。

# Core Ideas
- Design Stack 由 `CLAUDE.md`、`DESIGN.md`、MCP 和 Skills 组成。
- `CLAUDE.md` 像创意总监，保存项目目标，避免上下文压缩后跑偏。
- `DESIGN.md` 像设计总监，保存设计系统规范和执行标准。
- MCP 提供工具访问能力，Skill 提供“如何用好工具”的知识层。
- Skill 是指令、脚本和资源的集合，可以把 Claude Code 训练成某类任务的专家。
- 设计师可以安装现成 Skill，也可以用 Skill Creator 自己创建 Skill。
- 团队级 Skill library 可能会成为趋势，因为它可以把团队的工作标准和审美规范沉淀成可复用能力。

# Step-by-step Process
1. 先搭好 Design Stack：`CLAUDE.md`、`DESIGN.md`、MCP、Skills。
2. 明确 Skill 要解决的具体任务，不要做成泛泛而谈的提示词。
3. 安装官方 `Skill Creator`。
4. 用一条 Prompt 描述你想要的 Skill。
5. Prompt 里至少写清楚三个东西：Skill 名字、执行工作流、最终目标。
6. 用 Skill Creator 的 Eval / Improve / Benchmark 模式测试和优化 Skill。
7. 把成熟 Skill 分享给团队，让其他成员也使用同一套标准。

# Tools Mentioned
- Claude Code
- `CLAUDE.md`
- `DESIGN.md`
- MCP
- Skills
- Skill Creator
- Web Access
- Claude Code to Figma
- Figma
- Figma tokens
- Figma components
- Auto Layout
- 前端设计专项 Skill（视频转写名称需复核）
- Claude Plugins
- Claude Marketplace

# Important Quotes
- "MCP 给的是工具访问的能力，Skill 就是如何用好这些工具的知识层。"
- "Skill 是一组指令、脚本还有资源的集合。"
- "你可以把它理解为 Claude Code 的一个专项培训手册。"
- "找不到你需要的 Skill，其实非常鼓励大家自己做一个 Skill。"
- "这套 Design Stack，本质上就是正式开工之前，给 Claude Code 做的一次入职 onboarding。"
- "配好之后，它对你项目的理解、对你设计语言的把握，跟裸用 Claude Code 完全不是一回事。"

# Key Numbers
- 3 个部分 - 视频回顾 Design Stack 的三块核心：`CLAUDE.md`、`DESIGN.md`、MCP/Skills。
- 3 个 Skill - 作者列举了自己常用且认为设计师必要的 Skill。
- 2 步 - 创建 Skill 的基本流程：安装 Skill Creator，用 Prompt 描述需求。
- 3 个 Prompt 要素 - 名字、工作流、最终目标。
- 17 个设计指令 - 作者提到某个前端设计专项 Skill 提供 17 个设计指令，用于减少 AI 生成内容的模板感和廉价感。

# Timeline
- 00:00 - 开场，说明这是面向设计师的 Claude Code 指南第二期。
- 00:05 - 回顾上一期：如何把 Claude Code 配置成设计师工作场景。
- 00:15 - 回顾 Design Stack 的组成。
- 00:17 - `CLAUDE.md`：项目创意总监，保存整体目标。
- 00:26 - `DESIGN.md`：设计总监，保存设计系统规范。
- 00:35 - MCP 和 Skill：专家工具箱。
- 00:48 - 本期聚焦 Skill。
- 00:51 - 定义 Skill：如何用好工具的知识层。
- 01:08 - 列举设计师常用 Skill。
- 01:13 - Web Access：拓宽 Claude Code 访问互联网和登录网站的能力。
- 01:31 - Claude Code to Figma：让 Claude 在 Figma 生成内容时遵守设计系统。
- 01:48 - 前端设计专项 Skill：提供设计指令，提高 UI 生成质量。
- 02:01 - 获取更多 Skill：官方 Plugins 和社区 Marketplace。
- 02:26 - 找不到合适 Skill 时，可以自己创建。
- 02:42 - Skill Creator 的两步创建流程。
- 02:50 - 创建 Skill 的 Prompt 要素：名字、工作流、目标。
- 03:04 - Skill Creator 提供 Eval / Improve / Benchmark 模式。
- 03:20 - 作者举例 Claude Code to Figma Skill。
- 03:26 - Skill 可以作为 enforcement layer，强制检查 Figma 产出质量。
- 03:42 - 团队成员安装同一个 Skill，形成团队级 Skill library。
- 03:55 - 总结 Design Stack：项目目标、设计系统、外部工具、专项最佳实践。
- 04:22 - 下一期会讲 research、design、prototype 的具体 use cases。

# Detailed Notes
## Skill 在 Design Stack 里的位置
上一期讲的 Design Stack 包括 `CLAUDE.md`、`DESIGN.md`、MCP 和 Skills。它们分别解决不同层次的问题：

- `CLAUDE.md`：让 Claude Code 始终知道项目目标和边界。
- `DESIGN.md`：让 Claude Code 始终遵守设计系统。
- MCP：让 Claude Code 访问外部工具、网页、Figma 等资源。
- Skill：让 Claude Code 知道如何用正确步骤完成特定任务。

因此，MCP 解决“能不能用工具”的问题，Skill 解决“会不会按正确方法使用工具”的问题。

## Skill 的本质
Skill 不是单条 Prompt，而是一组可以复用的任务知识包。它可以包含：

- 指令
- 操作流程
- 脚本
- 资源
- 评估标准
- 最佳实践

它的价值是减少 agent 临场摸索，避免走弯路、浪费 token 或产出风格不稳定。

## 设计师常用 Skill
作者提到三个对设计师有价值的 Skill：

1. **Web Access**  
   扩展 Claude Code 的联网能力，尤其适合访问需要登录的网站、社交媒体、论坛和封闭生态，用于用户调研和信息收集。

2. **Claude Code to Figma**  
   作者自制 Skill，目标是让 Claude 在 Figma 中生成内容时严格遵守设计系统，包括使用 Figma tokens、组件和 Auto Layout。关键点是生成结果要能继续在 Figma 中迭代，而不是不可维护的硬编码内容。

3. **前端设计专项 Skill**  
   用于提升 AI 生成 UI 的品质，减少模板感、廉价感和“AI 味”。视频中提到它有 17 个设计指令。

## 如何创建自己的 Skill
如果现成 Skill 不满足需求，可以用官方 Skill Creator 创建自己的 Skill。基本流程：

1. 安装 Skill Creator。
2. 用 Prompt 说明你想要的 Skill。

Prompt 应该至少包含：

- Skill 名字
- 执行步骤 / 工作流
- 最终目标 / 质量标准

创建后，还可以用 Eval、Improve、Benchmark 等模式测试和优化 Skill。

## Claude Code to Figma 的例子
作者把自己的 Claude Code to Figma Skill 描述成一个 enforcement layer。它像施工监管一样，要求 Claude 在 Figma 里每一步生成内容时都对照设计系统检查。

这个思路很重要：Skill 不只是“帮助生成”，还可以“强制检查”。对设计工作来说，质量控制比单纯生成更关键。

## 团队级 Skill Library
作者提到自己把 Skill 分享给团队，其他成员也安装使用，效果不错。这暗示一个趋势：未来每个团队可能会维护自己的 Skill library，把团队的方法论、审美标准、质量检查流程沉淀下来。

# Action Items
- [ ] 为自己的 Claude Code 工作流梳理常见重复任务。
- [ ] 判断哪些任务适合沉淀成 Skill，而不是每次手写 Prompt。
- [ ] 安装或测试 Skill Creator。
- [ ] 为设计工作流写一个 Skill 创建 Prompt，包含名字、步骤、目标。
- [ ] 为 Figma 相关任务明确设计系统遵循规则。
- [ ] 建立团队/个人 Skill library，把高频流程沉淀下来。
- [ ] 后续关注作者关于 research、design、prototype use cases 的第三期。

# Related Topics
- [[Claude Code]]
- [[Skills]]
- [[Skill Creator]]
- [[MCP]]
- [[CLAUDE.md]]
- [[DESIGN.md]]
- [[Figma MCP]]
- [[Design System]]
- [[AI for Design]]
- [[Vibe Coding]]
- [[Prompt Engineering]]

# Keywords
Claude Code, Skill, Skill Creator, MCP, Design Stack, CLAUDE.md, DESIGN.md, Figma, Figma tokens, Auto Layout, AI design workflow, designer workflow, vibecoding, AI coding agent, team skill library
