# RuruOS 开发交接文档

> 给下一个会话 / 下一台电脑上的 Claude Code / Codex：读完本文件 + 根目录 `AGENTS.md`，即可无缝继续开发。
> 最后更新：2026-07-11 深夜 —— **🎉 v1.0 成品里程碑（用户验收满意，v8.0=1.0）**。顶栏（名牌/金句/统计/热力/天气/时钟黄历/方章）、追剧墙（搜剧/分季/置顶/轮播）、阅读器（外观面板/进度/备注）、AI 管线（搜剧补全/收录简介/搜评分）全部定稿。后续为增量开发。Mia 规则文档已交付桌面（含分季规则）。

## 这是什么

RuruOS = Lulu 的个人知识系统中枢（Obsidian vault）。数据层 = 纯 markdown + frontmatter（规范见 `AGENTS.md`，唯一权威）。界面层 = 自研 Obsidian 插件。

## 架构

```
RuruOS/
├── AGENTS.md                        ← Agent 写入规范（改 schema 先改这里）
├── Home.md                          ← 旧版 Bases 主页（fallback，主力是插件）
├── 00-Dashboard/*.base              ← 原生 Bases 视图（fallback）
├── 10-Projects / 20-Reading / 30-Media / 40-Life / 50-Knowledge  ← 数据
├── 90-System/Scripts/migrate-from-old-vault.py  ← 旧 vault 迁移脚本
└── .obsidian/
    ├── plugins/obos-home/           ★ 核心：自研插件（无构建，直接改 main.js）
    │   ├── main.js                  三个视图，全部手写 JS，无依赖无编译
    │   ├── styles.css               深色玻璃拟态全部样式
    │   └── manifest.json
    ├── themes/Minimal/              主题
    └── snippets/obos-home.css       旧版 Bases 主页样式（fallback 用）
```

## 插件 `obos-home`（核心成果）

无构建链：改完 `main.js`/`styles.css` → Obsidian 里 `Cmd+P` → Reload app 即生效。

六个视图（新增 VIEW_MDPREVIEW 只读预览）：
1. **VIEW_HOME 主屏**（2026-07-10 v3，Vela）：极光底色（紫/青/琥珀三层光晕，非纯黑）+ 卡片带专属色相顶光与图标芯片（待办绿/日历紫/项目青/账目琥珀）。待办卡：打勾完成、**点标题行内编辑**（改名/改截止日、回车保存、Esc 取消）、悬浮 × 删除、输入框回车新建；日历卡：未来 7 天按天分组、头部 ＋ 新建、**点行行内编辑**（名称/日期/起止时间）、悬浮 × 删除；账目卡：只留账本列表（彩点 + 金额，负数红显）+ 账本构成迷你色条，点行进账本详情页；文章卡占半栏（分类 chips 照旧），右半是**知识沉淀卡**（50-Knowledge 最近更新 8 篇，主题彩签）；追剧墙全宽照旧。21:9 下主网格四列
2. **VIEW_READER 文章阅读器**：杂志排版，顶栏 ‹中枢/分类/原文↗/标记已读，底部「读完归入已读」
3. **VIEW_DRAMA 剧集详情**：海报大图+光晕、待归类徽章、事实行、决策按钮（待定/想看/在追/看完/弃剧）、进度 +/−、**联网搜封面**（TVmaze→iTunes 兜底，`fetchPoster()`）
4. **VIEW_LEDGER 账本详情**：hero 大金额（负数红）+ 解析笔记 md 表格自动变形——带「占比」列→分段占比条（签名元素）、两列≤6行→统计胶囊、其余→对账单式明细表（斑马纹/sticky 表头/金额琥珀/负数绿/合计行加重）、更新记录→时间线。**数据格式不变，Mia 照旧写 md 表格**，解析器在 `parseLedgerSections()`
5. **VIEW_PROJECT 项目详情**：状态徽章 + 事实行 + code_path 点击复制 + 项目文件卡格（子目录分组）+ 主页正文杂志排版

关键实现约定：
- 所有写回一律 `app.fileManager.processFrontMatter`
- 所有数据读取走 `metadataCache`，`collect(folder, type)` 在 dataMixin 里
- 刷新：metadataCache `changed` 事件 + debounce 250ms 全量重渲染
- 命令面板：`打开 RuruOS 中枢` / `继续阅读：打开第一篇未读文章` / `处理待归类剧集`
- 深色玻璃拟态 tokens 在 styles.css 顶部 `.obos-root` CSS 变量里

## 观影管线（已定流程）

用户发观影文章给 Mia → Mia 按 AGENTS.md 写入 `30-Media/Dramas/`，`status: 待定` → 主屏「待归类」tab 高亮 → 用户点进详情页决定。封面 Mia 有就下载，没有 App 内一键搜。

## 已完成

- 目录结构 + AGENTS.md 规范 + 模板
- 旧 vault（`~/Documents/Obsidian Vault`，已冻结只读）157 文件全部迁入
- 插件三视图全部真机验证通过
- 17 篇文章、1 部真实剧（金特务，待定状态）
- **2026-07-10 全库目录整理**：50-Knowledge 收敛为 8 个固定中文主题目录（AI与Coding / 商业与变现 / 设计与审美 / 游戏设计 / 社媒观察 / 工具观察 / 视频知识 / 文档与方案），英文旧目录（ToolWatch、SocialCapture、VideoKnowledge、DesignMaterials、Documents、Mia-Inbox、Reports、资源库 等）全部并入；旧总览页归档到 `90-System/旧系统规则/`；死链已修。整理前全库备份在当次会话 scratchpad
- **账目 schema 定稿**（AGENTS.md）：流水 `type: transaction` 进 `40-Life/Finance/流水/`，项目账本 `type: ledger`（frontmatter 带 `total`/`currency`）放 Finance 根目录
- **账目卡接真数据**：本月流水按主币种汇总 + 分类 chips + 项目账本列表（读 ledger frontmatter），空流水时显示 ¥0 空态
- 3 部示例剧、示例待办、示例日程、示例海报已删除，全库均为真实数据
- 给 Mia 的完整写入规则文档已生成：`~/Desktop/RuruOS-写入规则-给Mia.md`（含旧→新路径对照表）
- **2026-07-10 深夜 补迁 + 全库审计**：迁移脚本当初漏了大量文件，已补迁——3 个真实账本（公开版已替换为虚构示例账本）、原始表格若干、393 张附件图（`99-Attachments/审美罗盘|AI视频知识/`，全库 `99-附件/`→`99-Attachments/` 引用已改）、3 篇被 MOC 引用的文章分析（→商业与变现）、TCG 英文介绍页、项目雷达 07-09 摘录。逐文件比对后剩 37 个未匹配均为故意不迁：14 篇原始抓取版文章（正式版已在，dedup_key 相同）、14 个 MediaQueue 回执、旧导航页/会话缓存等
- 账本 schema 补充：欠款类账本 `total` 直接写负数（如 -128000），中枢红色显示
- **2026-07-10 深夜 UI v2（Vela 设计）**：新增账本详情页、项目详情页、主屏日历卡；主屏卡序 待办/日历/项目/账目；账本行、项目行分别指向新详情页

- **2026-07-11 vault 改名 OBOS → RuruOS**：文件夹、Obsidian 注册表、同步脚本（提醒清单/日历名同步改为 RuruOS）、launchd 模板、各文档均已更新；插件 id/CSS 前缀仍为 obos-（内部标识，未动）；homepage 社区插件已停用（主页由本插件接管）
- **2026-07-11 UI 概念稿定稿 v5「软糖手账」**：糖果双主题（奶油白天/莓果夜晚）、四详情页+MD只读预览、AI 浓缩/清杂按钮、项目改为 RuruCode 只读扫描——概念稿见会话 Artifact，**已移植进插件**（main.js 1690 行 / styles.css 全量重写 / 项目卡数据源改为 RuruCode 只读扫描 / VIEW_MDPREVIEW 第六视图 / AI 浓缩含索引维护职责）。vault 已有 git，写坏可回滚

- **2026-07-11 苹果同步上线**：首次同步成功（权限已授予），launchd 每 5 分钟自动跑（`~/Library/LaunchAgents/com.lulu.obos-sync.plist`）；提醒清单/日历名均为 RuruOS；日志 `~/Library/Logs/obos-sync.log`
- **2026-07-11 真机两轮修缮**：默认主题奶油白天（深色仅手动切）、自绘糖果日期选择器、封面搜索改九宫格自选（顺带存 TVmaze 评分）、剧集进度/评分常驻、待办添加按钮、阅读器自动分段（长段每两句一切）、追剧墙外部评分位（豆瓣/IMDb 由 Mia 补录）

- **2026-07-11 凌晨真机打磨（第三~五轮，用户逐屏验收）**：
  - **验证纪律（重要教训）**：改样式必须 `screencapture` 截屏自验后才向用户交付，代码正确≠视觉正确；scratchpad 里 verify*.png 是本次验证记录
  - 莓果夜晚定为明确紫罗兰（#2f2358+渐变+光斑加倍）；默认主题=奶油白天，深色仅手动切换（localStorage `obos-theme`）
  - **白字根因**：Minimal 应用主题高优先级给 button 灌白字 → 已加文字色护甲（!important 段，见 styles.css 末部）
  - 自绘**糖果日期选择器**与**时间选择器**（原生面板全废，date/time 输入均为 text 型 readOnly + 弹层）
  - 待办卡：进行中/已完成双 tab（已完成可一键恢复）；新建行 40px 基线对齐 + 添加按钮
  - 日历卡：列表/月历双模式（月历=整月网格+彩点+选中日安排，今天=奶油黄实底）；渲染保留滚动位置（点击不再跳顶）
  - 追剧墙置顶（用户指定）；豆瓣/IMDb **独立品牌徽章**（详情大章+墙上迷你章，豆瓣绿/IMDb黄）；金特务 IMDb 8.1 已填（豆瓣海外检索够不到，靠详情页「搜评分」按钮或 Mia 补录）
  - 搜封面=候选九宫格自选（TVmaze+iTunes，顺带存 TVmaze 评分）；剧集评分星与进度控制**常驻**（不再限「在追」）
  - 阅读页：版心 900px、正文 1.16em/行高 1.95、自动分段（>200字整坨按每两句切段）、配色 v2（标题莓果、**加粗=奶油黄荧光笔划底**、链接天空蓝下划线、引用香芋底）
  - 知识沉淀行点开走阅读器排版（非文章类自动隐藏已读/废弃钮）
  - **苹果同步最终形态**：launchd 因 TCC 后台无权限废弃（教训：后台进程弹不出授权窗）→ 改为**插件调度**（启动 15 秒后 + 每 5 分钟，顶栏「同步」手动钮）；前提=Obsidian 开着；权限已授予 Obsidian；日志 `~/Library/Logs/obos-sync.log`
  - **AI 浓缩/清杂按钮**（文章卡）：后台跑本机 claude CLI（`-p --permission-mode acceptEdits`，cwd=vault），浓缩已实跑成功一次；清杂只进 .trash 不硬删；`plugin.runClaude()` 通用方法供「搜评分」等复用
  - 左侧栏 ribbon 换 RuruOS 菱形徽记（addIcon 'ruruos-crest'）
  - 项目卡=RuruCode 只读扫描（`PROJECTS_DIR`，只列 .md，深度≤3，插件内**零 fs 写调用**）
  - vault 有 **git**（写坏可回滚），Mia 入库整理规则、剧集 external_rating schema 均已写入 AGENTS.md

- **2026-07-11 阅读打磨 v3（用户六点反馈逐项落地）**：
  - 正文小标题莓果粉→**蜜橙**（light #b5581e / dark #ffab76，左边条同步换 --peach）——粉色在夜晚主题与近白正文难分
  - 链接下划线细化：`text-decoration-thickness: 1px` + offset 4px（颜色不动）
  - 阅读版心 900 → **1100px**
  - **全局界面字号**：主屏顶栏「A− % A＋」胶囊，localStorage `obos-ui-scale`，默认 105%（比旧版大半档）、步进 5、范围 90-130；挂在 dataMixin.applyTheme 里（root.style.fontSize），六视图全生效
  - **阅读正文字号**：阅读器顶栏同款胶囊，`obos-reader-scale`，默认 100%（=1.16em）、步进 10、范围 80-150，就地改 style 不重渲染不打断阅读
  - **备注便利贴**：文章顶栏「✎ 备注」开合奶油黄便利贴（hero 下方），textarea 输入停 0.9s 自动写 frontmatter `note` 字段（processFrontMatter，空值删字段）；有备注默认展开、按钮带 ●；AGENTS.md 已加一行：Agent 对 `note` 保留勿动
  - **阅读进度**：顶栏正下方 4px 糖果渐变进度条；scrollTop 每 400ms 存 localStorage（`obos-readpos:<path>`），重开自动恢复（图片异步撑高有 400ms 二次校正，用户已滚动则不打扰）；标记已读/读完时清位置
  - 顶栏新增「下一篇未读 ›」（openState 复用当前阅读器 leaf）
  - **修了个移植期 bug**：两条命令面板命令（继续阅读/处理待归类）里 `dataMixin.openInView.call({app})` 的 this 缺 openState 方法，一直静默 TypeError——改为直接 `dataMixin.openState.call({app}, …)`。此 bug 在 HEAD 基线即存在
  - 验证：临时 addCommand 自检（DOM 驱动备注/字号/滚动全链路，结果落 JSON，全绿后删除）+ 真机截屏（scratchpad verify-*.png）
  - **自动化驱动教训**：中文输入法会吞 osascript keystroke 的空格（键入英文命令名会变形）→ 走「剪贴板粘贴 + key code 36 回车」最稳；devtools 开着时 Cmd+P 会被它抢走；devtools console 有 allow-pasting 粘贴保护基本绕不过——复杂验证直接写临时插件命令跑

- **2026-07-11 v6 大改版拍板（Vela 概念稿，用户全项确认，凌晨已批准开工「完全按 Demo 来」）**：Demo=规格文件，见 `90-System/Ruru模板/示例-软糖手账v6概念稿.html`（会话 Artifact 同源）。定案：
  1. 桌面动效：樱花/细雨/落雪/萤火四种用户自选，每种带**速度/数量/大小/方向角/饱和度/可见度**六项调节（方向 -45°~45° 负值左斜；浅主题下雨/雪/萤火配色自动加深一档），默认樱花，reduced-motion 全关；**六项调节收进顶栏「动效」按钮的弹出面板（.pop 组件），不裸摆**（用户拍板的交互模式）
  2. 主题：四浅二深六套（奶油/抹茶/海盐/蜜桃乌龙/莓果夜/葡萄夜）+ 自调色相滑杆
  3. 顶栏重构=「日签卡」：问候+句子精选（句库 `90-System/句子精选.md` 待建，口味=**文学+设计，不收诗词**，5 分钟轮换）+大字时钟/日期章/时辰章；四统计块放大进顶栏（一块一色，点击直达）
  4. 天气模块：玻璃糖罩小剧场，四态动画，Open-Meteo 免 key，默认东京；顶栏迷你胶囊；雨雪联动桌面动效=开关默认关
  5. 按钮全案：「糖霜底」规矩——未选中胶囊必须有 frost 底+细边（黑药丸病根），选中=糖果实底+抬升；落地写成 .obos-pill 基类全库继承
  6. 徽记：定 **B·软糖R**（SVG 在 Ruru模板/README.md），界面只显示图标不带文字
  7. 阅读器：版宽三档段选（舒适/标准/满屏，localStorage）；便利贴浅色化+主题联动（--note-bg 变量）+删除按钮
  8. 废弃箱：文章卡加「废弃」tab；**废弃改进 vault 内 .trash/**（现在进系统废纸篓，插件看不见）；恢复=移回 Articles/；**彻底删除单击即删不做二次确认**（用户拍板）
- **Ruru 模板已入库并升级为「糖霜」skill**：权威版 `~/Documents/RuruCode/tangshuang-skill/`（skill 名 tangshuang，用户定名「糖霜」，含 SKILL.md 规范 + 起步骨架 + 个人主页示例，已 symlink 进 ~/.claude/skills/）；vault 内 `90-System/Ruru模板/` 是自用副本 + v6 概念稿存档。**以后任何「用糖霜/Ruru 风格做网页」的任务直接触发 tangshuang skill**，不要自己发明样式

## 已知未决 / 下一步候选

1. 豆瓣评分自动抓取（海外检索通道封闭）——短期靠「搜评分」按钮与 Mia 补录
2. 苹果同步依赖 Obsidian 在前台机器上开着；若要 24h 同步需另想 TCC 方案（如给 python3 手动授 Automation 权限）
3. AI 清杂还没实跑过首轮；浓缩跑过 1 篇成功
4. 给 Mia 的规则文档需要重新导出（桌面旧版已被用户取走，AGENTS.md 是最新权威）
5. 待办/日历里的测试数据（测试、语音发、开会、搞一个副业等）由用户自行清理或保留

## 待办（按优先级）

1. **v6 大改版插件落地**（进行中）：
   - ~~按钮糖霜基类~~ / ~~六主题+自调色相~~ / ~~主题与动效弹出面板~~ / ~~桌面动效引擎（六项参数 localStorage obos-fx，applyTheme 里 mountFx 挂全部六视图）~~ ——2026-07-11 第一批已上线，真机自检通过（弹出面板 cliclick 合成点击进不去是自动化工具的怪，element.click() 与真人鼠标正常）
   - ~~顶栏日签卡~~ ~~徽记 B~~ ——第二批已上线：问候+句子精选（`90-System/句子精选.md` 55 句已建，5 分钟轮换+↻ 手动）+大字时钟（每秒走，onOpen registerInterval）+时辰章+四统计块（一块一色点击直达卡片）；徽记 B 上顶栏与 ribbon，界面不再显示文字。**护甲教训 +1**：Obsidian/Minimal 给 button 灌固定 height 和 inline-flex，自绘块状按钮必须 display:block + height:auto
   - ~~天气模块~~ ——第三批已上线：Open-Meteo 免 key（东京丰岛区，1h 缓存，requestUrl 绕 CORS），顶栏玻璃糖罩卡（WMO 码→晴/多云/雨/雪四态动画）+体感湿度+六时段条；同批：时钟区放大、统计块字号全档加大、海报墙放大30%（178→232px）、海报 hover 改 3D 浮雕倾斜（mousemove 驱动，替代单纯放大）、深主题输入框提亮+占位字可读、问候名字可点击行内编辑（localStorage obos-username）
   - ~~v6.5 顶栏与按钮全案~~ ——经 10 稿 HTML 迭代拍板后整体落地：顶栏左右分区（左=问候+金句 1.5em 同号+四统计块 2x2 等高带数据行/彩条/流光；右=功能区糖霜底：裸天气场景+温度五档冷热渐变(tempGrad)+体感湿度降水三格 | 时钟 4.2em+日签行+三颗 54px 彩色方章）；按钮全案=统一 12px 圆角矩形+全彩淡底（--pc 一组一色，剧五态/待办/日历/文章全配色）+果冻钮放大一档；卡片贴纸标题栏（渐变横幅+54px 果冻方章+五个精细图标 viewBox24+副题计数）；真机 21:9 验收通过
   - **v6.5 设计学习已回流糖霜 skill**（铁律 1 升级全彩胶囊 + 新增 9-12 条：方章钮/空档治理/等高信息块/数值语义色），骨架 .pill 同步
   - ~~阅读器版宽三档~~ ——v6.6 已上线（舒适 760/标准 1100/满屏 1600，obos-reader-width，阅读器顶栏段选，就地生效）；同批：四统计块收窄+右侧新增「今日卡」（继续阅读=有 readpos 进度的未读文章优先，一键回阅读器；今日安排=当天日程前 3 条）、天气列居中且场景/温度再放大（5.2em）、三方章下移、日期/时间选择器弹层换 v6.5 新装（近实底+圆角 12）
   - ~~今日卡~~ ——用户嫌与现有卡重复，提案四选一后拍板 **A 案「一周热力柱」**（v6.7 已上线）：7 天柱状图=当天 read_at 文章数+done_at 待办数，色随强度（frost→mint→butter→berry），今天发光呼吸，hover 原生 tooltip 显每日明细，底部本周合计。**待办打勾现在会写 done_at**（取消勾清空），历史完成的没有日期统计不到，从上线日起积累
   - 同批修：金句长句两行显示不截字、卡片跑马灯边框 2.5px 加重加速、天气场景右贴温度
   - ~~v6.8 四项~~ ——已上线（2026-07-11 早，真机逐项截屏验证）：
     1. **滚动条抖动修复**：`.obos-scroll/.obos-reader-scroll` 加 `scrollbar-gutter: stable`（出条收条不再挤宽度）+ 金句 q 预留两行 min-height 按住高度振荡源
     2. **天气场景模块化**：太阳+光圈合并为 `.obos-wsun-unit`（光圈永远以太阳为圆心——修掉光圈脱臼 bug），云朵/雨雪全走 `.obos-scene[data-w]` CSS 类定位，**JS 里零内联坐标**；整体位置/大小只调 `.obos-scene-inner` 的 translate+scale 一处（现 translate(18px,10px) scale(1.7)）
     3. **追剧墙横向化**：grid→flex 一行横滑（海报固定 232px），鼠标按住拖拽滑动（拖过 4px 判定拖动、`.dragging` 屏蔽海报 pointer-events 防误开详情），滚动条细条 9px
     4. **剧集置顶**：详情页顶栏「☆ 置顶/★ 已置顶」钮（frontmatter `pinned: true`，取消=删字段），墙内置顶剧排最前+海报右上角 ★ 圆章（左上是待归类章，勿再放回左上会叠住）；AGENTS.md 剧集 schema 已补 pinned 说明（Mia 不写、保留勿动）
     - **本机命令面板中文名**：Reload 命令叫「重新加载 Obsidian（不保存当前编辑内容）」，粘贴搜「重新加载」即可；英文名搜不到
   - ~~v6.9 顶栏细节+搜剧添加~~ ——已上线（2026-07-11 早二批，真机验证）：
     1. 顶栏：R 徽记 78→104px；问候删 ✿ 符号；层级拉开=问候 1.82em/800 粗、金句 1.38em/500 常规；统计块标题字（待办/待归类/未读/在追）1.34em；三方章 54→65px（+20%）
     2. 统计块**镜面流光扫过已删**（obos-tilesweep，用户拍板没用）
     3. **搜剧添加**：追剧墙卡头「＋ 搜剧」→ 弹层输入剧名（英文最准）→ TVmaze 九宫格候选（海报/年份/平台/评分）→ 点选自动建档：schema 全量 frontmatter（GENRE_CN/COUNTRY_CN 映射中文、集数从 /shows/:id/episodes 数、海报下载 Posters/、tvmaze 评分）→ 打开详情页 → **后台 runClaude 补中文名+豆瓣/IMDb+notes**（只许改这几个字段）。同名剧直接跳详情页不重复建
     4. **缩放抖动根因二查**：探针实测（见 5）静止与重渲染下布局全稳；补掉最后一个异步空洞——renderWeather 冷缓存时先画一帧矮「加载中」再弹高（新增 plugin.freshWeather() 同步取新鲜缓存，热缓存直接同步渲染）。若用户再报抖动→让 TA 当场跑诊断命令
     5. **临时诊断命令**（保留在 main.js onload，抓到根因后删）：「OBOS 诊断：布局振荡采样15秒」——每 250ms 记录全部滚动容器 sh/ch/sw/cw + 窗口尺寸，写 vault 根 obos-diag.json；分析法=按 .p 路径归组看 cw/ch 是否多值（注意同路径元素会归到一组，勿误报）
   - ~~v6.9b/c 抖动真凶+顶栏迭代+中文搜剧~~ ——已上线（2026-07-11 上午三批，真机验证）：
     1. **缩放抖动真凶（用户跑探针实锤）**：糖果云光斑（46vw 泡泡 40s 漂移）与糖粒层没裁剪，周期性戳出根容器；根容器 overflow:hidden 被 Obsidian 高优先级规则压成 auto → 滚动条随动画长出/收回，全界面 ±15px 呼吸胀缩。修法=`.obos-candy/.obos-motes/.obos-detail-sky` 加 overflow:hidden + `.view-content.obos-root` 等 hidden !important 双保险。复测 60 样本 root 宽恒定。**教训：装饰动画层必须自带 overflow:hidden，别赌根容器裁剪**
     2. 日程/待办/文章行的悬浮 × 删除钮错位修复（.obos-row-del 补 padding:0 护甲——Minimal 的 button 内边距把 × 挤出圆心）
     3. R 徽记再放大 20%（→125px）；三方章稍微下移（margin-top 26px）
     4. **A案·金句右置落地**（用户拍板）：金句挂问候行右端 1.58em、右对齐；追加拍板=出处人名不显示（.src display:none，数据仍在句库）、句子在 2.9em 预留高内上下居中（1/2 行都稳）
     5. **三方章图标 v2 重绘**（用户嫌 v1 太省事）：同步=循环双箭头抱 iCloud 小云 / 动效=白瓣樱花+两片飘落瓣 / 主题=昼夜圆窗（左太阳右月牙星星），40px，与卡片贴纸图标同语言；按钮果冻质感升级（顶部玻璃高光带 ::before + 底部内阴影 + 糖底硬边 + 彩色弥散投影）
     6. **追剧墙自动轮播**：剧满一页（scrollWidth>clientWidth）rAF 慢速右滑 0.4px/帧，悬停/拖拽即停，手动拨过歇 3 秒，到尾歇 2.2 秒平滑回头循环；剧少不动。（现库仅 1 部剧未实测滚动，代码路径已过）
     7. **中文搜剧**：TVmaze 直搜（部分中文剧有 aka 直接命中，如 黑暗荣耀→The Glory 实测✓）→ 无果且含中文时走 `plugin.askClaude()`（新增：spawn claude -p --model haiku 快问快答 Promise，30s 超时）转英文名重搜；中文查询建档 title/文件名用中文、title_original 存 TVmaze 名；补全 prompt 按原名搜。**注意：维基/DDG 这台网络不通，中→英转换只能靠本机 claude CLI**
     8. 天气 wmoInfo 场景与新构图在「大致晴朗」（code 1）下带光圈正常
   - ~~v7.0 问候板块+图标定稿~~ ——已上线（用户在 HTML 候选页拍板「2+S3 F3 T3」）：
     1. **B案·大字名牌**：问候两行制——小字行 `${greeting()} ☀︎/☾ ${时辰词}`（muted 800），名字 2.7em 糖果渐变字（berry→peach→48% 处→taro，background-clip:text + drop-shadow 光晕），虚线下划线废除，点击改名照旧
     2. **三方章图标定稿**：同步=S3 大循环环（2.4 粗描边+中心糖点）/ 动效=F3 飘落三瓣樱瓣+风线 / 主题=T3 调色盘四色点。**流程沉淀：图标/板块设计争议直接做 HTML 候选页（Artifact）让用户看效果选，ASCII 预览没用**——候选页存 scratchpad `topbar-design-options.html`（含 12 版图标可回头翻）
     3. 演示页教训：Artifact iframe 里 body 背景**不能用 fixed attachment**（断层变白）；引号别用 ::before/::after 配 grid（会被拆行）
   - ~~v7.1 徽记换图~~ ——顶栏徽记从 SVG 软糖 R 换成用户 AI 生成的**果冻手账本 logo**（`crest.png`，插件目录内，adapter.getResourcePath 加载），尺寸 125→100px（-20%）。原图无 alpha 深紫底，已用 PIL 差值抠图（色距 alpha + 反预乘还原真彩 + 主体 bbox 裁剪滤散点）产出透明 512px 版，深浅主题合成预览均无残边。ICON_CREST 常量与 ribbon 徽记未动
   - ~~v7.1b 三修~~ ——①中文搜剧挂死根因：**Obsidian spawn 的子进程 stdin 是打开的管道，claude CLI 会等输入直到 EOF**（终端里 stdin 是 TTY 所以测不出）——askClaude/runClaude 均已 `stdio:['ignore','pipe','pipe']` 关死，超时 30→45s，AI 转译失败改为错误上屏（不再静默装「没搜到」）；②搜剧输入框 hover 变黑=主题灌深底，已锁 background !important 护甲；③金句区 flex:1 向左伸展、q 限宽 24→32em 长句一行放得下
   - ~~v7.2 补全闭环~~ ——用户报「添加完不自动更新资料+暂无封面字看不清」，实为三层问题（龙之家族实测闭环全通过）：
     1. **详情页不跟数据**：新建档 openInView 时 metadataCache 未就绪渲染一帧空数据（无海报/无chips/评分待录）且永不刷新；AI 补全写回也看不见。修=ObosDramaView.onOpen 注册 metadataCache changed（限本文件）自动重渲染——补全写回瞬间页面自己长出评分，已实测
     2. **后台补全查不了网**：`claude -p --permission-mode acceptEdits` 非交互会话里 WebSearch/WebFetch/curl 全被权限拒（acceptEdits 只放行文件编辑），豆瓣/IMDb 永远留空。修=spawn 参数加 `--allowedTools WebSearch WebFetch`。**教训：给 runClaude 添新任务类型时想清楚它要哪些工具权限**
     3. runClaude busy 时任务从丢弃改为排队（_claudeQueue，跑完自动接续）；补全 prompt 全字段化（逐字段查缺补漏，已有值不动）；「暂无封面」文字删除（按钮改「联网搜封面」）
   - ~~v7.2b 小修~~ ——空态提示/搜索占位字深主题下提亮；文案更新（追剧墙空态提「＋搜剧」、弹层标题改「中文名/英文名都可以」）；**搜剧补全 prompt 升级：正文占位行由 AI 替换为「## 简介 + ## 看点 + 来源链接」**（此前正文简介只有 Mia 观影管线会写，搜剧添加的档案正文是空的——用户问过这个机制）
   - **Mia（Hermes agent）规则文档已交付**：`~/Desktop/RuruOS-整理入库规则-给Mia.md`——「毕阳」是语音识别错误，agent 就是 Mia，定位=知识中枢/第二大脑守门人，归类是核心能力；观影管线要求满血建档（评分/海报/简介/看点/Mia 简评一次到位）。文档声明 AGENTS.md 为唯一权威。附件目录维持 `99-Attachments/Mia/<域>/` 不变
   - ~~v7.3 观影闭环补齐~~ ——①详情页顶栏新增「**收录简介**」钮（AI 联网查介绍写正文简介/看点/条目链接，已有段落只查缺补漏、Mia 简评保留，metadataCache 监听让写回即时上屏）；②追剧墙**空态重排**（场记板贴纸图标+主副句+「＋搜剧添加」果冻钮居中竖排，替换原先一行灰字，用户嫌太没美感）；③简介三通道并存不打架：Mia 建档写全 / 搜剧添加后台自动补 / 详情页手动点收录，全部「已有值不动只填空缺」
   - ~~v7.4 小黄历+空态图标~~ ——①时辰章改显**阴历**（「五月廿七」），下方新增一行宜/忌小黄历（宜=薄荷签 忌=莓果签），方章随之下移；农历用 **Chromium 内置 Intl 中国历**（`zh-Hans-u-ca-chinese`，零数据表零网络，闰月自带「闰」前缀、「腊月」已容错映射），宜忌用**建除十二神本地推算**（日支=儒略日锚点 2000-01-01 庚辰校准；月支简化按农历月非节气月，交节前后一两天可能偏一位——是"简易黄历"，用户要的就是简单款）；按日缓存不随时钟每秒重算。时辰词仍在问候小字行
     ②追剧墙空态图标重做：场记板（放大发糊）→ 专画的**爆米花桶**贴纸（条纹桶+三球爆米花+飘粒+小星，ICON_EMPTY_WALL）
   - ~~v7.5 中文搜剧改走豆瓣~~ ——用户实测「熊」（The Bear）单字查询 TVmaze+AI 转译全军覆没，拍板改豆瓣方案：**中文查询 → 豆瓣 `subject_suggest` 联想**（免 key 带 UA 即可，返回中文名/sub_title 原名/年份/海报/集数，模糊匹配极强）→ 选中后用原名桥接 TVmaze（年份 ±1 优先）拿全量数据走原建档 → **桥不上用豆瓣数据兜底建档**（`addDramaFromDouban`，豆瓣海报 `s_ratio_poster→l_ratio_poster` 大图，img 标签要 `referrerpolicy=no-referrer` 防盗链）→ AI 转译降为三级兜底。**豆瓣在本机可达**（AI 补全那次实测过 subject_abstract）。⚠️ 自动化教训：用户活跃用机时禁止盲坐标 cliclick（两次险些点进用户窗口），改请用户自己实测
   - ~~v7.6 搜剧分季~~ ——用户指出总集数不分季是设计错误（追剧的人常只追最新一季）。重构：**豆瓣路线**（本就分季条目）保留「第X季」按季建档、季海报、季集数；**TVmaze 路线**选中剧后弹「追哪一季？」选季网格（季海报/年份/集数 + 整部剧选项，单季剧不弹）；建档统一走 `createDramaFile(sh, overlay, opts)`（opts=title/origName/episodes/posterUrl/year），补全统一走 `enrichDrama()`（prompt 要求译名保留季号、episodes 按季填）。schema 零改动（分季=每季一档案，同豆瓣习惯）。旧《龙之家族》0/26 整剧档待用户决定改不改
   - ~~v7.6 字号调节糖霜化~~ ——阅读器 A−/A＋ 灰药丸换蜜桃果冻组（12px 圆角容器+果冻小钮+display 数字），与顶栏全彩按钮同族
   - ~~v7.8 Vela 定稿功能区~~ ——两列等宽 1:1（原 1.15:1 被用户肉眼看穿）、hz-right 700px 向左扩（热力柱让位）、时钟放大 50%（5.4em）、space-between 三段均分+padding 8/32 顶底校齐；正文加粗荧光笔改细（74% 起 42% 浓度，原 58%/70% 盖字半截）
   - ~~v7.9 阅读器「Aa 外观」统一面板~~ ——顶栏裸摆的版宽段选+字号胶囊全部收编进一颗蜜桃「Aa 外观」钮（铁律8），弹层六行：字号 A−/A＋、版宽三档、**字体四选**（圆体默认/宋体/黑体/楷体，系统栈）、**标题色/重点色**（默认+糖果六色球）、**正文明度**（默认/柔和/高亮，高亮分主题取色）。localStorage `obos-reader-look` JSON，applyLook 类开关+CSS 变量双通道就地生效，真机点色即变已验证。**扩展点**：加新外观项=lookRow 一行+applyLook 一个开关
   - ~~v7.7 右列重排落地~~ ——候选页两轮拍板（先毙三案→B 改良→选②暖糖渐变）：时钟+阴历大字用温度同款渐变（butter→peach 52%→berry，**冒号 span 要单独同渐变**否则 clip:text 下透明消失）；日期+阴历+建除章一行（obos-lunar-big 1.28em）；宜忌双签各一行横排；timecol `justify-content: space-between` 顶（时钟）底（方章）对齐天气列。真机验证与候选页一致
   - **v7.0 设计学习已回流糖霜 skill**（权威版 tangshuang-skill/，vault 副本已同步）：铁律 9 方章升级 65px 三层质感+图标必须手绘 SVG（Unicode 字符也禁）；新增铁律 13 渐变名牌字 / 14 布局稳定三件套（scrollbar-gutter/轮换文字预留高度/背景禁 fixed）；铁律 6 粒子层补「装饰层必须自带 overflow:hidden」；强制流程新增「方案有分歧就做 HTML 候选页」；骨架新增 .stamp/.grad-name 组件与三颗定稿图标 SVG，浅色主题真机验证过
   - 待做：便利贴浅色化+备注删除 → 废弃箱+.trash 改造。用户补充的「同步及其他细节」截图还没发来
2. `90-System/句子精选.md` 句库建库（几百句，文学+设计口味，格式：一行一句 `句子｜出处`）
3. **苹果同步脚本**：`40-Life/Tasks/` ↔ 提醒事项（双向，`reminder_id` 配对，完成状态以苹果为准、内容以 RuruOS 为准）；`40-Life/Calendar/` → 日历（单向）。launchd 每 5 分钟，脚本放 `90-System/Scripts/`
4. Mia 输出路径切到本 vault（桌面规则文档等用户发送）
5. 项目卡片接入 `~/Lulu Code/`（code_path 字段已留）
6. ~~阅读器体验增强：阅读进度记忆、字号调节~~（2026-07-11 已完成，见阅读打磨 v3）

## 用户偏好（重要）

- 视觉要求极高：深色玻璃拟态已选定，动效要流畅克制；改 UI 前先给方案
- 沟通用中文；决策快，给推荐+理由即可
- 设备：MacBook（2880×1864）+ 21:9 带鱼屏，所有布局必须两者自适应（CSS 用 auto-fill/clamp，不写死）
- 多设备同步走 Obsidian Sync（注意在 Sync 设置里打开「同步已安装的社区插件」，否则插件不跟着走）
