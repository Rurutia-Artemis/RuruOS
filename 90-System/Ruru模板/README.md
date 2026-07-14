# Ruru 模板 · 软糖手账风格

> Lulu 拍板的专属网页风格（2026-07-11 定稿）。以后凡是「用 Ruru 风格 / Ruru 模板做网页」，一律从这里出发：复制 `ruru-template.html` 起步，或按本规范约束任何新页面。完整效果见 `示例-软糖手账v6概念稿.html`（浏览器直接打开）。
>
> **权威版本已升级为 skill**：`~/Documents/RuruCode/tangshuang-skill/`（skill 名 `tangshuang`，展示名「糖霜」，用户拍板定名，已 symlink 进 `~/.claude/skills/`）。骨架与规范以 skill 为准，本目录保留 RuruOS 自用副本 + v6 概念稿存档。

## 这套风格是什么

糖果色玻璃拟态手账。浅色奶油底为主、糖果六色点缀、圆体大字、卡片带虚线分隔和贴纸元素、樱花等粒子飘落。可爱但克制：胆量只花在一处签名元素上，其余收声。

## 色板（不许改的部分）

糖果六色，全站通用，角色固定：

| 名字 | Hex | 角色 |
|---|---|---|
| 莓果 berry | `#ff8fab` | 主强调、警示/删除 |
| 蜜桃 peach | `#ffab76` | 选中态、标题强调 |
| 奶油 butter | `#ffd66b` | 荧光笔、便签、金额 |
| 薄荷 mint | `#6fd8b4` | 成功、确认 |
| 天空 sky | `#7db8f7` | 链接、信息 |
| 香芋 taro | `#b9a5f5` | 次级、引用 |

主题底六套（四浅二深），页面必须支持切换 + 自调色相滑杆：

| 主题 | --bg | --ink |
|---|---|---|
| 奶油白天 cream | `#faf3ea` | `#4a3b33` |
| 抹茶拿铁 matcha | `#eef4e4` | `#3e4a33` |
| 海盐汽水 soda | `#e9f3f8` | `#35464e` |
| 蜜桃乌龙 peachtea | `#fdeee4` | `#4e3a30` |
| 莓果夜晚 berrynight | `#2f2358` | `#f7eefa` |
| 葡萄夜巡 grapenight | `#251c3e` | `#f2edfa` |

## 字体

- 标题/数字：`'Yuanti SC', 'Hiragino Maru Gothic ProN', 'PingFang SC'`（圆体，weight 800）
- 正文：`-apple-system, 'PingFang SC'`
- 对齐的数字一律 `font-variant-numeric: tabular-nums`

## 组件铁律

1. **糖霜胶囊**（tab/小按钮）：未选中必须有自己的底色 `var(--frost)`（浅主题白 62%、深主题白 10%）+ 1.5px 细边。**严禁裸背景黑药丸**。选中态 = 糖果实底 + `--sticker` 深字 + 2px 抬升 + 底部色影。
2. **果冻主钮**：糖果色顶部提亮渐变 + 双层阴影（4px 实底影 + 弥散影），hover 上浮 2px，按下下压 3px 缩 0.97。
3. **卡片**：圆角 22-26px，半透明底 + backdrop-blur，边 1.5px，分隔线一律 2px dashed。
4. **贴纸标签**（act-tag）：白卡 + 微旋转 rotate(-1deg)，左下角圆角收小做出胶带感。
5. **动效曲线**：弹性一律 `cubic-bezier(0.34,1.56,0.64,1)`（--spring）；丝滑位移用 `cubic-bezier(0.22,1,0.36,1)`。
6. **粒子层**：樱花/细雨/落雪/萤火四种，用户可选，带速度/数量/大小/方向角/饱和度/可见度六项调节；浅色主题下雨/雪/萤火配色自动加深一档（白雪贴奶油底会隐形）；`prefers-reduced-motion` 时整层关闭。
7. **无障碍底线**：focus-visible 有 2.5px sky 描边；深浅主题都要过对比度。

## 禁止

- 未选中胶囊无底色（黑药丸的病根）
- 靛蓝/紫渐变大背景（AI 胎记）
- emoji 当图标（手绘 SVG 或字符符号）
- 居中白底蓝按钮的模板脸

## 品牌徽记（已拍板：B · 软糖 R）

```svg
<svg viewBox="0 0 48 48"><defs><linearGradient id="gB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8fab"/><stop offset="1" stop-color="#b9a5f5"/></linearGradient></defs>
  <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#gB)"/>
  <ellipse cx="17" cy="11" rx="9" ry="4.5" fill="#fff" opacity="0.36" transform="rotate(-14 17 11)"/>
  <text x="24" y="34.5" text-anchor="middle" font-family="Yuanti SC, Hiragino Maru Gothic ProN, sans-serif" font-size="29" font-weight="800" fill="#fff">R</text></svg>
```

界面只显示图标，不带文字（文字放 tooltip）。

## 给 AI 的使用说明

新网页任务：Read 本目录 `ruru-template.html` → 以它为骨架填内容，tokens 与组件类原样复用，不要自己发明按钮样式。改版任务：以 `示例-软糖手账v6概念稿.html` 为基准做 diff。签名元素每页只允许一个（日签卡 / 玻璃糖罩这个量级），其余全部用标准组件。
