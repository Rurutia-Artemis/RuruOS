---
title: 深入理解 Claude Code：从 CLAUDE.md 到 Hooks、Skills、Subagents
created: 2026-06-28
source_url: https://mp.weixin.qq.com/s/-7C4WqRsuKlmBj6I31Is1w
status: analyzed
external_claims_verified: partial-docs-prior
model_provenance: Grace / OpenAI; not independently Claude-reviewed except linked business synthesis
aliases:
  - 深入理解Claude Code上下文机制-文章分析-2026-06-28
tags:
  - wechat
  - claude-code
  - agent-engineering
  - context-engineering
---

# 深入理解 Claude Code：从 CLAUDE.md 到 Hooks、Skills、Subagents

## 原文主旨

文章把 Claude Code / Codex 等 Coding Agent 的稳定性问题归结为“上下文如何被构建、注入、隔离和约束”。核心判断是：Agent 和 ChatBot 的关键区别在于，Agent 会主动构建上下文。

## 机制总览

| 机制 | 适合放什么 | 作用 |
|---|---|---|
| CLAUDE.md | 项目事实、构建命令、目录结构 | 启动即加载，适合长期事实 |
| Rules | 路径/文件类型约束 | 按需加载，减少无关上下文 |
| Skills | 可复用流程、清单、操作步骤 | 只在需要时加载全文 |
| Subagents | 独立复杂任务 | 隔离上下文，返回摘要 |
| Hooks | 确定性动作、安全护栏 | 不靠模型记忆，直接执行 |
| Output Styles | 行为风格 | 改变输出方式 |
| System Prompt Append | 临时指令 | 当前调用的轻量约束 |
| Dynamic Workflows | 多 Agent 编排 | 用多个上下文并行完成复杂任务 |

## 最重要的区分

- **CLAUDE.md 放事实**：项目结构、命令、约定。
- **Skills 放流程**：部署步骤、审查清单、调试方法。
- **Subagents 放隔离任务**：大量搜索、日志分析、依赖审计。
- **Hooks 放确定性约束**：危险命令拦截、自动格式化、测试触发。

## 对我有用的地方

这篇文章可以直接转化成可售卖能力：

> 帮团队把 AI Coding Agent 从“会聊天”调成“稳定工作流”。

可交付物包括：

- 项目 CLAUDE.md / AGENTS.md；
- path-scoped rules；
- 可复用 Skills；
- 安全 Hooks；
- Subagent 分工；
- 验收 checklist。

关联：[[Dan Koe商业逻辑与一人公司模仿方案-深度报告-2026-06-28]]
