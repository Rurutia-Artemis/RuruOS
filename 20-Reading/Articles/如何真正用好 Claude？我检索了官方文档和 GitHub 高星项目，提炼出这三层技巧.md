---
type: article
title: "如何真正用好 Claude？我检索了官方文档和 GitHub 高星项目，提炼出这三层技巧"
source: wechat
source_url: https://mp.weixin.qq.com/s/9YfZl_5JWkuF-TL8tpAvZw
author: "进击的suiceee"
category: ai-coding
status: unread
read_at: 
rating: 
dedup_key: url:e6abc66f6c078bc04c21ae16f7b8fad0195845a9340dabb79c3eeeb7f22ced0c
added: 2026-06-28
---

# 如何真正用好 Claude？我检索了官方文档和 GitHub 高星项目，提炼出这三层技巧

本地 Worker 已保存该网页/公众号文章快照；原始链接可能会失效，Obsidian 笔记作为本地副本。

## Excerpt
用了半年 Claude 还只会提问等回复？我检索官方文档和 GitHub 高星项目，整理出三层实用技巧：清晰指令、结构化提示、证据优先、分步执行，帮你把 Claude 用得更稳、更准、更高效。

## Snapshot Text
本文内容基于以下资料的系统检索与提炼： 

 Anthropic 官方提示词工程文档：Prompting best practices 
 Anthropic 官方提示词工程概述：Prompt engineering overview 
 Anthropic 官方交互式教程（GitHub）：prompt-eng-interactive-tutorial 
 Anthropic 工程博客 · 上下文工程：Effective context engineering for AI agents 
 社区综合指南：The Complete Prompt Engineering Guide 
 Claude 提示词合集（GitHub）：awesome-claude-prompts 
 Claude Skills 资源库（GitHub）：awesome-claude-skills 用了半年 Claude，你真的会用吗？ 很多人的使用方式停留在"打开对话框，输入问题，等待回答"。这没错，但离"用好"还差很远。 我花时间系统检索了 Anthropic 官方的提示词工程文档，以及 GitHub 上多个高星社区项目，把所有核心技巧提炼成三个层次。从今天起，你可以照着用。 第一层：基础原则——大多数人在这里就已经输了 原则一：把 Claude 当成刚入职的聪明新人，不是搜索引擎 这是 Anthropic 官方文档里反复强调的底层思维： 把写提示词想成给一个聪明但对你项目毫无背景的新员工布置任务。你越说清楚，他表现越好。 大多数人问 Claude 的方式： "帮我写一篇文章。" 正确的方式： "我在做一个面向学术研究者的产品，用户群体是理工科博士生。请写一篇 800 字的产品介绍，语气专业但不晦涩，重点突出文献溯源的准确性，结尾要有一个行动号召。" 两个版本，差距不在 Claude 的能力，在于你给的信息。 原则二：用正面、直接的指令，不要用问句 这个细节很多人忽视。 错误示范： "你能帮我建议一些改动吗？" 正确示范： "对以下内容做出修改：……" 问句会让 Claude 倾向于"提建议"而不是"直接执行"。你想要行动，就说行动。 原则三：先给例子，再让它做（Few-shot 提示） 这是提升输出质量最快的单一技巧。提供 2-5 个示范输入/输出，Claude 会直接对齐你的预期，而不是猜你想要什么。 格式建议： < example > 输入：…… 输出：…… </ example > < example > 输入：…… 输出：…… </ example > 第二层：进阶技巧——让输出质量跃升的关键 技巧一：用 XML 标签组织指令（Claude 专属优势） 这是 Anthropic 官方文档最强调的 Claude 专属技巧。Claude 对 XML 结构标签的解析能力远超自然语言叙述。 一个标准的结构模板： < task >   你的核心任务描述 </ task > < context >   背景信息：用户是谁、场景是什么、有哪些约束 </ context > < documents >    < document   index = "1" > 第一份材料的内容 </ document >    < document   index = "2" > 第二份材料的内容 </ document > </ documents > < format >   输出格式要求：字数、结构、语气 </ format > 对于需要处理多份文档的场景（比如文献分析、合同比对），给每份文档加序号标签，还可以在提示词最后加一句："回答时请注明信息来自哪份文档。"这会显著减少来源混淆。 技巧二：先找证据，再下结论 这是减少 Claude 幻觉（编造内容）最有效的单一技巧，尤其适合学术场景。 在提示词里加这句话： "在给出结论之前，请先从文档中引用你将依据的具体段落，然后再进行分析。" 强迫 Claude 先"找证据"，再"做推理"，可以大幅降低它凭空编造引用的概率。 技巧三：长文档放顶部，问题放底部 这个顺序反直觉，但有据可查——官方资料指出， 把文档内容放在提示词最上方，把你的问题和指令放在最下方，可以将回答质量提升约 30%。 大多数人的习惯：先写问题，再粘文档。换过来试试，效果明显不同。 技巧四：主动触发不确定性声明 Claude 天然倾向于表达不确定性，但需要你主动触发。在提示词末尾加： "如果你对任何部分不确定，请明确指出，不要猜测或补全。" 这一句话，对需要高可信度输出的场景（学术、法律、医疗）来说是必须写进 System prompt 的设计原则。 第三层：高阶思维——产品经理和重度用户需要知道的 思维一：思维链（Chain of Thought）——让 Claude 先推理再回答 一句话定义：在让 Claude 给出答案之前，先让它把推理过程写出来。 就像你解数学题时在草稿纸上写演算步骤，比直接填答案更不容易出错。 用法很简单，在提示词里加一句： "在给出答案前，请先一步一步分析这个问题，列出你的推理过程。" 官方文档建议：对复杂问题使用思维链时， 给出一般性指令，而不是逐步规定它怎么想 ——Claude 的推理路径可能比你预设的更优。 思维二：提示词链（Prompt Chaining）——复杂任务拆成多步 不要试图用一个提示词完成所有事。复杂任务应该拆成多个步骤，每步的输出作为下一步的输入。 以写文献综述为例，拆解后的链条： 步骤一 ：提取各文献的核心论点 步骤二 ：从上一步输出中找出共同主题 步骤三 ：找出不同文献之间的分歧点 步骤四 ：综合分析，写出结构化综述 步骤五 ：润色格式和语言 每一步单独执行，比一口气要求"写一篇文献综述"质量高很多，也更容易在中途发现和修正问题。 思维三：官方工具——免费但很多人不知道 Anthropic 在 Claude Console（ console.anthropic.com ，注册开发者账号后可用）提供了三个免费工具： Prompt Generator ：用自然语言描述你要做什么，它自动生成结构化的 System prompt Prompt Improver ：把你写好的提示词粘进去，它自动分析并优化 Interactive Tutorial ：Anthropic 官方出品的交互式提示词教程，有练习题，适合系统学习 Anthropic 还在 GitHub 开源了完整的提示词工程交互式教程，有 Google Sheets 版本，不需要写代码就能练习。 一句话总结 用好 Claude 的核心逻辑只有一个： 把你的意图翻译得足够清晰，让它不需要猜。 结构、例子、证据优先、分步执行——都是在帮你做同一件事：消除模糊性。 参考资料 资料类型 名称 链接 官方文档 Prompting best practices 查看 官方文档 Prompt engineering overview 查看 官方 GitHub Anthropic Interactive Tutorial 查看 官方博客 Effective context engineering 查看 社区指南 Complete Prompt Engineering Guide 查看 社区 GitHub awesome-claude-prompts 查看 社区 GitHub awesome-claude-skills 查看

Source: https://mp.weixin.qq.com/s/9YfZl_5JWkuF-TL8tpAvZw
