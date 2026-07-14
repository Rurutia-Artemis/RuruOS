---
title: 关于Hermes的skills治理
source: https://mp.weixin.qq.com/s/nFZk2-iuxKhBiys0LfAnpw
author: 赛博博学家
published: 2026-06-17 11:18
type: 微信公众号文章
tags:
  - Hermes
  - Skills
  - AI-Agent
  - 知识管理
created: 2026-06-25
---

# 关于Hermes的skills治理

> 原文：[关于Hermes的skills治理](https://mp.weixin.qq.com/s/nFZk2-iuxKhBiys0LfAnpw)  
> 作者/公众号：赛博博学家  
> 发布时间：2026-06-17 11:18

## 一句话总结

Hermes agent 会随着使用自动沉淀越来越多 skills，长期积累后需要治理；作者认为原生 Curator 只按使用次数和时间做删减不够，于是尝试让 Hermes 用“自我治理”的方式管理 skills。

## 主要内容

- Hermes agent 的自进化特性会持续产生新 skills。
- skills 积累过多后，可能带来管理、检索、冗余和质量控制问题。
- 原生治理技能 Curator 主要依据：
  - 使用次数
  - 最近使用时间
- 作者认为这种“按频率做减法”的方式还不够精细。
- 解决思路：用更智能的方式治理 skills，也就是“用魔法打败魔法”，让 agent 自己参与治理自己的 skills。

## 我的整理

这篇文章适合归到 **Hermes / AI Agent 运维 / Skills 治理** 主题下。核心不是介绍某个具体功能，而是提出一个长期使用 Hermes 后会出现的问题：

> skills 会越来越多，不能只靠“少用就删”的规则，需要更语义化、更结构化的治理方式。

可延伸的治理方向：

1. **去重**：合并功能重叠的 skills。
2. **归类**：按任务类型、工具链、场景建立层级。
3. **质量检查**：发现过期命令、错误流程、缺少验证步骤的 skill。
4. **保留策略**：不仅看使用次数，也看是否关键、是否难以重建、是否承载用户偏好。
5. **自动重构**：把零散经验整理成更通用的 skill。

## 原文摘录

> 用久了，Hermes agent 自进化的特性会导致其自动产生越来越多的技能。积攒久了，会存在哪些问题？造成什么影响？要如何解决？

> 原生的治理技能 Curator 只是从 Skills 的使用次数和使用时间上来做减法，总感觉差点意思。既如此，自然要用魔法来打败魔法，自己治理自己吧。

## 相关链接

- [[Home]]
- [[Solo开发者Vibe_Coding变现指南]]

## 图片

![封面](https://mmbiz.qpic.cn/mmbiz_jpg/ucrc84228RmeIFJlDYictfRGblNHoYefErY8h2NaD7p8Zh0UEtLicslIK5RIcjZoyibpicTprWPmZRDEA7NOYicRbkYdDicPeJSpibiaNicaGEMTN3DA/0?wx_fmt=jpeg)

![文章图片 1](https://mmbiz.qpic.cn/mmbiz_png/ucrc84228Rl4srBP31liaWhB9ANiaqDN55rtHPtDkejrfGOkqpbm8NO1qR4C5wofibwib8vkaNxxiatWiax9982eJIhgtJ8iaZlVrQ3xhjISU0L9iak/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

![文章图片 2](https://mmbiz.qpic.cn/mmbiz_png/ucrc84228Rk4hZ8wOoxI5wVTE4vjPBJ4P1GO6AzGw17BSY5vZ0zK1qwfaE3tRs86eao03sj6NJyrunVSapXbuLpfficUQNknaudicuUcXnF6Y/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=1)
