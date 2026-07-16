#!/usr/bin/env python3
"""Extract a normal public WeChat article HTML snapshot into structured JSON.

Public-only helper for environments without BeautifulSoup/lxml. It does not fetch,
log in, use cookies, or bypass verification. Feed it HTML already obtained under
the workflow's public-access rules.

Usage:
  python3 extract-public-wechat-html.py article.html article.json

Output includes metadata, readable content length, ordered text/image events, and
article links. Exit code 2 means the snapshot has no #js_content container and
must be handled by the image-card or blocked-page branch instead.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys


@dataclass
class Node:
    tag: str
    attrs: dict[str, str] = field(default_factory=dict)
    children: list[object] = field(default_factory=list)
    parent: "Node | None" = None


class TreeParser(HTMLParser):
    VOID = {"meta", "img", "br", "hr", "input", "link", "source", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.stack = [self.root]
        self.meta: dict[str, str] = {}
        self.title_parts: list[str] = []
        self.in_title = False

    def handle_starttag(self, tag: str, attrs) -> None:
        values = {key: (value or "") for key, value in attrs}
        if tag == "meta":
            key = values.get("property") or values.get("name")
            if key:
                self.meta[key] = values.get("content", "")
        node = Node(tag, values, parent=self.stack[-1])
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)
        if tag == "title":
            self.in_title = True

    def handle_startendtag(self, tag: str, attrs) -> None:
        self.handle_starttag(tag, attrs)
        if self.stack[-1].tag == tag:
            self.stack.pop()

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data: str) -> None:
        self.stack[-1].children.append(data)
        if self.in_title:
            self.title_parts.append(data)


def find_id(node: Node, wanted: str) -> Node | None:
    if node.attrs.get("id") == wanted:
        return node
    for child in node.children:
        if isinstance(child, Node):
            found = find_id(child, wanted)
            if found:
                return found
    return None


def node_text(node: Node | None) -> str:
    if node is None:
        return ""
    pieces: list[str] = []

    def visit(current: Node) -> None:
        for child in current.children:
            if isinstance(child, str):
                pieces.append(child)
            elif child.tag not in {"script", "style", "noscript"}:
                visit(child)

    visit(node)
    return re.sub(r"\s+", " ", "".join(pieces)).strip()


def public_fields(html_text: str, root: Node) -> dict[str, str]:
    """Recover account and publication time without using unrelated resource timestamps."""
    account = node_text(find_id(root, "js_name"))
    visible_author = node_text(find_id(root, "js_author_name"))
    published = node_text(find_id(root, "publish_time"))
    if not published:
        match = re.search(r"var\s+createTime\s*=\s*['\"]([^'\"]+)['\"]", html_text)
        if match:
            published = match.group(1).strip()
    return {
        "account": account,
        "visible_author": visible_author,
        "published_at": published,
    }


STRUCTURAL = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "pre"}


def has_structural_descendant(node: Node) -> bool:
    for child in node.children:
        if isinstance(child, Node):
            if child.tag in STRUCTURAL or has_structural_descendant(child):
                return True
    return False


def ordered_events(root: Node) -> list[dict[str, str]]:
    events: list[dict[str, str]] = []

    def walk(node: Node, container: Node | None = None) -> None:
        if node.tag in {"script", "style", "noscript"}:
            return
        if node.tag == "img":
            url = node.attrs.get("data-src") or node.attrs.get("src") or node.attrs.get("data-original")
            if url:
                events.append({
                    "type": "image",
                    "url": unescape(url),
                    "alt": node.attrs.get("alt", ""),
                })
            return

        current = container
        if node.tag in STRUCTURAL:
            current = node
        elif node.tag == "section" and not has_structural_descendant(node):
            current = node

        for child in node.children:
            if isinstance(child, str):
                text = re.sub(r"\s+", " ", child).strip()
                if not text or current is None:
                    continue
                marker = str(id(current))
                if events and events[-1].get("type") == "text" and events[-1].get("_container") == marker:
                    events[-1]["text"] = (events[-1]["text"] + " " + text).strip()
                else:
                    events.append({"type": "text", "tag": current.tag, "text": text, "_container": marker})
            else:
                walk(child, current)

    walk(root)
    cleaned: list[dict[str, str]] = []
    for event in events:
        event.pop("_container", None)
        if event["type"] == "text" and cleaned and cleaned[-1]["type"] == "text" and cleaned[-1]["text"] == event["text"]:
            continue
        cleaned.append(event)
    return cleaned


def article_links(root: Node) -> list[dict[str, str]]:
    links: list[dict[str, str]] = []

    def walk(node: Node) -> None:
        if node.tag == "a":
            text = node_text(node)
            href = unescape(node.attrs.get("href", ""))
            if text or href:
                links.append({"text": text, "href": href})
        for child in node.children:
            if isinstance(child, Node):
                walk(child)

    walk(root)
    return links


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: extract-public-wechat-html.py INPUT.html OUTPUT.json", file=sys.stderr)
        return 64

    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    html_text = source.read_text("utf-8", errors="ignore")
    parser = TreeParser()
    parser.feed(html_text)
    content = find_id(parser.root, "js_content")
    if content is None:
        print("NO_JS_CONTENT: use image-card or blocked-page branch", file=sys.stderr)
        return 2

    events = ordered_events(content)
    result = {
        "document_title": re.sub(r"\s+", " ", "".join(parser.title_parts)).strip(),
        "meta": parser.meta,
        "public_fields": public_fields(html_text, parser.root),
        "content_chars": len(node_text(content)),
        "content_text": node_text(content),
        "events": events,
        "links": article_links(content),
        "image_count": sum(event["type"] == "image" for event in events),
        "text_event_count": sum(event["type"] == "text" for event in events),
    }
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2), "utf-8")
    print(json.dumps({
        "content_chars": result["content_chars"],
        "image_count": result["image_count"],
        "text_event_count": result["text_event_count"],
        "output": str(destination),
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
