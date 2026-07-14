/* RuruOS 中枢 — 个人知识系统中枢（软糖手账 v5）
 * 六个视图：主屏 dashboard / 文章阅读器 / 剧集详情页 / 账本详情页 / 项目详情页（RuruCode 只读扫描）/ MD 只读预览。
 * vault 数据层写回一律走 processFrontMatter；项目视图只读扫描 PROJECTS_DIR，绝不写入。
 */
'use strict';

const { Plugin, ItemView, Notice, TFile, debounce, MarkdownRenderer, requestUrl, addIcon } = require('obsidian');
const nodeFs = require('fs');
const nodePath = require('path');
const { spawn } = require('child_process');

const VIEW_HOME = 'obos-home-view';
const VIEW_READER = 'obos-reader-view';
const VIEW_DRAMA = 'obos-drama-view';
const VIEW_LEDGER = 'obos-ledger-view';
const VIEW_PROJECT = 'obos-project-view';
const VIEW_MDPREVIEW = 'obos-mdpreview-view';

const FOLDERS = {
  tasks: '40-Life/Tasks',
  calendar: '40-Life/Calendar',
  articles: '20-Reading/Articles',
  dramas: '30-Media/Dramas',
  posters: '30-Media/Posters',
  finance: '40-Life/Finance',
};

/* ═══════════ 公开版配置区（新用户只需要看这一段） ═══════════ */

/* 项目卡数据源：只读扫描本机代码目录，永不写入。
   默认留空 = 项目卡显示提示；想启用就填你的代码目录绝对路径，如 '/Users/you/Code' */
const PROJECTS_DIR = '';

/* AI 引擎：插件的 AI 功能（浓缩/清杂/补剧集资料/搜评分/中文剧名转译）可由本机任意一款
   agent CLI 驱动。按下表顺序自动探测，第一个找到的就是引擎；想强制指定就把名字填进 AI_ENGINE_FORCE。
   每个引擎三套参数：edit=改库内文件的后台任务；editWeb=还需要联网查证的任务；ask=快问快答（只要一行答案）。
   你的工具不在列表里？照格式加一项即可，要求只有两条：支持非交互执行一句 prompt、能在 cwd 里改文件。
   没装任何 AI 的用户：AI 按钮会弹提示并跳过，其余全部功能不受影响。 */
const AI_ENGINE_FORCE = '';   /* 例如 'codex'；留空 = 自动探测 */
const AI_HOME = require('os').homedir();
const aiCand = name => [
  `${AI_HOME}/.local/bin/${name}`,
  '/opt/homebrew/bin/' + name,
  '/usr/local/bin/' + name,
  `${AI_HOME}/bin/${name}`,
  '/usr/bin/' + name,
];
const AI_ENGINES = [
  { name: 'claude',   bins: [...aiCand('claude'), `${AI_HOME}/.claude/local/claude`],
    edit:    p => ['-p', p, '--permission-mode', 'acceptEdits'],
    editWeb: p => ['-p', p, '--permission-mode', 'acceptEdits', '--allowedTools', 'WebSearch', 'WebFetch'],
    ask:     p => ['-p', p, '--model', 'haiku'] },
  { name: 'codex',    bins: aiCand('codex'),
    edit:    p => ['exec', '--full-auto', p],
    editWeb: p => ['exec', '--full-auto', '-c', 'sandbox_workspace_write.network_access=true', p],
    ask:     p => ['exec', '--full-auto', p] },
  { name: 'gemini',   bins: aiCand('gemini'),
    edit: p => ['--yolo', '-p', p], editWeb: p => ['--yolo', '-p', p], ask: p => ['-p', p] },
  { name: 'qwen',     bins: aiCand('qwen'),
    edit: p => ['--yolo', '-p', p], editWeb: p => ['--yolo', '-p', p], ask: p => ['-p', p] },
  { name: 'iflow',    bins: aiCand('iflow'),
    edit: p => ['--yolo', '-p', p], editWeb: p => ['--yolo', '-p', p], ask: p => ['-p', p] },
  { name: 'opencode', bins: aiCand('opencode'),
    edit: p => ['run', p], editWeb: p => ['run', p], ask: p => ['run', p] },
];
function resolveAiEngine() {
  try {
    const fs = require('fs');
    const pool = AI_ENGINE_FORCE ? AI_ENGINES.filter(e => e.name === AI_ENGINE_FORCE) : AI_ENGINES;
    for (const e of pool) {
      const bin = e.bins.find(b => fs.existsSync(b));
      if (bin) return Object.assign({ bin }, e);
    }
  } catch (err) { /* 探测失败按未安装处理 */ }
  return null;
}
const AI = resolveAiEngine();
const NO_AI_MSG = '未检测到本机 AI 命令行工具（支持 claude / codex / gemini / qwen / iflow / opencode，见 docs/接入AI指南.md）。其余功能不受影响。';

/* ═══════════ 公开版配置区结束 ═══════════ */

/* v7.4 简易黄历：Chromium 内置中国农历（Intl）+ 建除十二神宜忌（本地推算，无网络） */
const LUNAR_DAYS = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
const LUNAR_MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const JIANCHU = [
  ['建', '出行 谋事', '动土 开仓'], ['除', '扫除 沐浴', '求财 赴任'],
  ['满', '祈福 纳财', '动工 安葬'], ['平', '修整 收拾', '兴讼 大事'],
  ['定', '定约 安床', '出行 迁居'], ['执', '立契 收捕', '开市 远行'],
  ['破', '拆卸 破除', '嫁娶 签约'], ['危', '静守 祭祀', '登高 冒险'],
  ['成', '开业 嫁娶', '兴讼 争执'], ['收', '收纳 进账', '放贷 出行'],
  ['开', '开工 求学', '安葬 收尾'], ['闭', '收尾 补墙', '开市 出行'],
];
function lunarToday(d) {
  try {
    const parts = new Intl.DateTimeFormat('zh-Hans-u-ca-chinese', { month: 'long', day: 'numeric' }).formatToParts(d);
    const month = ((parts.find(p => p.type === 'month') || {}).value || '').replace('腊月', '十二月');
    const dayN = Number((parts.find(p => p.type === 'day') || {}).value || 0);
    const dayName = LUNAR_DAYS[dayN - 1] || String(dayN);
    /* 日支：儒略日锚点（2000-01-01=庚辰日，支=辰） */
    const jdn = Math.floor(d.getTime() / 86400000 - d.getTimezoneOffset() / 1440) + 2440588;
    const dayZhi = ((jdn - 1) % 12 + 12) % 12;
    /* 月支：农历正月=寅（简化按农历月，不按节气月，标注"简"） */
    const mIdx = LUNAR_MONTHS.indexOf(month.replace('闰', ''));
    const monthZhi = mIdx >= 0 ? (mIdx + 2) % 12 : 2;
    const g = JIANCHU[((dayZhi - monthZhi) % 12 + 12) % 12];
    return { text: `${month}${dayName}`, god: g[0], yi: g[1], ji: g[2] };
  } catch (e) { return null; }
}

/* 追剧墙空态贴纸：爆米花桶（大尺寸专用，比场记板耐放大） */
const ICON_EMPTY_WALL = '<svg viewBox="0 0 24 24" fill="none" stroke="#5c2438" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 10.7 L7.5 20.2 a1.3 1.3 0 0 0 1.3 1.1 h6.4 a1.3 1.3 0 0 0 1.3 -1.1 L17.8 10.7 Z" fill="#fff0f5"/><path d="M9.1 10.7 l0.7 10.5 M12 10.7 v10.6 M14.9 10.7 l-0.7 10.5" stroke="#ff9fb8" stroke-width="1.3"/><rect x="5.5" y="8.4" width="13" height="2.4" rx="1.2" fill="#ffd66b"/><circle cx="8.5" cy="6.8" r="2" fill="#fff8e6"/><circle cx="15.5" cy="6.8" r="2" fill="#fff8e6"/><circle cx="12" cy="5.7" r="2.3" fill="#fff"/><circle cx="19" cy="4.4" r="1" fill="#ffd66b" stroke-width="1.1"/><circle cx="20.3" cy="7.3" r="0.7" fill="#ffb3c8" stroke="none"/><path d="M4 3.6 l0.4 1.1 l1.1 0.4 l-1.1 0.4 l-0.4 1.1 l-0.4 -1.1 l-1.1 -0.4 l1.1 -0.4 Z" fill="#ffd66b" stroke-width="0.9"/></svg>';

/* 搜剧添加：TVmaze 英文字段 → 库内中文习惯 */
const GENRE_CN = {
  'Action': '动作', 'Adventure': '冒险', 'Comedy': '喜剧', 'Crime': '犯罪',
  'Drama': '剧情', 'Espionage': '谍战', 'Family': '家庭', 'Fantasy': '奇幻',
  'History': '历史', 'Horror': '恐怖', 'Legal': '律政', 'Medical': '医疗',
  'Music': '音乐', 'Mystery': '悬疑', 'Romance': '爱情', 'Science-Fiction': '科幻',
  'Sports': '运动', 'Supernatural': '超自然', 'Thriller': '惊悚', 'War': '战争', 'Western': '西部',
};
const COUNTRY_CN = {
  'United States': '美国', 'South Korea': '韩国', 'Korea, Republic of': '韩国',
  'Japan': '日本', 'United Kingdom': '英国', 'China': '中国', 'Taiwan': '台湾',
  'Hong Kong': '香港', 'France': '法国', 'Germany': '德国', 'Spain': '西班牙',
  'Canada': '加拿大', 'Australia': '澳大利亚', 'Thailand': '泰国', 'India': '印度',
};
const PROJECT_SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'vendor', 'src-vendor', '99-Attachments']);
const PROJECT_MAX_DEPTH = 3;

const DRAMA_STATUSES = ['待定', '想看', '在追', '看完', '弃剧'];
const DRAMA_STATUS_JC = { '待定': 'butter', '想看': 'sky', '在追': 'mint', '看完': 'taro', '弃剧': 'peach' };
const CATEGORY_COLORS = {
  'ai-coding': '#8B7CF7',
  '商业变现': '#F5B85C',
  '设计': '#5CC8D6',
  '剧集推荐': '#EF7A7A',
  '游戏': '#E07A9A',
  '生活': '#5CD69A',
  '其他': '#9AA3B5',
};
const SOURCE_NAMES = { wechat: '微信公众号', xiaohongshu: '小红书', web: '网页' };
const CURRENCY_SIGNS = { JPY: '¥', CNY: 'CN¥', AUD: 'A$', USD: '$' };
const CANDY = { berry: '#ff8fab', peach: '#ffab76', butter: '#ffd66b', mint: '#6fd8b4', sky: '#7db8f7', taro: '#b9a5f5' };
const SHARE_HUES = ['#8b7cf7', '#5cc8d6', '#f5b85c', '#e07a9a', '#5cd69a', '#9aa3b5'];
const LEDGER_STAT_COLORS = ['#ffd66b', '#7db8f7', '#ff8fab', '#6fd8b4', '#b9a5f5'];

const THEME_KEY = 'obos-theme';
const UI_SCALE_KEY = 'obos-ui-scale';       /* 全库界面字号 %，默认 105 */
const READER_SCALE_KEY = 'obos-reader-scale'; /* 阅读正文字号 %，默认 100（基准 1.16em） */
const READPOS_PREFIX = 'obos-readpos:';     /* 每篇文章的阅读位置（scrollTop px） */
const HUE_KEY = 'obos-hue';                 /* 自调底色色相（0-360），null=用主题原色 */
const FX_KEY = 'obos-fx';                   /* 桌面动效参数 JSON */
/* v6 六主题：四浅二深。浅色套 obos-theme-light 基底，深色套 obos-theme-dark 基底，主题类只换变量 */
const THEME_NAMES = ['cream', 'matcha', 'soda', 'peachtea', 'berrynight', 'grapenight'];
const DARK_THEMES = ['berrynight', 'grapenight'];
const THEME_LABELS = { cream: '奶油白天', matcha: '抹茶拿铁', soda: '海盐汽水', peachtea: '蜜桃乌龙', berrynight: '莓果夜晚', grapenight: '葡萄夜巡' };
const THEME_SWATCH = { cream: '#faf3ea', matcha: '#e4eed2', soda: '#d9ecf6', peachtea: '#fbe3d2', berrynight: '#2f2358', grapenight: '#1e1633' };
const FX_DEFAULT = { mode: 'sakura', speed: 1, count: 1, size: 1, angle: 10, sat: 1, vis: 1 };
const FX_MODES = [['none', '无'], ['sakura', '樱花'], ['rain', '细雨'], ['snow', '落雪'], ['fly', '萤火']];

/* ---------- AI 后台任务 Prompt（逐字，来自任务规范） ---------- */
const DISTILL_PROMPT = `你在 RuruOS vault 中执行"已读文章浓缩"任务。规则：1. 扫描 20-Reading/Articles/ 下 frontmatter 满足 status: read 且没有 distilled: true 的文章。2. 每篇生成一份要点浓缩笔记写入 50-Knowledge 对应主题目录：ai-coding→AI与Coding/，商业变现→商业与变现/，设计→设计与审美/，生活或其他→文档与方案/；剧集推荐类跳过（观影管线已处理）。3. 浓缩笔记文件名：<原标题前30字>-浓缩-<今日日期>.md，frontmatter 含 type: distilled_note、title、source: "[[原文件名]]"、category、added。正文 5-10 条要点，保留关键数字与结论。4. 完成后给原文章 frontmatter 加一行 distilled: true，其他不动。5. 顺手维护索引：若目标主题目录有 _index.md 或索引/MOC 笔记，把新浓缩笔记补进去；浓缩笔记正文底部用 [[wikilink]] 关联库内相关笔记。6. 遵守 vault 根目录 AGENTS.md 写入规范。最后输出一行总结。`;
const CLEAN_PROMPT = `你在 RuruOS vault 中执行"文章清杂"任务，找出 20-Reading/Articles/ 里 TTS/转写导入的垃圾文章。判定（满足其一）：乱码字符占比明显、大段无意义重复、正文残缺不足200字且无信息量、纯广告导流。处理：1. 确认垃圾→移入 vault 根目录 .trash/（没有就创建），绝不永久删除。2. 拿不准→只加 frontmatter needs_review: true。3. 正常文章一字不动。4. 最后输出一行总结：移了几篇（列名）、标了几篇。`;

/* ---------- 手绘 SVG 图标（原样照抄蓝本 path） ---------- */
const STAR_PATH = 'M12 2.6 L14.9 8.7 L21.5 9.6 L16.7 14.2 L17.9 20.8 L12 17.6 L6.1 20.8 L7.3 14.2 L2.5 9.6 L9.1 8.7 Z';
const SPARKLE_PATH = 'M7 0 L8.6 5.4 L14 7 L8.6 8.6 L7 14 L5.4 8.6 L0 7 L5.4 5.4 Z';
const CHECK_PATH = 'M2 6.2 L4.8 9 L10 3.4';

const ICON_TASK = '<svg viewBox="0 0 24 24" fill="none" stroke="#2c5040" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="14" height="18" rx="3" fill="#eafff6"/><path d="M8 8 h6 M8 11.5 h6 M8 15 h3"/><circle cx="16.4" cy="16.6" r="4.6" fill="#6fd8b4"/><path d="M14.5 16.7 l1.4 1.4 l2.4 -2.7" stroke="#fff" stroke-width="2"/></svg>';
const ICON_CALENDAR = '<svg viewBox="0 0 24 24" fill="none" stroke="#3c2e5c" stroke-width="1.9" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3.5" fill="#f4efff"/><path d="M3.5 9.6 h17"/><path d="M8 3 v3.6 M16 3 v3.6" stroke-width="2.2"/><rect x="6.6" y="12" width="3.4" height="3.2" rx="1" fill="#b9a5f5" stroke="none"/><rect x="11.3" y="12" width="3.4" height="3.2" rx="1"/><rect x="16" y="12" width="1.4" height="3.2" rx="0.7" opacity="0.4"/><rect x="6.6" y="16.4" width="3.4" height="1.6" rx="0.8" opacity="0.4"/></svg>';
const ICON_PROJECT = '<svg viewBox="0 0 24 24" fill="none" stroke="#24425c" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.5 a2.5 2.5 0 0 1 2.5 -2.5 h4 l2 2.4 h6 a2.5 2.5 0 0 1 2.5 2.5 v8 a2.5 2.5 0 0 1 -2.5 2.5 h-12 a2.5 2.5 0 0 1 -2.5 -2.5 Z" fill="#eef6ff"/><path d="M14.5 11 v6 M14.5 11 l3.6 1.5 l-3.6 1.7" fill="#7db8f7"/></svg>';
const ICON_FINANCE = '<svg viewBox="0 0 24 24" fill="none" stroke="#5c4420" stroke-width="1.9" stroke-linecap="round"><rect x="3.5" y="6" width="17" height="13" rx="3.5" fill="#fff8e6"/><path d="M3.5 10 h17" opacity="0.35"/><circle cx="16.2" cy="14.6" r="3.6" fill="#ffd66b"/><path d="M16.2 12.9 v3.4 M14.9 13.8 h2.6 M14.9 15.4 h2.6" stroke-width="1.5"/></svg>';
const ICON_ARTICLE = '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" stroke="#71293f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 4.6 C7.8 3.1 5.2 2.9 2.9 3.6 V15 C5.2 14.3 7.8 14.5 9.5 15.8 C11.2 14.5 13.8 14.3 16.1 15 V3.6 C13.8 2.9 11.2 3.1 9.5 4.6 Z"/><path d="M9.5 4.6 V15.6"/></svg>';
const ICON_KNOWLEDGE = '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" stroke="#2a4a72" stroke-width="1.9" stroke-linejoin="round"><path d="M5.4 3 H13.6 L16.6 7 L9.5 16 L2.4 7 Z" fill="rgba(255,255,255,.3)"/><path d="M2.4 7 H16.6 M5.4 3 L9.5 7 L13.6 3 M9.5 7 V15.8"/></svg>';
const ICON_DRAMA = '<svg viewBox="0 0 24 24" fill="none" stroke="#5c2438" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="9" width="17" height="11" rx="2.5" fill="#fff0f5"/><path d="M3.8 8.8 L20 4.6 l0.8 3 L4.6 11.8 Z" fill="#ff8fab"/><path d="M7.4 7.8 l2 -2.8 M11.6 6.7 l2 -2.8 M15.8 5.6 l2 -2.8"/><path d="M10 13.4 l4.6 2.6 l-4.6 2.6 Z" fill="#ff8fab"/></svg>';

/* v7.0 三方章图标定稿（用户 HTML 候选页拍板：S3/F3/T3） */
/* 同步 S3=大循环环，经典 sync + 中心糖点 */
const ICON_SYNC_BTN = '<svg viewBox="0 0 24 24" fill="none" stroke="#26466a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 12 a7.1 7.1 0 0 1 12.2 -5"/><path d="M17.4 3.7 v3.7 h-3.7"/><path d="M19.1 12 a7.1 7.1 0 0 1 -12.2 5"/><path d="M6.6 20.3 v-3.7 h3.7"/><circle cx="12" cy="12" r="1.7" fill="#26466a" stroke="none"/></svg>';
/* 动效 F3=飘落三瓣：大中小樱瓣 + 风线 */
const ICON_FX_BTN = '<svg viewBox="0 0 24 24" fill="none" stroke="#5c2438" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M0 3.4 C-1.8 1.8 -2.2 -1 -1.1 -3.2 L0 -2.1 L1.1 -3.2 C2.2 -1 1.8 1.8 0 3.4 Z" fill="#ff9fb8" transform="translate(8.5 7.5) rotate(-28) scale(1.35)"/><path d="M0 3.4 C-1.8 1.8 -2.2 -1 -1.1 -3.2 L0 -2.1 L1.1 -3.2 C2.2 -1 1.8 1.8 0 3.4 Z" fill="#ffc9d9" transform="translate(15.5 12.5) rotate(38) scale(1.05)"/><path d="M0 3.4 C-1.8 1.8 -2.2 -1 -1.1 -3.2 L0 -2.1 L1.1 -3.2 C2.2 -1 1.8 1.8 0 3.4 Z" fill="#ffdde8" transform="translate(9.5 17.8) rotate(78) scale(0.8)"/><path d="M15 4.6 q2.8 -0.9 4.6 0.5" opacity="0.55"/><path d="M15.8 19.4 q2.4 0.9 4.2 -0.4" opacity="0.55"/></svg>';
/* 主题 T3=调色盘：主题=换色 */
const ICON_THEME_BTN = '<svg viewBox="0 0 24 24" fill="none" stroke="#5c4420" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6 a8.4 8.4 0 1 0 0.2 16.8 c1.9 0 2.5 -1.2 2 -2.4 c-0.7 -1.5 0.3 -2.9 2 -2.9 h1.4 a3.5 3.5 0 0 0 3 -5.1 A8.4 8.4 0 0 0 12 3.6 Z" fill="#fff8e6"/><circle cx="8.1" cy="9.2" r="1.5" fill="#ff8fab" stroke="none"/><circle cx="12.4" cy="7.3" r="1.5" fill="#7db8f7" stroke="none"/><circle cx="16.2" cy="9.4" r="1.5" fill="#6fd8b4" stroke="none"/><circle cx="7.5" cy="13.6" r="1.5" fill="#b9a5f5" stroke="none"/></svg>';

/* v6 拍板徽记 B「软糖 R」：莓果→香芋渐变方章 + 高光 + 白 R */
const ICON_CREST = '<svg viewBox="0 0 48 48"><defs><linearGradient id="obosGB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8fab"/><stop offset="1" stop-color="#b9a5f5"/></linearGradient></defs><rect x="2" y="2" width="44" height="44" rx="14" fill="url(#obosGB)"/><ellipse cx="17" cy="11" rx="9" ry="4.5" fill="#fff" opacity="0.36" transform="rotate(-14 17 11)"/><text x="24" y="34.5" text-anchor="middle" font-family="Yuanti SC, Hiragino Maru Gothic ProN, sans-serif" font-size="29" font-weight="800" fill="#fff">R</text></svg>';
const ICON_SUN = '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="3.6"/><path d="M8.5 1.2 V2.8 M8.5 14.2 V15.8 M1.2 8.5 H2.8 M14.2 8.5 H15.8 M3.4 3.4 L4.5 4.5 M12.5 12.5 L13.6 13.6 M13.6 3.4 L12.5 4.5 M4.5 12.5 L3.4 13.6"/></svg>';
const ICON_MOON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M13.6 9.8 A6.1 6.1 0 1 1 6.2 2.4 A5 5 0 0 0 13.6 9.8 Z"/></svg>';
const ICON_LOCK = '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="#2c5d4a" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="7.5" width="11" height="7" rx="2.2"/><path d="M5.5 7.5 V5.5 A3 3 0 0 1 11.5 5.5 V7.5"/></svg>';
const ICON_DOODLE_CLOUD = '<svg width="46" height="26" viewBox="0 0 46 26" fill="none" stroke="#7db8f7" stroke-width="1.6" stroke-linecap="round"><path d="M10 19 C5.5 19 3.5 15.8 5.2 13 C4 9.6 7 6.8 10.2 7.8 C11.6 4.4 16.6 4 18.6 7.2 C22.4 6 25.4 9.4 24 12.8 C26 15.4 24 19 20.6 19 Z"/><path d="M38 8 L39 5 L40 8 L43 9 L40 10 L39 13 L38 10 L35 9 Z" fill="#ffd66b" stroke="none"/></svg>';
const ICON_CAT_DOODLE = '<svg width="30" height="24" viewBox="0 0 30 24" fill="none" stroke="#ff8fab" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10 C8 6.5 10.8 4.5 14 4.5 C17.2 4.5 20 6.5 20 10 C20 14 17.5 16.5 14 16.5 C10.5 16.5 8 14 8 10 Z"/><path d="M9.5 6 L8 2.6 L11.6 4.6 M18.5 6 L20 2.6 L16.4 4.6"/><circle cx="12" cy="9.6" r="0.7" fill="#ff8fab" stroke="none"/><circle cx="16" cy="9.6" r="0.7" fill="#ff8fab" stroke="none"/><path d="M13.2 11.6 C13.6 12.2 14.4 12.2 14.8 11.6 M20 13 C23 12.4 25.5 14 25.8 16.8 M20.5 15.4 C22.4 15.2 24 16.2 24.2 17.8"/></svg>';

function sparkleSVG(color, size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 14 14" fill="${color}"><path d="${SPARKLE_PATH}"/></svg>`;
}
function checkSVG() {
  return `<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#1e4736" stroke-width="2.4" stroke-linecap="round"><path d="${CHECK_PATH}"/></svg>`;
}
function starSVG() {
  return `<svg width="24" height="24" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>`;
}
function starRowHTML(rating, size) {
  size = size || 12;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= rating
      ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#ffc93c"><path d="${STAR_PATH}"/></svg>`
      : `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#ffc93c" stroke-width="2"><path d="${STAR_PATH}"/></svg>`;
  }
  return html;
}

/* ---------- helpers ---------- */

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* WMO 天气码 → [糖罩动画态, 中文描述] */
function wmoInfo(code) {
  if (code === 0 || code === 1) return ['sun', code ? '大致晴朗' : '晴 · 微风拂过'];
  if (code === 2 || code === 3) return ['cloud', code === 2 ? '多云 · 云在散步' : '阴 · 云盖被子'];
  if (code === 45 || code === 48) return ['cloud', '雾 · 蒙蒙的'];
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ['snow', '落雪 · 落雪成糖'];
  if (code >= 95) return ['rain', '雷雨 · 待在屋里'];
  if (code >= 51) return ['rain', '有雨 · 记得带伞'];
  return ['cloud', '多云'];
}

/* 温度冷热渐变五档（v6.5 拍板）：文字渐变非纯色 */
function tempGrad(t) {
  if (t <= 5) return ['var(--sky)', 'var(--taro)'];
  if (t <= 15) return ['var(--sky)', 'var(--mint)'];
  if (t <= 24) return ['var(--mint)', 'var(--butter)'];
  if (t <= 31) return ['var(--butter)', 'var(--peach)'];
  return ['var(--peach)', 'var(--berry)'];
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return '夜深了';
  if (h < 11) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

function dueLabel(due) {
  if (!due) return null;
  const s = String(due).slice(0, 10);
  const t = new Date(todayStr()).getTime();
  const d = new Date(s).getTime();
  if (isNaN(d)) return { text: s, cls: '' };
  const diff = Math.round((d - t) / 86400000);
  if (diff < 0) return { text: `逾期 ${-diff} 天`, cls: 'overdue' };
  if (diff === 0) return { text: '今天', cls: 'today' };
  if (diff === 1) return { text: '明天', cls: 'soon' };
  return { text: s.slice(5).replace('-', '/'), cls: '' };
}

function sanitizeFilename(name) {
  return name.replace(/[\\/:*?"<>|#^\[\]]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
}

function stripFrontmatter(text) {
  const m = text.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? text.slice(m[0].length) : text;
}

function catColor(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS['其他'];
}

function fmtMoney(n, currency) {
  const num = Number(n) || 0;
  const sign = CURRENCY_SIGNS[currency] || (currency ? `${currency} ` : '');
  const abs = Math.abs(num);
  return (num < 0 ? '−' : '') + sign + abs.toLocaleString('en-US', { maximumFractionDigits: abs % 1 ? 1 : 0 });
}

function parseNum(s) {
  const m = String(s ?? '').replace(/[,，\s]/g, '').match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

const REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STAR_MINI = '<svg width="11" height="11" viewBox="0 0 24 24" fill="#ffc93c"><path d="M12 2.6 L14.9 8.7 L21.5 9.6 L16.7 14.2 L17.9 20.8 L12 17.6 L6.1 20.8 L7.3 14.2 L2.5 9.6 L9.1 8.7 Z"/></svg>';

function enableDatePicker(inp) {
  inp.addEventListener('click', () => { try { inp.showPicker(); } catch (e) { /* 旧内核没有 showPicker */ } });
}

/* 糖果日期选择器：完全自绘，替代原生方框面板 */
function attachCandyDate(inp) {
  inp.readOnly = true;
  inp.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openCandyDate(inp); });
}
function openCandyDate(inp) {
  document.querySelectorAll('.obos-dp').forEach(x => x.remove());
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(inp.value || '');
  const base = ok ? new Date(inp.value + 'T00:00') : new Date();
  let y = base.getFullYear(), m = base.getMonth();
  const dp = document.body.createDiv({ cls: 'obos-dp' });
  const themed = inp.closest('.obos-theme-dark');
  dp.addClass(themed ? 'obos-theme-dark' : 'obos-theme-light');
  const r = inp.getBoundingClientRect();
  dp.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 292)) + 'px';
  dp.style.top = Math.min(r.bottom + 6, window.innerHeight - 360) + 'px';
  const paint = () => {
    dp.empty();
    const head = dp.createDiv({ cls: 'obos-dp-head' });
    const prev = head.createEl('button', { cls: 'obos-dp-nav', text: '‹' });
    head.createSpan({ cls: 'obos-dp-title', text: `${y} 年 ${m + 1} 月` });
    const next = head.createEl('button', { cls: 'obos-dp-nav', text: '›' });
    prev.onclick = () => { m--; if (m < 0) { m = 11; y--; } paint(); };
    next.onclick = () => { m++; if (m > 11) { m = 0; y++; } paint(); };
    const week = dp.createDiv({ cls: 'obos-dp-week' });
    for (const w of ['日', '一', '二', '三', '四', '五', '六']) week.createSpan({ text: w });
    const grid = dp.createDiv({ cls: 'obos-dp-grid' });
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) grid.createSpan();
    const todayS = todayStr();
    for (let d = 1; d <= days; d++) {
      const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const b = grid.createEl('button', {
        cls: `obos-dp-day ${iso === inp.value ? 'on' : ''} ${iso === todayS ? 'today' : ''}`,
        text: String(d),
      });
      b.onclick = () => { inp.value = iso; dp.remove(); };
    }
    const foot = dp.createDiv({ cls: 'obos-dp-foot' });
    const tb = foot.createEl('button', { cls: 'obos-mini-btn', text: '今天' });
    tb.onclick = () => { inp.value = todayS; dp.remove(); };
    const cb = foot.createEl('button', { cls: 'obos-mini-btn', text: '清空' });
    cb.onclick = () => { inp.value = ''; dp.remove(); };
  };
  paint();
  const away = e => {
    if (!dp.contains(e.target) && e.target !== inp) { dp.remove(); document.removeEventListener('mousedown', away, true); }
  };
  document.addEventListener('mousedown', away, true);
}

/* 分类段选贴纸（替代原生 select） */
function makeKindPicker(parent, initial) {
  const wrap = parent.createDiv({ cls: 'obos-kind-pick' });
  let value = ['普通', '紧急', '长期'].includes(initial) ? initial : '普通';
  for (const k of ['普通', '紧急', '长期']) {
    const b = wrap.createEl('button', { cls: `obos-kind-opt k-${k} ${value === k ? 'on' : ''}`, text: k, attr: { type: 'button' } });
    b.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      value = k;
      wrap.querySelectorAll('.obos-kind-opt').forEach(x => x.removeClass('on'));
      b.addClass('on');
    };
  }
  return { value: () => value };
}

/* 箔光跑马灯：JS 驱动角度，保证任何内核都能转 */
function attachSweep(el) {
  if (REDUCED_MOTION) return;
  let raf = null, ang = 0, last = 0;
  el.addEventListener('mouseenter', () => {
    if (raf) return;
    const step = ts => {
      if (!last) last = ts;
      ang = (ang + (ts - last) * 0.12) % 360;
      last = ts;
      el.style.setProperty('--ang', ang + 'deg');
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  });
  el.addEventListener('mouseleave', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = null; last = 0;
  });
}

/* 长段自动分段：TTS/公众号搬运常是一坨，按句子每两句切一段 */
function autoParagraph(md) {
  return md.split('\n').map(line => {
    const s = line.trim();
    if (s.length < 200) return line;
    if (/^(#|>|\||!\[|[-*+] |\d+\. )/.test(s)) return line;
    const parts = s.split(/(?<=[。！？!?…])(?=[^”』」）)\]])/);
    if (parts.length < 3) return line;
    const out = [];
    for (let i = 0; i < parts.length; i += 2) out.push(parts.slice(i, i + 2).join(''));
    return out.join('\n\n');
  }).join('\n');
}

/* 糖果时间选择器 */
function attachCandyTime(inp) {
  inp.readOnly = true;
  inp.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openCandyTime(inp); });
}
function openCandyTime(inp) {
  document.querySelectorAll('.obos-dp').forEach(x => x.remove());
  const cur = /^\d{2}:\d{2}$/.test(inp.value || '') ? inp.value.split(':') : [null, null];
  let ch = cur[0];
  const dp = document.body.createDiv({ cls: 'obos-dp obos-tp' });
  dp.addClass(inp.closest('.obos-theme-dark') ? 'obos-theme-dark' : 'obos-theme-light');
  const r = inp.getBoundingClientRect();
  dp.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 234)) + 'px';
  dp.style.top = Math.min(r.bottom + 6, window.innerHeight - 330) + 'px';
  const head = dp.createDiv({ cls: 'obos-dp-head' });
  const title = head.createSpan({ cls: 'obos-dp-title', text: '选小时' });
  const clear = head.createEl('button', { cls: 'obos-mini-btn', text: '清空' });
  clear.onclick = () => { inp.value = ''; dp.remove(); };
  const cols = dp.createDiv({ cls: 'obos-tp-cols' });
  const hourCol = cols.createDiv({ cls: 'obos-tp-col' });
  const minCol = cols.createDiv({ cls: 'obos-tp-col' });
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, '0');
    const b = hourCol.createEl('button', { cls: `obos-tp-item ${cur[0] === hh ? 'on' : ''}`, text: hh });
    b.onclick = () => {
      ch = hh;
      hourCol.querySelectorAll('.obos-tp-item').forEach(x => x.removeClass('on'));
      b.addClass('on');
      title.textContent = `${ch} 点 — 选分钟`;
    };
  }
  for (let mi = 0; mi < 60; mi += 5) {
    const mm = String(mi).padStart(2, '0');
    const b = minCol.createEl('button', { cls: `obos-tp-item ${cur[1] === mm ? 'on' : ''}`, text: mm });
    b.onclick = () => { inp.value = `${ch || '09'}:${mm}`; dp.remove(); };
  }
  const away = e => {
    if (!dp.contains(e.target) && e.target !== inp) { dp.remove(); document.removeEventListener('mousedown', away, true); }
  };
  document.addEventListener('mousedown', away, true);
}

function topicColor(topic) {
  let h = 0;
  for (const ch of String(topic)) h = (h * 31 + ch.codePointAt(0)) % 997;
  return ['#8b7cf7', '#5cc8d6', '#f5b85c', '#e07a9a', '#5cd69a'][h % 5];
}

function dayLabel(day) {
  const t = new Date(todayStr()).getTime();
  const d = new Date(day).getTime();
  const diff = Math.round((d - t) / 86400000);
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(day).getDay()];
  if (diff === 0) return `今天 · ${week}`;
  if (diff === 1) return `明天 · ${week}`;
  return `${day.slice(5).replace('-', '/')} · ${week}`;
}

/* 账本正文解析：按 ## 分节，节内切出表格块，其余保持 markdown */
function parseLedgerSections(md) {
  const lines = md.split('\n');
  const sections = [];
  let cur = { title: '', chunks: [] };
  const pushText = t => {
    const last = cur.chunks[cur.chunks.length - 1];
    if (last && last.type === 'md') last.text += '\n' + t;
    else cur.chunks.push({ type: 'md', text: t });
  };
  const cells = r => {
    const out = r.split('|').map(c => c.trim());
    if (out[0] === '') out.shift();
    if (out[out.length - 1] === '') out.pop();
    return out;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h = line.match(/^##\s+(.+)/);
    if (h) {
      if (cur.title || cur.chunks.length) sections.push(cur);
      cur = { title: h[1].trim(), chunks: [] };
      continue;
    }
    if (/^\s*\|/.test(line) && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1] || '')) {
      const header = cells(line);
      const rows = [];
      i += 2;
      while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(cells(lines[i])); i++; }
      i--;
      cur.chunks.push({ type: 'table', header, rows });
      continue;
    }
    pushText(line);
  }
  if (cur.title || cur.chunks.length) sections.push(cur);
  return sections;
}

/* ---------- RuruCode 项目只读扫描（section 3）——绝不写入 ---------- */

function listProjectDirs() {
  let entries;
  try { entries = nodeFs.readdirSync(PROJECTS_DIR, { withFileTypes: true }); } catch (e) { return []; }
  return entries
    .filter(e => e.isDirectory() && e.name !== 'RuruOS' && !e.name.startsWith('.'))
    .map(e => nodePath.join(PROJECTS_DIR, e.name));
}

function scanProjectMarkdown(dir, depth) {
  let out = [];
  let entries;
  try { entries = nodeFs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = nodePath.join(dir, e.name);
    if (e.isDirectory()) {
      if (PROJECT_SKIP_DIRS.has(e.name)) continue;
      if (depth < PROJECT_MAX_DEPTH) out = out.concat(scanProjectMarkdown(full, depth + 1));
    } else if (e.isFile() && /\.md$/i.test(e.name)) {
      let stat;
      try { stat = nodeFs.statSync(full); } catch (e2) { continue; }
      out.push({ path: full, name: e.name.replace(/\.md$/i, ''), mtime: stat.mtimeMs });
    }
  }
  return out;
}

function scanProject(dir) {
  const files = scanProjectMarkdown(dir, 0).sort((a, b) => b.mtime - a.mtime);
  return {
    name: nodePath.basename(dir),
    dirPath: dir,
    files,
    latestMtime: files.length ? files[0].mtime : 0,
  };
}

function scanAllProjects() {
  return listProjectDirs().map(scanProject).sort((a, b) => b.latestMtime - a.latestMtime);
}

function mtimeMMDD(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ---------- shared data mixin ---------- */

const dataMixin = {
  collect(folder, type) {
    const out = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (!f.path.startsWith(folder + '/')) continue;
      const fm = this.app.metadataCache.getFileCache(f)?.frontmatter;
      if (!fm) continue;
      if (type && fm.type !== type) continue;
      out.push({ file: f, fm });
    }
    return out;
  },
  posterUrl(fm) {
    let p = fm.poster;
    if (!p) return null;
    p = String(p).replace(/^\[\[/, '').replace(/\]\]$/, '');
    if (!p.trim()) return null;
    const dest = this.app.metadataCache.getFirstLinkpathDest(p, '');
    return dest ? this.app.vault.getResourcePath(dest) : null;
  },
  async setProp(file, mutate) {
    await this.app.fileManager.processFrontMatter(file, mutate);
  },
  async openState(viewType, state) {
    const leaves = this.app.workspace.getLeavesOfType(viewType);
    const leaf = leaves.length ? leaves[0] : this.app.workspace.getLeaf('tab');
    await leaf.setViewState({ type: viewType, active: true, state });
    this.app.workspace.revealLeaf(leaf);
    this.app.workspace.setActiveLeaf(leaf, { focus: true });
  },
  async openInView(viewType, file) {
    return this.openState(viewType, { filePath: file.path });
  },
  applyTheme(root) {
    const t = this.plugin.getTheme();
    const dark = DARK_THEMES.includes(t);
    /* 明暗轴类承接全部旧选择器；主题类只换变量 */
    ['light', 'dark'].concat(THEME_NAMES).forEach(x => root.removeClass('obos-theme-' + x));
    root.addClass('obos-theme-' + (dark ? 'dark' : 'light'));
    root.addClass('obos-theme-' + t);
    /* 全局字号一并在此生效：em 布局，根字号一变全视图跟着缩放 */
    root.style.fontSize = this.plugin.getUiScale() + '%';
    /* 自调色相：只覆盖 --bg，糖果色与卡片不动 */
    const hue = this.plugin.getCustomHue();
    const sat = this.plugin.getCustomSat();
    if (hue !== null || sat !== null) {
      const h = hue === null ? 300 : hue;
      const sv = sat === null ? (dark ? 42 : 48) : sat;
      root.style.setProperty('--bg', dark ? `hsl(${h} ${sv}% 24%)` : `hsl(${h} ${sv}% 94%)`);
    } else root.style.removeProperty('--bg');
    /* 桌面动效层 */
    this.plugin.mountFx(root);
  },
};

/* ================= 文章阅读器 ================= */

class ObosReaderView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.filePath = null;
  }
  getViewType() { return VIEW_READER; }
  getDisplayText() {
    const f = this.file();
    const fm = f && this.app.metadataCache.getFileCache(f)?.frontmatter;
    return fm?.title || f?.basename || '阅读';
  }
  getIcon() { return 'book-open'; }
  getState() { return { filePath: this.filePath }; }
  async setState(state, result) {
    this.filePath = state.filePath;
    await this.render();
    await super.setState(state, result);
  }
  file() {
    const f = this.filePath && this.app.vault.getAbstractFileByPath(this.filePath);
    return f instanceof TFile ? f : null;
  }

  /* v7.9 阅读外观：字体/标题色/重点色/正文明度，localStorage 记忆，类+变量双通道应用 */
  applyLook(root) {
    const look = this.plugin.getReaderLook();
    const FSTACKS = {
      song: "'Songti SC', 'Noto Serif CJK SC', serif",
      hei: "'PingFang SC', 'Helvetica Neue', sans-serif",
      kai: "'Kaiti SC', 'STKaiti', serif",
    };
    const CMAP = { berry: '#ff8fab', peach: '#ffab76', butter: '#ffd66b', mint: '#6fd8b4', sky: '#7db8f7', taro: '#b9a5f5' };
    root.toggleClass('look-font', !!look.font);
    root.style.setProperty('--r-font', FSTACKS[look.font] || 'inherit');
    root.toggleClass('look-title', !!look.title);
    root.style.setProperty('--r-title', CMAP[look.title] || 'inherit');
    root.toggleClass('look-strong', !!look.strong);
    root.style.setProperty('--r-strong', CMAP[look.strong] || 'inherit');
    root.toggleClass('look-body-soft', look.body === 'soft');
    root.toggleClass('look-body-bright', look.body === 'bright');
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass('obos-reader-root');
    this.applyTheme(root);
    this.applyLook(root);
    const file = this.file();
    if (!file) { root.createDiv({ cls: 'obos-empty', text: '文章不存在。' }); return; }
    const fm = this.app.metadataCache.getFileCache(file)?.frontmatter || {};
    const isRead = fm.status === 'read';
    const isArticle = !fm.type || fm.type === 'article';

    root.createDiv({ cls: 'obos-detail-sky' });

    /* 顶部操作栏 */
    const bar = root.createDiv({ cls: 'obos-reader-bar' });
    const back = bar.createEl('button', { cls: 'obos-icon-btn', text: '‹ 中枢' });
    back.onclick = () => this.plugin.activateHome();
    const cat = fm.category || (isArticle ? '其他' : (file.path.split('/')[1] || '笔记'));
    const chip = bar.createDiv({ cls: 'obos-art-cat', text: cat });
    chip.style.setProperty('--chip', CATEGORY_COLORS[cat] ? catColor(cat) : topicColor(cat));
    bar.createDiv({ cls: 'obos-reader-bar-space' });

    /* v7.9 外观面板：版宽/字号/字体/三种颜色 全部收进一颗「Aa 外观」按钮（糖霜铁律8：调节项多于两个不裸摆） */
    const lookWrap = bar.createDiv({ cls: 'obos-pop-wrap' });
    const lookBtn = lookWrap.createEl('button', { cls: 'obos-icon-btn obos-jc-peach', text: 'Aa 外观' });
    const lookPop = lookWrap.createDiv({ cls: 'obos-pop obos-look-pop hidden' });
    lookPop.onclick = e => e.stopPropagation();
    lookBtn.onclick = e => {
      e.stopPropagation();
      const show = lookPop.hasClass('hidden');
      lookPop.toggleClass('hidden', !show);
      lookBtn.toggleClass('open', show);
    };
    lookPop.createDiv({ cls: 'obos-pop-title', text: '阅读外观' });
    const lookRow = label => {
      const r = lookPop.createDiv({ cls: 'obos-look-row' });
      r.createSpan({ cls: 'obos-look-label', text: label });
      return r.createDiv({ cls: 'obos-look-ctl' });
    };
    const look = this.plugin.getReaderLook();

    /* 字号（onclick 在正文建好后再挂，就地缩放不重渲染） */
    const fsCtl = lookRow('字号');
    const fsDec = fsCtl.createEl('button', { cls: 'obos-look-mini', text: 'A−', attr: { 'aria-label': '正文字号调小' } });
    const fsVal = fsCtl.createSpan({ cls: 'obos-fs-val' });
    const fsInc = fsCtl.createEl('button', { cls: 'obos-look-mini', text: 'A＋', attr: { 'aria-label': '正文字号调大' } });

    /* 版宽三档（就地生效不重渲染） */
    const wCtl = lookRow('版宽');
    const wBtns = [];
    for (const [w, label] of [[760, '舒适'], [1100, '标准'], [1600, '满屏']]) {
      const b = wCtl.createEl('button', { cls: `obos-tab ${this.plugin.getReaderWidth() === w ? 'on' : ''}`, text: label });
      b.style.setProperty('--pc', CANDY.sky);
      b.onclick = () => {
        this.plugin.setReaderWidth(w);
        wBtns.forEach(x => x.toggleClass('on', x === b));
        const pg = root.querySelector('.obos-reader-page');
        if (pg) pg.style.maxWidth = w + 'px';
      };
      wBtns.push(b);
    }

    /* 字体四选 */
    const fontCtl = lookRow('字体');
    const fontBtns = [];
    for (const [id, label] of [['', '圆体'], ['song', '宋体'], ['hei', '黑体'], ['kai', '楷体']]) {
      const b = fontCtl.createEl('button', { cls: `obos-tab ${(look.font || '') === id ? 'on' : ''}`, text: label });
      b.style.setProperty('--pc', CANDY.taro);
      b.onclick = () => {
        look.font = id; this.plugin.setReaderLook(look);
        fontBtns.forEach(x => x.toggleClass('on', x === b));
        this.applyLook(root);
      };
      fontBtns.push(b);
    }

    /* 颜色三行：标题 / 重点 / 正文 */
    const swatchRow = (label, key) => {
      const ctl = lookRow(label);
      const btns = [];
      const mk = (id, sw, title) => {
        const b = ctl.createEl('button', {
          cls: `obos-swatch ${(look[key] || '') === id ? 'on' : ''}`,
          attr: { title, 'aria-label': `${label}：${title}` },
        });
        b.style.setProperty('--sw', sw);
        b.onclick = () => {
          look[key] = id; this.plugin.setReaderLook(look);
          btns.forEach(x => x.toggleClass('on', x === b));
          this.applyLook(root);
        };
        btns.push(b);
      };
      mk('', 'var(--frost)', '默认');
      for (const c of ['berry', 'peach', 'butter', 'mint', 'sky', 'taro']) mk(c, `var(--${c})`, c);
    };
    swatchRow('标题', 'title');
    swatchRow('重点', 'strong');
    const bodyCtl = lookRow('正文');
    const bodyBtns = [];
    for (const [id, label] of [['', '默认'], ['soft', '柔和'], ['bright', '高亮']]) {
      const b = bodyCtl.createEl('button', { cls: `obos-tab ${(look.body || '') === id ? 'on' : ''}`, text: label });
      b.style.setProperty('--pc', CANDY.mint);
      b.onclick = () => {
        look.body = id; this.plugin.setReaderLook(look);
        bodyBtns.forEach(x => x.toggleClass('on', x === b));
        this.applyLook(root);
      };
      bodyBtns.push(b);
    }

    if (fm.source_url) {
      const a = bar.createEl('button', { cls: 'obos-icon-btn obos-jc-sky', text: '原文 ↗' });
      a.onclick = () => window.open(fm.source_url);
    }
    let noteBtn = null;
    if (isArticle) {
      noteBtn = bar.createEl('button', { cls: 'obos-icon-btn obos-jc-butter', text: fm.note ? '✎ 备注●' : '✎ 备注' });
      const nextUnread = this.collect('20-Reading/Articles')
        .filter(a => a.fm.status !== 'read' && a.file.path !== file.path)
        .sort((a, b) => String(b.fm.added || '').localeCompare(String(a.fm.added || '')));
      if (nextUnread.length) {
        const next = bar.createEl('button', { cls: 'obos-icon-btn obos-jc-taro', text: '下一篇未读 ›' });
        next.onclick = () => this.openInView(VIEW_READER, nextUnread[0].file);
      }
      const discard = bar.createEl('button', { cls: 'obos-discard-btn', text: '废弃' });
      discard.onclick = async () => {
        await this.app.vault.trash(file, true);
        new Notice('文章已废弃');
        this.plugin.activateHome();
      };
      const readBtn = bar.createEl('button', {
        cls: `obos-read-toggle ${isRead ? 'is-read' : ''}`,
        text: isRead ? '✓ 已读' : '标记已读',
      });
      readBtn.onclick = async () => {
        await this.setProp(file, f => {
          if (f.status === 'read') { f.status = 'unread'; f.read_at = ''; }
          else { f.status = 'read'; f.read_at = todayStr(); }
        });
        /* 标成已读时清掉阅读位置，下次重读从头开始 */
        if (!isRead) { try { window.localStorage.removeItem(READPOS_PREFIX + file.path); } catch (e) {} }
        this.render();
      };
    }

    /* 阅读进度条（顶栏正下方） */
    const prog = root.createDiv({ cls: 'obos-progress' });
    const progFill = prog.createSpan();

    /* 滚动区 */
    const scroll = root.createDiv({ cls: 'obos-reader-scroll' });
    scroll.addEventListener('click', () => { lookPop.addClass('hidden'); lookBtn.removeClass('open'); });
    const page = scroll.createDiv({ cls: 'obos-reader-page' });
    page.style.maxWidth = this.plugin.getReaderWidth() + 'px';

    /* 文章头 */
    const hero = page.createDiv({ cls: 'obos-reader-hero' });
    hero.style.setProperty('--chip', CATEGORY_COLORS[cat] ? catColor(cat) : topicColor(cat));
    hero.createDiv({ cls: 'obos-reader-kicker', text: `${SOURCE_NAMES[fm.source] || fm.source || ''} · ${cat}` });
    hero.createEl('h1', { cls: 'obos-reader-title', text: fm.title || file.basename });
    const meta = [];
    if (fm.author) meta.push(fm.author);
    if (fm.added) meta.push(`收录 ${fm.added}`);
    if (fm.read_at) meta.push(`读于 ${fm.read_at}`);
    hero.createDiv({ cls: 'obos-reader-meta', text: meta.join('　·　') });

    /* 备注便利贴：写进 frontmatter note 字段，输入停顿即自动保存 */
    if (isArticle && noteBtn) {
      const notePanel = page.createDiv({ cls: 'obos-note-panel' });
      notePanel.toggleClass('is-hidden', !fm.note);
      const noteHead = notePanel.createDiv({ cls: 'obos-note-head' });
      noteHead.createSpan({ cls: 'obos-note-kicker', text: '✎ 我的备注' });
      const noteHint = noteHead.createSpan({ cls: 'obos-note-hint', text: '' });
      const ta = notePanel.createEl('textarea', {
        cls: 'obos-note-ta',
        attr: { placeholder: '想法、金句、跟进事项……输入后自动保存', rows: 4 },
      });
      ta.value = fm.note ? String(fm.note) : '';
      const saveNote = debounce(async () => {
        const v = ta.value.trim();
        await this.setProp(file, f => { if (v) f.note = v; else delete f.note; });
        noteHint.setText('已保存 ✓');
        noteBtn.setText(v ? '✎ 备注●' : '✎ 备注');
      }, 900, true);
      ta.addEventListener('input', () => { noteHint.setText('保存中…'); saveNote(); });
      noteBtn.onclick = () => {
        const show = notePanel.hasClass('is-hidden');
        notePanel.toggleClass('is-hidden', !show);
        if (show) ta.focus();
      };
    }

    /* 正文 */
    const body = page.createDiv({ cls: 'obos-reader-body obos-r-body' });
    const raw = await this.app.vault.cachedRead(file);
    let md = stripFrontmatter(raw);
    // 去掉与标题重复的首个 H1
    md = md.replace(/^\s*# .+\n/, '');
    md = autoParagraph(md);
    await MarkdownRenderer.render(this.app, md, body, file.path, this);

    /* 正文字号：就地改 style，不打断阅读 */
    const applyFs = () => {
      const s = this.plugin.getReaderScale();
      fsVal.setText(s + '%');
      body.style.fontSize = (1.16 * s / 100).toFixed(3) + 'em';
    };
    fsDec.onclick = () => { this.plugin.setReaderScale(this.plugin.getReaderScale() - 10); applyFs(); };
    fsInc.onclick = () => { this.plugin.setReaderScale(this.plugin.getReaderScale() + 10); applyFs(); };
    applyFs();

    /* 阅读进度条 + 位置记忆 */
    const posKey = READPOS_PREFIX + file.path;
    const updateProg = () => {
      const max = scroll.scrollHeight - scroll.clientHeight;
      progFill.style.width = max > 0 ? Math.min(100, (scroll.scrollTop / max) * 100).toFixed(1) + '%' : '0%';
    };
    let saveTimer = null;
    let userTouched = false;
    this.registerDomEvent(scroll, 'wheel', () => { userTouched = true; }, { passive: true });
    this.registerDomEvent(scroll, 'touchmove', () => { userTouched = true; }, { passive: true });
    this.registerDomEvent(scroll, 'scroll', () => {
      window.requestAnimationFrame(updateProg);
      if (saveTimer) window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => {
        try { window.localStorage.setItem(posKey, String(Math.round(scroll.scrollTop))); } catch (e) {}
      }, 400);
    });
    let savedPos = 0;
    try { savedPos = parseInt(window.localStorage.getItem(posKey), 10) || 0; } catch (e) {}
    if (savedPos > 40) {
      scroll.scrollTop = savedPos;
      /* 图片异步加载会撑高内容，稍后补一次恢复；用户已自己滚动则不打扰 */
      window.setTimeout(() => {
        if (!userTouched && Math.abs(scroll.scrollTop - savedPos) > 8) scroll.scrollTop = savedPos;
        updateProg();
      }, 400);
    }
    updateProg();

    /* 底部：读完即标 */
    const foot = page.createDiv({ cls: 'obos-reader-foot' });
    if (isArticle && !isRead) {
      const done = foot.createEl('button', { cls: 'obos-jelly obos-jc-mint obos-btn-lg', text: '✓ 读完了，归入已读' });
      done.onclick = async () => {
        await this.setProp(file, f => { f.status = 'read'; f.read_at = todayStr(); });
        try { window.localStorage.removeItem(posKey); } catch (e) {}
        new Notice('已归入已读');
        this.plugin.activateHome();
      };
    } else if (isArticle) {
      foot.createDiv({ cls: 'obos-reader-fin', text: '· 已读 ·' });
    }
  }
}
Object.assign(ObosReaderView.prototype, dataMixin);

/* ================= 剧集详情页 ================= */

class ObosDramaView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.filePath = null;
    this.searching = false;
  }
  getViewType() { return VIEW_DRAMA; }
  getDisplayText() {
    const f = this.file();
    const fm = f && this.app.metadataCache.getFileCache(f)?.frontmatter;
    return fm?.title || '剧集';
  }
  getIcon() { return 'clapperboard'; }
  getState() { return { filePath: this.filePath }; }
  async setState(state, result) {
    this.filePath = state.filePath;
    await this.render();
    await super.setState(state, result);
  }
  file() {
    const f = this.filePath && this.app.vault.getAbstractFileByPath(this.filePath);
    return f instanceof TFile ? f : null;
  }

  async onOpen() {
    /* v7.2 详情页跟随元数据自动重渲染：修两个病——新建档打开时索引未就绪渲染出一帧空数据
       停在那不动；AI 后台补全写回 frontmatter 后页面不刷新（用户以为补全没跑） */
    this.registerEvent(this.app.metadataCache.on('changed', f => {
      if (this.filePath && f.path === this.filePath) this.render();
    }));
  }

  /* 联网搜封面：TVmaze → iTunes 兜底 */
  posterCandidates(fm) {
    const out = [];
    const push = v => { if (v && !out.includes(v)) out.push(String(v)); };
    const orig = String(fm.title_original || '');
    const paren = orig.match(/（(.+?)）|\((.+?)\)/);
    if (paren) push(paren[1] || paren[2]);
    push(orig.replace(/（.+?）|\(.+?\)/g, '').trim());
    if (Array.isArray(fm.aka)) fm.aka.forEach(push);
    push(fm.title);
    return out.filter(Boolean);
  }

  async collectPosterCandidates(fm) {
    const out = [];
    for (const q of this.posterCandidates(fm)) {
      try {
        const r = await requestUrl({ url: `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}` });
        for (const it of (r.json || [])) {
          const sh = it.show || {};
          if (sh.image && sh.image.original) {
            out.push({
              url: sh.image.original,
              label: `${sh.name || q}${sh.premiered ? ' · ' + sh.premiered.slice(0, 4) : ''}`,
              source: 'TVmaze',
              rating: (sh.rating && sh.rating.average) || null,
            });
          }
        }
      } catch (e) { /* 下一个候选词 */ }
      if (out.length >= 8) break;
    }
    if (out.length < 4) {
      for (const q of this.posterCandidates(fm)) {
        try {
          const r = await requestUrl({ url: `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=tvSeason&limit=4` });
          for (const res of (JSON.parse(r.text).results || [])) {
            if (res.artworkUrl100) {
              out.push({ url: res.artworkUrl100.replace('100x100bb', '800x800bb'), label: res.collectionName || q, source: 'iTunes', rating: null });
            }
          }
        } catch (e) { /* 下一个 */ }
        if (out.length >= 8) break;
      }
    }
    const seen = new Set();
    return out.filter(c => !seen.has(c.url) && seen.add(c.url)).slice(0, 8);
  }

  async fetchPoster(file, fm) {
    if (this.searching) return;
    this.searching = true;
    new Notice('正在搜索封面…');
    try {
      const cands = await this.collectPosterCandidates(fm);
      if (!cands.length) { new Notice('没搜到封面——把 title_original 填成英文名再试'); return; }
      this.showPosterChooser(file, fm, cands);
    } finally {
      this.searching = false;
    }
  }

  /* 候选封面九宫格：点哪张用哪张 */
  showPosterChooser(file, fm, cands) {
    this.contentEl.querySelectorAll('.obos-chooser').forEach(x => x.remove());
    const overlay = this.contentEl.createDiv({ cls: 'obos-chooser' });
    const box = overlay.createDiv({ cls: 'obos-chooser-box' });
    const head = box.createDiv({ cls: 'obos-chooser-head' });
    head.createSpan({ cls: 'obos-chooser-title', text: `选一张封面 · ${cands.length} 个结果` });
    const close = head.createEl('button', { cls: 'obos-mini-btn', text: '取消' });
    close.onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    const grid = box.createDiv({ cls: 'obos-chooser-grid' });
    for (const c of cands) {
      const cell = grid.createDiv({ cls: 'obos-chooser-cell', attr: { role: 'button', tabindex: '0' } });
      cell.createEl('img', { attr: { src: c.url, loading: 'lazy', alt: c.label } });
      cell.createDiv({ cls: 'obos-chooser-label', text: `${c.label} · ${c.source}${c.rating ? ' · ★ ' + c.rating : ''}` });
      const pick = async () => {
        overlay.remove();
        new Notice('正在下载封面…');
        try {
          const img = await requestUrl({ url: c.url });
          const ext = c.url.split('.').pop().split('?')[0].slice(0, 4) || 'jpg';
          const base = sanitizeFilename(fm.title || file.basename);
          const path = `${FOLDERS.posters}/${base}.${ext}`;
          const existing = this.app.vault.getAbstractFileByPath(path);
          if (existing instanceof TFile) await this.app.vault.modifyBinary(existing, img.arrayBuffer);
          else await this.app.vault.createBinary(path, img.arrayBuffer);
          await this.setProp(file, f => {
            f.poster = `[[${path}]]`;
            if (c.rating) f.external_rating = Object.assign({}, f.external_rating, { tvmaze: c.rating });
          });
          new Notice(`封面已更新（${c.source}）`);
          this.render();
        } catch (e) {
          new Notice('封面下载失败：' + e.message);
        }
      };
      cell.onclick = pick;
      cell.onkeydown = e => { if (e.key === 'Enter') pick(); };
    }
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass('obos-drama-root');
    this.applyTheme(root);
    const file = this.file();
    if (!file) { root.createDiv({ cls: 'obos-empty', text: '剧集不存在。' }); return; }
    const fm = this.app.metadataCache.getFileCache(file)?.frontmatter || {};
    const url = this.posterUrl(fm);
    const total = Number(fm.episodes) || 0;
    const cur = Number(fm.current_episode) || 0;

    root.createDiv({ cls: 'obos-detail-sky' });

    const bar = root.createDiv({ cls: 'obos-reader-bar' });
    const back = bar.createEl('button', { cls: 'obos-icon-btn', text: '‹ 中枢' });
    back.onclick = () => this.plugin.activateHome();
    bar.createDiv({ cls: 'obos-reader-bar-space' });
    const pinBtn = bar.createEl('button', {
      cls: `obos-icon-btn obos-jc-butter obos-pin-btn ${fm.pinned ? 'on' : ''}`,
      text: fm.pinned ? '★ 已置顶' : '☆ 置顶',
      attr: { title: '置顶的剧在追剧墙排最前' },
    });
    pinBtn.onclick = async () => {
      await this.setProp(file, f => { if (f.pinned) delete f.pinned; else f.pinned = true; });
      new Notice(fm.pinned ? '已取消置顶' : `《${fm.title || file.basename}》已置顶 ★`);
      this.render();
    };
    const searchBtn = bar.createEl('button', { cls: 'obos-icon-btn obos-jc-sky', text: '搜封面' });
    searchBtn.onclick = () => this.fetchPoster(file, fm);
    /* v7.3 收录简介：AI 联网查介绍写进正文（简介/看点/条目链接），已有段落只查缺补漏 */
    const introBtn = bar.createEl('button', { cls: 'obos-icon-btn obos-jc-mint', text: '收录简介' });
    introBtn.onclick = () => {
      const tt = fm.title || file.basename;
      this.plugin.runClaude('收录简介',
        `联网搜索剧集《${tt}》（${fm.title_original || ''}${fm.year ? '，' + fm.year + ' 年' : ''}）的介绍，然后编辑 vault 文件 "${file.path}" 的正文：`
        + `写「## 简介」（两三句剧情梗概，不剧透关键反转）与「## 看点」（2-3 条吸引点），末尾附豆瓣/IMDb 条目链接；`
        + `正文已有这些段落则查缺补漏完善，其余正文内容（如 Mia 简评）原样保留。`
        + `frontmatter 只允许动 notes（为空时填一句话推荐语），其余一字不动。`
        + `最后输出一行：《${tt}》简介已收录。`);
    };
    const rateBtn = bar.createEl('button', { cls: 'obos-icon-btn obos-jc-butter', text: '搜评分' });
    rateBtn.onclick = () => {
      const tt = fm.title || file.basename;
      this.plugin.runClaude('搜评分',
        `联网搜索剧集《${tt}》（${fm.title_original || ''}${fm.year ? '，' + fm.year + ' 年' : ''}）的豆瓣评分和 IMDb 评分，务必确认是真实分数。然后编辑 vault 文件 "${file.path}"：只更新 frontmatter 里 external_rating 的 douban 与 imdb 两个子字段（填数字；查不到的字段保持原样，绝不编造），其余内容一字不动。最后输出一行：《${tt}》豆瓣 X · IMDb Y。`);
    };

    const scroll = root.createDiv({ cls: 'obos-reader-scroll' });
    const page = scroll.createDiv({ cls: 'obos-drama-page' });

    /* 上半：海报 + 信息 */
    const top = page.createDiv({ cls: 'obos-drama-top' });
    const posterCol = top.createDiv({ cls: 'obos-drama-poster' });
    if (url) {
      const glow = posterCol.createDiv({ cls: 'obos-poster-glow' });
      glow.style.backgroundImage = `url("${url}")`;
      const frame = posterCol.createDiv({ cls: 'obos-poster-frame' });
      frame.createEl('img', { attr: { src: url, alt: fm.title || '' } });
    } else {
      const frame = posterCol.createDiv({ cls: 'obos-poster-frame' });
      const blank = frame.createDiv({ cls: 'obos-poster-blank' });
      const b = blank.createEl('button', { cls: 'obos-jelly obos-jc-sky', text: '联网搜封面' });
      b.onclick = () => this.fetchPoster(file, fm);
    }

    const info = top.createDiv({ cls: 'obos-drama-info' });
    if (fm.status === '待定') info.createDiv({ cls: 'obos-triage-badge', text: '待归类 · 等你决定' });
    info.createEl('h1', { cls: 'obos-drama-title', text: fm.title || file.basename });
    if (fm.title_original) info.createDiv({ cls: 'obos-drama-orig', text: String(fm.title_original) });

    /* 外部评分：豆瓣 / IMDb 品牌徽章，独立醒目 */
    const er = fm.external_rating || {};
    const scoreRow = info.createDiv({ cls: 'obos-scores' });
    const scoreBadge = (cls, name, val) => {
      const b = scoreRow.createDiv({ cls: `obos-score ${cls}${val ? '' : ' empty'}` });
      b.createSpan({ cls: 'obos-score-name', text: name });
      b.createSpan({ cls: 'obos-score-val', text: val ? String(val) : '待录' });
    };
    scoreBadge('douban', '豆瓣', er.douban);
    scoreBadge('imdb', 'IMDb', er.imdb);
    if (er.tvmaze) scoreBadge('tvmaze', 'TVmaze', er.tvmaze);

    /* 贴纸信息签（糖果色轮转） */
    const chipColors = [CANDY.sky, CANDY.taro, CANDY.berry, CANDY.mint, CANDY.butter];
    const facts = info.createDiv({ cls: 'obos-drama-facts' });
    let ci = 0;
    const chip = val => {
      if (!val) return;
      const c = facts.createDiv({ cls: 'obos-d-chip', text: String(Array.isArray(val) ? val.join(' / ') : val) });
      c.style.setProperty('--cc', chipColors[ci % chipColors.length]);
      ci++;
    };
    chip(fm.country);
    chip(fm.year);
    chip(fm.genre);
    chip(fm.platform);
    if (total) chip(`${total} 集`);

    if (fm.notes) info.createDiv({ cls: 'obos-drama-notes', text: String(fm.notes) });

    /* 我的评分：点星即写回，点同一颗清除 */
    const curRating = Number(fm.rating) || 0;
    info.createDiv({ cls: 'obos-rate-kicker', text: '我的评分（点星试试）' });
    const rate = info.createDiv({ cls: 'obos-rate' });
    for (let i = 1; i <= 5; i++) {
      const star = rate.createEl('button', {
        cls: `obos-star ${i <= curRating ? 'on' : ''}`,
        attr: { 'aria-label': `评 ${i} 星` },
      });
      star.innerHTML = starSVG();
      star.onclick = async () => {
        await this.setProp(file, f => { f.rating = curRating === i ? '' : i; });
        this.render();
      };
    }
    rate.createSpan({ cls: 'obos-rate-label', text: curRating ? `${curRating} / 5` : '未评分' });

    /* 决策按钮 */
    info.createDiv({ cls: 'obos-rate-kicker', text: '这部剧追吗？' });
    const actions = info.createDiv({ cls: 'obos-drama-actions' });
    for (const s of DRAMA_STATUSES) {
      const b = actions.createEl('button', {
        cls: `obos-jelly obos-jc-${DRAMA_STATUS_JC[s]} obos-status-pick ${fm.status === s ? 'on' : ''}`,
        text: s,
      });
      b.onclick = async () => {
        await this.setProp(file, f => { f.status = s; });
        new Notice(`《${fm.title}》→ ${s}`);
        this.render();
      };
    }

    /* 进度控制（常驻，不再只限「在追」） */
    {
      info.createDiv({ cls: 'obos-rate-kicker', text: '进度（＋－可以点）' });
      const prog = info.createDiv({ cls: 'obos-drama-prog' });
      const minus = prog.createEl('button', { cls: 'obos-step', text: '－' });
      const label = prog.createDiv({ cls: 'obos-prog-label', text: total ? `${cur} / ${total} 集` : `第 ${cur} 集` });
      const plus = prog.createEl('button', { cls: 'obos-step', text: '＋' });
      const barEl = prog.createDiv({ cls: 'obos-prog-bar' });
      const fill = barEl.createDiv({ cls: 'obos-prog-fill' });
      fill.style.width = total ? `${Math.min(100, (cur / total) * 100)}%` : '0%';
      const bump = async delta => {
        const next = Math.max(0, cur + delta);
        if (total && next > total) return;
        await this.setProp(file, f => {
          f.current_episode = next;
          if (total && next >= total) f.status = '看完';
        });
        if (total && next >= total) new Notice(`《${fm.title}》完结 🎉`);
        this.render();
      };
      minus.onclick = () => bump(-1);
      plus.onclick = () => bump(1);
    }

    /* 正文（来源、笔记等） */
    const body = page.createDiv({ cls: 'obos-reader-body obos-drama-body obos-r-body' });
    const raw = await this.app.vault.cachedRead(file);
    let md = stripFrontmatter(raw).replace(/^\s*# .+\n/, '');
    if (md.trim()) await MarkdownRenderer.render(this.app, md, body, file.path, this);
  }
}
Object.assign(ObosDramaView.prototype, dataMixin);

/* ================= 账本详情页 ================= */

class ObosLedgerView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.filePath = null;
  }
  getViewType() { return VIEW_LEDGER; }
  getDisplayText() {
    const f = this.file();
    const fm = f && this.app.metadataCache.getFileCache(f)?.frontmatter;
    return fm?.title || '账本';
  }
  getIcon() { return 'wallet'; }
  getState() { return { filePath: this.filePath }; }
  async setState(state, result) {
    this.filePath = state.filePath;
    await this.render();
    await super.setState(state, result);
  }
  file() {
    const f = this.filePath && this.app.vault.getAbstractFileByPath(this.filePath);
    return f instanceof TFile ? f : null;
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass('obos-reader-root');
    this.applyTheme(root);
    const file = this.file();
    if (!file) { root.createDiv({ cls: 'obos-empty', text: '账本不存在。' }); return; }
    const fm = this.app.metadataCache.getFileCache(file)?.frontmatter || {};
    const total = Number(fm.total) || 0;

    root.createDiv({ cls: 'obos-detail-sky' });

    const bar = root.createDiv({ cls: 'obos-reader-bar' });
    const back = bar.createEl('button', { cls: 'obos-icon-btn', text: '‹ 中枢' });
    back.onclick = () => this.plugin.activateHome();
    bar.createDiv({
      cls: `obos-ledger-badge ${fm.status === 'closed' ? 'closed' : ''}`,
      text: fm.status === 'closed' ? '已结' : '持续更新',
    });
    bar.createDiv({ cls: 'obos-reader-bar-space' });
    const src = bar.createEl('button', { cls: 'obos-icon-btn obos-jc-butter', text: '打开原文' });
    src.onclick = () => this.app.workspace.getLeaf('tab').openFile(file);

    const scroll = root.createDiv({ cls: 'obos-reader-scroll' });
    const page = scroll.createDiv({ cls: 'obos-ledger-page' });

    const hero = page.createDiv({ cls: 'obos-ledger-hero obos-in', attr: { style: '--i:0' } });
    hero.createDiv({ cls: 'obos-reader-kicker', text: `账本 · ${fm.currency || 'JPY'}` });
    hero.createEl('h1', { cls: 'obos-ledger-name', text: String(fm.title || file.basename) });
    hero.createDiv({
      cls: `obos-ledger-total ${total < 0 ? 'neg' : ''}`,
      text: fmtMoney(total, fm.currency),
    });
    const meta = [];
    if (total < 0) meta.push('当前为欠款');
    if (fm.updated) meta.push(`更新 ${fm.updated}`);
    if (fm.imported_at) meta.push(`导入 ${String(fm.imported_at).slice(0, 10)}`);
    hero.createDiv({ cls: 'obos-ledger-meta', text: meta.join('　·　') });

    const raw = await this.app.vault.cachedRead(file);
    const body = stripFrontmatter(raw).replace(/^\s*# .+\n/, '');
    let idx = 1;
    for (const sec of parseLedgerSections(body)) {
      const hasContent = sec.chunks.some(ch => ch.type === 'table' || ch.text.trim());
      if (!sec.title && !hasContent) continue;
      const secEl = page.createDiv({ cls: 'obos-ledger-sec obos-in', attr: { style: `--i:${Math.min(idx++, 8)}` } });
      if (sec.title) secEl.createDiv({ cls: 'obos-ledger-sec-title', text: sec.title });
      if (/更新记录/.test(sec.title)) { this.renderTimeline(secEl, sec); continue; }
      for (const ch of sec.chunks) {
        if (ch.type === 'md') {
          const t = ch.text.trim();
          if (!t) continue;
          const div = secEl.createDiv({ cls: 'obos-ledger-md' });
          await MarkdownRenderer.render(this.app, t, div, file.path, this);
        } else {
          this.renderTable(secEl, ch, fm);
        }
      }
    }
  }

  renderTimeline(secEl, sec) {
    const items = [];
    for (const ch of sec.chunks) {
      if (ch.type !== 'md') continue;
      for (const line of ch.text.split('\n')) {
        const m = line.match(/^\s*[-*]\s+(.+)/);
        if (m) items.push(m[1]);
      }
    }
    const tl = secEl.createDiv({ cls: 'obos-timeline' });
    for (const it of items.reverse()) {
      const row = tl.createDiv({ cls: 'obos-timeline-item' });
      row.createDiv({ cls: 'obos-timeline-dot' });
      const bodyEl = row.createDiv({ cls: 'obos-timeline-body' });
      const m = it.match(/^(\d{4}-\d{2}-\d{2})[：:]\s*(.*)/);
      if (m) {
        bodyEl.createDiv({ cls: 'obos-timeline-date', text: m[1] });
        bodyEl.createDiv({ cls: 'obos-timeline-text', text: m[2] });
      } else {
        bodyEl.createDiv({ cls: 'obos-timeline-text', text: it });
      }
    }
  }

  renderTable(secEl, tbl, fm) {
    const shareCol = tbl.header.findIndex(h => /占比/.test(h));
    if (shareCol > 0 && this.renderShare(secEl, tbl, shareCol, fm)) return;
    if (tbl.header.length === 2 && tbl.rows.length <= 6) { this.renderStats(secEl, tbl); return; }
    this.renderDetail(secEl, tbl);
  }

  /* 签名元素：占比条。返回 false 表示解析不出，降级明细表 */
  renderShare(secEl, tbl, shareCol, fm) {
    const valCol = tbl.header.findIndex(h => /JPY|金额|累计|小计/.test(h));
    const parts = [];
    for (const r of tbl.rows) {
      const label = r[0] || '';
      if (/合计/.test(label)) continue;
      const pct = parseNum(r[shareCol]);
      if (pct == null) continue;
      parts.push({ label, pct, val: parseNum(r[valCol >= 0 ? valCol : 1]) });
    }
    if (!parts.length) return false;
    const wrap = secEl.createDiv({ cls: 'obos-share' });
    const barEl = wrap.createDiv({ cls: 'obos-share-bar' });
    parts.forEach((p, i) => {
      const seg = barEl.createDiv({ cls: 'obos-share-seg', attr: { 'aria-label': `${p.label} ${p.pct}%` } });
      seg.style.background = SHARE_HUES[i % SHARE_HUES.length];
      seg.style.width = '0%';
      requestAnimationFrame(() => requestAnimationFrame(() => { seg.style.width = `${p.pct}%`; }));
    });
    const legend = wrap.createDiv({ cls: 'obos-share-legend' });
    parts.forEach((p, i) => {
      const item = legend.createDiv({ cls: 'obos-share-item' });
      item.createDiv({ cls: 'obos-share-dot' }).style.background = SHARE_HUES[i % SHARE_HUES.length];
      item.createSpan({ cls: 'obos-share-label', text: p.label });
      if (p.val != null) item.createSpan({ cls: 'obos-share-val', text: fmtMoney(p.val, fm.currency) });
      item.createSpan({ cls: 'obos-share-pct', text: `${p.pct}%` });
    });
    return true;
  }

  renderStats(secEl, tbl) {
    const row = secEl.createDiv({ cls: 'obos-ledger-stats' });
    tbl.rows.forEach((r, i) => {
      const pill = row.createDiv({ cls: 'obos-ledger-stat' });
      pill.style.setProperty('--sc', LEDGER_STAT_COLORS[i % LEDGER_STAT_COLORS.length]);
      const num = parseNum(r[1]);
      const clean = num != null && /^[-−\d,，.\s]+(JPY|CNY|AUD|USD)?\s*$/.test(r[1] || '');
      pill.createDiv({ cls: 'obos-ledger-stat-v', text: clean ? num.toLocaleString('en-US') : (r[1] || '—') });
      pill.createDiv({ cls: 'obos-ledger-stat-l', text: r[0] || '' });
    });
  }

  renderDetail(secEl, tbl) {
    const wrap = secEl.createDiv({ cls: 'obos-ledger-tablewrap' });
    const table = wrap.createEl('table', { cls: 'obos-ledger-table' });
    const headRow = table.createEl('thead').createEl('tr');
    const moneyCols = new Set();
    tbl.header.forEach((h, i) => {
      headRow.createEl('th', { text: h });
      if (/JPY|金额|CNY|AUD/.test(h)) moneyCols.add(i);
    });
    const numCols = new Set();
    tbl.header.forEach((_, i) => {
      const vals = tbl.rows.map(r => r[i]).filter(v => v);
      if (vals.length && vals.filter(v => /^-?[\d,，.\s%]+$/.test(v)).length >= vals.length * 0.6) numCols.add(i);
    });
    const tbody = table.createEl('tbody');
    for (const r of tbl.rows) {
      const tr = tbody.createEl('tr');
      if (/合计/.test(r[0] || '')) tr.addClass('is-total');
      tbl.header.forEach((_, i) => {
        const c = r[i] ?? '';
        const td = tr.createEl('td', { text: c });
        if (numCols.has(i)) td.addClass('num');
        if (moneyCols.has(i)) td.addClass('money');
        if (moneyCols.has(i) && /^-/.test(c)) td.addClass('refund');
      });
    }
  }
}
Object.assign(ObosLedgerView.prototype, dataMixin);

/* ================= 项目详情页（RuruCode 只读扫描） ================= */

class ObosProjectView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.projectPath = null;
  }
  getViewType() { return VIEW_PROJECT; }
  getDisplayText() {
    return this.projectPath ? nodePath.basename(this.projectPath) : '项目';
  }
  getIcon() { return 'rocket'; }
  getState() { return { projectPath: this.projectPath }; }
  async setState(state, result) {
    this.projectPath = state.projectPath;
    await this.render();
    await super.setState(state, result);
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass('obos-reader-root');
    this.applyTheme(root);

    if (!this.projectPath) { root.createDiv({ cls: 'obos-empty', text: '没有指定项目。' }); return; }

    let data;
    try {
      data = scanProject(this.projectPath);
    } catch (e) {
      root.createDiv({ cls: 'obos-empty', text: '这个项目文件夹读不到了——可能被移动或删除。' });
      return;
    }

    root.createDiv({ cls: 'obos-detail-sky' });

    const bar = root.createDiv({ cls: 'obos-reader-bar' });
    const back = bar.createEl('button', { cls: 'obos-icon-btn', text: '‹ 中枢' });
    back.onclick = () => this.plugin.activateHome();
    bar.createDiv({ cls: 'obos-reader-bar-space' });

    const scroll = root.createDiv({ cls: 'obos-reader-scroll' });
    const page = scroll.createDiv({ cls: 'obos-proj-page' });

    const hero = page.createDiv({ cls: 'obos-proj-hero obos-in', attr: { style: '--i:0' } });
    hero.createDiv({ cls: 'obos-reader-kicker', text: PROJECTS_DIR ? `项目 · 扫描自 ${PROJECTS_DIR}` : '项目' });
    hero.createEl('h1', { cls: 'obos-proj-title', text: data.name });
    hero.createDiv({
      cls: 'obos-ledger-meta',
      text: `最近动静 ${data.latestMtime ? mtimeMMDD(data.latestMtime) : '—'} · 文档 ${data.files.length} 份`,
    });

    /* 只读锁条 */
    const lockSec = page.createDiv({ cls: 'obos-ledger-sec obos-in', attr: { style: '--i:1' } });
    const lock = lockSec.createDiv({ cls: 'obos-pj-lock' });
    lock.innerHTML = ICON_LOCK;
    lock.createSpan({ text: '只读模式：中枢只扫描和展示，永远不会写入、移动或修改你的项目文件夹' });

    /* 最近动静 前 5 条 */
    if (data.files.length) {
      const recentSec = page.createDiv({ cls: 'obos-ledger-sec obos-in', attr: { style: '--i:2' } });
      recentSec.createDiv({ cls: 'obos-ledger-sec-title', text: '最近动静' });
      const recentList = recentSec.createDiv({ cls: 'obos-pj-recent' });
      for (const f of data.files.slice(0, 5)) {
        const row = recentList.createDiv({ cls: 'obos-know', attr: { tabindex: '0', role: 'button' } });
        row.createDiv({ cls: 'obos-proj-dot' });
        const body = row.createDiv({ cls: 'obos-know-body' });
        body.createDiv({ cls: 'obos-know-title', text: f.name });
        row.createDiv({ cls: 'obos-know-date', text: mtimeMMDD(f.mtime) });
        const open = () => this.openState(VIEW_MDPREVIEW, { filePath: f.path, projectPath: this.projectPath });
        row.onclick = open;
        row.onkeydown = e => { if (e.key === 'Enter') open(); };
      }
    }

    /* 全部 .md 文件卡格（按一级子目录分组） */
    if (data.files.length) {
      const filesSec = page.createDiv({ cls: 'obos-ledger-sec obos-in', attr: { style: '--i:3' } });
      filesSec.createDiv({ cls: 'obos-ledger-sec-title', text: `项目文档 · ${data.files.length}` });
      const grid = filesSec.createDiv({ cls: 'obos-proj-files' });
      const byPathOrder = [...data.files].sort((a, b) => a.path.localeCompare(b.path, 'zh'));
      for (const f of byPathOrder) {
        const rel = nodePath.relative(this.projectPath, f.path);
        const parts = rel.split(nodePath.sep);
        const group = parts.length > 1 ? parts[0] : '根目录';
        const cardEl = grid.createDiv({ cls: 'obos-proj-file', attr: { tabindex: '0', role: 'button' } });
        cardEl.createDiv({ cls: 'obos-proj-file-group', text: group });
        cardEl.createDiv({ cls: 'obos-proj-file-name', text: f.name });
        cardEl.createDiv({ cls: 'obos-proj-file-date', text: mtimeMMDD(f.mtime) });
        const open = () => this.openState(VIEW_MDPREVIEW, { filePath: f.path, projectPath: this.projectPath });
        cardEl.onclick = open;
        cardEl.onkeydown = e => { if (e.key === 'Enter') open(); };
      }
    } else {
      const emptySec = page.createDiv({ cls: 'obos-ledger-sec obos-in', attr: { style: '--i:3' } });
      emptySec.createDiv({ cls: 'obos-empty', text: '这个项目里还没有 .md 文档。' });
    }
  }
}
Object.assign(ObosProjectView.prototype, dataMixin);

/* ================= MD 只读预览页 ================= */

class ObosMdPreviewView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.filePath = null;
    this.projectPath = null;
  }
  getViewType() { return VIEW_MDPREVIEW; }
  getDisplayText() {
    return this.filePath ? nodePath.basename(this.filePath).replace(/\.md$/i, '') : '预览';
  }
  getIcon() { return 'file-text'; }
  getState() { return { filePath: this.filePath, projectPath: this.projectPath }; }
  async setState(state, result) {
    this.filePath = state.filePath;
    this.projectPath = state.projectPath;
    await this.render();
    await super.setState(state, result);
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass('obos-reader-root');
    this.applyTheme(root);

    if (!this.filePath) { root.createDiv({ cls: 'obos-empty', text: '没有指定文件。' }); return; }

    root.createDiv({ cls: 'obos-detail-sky' });

    const bar = root.createDiv({ cls: 'obos-reader-bar' });
    const back = bar.createEl('button', { cls: 'obos-icon-btn', text: '‹ 返回项目' });
    back.onclick = () => this.openState(VIEW_PROJECT, { projectPath: this.projectPath });
    bar.createDiv({ cls: 'obos-reader-bar-space' });
    bar.createDiv({ cls: 'obos-mdprev-badge', text: '只读预览 · 绝不改动原文件' });

    const scroll = root.createDiv({ cls: 'obos-reader-scroll' });
    const page = scroll.createDiv({ cls: 'obos-reader-page' });

    let raw;
    try {
      raw = nodeFs.readFileSync(this.filePath, 'utf8');
    } catch (e) {
      page.createDiv({ cls: 'obos-empty', text: '这份文件读不到了——可能被移动、改名或删除。' });
      return;
    }

    const projectName = this.projectPath ? nodePath.basename(this.projectPath) : '';
    const rel = this.projectPath ? nodePath.relative(this.projectPath, this.filePath) : this.filePath;
    const parts = rel.split(nodePath.sep);
    const group = parts.length > 1 ? parts[0] : '根目录';
    const name = nodePath.basename(this.filePath).replace(/\.md$/i, '');

    const hero = page.createDiv({ cls: 'obos-reader-hero' });
    const kicker = hero.createDiv({ cls: 'obos-reader-kicker' });
    kicker.createSpan({ cls: 'obos-art-cat', text: `${projectName} / ${group}` }).style.setProperty('--chip', CANDY.taro);
    kicker.createSpan({ cls: 'obos-reader-meta', text: `${nodePath.basename(this.filePath)}` });
    hero.createEl('h1', { cls: 'obos-reader-title', text: name });

    try {
      const body = page.createDiv({ cls: 'obos-reader-body obos-r-body' });
      let md = stripFrontmatter(raw);
      md = md.replace(/^\s*# .+\n/, '');
      await MarkdownRenderer.render(this.app, md, body, this.filePath, this);
    } catch (e) {
      page.createDiv({ cls: 'obos-empty', text: '这份文件暂时无法渲染预览。' });
    }
  }
}
Object.assign(ObosMdPreviewView.prototype, dataMixin);

/* ================= 主屏 ================= */

class ObosHomeView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.dramaTab = '待定';
    this.articleTab = 'unread';
    this.articleCat = 'all';
    this.editingTask = null;
    this.editingEvent = null;
    this.addingEvent = false;
    this.taskTab = 'open';
    this.calMode = 'list';
    this.calCursor = null;
    this.calSelected = null;
    this.aiBusy = { distill: false, clean: false };
    this.refresh = debounce(() => { if (this.editingTask || this.editingEvent || this.addingEvent) return; this.render(); }, 250, true);
  }

  getViewType() { return VIEW_HOME; }
  getDisplayText() { return 'RuruOS 中枢'; }
  getIcon() { return 'layout-dashboard'; }

  async onOpen() {
    this.registerEvent(this.app.metadataCache.on('changed', this.refresh));
    this.registerEvent(this.app.vault.on('create', this.refresh));
    this.registerEvent(this.app.vault.on('delete', this.refresh));
    this.registerEvent(this.app.vault.on('rename', this.refresh));
    /* 日签卡：时钟每秒走，句子每 2 分钟换（手动换已按拍板取消） */
    this.registerInterval(window.setInterval(() => this.tickClock(), 1000));
    this.registerInterval(window.setInterval(() => this.nextQuote(), 2 * 60 * 1000));
    this.render();
    this.registerInterval(window.setInterval(() => this.updateClock(), 1000 * 20));
  }

  openFile(file) { this.app.workspace.getLeaf('tab').openFile(file); }

  updateClock() {
    const el = this.containerEl.querySelector('.obos-clock');
    if (el) {
      const d = new Date();
      el.innerHTML = `${String(d.getHours()).padStart(2, '0')}<span class="obos-colon">:</span>${String(d.getMinutes()).padStart(2, '0')}`;
    }
  }

  spawnMotes(motes) {
    for (let i = 0; i < 16; i++) {
      const m = motes.createSpan({ cls: 'obos-mote' });
      m.style.setProperty('--x', `${(3 + (i * 59) % 94)}vw`);
      m.style.setProperty('--d', `${(13 + (i * 7) % 16)}s`);
      m.style.setProperty('--dl', `${((i * 1.6) % 13)}s`);
      m.style.setProperty('--o', (0.3 + ((i * 17) % 35) / 100).toFixed(2));
      m.style.setProperty('--s', `${(3 + i % 3)}px`);
    }
  }

  render() {
    const root = this.contentEl;
    const oldScroll = root.querySelector('.obos-scroll');
    this._keepScroll = oldScroll ? oldScroll.scrollTop : 0;
    /* 进场动画只在第一次渲染播放，之后的数据刷新静默重绘 */
    root.toggleClass('obos-still', !!this.hasRendered);
    this.hasRendered = true;
    root.empty();
    root.addClass('obos-root');
    this.applyTheme(root);

    const candy = root.createDiv({ cls: 'obos-candy' });
    candy.createDiv({ cls: 'obos-puff' });
    const motes = root.createDiv({ cls: 'obos-motes' });
    this.spawnMotes(motes);
    const scroll = root.createDiv({ cls: 'obos-scroll' });
    scroll.addEventListener('click', () => this.closePops());

    const tasks = this.collect(FOLDERS.tasks, 'task');
    const events = this.collect(FOLDERS.calendar, 'event');
    const articles = this.collect(FOLDERS.articles);
    const dramas = this.collect(FOLDERS.dramas, 'drama');

    this.renderHeader(scroll, { tasks, events, articles, dramas });
    this.renderDramas(scroll, dramas);
    const grid = scroll.createDiv({ cls: 'obos-grid' });
    this.renderTasks(grid, tasks);
    this.renderCalendar(grid, events);
    this.renderProjects(grid);
    this.renderFinance(grid);
    const split = scroll.createDiv({ cls: 'obos-row-split' });
    this.renderArticles(split, articles);
    this.renderKnowledge(split);
    scroll.scrollTop = this._keepScroll || 0;
  }

  renderCalendar(grid, events) {
    const { card, head } = this.card(grid, '日历', ICON_CALENDAR, 3, '', CANDY.taro, true);
    const today = todayStr();
    const horizon = new Date(new Date(today).getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const upcoming = events
      .filter(e => {
        const s = String(e.fm.start || '').slice(0, 10);
        const end = String(e.fm.end || e.fm.start || '').slice(0, 10);
        return s && s <= horizon && end >= today;
      })
      .sort((a, b) => String(a.fm.start).localeCompare(String(b.fm.start)))
      .slice(0, 6);
    if (upcoming.length) head.createSpan({ cls: 'obos-card-sub', text: `${upcoming.length} 项` });
    const mtabs = head.createDiv({ cls: 'obos-tabs' });
    const mkMode = (id, label) => {
      const b = mtabs.createEl('button', { cls: `obos-tab ${this.calMode === id ? 'on' : ''}`, text: label });
      b.onclick = () => { this.calMode = id; this.render(); };
    };
    mkMode('list', '列表');
    mkMode('month', '月历');
    mtabs.children[0].style.setProperty('--pc', CANDY.taro);
    mtabs.children[1].style.setProperty('--pc', CANDY.sky);
    const addBtn = head.createEl('button', { cls: 'obos-head-add', text: '＋', attr: { 'aria-label': '新建日程' } });
    addBtn.onclick = () => { this.addingEvent = true; this.editingEvent = null; this.render(); };

    const list = card.createDiv({ cls: 'obos-cal-list' });
    if (this.addingEvent) this.renderEventEditor(list, null);
    if (this.calMode === 'month') { this.renderCalMonth(list, events); return; }
    if (!upcoming.length && !this.addingEvent) {
      list.createDiv({ cls: 'obos-empty', text: '未来 7 天没有安排，点右上 ＋ 新建。' });
      return;
    }
    let lastDay = '';
    for (const e of upcoming) {
      if (this.editingEvent === e.file.path) { this.renderEventEditor(list, e); lastDay = ''; continue; }
      const s = String(e.fm.start || '');
      const day = s.slice(0, 10);
      if (day !== lastDay) {
        lastDay = day;
        list.createDiv({ cls: `obos-cal-day ${day === today ? 'is-today' : ''}`, text: dayLabel(day) });
      }
      const row = list.createDiv({ cls: 'obos-cal-event', attr: { tabindex: '0', role: 'button', title: '点击编辑' } });
      const edit = () => { this.editingEvent = e.file.path; this.addingEvent = false; this.render(); };
      row.onclick = edit;
      row.onkeydown = ev => { if (ev.key === 'Enter') edit(); };
      row.createDiv({ cls: 'obos-cal-time', text: s.length > 10 ? s.slice(11, 16) : '全天' });
      const bodyEl = row.createDiv({ cls: 'obos-cal-body' });
      bodyEl.createDiv({ cls: 'obos-cal-title', text: e.fm.title || e.file.basename });
      const end = String(e.fm.end || '');
      const sub = [];
      if (s.length > 10 && end.length > 10 && end.slice(0, 10) === day) sub.push(`至 ${end.slice(11, 16)}`);
      if (e.fm.location) sub.push(String(e.fm.location));
      if (sub.length) bodyEl.createDiv({ cls: 'obos-cal-sub', text: sub.join(' · ') });
      const del = row.createEl('button', { cls: 'obos-row-del', text: '×', attr: { 'aria-label': '删除日程' } });
      del.onclick = async ev => {
        ev.stopPropagation();
        await this.app.vault.trash(e.file, true);
        new Notice('已删除日程');
      };
    }
  }

  /* 月历视图：整月网格 + 选中日安排 */
  renderCalMonth(list, events) {
    if (!this.calCursor) { const n = new Date(); this.calCursor = { y: n.getFullYear(), m: n.getMonth() }; }
    const { y, m } = this.calCursor;
    const byDay = {};
    for (const e of events) {
      const d = String(e.fm.start || '').slice(0, 10);
      if (d) (byDay[d] = byDay[d] || []).push(e);
    }
    const nav = list.createDiv({ cls: 'obos-calm-nav' });
    const prev = nav.createEl('button', { cls: 'obos-dp-nav', text: '‹' });
    nav.createSpan({ cls: 'obos-calm-title', text: `${y} 年 ${m + 1} 月` });
    const next = nav.createEl('button', { cls: 'obos-dp-nav', text: '›' });
    prev.onclick = () => { this.calCursor = m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }; this.render(); };
    next.onclick = () => { this.calCursor = m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }; this.render(); };
    const week = list.createDiv({ cls: 'obos-dp-week' });
    for (const w of ['日', '一', '二', '三', '四', '五', '六']) week.createSpan({ text: w });
    const grid = list.createDiv({ cls: 'obos-calm-grid' });
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const todayS = todayStr();
    const sel = this.calSelected || todayS;
    for (let i = 0; i < first; i++) grid.createSpan();
    for (let d = 1; d <= days; d++) {
      const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const evs = byDay[iso] || [];
      const cell = grid.createEl('button', { cls: `obos-calm-day ${iso === todayS ? 'today' : ''} ${iso === sel ? 'sel' : ''}` });
      cell.createSpan({ cls: 'd', text: String(d) });
      if (evs.length) {
        const dots = cell.createDiv({ cls: 'dots' });
        evs.slice(0, 3).forEach((_, i2) => {
          const dot = dots.createSpan({ cls: 'dot' });
          dot.style.background = SHARE_HUES[i2 % SHARE_HUES.length];
        });
      }
      cell.onclick = () => { this.calSelected = iso; this.render(); };
    }
    const dayList = list.createDiv({ cls: 'obos-calm-daylist' });
    dayList.createDiv({ cls: 'obos-cal-day is-today', text: `${sel.slice(5).replace('-', '/')} 的安排` });
    const evs = (byDay[sel] || []).sort((a, b) => String(a.fm.start).localeCompare(String(b.fm.start)));
    if (!evs.length) dayList.createDiv({ cls: 'obos-empty', text: '这天没有安排，点右上 ＋ 新建。' });
    for (const e of evs) {
      if (this.editingEvent === e.file.path) { this.renderEventEditor(dayList, e); continue; }
      const s = String(e.fm.start || '');
      const row = dayList.createDiv({ cls: 'obos-cal-event', attr: { tabindex: '0', role: 'button', title: '点击编辑' } });
      const edit = () => { this.editingEvent = e.file.path; this.addingEvent = false; this.render(); };
      row.onclick = edit;
      row.onkeydown = ev2 => { if (ev2.key === 'Enter') edit(); };
      row.createDiv({ cls: 'obos-cal-time', text: s.length > 10 ? s.slice(11, 16) : '全天' });
      const bodyEl = row.createDiv({ cls: 'obos-cal-body' });
      bodyEl.createDiv({ cls: 'obos-cal-title', text: e.fm.title || e.file.basename });
      const del = row.createEl('button', { cls: 'obos-row-del', text: '×', attr: { 'aria-label': '删除日程' } });
      del.onclick = async ev2 => { ev2.stopPropagation(); await this.app.vault.trash(e.file, true); new Notice('已删除日程'); };
    }
  }

  renderEventEditor(list, ev) {
    const row = list.createDiv({ cls: 'obos-edit-row' });
    const s = ev ? String(ev.fm.start || '') : '';
    const e0 = ev ? String(ev.fm.end || '') : '';
    const title = row.createEl('input', {
      cls: 'obos-edit-title',
      attr: { type: 'text', placeholder: '事件名', value: ev ? (ev.fm.title || ev.file.basename) : '' },
    });
    const date = row.createEl('input', { cls: 'obos-date', attr: { type: 'text', placeholder: '日期', value: s.slice(0, 10) || todayStr() } });
    const st = row.createEl('input', { cls: 'obos-date obos-time', attr: { type: 'text', placeholder: '开始', value: s.length > 10 ? s.slice(11, 16) : '' } });
    const et = row.createEl('input', { cls: 'obos-date obos-time', attr: { type: 'text', placeholder: '结束', value: e0.length > 10 ? e0.slice(11, 16) : '' } });
    attachCandyDate(date);
    attachCandyTime(st);
    attachCandyTime(et);
    const save = row.createEl('button', { cls: 'obos-mini-btn save', text: ev ? '保存' : '创建' });
    const cancel = row.createEl('button', { cls: 'obos-mini-btn', text: '取消' });
    const done = () => { this.addingEvent = false; this.editingEvent = null; this.render(); };
    const commit = async () => {
      const name = title.value.trim();
      if (!name) { new Notice('先填事件名'); return; }
      const startVal = st.value ? `${date.value}T${st.value}` : date.value;
      const endVal = et.value ? `${date.value}T${et.value}` : '';
      if (ev) {
        await this.setProp(ev.file, fm => { fm.title = name; fm.start = startVal; fm.end = endVal; });
        if (sanitizeFilename(name) !== ev.file.basename) {
          const dest = `${FOLDERS.calendar}/${sanitizeFilename(name)}.md`;
          if (!this.app.vault.getAbstractFileByPath(dest)) await this.app.fileManager.renameFile(ev.file, dest);
        }
      } else {
        const path = `${FOLDERS.calendar}/${sanitizeFilename(name)}.md`;
        if (this.app.vault.getAbstractFileByPath(path)) { new Notice('同名日程已存在'); return; }
        await this.app.vault.create(path,
          `---\ntype: event\ntitle: "${name.replace(/"/g, '')}"\nstart: ${startVal}\nend: ${endVal}\nlocation: ""\ncalendar_id: ""\nadded: ${todayStr()}\n---\n`);
        new Notice('已创建日程');
      }
      done();
    };
    save.onclick = commit;
    cancel.onclick = done;
    title.onkeydown = e2 => { if (e2.key === 'Enter') commit(); if (e2.key === 'Escape') done(); };
    if (!ev) title.focus();
  }

  /* v6.5 顶栏：左右分区——左（问候+金句+四统计块 2x2），右（功能区：天气 | 时间与按钮） */
  renderHeader(root, { tasks, events, articles, dramas }) {
    const bar = root.createDiv({ cls: 'obos-topbar obos-hero obos-in', attr: { style: '--i:0' } });

    /* —— 左栏 —— */
    const left = bar.createDiv({ cls: 'obos-hz-left' });
    const greetRow = left.createDiv({ cls: 'obos-hz-greetrow' });
    const mark = greetRow.createDiv({ cls: 'obos-hero-mark', attr: { 'aria-label': 'RuruOS · 中枢', title: 'RuruOS · 中枢' } });
    /* v7.1 徽记换用户定稿的果冻手账本 logo（crest.png 透明版，原图已抠底） */
    mark.createEl('img', {
      attr: { src: this.app.vault.adapter.getResourcePath('.obsidian/plugins/obos-home/crest.png'), alt: 'RuruOS' },
    });
    const greet = greetRow.createDiv({ cls: 'obos-hero-greet' });
    this._greetEl = greet.createDiv({ cls: 'obos-greet' });
    /* 名字行内编辑：委托挂容器上，时钟每秒重写 innerHTML 也不丢监听 */
    this._greetEl.addEventListener('click', e => {
      if (!e.target.closest('.obos-name') || this._editingName) return;
      this._editingName = true;
      const input = document.createElement('input');
      input.className = 'obos-name-input';
      input.value = this.plugin.getUserName();
      this._greetEl.empty();
      this._greetEl.appendChild(input);
      input.focus();
      input.select();
      const commit = () => {
        this.plugin.setUserName(input.value.trim() || 'Lulu');
        this._editingName = false;
        this.tickClock();
      };
      input.onblur = commit;
      input.onkeydown = ev => {
        if (ev.key === 'Enter') input.blur();
        if (ev.key === 'Escape') { input.value = this.plugin.getUserName(); input.blur(); }
      };
    });
    /* A案·金句右置（用户拍板）：金句挂问候行右端，右对齐放大，占掉原来的空白区 */
    const qrow = greetRow.createDiv({ cls: 'obos-quote' });
    this._quoteText = qrow.createEl('q', { text: '' });
    this._quoteSrc = qrow.createSpan({ cls: 'src', text: '' });

    /* 底部双列：四统计块 2x2（收窄）| 今日卡（继续阅读+今日安排） */
    const bottom = left.createDiv({ cls: 'obos-hz-bottom' });
    const stats = bottom.createDiv({ cls: 'obos-hero-stats' });
    const findCard = title => {
      for (const el of this.contentEl.querySelectorAll('.obos-card-title'))
        if (el.textContent.includes(title)) return el.closest('.obos-card');
      return null;
    };
    const tile = (label, n, rows, color, target) => {
      const t = stats.createEl('button', { cls: 'obos-stat-tile' });
      t.style.setProperty('--sc', color);
      t.createDiv({ cls: 'obos-stat-num', text: String(n) });
      const col = t.createDiv({ cls: 'obos-stat-col' });
      const head = col.createDiv({ cls: 'obos-stat-head' });
      head.createSpan({ cls: 'obos-stat-dot' });
      head.createSpan({ text: label });
      const rowsEl = col.createDiv({ cls: 'obos-stat-rows' });
      for (const [txt, dim] of rows) {
        const r = rowsEl.createDiv({ cls: 'obos-stat-row' + (dim ? ' dim' : '') });
        r.createEl('i');
        r.createSpan({ text: txt });
      }
      t.createSpan({ cls: 'obos-stat-go', text: '›' });
      t.onclick = () => {
        const el = target();
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    };
    const undone = tasks.filter(t => !t.fm.done);
    const doneN = tasks.length - undone.length;
    const unread = articles.filter(a => a.fm.status !== 'read')
      .sort((a, b) => String(b.fm.added || '').localeCompare(String(a.fm.added || '')));
    const triage = dramas.filter(x => x.fm.status === '待定');
    const watching = dramas.filter(x => x.fm.status === '在追');
    const twoRows = (arr, alt, altDim) => {
      const rows = arr.slice(0, 2).map(x => [String(x.fm.title || ''), false]);
      if (!rows.length) rows.push([alt, false]);
      if (rows.length < 2) rows.push([altDim, true]);
      return rows;
    };
    tile('待办', undone.length, twoRows(undone, '全部清空啦，好耶', `已完成 ${doneN} 项 · 点击查看`), CANDY.mint, () => findCard('待办'));
    tile('未读', unread.length, twoRows(unread, '都读完啦', 'Mia 抓到新文章会先到这里'), CANDY.berry, () => findCard('待读文章'));
    tile('待归类', triage.length, twoRows(triage, '没有待归类的剧', '发观影文章给 Mia 自动入库'), CANDY.butter, () => this.contentEl.querySelector('.obos-wide'));
    tile('在追', watching.length, twoRows(watching, '去追剧墙挑一部嘛', '豆瓣 / IMDb 评分墙上见'), CANDY.sky, () => this.contentEl.querySelector('.obos-wide'));

    /* 一周热力柱（A 案拍板）：当天读完文章数 + 完成待办数，今天在最右发光 */
    const heat = bottom.createDiv({ cls: 'obos-hz-today obos-heat' });
    heat.createDiv({ cls: 'obos-today-kick', text: '本周热力' });
    const dayKeys = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      dayKeys.push([`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, '日一二三四五六'[d.getDay()]]);
    }
    const counts = dayKeys.map(([k]) => [
      articles.filter(a => String(a.fm.read_at || '') === k).length,
      tasks.filter(t => String(t.fm.done_at || '') === k).length,
    ]);
    const maxV = Math.max(1, ...counts.map(([r, d]) => r + d));
    const heatColor = v => v === 0 ? 'var(--frost)' : v <= 2 ? 'var(--mint)' : v <= 4 ? 'var(--butter)' : 'var(--berry)';
    const barsEl = heat.createDiv({ cls: 'obos-heat-bars' });
    counts.forEach(([r, d], i) => {
      const v = r + d;
      const col = barsEl.createDiv({
        cls: 'obos-heat-col' + (i === 6 ? ' today' : ''),
        attr: { title: `${dayKeys[i][0].slice(5)}：读完 ${r} 篇 · 完成 ${d} 事` },
      });
      const stick = col.createDiv({ cls: 'obos-heat-stick' + (v ? '' : ' zero') });
      stick.style.setProperty('--v', (v ? Math.round(v / maxV * 100) : 0) + '%');
      stick.style.setProperty('--c', heatColor(v));
      stick.style.setProperty('--i', String(i));
      col.createSpan({ cls: 'd', text: dayKeys[i][1] });
    });
    const weekReads = counts.reduce((n, [r]) => n + r, 0);
    const weekDones = counts.reduce((n, [, d]) => n + d, 0);
    heat.createDiv({ cls: 'obos-heat-sum', text: `本周读完 ${weekReads} 篇 · 完成 ${weekDones} 件事` });

    /* —— 右栏功能区：左天气列 | 右时间列 —— */
    const right = bar.createDiv({ cls: 'obos-hz-right' });
    const wxcol = right.createDiv({ cls: 'obos-hz-wxcol' });
    this.renderWeather(wxcol);
    const timecol = right.createDiv({ cls: 'obos-hz-timecol' });
    this._clockEl = timecol.createDiv({ cls: 'obos-ds-time' });
    /* v7.7 B改良版·暖糖渐变（用户拍板②）：日期+阴历渐变大字+建除章一行，宜忌双签一行，顶底对齐天气列 */
    const chip = timecol.createDiv({ cls: 'obos-hz-datechip' });
    this._dateEl = chip.createDiv({ cls: 'obos-ds-date' });
    this._lunarEl = chip.createSpan({ cls: 'obos-lunar-big' });
    this._partEl = chip.createSpan({ cls: 'obos-ds-part' });
    this._almanacEl = timecol.createDiv({ cls: 'obos-almanac' });
    const btns = timecol.createDiv({ cls: 'obos-hz-btns' });
    const syncBtn = btns.createEl('button', { cls: 'obos-round', attr: { title: '与苹果提醒/日历同步', 'aria-label': '同步' } });
    syncBtn.innerHTML = ICON_SYNC_BTN;
    syncBtn.style.setProperty('--bc', CANDY.sky);
    syncBtn.onclick = () => this.plugin.runSync(true);
    this._pops = [];
    this.buildFxPop(btns);
    this.buildThemePop(btns);

    this.tickClock();
    this.renderQuote(false);
  }

  /* v6.5 天气：裸放动画当主角 + 温度冷热渐变 + 体感/湿度/降水三格 */
  /* v6.9 抖动修复：缓存新鲜时同步渲染。此前每次全量重渲染都先画一帧矮的「加载中」
     再换成高的完整卡，顶栏高度弹一下、滚动条跟着出/收——就是「界面一会儿大一会儿小」的根因 */
  async renderWeather(el) {
    let wx = this.plugin.freshWeather();
    if (!wx) {
      el.createDiv({ cls: 'obos-wx-loading', text: '天气加载中…' });
      try { wx = await this.plugin.fetchWeather(); } catch (e) {
        console.error('天气加载失败', e);
        if (el.isConnected) { el.empty(); el.createDiv({ cls: 'obos-wx-loading', text: '天气加载失败' }); }
        return;
      }
      if (!el.isConnected) return;
      el.empty();
    }
    const cur = wx.current;
    const [mode, desc] = wmoInfo(cur.weather_code);
    const t = Math.round(cur.temperature_2m);
    /* 场景=自包含模块：布局全走 styles.css 的 [data-w] 规则，这里只搭结构不写坐标 */
    const row = el.createDiv({ cls: 'obos-wxrow' });
    const scene = row.createDiv({ cls: 'obos-scene', attr: { 'data-w': mode } });
    const inner = scene.createDiv({ cls: 'obos-scene-inner' });
    if (mode === 'sun' || mode === 'cloud') {
      const sun = inner.createDiv({ cls: 'obos-wsun-unit' });
      sun.createDiv({ cls: 'obos-wray' });
      sun.createDiv({ cls: 'obos-wsun' });
    }
    inner.createDiv({ cls: 'obos-wcloud obos-wc-main' });
    if (mode !== 'sun') inner.createDiv({ cls: 'obos-wcloud obos-wc-side' });
    if (mode === 'rain') for (let i = 0; i < 6; i++) inner.createEl('span', { cls: 'obos-wdrop', attr: { style: `--x:${36 + i * 16}px; --dl:${(i * 0.2).toFixed(2)}s` } });
    if (mode === 'snow') for (let i = 0; i < 5; i++) inner.createEl('span', { cls: 'obos-wflake', attr: { style: `--x:${38 + i * 17}px; --dl:${(i * 0.5).toFixed(2)}s` } });
    const temp = row.createDiv({ cls: 'obos-wxtemp' });
    const [g1, g2] = tempGrad(t);
    temp.style.setProperty('--t1', g1);
    temp.style.setProperty('--t2', g2);
    temp.createSpan({ text: String(t) });
    temp.createSpan({ cls: 'u', text: '°C' });
    const dr = el.createDiv({ cls: 'obos-wxdesc' });
    dr.createEl('b', { text: desc });
    dr.createSpan({ text: '东京 · 丰岛区' });
    const facts = el.createDiv({ cls: 'obos-wxfacts' });
    const fact = (k, v) => {
      const f = facts.createDiv({ cls: 'obos-wx-h' });
      f.createSpan({ text: k });
      f.createEl('b', { text: v });
    };
    fact('体感', `${Math.round(cur.apparent_temperature)}°`);
    fact('湿度', `${cur.relative_humidity_2m}%`);
    const pp = wx.hourly && wx.hourly.precipitation_probability ? wx.hourly.precipitation_probability[0] : null;
    fact('降水', pp === null || pp === undefined ? '—' : `${pp}%`);
  }

  /* 时钟每秒走，问候与时辰章随小时切换 */
  tickClock() {
    if (!this._clockEl || !this._clockEl.isConnected) return;
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
    this._clockEl.innerHTML = `${hh}<span class="obos-colon">:</span>${mm}`;
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
    this._dateEl.setText(`${d.getMonth() + 1}月${d.getDate()}日 · ${week}`);
    const h = d.getHours();
    const part = h < 5 ? '深夜巡航' : h < 9 ? '清晨拾光' : h < 13 ? '上午冲刺' : h < 17 ? '午后小憩' : h < 21 ? '黄昏散步' : '夜色温柔';
    /* v7.4：时辰章改显阴历，宜忌行跟随（按日缓存，不每秒重算） */
    const dayKey = d.toDateString();
    if (this._lunarKey !== dayKey) {
      this._lunarKey = dayKey;
      this._lunar = lunarToday(d);
    }
    if (this._lunar) {
      if (this._lunarEl) this._lunarEl.setText(this._lunar.text);
      this._partEl.setText(this._lunar.god + '日');
      if (this._almanacEl) this._almanacEl.innerHTML =
        `<div class="yj yi"><b>宜</b><span>${this._lunar.yi.replace(' ', ' · ')}</span></div>`
        + `<div class="yj ji"><b>忌</b><span>${this._lunar.ji.replace(' ', ' · ')}</span></div>`;
    } else {
      this._partEl.setText(part);
    }
    if (this._editingName) return; /* 名字编辑中不重写问候行 */
    const name = this.plugin.getUserName().replace(/[<>&"]/g, '');
    /* v7.0 B案·大字名牌：小字时段问候 + 名字大号糖果渐变字 */
    const mark = h >= 5 && h < 17 ? '☀︎' : '☾';
    this._greetEl.innerHTML = `<span class="obos-hello">${greeting()} ${mark} ${part}</span><span class="obos-name" title="点击改称呼">${name}</span>`;
  }

  /* 句子精选：读 90-System/句子精选.md（句子｜出处 一行一条），5 分钟自动换 */
  async loadQuotes() {
    if (this._quotes) return this._quotes;
    this._quotes = [];
    const f = this.app.vault.getAbstractFileByPath('90-System/句子精选.md');
    if (f instanceof TFile) {
      const raw = await this.app.vault.cachedRead(f);
      for (const line of raw.split('\n')) {
        const m = line.trim();
        if (!m || m.startsWith('#') || m.startsWith('---') || m.startsWith('>') || !m.includes('｜')) continue;
        const i = m.lastIndexOf('｜');
        this._quotes.push([m.slice(0, i), m.slice(i + 1)]);
      }
    }
    if (!this._quotes.length) this._quotes = [['一定要爱着点什么，恰似草木对光阴的钟情。', '汪曾祺']];
    return this._quotes;
  }

  async renderQuote(advance) {
    const qs = await this.loadQuotes();
    if (this._qi === undefined) this._qi = Math.floor(Math.random() * qs.length);
    else if (advance) this._qi = (this._qi + 1) % qs.length;
    const [text, src] = qs[this._qi];
    if (this._quoteText && this._quoteText.isConnected) {
      this._quoteText.setText(text);
      this._quoteSrc.setText('—— ' + src);
    }
  }

  nextQuote() { this.renderQuote(true); }

  /* ===== 弹出面板骨架：调节项多于两个不裸摆，收进一颗圆钮 ===== */
  closePops() {
    this._openPop = null;
    (this._pops || []).forEach(([pop, btn]) => { pop.addClass('hidden'); btn.removeClass('open'); });
  }

  makePop(bar, key, icon, label, color) {
    const wrap = bar.createDiv({ cls: 'obos-pop-wrap' });
    const btn = wrap.createEl('button', { cls: 'obos-round', attr: { 'aria-label': label, title: label } });
    btn.innerHTML = icon; /* v6.9c 起图标一律传 SVG */
    if (color) btn.style.setProperty('--bc', color);
    const pop = wrap.createDiv({ cls: 'obos-pop hidden' });
    pop.onclick = e => e.stopPropagation();
    btn.onclick = e => {
      e.stopPropagation();
      const show = pop.hasClass('hidden');
      this.closePops();
      if (show) { pop.removeClass('hidden'); btn.addClass('open'); this._openPop = key; }
    };
    this._pops.push([pop, btn]);
    /* 重渲染后恢复展开状态（调字号/换主题时面板不弹回） */
    if (this._openPop === key) { pop.removeClass('hidden'); btn.addClass('open'); }
    return pop;
  }

  popRow(pop, label, min, max, val, fmt, onInput) {
    const row = pop.createDiv({ cls: 'obos-pop-row' });
    row.createEl('label', { text: label });
    const r = row.createEl('input', { attr: { type: 'range', min, max, value: val } });
    const v = row.createSpan({ cls: 'v', text: fmt(val) });
    r.oninput = () => { const x = +r.value; v.setText(fmt(x)); onInput(x); };
  }

  buildFxPop(bar) {
    const pop = this.makePop(bar, 'fx', ICON_FX_BTN, '桌面动效', CANDY.berry);
    pop.createDiv({ cls: 'obos-pop-title', text: '桌面动效' });
    const fx = this.plugin.getFx();
    const modes = pop.createDiv({ cls: 'obos-pop-modes' });
    for (const [id, label] of FX_MODES) {
      const b = modes.createEl('button', { cls: `obos-tab ${fx.mode === id ? 'on' : ''}`, text: label });
      b.onclick = () => {
        this.plugin.setFx({ mode: id });
        modes.querySelectorAll('.obos-tab').forEach(x => x.toggleClass('on', x === b));
        this.plugin.mountFx(this.contentEl);
      };
    }
    const remount = () => this.plugin.mountFx(this.contentEl);
    const layerVar = (k, v) => {
      const l = this.contentEl.querySelector(':scope > .obos-fxlayer');
      if (l) l.style.setProperty(k, String(v));
    };
    this.popRow(pop, '速度', 50, 220, Math.round(fx.speed * 100), v => v + '%', v => { this.plugin.setFx({ speed: v / 100 }); remount(); });
    this.popRow(pop, '数量', 30, 220, Math.round(fx.count * 100), v => v + '%', v => { this.plugin.setFx({ count: v / 100 }); remount(); });
    this.popRow(pop, '大小', 60, 170, Math.round(fx.size * 100), v => v + '%', v => { this.plugin.setFx({ size: v / 100 }); remount(); });
    this.popRow(pop, '方向', -45, 45, Math.round(fx.angle), v => v + '°', v => { this.plugin.setFx({ angle: v }); remount(); });
    /* 饱和/可见是层级变量，就地改零闪烁 */
    this.popRow(pop, '饱和', 30, 200, Math.round(fx.sat * 100), v => v + '%', v => { this.plugin.setFx({ sat: v / 100 }); layerVar('--fxsat', v / 100); });
    this.popRow(pop, '可见', 30, 200, Math.round(fx.vis * 100), v => v + '%', v => { this.plugin.setFx({ vis: v / 100 }); layerVar('--fxvis', v / 100); });
    const foot = pop.createDiv({ cls: 'obos-pop-foot' });
    const reset = foot.createEl('button', { cls: 'obos-tab', text: '恢复默认' });
    reset.onclick = () => {
      this.plugin.setFx(Object.assign({}, FX_DEFAULT, { mode: this.plugin.getFx().mode }));
      this.render(); /* 重建面板回写滑杆值，_openPop 保持展开 */
    };
  }

  buildThemePop(bar) {
    const pop = this.makePop(bar, 'theme', ICON_THEME_BTN, '主题与字号', CANDY.butter);
    pop.createDiv({ cls: 'obos-pop-title', text: '主题与字号' });
    const cur = this.plugin.getTheme();
    const hueSaved = this.plugin.getCustomHue();
    const sw = pop.createDiv({ cls: 'obos-swatches' });
    for (const name of THEME_NAMES) {
      const b = sw.createEl('button', {
        cls: `obos-swatch ${cur === name && hueSaved === null ? 'on' : ''}`,
        attr: { 'aria-label': THEME_LABELS[name], title: THEME_LABELS[name] },
      });
      b.style.setProperty('--sw', THEME_SWATCH[name]);
      b.onclick = () => this.plugin.setTheme(name);
    }
    const applyCustomBg = () => {
      const dark = DARK_THEMES.includes(this.plugin.getTheme());
      const h = this.plugin.getCustomHue();
      const sv = this.plugin.getCustomSat();
      const hh = h === null ? 300 : h;
      const ss = sv === null ? (dark ? 42 : 48) : sv;
      this.contentEl.style.setProperty('--bg', dark ? `hsl(${hh} ${ss}% 24%)` : `hsl(${hh} ${ss}% 94%)`);
      sw.querySelectorAll('.obos-swatch').forEach(x => x.removeClass('on'));
    };
    const satSaved = this.plugin.getCustomSat();
    this.popRow(pop, '色相', 0, 360, hueSaved === null ? 35 : hueSaved, v => v + '°', v => { this.plugin.setCustomHue(v, true); applyCustomBg(); });
    this.popRow(pop, '饱和', 0, 100, satSaved === null ? 45 : satSaved, v => v + '%', v => { this.plugin.setCustomSat(v, true); applyCustomBg(); });
    const fsRow = pop.createDiv({ cls: 'obos-pop-row' });
    fsRow.createEl('label', { text: '字号' });
    const dec = fsRow.createEl('button', { cls: 'obos-tab', text: 'A−' });
    fsRow.createSpan({ cls: 'v', text: this.plugin.getUiScale() + '%' });
    const inc = fsRow.createEl('button', { cls: 'obos-tab', text: 'A＋' });
    dec.onclick = () => this.plugin.setUiScale(this.plugin.getUiScale() - 5);
    inc.onclick = () => this.plugin.setUiScale(this.plugin.getUiScale() + 5);
  }

  card(parent, title, iconSvg, idx, extraCls, color, twinkle) {
    const c = parent.createDiv({ cls: `obos-card obos-in ${extraCls || ''}`, attr: { style: `--i:${idx}` } });
    attachSweep(c);
    if (twinkle) {
      const tw = c.createDiv({ cls: 'obos-twinkle' });
      tw.style.setProperty('--td', `${(idx % 5) * 0.6}s`);
      tw.innerHTML = sparkleSVG(color, 12);
    }
    const head = c.createDiv({ cls: 'obos-card-head' });
    head.style.setProperty('--cc', color);
    const badge = head.createDiv({ cls: 'obos-chead-badge' });
    badge.innerHTML = iconSvg;
    head.createSpan({ cls: 'obos-card-title', text: title });
    return { card: c, head };
  }

  renderTasks(grid, tasks) {
    const { card, head } = this.card(grid, '待办', ICON_TASK, 2, '', CANDY.mint, true);
    const kindRank = k => ({ '紧急': 0, '长期': 2 }[k] ?? 1);
    head.createSpan({ cls: 'obos-card-sub', text: `${tasks.filter(t => !t.fm.done).length} 项进行中` });
    const open = tasks.filter(t => !t.fm.done)
      .sort((a, b) => kindRank(a.fm.kind) - kindRank(b.fm.kind)
        || String(a.fm.due || '9999').localeCompare(String(b.fm.due || '9999')));
    const doneCount = tasks.length - open.length;
    const ttabs = head.createDiv({ cls: 'obos-tabs' });
    const mkTTab = (id, label) => {
      const b = ttabs.createEl('button', { cls: `obos-tab ${this.taskTab === id ? 'on' : ''}`, text: label });
      b.onclick = () => { this.taskTab = id; this.render(); };
    };
    mkTTab('open', `进行中 ${open.length}`);
    mkTTab('done', `已完成 ${doneCount}`);
    ttabs.children[0].style.setProperty('--pc', CANDY.mint);
    ttabs.children[1].style.setProperty('--pc', CANDY.peach);

    const list = card.createDiv({ cls: 'obos-task-list' });
    if (this.taskTab === 'done') {
      const doneTasks = tasks.filter(x => x.fm.done);
      if (!doneTasks.length) list.createDiv({ cls: 'obos-empty', text: '还没有已完成的待办。' });
      for (const dt of doneTasks) {
        const row = list.createDiv({ cls: 'obos-task' });
        const box = row.createDiv({ cls: 'obos-check obos-check-on', attr: { role: 'checkbox', 'aria-checked': 'true', tabindex: '0', title: '点一下恢复为进行中' } });
        box.innerHTML = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#1e4736" stroke-width="2.4" stroke-linecap="round"><path d="M2 6.2 L4.8 9 L10 3.4"/></svg>';
        box.onclick = async () => { await this.setProp(dt.file, fm => { fm.done = false; fm.done_at = ''; }); };
        const dbody = row.createDiv({ cls: 'obos-task-body' });
        dbody.createDiv({ cls: 'obos-task-title obos-done-line', text: dt.fm.title || dt.file.basename });
        const dmeta = row.createDiv({ cls: 'obos-task-meta' });
        if (dt.fm.due) dmeta.createSpan({ cls: 'obos-due', text: String(dt.fm.due).slice(5).replace('-', '/') });
        const ddel = row.createEl('button', { cls: 'obos-row-del', text: '×', attr: { 'aria-label': '删除' } });
        ddel.onclick = async e => { e.stopPropagation(); await this.app.vault.trash(dt.file, true); new Notice('已删除'); };
      }
      return;
    }
    if (!open.length) list.createDiv({ cls: 'obos-empty', text: '全部清空了，输入下方新建一条。' });
    for (const t of open) {
      if (this.editingTask === t.file.path) { this.renderTaskEditor(list, t); continue; }
      const row = list.createDiv({ cls: 'obos-task' });
      const box = row.createDiv({ cls: 'obos-check', attr: { role: 'checkbox', 'aria-checked': 'false', tabindex: '0' } });
      box.innerHTML = checkSVG();
      const complete = async () => {
        if (box.hasClass('obos-check-on')) return;
        box.addClass('obos-check-on');
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const colors = ['#ff8fab', '#ffd66b', '#6fd8b4', '#7db8f7', '#b9a5f5', '#ffab76'];
          for (let i = 0; i < 7; i++) {
            const b = box.createSpan({ cls: 'obos-burst' });
            b.style.background = colors[i % colors.length];
            const ang = (i / 7) * Math.PI * 2;
            b.style.setProperty('--bx', `${Math.cos(ang) * 26}px`);
            b.style.setProperty('--by', `${Math.sin(ang) * 26}px`);
            window.setTimeout(() => b.remove(), 650);
          }
        }
        row.addClass('obos-task-done');
        window.setTimeout(async () => { await this.setProp(t.file, fm => { fm.done = true; fm.done_at = todayStr(); }); }, 420);
      };
      box.onclick = complete;
      box.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); complete(); } };
      const body = row.createDiv({ cls: 'obos-task-body', attr: { title: '点击编辑' } });
      body.createDiv({ cls: 'obos-task-title', text: t.fm.title || t.file.basename });
      body.onclick = () => { this.editingTask = t.file.path; this.render(); };
      const meta = row.createDiv({ cls: 'obos-task-meta' });
      if (t.fm.kind === '紧急') meta.createSpan({ cls: 'obos-kind urgent', text: '紧急' });
      else if (t.fm.kind === '长期') meta.createSpan({ cls: 'obos-kind longterm', text: '长期' });
      const dl = dueLabel(t.fm.due);
      if (dl) meta.createSpan({ cls: `obos-due ${dl.cls}`, text: dl.text });
      if (t.fm.priority === '高') meta.createSpan({ cls: 'obos-pri-high', text: '高' });
      const del = row.createEl('button', { cls: 'obos-row-del', text: '×', attr: { 'aria-label': '删除待办' } });
      del.onclick = async e => {
        e.stopPropagation();
        await this.app.vault.trash(t.file, true);
        new Notice('已删除待办');
      };
    }

    const addWrap = card.createDiv({ cls: 'obos-task-add' });
    const input = addWrap.createEl('input', { cls: 'obos-add-title', attr: { placeholder: '＋ 新待办', type: 'text' } });
    const dueIn = addWrap.createEl('input', { cls: 'obos-date', attr: { type: 'text', placeholder: '截止日期', 'aria-label': '截止日期' } });
    attachCandyDate(dueIn);
    const kindPick = makeKindPicker(addWrap, '普通');
    const createTask = async () => {
      const title = input.value.trim();
      if (!title) { new Notice('先写点内容'); return; }
      const path = `${FOLDERS.tasks}/${sanitizeFilename(title)}.md`;
      if (this.app.vault.getAbstractFileByPath(path)) { new Notice('同名待办已存在'); return; }
      input.value = '';
      await this.app.vault.create(path,
        `---\ntype: task\ntitle: "${title.replace(/"/g, '')}"\ndue: ${dueIn.value || ''}\ndone: false\npriority: 中\nkind: ${kindPick.value()}\nreminder_id: ""\nadded: ${todayStr()}\n---\n`);
      new Notice('已创建待办');
    };
    input.onkeydown = e => { if (e.key === 'Enter') createTask(); };
    const addBtn = addWrap.createEl('button', { cls: 'obos-jelly obos-jc-mint obos-ai-btn', text: '添加' });
    addBtn.onclick = createTask;
    if (doneCount) card.createDiv({ cls: 'obos-done-note', text: `已完成 ${doneCount} 项` });
  }

  renderTaskEditor(list, t) {
    const row = list.createDiv({ cls: 'obos-edit-row' });
    const title = row.createEl('input', { cls: 'obos-edit-title', attr: { type: 'text', value: t.fm.title || t.file.basename } });
    const due = row.createEl('input', { cls: 'obos-date', attr: { type: 'text', placeholder: '截止日期', value: String(t.fm.due || '').slice(0, 10) } });
    attachCandyDate(due);
    const kindPick = makeKindPicker(row, t.fm.kind || '普通');
    const save = row.createEl('button', { cls: 'obos-mini-btn save', text: '保存' });
    const cancel = row.createEl('button', { cls: 'obos-mini-btn', text: '取消' });
    const done = () => { this.editingTask = null; this.render(); };
    const commit = async () => {
      const name = title.value.trim() || t.fm.title || t.file.basename;
      await this.setProp(t.file, fm => { fm.title = name; fm.due = due.value || ''; fm.kind = kindPick.value(); });
      if (sanitizeFilename(name) !== t.file.basename) {
        const dest = `${FOLDERS.tasks}/${sanitizeFilename(name)}.md`;
        if (!this.app.vault.getAbstractFileByPath(dest)) await this.app.fileManager.renameFile(t.file, dest);
      }
      done();
    };
    save.onclick = commit;
    cancel.onclick = done;
    title.onkeydown = e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') done(); };
    title.focus();
    title.select();
  }

  renderProjects(grid) {
    const { card, head } = this.card(grid, '项目', ICON_PROJECT, 4, '', CANDY.sky, true);
    let projects = [];
    try { projects = scanAllProjects(); } catch (e) { projects = []; }
    head.createSpan({ cls: 'obos-card-sub', text: `${projects.length} 个` });
    const list = card.createDiv({ cls: 'obos-proj-list' });
    if (!projects.length) { list.createDiv({ cls: 'obos-empty', text: PROJECTS_DIR ? `在 ${PROJECTS_DIR} 里建项目文件夹即可出现。` : '在 main.js 顶部「公开版配置区」填入你的代码目录路径，即可启用项目卡。' }); return; }
    for (const p of projects) {
      const row = list.createDiv({ cls: 'obos-proj', attr: { tabindex: '0', role: 'button' } });
      const open = () => this.openState(VIEW_PROJECT, { projectPath: p.dirPath });
      row.onclick = open;
      row.onkeydown = e => { if (e.key === 'Enter') open(); };
      row.createDiv({ cls: 'obos-proj-dot' });
      const body = row.createDiv({ cls: 'obos-proj-body' });
      body.createDiv({ cls: 'obos-proj-name', text: p.name });
      body.createDiv({ cls: 'obos-proj-meta', text: `${mtimeMMDD(p.latestMtime)} · ${p.files.length} 份 md` });
      row.createDiv({ cls: 'obos-proj-arrow', text: '›' });
    }
  }

  renderFinance(grid) {
    const { card, head } = this.card(grid, '账目', ICON_FINANCE, 5, '', CANDY.butter, true);
    const ledgers = this.collect(FOLDERS.finance, 'ledger')
      .filter(l => l.fm.status !== 'closed')
      .sort((a, b) => (Number(b.fm.total) || 0) - (Number(a.fm.total) || 0));
    head.createSpan({ cls: 'obos-card-sub', text: `${ledgers.length} 本账` });

    const list = card.createDiv({ cls: 'obos-fin-ledgers' });
    if (!ledgers.length) {
      list.createDiv({ cls: 'obos-empty', text: '把记账表格发给 Mia，账本和统计会自动出现在这里。' });
      return;
    }
    ledgers.forEach((l, i) => {
      const row = list.createDiv({ cls: 'obos-fin-ledger', attr: { tabindex: '0', role: 'button' } });
      const open = () => this.openInView(VIEW_LEDGER, l.file);
      row.onclick = open;
      row.onkeydown = e => { if (e.key === 'Enter') open(); };
      row.createDiv({ cls: 'obos-fin-dot' }).style.background = SHARE_HUES[i % SHARE_HUES.length];
      row.createDiv({ cls: 'obos-fin-ledger-name', text: String(l.fm.title || l.file.basename) });
      row.createDiv({
        cls: `obos-fin-ledger-total ${Number(l.fm.total) < 0 ? 'neg' : ''}`,
        text: fmtMoney(l.fm.total, l.fm.currency),
      });
    });

    /* 各账本构成的迷你色条（只算正数账本） */
    const totals = ledgers.map(l => Number(l.fm.total) || 0);
    const posSum = totals.filter(v => v > 0).reduce((a, b) => a + b, 0);
    if (posSum > 0 && totals.filter(v => v > 0).length > 1) {
      const bar = card.createDiv({ cls: 'obos-share-bar mini' });
      totals.forEach((v, i) => {
        if (v <= 0) return;
        const seg = bar.createDiv({ cls: 'obos-share-seg' });
        seg.style.background = SHARE_HUES[i % SHARE_HUES.length];
        seg.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => { seg.style.width = `${(v / posSum) * 100}%`; }));
      });
    }
  }

  async runClaudeTask(key, label, prompt) {
    if (!AI) { new Notice(NO_AI_MSG, 9000); return; }
    if (this.aiBusy[key]) return;
    this.aiBusy[key] = true;
    this.render();
    new Notice(`已启动 AI 后台任务（引擎 ${AI.name}，通常 1-3 分钟），完成会弹提示`, 8000);

    const basePath = this.app.vault.adapter.basePath;
    const env = Object.assign({}, process.env, {
      PATH: `${process.env.PATH || ''}:${require('os').homedir()}/.local/bin:/opt/homebrew/bin:/usr/local/bin`,
    });

    const finish = () => { this.aiBusy[key] = false; this.render(); };

    let child;
    try {
      child = spawn(AI.bin, AI.edit(prompt), {
        cwd: basePath,
        env,
      });
    } catch (e) {
      new Notice(`${label}启动失败：${e.message}`);
      console.error(e);
      finish();
      return;
    }

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => { stdout += d.toString(); });
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('error', err => {
      new Notice(`${label}启动失败：${err.message}`);
      console.error(err);
      finish();
    });
    child.on('close', code => {
      if (code === 0) {
        const lines = stdout.trim().split('\n').filter(Boolean);
        const msg = lines.length ? lines[lines.length - 1] : `${label}完成`;
        this.aiLast = `✓ ${msg}`;
        new Notice(msg, 12000);
      } else {
        this.aiLast = `✗ ${label}失败（退出码 ${code}），详情见控制台`;
        new Notice(`${label}失败（退出码 ${code}），详情见控制台`, 12000);
        console.error(stderr);
      }
      finish();
    });
  }

  renderArticles(parent, articles) {
    const { card, head } = this.card(parent, '待读文章', ICON_ARTICLE, 6, '', CANDY.berry, false);
    const unread = articles.filter(a => a.fm.status !== 'read');
    const read = articles.filter(a => a.fm.status === 'read');
    head.createSpan({ cls: 'obos-card-sub', text: `未读 ${unread.length} · 已读 ${read.length}` });

    const tabs = head.createDiv({ cls: 'obos-tabs' });
    const mkTab = (id, label) => {
      const b = tabs.createEl('button', { cls: `obos-tab ${this.articleTab === id ? 'on' : ''}`, text: label });
      b.onclick = () => { this.articleTab = id; this.render(); };
    };
    mkTab('unread', '待读');
    mkTab('read', '已读');
    tabs.children[0].style.setProperty('--pc', CANDY.berry);
    tabs.children[1].style.setProperty('--pc', CANDY.mint);

    const distillBtn = head.createEl('button', {
      cls: 'obos-jelly obos-jc-taro obos-ai-btn',
      text: this.aiBusy.distill ? 'AI 浓缩中…' : 'AI 浓缩',
    });
    distillBtn.disabled = this.aiBusy.distill;
    distillBtn.onclick = () => this.runClaudeTask('distill', 'AI 浓缩', DISTILL_PROMPT);

    const cleanBtn = head.createEl('button', {
      cls: 'obos-jelly obos-jc-peach obos-ai-btn',
      text: this.aiBusy.clean ? 'AI 清杂中…' : 'AI 清杂',
    });
    cleanBtn.disabled = this.aiBusy.clean;
    cleanBtn.onclick = () => this.runClaudeTask('clean', 'AI 清杂', CLEAN_PROMPT);
    if (this.aiLast) card.createDiv({ cls: 'obos-ai-status', text: this.aiLast });

    const pool = this.articleTab === 'unread' ? unread : read;
    const cats = ['all', ...new Set(articles.map(a => a.fm.category || '其他'))];
    const chips = card.createDiv({ cls: 'obos-chips' });
    for (const c of cats) {
      const n = c === 'all' ? pool.length : pool.filter(a => (a.fm.category || '其他') === c).length;
      const chip = chips.createEl('button', {
        cls: `obos-chip ${this.articleCat === c ? 'on' : ''}`,
        text: c === 'all' ? `全部 ${n}` : `${c} ${n}`,
      });
      if (this.articleCat === c) chip.style.setProperty('--chip', catColor(c));
      chip.onclick = () => { this.articleCat = c; this.render(); };
    }

    const list = card.createDiv({ cls: 'obos-art-list' });
    const shown = pool
      .filter(a => this.articleCat === 'all' || (a.fm.category || '其他') === this.articleCat)
      .sort((a, b) => String(b.fm.added || '').localeCompare(String(a.fm.added || '')));
    if (!shown.length) list.createDiv({ cls: 'obos-empty', text: this.articleTab === 'unread' ? '这个分类没有未读。' : '还没有已读记录。' });

    for (const a of shown) {
      const row = list.createDiv({ cls: 'obos-art' });
      const cat = a.fm.category || '其他';
      const tag = row.createDiv({ cls: 'obos-art-cat', text: cat });
      tag.style.setProperty('--chip', catColor(cat));
      const body = row.createDiv({ cls: 'obos-art-body', attr: { tabindex: '0', role: 'button' } });
      body.createDiv({ cls: 'obos-art-title', text: a.fm.title || a.file.basename });
      const src = SOURCE_NAMES[a.fm.source] || a.fm.source || '';
      body.createDiv({ cls: 'obos-art-meta', text: [a.fm.author, src, String(a.fm.added || '').slice(5)].filter(Boolean).join(' · ') });
      const openReader = () => this.openInView(VIEW_READER, a.file);
      body.onclick = openReader;
      body.onkeydown = e => { if (e.key === 'Enter') openReader(); };

      if (this.articleTab === 'unread') {
        const btn = row.createEl('button', { cls: 'obos-read-btn', text: '标记已读' });
        btn.onclick = async e => {
          e.stopPropagation();
          row.addClass('obos-art-fade');
          window.setTimeout(async () => {
            await this.setProp(a.file, fm => { fm.status = 'read'; fm.read_at = todayStr(); });
          }, 380);
        };
      } else {
        row.createDiv({ cls: 'obos-art-readat', text: String(a.fm.read_at || '').slice(5) });
      }
      const del = row.createEl('button', { cls: 'obos-row-del', text: '×', attr: { 'aria-label': '废弃文章' } });
      del.onclick = async e => {
        e.stopPropagation();
        await this.app.vault.trash(a.file, true);
        new Notice('文章已废弃');
      };
    }
  }

  renderKnowledge(parent) {
    const { card, head } = this.card(parent, '知识沉淀', ICON_KNOWLEDGE, 7, '', CANDY.sky, false);
    const notes = this.app.vault.getMarkdownFiles()
      .filter(f => f.path.startsWith('50-Knowledge/') && !f.path.includes('/_') && !f.basename.startsWith('_'))
      .sort((a, b) => b.stat.mtime - a.stat.mtime);
    head.createSpan({ cls: 'obos-card-sub', text: `${notes.length} 篇` });
    const list = card.createDiv({ cls: 'obos-know-list' });
    if (!notes.length) { list.createDiv({ cls: 'obos-empty', text: '读完的文章提炼后会沉淀到这里。' }); return; }
    for (const f of notes.slice(0, 8)) {
      const topic = f.path.split('/')[1] || '其他';
      const row = list.createDiv({ cls: 'obos-know', attr: { tabindex: '0', role: 'button' } });
      const open = () => this.openInView(VIEW_READER, f);
      row.onclick = open;
      row.onkeydown = e => { if (e.key === 'Enter') open(); };
      const chip = row.createDiv({ cls: 'obos-art-cat', text: topic });
      chip.style.setProperty('--chip', topicColor(topic));
      const body = row.createDiv({ cls: 'obos-know-body' });
      body.createDiv({ cls: 'obos-know-title', text: f.basename });
      row.createDiv({ cls: 'obos-know-date', text: new Date(f.stat.mtime).toISOString().slice(5, 10).replace('-', '/') });
    }
  }

  renderDramas(root, dramas) {
    const { card, head } = this.card(root, '追剧墙', ICON_DRAMA, 1, 'obos-wide', CANDY.berry, false);
    head.createSpan({ cls: 'obos-card-sub', text: `待归类 ${dramas.filter(d => d.fm.status === '待定').length} · 在追 ${dramas.filter(d => d.fm.status === '在追').length}` });
    const catDoodle = head.createDiv({ cls: 'obos-cat-doodle' });
    catDoodle.innerHTML = ICON_CAT_DOODLE;
    const addBtn = head.createEl('button', { cls: 'obos-jelly obos-jc-berry', text: '＋ 搜剧', attr: { title: '搜索一部剧，自动抓数据入库' } });
    addBtn.onclick = e => { e.stopPropagation(); this.showDramaSearch(); };
    const tabs = head.createDiv({ cls: 'obos-tabs' });
    for (const s of DRAMA_STATUSES) {
      const n = dramas.filter(d => d.fm.status === s).length;
      const b = tabs.createEl('button', {
        cls: `obos-tab ${this.dramaTab === s ? 'on' : ''} ${s === '待定' && n ? 'obos-tab-alert' : ''}`,
        text: n ? `${s} ${n}` : s,
      });
      b.style.setProperty('--pc', { '待定': CANDY.butter, '想看': CANDY.taro, '在追': CANDY.sky, '看完': CANDY.mint, '弃剧': CANDY.berry }[s] || CANDY.peach);
      b.onclick = () => { this.dramaTab = s; this.render(); };
    }

    const wall = card.createDiv({ cls: 'obos-wall' });
    /* 鼠标按住拖拽横滑；拖过 4px 即判定为拖动，期间屏蔽海报点击防误开详情 */
    let drag = null, hover = false, pauseUntil = 0;
    wall.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, left: wall.scrollLeft, moved: false };
    });
    wall.addEventListener('mousemove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; wall.addClass('dragging'); }
      if (drag.moved) { wall.scrollLeft = drag.left - dx; e.preventDefault(); }
    });
    const endDrag = () => {
      drag = null;
      pauseUntil = performance.now() + 3000; /* 手动拨过后歇 3 秒再自动走 */
      window.setTimeout(() => wall.removeClass('dragging'), 0);
    };
    wall.addEventListener('mouseup', endDrag);
    wall.addEventListener('mouseleave', () => { hover = false; endDrag(); });
    wall.addEventListener('mouseenter', () => { hover = true; });

    /* v6.9c：剧满一页自动慢速轮播——悬停/拖拽即停，到尾歇一拍平滑回头循环 */
    if (this._wallAutoRaf) window.cancelAnimationFrame(this._wallAutoRaf);
    const autoTick = () => {
      if (!wall.isConnected) { this._wallAutoRaf = null; return; }
      this._wallAutoRaf = window.requestAnimationFrame(autoTick);
      if (hover || drag || document.hidden) return;
      const max = wall.scrollWidth - wall.clientWidth;
      if (max <= 4) return; /* 没满一页不动 */
      const now = performance.now();
      if (now < pauseUntil) return;
      if (wall.scrollLeft >= max - 1) {
        pauseUntil = now + 2200;
        wall.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }
      wall.scrollLeft += 0.4;
    };
    this._wallAutoRaf = window.requestAnimationFrame(autoTick);

    const shown = dramas
      .filter(d => d.fm.status === this.dramaTab)
      .sort((a, b) => (b.fm.pinned ? 1 : 0) - (a.fm.pinned ? 1 : 0));
    if (!shown.length) {
      /* v7.3 空态重排：贴纸图标 + 主副句 + 行动钮（原先一行灰字贴着虚线框太寡淡） */
      const empty = wall.createDiv({ cls: 'obos-wall-empty' });
      const art = empty.createDiv({ cls: 'obos-empty-art' });
      art.innerHTML = ICON_EMPTY_WALL;
      empty.createDiv({
        cls: 'obos-empty-title',
        text: this.dramaTab === '待定' ? '这一格还空着' : `「${this.dramaTab}」还是空的`,
      });
      empty.createDiv({
        cls: 'obos-empty-sub',
        text: this.dramaTab === '待定' ? '搜一部剧马上入库，或发观影文章给 Mia 整理' : '去别的栏挑一部挪过来，或直接搜部新剧',
      });
      const eBtn = empty.createEl('button', { cls: 'obos-jelly obos-jc-berry', text: '＋ 搜剧添加' });
      eBtn.onclick = e => { e.stopPropagation(); this.showDramaSearch(); };
    }

    shown.forEach((d, i) => {
      const fm = d.fm;
      const total = Number(fm.episodes) || 0;
      const cur = Number(fm.current_episode) || 0;
      const pct = total > 0 ? Math.min(100, Math.round((cur / total) * 100)) : 0;
      const url = this.posterUrl(fm);

      const item = wall.createDiv({ cls: 'obos-poster obos-in', attr: { style: `--i:${i}` } });
      /* 浮雕手感：跟随鼠标的 3D 倾斜（替代单纯放大，用户拍板） */
      item.addEventListener('mousemove', e => {
        const r = item.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -14;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 14;
        item.style.transform = `perspective(700px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) translateY(-4px)`;
      });
      item.addEventListener('mouseleave', () => { item.style.transform = ''; });
      if (url) {
        const glow = item.createDiv({ cls: 'obos-poster-glow' });
        glow.style.backgroundImage = `url("${url}")`;
      }
      const frame = item.createDiv({ cls: 'obos-poster-frame' });
      if (url) frame.createEl('img', { attr: { src: url, alt: fm.title || d.file.basename, loading: 'lazy' } }).draggable = false;
      else frame.createDiv({ cls: 'obos-poster-blank', text: fm.title || d.file.basename });
      frame.setAttr('tabindex', '0'); frame.setAttr('role', 'button');
      const openDetail = () => this.openInView(VIEW_DRAMA, d.file);
      frame.onclick = openDetail;
      frame.onkeydown = e => { if (e.key === 'Enter') openDetail(); };

      if (fm.pinned) frame.createDiv({ cls: 'obos-poster-pin', text: '★', attr: { title: '已置顶' } });
      if (this.dramaTab === '待定') frame.createDiv({ cls: 'obos-poster-triage', text: '待归类' });

      if (this.dramaTab === '在追' && total > 0) {
        const ring = frame.createDiv({ cls: 'obos-ring' });
        ring.innerHTML =
          `<svg viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="15.9"/>` +
          `<circle class="fg" cx="18" cy="18" r="15.9" stroke-dasharray="${pct} 100"/></svg><span>${pct}</span>`;
        const plus = frame.createEl('button', { cls: 'obos-plus', text: '+1', attr: { 'aria-label': '看完一集' } });
        plus.onclick = async e => {
          e.stopPropagation();
          const next = cur + 1;
          if (next > total) return;
          await this.setProp(d.file, f => {
            f.current_episode = next;
            if (next >= total) f.status = '看完';
          });
          if (next >= total) new Notice(`《${fm.title}》完结 🎉`);
        };
      }

      const info = item.createDiv({ cls: 'obos-poster-info' });
      info.createDiv({ cls: 'obos-poster-title', text: fm.title || d.file.basename });
      const sub = [];
      if (cur > 0 && total > 0) sub.push(`第 ${cur} / ${total} 集`);
      else if (total > 0) sub.push(`${total} 集`);
      if (fm.platform) sub.push(Array.isArray(fm.platform) ? fm.platform[0] : fm.platform);
      info.createDiv({ cls: 'obos-poster-sub', text: sub.join(' · ') });

      /* 墙上放豆瓣/IMDb 迷你品牌徽章，个人评分在详情页打 */
      const er = fm.external_rating || {};
      const rateRow = info.createDiv({ cls: 'obos-poster-rate' });
      const mini = (cls, name, val) => {
        const s = rateRow.createSpan({ cls: `obos-score-mini ${cls}${val ? '' : ' empty'}` });
        s.createSpan({ cls: 'n', text: name });
        s.createSpan({ cls: 'v', text: val ? String(val) : '—' });
      };
      mini('douban', '豆', er.douban);
      mini('imdb', 'IMDb', er.imdb);
    });
  }

  /* ===== v6.9 搜剧添加：TVmaze 搜索 → 选中自动建档（集数/海报/评分一并抓，AI 后台补中文名与豆瓣/IMDb） ===== */
  showDramaSearch() {
    this.contentEl.querySelectorAll('.obos-chooser').forEach(x => x.remove());
    const overlay = this.contentEl.createDiv({ cls: 'obos-chooser' });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    const box = overlay.createDiv({ cls: 'obos-chooser-box' });
    const head = box.createDiv({ cls: 'obos-chooser-head' });
    head.createSpan({ cls: 'obos-chooser-title', text: '搜剧添加 · 中文名/英文名都可以' });
    const close = head.createEl('button', { cls: 'obos-mini-btn', text: '取消' });
    close.onclick = () => overlay.remove();
    const srow = box.createDiv({ cls: 'obos-drama-search' });
    const input = srow.createEl('input', { attr: { type: 'text', placeholder: '剧名，回车搜索' } });
    const go = srow.createEl('button', { cls: 'obos-jelly obos-jc-sky', text: '搜索' });
    const grid = box.createDiv({ cls: 'obos-chooser-grid' });
    const tvmaze = async q => {
      const r = await requestUrl({ url: `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}` });
      return (r.json || []).map(x => x.show).filter(Boolean).slice(0, 8);
    };
    /* v7.5 中文搜索走豆瓣联想（中文库最全，单字模糊都能中），拿原名桥回 TVmaze */
    const douban = async q => {
      const r = await requestUrl({
        url: `https://movie.douban.com/j/subject_suggest?q=${encodeURIComponent(q)}`,
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' },
      });
      return (Array.isArray(r.json) ? r.json : []).filter(x => x && x.type === 'movie');
    };
    const renderShows = (shows, cnTitle) => {
      grid.empty();
      if (!shows.length) { grid.createDiv({ cls: 'obos-chooser-label', text: '没搜到——试试完整剧名，或换英文/原名。' }); return; }
      for (const sh of shows) {
        const cell = grid.createDiv({ cls: 'obos-chooser-cell', attr: { role: 'button', tabindex: '0' } });
        if (sh.image && sh.image.medium) cell.createEl('img', { attr: { src: sh.image.medium, loading: 'lazy', alt: sh.name } });
        const year = sh.premiered ? sh.premiered.slice(0, 4) : '';
        const plat = (sh.webChannel && sh.webChannel.name) || (sh.network && sh.network.name) || '';
        cell.createDiv({ cls: 'obos-chooser-label', text: `${sh.name}${year ? ' · ' + year : ''}` });
        cell.createDiv({ cls: 'obos-chooser-sub', text: [plat, sh.rating && sh.rating.average ? '★ ' + sh.rating.average : ''].filter(Boolean).join(' · ') || 'TVmaze' });
        const pick = () => this.addDramaFromShow(sh, overlay, cnTitle || '');
        cell.onclick = pick;
        cell.onkeydown = e => { if (e.key === 'Enter') pick(); };
      }
    };
    const search = async () => {
      const q = input.value.trim();
      if (!q) return;
      grid.empty();
      grid.createDiv({ cls: 'obos-chooser-label', text: '搜索中…' });
      const isCN = /[一-鿿]/.test(q);
      try {
        if (isCN) {
          /* ① 豆瓣联想：中文名/原名/年份/海报/集数一把抓 */
          let sugg = [];
          try { sugg = await douban(q); } catch (e) { console.error('豆瓣联想失败', e); }
          if (sugg.length) {
            grid.empty();
            for (const s of sugg.slice(0, 8)) {
              const cell = grid.createDiv({ cls: 'obos-chooser-cell', attr: { role: 'button', tabindex: '0' } });
              if (s.img) cell.createEl('img', { attr: { src: s.img, loading: 'lazy', alt: s.title, referrerpolicy: 'no-referrer' } });
              cell.createDiv({ cls: 'obos-chooser-label', text: `${s.title}${s.year ? ' · ' + s.year : ''}` });
              cell.createDiv({ cls: 'obos-chooser-sub', text: [s.sub_title, s.episode ? s.episode + ' 集' : ''].filter(Boolean).join(' · ') || '豆瓣' });
              const pick = () => this.addDramaFromDouban(s, overlay);
              cell.onclick = pick;
              cell.onkeydown = e => { if (e.key === 'Enter') pick(); };
            }
            return;
          }
          /* ② 豆瓣没有 → TVmaze 中文别名直试 */
          const direct = await tvmaze(q);
          if (direct.length) { renderShows(direct, q); return; }
          /* ③ 最后兜底：AI 转英文名 */
          grid.empty();
          grid.createDiv({ cls: 'obos-chooser-label', text: `豆瓣没搜到「${q}」，正在问 AI 英文名…` });
          try {
            const en = (await this.plugin.askClaude(
              `剧集《${q}》的官方英文名是什么？只输出英文名本身，不要引号不要其他文字。不确定就输出 UNKNOWN。`)).split('\n').pop().trim();
            if (en && !/UNKNOWN/i.test(en) && en.length < 80) {
              grid.empty();
              grid.createDiv({ cls: 'obos-chooser-label', text: `${q} → ${en}，搜索中…` });
              renderShows(await tvmaze(en), q);
              return;
            }
          } catch (e) { console.error('AI 转英文名失败', e); }
          grid.empty();
          grid.createDiv({ cls: 'obos-chooser-label', text: '没搜到——试试完整中文剧名，或直接用英文/原名。' });
          return;
        }
        /* 英文/原名：TVmaze 直搜 */
        renderShows(await tvmaze(q), '');
      } catch (e) {
        grid.empty();
        grid.createDiv({ cls: 'obos-chooser-label', text: '搜索失败：' + e.message });
      }
    };
    go.onclick = search;
    input.onkeydown = e => { if (e.key === 'Enter') search(); if (e.key === 'Escape') overlay.remove(); };
    window.setTimeout(() => input.focus(), 30);
  }

  /* v7.6 豆瓣候选（天然分季条目）：保留「第X季」，原名桥接 TVmaze 拿元数据，桥不上豆瓣兜底 */
  async addDramaFromDouban(s, overlay) {
    const cn = (s.title || '').trim(); /* 分季条目原样保留季号 */
    const bare = cn.replace(/\s*第[一二三四五六七八九十\d]+季\s*$/, '').trim();
    let sh = null;
    if (s.sub_title && /[a-zA-Z]/.test(s.sub_title)) {
      try {
        const r = await requestUrl({ url: `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(s.sub_title)}` });
        const list = (r.json || []).map(x => x.show).filter(Boolean);
        sh = list.find(x => x.premiered && s.year && Math.abs(Number(x.premiered.slice(0, 4)) - Number(s.year)) <= 3) || list[0] || null;
      } catch (e) { /* 桥接失败走兜底 */ }
    }
    if (sh) {
      /* 桥到 TVmaze：豆瓣的季名/季集数/季海报优先，TVmaze 出国家/平台/类型/评分 */
      await this.createDramaFile(sh, overlay, {
        title: cn,
        origName: s.sub_title || sh.name,
        episodes: Number(s.episode) || undefined,
        posterUrl: s.img ? s.img.replace('/s_ratio_poster/', '/l_ratio_poster/') : undefined,
        year: s.year || '',
      });
      return;
    }
    /* 豆瓣兜底建档：基础字段 + 豆瓣海报，其余交给 AI 后台补全 */
    overlay.remove();
    const base = sanitizeFilename(cn);
    const path = `${FOLDERS.dramas}/${base}.md`;
    const dup = this.app.vault.getAbstractFileByPath(path);
    if (dup instanceof TFile) { new Notice('这部剧已经在库里了'); this.openInView(VIEW_DRAMA, dup); return; }
    new Notice(`正在添加《${cn}》…`);
    let posterLink = '';
    if (s.img) {
      try {
        const big = s.img.replace('/s_ratio_poster/', '/l_ratio_poster/');
        const img = await requestUrl({ url: big, headers: { 'User-Agent': 'Mozilla/5.0' } });
        const ppath = `${FOLDERS.posters}/${base}.jpg`;
        const pf = this.app.vault.getAbstractFileByPath(ppath);
        if (pf instanceof TFile) await this.app.vault.modifyBinary(pf, img.arrayBuffer);
        else await this.app.vault.createBinary(ppath, img.arrayBuffer);
        posterLink = `[[${ppath}]]`;
      } catch (e) { /* 详情页可再搜 */ }
    }
    const t = cn.replace(/"/g, '');
    const orig = (s.sub_title || bare).replace(/"/g, '');
    const yaml = [
      '---', 'type: drama', `title: "${t}"`, `title_original: "${orig}"`,
      `poster: "${posterLink}"`,
      'country: ', `year: ${s.year || ''}`, 'genre: []',
      'platform: ', `episodes: ${Number(s.episode) || 0}`, 'current_episode: 0',
      'external_rating:', '  douban: ""', '  imdb: ""',
      'status: 待定', 'rating: ""', 'notes: ""', `added: ${todayStr()}`, '---', '',
      `# ${t}`, '', '（中枢搜剧添加，基础数据来自豆瓣；其余资料由 AI 后台补全）', '',
    ].join('\n');
    const file = await this.app.vault.create(path, yaml);
    new Notice(`《${t}》已入库 → 待归类，后台补全资料…`);
    this.openInView(VIEW_DRAMA, file);
    this.enrichDrama(t, orig, path, s.year || '');
  }

  /* v7.6 TVmaze 路线：选中剧后先看季表，多季让用户选（很多人只追最新一季） */
  async addDramaFromShow(sh, overlay, cnTitle) {
    let seasons = [];
    try {
      const r = await requestUrl({ url: `https://api.tvmaze.com/shows/${sh.id}/seasons` });
      seasons = (r.json || []).filter(x => x && x.number);
    } catch (e) { /* 拉不到季表就按整剧走 */ }
    if (seasons.length > 1) { this.showSeasonChooser(sh, seasons, overlay, cnTitle); return; }
    const eps = seasons.length === 1 ? (seasons[0].episodeOrder || undefined) : undefined;
    await this.createDramaFile(sh, overlay, { title: cnTitle || sh.name, episodes: eps });
  }

  /* 季选择：接管搜索弹层，列出各季（年份/集数/季海报）+ 整剧选项 */
  showSeasonChooser(sh, seasons, overlay, cnTitle) {
    const box = overlay.querySelector('.obos-chooser-box');
    if (!box) { overlay.remove(); return; }
    box.empty();
    const CN_NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    const seasonName = n => `第${CN_NUMS[n - 1] || n}季`;
    const head = box.createDiv({ cls: 'obos-chooser-head' });
    head.createSpan({ cls: 'obos-chooser-title', text: `${cnTitle || sh.name} · 追哪一季？` });
    const close = head.createEl('button', { cls: 'obos-mini-btn', text: '取消' });
    close.onclick = () => overlay.remove();
    const grid = box.createDiv({ cls: 'obos-chooser-grid' });
    for (const se of seasons) {
      const cell = grid.createDiv({ cls: 'obos-chooser-cell', attr: { role: 'button', tabindex: '0' } });
      const img = (se.image && se.image.medium) || (sh.image && sh.image.medium);
      if (img) cell.createEl('img', { attr: { src: img, loading: 'lazy', alt: seasonName(se.number) } });
      cell.createDiv({ cls: 'obos-chooser-label', text: `${seasonName(se.number)}${se.premiereDate ? ' · ' + se.premiereDate.slice(0, 4) : ''}` });
      cell.createDiv({ cls: 'obos-chooser-sub', text: se.episodeOrder ? `${se.episodeOrder} 集` : '集数未定' });
      const pick = () => this.createDramaFile(sh, overlay, {
        title: `${cnTitle || sh.name} ${seasonName(se.number)}`,
        episodes: se.episodeOrder || 0,
        posterUrl: (se.image && se.image.original) || undefined,
        year: se.premiereDate ? se.premiereDate.slice(0, 4) : '',
      });
      cell.onclick = pick;
      cell.onkeydown = e => { if (e.key === 'Enter') pick(); };
    }
    const total = seasons.reduce((n, se) => n + (se.episodeOrder || 0), 0);
    const all = grid.createDiv({ cls: 'obos-chooser-cell', attr: { role: 'button', tabindex: '0' } });
    if (sh.image && sh.image.medium) all.createEl('img', { attr: { src: sh.image.medium, loading: 'lazy', alt: '整部剧' } });
    all.createDiv({ cls: 'obos-chooser-label', text: '整部剧' });
    all.createDiv({ cls: 'obos-chooser-sub', text: `全 ${seasons.length} 季${total ? ' · ' + total + ' 集' : ''}` });
    const pickAll = () => this.createDramaFile(sh, overlay, { title: cnTitle || sh.name, episodes: total || undefined });
    all.onclick = pickAll;
    all.onkeydown = e => { if (e.key === 'Enter') pickAll(); };
  }

  /* 建档主体：opts = { title, origName, episodes, posterUrl, year } 缺省从 TVmaze show 取 */
  async createDramaFile(sh, overlay, opts = {}) {
    overlay.remove();
    const t0 = (opts.title || sh.name).trim();
    const base = sanitizeFilename(t0);
    const path = `${FOLDERS.dramas}/${base}.md`;
    const dup = this.app.vault.getAbstractFileByPath(path);
    if (dup instanceof TFile) { new Notice('这部剧已经在库里了'); this.openInView(VIEW_DRAMA, dup); return; }
    new Notice(`正在添加《${t0}》…`);
    let episodes = opts.episodes;
    if (episodes === undefined) {
      episodes = 0;
      try {
        const er = await requestUrl({ url: `https://api.tvmaze.com/shows/${sh.id}/episodes` });
        episodes = (er.json || []).length;
      } catch (e) { /* 拿不到就 0，详情页可手改 */ }
    }
    let posterLink = '';
    const posterSrc = opts.posterUrl || (sh.image && sh.image.original) || '';
    if (posterSrc) {
      try {
        const img = await requestUrl({ url: posterSrc, headers: { 'User-Agent': 'Mozilla/5.0' } });
        const ext = posterSrc.split('.').pop().split('?')[0].slice(0, 4) || 'jpg';
        const ppath = `${FOLDERS.posters}/${base}.${ext}`;
        const pf = this.app.vault.getAbstractFileByPath(ppath);
        if (pf instanceof TFile) await this.app.vault.modifyBinary(pf, img.arrayBuffer);
        else await this.app.vault.createBinary(ppath, img.arrayBuffer);
        posterLink = `[[${ppath}]]`;
      } catch (e) { /* 没下到海报，详情页可再搜 */ }
    }
    const year = opts.year || (sh.premiered ? sh.premiered.slice(0, 4) : '');
    const country0 = (sh.network && sh.network.country && sh.network.country.name)
      || (sh.webChannel && sh.webChannel.country && sh.webChannel.country.name) || '';
    const country = COUNTRY_CN[country0] || country0;
    const plat = (sh.webChannel && sh.webChannel.name) || (sh.network && sh.network.name) || '';
    const genres = (sh.genres || []).map(g => GENRE_CN[g] || g);
    const tvr = (sh.rating && sh.rating.average) || '';
    const t = t0.replace(/"/g, '');
    const orig = (opts.origName || sh.name).replace(/"/g, '');
    const yaml = [
      '---', 'type: drama', `title: "${t}"`, `title_original: "${orig}"`,
      `poster: "${posterLink}"`,
      `country: ${country}`, `year: ${year}`,
      'genre:' + (genres.length ? '' : ' []'),
      ...genres.map(g => `  - ${g}`),
      `platform: ${plat}`, `episodes: ${episodes}`, 'current_episode: 0',
      'external_rating:', '  douban: ""', '  imdb: ""', ...(tvr ? [`  tvmaze: ${tvr}`] : []),
      'status: 待定', 'rating: ""', 'notes: ""', `added: ${todayStr()}`, '---', '',
      `# ${t}`, '', '（中枢搜剧添加，基础数据来自 TVmaze/豆瓣；其余资料由 AI 后台补全）', '',
    ].join('\n');
    const file = await this.app.vault.create(path, yaml);
    new Notice(`《${t}》已入库 → 待归类，后台补全资料…`);
    this.openInView(VIEW_DRAMA, file);
    this.enrichDrama(t, orig, path, year);
  }

  /* AI 后台补全（豆瓣/TVmaze 两条路共用）；标题带「第X季」时保留季号 */
  enrichDrama(t, orig, path, year) {
    this.plugin.runClaude('补剧集资料',
      `联网搜索剧集「${orig}」${year ? '（' + year + ' 年）' : ''}的完整资料，然后编辑 vault 文件 "${path}"：`
      + `【frontmatter 逐字段查缺补漏】title 改为中文通行译名（已是中文则不动；标题带「第X季」字样的，译名后保留季号）；title_original 填官方原名；`
      + `year / country / platform / genre（中文类型）/ episodes（总集数；标题带季号则填该季集数）——凡是空的或为 0 的填上真实值，已有值不动；`
      + `external_rating 的 douban 与 imdb 尽力查到真实评分数字填上（豆瓣搜中文名、IMDb 搜原名；确实查不到才留空，绝不编造）；`
      + `notes 填一句话推荐语。其余字段一字不动。`
      + `【正文】把标题下的占位行（中枢搜剧添加…）替换为：「## 简介」两三句剧情梗概（不剧透关键反转）＋「## 看点」2-3 条吸引点＋豆瓣/IMDb 条目链接。`
      + `最后输出一行：《中文名》共 X 集 · 豆瓣 Y · IMDb Z。`);
  }

}
Object.assign(ObosHomeView.prototype, dataMixin);

/* ================= plugin ================= */

module.exports = class ObosHomePlugin extends Plugin {
  async onload() {
    this._theme = null;
    this.registerView(VIEW_HOME, leaf => new ObosHomeView(leaf, this));
    this.registerView(VIEW_READER, leaf => new ObosReaderView(leaf, this));
    this.registerView(VIEW_DRAMA, leaf => new ObosDramaView(leaf, this));
    this.registerView(VIEW_LEDGER, leaf => new ObosLedgerView(leaf, this));
    this.registerView(VIEW_PROJECT, leaf => new ObosProjectView(leaf, this));
    this.registerView(VIEW_MDPREVIEW, leaf => new ObosMdPreviewView(leaf, this));
    /* 左侧栏专属徽记按钮：RuruOS 菱形圆卡，一眼可认 */
    addIcon('ruruos-crest',
      '<g transform="scale(4.1667)" fill="none">'
      + '<rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" stroke-width="1.8"/>'
      + '<text x="12" y="16.5" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="currentColor" stroke="none">R</text>'
      + '</g>');
    this.addRibbonIcon('ruruos-crest', '打开 RuruOS 中枢', () => this.activateHome());
    this.addCommand({ id: 'open-obos-home', name: '打开 RuruOS 中枢', callback: () => this.activateHome() });

    /* 【临时诊断，用完即删】布局振荡采样：15 秒记录谁的宽高在变，写 obos-diag.json */
    this.addCommand({ id: 'obos-diag-layout', name: 'OBOS 诊断：布局振荡采样15秒', callback: () => {
      const samples = [];
      const pathOf = el => {
        const bits = [];
        for (let n = el, i = 0; n && n.nodeType === 1 && i < 4; n = n.parentElement, i++)
          bits.push(n.tagName.toLowerCase() + (typeof n.className === 'string' && n.className ? '.' + n.className.split(/\s+/).slice(0, 3).join('.') : ''));
        return bits.join(' < ');
      };
      const findScrollers = () => {
        const out = [];
        for (const el of document.querySelectorAll('body *')) {
          if ((el.scrollHeight - el.clientHeight > 1 || el.scrollWidth - el.clientWidth > 1) && el.clientHeight > 40) out.push(el);
          if (out.length >= 40) break;
        }
        return out;
      };
      new Notice('布局采样 15 秒…结果写 obos-diag.json');
      const t0 = Date.now();
      const iv = window.setInterval(() => {
        const snap = { t: Date.now() - t0, win: [window.innerWidth, window.innerHeight], els: [] };
        for (const el of findScrollers())
          snap.els.push({ p: pathOf(el), sh: el.scrollHeight, ch: el.clientHeight, sw: el.scrollWidth, cw: el.clientWidth, ow: el.offsetWidth });
        const scr = document.querySelector('.obos-scroll, .obos-reader-scroll');
        if (scr) snap.scroller = { cw: scr.clientWidth, ow: scr.offsetWidth, sh: scr.scrollHeight, ch: scr.clientHeight };
        const root = document.querySelector('.obos-root, .obos-reader-root');
        if (root) snap.root = { cw: root.clientWidth, fs: root.style.fontSize || '' };
        samples.push(snap);
        if (Date.now() - t0 > 15000) {
          window.clearInterval(iv);
          this.app.vault.adapter.write('obos-diag.json', JSON.stringify(samples, null, 1)).then(() => new Notice('诊断完成 → obos-diag.json'));
        }
      }, 250);
    }});
    this.addCommand({
      id: 'obos-read-next',
      name: '继续阅读：打开第一篇未读文章',
      callback: () => {
        const pool = dataMixin.collect.call({ app: this.app }, '20-Reading/Articles')
          .filter(a => a.fm.status !== 'read')
          .sort((a, b) => String(b.fm.added || '').localeCompare(String(a.fm.added || '')));
        if (!pool.length) { new Notice('没有未读文章'); return; }
        dataMixin.openState.call({ app: this.app }, VIEW_READER, { filePath: pool[0].file.path });
      },
    });
    this.addCommand({
      id: 'obos-triage-next',
      name: '处理待归类剧集',
      callback: () => {
        const pool = dataMixin.collect.call({ app: this.app }, '30-Media/Dramas', 'drama')
          .filter(d => d.fm.status === '待定');
        if (!pool.length) { new Notice('没有待归类的剧'); return; }
        dataMixin.openState.call({ app: this.app }, VIEW_DRAMA, { filePath: pool[0].file.path });
      },
    });
    /* 启动即回中枢：已有的中枢页可能被延迟加载压在后台，一律唤到前台 */
    this.app.workspace.onLayoutReady(() => {
      this.activateHome();
      /* 苹果同步由插件调度：启动 15 秒后跑一次，此后每 5 分钟一次。
         公开版默认关闭自动调度（避免新用户装完就被弹 macOS 权限窗）：
         顶栏「同步」手动跑成功一次后自动开启。 */
      if (window.localStorage.getItem('obos-apple-sync') === 'on') {
        window.setTimeout(() => this.runSync(false), 15000);
        this.registerInterval(window.setInterval(() => this.runSync(false), 5 * 60 * 1000));
      }
    });
  }

  /* 苹果 提醒事项/日历 同步（脚本见 90-System/Scripts） */
  runSync(manual) {
    if (this._syncBusy) { if (manual) new Notice('同步正在进行中'); return; }
    this._syncBusy = true;
    if (manual) new Notice('正在与苹果 提醒事项/日历 同步…');
    const basePath = this.app.vault.adapter.basePath;
    const { spawn } = require('child_process');
    const child = spawn('/usr/bin/python3', [`${basePath}/90-System/Scripts/obos-apple-sync.py`], { cwd: basePath });
    let stderr = '';
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('error', err => {
      this._syncBusy = false;
      new Notice('苹果同步启动失败：' + err.message, 8000);
    });
    child.on('close', code => {
      this._syncBusy = false;
      if (code === 0) {
        if (manual) {
          new Notice('✓ 苹果同步完成（自动同步已开启，每 5 分钟一次）');
          window.localStorage.setItem('obos-apple-sync', 'on');
        }
      } else {
        new Notice(`苹果同步失败（退出码 ${code}），详情见控制台`, 10000);
        console.error(stderr);
      }
    });
  }

  /* 快问快答：等 claude 一句话答案（中文剧名→英文名等），haiku 模型秒回，不动文件 */
  askClaude(prompt) {
    return new Promise((resolve, reject) => {
      if (!AI) { reject(new Error('未检测到本机 AI CLI（转译不可用）')); return; }
      const { spawn } = require('child_process');
      const env = Object.assign({}, process.env, {
        PATH: `${process.env.PATH || ''}:${require('os').homedir()}/.local/bin:/opt/homebrew/bin:/usr/local/bin`,
      });
      const child = spawn(AI.bin, AI.ask(prompt), {
        cwd: this.app.vault.adapter.basePath, env,
        stdio: ['ignore', 'pipe', 'pipe'], /* stdin 必须关死：CLI 见到打开的管道会等输入直到 EOF，整个搜索就挂住 */
      });
      let out = '', err = '';
      const timer = window.setTimeout(() => { child.kill(); reject(new Error('AI 应答超时')); }, 45000);
      child.stdout.on('data', d => { out += d.toString(); });
      child.stderr.on('data', d => { err += d.toString(); });
      child.on('error', e => { window.clearTimeout(timer); reject(e); });
      child.on('close', code => {
        window.clearTimeout(timer);
        if (code === 0) {
          /* 各家 CLI stdout 噪音不同（日志/流式输出），一律取最后一行非空文本当答案 */
          const ls = out.trim().split('\n').filter(l => l.trim());
          resolve(ls.length ? ls[ls.length - 1].trim() : '');
        } else reject(new Error(err.slice(0, 200) || `退出码 ${code}`));
      });
    });
  }

  /* 通用后台 Claude 任务（搜评分等）；busy 时排队，跑完自动接续 */
  runClaude(label, prompt) {
    if (!AI) { new Notice(NO_AI_MSG, 9000); return; }
    if (this._claudeBusy) {
      (this._claudeQueue = this._claudeQueue || []).push([label, prompt]);
      new Notice(`已有 Claude 任务在跑，「${label}」已排队（第 ${this._claudeQueue.length} 位）`);
      return;
    }
    this._claudeBusy = true;
    new Notice(`已启动「${label}」后台任务（引擎 ${AI.name}，约 1-2 分钟）`, 6000);
    const { spawn } = require('child_process');
    const env = Object.assign({}, process.env, {
      PATH: `${process.env.PATH || ''}:${require('os').homedir()}/.local/bin:/opt/homebrew/bin:/usr/local/bin`,
    });
    /* editWeb 参数放行联网：claude 是 --allowedTools WebSearch/WebFetch（acceptEdits 只自动接受文件编辑，
       不加这个后台任务查不了豆瓣/IMDb，v7.2 实锤），其他引擎见 AI_ENGINES 各家定义 */
    const child = spawn(AI.bin, AI.editWeb(prompt), {
        cwd: this.app.vault.adapter.basePath, env,
        stdio: ['ignore', 'pipe', 'pipe'], /* stdin 关死防 CLI 等输入挂住 */
      });
    let out = '', err = '';
    child.stdout.on('data', d => { out += d.toString(); });
    child.stderr.on('data', d => { err += d.toString(); });
    const nextInQueue = () => {
      const next = this._claudeQueue && this._claudeQueue.shift();
      if (next) this.runClaude(next[0], next[1]);
    };
    child.on('error', e => { this._claudeBusy = false; new Notice(`${label}启动失败：${e.message}`, 8000); nextInQueue(); });
    child.on('close', code => {
      this._claudeBusy = false;
      if (code === 0) {
        const ls = out.trim().split('\n').filter(Boolean);
        new Notice(ls.length ? ls[ls.length - 1] : `${label}完成`, 12000);
      } else {
        new Notice(`${label}失败（退出码 ${code}），详情见控制台`, 10000);
        console.error(err);
      }
      nextInQueue();
    });
  }

  /* 主题：六套（v6），localStorage 存档；旧值 light/dark 自动迁移 */
  getTheme() {
    if (this._theme) return this._theme;
    let saved = null;
    try { saved = window.localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === 'light') saved = 'cream';
    if (saved === 'dark') saved = 'berrynight';
    this._theme = THEME_NAMES.includes(saved) ? saved : 'cream';
    return this._theme;
  }

  setTheme(theme) {
    if (!THEME_NAMES.includes(theme)) return;
    this._theme = theme;
    try { window.localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
    this.setCustomHue(null, true); /* 选定主题=放弃自调 */
    this.setCustomSat(null, true);
    this.refreshAllViews();
  }

  /* 天气：Open-Meteo 免 key，默认东京丰岛区，1 小时缓存 */
  /* 缓存新鲜时同步取（重渲染不闪加载态）；过期返回 null 走异步 fetch */
  freshWeather() {
    return (this._wx && Date.now() - this._wxTs < 3600e3) ? this._wx : null;
  }
  async fetchWeather() {
    const now = Date.now();
    if (this._wx && now - this._wxTs < 3600e3) return this._wx;
    /* 天气默认东京。改成你的城市 = 换下面的 latitude/longitude 和 timezone（Open-Meteo 免 key），
       经纬度查询：https://open-meteo.com/en/docs 顶部搜索框。详见 docs/自定义指南.md */
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=35.7295&longitude=139.7109'
      + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code'
      + '&hourly=temperature_2m,precipitation_probability&forecast_hours=3&timezone=Asia%2FTokyo';
    const res = await requestUrl({ url });
    this._wx = res.json;
    this._wxTs = now;
    return this._wx;
  }

  /* 问候称呼：用户可点名字改，localStorage 记忆 */
  getUserName() {
    try { return window.localStorage.getItem('obos-username') || 'Lulu'; } catch (e) { return 'Lulu'; }
  }

  setUserName(name) {
    try { window.localStorage.setItem('obos-username', name); } catch (e) { /* ignore */ }
  }

  /* 自调底色色相：只动 --bg，糖果色不动 */
  getCustomHue() {
    try {
      const v = window.localStorage.getItem(HUE_KEY);
      return v === null ? null : +v;
    } catch (e) { return null; }
  }

  getCustomSat() {
    try {
      const v = window.localStorage.getItem('obos-sat');
      return v === null ? null : +v;
    } catch (e) { return null; }
  }

  setCustomSat(v, skipRefresh) {
    try {
      if (v === null) window.localStorage.removeItem('obos-sat');
      else window.localStorage.setItem('obos-sat', String(v));
    } catch (e) { /* ignore */ }
    if (!skipRefresh) this.refreshAllViews();
  }

  setCustomHue(h, skipRefresh) {
    try {
      if (h === null) window.localStorage.removeItem(HUE_KEY);
      else window.localStorage.setItem(HUE_KEY, String(h));
    } catch (e) { /* ignore */ }
    if (!skipRefresh) this.refreshAllViews();
  }

  /* 桌面动效参数：六项（模式/速度/数量/大小/方向角/饱和/可见） */
  getFx() {
    if (this._fx) return this._fx;
    let v = null;
    try { v = JSON.parse(window.localStorage.getItem(FX_KEY)); } catch (e) {}
    this._fx = Object.assign({}, FX_DEFAULT, v || {});
    return this._fx;
  }

  setFx(patch) {
    this._fx = Object.assign({}, this.getFx(), patch);
    try { window.localStorage.setItem(FX_KEY, JSON.stringify(this._fx)); } catch (e) { /* ignore */ }
  }

  /* 在视图根上重建桌面动效层（render 时经 applyTheme 调用） */
  mountFx(root) {
    const old = root.querySelector(':scope > .obos-fxlayer');
    if (old) old.remove();
    const fx = this.getFx();
    const layer = root.createDiv({ cls: 'obos-fxlayer' });
    layer.style.setProperty('--fxsat', String(fx.sat));
    layer.style.setProperty('--fxvis', String(fx.vis));
    if (fx.mode === 'none') return;
    const cfg = { sakura: ['petal', 22], rain: ['rain', 38], snow: ['snow', 26], fly: ['fly', 14] }[fx.mode];
    if (!cfg) return;
    const [cls, base] = cfg;
    const n = Math.max(4, Math.round(base * fx.count));
    const drift = Math.tan(fx.angle * Math.PI / 180) * 118 * (cls === 'fly' ? -1 : 1);
    for (let i = 0; i < n; i++) {
      const el = layer.createEl('i', { cls });
      const d = (cls === 'rain' ? 0.9 + Math.random() * 0.6 : 8 + Math.random() * 9) / fx.speed;
      const s = (cls === 'snow' ? 4 + Math.random() * 4 : cls === 'fly' ? 4 + Math.random() * 3 : 10 + Math.random() * 8) * fx.size;
      const pad = Math.min(45, Math.abs(drift));
      const x = -pad * (drift > 0 ? 1 : 0) + Math.random() * (100 + pad);
      el.style.setProperty('--x', x.toFixed(1) + '%');
      el.style.setProperty('--d', d.toFixed(2) + 's');
      el.style.setProperty('--dl', (-Math.random() * d).toFixed(2) + 's');
      el.style.setProperty('--s', s.toFixed(1) + 'px');
      el.style.setProperty('--sw2', (14 + Math.random() * 26).toFixed(0) + 'px');
      el.style.setProperty('--dx', drift.toFixed(1) + 'vh');
      el.style.setProperty('--tilt', fx.angle.toFixed(0) + 'deg');
      el.createEl('b');
    }
  }

  /* v7.9 阅读外观（字体/标题色/重点色/正文明度），localStorage JSON；就地应用不重渲染 */
  getReaderLook() {
    try {
      const raw = window.localStorage.getItem('obos-reader-look');
      const v = raw ? JSON.parse(raw) : {};
      return (v && typeof v === 'object') ? v : {};
    } catch (e) { return {}; }
  }

  setReaderLook(look) {
    try { window.localStorage.setItem('obos-reader-look', JSON.stringify(look || {})); } catch (e) { /* ignore */ }
  }

  /* 全局界面字号（%）：默认 105，步进 5，范围 90-130 */
  getUiScale() {
    let v = NaN;
    try { v = parseInt(window.localStorage.getItem(UI_SCALE_KEY), 10); } catch (e) {}
    if (!Number.isFinite(v)) v = 105;
    return Math.min(130, Math.max(90, v));
  }

  setUiScale(v) {
    v = Math.min(130, Math.max(90, v));
    try { window.localStorage.setItem(UI_SCALE_KEY, String(v)); } catch (e) { /* ignore */ }
    this.refreshAllViews();
  }

  /* 阅读正文字号（%，基准 1.16em）：默认 100，步进 10，范围 80-150。
     不触发 refreshAllViews——调用方就地改 style，避免打断阅读 */
  getReaderScale() {
    let v = NaN;
    try { v = parseInt(window.localStorage.getItem(READER_SCALE_KEY), 10); } catch (e) {}
    if (!Number.isFinite(v)) v = 100;
    return Math.min(150, Math.max(80, v));
  }

  setReaderScale(v) {
    v = Math.min(150, Math.max(80, v));
    try { window.localStorage.setItem(READER_SCALE_KEY, String(v)); } catch (e) { /* ignore */ }
  }

  /* 阅读版宽三档：舒适 760 / 标准 1100 / 满屏 1600（v6 拍板） */
  getReaderWidth() {
    let v = null;
    try { v = window.localStorage.getItem('obos-reader-width'); } catch (e) {}
    return ['760', '1100', '1600'].includes(v) ? +v : 1100;
  }

  setReaderWidth(v) {
    try { window.localStorage.setItem('obos-reader-width', String(v)); } catch (e) { /* ignore */ }
  }

  refreshAllViews() {
    for (const vt of [VIEW_HOME, VIEW_READER, VIEW_DRAMA, VIEW_LEDGER, VIEW_PROJECT, VIEW_MDPREVIEW]) {
      for (const leaf of this.app.workspace.getLeavesOfType(vt)) {
        if (leaf.view && typeof leaf.view.render === 'function') leaf.view.render();
      }
    }
  }

  async activateHome() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_HOME);
    if (existing.length) { this.app.workspace.revealLeaf(existing[0]); return; }
    const leaf = this.app.workspace.getLeaf(true);
    await leaf.setViewState({ type: VIEW_HOME, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  onunload() {}
};
