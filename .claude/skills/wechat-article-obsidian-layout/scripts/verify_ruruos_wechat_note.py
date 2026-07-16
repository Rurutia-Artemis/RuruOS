#!/usr/bin/env python3
"""Deterministically verify a rich WeChat article note written to RuruOS.

Uses only the Python standard library. It checks the live article frontmatter
shape, source URL/dedup key, required rich-layout sections, local image embeds,
PNG/JPEG/GIF file signatures, WeChat hotlinks, and common footer noise.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys

REQUIRED_KEYS = [
    "type",
    "title",
    "source",
    "source_url",
    "author",
    "category",
    "status",
    "read_at",
    "rating",
    "dedup_key",
    "added",
]
OPTIONAL_PRESERVED_KEYS = {"note"}
REQUIRED_SECTIONS = [
    "> [!info] 文章来源",
    "> [!abstract] Mia 摘要",
    "## 速读",
    "## 原文整理",
    "## 来源与备注",
]
FOOTER_NOISE = [
    "微信扫一扫",
    "关注公众号",
    "预览时标签不可点",
    "赞赏作者",
    "扫码关注",
    "阅读原文进入",
]
HOTLINK_RE = re.compile(
    r"https?://[^\s)\]]*(?:mmbiz\.qpic\.cn|qpic\.cn|wx_fmt=)", re.I
)
EMBED_RE = re.compile(r"!\[\[([^\]]+)\]\]")


def parse_frontmatter(text: str) -> tuple[list[str], str, str]:
    if not text.startswith("---\n"):
        raise ValueError("note does not start with YAML frontmatter")
    parts = text.split("---\n", 2)
    if len(parts) != 3:
        raise ValueError("frontmatter closing delimiter not found")
    yaml_text, body = parts[1], parts[2]
    keys = []
    for line in yaml_text.splitlines():
        if line and not line.startswith((" ", "\t", "#")) and ":" in line:
            keys.append(line.split(":", 1)[0].strip())
    return keys, yaml_text, body


def valid_image_signature(path: Path) -> bool:
    data = path.read_bytes()[:12]
    return (
        data.startswith(b"\x89PNG\r\n\x1a\n")
        or data.startswith(b"\xff\xd8\xff")
        or data.startswith((b"GIF87a", b"GIF89a"))
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--vault", required=True, type=Path)
    parser.add_argument("--note", required=True, help="Vault-relative note path")
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--expected-images", type=int)
    args = parser.parse_args()

    vault = args.vault.expanduser().resolve()
    note = vault / args.note
    errors: list[str] = []

    if not note.is_file():
        print(json.dumps({"ok": False, "errors": [f"missing note: {note}"]}, ensure_ascii=False, indent=2))
        return 1

    text = note.read_text(encoding="utf-8")
    try:
        keys, yaml_text, body = parse_frontmatter(text)
    except ValueError as exc:
        print(json.dumps({"ok": False, "errors": [str(exc)]}, ensure_ascii=False, indent=2))
        return 1

    required_in_order = [key for key in keys if key in REQUIRED_KEYS]
    extras = [key for key in keys if key not in REQUIRED_KEYS and key not in OPTIONAL_PRESERVED_KEYS]
    missing_keys = [key for key in REQUIRED_KEYS if key not in keys]
    if required_in_order != REQUIRED_KEYS:
        errors.append(f"frontmatter required-key order mismatch: {required_in_order}")
    if missing_keys:
        errors.append(f"missing frontmatter keys: {missing_keys}")
    if extras:
        errors.append(f"invented/unapproved frontmatter keys: {extras}")

    expected_source = f'source_url: "{args.source_url}"'
    expected_dedup = f'dedup_key: "url:{args.source_url}"'
    if expected_source not in yaml_text:
        errors.append("source_url does not exactly match requested URL")
    if expected_dedup not in yaml_text:
        errors.append("dedup_key is not url:<source_url>")

    missing_sections = [section for section in REQUIRED_SECTIONS if section not in body]
    if missing_sections:
        errors.append(f"missing rich-layout sections: {missing_sections}")

    embeds = EMBED_RE.findall(body)
    if args.expected_images is not None and len(embeds) != args.expected_images:
        errors.append(f"expected {args.expected_images} image embeds, found {len(embeds)}")

    missing_files = [rel for rel in embeds if not (vault / rel).is_file()]
    if missing_files:
        errors.append(f"missing attachment files: {missing_files}")

    bad_signatures = [
        rel for rel in embeds
        if (vault / rel).is_file() and not valid_image_signature(vault / rel)
    ]
    if bad_signatures:
        errors.append(f"invalid PNG/JPEG/GIF signatures: {bad_signatures}")

    hotlinks = HOTLINK_RE.findall(text)
    if hotlinks:
        errors.append(f"WeChat image hotlinks remain: {hotlinks}")

    main_body = body.split("## 来源与备注", 1)[0]
    noise_hits = [term for term in FOOTER_NOISE if term in main_body]
    if noise_hits:
        errors.append(f"footer/ad noise remains in main body: {noise_hits}")

    if len(main_body.strip()) < 200:
        errors.append("main article body is under 200 characters")

    result = {
        "ok": not errors,
        "note": str(note),
        "frontmatter_keys": keys,
        "image_embeds": len(embeds),
        "all_attachments_exist": not missing_files,
        "image_signatures_valid": not bad_signatures,
        "wechat_hotlinks": len(hotlinks),
        "footer_noise_hits": noise_hits,
        "required_sections_ok": not missing_sections,
        "body_chars_before_sources": len(main_body.strip()),
        "errors": errors,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
