# 审美罗盘 Skill 与插件化设计方案

## 核心判断

审美罗盘不应该做成一个巨大的单体 Skill，也不必一开始就完全拆散。最佳形态是：

> 一个“审美罗盘”总系统，下面分成 Skill 层 + Plugin / Tool 层。

也就是说：

> 审美罗盘应该是一个产品级系统；Skill 负责判断、流程、审美语义；Plugin 负责抓页面、截图、DOM、比对、素材处理这些可执行动作。

---

## 推荐形态

```text
Aesthetic Compass / 审美罗盘
= 一个总入口 Skill
+ 多个子 Skill / reference 模块
+ 一个可选 Plugin 执行层
```

不建议：

```text
一个超大的 SKILL.md
```

也不建议：

```text
几十个彼此割裂的小 Skill
```

正确方向是：

> 品牌和入口在一起，执行能力分层。

---

## 为什么不能只做成一个大 Skill？

因为你想要的两个核心能力本质不同。

### 1. 设计分支 / 品味分支

这是认知和判断系统，适合放在 Skill 里。

例如：

- 极简主义
- 新拟物
- 高级灰
- Apple-like
- Linear-like
- Notion-like
- 游戏化 UI
- 东方美学
- 未来主义
- Editorial / Magazine
- Dashboard SaaS
- AI assistant workspace
- Luxury / fashion
- Developer tool aesthetic
- Cyberpunk / brutalist / glassmorphism

这些需要的是：

```text
审美判断
风格归类
参考拆解
适用场景
禁忌
设计 token 映射
```

这部分放 Skill 很合适。

### 2. 调取其他页面，并作为复制标准

这个更像执行系统，适合 Plugin / Tool。

因为它需要真实动作：

- 打开网页
- 截图
- 抽 DOM
- 抽 CSS
- 识别字体
- 识别颜色
- 识别布局
- 识别组件
- 保存 reference card
- 和目标页面做视觉比对
- 判断相似度或 pixel-level 差异

如果只写在 Skill 里，会变成“描述流程”，但没有强执行能力。

所以这部分更适合做成 plugin，或者至少先沉淀成一组 scripts / tools。

---

## 建议架构

### 第一层：总入口 Skill

```text
aesthetic-compass
审美罗盘总导演
```

职责：

- 判断任务类型
- 选择设计模式
- 决定是否需要调研参考
- 决定是否进入精确复刻
- 调用对应子模块
- 维护 `.aesthetic-compass/` 项目状态

总入口不应该塞满所有审美分支细节，只负责调度。

---

### 第二层：子 Skill / reference 模块

建议至少拆成这些模块：

```text
aesthetic-compass-director
taste-branch-library
reference-ingestion
color-and-token-mapper
guided-redesign
exact-page-benchmark
ui-quality-auditor
```

| 模块 | 作用 | 适合形式 |
|---|---|---|
| `aesthetic-compass-director` | 总入口、模式判断、流程控制 | Skill |
| `taste-branch-library` | 品味分支、风格谱系、设计语言 | Skill + reference |
| `reference-ingestion` | 把网页/截图/产品拆成参考卡片 | Skill + plugin |
| `color-and-token-mapper` | 配色提取、语义 token、暗色/亮色映射 | Skill |
| `guided-redesign` | 借鉴而不抄袭的重设计流程 | Skill |
| `exact-page-benchmark` | 以某页面为复制标准 | Skill + plugin |
| `ui-quality-auditor` | 设计完成后的审查、边界、缺陷 | Skill |

---

## 必须区分两种“参考页面”

“把那个页面作为我们复制的标准”有两种不同含义。

### A. 页面作为灵感参考

这种是：

> 我喜欢它的感觉、布局、气质、配色、信息密度、动效、组件风格。

这时页面是 reference，不是验收标准。

输出应该是：

```text
reference-card
style-card
layout-card
color-card
interaction-card
```

目标是：

```text
提炼它为什么好，然后转化成我们的设计语言
```

不能直接照抄。

### B. 页面作为精确复制标准

这种是：

> 我要做一个一模一样 / 高相似 / pixel-perfect 的页面。

这时页面是 benchmark，不是灵感。

需要进入更严格的流程：

```text
原页面截图
DOM/CSS 抽取
viewport matrix
font/image/token 检查
目标页面截图
视觉差异比对
修复循环
```

这里应该复用或扩展现有的：

```text
html-exact-replica
```

它适合做“页面作为执行标准”的底座。

---

## Skill 与 Plugin 的边界

### 适合 Skill 的部分

- 设计判断
- 审美分类
- 参考解读
- 提问策略
- 用户品味建模
- 设计流程
- 验收标准
- 风格禁忌
- 设计方向选择
- token 命名规则
- 输出格式

### 适合 Plugin 的部分

- 抓网页
- 截图
- DOM/CSS 解析
- 字体检测
- 图片资产下载
- 颜色提取
- Playwright 渲染
- pixel diff
- 生成 reference board
- 保存项目状态
- 批量比较多个参考页面
- 从 Figma / 网页 / 截图抽结构

---

## 建议落地顺序

### Phase 1：先做 Skill 系统

目标：

```text
让审美罗盘会“判断”和“组织设计过程”
```

先完善：

1. 模式选择
   - 原创设计
   - 参考驱动设计
   - 精确复刻
   - 配色提取
   - 风格迁移
   - 设计审计

2. 品味分支库
   - 每个品味分支的特征
   - 适合什么产品
   - 不适合什么产品
   - 常见误用
   - token 倾向
   - 参考品牌 / 产品

3. reference card schema
   - 页面是什么
   - 好在哪里
   - 哪些可借鉴
   - 哪些不能复制
   - 结构参考
   - 配色参考
   - 组件参考
   - 动效参考
   - 信息密度参考

---

### Phase 2：用现有工具半自动跑通

先不写独立插件，用现有能力跑通流程：

- browser
- vision
- web_extract
- screenshot
- HTML/CSS 检查
- Playwright 脚本

例如用户发一个页面，审美罗盘应能输出：

```text
1. 页面审美类型
2. 布局结构拆解
3. 配色系统
4. 字体与空间感
5. 组件语言
6. 可复制部分
7. 不建议复制部分
8. 可迁移到我们项目的 token
9. 设计方向建议
```

---

### Phase 3：再做 Plugin

当流程稳定后，再做插件。

插件可以叫：

```text
aesthetic-compass-plugin
```

或：

```text
design-reference-engine
```

可提供工具：

```text
capture_reference_page(url)
extract_visual_tokens(url_or_screenshot)
generate_reference_card(source)
compare_against_benchmark(target_url, benchmark_url)
build_moodboard(references)
classify_taste_branch(source)
```

这样它就不只是“提示词 Skill”，而是一个真正能执行的设计分析系统。

---

## 建议目录结构

### Skill suite 结构

```text
skills/creative/aesthetic-compass/
├── SKILL.md
├── references/
│   ├── taste-branch-taxonomy.md
│   ├── reference-card-rules.md
│   ├── exact-vs-inspired-reference.md
│   ├── color-token-rules.md
│   ├── layout-structure-rules.md
│   └── design-source-registry.md
├── templates/
│   ├── reference-card.template.md
│   ├── taste-branch-card.template.md
│   ├── visual-direction.template.md
│   ├── page-benchmark-contract.template.md
│   └── design-token-map.template.json
├── schemas/
│   ├── reference-card.schema.json
│   ├── taste-branch.schema.json
│   └── benchmark-contract.schema.json
└── scripts/
    ├── extract-colors.py
    ├── screenshot-page.py
    └── compare-screenshots.py
```

### Plugin 结构

```text
plugins/aesthetic-compass/
├── plugin.yaml
├── tools/
│   ├── capture_reference_page.py
│   ├── extract_visual_tokens.py
│   ├── classify_taste_branch.py
│   ├── generate_reference_card.py
│   └── compare_page_benchmark.py
├── schemas/
├── templates/
└── README.md
```

---

## 核心原则

这个 Skill 最重要的原则应该是：

> 审美罗盘不是风格词典，而是“参考 → 判断 → 转译 → 实现 → 审查”的设计决策系统。

它不只是告诉我们“这是极简风”。

它应该能回答：

```text
这个页面为什么好？
它属于什么审美谱系？
哪些东西值得学？
哪些东西不能抄？
如果迁移到我们的产品，应该变成什么结构？
应该变成什么 token？
最终页面怎么验收？
```

---

## 拆分判断标准

| 情况 | 处理 |
|---|---|
| 只是审美知识库 | 放 references |
| 有独立触发场景 | 拆成子 Skill |
| 需要真实抓网页 / 截图 / 比对 | 做 Plugin / script |
| 只是输出格式 | 放 template |
| 只是数据结构 | 放 schema |
| 会被多个 Skill 复用 | 独立 shared reference |

---

## 最终建议

> 做成一个“审美罗盘系统”，入口在一起，能力分层。第一阶段用 Skill suite，第二阶段沉淀 scripts，第三阶段再插件化。

不要一开始就全插件化，因为现在最难的不是技术，而是：

```text
审美分支怎么定义
参考页面怎么解释
哪些东西能复制
哪些东西只能转译
什么时候是 inspiration
什么时候是 exact benchmark
验收标准是什么
```

这些先用 Skill 打磨会更快。

等流程稳定后，再把重复的机械步骤做成 plugin。
