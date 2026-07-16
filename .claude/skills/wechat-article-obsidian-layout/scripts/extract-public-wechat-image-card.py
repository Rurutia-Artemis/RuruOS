#!/usr/bin/env python3
"""Extract public WeChat image-card metadata and first-level body images.

Usage:
    python3 extract-public-wechat-image-card.py INPUT.html OUTPUT.json

Public HTML only. This script does not fetch URLs, use cookies, or perform account actions.
It is the deterministic handoff when extract-public-wechat-html.py exits 2 because
there is no real #js_content container.
"""

from __future__ import annotations

import html as html_module
import json
import re
import sys
from pathlib import Path
from typing import Any


def decode_js_text(value: str) -> str:
    """Decode literal JS hex escapes without corrupting non-ASCII text."""
    value = re.sub(
        r"\\x([0-9A-Fa-f]{2})",
        lambda match: chr(int(match.group(1), 16)),
        value,
    )
    value = value.replace(r"\/", "/").replace(r'\"', '"').replace(r"\'", "'")
    return html_module.unescape(value)


def balanced_slice(source: str, start: int, opening: str, closing: str) -> str:
    depth = 0
    quote: str | None = None
    escaped = False
    for index in range(start, len(source)):
        char = source[index]
        if quote is not None:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in ("'", '"'):
            quote = char
        elif char == opening:
            depth += 1
        elif char == closing:
            depth -= 1
            if depth == 0:
                return source[start : index + 1]
    raise ValueError(f"unbalanced {opening}{closing} structure")


def meta_value(source: str, name: str) -> str:
    escaped_name = re.escape(name)
    patterns = (
        rf'<meta[^>]+(?:property|name)=["\']{escaped_name}["\'][^>]+content=["\'](.*?)["\']',
        rf'<meta[^>]+content=["\'](.*?)["\'][^>]+(?:property|name)=["\']{escaped_name}["\']',
    )
    for pattern in patterns:
        match = re.search(pattern, source, re.IGNORECASE | re.DOTALL)
        if match:
            return decode_js_text(match.group(1))
    return ""


def top_level_objects(array_text: str) -> list[str]:
    objects: list[str] = []
    depth = 0
    quote: str | None = None
    escaped = False
    object_start: int | None = None
    for index, char in enumerate(array_text):
        if quote is not None:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in ("'", '"'):
            quote = char
        elif char == "{":
            if depth == 0:
                object_start = index
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0 and object_start is not None:
                objects.append(array_text[object_start : index + 1])
                object_start = None
    return objects


def quoted_field(source: str, key: str) -> str | None:
    match = re.search(rf"\b{re.escape(key)}\s*:\s*([\"'])(.*?)\1", source, re.DOTALL)
    return decode_js_text(match.group(2)) if match else None


def numeric_field(source: str, key: str) -> int | None:
    match = re.search(rf"\b{re.escape(key)}\s*:\s*([\"']?)(\d+)\1", source)
    return int(match.group(2)) if match else None


def extract(source: str) -> dict[str, Any]:
    if re.search(r'id=["\']js_content["\']', source):
        raise ValueError("real #js_content exists; use the rich-text extractor")

    list_key = source.find("picture_page_info_list")
    if list_key < 0:
        raise ValueError("picture_page_info_list not found")
    array_start = source.find("[", list_key)
    if array_start < 0:
        raise ValueError("picture_page_info_list has no array")
    array_text = balanced_slice(source, array_start, "[", "]")

    images: list[dict[str, Any]] = []
    for index, object_text in enumerate(top_level_objects(array_text), start=1):
        # The first direct-looking cdn_url precedes nested watermark_info in WeChat's
        # article object. Restricting extraction to one result per top-level object
        # prevents watermark URLs from being promoted to body images.
        url = quoted_field(object_text, "cdn_url")
        if not url:
            continue
        images.append(
            {
                "index": index,
                "url": url,
                "width": numeric_field(object_text, "width"),
                "height": numeric_field(object_text, "height"),
                "is_qr_code": numeric_field(object_text, "is_qr_code"),
            }
        )

    cgi_fields: dict[str, Any] = {}
    cgi_key = source.find("window.cgiDataNew")
    if cgi_key >= 0:
        object_start = source.find("{", cgi_key)
        if object_start >= 0:
            cgi_text = balanced_slice(source, object_start, "{", "}")
            for key in (
                "title",
                "nick_name",
                "author",
                "create_time",
                "ori_create_time",
                "item_show_type",
                "desc",
            ):
                value = quoted_field(cgi_text, key)
                if value is None:
                    numeric = numeric_field(cgi_text, key)
                    value = str(numeric) if numeric is not None else None
                if value is not None:
                    cgi_fields[key] = value

    item_show_type = str(cgi_fields.get("item_show_type", ""))
    if item_show_type and item_show_type != "8":
        raise ValueError(f"item_show_type={item_show_type}, not an image-card page")
    if not images:
        raise ValueError("no first-level image-card body images recovered")

    return {
        "page_type": "image_card",
        "meta": {
            "title": meta_value(source, "og:title"),
            "description": meta_value(source, "og:description")
            or meta_value(source, "description"),
            "author": meta_value(source, "author"),
        },
        "cgi": cgi_fields,
        "image_count": len(images),
        "images": images,
    }


def main() -> int:
    if len(sys.argv) != 3:
        print(f"Usage: {Path(sys.argv[0]).name} INPUT.html OUTPUT.json", file=sys.stderr)
        return 64
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    try:
        result = extract(input_path.read_text(encoding="utf-8", errors="replace"))
    except (OSError, ValueError) as error:
        print(f"IMAGE_CARD_EXTRACTION_FAILED: {error}", file=sys.stderr)
        return 2
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        json.dumps(
            {
                "page_type": result["page_type"],
                "title": result["meta"]["title"] or result["cgi"].get("title", ""),
                "description_chars": len(
                    result["meta"]["description"] or result["cgi"].get("desc", "")
                ),
                "image_count": result["image_count"],
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
