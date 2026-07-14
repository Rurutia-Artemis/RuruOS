#!/usr/bin/env python3
"""RuruOS <-> 苹果 提醒事项/日历 同步脚本。

数据侧：40-Life/Tasks/*.md（type: task）、40-Life/Calendar/*.md（type: event）。
苹果侧：通过 `osascript -l JavaScript`（JXA）操作 提醒事项.app 的 "RuruOS" 清单、
日历.app 的 "RuruOS" 日历，全程仅标准库，JSON 进出。

同步契约（详见 AGENTS.md + 90-System/开发交接-HANDOFF.md 待办第 1 条）：
- 待办双向，配对键 reminder_id；内容以 RuruOS 为准，完成状态以苹果为准。
- 日程单向 RuruOS -> 苹果，配对键 calendar_id。
- --dry-run 时完全不调用 JXA（连读操作也会触发权限弹窗），只解析 vault 侧并打印计划。
- 任何异常捕获后写日志、非 0 退出，不半写文件（frontmatter 只改目标字段所在行，
  文件写入统一走临时文件 + 原子替换）。

用法：
    python3 obos-apple-sync.py            # 正式同步
    python3 obos-apple-sync.py --dry-run   # 只打印计划，不落盘不调 JXA
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import date, datetime, time as dtime, timedelta
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
VAULT_ROOT = SCRIPT_DIR.parent.parent  # 90-System/Scripts -> 90-System -> RuruOS
LOG_PATH = Path.home() / "Library" / "Logs" / "obos-sync.log"

REMINDER_LIST_NAME = "RuruOS"
CALENDAR_NAME = "RuruOS"

KIND_TO_APPLE_PRIORITY = {"紧急": 1, "长期": 9}  # 其它（含 普通）-> 5


class SyncError(Exception):
    """任何导致同步中止的异常，统一在此包裹后记日志、非 0 退出。"""


# --------------------------------------------------------------------------
# frontmatter：只解析/改写固定简单格式，改字段只动目标行，其余原样保留
# --------------------------------------------------------------------------

FM_RE = re.compile(r"^---\n(.*?)\n---\n?(.*)$", re.S)
LINE_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*):\s?(.*)$")

# 写回时加双引号的字段（字符串型，可能含空格/特殊字符）；其余字段原样写数值/日期/布尔
QUOTED_FIELDS = {"title", "location", "reminder_id", "calendar_id"}


def unquote(raw: str) -> str:
    raw = raw.strip()
    if len(raw) >= 2 and raw[0] == raw[-1] and raw[0] in "\"'":
        return raw[1:-1]
    return raw


def render_value(key: str, value) -> str:
    if key in QUOTED_FIELDS:
        v = "" if value is None else str(value)
        v = v.replace('"', "")
        return f'"{v}"'
    if isinstance(value, bool):
        return "true" if value else "false"
    return "" if value is None else str(value)


def sanitize_filename(name: str, maxlen: int = 60) -> str:
    name = re.sub(r'[\\/:*?"<>|#^\[\]]', "", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name[:maxlen].strip() or "untitled"


def unique_path(directory: Path, base_name: str) -> Path:
    candidate = directory / f"{base_name}.md"
    if not candidate.exists():
        return candidate
    n = 2
    while True:
        candidate = directory / f"{base_name} ({n}).md"
        if not candidate.exists():
            return candidate
        n += 1


class Note:
    """一篇 Tasks/Calendar 笔记的 frontmatter 视图。改字段只重写该行，其余行原样保留。"""

    def __init__(self, path: Path):
        self.path = path
        text = path.read_text(encoding="utf-8")
        m = FM_RE.match(text)
        if not m:
            raise SyncError(f"frontmatter 格式不合法，跳过全库同步: {path}")
        self.lines = m.group(1).split("\n")
        self.body = m.group(2)
        self._index: dict[str, int] = {}
        for i, line in enumerate(self.lines):
            mm = LINE_RE.match(line)
            if mm:
                self._index[mm.group(1)] = i

    def get(self, key: str, default: str = "") -> str:
        idx = self._index.get(key)
        if idx is None:
            return default
        line = self.lines[idx]
        raw = line.split(":", 1)[1] if ":" in line else ""
        return unquote(raw)

    def get_bool(self, key: str, default: bool = False) -> bool:
        if key not in self._index:
            return default
        return self.get(key).strip().lower() == "true"

    def set(self, key: str, value) -> bool:
        """返回是否真的改动了该行（内容相同则不算改动，用于幂等判断）。"""
        rendered = render_value(key, value)
        line = f"{key}: {rendered}"
        idx = self._index.get(key)
        if idx is not None:
            if self.lines[idx] == line:
                return False
            self.lines[idx] = line
            return True
        self._index[key] = len(self.lines)
        self.lines.append(line)
        return True

    def dump(self) -> str:
        return "---\n" + "\n".join(self.lines) + "\n---\n" + self.body

    def save(self) -> None:
        tmp = self.path.with_name(self.path.name + ".tmp")
        tmp.write_text(self.dump(), encoding="utf-8")
        tmp.replace(self.path)


def load_notes(directory: Path) -> list[Note]:
    notes = []
    for f in sorted(directory.glob("*.md")):
        notes.append(Note(f))
    return notes


def write_new_note(path: Path, fm_lines: list[str]) -> None:
    text = "---\n" + "\n".join(fm_lines) + "\n---\n"
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)


# --------------------------------------------------------------------------
# 日期/时间：一律走 datetime 做加减，避免手写进位 bug；对苹果侧一律传本地
# 年/月/日/时/分分量（不传 ISO 字符串），JXA 端用 `new Date(y, mo-1, d, h, mi)`
# 本地构造，彻底绕开时区解析歧义。
# --------------------------------------------------------------------------


def parse_date_only(s: str) -> date:
    return datetime.strptime(s[:10], "%Y-%m-%d").date()


def parse_datetime(s: str) -> datetime:
    return datetime.strptime(s[:16], "%Y-%m-%dT%H:%M")


def today_str() -> str:
    return date.today().strftime("%Y-%m-%d")


def apple_priority_for_kind(kind: str) -> int:
    return KIND_TO_APPLE_PRIORITY.get(kind, 5)


def due_components(due_raw: str):
    """任务 due -> 提醒 dueDate 分量（当天 09:00），空则 None（不设提醒日期）。"""
    if not due_raw:
        return None
    d = parse_date_only(due_raw)
    return {"y": d.year, "mo": d.month, "d": d.day, "h": 9, "mi": 0}


def dt_components(dt: datetime):
    return {"y": dt.year, "mo": dt.month, "d": dt.day, "h": dt.hour, "mi": dt.minute}


def event_fields_from_note(note: Note) -> dict:
    """把笔记的 start/end/location/title 换算成苹果日历应有的字段。

    start 无 'T' -> 全天事件：endDate 按苹果全天事件惯例取（结束日+1天）00:00（半开区间）。
    start 有 'T' -> 定时事件：end 空则 start+1小时。
    """
    start_raw = note.get("start")
    end_raw = note.get("end")
    if not start_raw:
        raise SyncError(f"日程笔记缺少 start: {note.path}")
    allday = "T" not in start_raw
    if allday:
        start_date = parse_date_only(start_raw)
        end_date = parse_date_only(end_raw) if end_raw else start_date
        start_dt = datetime.combine(start_date, dtime(0, 0))
        end_dt = datetime.combine(end_date + timedelta(days=1), dtime(0, 0))
    else:
        start_dt = parse_datetime(start_raw)
        end_dt = parse_datetime(end_raw) if end_raw else start_dt + timedelta(hours=1)
    return {
        "summary": note.get("title"),
        "allday": allday,
        "start": start_dt,
        "end": end_dt,
        "location": note.get("location"),
    }


# --------------------------------------------------------------------------
# JXA：内嵌脚本字符串，通过 `osascript -l JavaScript -e <script> <argv...>` 调用，
# JXA 里把结果 JSON.stringify 后作为 run() 返回值，即 osascript 的 stdout。
# --------------------------------------------------------------------------

SNAPSHOT_JXA = r"""
function run(argv) {
  const RemindersApp = Application('Reminders');
  const CalApp = Application('Calendar');

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function fmtDateTime(d) {
    return fmtDate(d) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function ensureList(name) {
    const lists = RemindersApp.lists();
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name() === name) return lists[i];
    }
    const l = RemindersApp.List({ name: name });
    RemindersApp.lists.push(l);
    return l;
  }

  function ensureCalendar(name) {
    const cals = CalApp.calendars();
    for (let i = 0; i < cals.length; i++) {
      if (cals[i].name() === name) return cals[i];
    }
    const c = CalApp.Calendar({ name: name });
    CalApp.calendars.push(c);
    return c;
  }

  const list = ensureList('RuruOS');
  const calendar = ensureCalendar('RuruOS');

  const reminders = list.reminders().map(function (r) {
    const due = r.dueDate();
    return {
      id: r.id(),
      name: r.name(),
      due: due ? fmtDate(due) : null,
      completed: r.completed(),
      priority: r.priority()
    };
  });

  const events = calendar.events().map(function (e) {
    return {
      uid: e.uid(),
      summary: e.summary(),
      allday: e.alldayEvent(),
      start: fmtDateTime(e.startDate()),
      end: fmtDateTime(e.endDate()),
      location: e.location() || ''
    };
  });

  return JSON.stringify({ reminders: reminders, events: events });
}
"""

APPLY_ACTIONS_JXA = r"""
function run(argv) {
  const RemindersApp = Application('Reminders');
  const CalApp = Application('Calendar');

  function findList(name) {
    const lists = RemindersApp.lists();
    for (let i = 0; i < lists.length; i++) if (lists[i].name() === name) return lists[i];
    throw new Error('reminder list not found: ' + name);
  }
  function findCalendar(name) {
    const cals = CalApp.calendars();
    for (let i = 0; i < cals.length; i++) if (cals[i].name() === name) return cals[i];
    throw new Error('calendar not found: ' + name);
  }
  function findReminderById(list, id) {
    const rs = list.reminders();
    for (let i = 0; i < rs.length; i++) if (rs[i].id() === id) return rs[i];
    return null;
  }
  function findEventByUid(cal, uid) {
    const es = cal.events();
    for (let i = 0; i < es.length; i++) if (es[i].uid() === uid) return es[i];
    return null;
  }
  function dateFromParts(p) {
    return new Date(p.y, p.mo - 1, p.d, p.h, p.mi, 0, 0);
  }

  const input = JSON.parse(argv[0]);
  const list = findList('RuruOS');
  const calendar = findCalendar('RuruOS');

  const reminderResults = (input.reminder_actions || []).map(function (a) {
    try {
      if (a.type === 'create_reminder') {
        const r = RemindersApp.Reminder({ name: a.name });
        list.reminders.push(r);
        r.priority = a.priority;
        if (a.due) r.dueDate = dateFromParts(a.due);
        return { ok: true, ref: a.ref, id: r.id() };
      }
      if (a.type === 'update_reminder') {
        const r = findReminderById(list, a.id);
        if (!r) return { ok: false, ref: a.ref, error: 'reminder not found: ' + a.id };
        r.name = a.name;
        r.priority = a.priority;
        r.dueDate = a.due ? dateFromParts(a.due) : null;
        return { ok: true, ref: a.ref };
      }
      if (a.type === 'complete_reminder') {
        const r = findReminderById(list, a.id);
        if (!r) return { ok: false, ref: a.ref, error: 'reminder not found: ' + a.id };
        r.completed = true;
        return { ok: true, ref: a.ref };
      }
      return { ok: false, ref: a.ref, error: 'unknown reminder action: ' + a.type };
    } catch (err) {
      return { ok: false, ref: a.ref, error: String(err) };
    }
  });

  const eventResults = (input.event_actions || []).map(function (a) {
    try {
      if (a.type === 'create_event') {
        const e = CalApp.Event({
          summary: a.summary,
          startDate: dateFromParts(a.start),
          endDate: dateFromParts(a.end)
        });
        calendar.events.push(e);
        e.alldayEvent = a.allday;
        e.location = a.location || '';
        return { ok: true, ref: a.ref, uid: e.uid() };
      }
      if (a.type === 'update_event') {
        const e = findEventByUid(calendar, a.uid);
        if (!e) return { ok: false, ref: a.ref, error: 'event not found: ' + a.uid };
        e.summary = a.summary;
        e.startDate = dateFromParts(a.start);
        e.endDate = dateFromParts(a.end);
        e.alldayEvent = a.allday;
        e.location = a.location || '';
        return { ok: true, ref: a.ref };
      }
      if (a.type === 'delete_event') {
        const e = findEventByUid(calendar, a.uid);
        if (!e) return { ok: true, ref: a.ref, note: 'already gone' };
        CalApp.delete(e);
        return { ok: true, ref: a.ref };
      }
      return { ok: false, ref: a.ref, error: 'unknown event action: ' + a.type };
    } catch (err) {
      return { ok: false, ref: a.ref, error: String(err) };
    }
  });

  return JSON.stringify({ reminder_results: reminderResults, event_results: eventResults });
}
"""


def run_jxa(script: str, args: list[str]) -> dict:
    proc = subprocess.run(
        ["osascript", "-l", "JavaScript", "-e", script, *args],
        capture_output=True,
        text=True,
        timeout=120,
    )
    if proc.returncode != 0:
        raise SyncError(f"osascript 失败 (exit {proc.returncode}): {proc.stderr.strip()}")
    try:
        return json.loads(proc.stdout)
    except json.JSONDecodeError as e:
        raise SyncError(f"osascript 输出不是合法 JSON: {e}; stdout={proc.stdout[:500]!r}")


# --------------------------------------------------------------------------
# 日志
# --------------------------------------------------------------------------


class Logger:
    def __init__(self):
        self._lines: list[str] = []

    def action(self, msg: str) -> None:
        self._lines.append(msg)

    def _write(self, lines: list[str]) -> None:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with LOG_PATH.open("a", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")

    def flush(self, summary: str) -> None:
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        out = [f"[{ts}] {summary}"]
        out += [f"[{ts}]   - {l}" for l in self._lines]
        self._write(out)

    def error(self, summary: str) -> None:
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        out = [f"[{ts}] ERROR: {summary}"]
        if self._lines:
            out.append(f"[{ts}]   (中断前已规划、尚未确认执行的动作 {len(self._lines)} 条，未写入笔记/苹果侧)")
        self._write(out)


# --------------------------------------------------------------------------
# 同步主逻辑
# --------------------------------------------------------------------------


def do_sync(vault: Path, logger: Logger) -> int:
    tasks_dir = vault / "40-Life" / "Tasks"
    calendar_dir = vault / "40-Life" / "Calendar"
    task_notes = load_notes(tasks_dir)
    event_notes = load_notes(calendar_dir)

    snapshot = run_jxa(SNAPSHOT_JXA, [])
    reminders_by_id = {r["id"]: r for r in snapshot["reminders"]}
    events_by_uid = {e["uid"]: e for e in snapshot["events"]}

    claimed_reminder_ids = {n.get("reminder_id") for n in task_notes if n.get("reminder_id")}
    claimed_calendar_ids = {n.get("calendar_id") for n in event_notes if n.get("calendar_id")}

    reminder_actions: list[dict] = []
    event_actions: list[dict] = []
    ref_seq = 0
    ref_to_task_note: dict[int, Note] = {}
    ref_to_event_note: dict[int, Note] = {}
    pending_note_writes: list[Note] = []
    pending_new_files: list[tuple[Path, list[str]]] = []

    # ---- 待办 a/b/d ----
    for n in task_notes:
        rid = n.get("reminder_id")
        kind = n.get("kind") or "普通"
        desired_priority = apple_priority_for_kind(kind)

        if not rid:
            if not n.get_bool("done"):
                ref_seq += 1
                reminder_actions.append({
                    "ref": ref_seq,
                    "type": "create_reminder",
                    "name": n.get("title"),
                    "due": due_components(n.get("due")),
                    "priority": desired_priority,
                })
                ref_to_task_note[ref_seq] = n
                logger.action(f"[任务] 计划新建提醒: {n.path.name} -> {n.get('title')!r}")
            continue

        r = reminders_by_id.get(rid)
        if r is None:
            if n.set("reminder_id", ""):
                pending_note_writes.append(n)
            logger.action(f"[任务] 提醒已不存在，清空 reminder_id: {n.path.name}（曾指向 {rid}）")
            continue

        desired_due = n.get("due")[:10] if n.get("due") else ""
        actual_due = r["due"] or ""
        mismatch = (
            n.get("title") != r["name"]
            or desired_due != actual_due
            or desired_priority != r["priority"]
        )
        if mismatch:
            ref_seq += 1
            reminder_actions.append({
                "ref": ref_seq,
                "type": "update_reminder",
                "id": rid,
                "name": n.get("title"),
                "due": due_components(n.get("due")),
                "priority": desired_priority,
            })
            logger.action(f"[任务] 计划更新提醒（内容以 RuruOS 为准）: {n.path.name} ({rid})")

        if r["completed"] and not n.get_bool("done"):
            if n.set("done", True):
                pending_note_writes.append(n)
            logger.action(f"[任务] 完成状态同步（苹果->笔记）: {n.path.name} done=true")
        elif n.get_bool("done") and not r["completed"]:
            ref_seq += 1
            reminder_actions.append({"ref": ref_seq, "type": "complete_reminder", "id": rid})
            logger.action(f"[任务] 计划标记提醒完成（笔记->苹果）: {n.path.name} ({rid})")

    # ---- 待办 c：RuruOS 清单里存在、但没有任何笔记引用的提醒 -> 新建笔记 ----
    for r in snapshot["reminders"]:
        if r["id"] in claimed_reminder_ids:
            continue
        title = r["name"] or "未命名提醒"
        path = unique_path(tasks_dir, sanitize_filename(title))
        fm_lines = [
            "type: task",
            f'title: "{title.replace(chr(34), "")}"',
            f"due: {r['due'] or ''}",
            f"done: {'true' if r['completed'] else 'false'}",
            "priority: 中",
            "kind: 普通",
            f'reminder_id: "{r["id"]}"',
            f"added: {today_str()}",
        ]
        pending_new_files.append((path, fm_lines))
        logger.action(f"[任务] 苹果侧新提醒无对应笔记，计划新建: {path.name} ({r['id']})")

    # ---- 日程 a/b/c（+ 缺失兜底）----
    for n in event_notes:
        cid = n.get("calendar_id")
        fields = event_fields_from_note(n)

        if not cid:
            ref_seq += 1
            event_actions.append({
                "ref": ref_seq,
                "type": "create_event",
                "summary": fields["summary"],
                "allday": fields["allday"],
                "start": dt_components(fields["start"]),
                "end": dt_components(fields["end"]),
                "location": fields["location"],
            })
            ref_to_event_note[ref_seq] = n
            logger.action(f"[日程] 计划新建事件: {n.path.name} -> {fields['summary']!r}")
            continue

        e = events_by_uid.get(cid)
        if e is None:
            # 契约未明确定义此分支（笔记有 calendar_id 但苹果侧事件已不存在，例如被人工删除）。
            # 参照待办规则 (d) 的处理精神：清空配对字段并记日志，下次运行按 (a) 重新创建，
            # 不静默永久失配、也不做更激进的操作。
            if n.set("calendar_id", ""):
                pending_note_writes.append(n)
            logger.action(f"[日程] 事件已不存在，清空 calendar_id（下次运行按新建处理）: {n.path.name}（曾指向 {cid}）")
            continue

        actual_start = parse_datetime(e["start"])
        actual_end = parse_datetime(e["end"])
        mismatch = (
            fields["summary"] != e["summary"]
            or fields["allday"] != e["allday"]
            or fields["start"] != actual_start
            or fields["end"] != actual_end
            or fields["location"] != e["location"]
        )
        if mismatch:
            ref_seq += 1
            event_actions.append({
                "ref": ref_seq,
                "type": "update_event",
                "uid": cid,
                "summary": fields["summary"],
                "allday": fields["allday"],
                "start": dt_components(fields["start"]),
                "end": dt_components(fields["end"]),
                "location": fields["location"],
            })
            logger.action(f"[日程] 计划更新事件: {n.path.name} ({cid})")

    for e in snapshot["events"]:
        if e["uid"] in claimed_calendar_ids:
            continue
        ref_seq += 1
        event_actions.append({"ref": ref_seq, "type": "delete_event", "uid": e["uid"]})
        logger.action(f"[日程] 苹果侧孤儿事件无对应笔记，计划删除: {e['summary']!r} ({e['uid']})")

    had_errors = False

    if reminder_actions or event_actions:
        payload = json.dumps({"reminder_actions": reminder_actions, "event_actions": event_actions})
        result = run_jxa(APPLY_ACTIONS_JXA, [payload])

        for res in result.get("reminder_results", []):
            ref = res.get("ref")
            if not res.get("ok"):
                had_errors = True
                logger.action(f"[错误][任务] ref={ref}: {res.get('error')}")
                continue
            n = ref_to_task_note.get(ref)
            if n is not None and "id" in res:
                if n.set("reminder_id", res["id"]):
                    pending_note_writes.append(n)
                logger.action(f"[任务] 提醒已创建: {n.path.name} -> reminder_id={res['id']}")

        for res in result.get("event_results", []):
            ref = res.get("ref")
            if not res.get("ok"):
                had_errors = True
                logger.action(f"[错误][日程] ref={ref}: {res.get('error')}")
                continue
            n = ref_to_event_note.get(ref)
            if n is not None and "uid" in res:
                if n.set("calendar_id", res["uid"]):
                    pending_note_writes.append(n)
                logger.action(f"[日程] 事件已创建: {n.path.name} -> calendar_id={res['uid']}")

    # ---- 落盘：全部 JXA 调用都已完成才开始写文件，单文件写入走临时文件+原子替换 ----
    seen_ids = set()
    for n in pending_note_writes:
        if id(n) in seen_ids:
            continue
        seen_ids.add(id(n))
        n.save()
    for path, fm_lines in pending_new_files:
        write_new_note(path, fm_lines)

    summary = (
        f"同步完成: 提醒动作 {len(reminder_actions)} 个, 日历动作 {len(event_actions)} 个, "
        f"笔记写入 {len(seen_ids)} 个, 新建笔记 {len(pending_new_files)} 个"
        + (", 存在动作级错误（见上）" if had_errors else "")
    )
    logger.flush(summary)
    return 1 if had_errors else 0


def dry_run_plan(task_notes: list[Note], event_notes: list[Note]) -> None:
    to_create_reminders = [n for n in task_notes if not n.get("reminder_id") and not n.get_bool("done")]
    paired_tasks = [n for n in task_notes if n.get("reminder_id")]
    to_create_events = [n for n in event_notes if not n.get("calendar_id")]
    paired_events = [n for n in event_notes if n.get("calendar_id")]

    print(f"[dry-run] 待办笔记 {len(task_notes)} 篇，日程笔记 {len(event_notes)} 篇（不调用 JXA，不落盘）")
    print(f"[dry-run] 将新建提醒事项 {len(to_create_reminders)} 个：")
    for n in to_create_reminders:
        kind = n.get("kind") or "普通"
        print(
            f"  - {n.path.name}: title={n.get('title')!r} due={n.get('due') or '(无)'} "
            f"apple_priority={apple_priority_for_kind(kind)}"
        )
    print(f"[dry-run] 已配对提醒事项的笔记 {len(paired_tasks)} 篇（更新/完成同步/孤儿清理需苹果侧数据，dry-run 不评估）")

    print(f"[dry-run] 将新建日历事件 {len(to_create_events)} 个：")
    for n in to_create_events:
        fields = event_fields_from_note(n)
        print(
            f"  - {n.path.name}: title={fields['summary']!r} allday={fields['allday']} "
            f"start={fields['start']} end={fields['end']}"
        )
    print(f"[dry-run] 已配对日历事件的笔记 {len(paired_events)} 篇（更新/孤儿删除需苹果侧数据，dry-run 不评估）")


def main() -> int:
    parser = argparse.ArgumentParser(description="RuruOS <-> 苹果 提醒事项/日历 同步脚本")
    parser.add_argument(
        "--dry-run", action="store_true",
        help="只解析 vault 侧并打印计划，不调用 JXA（不触发权限弹窗），不写任何文件",
    )
    parser.add_argument(
        "--vault", default=str(VAULT_ROOT),
        help="vault 根目录（默认: 本脚本所在的 RuruOS vault）",
    )
    args = parser.parse_args()
    vault = Path(args.vault)

    if args.dry_run:
        task_notes = load_notes(vault / "40-Life" / "Tasks")
        event_notes = load_notes(vault / "40-Life" / "Calendar")
        dry_run_plan(task_notes, event_notes)
        return 0

    logger = Logger()
    try:
        return do_sync(vault, logger)
    except Exception as e:  # noqa: BLE001 - 顶层兜底，任何异常都要记日志、非 0 退出、不半写
        logger.error(f"同步异常中止: {type(e).__name__}: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
