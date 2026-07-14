---
type: article
title: "Google 上周推了个 agents-cli，我装完发现 Claude Code 多了 7 个超能力"
source: wechat
source_url: https://mp.weixin.qq.com/s/Mr2HjtfwjTJFL8cIe5OrJQ
author: "码哥"
category: ai-coding
status: unread
read_at: 
rating: 
dedup_key: url:f375a718f113d86f12037fbab2b9e5e5578ea350d0fbcfa75e4e10e59de26f02
added: 2026-06-28
---

# Google 上周推了个 agents-cli，我装完发现 Claude Code 多了 7 个超能力

本地 Worker 已保存该网页/公众号文章快照；原始链接可能会失效，Obsidian 笔记作为本地副本。

## Excerpt
Google 官方推出的 agents-cli 让 Claude Code / Gemini CLI 等编程助手变成 AI Agent 开发专家。码哥从 Claude Code 老用户视角实测 7 个 Skill，拆解架构设计，告诉你哪些值得现在就装、哪些可以再等等

## Snapshot Text
上周我刷 GitHub Trending 的时候，看到一个仓库两天涨了 3000 star，名字叫  google/agents-cli 。 

 说实话，第一反应是——Google 又来整活了？Gemini CLI 刚刚宣布个人账号停服、过渡到 Antigravity CLI，这会儿又推个新的 CLI？ 

 点进去看完 README，我愣了一下：这玩意不是编程助手，它是给编程助手「装技能」的。 

 什么意思？你用 Claude Code 写代码，它帮你写。但如果你要开发一个 AI Agent——从脚手架搭建、到代码生成、到评估测试、到云端部署——Claude Code 默认不具备这些能力。agents-cli 就是往 Claude Code（或者 Gemini CLI、Codex）里塞了 7 个 Skill，让它瞬间变成 Agent 开发专家。 

 我花了一个周末把 7 个 Skill 全部实测了一遍，这篇文章是我的完整体验报告。 

 先搞清楚：这东西不是竞争关系 很多人看到标题会误以为：Google 出了个 CLI 工具要跟 Claude Code 抢市场。 

 不是的。 

 打个比方：Claude Code 是一把锤子，agents-cli 是一套电动螺丝头。你把螺丝头装上去，锤子就变成了电动螺丝刀。螺丝头本身不能独立工作，它需要一个宿主。 

 看 GitHub README 里的兼容列表就清楚了： 

 支持的宿主（Host）: 
    - Gemini CLI 
 - Claude Code 
 - Codex (OpenAI) 
 - Antigravity CLI 
 它不挑宿主。不管是 Google 自家的还是 Anthropic、OpenAI 的编程助手，只要支持 Skill 协议，都能装。 

 agents-cli 与各大编程助手的宿主关系架构 那问题来了，它到底往宿主里塞了什么？ 

 7 个 Skill 的全景拆解 agents-cli v0.5.1（2026-06-22 刚发布）一共提供 7 个 Skill。我按使用顺序把它们分成三个层次： 

 开发层（日常高频使用）： 

 Skill 一句话说清楚 实际感受 scaffold 生成 Agent 项目脚手架 模板质量高，开箱即用 adk-code 生成符合 ADK 规范的 Agent 代码 核心中的核心，后面重点拆 workflow 定义多 Agent 协作工作流 概念好但文档不够清晰 验证层（开发中期使用）： 

 Skill 一句话说清楚 实际感受 eval 对 Agent 进行自动化评估测试 命令第一次跑直接报错，需要手动修配置 publish 发布 Agent 到 Agent Garden 还行，但 Agent Garden 生态还很早期 运维层（最后才用）： 

 Skill 一句话说清楚 实际感受 deploy 部署到 Google Cloud Run 需要 GCP 账号，纯本地开发暂时用不到 observability Agent 运行时监控和日志 同上，和 deploy 捆绑的 7 个 Skill 的三层分类体系 先别急着装，我一个一个拆给你看，到底哪些值得现在就用。 

 adk-code：最核心的 Skill，也是设计最巧的 这 7 个 Skill 里， adk-code  是我用得最多、也觉得设计得最巧妙的一个。 

 它的作用：你用自然语言描述你要什么 Agent，它帮你生成符合 Google ADK（Agent Development Kit）规范的代码。 

 但关键不在「生成代码」——Claude Code 本身就能生成代码。关键在「符合 ADK 规范」。 

 什么是 ADK 规范？看一个最小 Agent 的结构： 

 # my_agent/agent.py 
 from  google.adk  import  Agent 
 from  google.adk.models.lite_llm  import  LiteLlm 

 root_agent = Agent( 
     name= "weather_agent" , 
     model=LiteLlm(model= "anthropic/claude-sonnet-4-20250514" ), 
     description= "查询天气信息的 Agent" , 
     instruction= "你是一个天气查询助手，使用提供的工具获取天气数据。" , 
     tools=[get_weather], 
 ) 
 就这几行？对，就这几行。但这个结构背后的设计决策很重要： 

 1.  model  字段支持 LiteLlm 中间层。  这意味着你可以用 Claude Sonnet 跑、也可以换 Gemini Flash 跑，甚至同一套代码在不同环境用不同模型。Google 没有把自己绑死在 Gemini 上。 

 2.  tools  字段是标准 Python 函数列表。  不是特殊格式、不是装饰器魔法，就是一个普通函数。ADK 框架通过类型提示和 docstring 自动提取工具描述。 

 3.  instruction  和  description  分开。 instruction  是给模型看的系统提示， description  是给其他 Agent 看的能力描述。这个分离在多 Agent 协作时特别关键——外层编排 Agent 通过  description  决定把任务分给谁。 

 adk-code  Skill 的作用就是：你说「我要一个能查天气、能订机票的 Agent」，它帮你生成完整项目，包括 agent.py、tools/ 目录、配置文件，全按上面的规范来。 

 说实话，如果你之前用过 ADK 手动搭 Agent，你就会明白这个 Skill 的价值。ADK 的初始化配置挺繁琐的——pyproject.toml、__init__.py 的导出、工具函数的签名要求，少一步都会报莫名其妙的错误。 adk-code  全帮你包好了。 

 ADK Agent 的模块结构和数据流 scaffold：脚手架工具，但不是你想的那种 scaffold  看名字像是一个简单的项目生成器，类似  npx create-react-app 。 

 但它比一般的脚手架聪明在哪？ 

 # 用法：在 Claude Code 里直接说 
 # "帮我创建一个多 Agent 协作的旅行规划 Agent" 
 # Claude Code 会调用 scaffold Skill 
 它生成的不只是文件，而是一个 可运行的多 Agent 拓扑 。比如你说「旅行规划 Agent」，它不会给你一个单 Agent 加一堆工具函数的平铺结构，而是给你： 

 travel_agent/ 
 ├── agent.py               # 根 Agent（路由器） 
 ├── sub_agents/ 
 │   ├── flight_agent.py    # 订机票子 Agent 
 │   ├── hotel_agent.py     # 订酒店子 Agent 
 │   └── weather_agent.py   # 查天气子 Agent 
 ├── tools/ 
 │   ├── flight_api.py 
 │   ├── hotel_api.py 
 │   └── weather_api.py 
 ├── .env                   # API keys 
 └── pyproject.toml 
 注意它默认就用了 sub_agents 结构。这不是偶然——ADK 的设计哲学就是「一个 Agent 做一件事」，通过 Root Agent 做编排。这和我自己在 Claude Code 里搭多 Agent 系统的思路完全一致。 

 但我必须吐槽： scaffold  目前内置的模板种类太少了。我试了 5 个不同需求，其中 3 个生成出来的结构几乎一样。它更像是一个「单模板脚手架 + 需求解析」的组合，而不是有丰富模板库的 Yeoman 那种。 

 现在值得装吗？  装。虽然模板单一，但它生成的结构是符合 ADK 最佳实践的，比你从零手写靠谱。 

 workflow：多 Agent 编排，概念先行，细节待打磨 workflow  是 7 个 Skill 里概念最超前、但落地最粗糙的一个。 

 它解决的问题：当你有多个 Agent（比如上面旅行规划那个，flight_agent + hotel_agent + weather_agent），怎么定义它们之间的协作关系？ 

 ADK 提供了几种内置的编排模式： 

 # 模式一：Sequential（串行） 
 # 天气查询 → 根据天气选航班 → 根据航班订酒店 

 # 模式二：Parallel（并行） 
 # 同时查航班和酒店，合并结果 

 # 模式三：Loop（循环） 
 # 反复优化行程方案直到用户满意 
 workflow  Skill 的作用就是让你用自然语言描述这些编排关系，然后它帮你转换成 ADK 的代码结构。 

 听起来很美好，但我实测的时候遇到了一个明显问题： 它对中文描述的理解不太稳定。  同样的需求，用英文描述生成的 workflow 比用中文描述的质量高一截。我猜训练数据里英文 workflow 描述远多于中文。 

 而且目前  workflow  只支持简单的 DAG（有向无环图）编排，对有条件分支的复杂场景（比如「如果天气不好就取消旅行」这种带条件判断的），支持还不到位。 

 现在值得装吗？  可以装，但别指望它能搞定复杂场景。简单的工作流定义用它省时间，复杂的还是自己手写更靠谱。 

 eval：第一次跑就报错的评估工具 到了验证层。 eval  是让我又爱又恨的一个 Skill。 

 它设计得确实好——用 Python 代码定义评估用例，自动跑完给评分： 

 # 评估脚本示例（简写） 
 from  google.adk.evaluation  import  AgentEvaluator 

 eval_suite = AgentEvaluator( 
     agent=weather_agent, 
     test_cases=[ 
         { 
              "input" :  "北京明天天气怎么样？" , 
              "expected_tools" : [ "get_weather" ], 
              "expected_contains" :  "北京" , 
         }, 
     ], 
 ) 

 results = eval_suite.run() 
 print(results.summary())   # pass_rate: 1.0 
 这比我自己写 pytest 来测 Agent 输出靠谱多了。它不只检查最终回答，还检查中间步骤——调用了哪些工具、工具参数对不对、有没有幻觉。 

 但坑来了： 我第一次跑  eval  命令直接报错。 

 报错信息大概意思是  evaluation module not found 。翻了 GitHub Issues 才发现，v0.5.1 的 eval 模块有个依赖冲突，需要手动安装  google-adk[eval]  额外依赖。README 里没写这一步，得自己去翻 Issues。 

 修好之后倒是能跑了，而且效果确实不错。它内置了几种评估指标： 

 Tool Usage Accuracy ：工具调用是否正确 Response Relevance ：回答是否切题 Hallucination Score ：幻觉检测（这个最实用） 说实话，光冲这个幻觉检测能力，eval 就值得装。自己写一套幻觉检测逻辑太痛苦了。 

 现在值得装吗？  装，但做好心理准备——首次配置需要折腾。 

 publish 和 deploy：生态早期，可以再等等 这两个 Skill 简单说一下： 

 publish  是把你的 Agent 发布到 Google 的 Agent Garden（类似 Agent 应用商店）。我试了一下，发布流程倒是通畅，但 Agent Garden 里的 Agent 数量还很少，更像是个概念验证阶段。你发布了也没什么人用。 

 deploy  是部署到 Google Cloud Run。这个需要 GCP 账号和 billing 设置。如果你本来就在用 GCP，那挺方便的——一条命令把本地 Agent 变成 API 端点。如果你没有 GCP 账号，专门为此注册一个就不值了。 

 # deploy 的使用方式（需要 GCP 项目） 
 # 在 Claude Code 里说："把当前 Agent 部署到 Cloud Run" 
 # 它会自动处理 Dockerfile 生成、构建、推送、部署 
 现在值得装吗？  纯本地开发的话，这两个先不装也不影响什么。等你要上生产了再补。 

 装之前你要知道的三件事 安装方式 # 方式一：uvx（推荐，如果你有 Python 环境） 
 uvx google-agents-cli setup 

 # 方式二：npx（推荐 Node.js 用户） 
 npx skills add google/agents-cli 
 安装完之后，它会自动检测你当前环境里有哪些编程助手（Claude Code / Gemini CLI / Codex），然后在对应目录下写入 Skill 配置文件。整个过程不到 30 秒。 

 API Key 的问题 agents-cli 本身不需要 API Key——它只是往你的编程助手里装 Skill。 

 但 Skill 生成的 Agent 代码要跑起来，需要模型 API Key。Google 提供了 AI Studio 的免费 API Key，日常开发够用： 

 # 免费方案：Google AI Studio（不需要 GCP 账号） 
 export  GOOGLE_API_KEY= "your-aistudio-key" 

 # 付费方案：Google Cloud Vertex AI（生产用） 
 export  GOOGLE_CLOUD_PROJECT= "your-project" 
 我用 Claude Code 测试的时候，直接用的 Anthropic API Key——ADK 的 LiteLlm 层支持直接走 Anthropic 的 API，不需要经过 Google。 

 国内访问 安装本身没有墙，GitHub 直接拉。但 Skill 里部分命令（特别是  deploy  和  publish ）需要访问 Google Cloud API，这个你懂的。本地开发、代码生成、评估测试这些功能不受影响。 

 agents-cli vs 直接用 ADK：效率差多少？ 这是我在测试过程中最想回答的问题。 

 结论： 对于新手，agents-cli 能把入门时间从 2 天压缩到 2 小时。对于老手，提升大约 30%。 

 对比一下： 

 维度 直接用 ADK agents-cli + Claude Code 环境搭建 手动创建 pyproject.toml、目录结构 scaffold 一键生成 写 Agent 代码 查文档、看示例、手写 adk-code 自然语言描述生成 多 Agent 编排 手动实现编排逻辑 workflow 生成（简单场景） 测试 自己写 pytest eval 内置评估框架 学习曲线 2-3 天 2-3 小时 老手用 agents-cli 主要省在脚手架和评估上——这两个环节用 ADK 手动做太琐碎了。代码生成部分对老手帮助有限，因为老手本来就知道 ADK 的结构长什么样。 

 但对新手来说，最大的价值是 消除了「不知道规范长什么样」的障碍 。你不需要先读完 ADK 文档再动手，直接说需求，它帮你生成符合规范的代码，你再读代码学规范。这是典型的「做中学」。 

 agents-cli vs 直接用 ADK 的效率对比 FAQ：你可能想问的几个问题 Q1：我用 Cursor 不用 Claude Code，能装吗？ 

 Cursor 目前不在官方支持列表里。不过理论上，如果 Cursor 支持类似 Skill/Extension 的机制，应该也能接入。目前官方明确支持的是 Gemini CLI、Claude Code、Codex 和 Antigravity CLI。 

 Q2：装了 agents-cli 会影响我现有的 Claude Code 配置吗？ 

 不会。它只是在 Skill 目录下加了几个新 Skill 文件，不修改任何已有配置。不想要了手动删掉就行。 

 Q3：ADK 和 LangChain / CrewAI 比怎么样？ 

 这是另一个话题了，简单说：ADK 是 Google 官方的，和 Google Cloud 生态集成最深（Agent Garden、Cloud Run、Vertex AI）。LangChain 生态最大、社区最活跃。CrewAI 在多 Agent 协作方面概念最先进。三个没有绝对优劣，选哪个取决于你的部署环境。 

 Q4：agents-cli 的更新频率怎么样？ 

 非常活跃。项目 2026 年 4 月 8 日创建，到现在两个多月，版本号已经到 v0.5.1，最新一版是昨天（6 月 22 日）发的。3000 多 star，Google 内部有人在维护。 

 我的建议 如果你是 Claude Code 的日常用户，又对 AI Agent 开发感兴趣——装。 adk-code  +  scaffold  +  eval  这三个 Skill 组合起来，能把你的 Claude Code 从「写代码的助手」变成「帮你搭 Agent 系统的搭档」。 

 workflow 、 publish 、 deploy 、 observability  这四个可以观望，等社区案例多起来了再上。 

 说实话，Google 在 CLI 工具上的品味一直不错。从 gcloud CLI 到 Firebase CLI 再到现在的 agents-cli，那种「一行命令搞定一件事」的设计哲学一脉相承。这次往 Claude Code 里塞 Skill 的思路也挺巧妙——不造轮子，造零件。 

 唯一让我担心的是：Gemini CLI 个人账号停服、过渡到 Antigravity CLI 这件事，说明 Google 内部对 CLI 产品的定位还在调整中。agents-cli 作为配套工具，它的长期路线图会跟着 Google 的 Agent 生态走。如果 Google 某天调整了 ADK 的方向，这些 Skill 的维护质量也会受影响。 

 不过话说回来，3000 star 的工具，就算 Google 放弃了，社区也会 fork 继续维护。先把好用的 Skill 装上用着，走一步看一步。 

 配套实战手册 

 文中涉及的 ADK Agent 项目模板 + eval 评估脚本模板已整理成完整可运行代码，包含 3 个踩坑场景的解决方案。 

 公众号回复「agent」即可获取。 

 如果这篇对你有帮助，转发给你的程序员朋友  — AI Agent 开发正在从「自己造轮子」变成「装现成零件」，你的分享可能帮他省很多时间。

Source: https://mp.weixin.qq.com/s/Mr2HjtfwjTJFL8cIe5OrJQ
