---
title: Firecrawl Keyless｜免 API Key 网页抓取基础设施
source: https://mp.weixin.qq.com/s/Kk_Z4d3Ft7SKejgQoLCHXg
created: 2026-06-28
status: intake
model_provenance:
  extraction: Grace/OpenAI + web_extract
  decision: Grace/OpenAI preliminary
  claude_review: pending
routing: atlas
use_case:
  - public_web_crawling
  - website_to_markdown
  - structured_extraction
  - future_social_research
---

# Firecrawl Keyless｜免 API Key 网页抓取基础设施

## 初判

这篇有用，原因：用户后续会做其他网站的公开数据采集/爬取，Firecrawl 的 Keyless 模式降低了接入门槛。

## 关键信息

- Firecrawl 支持网页转 Markdown / JSON / HTML / Screenshot / Metadata。
- 支持 Search、Scrape、Interact。
- 新增 Keyless：无需 API Key，每月约 1000 次免费额度。
- 接入方式：MCP、CLI、REST API。

## Grace 决策

- Grace 当前已有 Nous 托管 Web 工具，可直接完成多数网页提取。
- 更有价值的安装位置：Atlas / Claude Code 执行侧，用于后续公开网站采集 PoC。
- 风险边界：只做 public-only、no-login、no-cookie、no-account-action；Interact 能力不默认启用登录/填表类任务。

## 已执行 / 验证

- 2026-06-28 16:02 JST：已给 Claude Code 以 user scope 添加 Firecrawl MCP：

```bash
claude mcp add -s user --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp
```

- 验证命令：

```bash
claude mcp list
```

- 验证结果：

```text
firecrawl: https://mcp.firecrawl.dev/v2/mcp (HTTP) - ✔ Connected
```

## 仍待确认

- Codex 是否需要单独配置 MCP。
- 未来采集任务默认只做 public-only / no-login / no-cookie / no-account-action。
