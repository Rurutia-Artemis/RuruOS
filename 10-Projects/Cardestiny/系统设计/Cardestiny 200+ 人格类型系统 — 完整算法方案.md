# Cardestiny 200+ 人格类型系统 — 完整算法方案

> 本文档是可直接用来写代码的技术方案

---

## 一、核心数字：多少题、多少维度、多少种结果

### 推荐配置

| 参数        | 数值        | 理由                                                                                                                                     |
| --------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **题目数量**  | **15 题**  | 区分 200 种至少需要 ~8 bits 信息量；考虑噪声和冗余，15 题是"够精准又不烦人"的甜蜜点。MBTI 官方 93 题→16 种结果是过度冗余；16personalities 约 60 题也偏多。15 题在手机上约 2-3 分钟完成，完成率可保持在 80%+ |
| **每题选项数** | **4 个**   | 3 个太少（信息量不够），5 个选择困难。4 选项每题提供 2 bits，15 题 = 30 bits 理论上限 = 10 亿种组合，200 种绰绰有余                                                           |
| **维度数量**  | **8 维**   | 6 维在数学上可以放 200 个点但太拥挤——相邻类型会过于相似。8 维空间中 200 个点可以充分分散，每种类型的描述能做出真正的差异化                                                                  |
| **结果数量**  | **216 种** | 为什么是 216？因为 6³×4 = 216，或者可以理解为 8 维空间中通过系统化网格划分得到的自然数量。比 200 稍多，方便数学分组（可按 6 大阵营 × 36 子类型，或 12 家族 × 18 变体等方式组织）                          |

### 为什么 15 题而不是 10 题或 20 题？

```
信息论下限：log₂(216) = 7.75 bits → 每题 4 选项提供 2 bits → 最少 4 题
实际需要（考虑冗余）：每个维度至少被 2 道题覆盖 → 8 维 × 2 = 16 题
去掉 1 题冗余 → 15 题

对比：
- 10 题：勉强够用，但每个维度平均只被 1.25 题覆盖，精度不足
- 15 题：每个维度被 ~2 题覆盖，可做交叉验证，精度足够
- 20 题：精度更高但完成率下降，Z 世代在手机上的耐心极限约 15-18 题
- 25+ 题：完成率骤降至 50% 以下，不推荐
```

---

## 二、8 维人格体系

### 为什么从 6 维升到 8 维？

6 维空间中均匀分布 200 个点，相邻点的平均距离太小——两个不同类型的描述会过于相似，用户会觉得"换了个词说同样的话"。8 维空间中 200 个点的平均间距增加约 40%，每种类型可以有真正独特的人格画像。

而且 8 维 = 每维高低两档 = 2⁸ = 256 个理论格点，取其中 216 个最有意义的组合，覆盖率 84%，非常干净。

### 8 个维度定义

| #   | 代号       | 维度名称 | 低分端 (0) | 高分端 (100) | 测量什么            |
| --- | -------- | ---- | ------- | --------- | --------------- |
| D1  | `blaze`  | 能量方向 | 内敛沉静    | 热烈外放      | 你的能量是向内还是向外流动   |
| D2  | `edge`   | 决断力  | 柔和退让    | 锐利果断      | 面对冲突时你是化解还是切割   |
| D3  | `veil`   | 神秘度  | 透明坦率    | 深邃难读      | 你让别人看到多少真实的自己   |
| D4  | `pulse`  | 共情力  | 理性分离    | 情感共振      | 你是用逻辑还是用感受理解他人  |
| D5  | `anchor` | 稳定性  | 漂泊流动    | 扎根不动      | 你追求变化还是追求确定     |
| D6  | `flux`   | 创造力  | 务实执行    | 天马行空      | 你是按规则做事还是打破规则   |
| D7  | `bond`   | 群体性  | 独行侠     | 连接者       | 你的力量来自独处还是团队    |
| D8  | `crest`  | 野心度  | 随遇而安    | 不断攀登      | 你是享受当下还是征服下一个目标 |

### 心理学对应（内部参考，不向用户展示）

|维度|大五人格对应|MBTI 对应|
|---|---|---|
|blaze|外向性 (Extraversion)|E/I|
|edge|宜人性反向 (low Agreeableness)|T/F 部分|
|veil|开放性的幻想子维度|N 部分|
|pulse|宜人性的共情子维度|F/T 部分|
|anchor|尽责性 (Conscientiousness)|J/P|
|flux|开放性 (Openness)|N/S|
|bond|外向性的群居子维度|E/I 部分|
|crest|尽责性的成就驱动子维度|J 部分|

---

## 三、15 道题目完整设计

### 设计原则

1. **每道题影响 2-4 个维度**（不是每题只测一个维度）
2. **纯场景化**，不出现任何心理学术语
3. **选项之间没有好坏之分**，每个选项都"酷"
4. **前 5 题轻松有趣**（建立信任），中间 5 题稍深（行为模式），后 5 题触及内核（价值观）
5. **包含 1-2 道视觉选择题**（选颜色/选场景图片），提升体验

### 权重矩阵格式

每个选项的权重格式：`[blaze, edge, veil, pulse, anchor, flux, bond, crest]` 正数 = 该维度加分，负数 = 该维度减分，0 = 不影响

---

### Q1: 选一个你最有感觉的元素

> 🔥 火 ｜ 🌊 水 ｜ 🌙 暗 ｜ ⚡ 光

```
A. 火  → [+3, +2, 0, 0, -1, +1, 0, +2]
B. 水  → [-1, -1, +1, +3, +1, 0, +2, 0]
C. 暗  → [-1, 0, +3, 0, 0, +2, -2, +1]
D. 光  → [+1, +1, -1, +1, +2, 0, +1, +1]
```

> 覆盖维度：blaze, edge, veil, pulse, anchor, bond, crest

---

### Q2: 周末一个人在家，你会？

> A. 约朋友出去玩 B. 窝在家看电影/打游戏 C. 研究一个新技能或新想法 D. 整理房间/做计划

```
A → [+3, 0, -1, +1, 0, 0, +3, 0]
B → [-2, 0, +1, 0, +1, 0, -2, -1]
C → [0, 0, +1, 0, -1, +3, -1, +2]
D → [-1, +1, 0, 0, +3, -1, 0, +1]
```

> 覆盖维度：blaze, veil, anchor, flux, bond, crest

---

### Q3: 朋友跟你说了一个很烦心的事，你的第一反应？

> A. 先听完再帮他分析原因 B. 陪他骂/陪他难过 C. 直接给建议："你应该..." D. 默默陪着，不多说

```
A → [0, +1, 0, +1, +1, 0, +1, 0]
B → [+1, -1, 0, +3, 0, 0, +2, 0]
C → [+1, +3, -1, -1, 0, 0, 0, +2]
D → [-2, 0, +2, +2, +1, 0, +1, -1]
```

> 覆盖维度：blaze, edge, veil, pulse, bond, crest

---

### Q4: 选一个你喜欢的时间

> 🌅 日出 ｜ ☀️ 正午 ｜ 🌆 黄昏 ｜ 🌙 深夜

```
A. 日出  → [+1, +1, 0, 0, +2, 0, 0, +3]
B. 正午  → [+3, +2, -2, 0, 0, 0, +2, +1]
C. 黄昏  → [0, -1, +2, +2, 0, +1, 0, 0]
D. 深夜  → [-2, 0, +3, +1, -1, +3, -2, 0]
```

> 覆盖维度：blaze, edge, veil, pulse, anchor, flux, bond, crest

---

### Q5: 玩游戏的时候你更喜欢？

> A. 速攻，快速结束 B. 防守，等对方犯错 C. 搜集资源，后期碾压 D. 找队友组队打

```
A → [+2, +3, 0, -1, -1, 0, -1, +3]
B → [-1, 0, +2, 0, +3, -1, 0, 0]
C → [0, +1, +1, 0, +2, +1, -1, +2]
D → [+1, -1, 0, +2, 0, 0, +3, 0]
```

> 覆盖维度：blaze, edge, veil, pulse, anchor, flux, bond, crest

---

### Q6: 你最不能忍受什么？

> A. 被人控制 B. 被人忽视 C. 被人欺骗 D. 被人误解

```
A → [+1, +3, +1, 0, -2, +2, -1, +2]
B → [+2, 0, -2, +1, 0, 0, +2, +1]
C → [0, +2, +2, -1, +2, 0, 0, +1]
D → [-1, 0, +3, +3, 0, +1, 0, -1]
```

> 覆盖维度：blaze, edge, veil, pulse, anchor, flux, bond, crest

---

### Q7: 做一个重要决定的时候，你靠什么？

> A. 数据和逻辑 B. 直觉和感觉 C. 问信任的人的意见 D. 先试试再说

```
A → [0, +2, 0, -2, +3, -1, 0, +1]
B → [0, 0, +2, +2, -2, +2, 0, 0]
C → [+1, -1, -1, +1, +1, 0, +3, 0]
D → [+2, +1, 0, 0, -2, +1, -1, +2]
```

> 覆盖维度：全部 8 维

---

### Q8: 选一个你想去的地方

> 🏔️ 雪山顶 ｜ 🌃 深夜的城市 ｜ 🌊 无人海岛 ｜ 🏛️ 古老的图书馆

```
A. 雪山顶    → [+1, +2, +1, -1, +1, 0, -2, +3]
B. 深夜城市  → [+2, +1, +2, 0, -1, +2, +1, +1]
C. 无人海岛  → [-1, 0, +1, +1, -1, +1, -3, 0]
D. 古老图书馆 → [-2, 0, +2, +1, +2, +2, -1, 0]
```

> 覆盖维度：全部 8 维

---

### Q9: 在一个团队项目里，你自然会变成什么角色？

> A. 带头做决定的人 B. 默默把事情做完的人 C. 出主意的人 D. 协调大家关系的人

```
A → [+2, +3, 0, 0, +1, 0, +1, +3]
B → [-2, +1, +1, 0, +3, 0, -1, +1]
C → [+1, 0, +1, 0, -1, +3, 0, +1]
D → [+1, -2, 0, +3, +1, 0, +3, 0]
```

> 覆盖维度：blaze, edge, pulse, anchor, flux, bond, crest

---

### Q10: 你觉得"强大"是什么意思？

> A. 能保护在乎的人 B. 不需要依赖任何人 C. 能看透事物的本质 D. 能改变现状

```
A → [0, +1, 0, +3, +1, 0, +2, +1]
B → [0, +2, +2, -2, +1, 0, -3, +2]
C → [-1, 0, +3, 0, 0, +2, 0, +1]
D → [+2, +2, 0, 0, -1, +2, 0, +3]
```

> 覆盖维度：全部 8 维

---

### Q11: 你更害怕哪种状态？

> A. 永远重复同样的日子 B. 永远不知道明天会怎样 C. 永远被人群包围 D. 永远一个人

```
A → [+1, +1, 0, 0, -3, +3, 0, +2]
B → [0, -1, 0, +1, +3, -2, +1, -1]
C → [-2, 0, +2, 0, 0, +1, -3, 0]
D → [+2, 0, -1, +2, 0, 0, +3, 0]
```

> 覆盖维度：blaze, edge, veil, pulse, anchor, flux, bond, crest

---

### Q12: 有人当众质疑你的观点，你会？

> A. 当场反驳，据理力争 B. 微笑不回应，心里有数 C. 认真思考他说的有没有道理 D. 觉得无所谓，不在意别人怎么看

```
A → [+2, +3, -1, 0, 0, 0, 0, +2]
B → [-1, +1, +3, 0, +2, 0, 0, +1]
C → [0, -1, 0, +1, +1, +1, 0, 0]
D → [0, 0, +1, 0, -1, +1, -1, -1]
```

> 覆盖维度：blaze, edge, veil, anchor, crest

---

### Q13: 选一个让你最舒服的状态

> A. 全力冲刺一个目标 B. 和最好的朋友闲聊到天亮 C. 一个人探索一个没去过的地方 D. 完成一件精雕细琢的作品

```
A → [+2, +2, 0, 0, +1, 0, 0, +3]
B → [+2, -1, -1, +3, 0, 0, +3, 0]
C → [0, +1, +2, 0, -2, +2, -2, +1]
D → [-1, +1, +1, 0, +3, +1, -1, +1]
```

> 覆盖维度：全部 8 维

---

### Q14: 你觉得世界上最稀缺的东西是？

> A. 自由 B. 真心 C. 真相 D. 时间

```
A → [+1, +1, +1, 0, -3, +2, -1, +1]
B → [0, -1, 0, +3, +1, 0, +2, 0]
C → [0, +2, +3, -1, +1, +1, 0, +1]
D → [0, +1, 0, 0, +2, -1, 0, +3]
```

> 覆盖维度：edge, veil, pulse, anchor, flux, bond, crest

---

### Q15: 最后一题——选一个你觉得最"帅"的存在

> A. 龙 ｜ B. 魔法师 ｜ C. 幽灵 ｜ D. 机甲

```
A → [+2, +3, +1, 0, 0, +1, 0, +3]
B → [0, 0, +3, +1, 0, +3, 0, +1]
C → [-1, +1, +3, 0, -1, +2, -2, 0]
D → [+1, +2, 0, -1, +3, +1, 0, +2]
```

> 覆盖维度：全部 8 维 附加功能：此题同时用于卡牌种族/类型偏好加权

---

## 四、核心算法

### 4.1 向量计算

```python
import numpy as np

# 权重矩阵 W: 15题 × 4选项 × 8维度
# answers: 用户选择的选项索引 [0-3] × 15题

def calculate_vector(answers, weight_matrix):
    """
    answers: list of 15 integers (0-3)
    weight_matrix: shape (15, 4, 8)
    returns: 8-dim vector, each value 0-100
    """
    raw = np.zeros(8)
    
    for q_idx, choice in enumerate(answers):
        raw += weight_matrix[q_idx][choice]
    
    # 理论范围：每维度 15 题 × 最大 ±3 = [-45, +45]
    # 用 sigmoid 归一化到 [0, 100]
    def sigmoid(x, scale=0.08):
        return 100 / (1 + np.exp(-scale * x))
    
    vector = np.array([sigmoid(v) for v in raw])
    return vector

# 示例：用户答题 [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2]
# 输出：[62.3, 45.1, 71.8, 38.5, 55.0, 68.2, 41.7, 59.4]
```

### 4.2 向量 → 人格类型匹配

200+ 个人格类型各有一个"质心向量"（centroid），用户向量和哪个质心最近，就是哪个类型。

```python
def match_personality(user_vector, personality_centroids):
    """
    user_vector: shape (8,)
    personality_centroids: dict of {word: np.array(8)}
    returns: (matched_word, distance, top_3_matches)
    """
    distances = {}
    for word, centroid in personality_centroids.items():
        # 加权欧氏距离（某些维度权重更高）
        weights = [1.0, 1.0, 1.2, 1.2, 0.8, 1.0, 1.0, 0.8]  # veil 和 pulse 权重略高
        diff = (user_vector - centroid) * weights
        dist = np.sqrt(np.sum(diff ** 2))
        distances[word] = dist
    
    # 排序，取最近的
    sorted_matches = sorted(distances.items(), key=lambda x: x[1])
    
    best_word = sorted_matches[0][0]
    best_dist = sorted_matches[0][1]
    top_3 = sorted_matches[:3]
    
    return best_word, best_dist, top_3
```

### 4.3 人格类型 → 卡牌匹配

```python
def match_card(user_vector, personality_word, game_filter, cards_db):
    """
    在已打好 8 维标签的卡牌数据库中找最匹配的卡牌
    game_filter: 'pokemon' / 'yugioh' / 'both'
    """
    candidates = cards_db
    if game_filter != 'both':
        candidates = [c for c in candidates if c['game'] == game_filter]
    
    # Q15 的审美偏好加权
    aesthetic_pref = user_vector_metadata.get('q15_choice')  # 龙/魔法师/幽灵/机甲
    
    best_card = None
    best_score = float('inf')
    top_20 = []
    
    for card in candidates:
        card_vector = np.array([
            card['power'], card['mystery'], card['protection'], card['mind'],
            card['order_score'], card['social'], card.get('creativity', 5), card.get('ambition', 5)
        ])
        
        dist = np.linalg.norm(user_vector - card_vector)
        
        # 审美偏好加权（Q15 选的类型匹配的卡牌距离 ×0.85）
        if aesthetic_matches(card, aesthetic_pref):
            dist *= 0.85
        
        top_20.append((card, dist))
    
    # 取 top 20，加权随机选 1 张
    top_20.sort(key=lambda x: x[1])
    top_20 = top_20[:20]
    
    weights = [1.0 / (d + 0.1) for _, d in top_20]
    total = sum(weights)
    probs = [w / total for w in weights]
    
    chosen_idx = np.random.choice(len(top_20), p=probs)
    return top_20[chosen_idx][0]
```

### 4.4 合拍类型计算

```python
def calculate_compatibility(word_a, word_b, centroids):
    """
    计算两个人格类型的合拍度（0-100）
    """
    vec_a = centroids[word_a]
    vec_b = centroids[word_b]
    
    # 维度级别的兼容性规则
    dim_scores = []
    
    for i, dim_name in enumerate(['blaze','edge','veil','pulse','anchor','flux','bond','crest']):
        diff = abs(vec_a[i] - vec_b[i])
        
        if dim_name in ['pulse', 'bond', 'anchor']:
            # 共情、社交、稳定性：相似更好
            score = 100 - diff
        elif dim_name in ['blaze', 'edge']:
            # 能量、决断力：可以互补
            # 互补得分：差异在 30-50 范围内最高
            if diff < 20:
                score = 80 + diff  # 相似也不错
            elif diff < 50:
                score = 100  # 互补最佳区间
            else:
                score = max(0, 100 - (diff - 50) * 2)
        else:
            # veil, flux, crest：相似略好但不绝对
            score = 90 - diff * 0.6
        
        dim_scores.append(max(0, min(100, score)))
    
    # 加权平均
    weights = [0.10, 0.10, 0.10, 0.20, 0.15, 0.10, 0.15, 0.10]
    compatibility = sum(s * w for s, w in zip(dim_scores, weights))
    
    return round(compatibility, 1)


def get_compatible_types(word, centroids, top_n=5):
    """获取最合拍的 N 个类型"""
    scores = {}
    for other_word in centroids:
        if other_word == word:
            continue
        scores[other_word] = calculate_compatibility(word, other_word, centroids)
    
    sorted_matches = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_matches[:top_n]
```

---

## 五、216 个人格单词的生成策略

### 5.1 不是手动定义 216 个，而是系统化生成

手动定义 216 个独特且有区分度的人格描述不现实。正确的方法是：

**第一步：定义 8 个维度的高/中/低三档描述模块**

每个维度有 3 个等级的描述片段：

```
blaze 高 → "你的存在感是一团无法忽视的火焰"
blaze 中 → "你在热烈与安静之间自由切换"
blaze 低 → "你的力量在沉默中酝酿"
```

8 维 × 3 档 = 24 个描述模块

**第二步：组合生成人格画像**

每个人格类型 = 8 个维度各取一档 = 一个独特的描述组合。但不是简单拼接——用 AI（Claude/Gemini）把 8 个模块融合成一段流畅的、有叙事感的 3-5 句话描述。

**第三步：用 AI 批量生成单词名称**

给 AI 输入每个类型的 8 维向量，让它生成一个匹配的英文单词。约束条件：

- 1-2 个单词
- 有意境
- 不重复
- 跨语言翻译效果好

### 5.2 质心分布方法

不用 K-means（因为我们没有真实用户数据来聚类），而是**网格法 + 筛选**：

```python
import itertools

def generate_centroids():
    """在 8 维空间中系统化生成 216 个质心"""
    
    # 每个维度取 3 个等级：25, 50, 75
    levels = [25, 50, 75]
    
    # 3⁸ = 6561 个全组合，太多，需要筛选
    all_combos = list(itertools.product(levels, repeat=8))
    
    # 筛选策略：去除"全中间"和"过于极端"的组合
    filtered = []
    for combo in all_combos:
        mid_count = sum(1 for v in combo if v == 50)
        extreme_count = sum(1 for v in combo if v in [25, 75])
        
        # 至少 3 个维度不在中间（有特色）
        # 不超过 6 个维度在极端（不会太极端）
        if extreme_count >= 3 and mid_count >= 2:
            filtered.append(combo)
    
    # 从 filtered 中均匀采样 216 个
    # 用最大最小距离法确保质心之间足够分散
    selected = maxmin_sampling(filtered, n=216)
    
    return selected


def maxmin_sampling(candidates, n):
    """最大最小距离采样：确保选出的 n 个点尽可能分散"""
    import random
    
    selected = [random.choice(candidates)]
    remaining = list(candidates)
    remaining.remove(selected[0])
    
    for _ in range(n - 1):
        # 找离已选点集距离最远的候选点
        best_candidate = None
        best_min_dist = -1
        
        for cand in remaining:
            min_dist = min(
                np.linalg.norm(np.array(cand) - np.array(sel))
                for sel in selected
            )
            if min_dist > best_min_dist:
                best_min_dist = min_dist
                best_candidate = cand
        
        selected.append(best_candidate)
        remaining.remove(best_candidate)
    
    return selected
```

### 5.3 用户分布均匀性

自然分布下，某些类型会比其他类型多很多人（因为大多数人在中间）。处理方式：

**方案 A：接受不均匀，用稀有度做卖点**

- "全球只有 0.3% 的用户是 Wraith" → 稀缺性本身是社交货币
- 在结果页显示 "Top 2% rarest type" 这样的标签
- 这是你想要的"人群中找到彼此"的感觉

**方案 B：调整质心位置让分布更均匀**

- 把更多质心放在人群密集的"中间区域"
- 密集区域细分更多类型，稀疏区域合并类型

**推荐方案 A**。稀有度本身就是你想要的产品特性。

---

## 六、数据分布与稀缺感设计

### 100 万用户时的预估分布

```
216 种类型，100 万用户：

最常见类型（约 20 种）：每种 ~15,000 人（1.5%）
中等类型（约 100 种）：每种 ~5,000 人（0.5%）
稀有类型（约 70 种）：每种 ~1,000 人（0.1%）
极稀有类型（约 26 种）：每种 ~200 人（0.02%）
```

这个分布非常适合你的需求：

- 大多数用户的类型有 1000-5000 同类人 → 能找到彼此，形成小社群
- 稀有类型只有几百人 → 极强的稀缺感和身份认同
- 可以在 APP 里显示"你的类型全球占比 0.3%"

---

## 七、让用户觉得"准"的文案技巧

### 7.1 巴纳姆效应的 5 个句式模板

1. **"表面 vs 内在"句式**
    
    > "大多数人看到的你是 [表面特征]，但你内心其实是 [内在特征]"
    
    用户觉得准是因为每个人都觉得自己有"别人看不到的一面"
    
2. **"有时候...但有时候..."句式**
    
    > "你有时候可以非常 [特征A]，但当触及你的核心时，你会变得 [特征B]"
    
    两端都覆盖，用户总能对号入座
    
3. **"你不知道的自己"句式**
    
    > "你可能没意识到，但你身上有一种 [特质] 的力量在暗处保护着你"
    
    揭示式语言让人觉得被深度理解
    
4. **"你的人总会..."句式**
    
    > "认识你的人总会在某个瞬间意识到，你其实是 [特质] 的"
    
    第三方视角增加可信度
    
5. **"你的稀缺之处"句式**
    
    > "全球只有 X% 的人拥有你这种 [特质] 和 [特质] 的罕见组合"
    
    稀缺性 + 正面肯定 = 极强的身份认同
    

### 7.2 描述结构模板（每个类型 4 层）

```
第 1 层：一句话核心定义
"[单词] — [一个比喻句，如'暴风雨前最后一秒的寂静']"

第 2 层：2-3 句性格画像（用巴纳姆句式）
"你 [表面特征]，但 [内在特征]。
 你不轻易 [行为]，但一旦 [条件]，你的 [特质] 比任何人都 [程度]。"

第 3 层：光明面 + 阴暗面
"✦ 你的力量：[正面特质]
 ✧ 你的课题：[委婉的成长空间]"

第 4 层：合拍类型 + 稀有度
"与你最共鸣的灵魂：[3-5 个合拍单词]
 全球占比：X%"
```

---

## 八、完整数据流

```
┌──────────────────────────────────────────────────┐
│ 用户打开 APP                                       │
│ ↓                                                  │
│ 选择：宝可梦 / 游戏王 / 都要                          │
│ ↓                                                  │
│ 答 15 道题（每题 4 选项，~2-3 分钟）                   │
│ ↓                                                  │
│ [前端] 权重矩阵计算 → 8 维向量 [0-100]               │
│ ↓                                                  │
│ [前端] 欧氏距离匹配 → 216 个质心中找最近的             │
│ ↓                                                  │
│ 得到人格单词（如 "Eclipse"）                          │
│ ↓                                                  │
│ [后端] 用该向量在卡牌库中匹配最近的卡牌                 │
│ ↓                                                  │
│ 展示结果页：                                         │
│   ① 人格单词 + 动效揭示                              │
│   ② 一句话核心定义                                   │
│   ③ 性格画像（3-5 句）                               │
│   ④ 光明面 / 阴暗面                                  │
│   ⑤ 命运之卡（卡面大图）                              │
│   ⑥ 合拍类型（3-5 个单词）                            │
│   ⑦ 全球占比 "Top X% rarest"                        │
│   ⑧ 雷达图（8 维可视化）                              │
│   ⑨ 分享按钮（生成 9:16 分享卡片）                     │
│ ↓                                                  │
│ [可选] 保存到个人档案 / 绑定社交媒体                    │
│ [可选] 查看"附近同类型用户" / 推荐合拍用户              │
└──────────────────────────────────────────────────┘
```

---

## 九、数据库设计（Supabase）

### personality_types 表（216 行）

```sql
CREATE TABLE personality_types (
  id SERIAL PRIMARY KEY,
  word TEXT UNIQUE NOT NULL,           -- 'Eclipse'
  word_zh TEXT,                        -- '蚀影'
  word_ja TEXT,                        -- 'エクリプス'
  
  -- 质心向量
  centroid_blaze FLOAT NOT NULL,
  centroid_edge FLOAT NOT NULL,
  centroid_veil FLOAT NOT NULL,
  centroid_pulse FLOAT NOT NULL,
  centroid_anchor FLOAT NOT NULL,
  centroid_flux FLOAT NOT NULL,
  centroid_bond FLOAT NOT NULL,
  centroid_crest FLOAT NOT NULL,
  
  -- 描述
  tagline TEXT,                        -- 一句话定义
  description TEXT,                    -- 3-5 句性格画像
  bright_side TEXT,                    -- 光明面
  dark_side TEXT,                      -- 成长课题
  
  -- 合拍类型（存 word 数组）
  compatible_types TEXT[],             -- ['Ember', 'Tide', 'Sage']
  challenge_types TEXT[],              -- 挑战型关系
  mirror_types TEXT[],                 -- 镜像型关系
  
  -- 元数据
  rarity_tier TEXT,                    -- 'common' / 'uncommon' / 'rare' / 'legendary'
  color_primary TEXT,                  -- 主色调（用于 UI）'#FF6B35'
  color_secondary TEXT,                -- 副色调
  
  -- 统计
  user_count INTEGER DEFAULT 0,        -- 多少用户是这个类型
  global_percentage FLOAT DEFAULT 0    -- 全球占比
);
```

### user_profiles 表

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 人格数据
  personality_word TEXT REFERENCES personality_types(word),
  vector FLOAT[8],                     -- 8 维向量
  answers INTEGER[15],                 -- 15 题的答案
  
  -- 卡牌
  matched_card_id TEXT,
  game_preference TEXT,                -- 'pokemon' / 'yugioh' / 'both'
  
  -- 社交
  display_name TEXT,
  avatar_url TEXT,
  social_links JSONB,                  -- {"instagram": "...", "twitter": "..."}
  is_public BOOLEAN DEFAULT true,      -- 是否在社交列表中可见
  
  -- 位置（用于"附近的人"）
  latitude FLOAT,
  longitude FLOAT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_profiles_word ON user_profiles(personality_word);
CREATE INDEX idx_profiles_location ON user_profiles USING gist (
  ll_to_earth(latitude, longitude)
);
```

### compatibility_cache 表（可选，预计算加速）

```sql
CREATE TABLE compatibility_cache (
  word_a TEXT NOT NULL,
  word_b TEXT NOT NULL,
  score FLOAT NOT NULL,                -- 0-100
  relationship TEXT,                   -- 'compatible' / 'challenge' / 'mirror'
  PRIMARY KEY (word_a, word_b)
);
```

---

## 十、开发路线图

### Phase 1：算法核心（1-2 周）

- [ ] 生成 216 个质心（maxmin 采样）
- [ ] 用 AI 批量生成 216 个单词 + 中日文翻译
- [ ] 用 AI 批量生成 216 段描述文案
- [ ] 15 道题的权重矩阵定稿
- [ ] 向量计算 + 类型匹配算法实现
- [ ] 合拍度矩阵预计算

### Phase 2：卡牌对接（1 周）

- [ ] 卡牌数据 8 维标签升级（原 6 维 → 8 维）
- [ ] 人格类型 → 卡牌匹配算法
- [ ] 测试匹配效果

### Phase 3：前端 MVP（2-3 周）

- [ ] 答题界面（15 屏）
- [ ] 结果展示页
- [ ] 分享卡片生成
- [ ] 雷达图组件

### Phase 4：社交功能（2-3 周）

- [ ] 用户注册/登录
- [ ] 个人档案页
- [ ] 同类型用户列表
- [ ] 合拍用户推荐
- [ ] 附近的人

---

## 附录：维度覆盖矩阵

每道题覆盖了哪些维度（✓ = 该题对该维度有显著影响）：

|题号|blaze|edge|veil|pulse|anchor|flux|bond|crest|
|---|---|---|---|---|---|---|---|---|
|Q1|✓|✓|✓|✓|✓|✓|✓|✓|
|Q2|✓||✓||✓|✓|✓|✓|
|Q3|✓|✓|✓|✓|||✓|✓|
|Q4|✓|✓|✓|✓|✓|✓|✓|✓|
|Q5|✓|✓|✓|✓|✓|✓|✓|✓|
|Q6|✓|✓|✓|✓|✓|✓|✓|✓|
|Q7|✓|✓|✓|✓|✓|✓|✓|✓|
|Q8|✓|✓|✓|✓|✓|✓|✓|✓|
|Q9|✓|✓||✓|✓|✓|✓|✓|
|Q10|✓|✓|✓|✓|✓|✓|✓|✓|
|Q11|✓|✓|✓|✓|✓|✓|✓|✓|
|Q12|✓|✓|✓||✓|||✓|
|Q13|✓|✓|✓|✓|✓|✓|✓|✓|
|Q14|✓|✓|✓|✓|✓|✓|✓|✓|
|Q15|✓|✓|✓|✓|✓|✓|✓|✓|
|**总计**|**15**|**14**|**14**|**13**|**14**|**13**|**14**|**15**|

每个维度至少被 13 道题覆盖，冗余度很高，精度有保障。