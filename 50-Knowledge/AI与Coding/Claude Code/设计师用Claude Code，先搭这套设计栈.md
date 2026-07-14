---
title: 设计师用Claude Code，先搭这套设计栈
author: Sen.md
platform: xiaohongshu
date:
captured_at: 2026-06-26
url: "https://www.xiaohongshu.com/discovery/item/6a3e414a000000001101187b?source=webshare&xhsshare=pc_web&xsec_token=ABqSlvT6rNuBZdahrsf3oIUt12OCNqOA-BoVnF-69HK9o=&xsec_source=pc_share"
tags: [howto用好AI, vibecoding, 人工智能, 设计师, claude, ai工具, 大模型, 教程, 设计教程]
category: AI
workflow: ai-knowledge
content_type: image-carousel
review_status: reviewed
attachments_dir: "99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈"
---
# Summary
这条图文把设计师使用 Claude Code 前需要搭好的 Design Stack 拆成了可执行清单。核心不是一上来让 Claude Code 生成 UI，而是先给它项目记忆、设计系统、外部工具和专项技能，让它在你的设计语境里工作。

这套栈可以理解为 Claude Code 的入职 onboarding：

- `CLAUDE.md`：项目长期记忆，负责目标、边界和规则。
- `DESIGN.md`：设计系统说明书，负责 token、组件、状态和使用原则。
- MCPs / Skills：专家工具箱，负责连接 Figma、浏览器、网页资源，并规定如何正确使用这些工具。

# Core Ideas
- Claude Code 默认是工程师工具，设计师要先配置上下文，才适合用它做设计相关工作。
- Design Stack 不是装一堆插件，而是把“项目目标、设计系统、工具能力、执行流程”组合起来。
- `CLAUDE.md` 和 `DESIGN.md` 是基础设施；MCP 和 Skills 是扩展能力。
- MCP 解决“Claude 能访问什么工具”的问题，Skill 解决“Claude 应该按什么流程使用工具”的问题。
- Figma MCP 和 Playwright MCP 是设计师最值得优先装的两个 MCP。
- 不要安装过多 MCP，否则会增加上下文噪音、降低速度，也更容易让 agent 分心。
- 找不到合适 Skill 时，可以用官方 Skill Creator 创建自己的 Skill。

# Design Stack
## 1. `CLAUDE.md`：项目长期记忆
`CLAUDE.md` 是 Claude Code 每次对话会读取的项目文件，作用是让它持续记住项目目标和边界。尤其在长对话、上下文压缩之后，它能减少跑偏。

建议控制在较短篇幅，重点写三块：

1. **Project Goal**：项目是什么，给谁用，解决什么问题。
2. **Ground Rules**：执行任务前必须遵守的规则，例如“改 UI 前先读 `DESIGN.md`”。
3. **Quick Reference**：常用 do / don't、技术约束、品牌语气和设计偏好。

适合写进 `CLAUDE.md` 的规则示例：

```md
Before creating or editing any UI, read DESIGN.md first and follow the design system. Do not introduce new colors, spacing values, or component styles unless explicitly requested.
```

## 2. `DESIGN.md`：把设计系统翻译给 AI
`DESIGN.md` 的作用是把 Figma 里的设计系统变成 Claude Code 能读、能执行的规范。它不只是 token 表，也应该解释每个规则背后的设计意图。

建议包含两层：

- **机器可读层**：颜色、字体、字号、间距、圆角、阴影、组件状态，适合用 YAML 或表格表达。
- **人类可读层**：什么时候用某个 token、组件变体如何选择、哪些视觉效果禁止使用。

可执行结构示例：

```yaml
colors:
  primary: "#111111"
  accent: "#E66B4A"
spacing:
  compact: 8
  default: 16
  relaxed: 24
components:
  button:
    states: [default, hover, active, disabled]
    rule: "Use existing component variants before creating a new style."
```

关键原则：所有 UI 生成或修改任务都应该先读取 `DESIGN.md`，再开始写代码或生成界面。

## 3. MCP：Claude 的插件系统
MCP 负责把 Claude Code 连接到外部工具和资源。对设计工作来说，优先级可以这样排：

1. **Figma MCP**：读取 Figma 文件、设计系统、组件和 token。
2. **Playwright MCP**：打开网页、截图、检查页面，实现调研和 UI 验证。
3. **Mobbin MCP**：用于产品界面参考和模式研究，可选。
4. **Magic MCP**：用于生成 UI 或组件，可选。

判断标准：只装会进入日常工作流的 MCP。暂时只是好奇、使用频率很低的，不要先装。

## 4. Skills：用好工具的那层知识
Skill 是一组指令、脚本和资源，告诉 Claude Code 如何用特定方式完成任务。它更像专项培训手册，不是单条 Prompt。

这条图文推荐的三个设计向 Skill：

1. **Web Access**  
   让 Claude Code 访问需要登录的网站、读取浏览器登录状态，适合做社媒、论坛、竞品和用户研究。

2. **Claude Code to Figma**  
   作者自制 Skill，让 Claude 在 Figma 中产出时严格使用 design tokens、组件和 Auto Layout，而不是硬编码样式。

3. **Impeccable**  
   前端设计专项 Skill，提供 `/polish`、`/audit`、`/distill` 等设计指令，用来减少 AI UI 的模板感和廉价感。

# Build Your Own Skill
如果找不到合适的 Skill，可以用 Skill Creator 创建自己的 Skill。

安装命令：

```bash
claude plugin install skill-creator@claude-plugins-official
```

创建 Skill 的 Prompt 至少写清三件事：

1. **Skill name**：Skill 叫什么。
2. **Workflow**：它执行任务时要按什么步骤走。
3. **End goal**：什么样的结果才算合格。

可复用 Prompt 模板：

```text
I want to create a skill called [skill-name].

Workflow:
It should always start by checking [required files / references / tools].
Then it should [step 1], [step 2], and [step 3].
Before finishing, it must audit the output against [quality rules].

End goal:
The final output should [definition of success].
It should avoid [known failure modes].
```

Skill Creator 支持的优化模式：

- **Create**：从零创建 Skill。
- **Eval**：测试 Skill 表现。
- **Improve**：优化已有 Skill。
- **Benchmark**：多轮对比性能。

# Practical Takeaways
- 对设计项目来说，先写 `CLAUDE.md` 和 `DESIGN.md`，再让 Claude Code 开始做 UI。
- 如果 Claude Code 产出经常“像 AI 模板”，通常不是模型不够强，而是缺少设计系统和质量检查流程。
- 对需要长期迭代的项目，Skill 比临时 Prompt 更值得沉淀。
- 个人或团队可以维护自己的 Skill library，把审美标准、Figma 规则、研究流程、验收标准固化下来。

# Action Checklist
- [ ] 为当前主要项目创建 `CLAUDE.md`。
- [ ] 在 `CLAUDE.md` 写清项目目标、边界和 UI 修改前置规则。
- [ ] 为项目创建 `DESIGN.md`，整理颜色、字体、间距、组件和状态。
- [ ] 配置 Figma MCP。
- [ ] 配置 Playwright MCP，用于网页验证和截图检查。
- [ ] 只保留真正高频使用的 MCP。
- [ ] 为重复设计任务创建至少一个 Skill。
- [ ] 用 Eval / Improve / Benchmark 定期优化自己的 Skill。

# Related Notes
- [[设计师 Claude Code 指南｜如何配置设计栈]]
- [[设计师的Claude Code指南，2步创建Skill]]
- [[Claude Code]]
- [[CLAUDE.md]]
- [[DESIGN.md]]
- [[MCP]]
- [[Skills]]
- [[Figma MCP]]
- [[Playwright MCP]]

# Image Preview
![[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/contact-sheet.jpg]]

# Original Image Pages
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/01.jpg|01 封面]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/02.jpg|02 从配置 Claude Code 开始]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/03.jpg|03 三个文件，三种角色]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/04.jpg|04 CLAUDE.md]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/05.jpg|05 DESIGN.md]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/06.jpg|06 MCP]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/07.jpg|07 Skills]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/08.jpg|08 Skill 资源]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/09.jpg|09 创建自己的 Skill]]
- [[99-Attachments/AI视频知识/设计师用Claude Code，先搭这套设计栈/10.jpg|10 完整设计栈]]

# Keywords
Claude Code, Design Stack, CLAUDE.md, DESIGN.md, MCP, Skills, Figma MCP, Playwright MCP, Skill Creator, Web Access, Impeccable, design system, AI design workflow, designer workflow
