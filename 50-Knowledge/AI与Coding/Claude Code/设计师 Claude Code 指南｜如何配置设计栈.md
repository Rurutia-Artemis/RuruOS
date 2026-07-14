---
title: 设计师 Claude Code 指南｜如何配置设计栈
author:
platform: xiaohongshu
date:
url: "https://www.xiaohongshu.com/discovery/item/6a366b940000000011006367?source=webshare&xhsshare=pc_web&xsec_token=ABQsGba3ZRQQoYpNLOeJvuPS8__yp9sPvjtHX_v0e5JWo=&xsec_source=pc_share"
tags: [人工智能, vibecoding, claude, 设计师, ai工具, 教程, 设计教程]
category: AI
workflow: ai-video
review_status: reviewed
duration: 395.367
---
# Summary
这条视频讲的是设计师如何把 Claude Code 配置成更适合设计工作的 AI coding agent。核心方法是先搭建一套 "design stack"：用 `CLAUDE.md` 固定项目 brief 和长期上下文，用 `DESIGN.md` 把设计系统转成 AI 可执行的规范，再用 MCP 和 Skills 连接 Figma、浏览器验证等外部能力。重点不是让 Claude Code 直接开始写代码，而是先让它理解项目目标、设计系统和工具边界，从而以设计师/设计总监的角色参与工作。

# Core Ideas
- Claude Code 默认更偏开发者工具，但它高度可配置，可以被调成设计师工作环境。
- 设计师使用 Claude Code 前，应该先搭一套 "design stack"，类似开发者的 tech stack。
- `CLAUDE.md` 是项目级 brief，作用像创意总监，确保 Claude 在长对话和上下文压缩后不跑偏。
- `DESIGN.md` 是设计系统执行文件，作用像设计总监，约束 UI、组件、配色、字体、间距和状态。
- MCP 和 Skills 是专家工具箱：MCP 连接外部工具，Skills 为特定任务提供最佳实践。
- MCP 不是越多越好，装太多会让 agent 反应变慢、注意力变散。
- 对设计师最值得优先装的 MCP 是 Figma MCP 和 Playwright MCP。

# Step-by-step Process
1. 创建 `CLAUDE.md`，控制在约 200 词以内。
2. 在 `CLAUDE.md` 中写清楚项目目标：产品是什么、给谁用、解决什么问题。
3. 写入首要规则，例如：改 UI 前必须先读 `DESIGN.md`，必须遵循设计系统。
4. 写入 quick reference，也就是关键的 do / don't 和项目约束。
5. 创建 `DESIGN.md`，把 Figma 里的设计系统翻译成 Claude Code 能读、能执行的格式。
6. 在 `DESIGN.md` 中保留两层内容：机器读的 design tokens，以及人/agent 都能理解的使用说明。
7. 安装必要 MCP：优先 Figma MCP 和 Playwright MCP。
8. 后续再按任务添加 Skills，让专门任务用专门流程处理。

# Tools Mentioned
- Claude Code
- `CLAUDE.md`
- `DESIGN.md`
- Figma
- Figma MCP
- Playwright MCP
- Mobbin MCP
- Magic MCP
- MCP
- Skills
- YAML
- Markdown

# Important Quotes
- "让 Claude 以设计师的身份来帮助你完成工作，而不只是一个泛用的 coding agent。"
- "先花十分钟把环境配好，后面所有的设计工作都会顺很多。"
- "`CLAUDE.md` 是整个项目的 brief。"
- "`DESIGN.md` 更像是一个设计总监。"
- "MCP 和 Skill 更像是专家的工具箱。"
- "MCP 不是装得越多越好，连得越多，反应也会越慢。"

# Key Numbers
- 约 200 词 - `CLAUDE.md` 建议控制长度，避免太长导致每次读取成本高、注意力分散。
- 约 10 分钟 - 作者认为前期配置设计环境的时间成本很低，但后续收益很高。

# Timeline
- 00:00 - 开场，说明这是面向设计师的 Claude Code 指南。
- 00:14 - 介绍系列分两部分：setup 和具体 use cases。
- 00:38 - 本期聚焦 setup，也就是设计师如何配置 Claude Code。
- 00:56 - 提出 design stack 的概念。
- 01:32 - 总览三部分：`CLAUDE.md`、`DESIGN.md`、MCP/Skills。
- 01:40 - `CLAUDE.md` 的角色：项目 brief / 创意总监。
- 01:58 - `DESIGN.md` 的角色：设计系统和执行规范 / 设计总监。
- 02:17 - MCP 和 Skills 的角色：专家工具箱。
- 02:54 - 解释为什么需要 `CLAUDE.md`：对抗上下文窗口和长对话遗忘。
- 03:19 - `CLAUDE.md` 的写法：project goal、ground rules、quick reference。
- 04:09 - `DESIGN.md` 的作用：把 Figma 设计系统翻译成 AI 可执行格式。
- 04:47 - `DESIGN.md` 的两层：design tokens 和使用说明。
- 05:19 - 解释 MCP：给 Claude 接外部工具和资源。
- 05:35 - 推荐 Figma MCP 和 Playwright MCP。
- 06:08 - 提醒不要装太多 MCP。
- 06:22 - Skills 留到下一期继续讲。

# Detailed Notes
## Design Stack
Design stack 是设计师使用 Claude Code 前要先搭好的工作环境。它的目标是让 Claude Code 不只是一个泛用 coding agent，而是带着项目目标、设计系统和工具上下文来工作。

这个概念对设计师很重要，因为 Claude Code 默认面向开发者。如果不做配置，它不知道你的产品目标、审美方向、组件规范，也不知道应该如何判断 UI 产出是否合格。

## `CLAUDE.md`
`CLAUDE.md` 是 Claude Code 每次对话开始时会读取的项目文件，相当于项目长期记忆。它解决的是上下文窗口压缩和长对话遗忘问题。

建议结构：
- Project Goal：项目是什么，给谁用，要达成什么目标。
- Ground Rules：所有任务开始前必须遵守的规则。
- Quick Reference：关键约束、do / don't、项目内反复需要提醒的原则。

对设计项目来说，一个关键 ground rule 可以是：在生成或修改任何 UI 前，必须先读取 `DESIGN.md` 并遵循设计系统。

## `DESIGN.md`
`DESIGN.md` 是把设计系统从 Figma 这类设计工具中翻译出来，变成 Claude Code 能理解、能执行的规范文件。

它最好包含两层：
- 机器读的层：颜色、字体、间距、圆角、组件 token，适合用 YAML 或结构化格式。
- 人读的层：解释这些 token 为什么存在、什么时候用、组件不同状态如何选择。

例如按钮组件不能只给颜色值，还要说明 active、disabled、hover 等状态分别在什么场景使用。

## MCP 和 Skills
MCP 是 Claude 的插件/外部工具连接机制。对设计师来说，最有价值的是：
- Figma MCP：读取 Figma 文件和 design system。
- Playwright MCP：像人一样操作浏览器、截图、检查页面，用于调研和验证 UI。

Skills 则是针对特定任务的最佳实践模块，适合把高频工作流程固化下来。

## 重要判断
这条视频的核心价值不只是推荐几个工具，而是提出了一个设计师使用 AI coding agent 的正确顺序：先设定角色和上下文，再接入设计系统，再扩展外部能力，最后才开始执行任务。

# Action Items
- [ ] 为自己的主要项目创建或整理 `CLAUDE.md`。
- [ ] 在 `CLAUDE.md` 中加入项目目标、首要规则、quick reference。
- [ ] 创建 `DESIGN.md`，把当前设计系统转成 AI 可执行规范。
- [ ] 安装或配置 Figma MCP。
- [ ] 安装或配置 Playwright MCP，用于页面截图、调研和 UI 验证。
- [ ] 定期检查 MCP，移除不常用或会拖慢流程的插件。
- [ ] 后续关注作者关于 Skills 的下一期内容。

# Related Topics
- [[Claude Code]]
- [[CLAUDE.md]]
- [[DESIGN.md]]
- [[Design System]]
- [[Figma MCP]]
- [[Playwright MCP]]
- [[MCP]]
- [[Skills]]
- [[AI for Design]]
- [[Vibe Coding]]

# Keywords
Claude Code, design stack, CLAUDE.md, DESIGN.md, Figma MCP, Playwright MCP, MCP, Skills, design system, AI design workflow, AI coding agent, designer workflow, vibecoding
