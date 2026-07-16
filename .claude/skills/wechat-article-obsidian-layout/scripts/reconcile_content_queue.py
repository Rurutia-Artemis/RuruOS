#!/usr/bin/env python3
"""Validate and optionally reconcile a persistent content-intake queue.

Usage:
  python scripts/reconcile_content_queue.py QUEUE.json
  python scripts/reconcile_content_queue.py QUEUE.json --write

Default mode is read-only and exits 1 when summary counts or updated_at need
reconciliation. --write performs an atomic replacement after validation.
"""

from __future__ import annotations

import argparse
import json
import os
import tempfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ALLOWED_STATUSES = {"pending", "processing", "completed", "failed", "needs_review"}


def reconcile(data: dict) -> tuple[dict, list[str]]:
    if not isinstance(data, dict) or not isinstance(data.get("items"), list):
        raise ValueError("queue must be an object with an items array")

    items = data["items"]
    ids = [item.get("id") for item in items]
    urls = [item.get("url") for item in items]
    if any(x is None for x in ids):
        raise ValueError("every queue item needs an id")
    if any(not isinstance(x, str) or not x.startswith(("http://", "https://")) for x in urls):
        raise ValueError("every queue item needs an absolute http(s) url")
    if len(ids) != len(set(ids)):
        raise ValueError("duplicate queue item ids")
    if len(urls) != len(set(urls)):
        raise ValueError("duplicate queue item urls")

    statuses = Counter(item.get("status") for item in items)
    unknown = sorted(x for x in statuses if x not in ALLOWED_STATUSES)
    if unknown:
        raise ValueError(f"unknown statuses: {unknown}")
    types = Counter(item.get("type", "other") for item in items)

    out = dict(data)
    summary = dict(out.get("summary") or {})
    expected = {
        "unique": len(set(urls)),
        "queued": len(items),
        **{status: statuses.get(status, 0) for status in sorted(ALLOWED_STATUSES)},
    }
    for kind, count in sorted(types.items()):
        expected[f"{kind}_links"] = count

    changes: list[str] = []
    for key, value in expected.items():
        if summary.get(key) != value:
            changes.append(f"summary.{key}: {summary.get(key)!r} -> {value!r}")
            summary[key] = value

    # Preserve received: it records user-submitted links and can differ from
    # queued after a topic page expands into child URLs.
    out["summary"] = summary
    current_updated = out.get("updated_at")
    if not isinstance(current_updated, str) or not current_updated.endswith("Z"):
        changes.append(f"updated_at: {current_updated!r} -> UTC Z timestamp")
    if changes:
        out["updated_at"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    return out, changes


def atomic_write(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(data, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("queue", type=Path)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()

    data = json.loads(args.queue.read_text(encoding="utf-8"))
    reconciled, changes = reconcile(data)
    if not changes:
        print(json.dumps({"ok": True, "changed": False}, ensure_ascii=False))
        return 0
    if args.write:
        atomic_write(args.queue, reconciled)
        print(json.dumps({"ok": True, "changed": True, "changes": changes}, ensure_ascii=False))
        return 0
    print(json.dumps({"ok": False, "changed": False, "changes": changes}, ensure_ascii=False))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
