# SkillSpector Security Report

**Skill:** last30days  
**Source:** `/Users/rurutia/.agents/skills/last30days`  
**Scanned:** 2026-06-28 05:42:51 UTC  

## Risk Assessment

| Metric | Value |
|--------|-------|
| Score | 100/100 |
| Severity | CRITICAL |
| Recommendation | DO NOT INSTALL |

## Components (105)

| File | Type | Lines | Executable |
|------|------|-------|------------|
| `SKILL.md` | markdown | 2038 | No |
| `agents/openai.yaml` | yaml | 8 | No |
| `assets/aging-portrait.jpeg` | other | 72961 | No |
| `assets/claude-code-rap.mp3` | other | 63361 | No |
| `assets/dog-as-human.png` | other | 66840 | No |
| `assets/dog-original.jpeg` | other | 109236 | No |
| `assets/swimmom-mockup.jpeg` | other | 74377 | No |
| `references/save-html-brief.md` | markdown | 204 | No |
| `scripts/briefing.py` | python | 272 | Yes |
| `scripts/build-skill.sh` | shell | 39 | Yes |
| `scripts/compare.sh` | shell | 61 | Yes |
| `scripts/evaluate_search_quality.py` | python | 573 | Yes |
| `scripts/last30days.py` | python | 1467 | Yes |
| `scripts/lib/__init__.py` | python | 1 | Yes |
| `scripts/lib/bird_x.py` | python | 639 | Yes |
| `scripts/lib/bluesky.py` | python | 323 | Yes |
| `scripts/lib/categories.py` | python | 283 | Yes |
| `scripts/lib/chrome_cookies.py` | python | 414 | Yes |
| `scripts/lib/cjk.py` | python | 107 | Yes |
| `scripts/lib/cluster.py` | python | 271 | Yes |
| `scripts/lib/competitors.py` | python | 198 | Yes |
| `scripts/lib/cookie_extract.py` | python | 508 | Yes |
| `scripts/lib/dates.py` | python | 169 | Yes |
| `scripts/lib/dedupe.py` | python | 145 | Yes |
| `scripts/lib/digg.py` | python | 440 | Yes |
| `scripts/lib/entity_extract.py` | python | 127 | Yes |
| `scripts/lib/env.py` | python | 1037 | Yes |
| `scripts/lib/fanout.py` | python | 84 | Yes |
| `scripts/lib/fusion.py` | python | 207 | Yes |
| `scripts/lib/github.py` | python | 996 | Yes |
| `scripts/lib/grounding.py` | python | 331 | Yes |
| `scripts/lib/hackernews.py` | python | 357 | Yes |
| `scripts/lib/health.py` | python | 92 | Yes |
| `scripts/lib/hiring_signals.py` | python | 326 | Yes |
| `scripts/lib/html_publish.py` | python | 73 | Yes |
| `scripts/lib/html_render.py` | python | 738 | Yes |
| `scripts/lib/http.py` | python | 372 | Yes |
| `scripts/lib/instagram.py` | python | 521 | Yes |
| `scripts/lib/jobs.py` | python | 708 | Yes |
| `scripts/lib/linkedin.py` | python | 363 | Yes |
| `scripts/lib/log.py` | python | 35 | Yes |
| `scripts/lib/normalize.py` | python | 641 | Yes |
| `scripts/lib/permission_preflight.py` | python | 242 | Yes |
| `scripts/lib/perplexity.py` | python | 745 | Yes |
| `scripts/lib/pinterest.py` | python | 154 | Yes |
| `scripts/lib/pipeline.py` | python | 1617 | Yes |
| `scripts/lib/planner.py` | python | 760 | Yes |
| `scripts/lib/polymarket.py` | python | 794 | Yes |
| `scripts/lib/preflight.py` | python | 119 | Yes |
| `scripts/lib/providers.py` | python | 380 | Yes |
| `scripts/lib/quality_nudge.py` | python | 383 | Yes |
| `scripts/lib/query.py` | python | 202 | Yes |
| `scripts/lib/reddit.py` | python | 731 | Yes |
| `scripts/lib/reddit_arctic.py` | python | 92 | Yes |
| `scripts/lib/reddit_enrich.py` | python | 322 | Yes |
| `scripts/lib/reddit_keyless.py` | python | 329 | Yes |
| `scripts/lib/reddit_listing.py` | python | 188 | Yes |
| `scripts/lib/reddit_public.py` | python | 275 | Yes |
| `scripts/lib/reddit_rss.py` | python | 224 | Yes |
| `scripts/lib/reddit_shreddit.py` | python | 184 | Yes |
| `scripts/lib/relevance.py` | python | 200 | Yes |
| `scripts/lib/render.py` | python | 2123 | Yes |
| `scripts/lib/rerank.py` | python | 708 | Yes |
| `scripts/lib/resolve.py` | python | 345 | Yes |
| `scripts/lib/safari_cookies.py` | python | 193 | Yes |
| `scripts/lib/schema.py` | python | 319 | Yes |
| `scripts/lib/setup_wizard.py` | python | 739 | Yes |
| `scripts/lib/signals.py` | python | 330 | Yes |
| `scripts/lib/skill_meta.py` | python | 33 | Yes |
| `scripts/lib/snippet.py` | python | 51 | Yes |
| `scripts/lib/subproc.py` | python | 116 | Yes |
| `scripts/lib/threads.py` | python | 207 | Yes |
| `scripts/lib/tiktok.py` | python | 596 | Yes |
| `scripts/lib/transcribe.py` | python | 235 | Yes |
| `scripts/lib/truthsocial.py` | python | 162 | Yes |
| `scripts/lib/ui.py` | python | 620 | Yes |
| `scripts/lib/vendor/bird-search/LICENSE` | other | 21 | No |
| `scripts/lib/vendor/bird-search/bird-search.mjs` | other | 147 | No |
| `scripts/lib/vendor/bird-search/lib/cookies.js` | javascript | 220 | Yes |
| `scripts/lib/vendor/bird-search/lib/features.json` | json | 17 | No |
| `scripts/lib/vendor/bird-search/lib/paginate-cursor.js` | javascript | 37 | Yes |
| `scripts/lib/vendor/bird-search/lib/query-ids.json` | json | 20 | No |
| `scripts/lib/vendor/bird-search/lib/runtime-features.js` | javascript | 151 | Yes |
| `scripts/lib/vendor/bird-search/lib/runtime-query-ids.js` | javascript | 264 | Yes |
| `scripts/lib/vendor/bird-search/lib/twitter-client-base.js` | javascript | 129 | Yes |
| `scripts/lib/vendor/bird-search/lib/twitter-client-constants.js` | javascript | 50 | Yes |
| `scripts/lib/vendor/bird-search/lib/twitter-client-features.js` | javascript | 347 | Yes |
| `scripts/lib/vendor/bird-search/lib/twitter-client-search.js` | javascript | 157 | Yes |
| `scripts/lib/vendor/bird-search/lib/twitter-client-types.js` | javascript | 2 | Yes |
| `scripts/lib/vendor/bird-search/lib/twitter-client-utils.js` | javascript | 511 | Yes |
| `scripts/lib/vendor/bird-search/package.json` | json | 13 | No |
| `scripts/lib/web_fetch_keyless.py` | python | 105 | Yes |
| `scripts/lib/web_search_keyless.py` | python | 158 | Yes |
| `scripts/lib/xai_x.py` | python | 236 | Yes |
| `scripts/lib/xiaohongshu_api.py` | python | 162 | Yes |
| `scripts/lib/xquik.py` | python | 404 | Yes |
| `scripts/lib/xurl_x.py` | python | 171 | Yes |
| `scripts/lib/youtube_yt.py` | python | 1365 | Yes |
| `scripts/setup-keychain.sh` | shell | 123 | Yes |
| `scripts/setup-pass.sh` | shell | 132 | Yes |
| `scripts/store.py` | python | 1020 | Yes |
| `scripts/test-v1-vs-v2.sh` | shell | 220 | Yes |
| `scripts/test_device_auth.py` | python | 128 | Yes |
| `scripts/verify_v3.py` | python | 195 | Yes |
| `scripts/watchlist.py` | python | 318 | Yes |

## Issues (255)

### 🟡 MEDIUM: AST4

**Location:** `scripts/evaluate_search_quality.py:341–349`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/evaluate_search_quality.py:357–363`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/evaluate_search_quality.py:375–381`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/chrome_cookies.py:71–76`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/chrome_cookies.py:127–137`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/env.py:242–248`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/env.py:290–294`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/github.py:58–61`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/health.py:75–80`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/setup_wizard.py:212–215`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/setup_wizard.py:680–682`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/setup_wizard.py:86–89`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/subproc.py:63–72`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/xurl_x.py:41–46`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/lib/xurl_x.py:74–79`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/verify_v3.py:43–51`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/verify_v3.py:61–76`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: AST4

**Location:** `scripts/watchlist.py:178–196`  
**Confidence:** 70%  

**Message:** subprocess module call

**Remediation:** Use subprocess.run() with shell=False and an explicit argument list. Validate all inputs and avoid passing user-controlled data to commands.

---

### 🟡 MEDIUM: LP3

**Location:** `SKILL.md:1`  
**Confidence:** 70%  

**Message:** Skill has no declared permissions but code capabilities were detected: env, file_read, file_write, mcp, network, shell.

**Remediation:** Add a 'permissions' field to SKILL.md listing the capabilities this skill requires.

---

### 🟡 MEDIUM: RP1

**Location:** `SKILL.md:91`  
**Confidence:** 70%  

**Message:** MCP server referenced without pinned version: 'npx skills'.

**Remediation:** Pin the version: npx @scope/server@1.2.3

---

### 🟡 MEDIUM: RP1

**Location:** `SKILL.md:530`  
**Confidence:** 70%  

**Message:** MCP server referenced without pinned version: 'npx @mvanhorn/printing-press-library'.

**Remediation:** Pin the version: npx @scope/server@1.2.3

---

### 🟡 MEDIUM: RP1

**Location:** `scripts/lib/setup_wizard.py:46`  
**Confidence:** 70%  

**Message:** MCP server referenced without pinned version: 'npx
          env_written'.

**Remediation:** Pin the version: npx @scope/server@1.2.3

---

### 🟡 MEDIUM: RP1

**Location:** `scripts/lib/setup_wizard.py:217`  
**Confidence:** 70%  

**Message:** MCP server referenced without pinned version: 'npx install'.

**Remediation:** Pin the version: npx @scope/server@1.2.3

---

### 🟡 MEDIUM: RP1

**Location:** `scripts/lib/setup_wizard.py:220`  
**Confidence:** 70%  

**Message:** MCP server referenced without pinned version: 'npx install'.

**Remediation:** Pin the version: npx @scope/server@1.2.3

---

### 🟡 MEDIUM: RP1

**Location:** `scripts/lib/setup_wizard.py:221`  
**Confidence:** 70%  

**Message:** MCP server referenced without pinned version: 'npx install'.

**Remediation:** Pin the version: npx @scope/server@1.2.3

---

### 🟡 MEDIUM: RP1

**Location:** `scripts/lib/setup_wizard.py:233`  
**Confidence:** 70%  

**Message:** MCP server referenced without pinned version: 'npx install'.

**Remediation:** Pin the version: npx @scope/server@1.2.3

---

### 🟡 MEDIUM: RP1

**Location:** `scripts/lib/setup_wizard.py:478`  
**Confidence:** 70%  

**Message:** MCP server referenced without pinned version: 'npx is'.

**Remediation:** Pin the version: npx @scope/server@1.2.3

---

### 🟡 MEDIUM: AS3

**Location:** `SKILL.md:78`  
**Confidence:** 80%  

**Message:** Skill Enumeration

**Remediation:** Remove all code or instructions that list or read other skills' files or directories. Skills should operate independently; cross-skill access is a privilege escalation.

---

### 🟡 MEDIUM: AS3

**Location:** `SKILL.md:79`  
**Confidence:** 80%  

**Message:** Skill Enumeration

**Remediation:** Remove all code or instructions that list or read other skills' files or directories. Skills should operate independently; cross-skill access is a privilege escalation.

---

### 🟡 MEDIUM: AS3

**Location:** `SKILL.md:875`  
**Confidence:** 80%  

**Message:** Skill Enumeration

**Remediation:** Remove all code or instructions that list or read other skills' files or directories. Skills should operate independently; cross-skill access is a privilege escalation.

---

### 🟡 MEDIUM: AS3

**Location:** `SKILL.md:876`  
**Confidence:** 80%  

**Message:** Skill Enumeration

**Remediation:** Remove all code or instructions that list or read other skills' files or directories. Skills should operate independently; cross-skill access is a privilege escalation.

---

### 🟡 MEDIUM: AS3

**Location:** `SKILL.md:877`  
**Confidence:** 80%  

**Message:** Skill Enumeration

**Remediation:** Remove all code or instructions that list or read other skills' files or directories. Skills should operate independently; cross-skill access is a privilege escalation.

---

### 🟡 MEDIUM: AS3

**Location:** `SKILL.md:1220`  
**Confidence:** 80%  

**Message:** Skill Enumeration

**Remediation:** Remove all code or instructions that list or read other skills' files or directories. Skills should operate independently; cross-skill access is a privilege escalation.

---

### 🟡 MEDIUM: AS3

**Location:** `SKILL.md:1221`  
**Confidence:** 80%  

**Message:** Skill Enumeration

**Remediation:** Remove all code or instructions that list or read other skills' files or directories. Skills should operate independently; cross-skill access is a privilege escalation.

---

### 🟡 MEDIUM: AS3

**Location:** `SKILL.md:1222`  
**Confidence:** 80%  

**Message:** Skill Enumeration

**Remediation:** Remove all code or instructions that list or read other skills' files or directories. Skills should operate independently; cross-skill access is a privilege escalation.

---

### 🔴 HIGH: E2

**Location:** `scripts/evaluate_search_quality.py:197`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/evaluate_search_quality.py:199`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/evaluate_search_quality.py:201`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/evaluate_search_quality.py:324`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/last30days.py:197`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/last30days.py:873`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/lib/bird_x.py:73`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/lib/bird_x.py:78`  
**Confidence:** 60%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/lib/env.py:309`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/lib/env.py:374`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/lib/env.py:472`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🔴 HIGH: E2

**Location:** `scripts/lib/env.py:480`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/github.py:24`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/github.py:377`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/github.py:413`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/github.py:444`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/github.py:506`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/github.py:581`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🔴 HIGH: E2

**Location:** `scripts/lib/github.py:53`  
**Confidence:** 70%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/grounding.py:21`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/grounding.py:59`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/grounding.py:141`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/html_publish.py:11`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/jobs.py:250`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/jobs.py:263`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/jobs.py:277`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/linkedin.py:17`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/perplexity.py:22`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/perplexity.py:23`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/perplexity.py:24`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/pinterest.py:16`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/providers.py:19`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/providers.py:20`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/reddit.py:27`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/setup_wizard.py:522`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/threads.py:17`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/tiktok.py:16`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/tiktok.py:223`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/transcribe.py:35`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/transcribe.py:36`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/xai_x.py:28`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/lib/youtube_yt.py:1029`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🟡 MEDIUM: E1

**Location:** `scripts/test_device_auth.py:21`  
**Confidence:** 60%  

**Message:** External Transmission

**Remediation:** Verify the destination URL is trusted and necessary. Remove or replace with documented APIs. Ensure no secrets, tokens, or PII are transmitted.

---

### 🔴 HIGH: E2

**Location:** `scripts/verify_v3.py:91`  
**Confidence:** 60%  

**Message:** Env Variable Harvesting

**Remediation:** Avoid reading sensitive env vars (API keys, tokens) unless strictly required. Use secrets managers or secure config. Never log or transmit credentials.

---

### 🟡 MEDIUM: EA1

**Location:** `SKILL.md:1909`  
**Confidence:** 80%  

**Message:** Unrestricted Tool Access

**Remediation:** Restrict tool access to only the tools required for the skill's stated purpose. Use an explicit allowlist rather than granting blanket access.

---

### 🟡 MEDIUM: EA4

**Location:** `scripts/lib/http.py:303`  
**Confidence:** 75%  

**Message:** Unbounded Resource Access

**Remediation:** Set explicit rate limits, timeouts, and resource quotas for API calls, file operations, and compute. Implement circuit breakers for runaway loops.

---

### 🟡 MEDIUM: EA4

**Location:** `scripts/lib/reddit.py:638`  
**Confidence:** 75%  

**Message:** Unbounded Resource Access

**Remediation:** Set explicit rate limits, timeouts, and resource quotas for API calls, file operations, and compute. Implement circuit breakers for runaway loops.

---

### 🟡 MEDIUM: EA4

**Location:** `scripts/lib/reddit_keyless.py:199`  
**Confidence:** 75%  

**Message:** Unbounded Resource Access

**Remediation:** Set explicit rate limits, timeouts, and resource quotas for API calls, file operations, and compute. Implement circuit breakers for runaway loops.

---

### 🟡 MEDIUM: EA4

**Location:** `scripts/lib/ui.py:277`  
**Confidence:** 75%  

**Message:** Unbounded Resource Access

**Remediation:** Set explicit rate limits, timeouts, and resource quotas for API calls, file operations, and compute. Implement circuit breakers for runaway loops.

---

### 🟢 LOW: EA3

**Location:** `scripts/lib/vendor/bird-search/LICENSE:16`  
**Confidence:** 70%  

**Message:** Scope Creep

**Remediation:** Limit the skill's scope to its documented purpose. Remove instructions that enable the agent to perform actions outside its stated functionality.

---

### 🟡 MEDIUM: MP2

**Location:** `scripts/lib/github.py:203`  
**Confidence:** 80%  

**Message:** Context Window Stuffing

**Remediation:** Implement context-window management that detects and rejects padding or stuffing attempts. Prioritize system instructions over user-injected content.

---

### 🟡 MEDIUM: MP2

**Location:** `scripts/lib/jobs.py:102`  
**Confidence:** 80%  

**Message:** Context Window Stuffing

**Remediation:** Implement context-window management that detects and rejects padding or stuffing attempts. Prioritize system instructions over user-injected content.

---

### 🟡 MEDIUM: MP2

**Location:** `scripts/lib/reddit_listing.py:132`  
**Confidence:** 80%  

**Message:** Context Window Stuffing

**Remediation:** Implement context-window management that detects and rejects padding or stuffing attempts. Prioritize system instructions over user-injected content.

---

### 🟡 MEDIUM: MP2

**Location:** `scripts/lib/ui.py:520`  
**Confidence:** 80%  

**Message:** Context Window Stuffing

**Remediation:** Implement context-window management that detects and rejects padding or stuffing attempts. Prioritize system instructions over user-injected content.

---

### 🟡 MEDIUM: MP2

**Location:** `scripts/lib/ui.py:560`  
**Confidence:** 80%  

**Message:** Context Window Stuffing

**Remediation:** Implement context-window management that detects and rejects padding or stuffing attempts. Prioritize system instructions over user-injected content.

---

### 🟡 MEDIUM: MP2

**Location:** `scripts/lib/ui.py:568`  
**Confidence:** 80%  

**Message:** Context Window Stuffing

**Remediation:** Implement context-window management that detects and rejects padding or stuffing attempts. Prioritize system instructions over user-injected content.

---

### 🟡 MEDIUM: MP2

**Location:** `scripts/lib/ui.py:601`  
**Confidence:** 80%  

**Message:** Context Window Stuffing

**Remediation:** Implement context-window management that detects and rejects padding or stuffing attempts. Prioritize system instructions over user-injected content.

---

### 🔴 HIGH: OH1

**Location:** `scripts/evaluate_search_quality.py:341`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/chrome_cookies.py:71`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/chrome_cookies.py:127`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/env.py:242`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/env.py:290`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/github.py:58`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/health.py:75`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/setup_wizard.py:86`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/setup_wizard.py:212`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/xurl_x.py:41`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/lib/xurl_x.py:74`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/verify_v3.py:43`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🔴 HIGH: OH1

**Location:** `scripts/verify_v3.py:61`  
**Confidence:** 95%  

**Message:** Unvalidated Output Injection

**Remediation:** Validate and sanitize all model output before using it in downstream contexts. Use parameterized queries for SQL, shell quoting for commands, and HTML encoding for web output.

---

### 🟡 MEDIUM: PE2

**Location:** `SKILL.md:358`  
**Confidence:** 70%  

**Message:** Sudo/Root Execution

**Remediation:** Avoid sudo/root unless strictly required. Prefer least-privilege patterns. If elevation is needed, document the justification and scope.

---

### 🔴 HIGH: PE3

**Location:** `SKILL.md:1769`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `SKILL.md:1770`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `SKILL.md:1771`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `SKILL.md:434`  
**Confidence:** 80%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🟡 MEDIUM: PE2

**Location:** `scripts/last30days.py:34`  
**Confidence:** 70%  

**Message:** Sudo/Root Execution

**Remediation:** Avoid sudo/root unless strictly required. Prefer least-privilege patterns. If elevation is needed, document the justification and scope.

---

### 🔴 HIGH: PE3

**Location:** `scripts/last30days.py:106`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/last30days.py:866`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/bird_x.py:54`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/bird_x.py:59`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/bird_x.py:81`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/bluesky.py:33`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/bluesky.py:33`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:7`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:9`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:42`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:44`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:63`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:78`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:82`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:89`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:101`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:204`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:211`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:224`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:235`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:252`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:272`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:274`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:277`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:281`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:294`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:300`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:303`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:387`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:403`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:409`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:412`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/chrome_cookies.py:414`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/cookie_extract.py:290`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/cookie_extract.py:313`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/cookie_extract.py:336`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🟡 MEDIUM: PE2

**Location:** `scripts/lib/env.py:121`  
**Confidence:** 80%  

**Message:** Sudo/Root Execution

**Remediation:** Avoid sudo/root unless strictly required. Prefer least-privilege patterns. If elevation is needed, document the justification and scope.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:22`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:25`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:279`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:325`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:327`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:332`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:397`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:397`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:397`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:39`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:40`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:41`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:41`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:42`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:51`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:52`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:53`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:153`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:154`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:158`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:170`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:171`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:178`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:201`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:202`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:205`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:207`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:207`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:223`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:256`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:271`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:272`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:279`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:372`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:373`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:374`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:374`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:374`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:375`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:375`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:375`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:376`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:376`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:376`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:376`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:377`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:378`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:380`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:391`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:463`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:494`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:499`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:500`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:545`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:554`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:559`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:697`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/env.py:952`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/quality_nudge.py:302`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/quality_nudge.py:303`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/quality_nudge.py:365`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/setup_wizard.py:52`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/setup_wizard.py:244`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/setup_wizard.py:278`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/setup_wizard.py:319`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/setup_wizard.py:334`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/setup_wizard.py:290`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/setup_wizard.py:563`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/setup_wizard.py:633`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/ui.py:207`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/ui.py:217`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/ui.py:225`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/ui.py:602`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/lib/ui.py:207`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:2`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:9`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:10`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:11`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:12`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:20`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:21`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:21`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:46`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-keychain.sh:71`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-pass.sh:5`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/setup-pass.sh:22`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/test_device_auth.py:122`  
**Confidence:** 60%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/test_device_auth.py:104`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🔴 HIGH: PE3

**Location:** `scripts/watchlist.py:189`  
**Confidence:** 70%  

**Message:** Credential Access

**Remediation:** Remove references to credential paths. Use environment variables or secrets managers. For docs, use placeholder paths (e.g., /path/to/config). Never load .env or token files in production code paths.

---

### 🟡 MEDIUM: P4

**Location:** `SKILL.md:1417`  
**Confidence:** 70%  

**Message:** Behavior Manipulation

**Remediation:** Review content for implicit steering or bias. Ensure instructions are explicit and align with the skill's stated purpose.

---

### 🟡 MEDIUM: RA2

**Location:** `SKILL.md:198`  
**Confidence:** 60%  

**Message:** Session Persistence

**Remediation:** Remove any persistence mechanisms (cron jobs, startup scripts, state files). Skills should not maintain state across sessions without explicit user consent.

---

### 🟡 MEDIUM: RA2

**Location:** `SKILL.md:429`  
**Confidence:** 60%  

**Message:** Session Persistence

**Remediation:** Remove any persistence mechanisms (cron jobs, startup scripts, state files). Skills should not maintain state across sessions without explicit user consent.

---

### 🟡 MEDIUM: RA2

**Location:** `SKILL.md:1168`  
**Confidence:** 60%  

**Message:** Session Persistence

**Remediation:** Remove any persistence mechanisms (cron jobs, startup scripts, state files). Skills should not maintain state across sessions without explicit user consent.

---

### 🟡 MEDIUM: RA2

**Location:** `SKILL.md:1616`  
**Confidence:** 60%  

**Message:** Session Persistence

**Remediation:** Remove any persistence mechanisms (cron jobs, startup scripts, state files). Skills should not maintain state across sessions without explicit user consent.

---

### 🟡 MEDIUM: RA2

**Location:** `scripts/lib/setup_wizard.py:278`  
**Confidence:** 60%  

**Message:** Session Persistence

**Remediation:** Remove any persistence mechanisms (cron jobs, startup scripts, state files). Skills should not maintain state across sessions without explicit user consent.

---

### 🟡 MEDIUM: RA2

**Location:** `scripts/lib/subproc.py:61`  
**Confidence:** 65%  

**Message:** Session Persistence

**Remediation:** Remove any persistence mechanisms (cron jobs, startup scripts, state files). Skills should not maintain state across sessions without explicit user consent.

---

### 🟡 MEDIUM: TM3

**Location:** `scripts/lib/cookie_extract.py:171`  
**Confidence:** 70%  

**Message:** Unsafe Defaults

**Remediation:** Override unsafe defaults with secure settings (verify=True, auth required, restrictive permissions). Review and harden all tool configurations.

---

### 🟡 MEDIUM: TM3

**Location:** `scripts/lib/setup_wizard.py:242`  
**Confidence:** 70%  

**Message:** Unsafe Defaults

**Remediation:** Override unsafe defaults with secure settings (verify=True, auth required, restrictive permissions). Review and harden all tool configurations.

---

### 🟡 MEDIUM: TM3

**Location:** `scripts/lib/setup_wizard.py:320`  
**Confidence:** 70%  

**Message:** Unsafe Defaults

**Remediation:** Override unsafe defaults with secure settings (verify=True, auth required, restrictive permissions). Review and harden all tool configurations.

---

### 🔴 HIGH: TM1

**Location:** `scripts/setup-pass.sh:83`  
**Confidence:** 95%  

**Message:** Tool Parameter Abuse

**Remediation:** Validate all tool parameters against an allowlist. Reject dangerous parameter values (shell=True, --force, -rf /) and use safe defaults.

---

### 🔴 HIGH: TM1

**Location:** `scripts/test-v1-vs-v2.sh:18`  
**Confidence:** 95%  

**Message:** Tool Parameter Abuse

**Remediation:** Validate all tool parameters against an allowlist. Reject dangerous parameter values (shell=True, --force, -rf /) and use safe defaults.

---

### 🔴 HIGH: TM1

**Location:** `scripts/test-v1-vs-v2.sh:209`  
**Confidence:** 95%  

**Message:** Tool Parameter Abuse

**Remediation:** Validate all tool parameters against an allowlist. Reject dangerous parameter values (shell=True, --force, -rf /) and use safe defaults.

---

### 🔴 HIGH: YR1

**Location:** `SKILL.md:440`  
**Confidence:** 75%  

**Message:** YARA rule 'info_stealer': Information stealer patterns (credential harvesting, browser data theft) [malware]

**Remediation:** Remove the malware payload or compromised file entirely. Investigate how it entered the skill and audit all other artifacts for additional indicators of compromise.

---

### 🔴 HIGH: YR1

**Location:** `scripts/lib/chrome_cookies.py:38`  
**Confidence:** 75%  

**Message:** YARA rule 'info_stealer': Information stealer patterns (credential harvesting, browser data theft) [malware]

**Remediation:** Remove the malware payload or compromised file entirely. Investigate how it entered the skill and audit all other artifacts for additional indicators of compromise.

---

### 🔴 HIGH: YR1

**Location:** `scripts/lib/cookie_extract.py:3`  
**Confidence:** 75%  

**Message:** YARA rule 'info_stealer': Information stealer patterns (credential harvesting, browser data theft) [malware]

**Remediation:** Remove the malware payload or compromised file entirely. Investigate how it entered the skill and audit all other artifacts for additional indicators of compromise.

---

### 🔴 HIGH: YR1

**Location:** `scripts/lib/setup_wizard.py:286`  
**Confidence:** 38%  

**Message:** YARA rule 'info_stealer': Information stealer patterns (credential harvesting, browser data theft) [malware]

**Remediation:** Remove the malware payload or compromised file entirely. Investigate how it entered the skill and audit all other artifacts for additional indicators of compromise.

---

### 🔴 HIGH: YR1

**Location:** `scripts/lib/vendor/bird-search/lib/cookies.js:113`  
**Confidence:** 75%  

**Message:** YARA rule 'info_stealer': Information stealer patterns (credential harvesting, browser data theft) [malware]

**Remediation:** Remove the malware payload or compromised file entirely. Investigate how it entered the skill and audit all other artifacts for additional indicators of compromise.

---

## Metadata

- **Executable Scripts:** Yes

*Generated by SkillSpector v2.3.7*