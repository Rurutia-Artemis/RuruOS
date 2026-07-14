# RuruOS

首次搭建（用户刚 clone 下来还没配置）：按 [[AI搭建指南]] 执行。

写入内容的规则见 [[AGENTS.md]]，完整遵守。

做开发（改插件、改结构、加功能）前，先读 [[90-System/开发交接-HANDOFF|开发交接-HANDOFF]]——架构、代码约定、待办清单、用户偏好都在里面。

## 知识库地图（给所有在本库工作的 AI）

- `20-Reading/Articles/`：抓取的文章（frontmatter: status=unread/read，category 分类，distilled 标记是否已浓缩）
- `30-Media/Dramas|Posters/`：剧集与海报，status 五态
- `40-Life/Tasks|Calendar|Finance/`：待办、日程、账本（ledger 带 total/currency，流水进 流水/）
- `50-Knowledge/`：第二大脑，固定 8 个主题目录（AI与Coding/商业与变现/设计与审美/游戏设计/社媒观察/工具观察/视频知识/文档与方案），浓缩笔记按 category 落对应目录
- `90-System/`：规范与脚本，除交接文档外不要自动写入
- 本库有 git，做批量写入前先确认工作区干净；写坏可回滚

## 风格纪律（改界面/做网页前必读）

- 任何网页、界面、样式产物必须遵守本库自带的糖霜风格规范：`.claude/skills/tangshuang/`（有 skill 机制就触发它，没有就先通读 SKILL.md），**禁止自创样式**。人类读者版见 `DESIGN.md`。
- 改插件 UI：design tokens 集中在 `styles.css` 顶部 `.obos-root` 变量区，视为母版禁止就地改；改完必须截屏自验，代码正确 ≠ 视觉正确。
