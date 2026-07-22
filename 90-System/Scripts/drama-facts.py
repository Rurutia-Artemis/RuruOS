#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""剧集资料抓取（RuruOS 唯一标准实现）

给 30-Media/Dramas/ 里的剧集笔记补：封面、简介、豆瓣评分、IMDb 评分。
插件里的「一键搜索所有当前剧的封面和简介」按钮走的是同一套规则（main.js 的
dataMixin.fetchDramaFacts），两边任何一边改了规则，另一边必须跟着改。

为什么要有这个脚本：AI 联网搜豆瓣分数是搜不到的——豆瓣详情页对爬虫一律 302 到验证页，
所以从 v7.2 到 v8.4，external_rating.douban 一直是空的（《驯鹿宝贝》这种烂大街的剧也空）。
分数和简介必须走下面这几个结构化接口，不许靠模型「记得」或者「搜到过」。

============ 抓取标准 ============
封面   ① 豆瓣 subject_suggest 的 img，把 /s_ratio_poster/ 换成 /l_ratio_poster/（首选：国区认的那张，天然分季）
       ② TVmaze show.image.original
       ③ iTunes artworkUrl100 换 800x800bb
       存到 30-Media/Posters/<title>.jpg，frontmatter 写 poster: "[[30-Media/Posters/<title>.jpg]]"

简介   豆瓣 rexxar 详情的 intro 字段，原样写进正文「## 简介」，排在「## 看点」之前。
       正文已经有「## 简介」的不动。

豆瓣分 GET https://movie.douban.com/j/subject_suggest?q=<剧名>      → 取 id
       GET https://m.douban.com/rexxar/api/v2/tv/<id>              → rating.value
       （要带桌面 UA；rexxar 还要带 Referer: https://m.douban.com/movie/subject/<id>/）
       （电影条目走 .../v2/movie/<id>，两个端点都试一遍）

IMDb分 GET https://api.tvmaze.com/search/shows?q=<原名>             → externals.imdb
       POST https://api.graphql.imdb.com/  {"query":"query{title(id:\\"tt…\\"){ratingsSummary{aggregateRating}}}"}
                                                                   → ratingsSummary.aggregateRating

命中判定  豆瓣候选必须「季号一致」+「年份差 ≤1」+「中文名去季号 或 原名 与查询词相等」，
          三条缺一不可，宁可 MISS 也不许张冠李戴。
限流      豆瓣连打十几条就开始静默返空数组，每次请求之间必须间隔 GAP 秒。
铁律      查不到就留空。绝不编造分数，绝不用「大概」「约」的数字。
==================================

用法：
  python3 90-System/Scripts/drama-facts.py --all           # 扫全库，只补空缺
  python3 90-System/Scripts/drama-facts.py --all --dry     # 只报告不写盘
  python3 90-System/Scripts/drama-facts.py 30-Media/Dramas/驯鹿宝贝.md
  python3 90-System/Scripts/drama-facts.py --all --force   # 连已有分数也刷新
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

VAULT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DRAMAS = os.path.join(VAULT, '30-Media', 'Dramas')
POSTERS = os.path.join(VAULT, '30-Media', 'Posters')
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/126 Safari/537.36')
GAP = 2.5          # 豆瓣限流间隔，别调小
TIMEOUT = 20

CN_NUM = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
          '六': 6, '七': 7, '八': 8, '九': 9, '十': 10}


# ---------- 网络 ----------

def _fetch(url, headers=None, data=None, raw=False):
    req = urllib.request.Request(url, data=data,
                                 headers=dict({'User-Agent': UA}, **(headers or {})))
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        body = r.read()
    return body if raw else body.decode('utf-8', 'replace')


def get_json(url, headers=None):
    try:
        return json.loads(_fetch(url, headers))
    except Exception:
        return None


# ---------- 标题工具 ----------

def season_no(title):
    m = re.search(r'第\s*([一二三四五六七八九十\d]+)\s*季', title or '')
    if not m:
        return 0
    tok = m.group(1)
    return int(tok) if tok.isdigit() else CN_NUM.get(tok, 0)


def bare(title):
    return re.sub(r'\s*第\s*[一二三四五六七八九十\d]+\s*季\s*$', '', title or '').strip()


def norm(v):
    return re.sub(r'[\s·・:：,，.。\'"!！?？&-]', '', str(v or '')).lower()


def mostly_cjk(text):
    s = re.sub(r'\s', '', str(text or ''))
    return bool(s) and len(re.findall(r'[一-鿿]', s)) / len(s) >= 0.2


def queries(fm):
    out = []
    for v in [fm.get('title'), bare(fm.get('title', '')), fm.get('title_original')] + fm.get('aka', []):
        v = str(v or '').strip()
        if v and v not in out:
            out.append(v)
    return out


# ---------- 三个数据源 ----------

def douban_find(fm, retried=False):
    """豆瓣联想 → 命中的条目 dict（含 id/title/sub_title/img/year/episode）"""
    want_s, want_y = season_no(fm.get('title', '')), _int(fm.get('year'))
    empty = True
    for q in queries(fm):
        data = get_json('https://movie.douban.com/j/subject_suggest?q=' + urllib.parse.quote(q))
        if data:
            empty = False
        for s in (data or []):
            if not isinstance(s, dict) or s.get('type') != 'movie' or not s.get('id'):
                continue
            # 我们的标题不带季号时，豆瓣的「第一季」条目也算命中（豆瓣天然按季拆条目，
            # 只有一季的剧在我们库里就叫本名，如《混沌少年时》↔《混沌少年时 第一季》）
            if season_no(s.get('title', '')) not in ({0, 1} if want_s == 0 else {want_s}):
                continue
            if want_y and _int(s.get('year')) and abs(_int(s['year']) - want_y) > 1:
                continue
            if norm(bare(s.get('title', ''))) == norm(bare(q)) or norm(s.get('sub_title')) == norm(q):
                return s
        time.sleep(GAP)
    # 每个查询词都拿回空数组 ≠ 查无此剧，多半是被豆瓣限流了（实测连打十几条就开始静默返空）。
    # 歇久一点重试一轮；真查无此剧时首轮就会有候选、只是对不上，不会走到这里。
    if empty and not retried:
        time.sleep(GAP * 3)
        return douban_find(fm, True)
    return None


def douban_detail(sid):
    """条目详情 → {rating, intro, episodes}。两条腿走路：
    ① subject_abstract 只要 UA，最稳，出分数与集数
    ② rexxar 详情出简介，但必须带 Referer；rexxar 走错端点会 302，tv/movie 都试一遍
    分数以 ① 为准，② 只在 ① 空的时候兜底——不许因为一个接口抽风就把 douban 字段留空。"""
    out = {'rating': None, 'intro': '', 'episodes': 0}
    d = get_json('https://movie.douban.com/j/subject_abstract?subject_id=%s' % sid)
    s = (d or {}).get('subject') or {}
    if s:
        rate = _num(s.get('rate'))
        if rate > 0:
            out['rating'] = rate
        out['episodes'] = _int(s.get('episodes_count'))
    time.sleep(GAP)
    for kind in ('tv', 'movie'):
        d = get_json(f'https://m.douban.com/rexxar/api/v2/{kind}/{sid}',
                     {'Referer': f'https://m.douban.com/movie/subject/{sid}/'})
        if isinstance(d, dict) and isinstance(d.get('rating'), dict):
            v = d['rating'].get('value')
            if not out['rating'] and isinstance(v, (int, float)) and v > 0:
                out['rating'] = v
            out['intro'] = d.get('intro') or ''
            out['episodes'] = out['episodes'] or _int(d.get('episodes_count'))
            break
    return out


def latin_alias(sub):
    """从豆瓣条目的 sub_title 里挑出官方外文原名。这一栏可能是「Baby Reindeer」，
    也可能是「驯鹿宝贝 / Baby Reindeer / Reindeer Baby」这样一串别名，所以按 / 拆开，
    取第一个「有拉丁字母且不含汉字」的段。挑不出就返回空串，绝不硬凑。"""
    for part in str(sub or '').split('/'):
        s = part.strip()
        if s and re.search(r'[A-Za-z]', s) and not re.search(r'[一-鿿]', s):
            return s
    return ''


IMDB_KINDS = ('movie', 'tvSeries', 'tvMiniSeries', 'tvMovie', 'tvSpecial')


def bare_en(v):
    """英文季号尾巴：「Stranger Things 5」「Squid Game Season 2」「The Bear S3」→ 去掉"""
    s = str(v or '')
    return re.sub(r'[\s:：-]*(season\s*)?\d+\s*$', '', s, flags=re.I).strip() or s


def imdb_find(fm, orig_name=''):
    """IMDb 官方联想（免 key，电影/剧集通吃，中文名也能查中）→ 最佳条目。

    匹配规则分两路，**别拿年份当主要判据**：IMDb 的年份是「剧集首播年」，我们库里的是「该季年份」，
    《怪奇物语 第五季》(2025) 因此会配到 2025 年的《Stranger Things 5: Behind the Episode》花絮上。
      · 英文查询词 → 只认「去季号后名字完全相等」的条目（IMDb 分本来就是剧集级的）
      · 中文查询词 → IMDb 自己把该中文别名映射到了此条目，本身就是强信号；再用年份卡一道防花絮
    英文词排在前面，能用英文匹配就绝不落到中文那条路。"""
    want = _int(fm.get('year'))
    qs = []
    for v in [bare_en(orig_name), orig_name,
              bare_en(fm.get('title_original')), fm.get('title_original'),
              bare(fm.get('title', '')), fm.get('title')]:
        v = str(v or '').strip()
        if v and v not in qs:
            qs.append(v)
    for q in qs:
        d = get_json('https://v3.sg.media-imdb.com/suggestion/x/%s.json'
                     % urllib.parse.quote(q.lower()))
        lst = [x for x in ((d or {}).get('d') or [])
               if x.get('id', '').startswith('tt') and x.get('qid') in IMDB_KINDS]
        if not lst:
            continue
        if re.search(r'[A-Za-z]', q) and not re.search(r'[一-鿿]', q):
            for x in lst:
                if norm(bare_en(x.get('l'))) == norm(bare_en(q)):
                    return x
            continue
        for x in lst:
            if not want or (_int(x.get('y')) and abs(_int(x['y']) - want) <= 1):
                return x
    return None


def imdb_detail(tid):
    """一次 GraphQL 拿全：分数 + 英文剧情 + 高清海报 + 官方原名 + 年份"""
    q = ('query{title(id:"%s"){originalTitleText{text} releaseYear{year}'
         ' ratingsSummary{aggregateRating} primaryImage{url} plot{plotText{plainText}}}}' % tid)
    try:
        d = json.loads(_fetch('https://api.graphql.imdb.com/',
                              {'content-type': 'application/json'},
                              data=json.dumps({'query': q}).encode()))
    except Exception:
        return None
    t = ((d.get('data') or {}).get('title')) or None
    if not t:
        return None
    return {
        'rating': (t.get('ratingsSummary') or {}).get('aggregateRating'),
        'plot': ((t.get('plot') or {}).get('plotText') or {}).get('plainText') or '',
        'poster': (t.get('primaryImage') or {}).get('url'),
        'orig': (t.get('originalTitleText') or {}).get('text') or '',
        'year': (t.get('releaseYear') or {}).get('year') or 0,
    }


def tvmaze_find(fm, orig_name=''):
    """兜底源：只有剧集，出封面 / tvmaze 分 / 英文 summary"""
    want = _int(fm.get('year'))
    for q in ([orig_name] if orig_name else []) + queries(fm):
        data = get_json('https://api.tvmaze.com/search/shows?q=' + urllib.parse.quote(q))
        cands = [x.get('show') for x in (data or []) if isinstance(x, dict)]
        for s in [s for s in cands if s]:
            year = _int((s.get('premiered') or '')[:4])
            if not want or not year or abs(year - want) <= 1:
                return s
    return None


def itunes_poster(fm):
    """封面第三兜底：iTunes 也是英文库，所以要在拿到英文原名之后才调"""
    for q in queries(fm):
        d = get_json('https://itunes.apple.com/search?term=%s&entity=tvSeason&limit=4'
                     % urllib.parse.quote(q))
        for r in (d or {}).get('results', []):
            if r.get('artworkUrl100'):
                return r['artworkUrl100'].replace('100x100bb', '800x800bb')
    return None


# ---------- 笔记读写（逐行改，不重排 frontmatter） ----------

FM_RE = re.compile(r'\A---\n(.*?)\n---\n?', re.S)


def _int(v):
    try:
        return int(str(v).strip().strip('"\''))
    except Exception:
        return 0


def read_note(path):
    text = open(path, encoding='utf-8').read()
    m = FM_RE.match(text)
    if not m:
        return text, '', text
    return text, m.group(1), text[m.end():]


def parse_fm(fm_text):
    """够用就好：顶层标量 + external_rating 两个子字段 + aka 列表"""
    fm, cur_list = {}, None
    for line in fm_text.split('\n'):
        if re.match(r'^\s*-\s', line) and cur_list:
            if not isinstance(fm.get(cur_list), list):
                fm[cur_list] = []
            fm[cur_list].append(line.split('-', 1)[1].strip().strip('"\''))
            continue
        m = re.match(r'^(\w[\w_]*):\s*(.*)$', line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            cur_list = key if val == '' else None
            fm[key] = val.strip('"\'')
            continue
        m = re.match(r'^\s+(\w[\w_]*):\s*(.*)$', line)
        if m:
            fm[m.group(1) + '@sub'] = m.group(2).strip().strip('"\'')
    fm.setdefault('aka', [])
    if not isinstance(fm.get('aka'), list):
        fm['aka'] = []
    return fm


def set_rating(fm_text, key, value):
    """写 external_rating 下的 douban/imdb/tvmaze；没有该子键就补在现有子键之后
    （补在父键正下方会把 tvmaze 顶到 douban 前面，跟 AGENTS.md 里的字段顺序对不上）"""
    pat = re.compile(r'^(\s+)%s:\s*.*$' % key, re.M)
    if pat.search(fm_text):
        return pat.sub(lambda m: f'{m.group(1)}{key}: {value}', fm_text, count=1)
    lines = fm_text.split('\n')
    for i, line in enumerate(lines):
        if re.match(r'^external_rating:\s*$', line):
            j = i + 1
            while j < len(lines) and re.match(r'^\s+\S', lines[j]):
                j += 1
            lines.insert(j, f'  {key}: {value}')
            return '\n'.join(lines)
    return fm_text.rstrip('\n') + f'\nexternal_rating:\n  {key}: {value}'


def set_scalar(fm_text, key, value):
    pat = re.compile(r'^%s:\s*.*$' % key, re.M)
    if pat.search(fm_text):
        return pat.sub(f'{key}: {value}', fm_text, count=1)
    return fm_text.rstrip('\n') + f'\n{key}: {value}'


def insert_intro(body, intro):
    """「## 简介」插在第一个二级标题（通常是「## 看点」）之前，没有就贴文末。
    豆瓣 intro 用单换行分段，markdown 里会粘成一坨，统一改成空行分段。"""
    text = re.sub(r'\n{2,}', '\n', intro.strip()).replace('\n', '\n\n')
    block = '## 简介\n\n%s\n' % text
    lines = body.split('\n')
    for i, line in enumerate(lines):
        if re.match(r'^##\s+', line):
            lines.insert(i, block)
            return '\n'.join(lines)
    if not body.strip():
        return '\n' + block
    return body.rstrip() + '\n\n' + block


def sanitize(name):
    return re.sub(r'\s+', ' ', re.sub(r'[\\/:*?"<>|#^\[\]]', '', name)).strip()[:60]


# ---------- 主流程 ----------

def process(path, force=False, dry=False):
    text, fm_text, body = read_note(path)
    fm = parse_fm(fm_text)
    if fm.get('type') != 'drama':
        return None
    name = fm.get('title') or os.path.splitext(os.path.basename(path))[0]

    has_poster = bool(fm.get('poster'))
    has_intro = bool(re.search(r'^##\s*简介\s*$', body, re.M))
    has_db = _num(fm.get('douban@sub')) > 0
    has_im = _num(fm.get('imdb@sub')) > 0
    if not force and has_poster and has_intro and has_db and has_im:
        return {'name': name, 'skip': True}

    # —— 身份 A：豆瓣（中文名/季/年份/中文简介/中文海报/英文原名）——
    hit = douban_find(fm)
    detail = None
    orig_name, year = '', 0
    if hit:
        orig_name = latin_alias(hit.get('sub_title'))
        year = _int(hit.get('year'))
        time.sleep(GAP)
        detail = douban_detail(hit['id'])

    db_val = (detail or {}).get('rating')
    intro = (detail or {}).get('intro') or ''
    intro_en = ''
    if intro and not mostly_cjk(intro):
        intro, intro_en = '', intro      # 英文梗概不直接入中文库，转交第二层翻译

    poster_url = None
    if hit and hit.get('img'):
        poster_url = hit['img'].replace('/s_ratio_poster/', '/l_ratio_poster/')

    # 带上刚学到的原名与年份再问英文侧——TVmaze / iTunes / IMDb 都是英文库，
    # 拿中文剧名去问命中率差一大截
    fm2 = dict(fm,
               title_original=str(fm.get('title_original') or '').strip() or orig_name,
               year=_int(fm.get('year')) or year)

    # —— 身份 B：IMDb（分数/英文剧情/高清海报/官方原名）。电影剧集通吃 ——
    imdb = None
    ih = imdb_find(fm2, orig_name)
    idet = imdb_detail(ih['id']) if ih else None
    if idet:
        imdb = idet['rating']
        # 原名优先取 IMDb 的英文展示名，而不是 originalTitleText——后者可能是罗马音
        # （《铁拳教育》= Chamgyoyuk），而这个字段的用途是「拿去搜封面」，英文名才好使
        orig_name = orig_name or latin_alias(ih.get('l')) or idet['orig'] or ''
        # year 只认豆瓣那边的——本库的 year 是「该季年份」，IMDb 给的是「剧集首播年」，
        # 拿它填会把《暗夜情报员 第三季》写成 2023（那是第一季的年份）。IMDb 的年份只在
        # 匹配与交叉验证里用，不写进笔记；不带季号的条目才允许拿它兜底
        if not season_no(fm.get('title', '')):
            year = year or _int(idet['year']) or _int(ih.get('y'))
        poster_url = poster_url or idet['poster']
        if not intro and not intro_en:
            intro_en = idet['plot']

    # —— 交叉验证：两侧认的是不是同一部作品 ——
    # 《怒火救援》(Netflix 2026 剧) 的豆瓣首条是 2004 年丹泽尔那部同名电影（8.1），
    # IMDb 认的是 2026 年的剧（6.7）——两个分数写进同一条笔记就是纯错数据。
    # 只对「标题不带季号」的条目查：带季号的本来就该「豆瓣＝该季年份、IMDb＝剧集首播年」。
    conflict = None
    im_year = _int((idet or {}).get('year')) or _int((ih or {}).get('y'))
    db_year = _int((hit or {}).get('year'))
    if not season_no(fm.get('title', '')) and db_year and im_year and abs(db_year - im_year) > 2:
        mine = _int(fm.get('year'))
        if mine and abs(db_year - mine) <= 1:
            imdb, idet = None, None
        elif mine and abs(im_year - mine) <= 1:
            db_val, intro, poster_url, hit = None, '', None, None
        else:
            # 笔记里连年份都没有，没法判谁对——两边分数一律不写，整条交第二层
            conflict = (db_year, im_year)
            db_val, imdb, intro = None, None, ''
    year = 0 if conflict else year

    # —— 兜底源：TVmaze（封面 / tvmaze 分 / 英文 summary）——
    tvmaze = None
    if not poster_url or not (intro or intro_en) or imdb is None:
        sh = tvmaze_find(fm2, orig_name)
        if sh:
            tvmaze = (sh.get('rating') or {}).get('average')
            poster_url = poster_url or (sh.get('image') or {}).get('original')
            if not intro and not intro_en and sh.get('summary'):
                intro_en = re.sub(r'<[^>]+>', '', sh['summary']).strip()

    # —— 封面最后一道：iTunes（也按英文名搜）——
    if not poster_url and not has_poster:
        poster_url = itunes_poster(fm2)

    if str(fm.get('title_original') or '').strip():
        orig_name = ''                    # 已有原名就不覆盖

    changed = []
    new_fm, new_body = fm_text, body
    if db_val and (force or not has_db):
        new_fm = set_rating(new_fm, 'douban', db_val); changed.append(f'豆瓣 {db_val}')
    if imdb and (force or not has_im):
        new_fm = set_rating(new_fm, 'imdb', imdb); changed.append(f'IMDb {imdb}')
    if tvmaze:
        new_fm = set_rating(new_fm, 'tvmaze', tvmaze)
    if orig_name:
        # 原名写进 title_original（详情页本来就把它显示在中文名底下），不往 title 里塞括号——
        # title 是文件名与全库显示名，掺了英文哪儿都变丑
        new_fm = set_scalar(new_fm, 'title_original', '"%s"' % orig_name)
        changed.append('原名 %s' % orig_name)
    if year and not _int(fm.get('year')):
        new_fm = set_scalar(new_fm, 'year', year); changed.append('年份 %d' % year)
    if intro and not has_intro:
        new_body = insert_intro(new_body, intro); changed.append('简介')
    if poster_url and not has_poster:
        rel = save_poster(poster_url, name, dry)
        if rel:
            new_fm = set_scalar(new_fm, 'poster', '"[[%s]]"' % rel); changed.append('封面')

    if changed and not dry:
        open(path, 'w', encoding='utf-8').write('---\n%s\n---\n%s' % (new_fm, new_body))

    # 第一层填不上的洞，报出来交第二层（AI）收尾
    holes = {}
    if has_poster or poster_url:
        pass
    else:
        holes['封面'] = ''
    if not has_intro and not intro:
        holes['简介'] = intro_en          # 有英文原文就一并带上，AI 翻译即可，不必再搜
    if not has_db and not db_val:
        holes['豆瓣评分'] = ''
    if not has_im and not imdb:
        holes['IMDb评分'] = ''
    return {'name': name, 'changed': changed, 'holes': holes, 'conflict': conflict,
            'orig': str(fm.get('title_original') or '').strip() or orig_name, 'path': path}


def _num(v):
    try:
        return float(str(v).strip().strip('"\'') or 0)
    except Exception:
        return 0


def save_poster(url, name, dry=False):
    ext = (url.rsplit('.', 1)[-1].split('?')[0] or 'jpg')[:4]
    rel = '30-Media/Posters/%s.%s' % (sanitize(name), ext)
    if dry:
        return rel
    try:
        data = _fetch(url, {'Referer': 'https://movie.douban.com/'}, raw=True)
    except Exception as e:
        print('    封面下载失败:', e, file=sys.stderr)
        return None
    os.makedirs(POSTERS, exist_ok=True)
    open(os.path.join(VAULT, rel), 'wb').write(data)
    return rel


def main():
    ap = argparse.ArgumentParser(description='给剧集笔记补封面/简介/豆瓣·IMDb 评分')
    ap.add_argument('paths', nargs='*', help='剧集笔记路径；配 --all 时可省略')
    ap.add_argument('--all', action='store_true', help='扫描 30-Media/Dramas/ 全部剧集')
    ap.add_argument('--force', action='store_true', help='已有分数也刷新')
    ap.add_argument('--dry', action='store_true', help='只报告不写盘')
    args = ap.parse_args()

    targets = list(args.paths)
    if args.all:
        targets += [os.path.join(DRAMAS, f) for f in sorted(os.listdir(DRAMAS)) if f.endswith('.md')]
    if not targets:
        ap.error('给个笔记路径，或者加 --all')

    filled = skipped = 0
    leftover = []
    for p in targets:
        p = p if os.path.isabs(p) else os.path.join(VAULT, p)
        if not os.path.exists(p):
            print('× 不存在:', p, file=sys.stderr)
            continue
        try:
            r = process(p, args.force, args.dry)
        except Exception as e:
            print('× %s 出错: %s' % (os.path.basename(p), e), file=sys.stderr)
            continue
        if r is None:
            continue
        if r.get('skip'):
            skipped += 1
            print('· %s 已齐' % r['name'])
        else:
            if r['changed']:
                filled += 1
                print('✓ %s → %s' % (r['name'], ' / '.join(r['changed'])))
            if r.get('conflict'):
                print('  ⚠ 同名不同作品：豆瓣认 %d 年、IMDb 认 %d 年，分数一律没写，等人判' % r['conflict'])
            if r['holes']:
                leftover.append(r)
                print('  ↳ 还缺：%s' % '、'.join(r['holes']))
        time.sleep(GAP)

    print('\n补齐 %d · 本来就齐 %d · 还有缺口 %d%s'
          % (filled, skipped, len(leftover), '（--dry 未写盘）' if args.dry else ''))

    # ===== 第二层交接单：接口填不上的洞，原样贴给能联网的 Agent 干 =====
    if leftover:
        print('\n' + '=' * 60)
        print('下面这些洞接口填不上，交给 Agent（把这一整段连同规则一起给它）：\n')
        for r in leftover:
            want = []
            for k, v in r['holes'].items():
                want.append(k + ('（下面给了英文原文，翻译即可，不必再搜）' if k == '简介' and v else ''))
            print('- 《%s》%s 文件 "%s"：缺 %s%s'
                  % (r['name'], '（原名 %s）' % r['orig'] if r['orig'] else '',
                     os.path.relpath(r['path'], VAULT), '、'.join(want),
                     '　⚠ 有同名不同作品：豆瓣认 %d 年、IMDb 认 %d 年，先判定是哪一部再补' % r['conflict']
                     if r.get('conflict') else ''))
            en = r['holes'].get('简介')
            if en:
                print('  英文梗概原文：%s' % re.sub(r'\s+', ' ', en)[:600])
        print('\n规则见 AGENTS.md「剧集资料抓取标准 · 第二层」。三条铁律：只补点名缺的字段、'
              '查不到就留空、绝不编造分数。')


if __name__ == '__main__':
    main()
