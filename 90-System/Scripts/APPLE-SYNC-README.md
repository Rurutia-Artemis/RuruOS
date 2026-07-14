# RuruOS 苹果同步脚本（提醒事项 / 日历）

`obos-apple-sync.py` 把 `40-Life/Tasks/` 与苹果「提醒事项」的 `RuruOS` 清单双向同步，
把 `40-Life/Calendar/` 单向同步到苹果「日历」的 `RuruOS` 日历。仅用系统 Python3 标准库，
通过 `osascript -l JavaScript`（JXA）驱动两个 app。

## 装法

```bash
cp "/Users/rurutia/Documents/RuruCode/RuruOS/90-System/Scripts/com.lulu.obos-sync.plist" ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.lulu.obos-sync.plist
```

装好后每 5 分钟（`StartInterval 300`）跑一次，`RunAtLoad` 是 false，即装完不会立刻跑一次，
第一次触发在 5 分钟后（也可以手动跑一次，见下面「首次运行」）。

## 卸法

```bash
launchctl unload ~/Library/LaunchAgents/com.lulu.obos-sync.plist
rm ~/Library/LaunchAgents/com.lulu.obos-sync.plist
```

## 首次运行会弹两次权限

第一次真正调用 JXA 时，macOS 会分别为「提醒事项」和「日历」各弹一次访问权限确认框
（terminal / launchd 对应的进程需要被授权）。建议**先手动跑一次前台命令**看着弹窗点允许，
不要直接丢给 launchd 静默跑：

```bash
/usr/bin/python3 "/Users/rurutia/Documents/RuruCode/RuruOS/90-System/Scripts/obos-apple-sync.py"
```

如果拒绝了权限或者没点，脚本会在日志里记一条 `osascript 失败` 的错误并非 0 退出，
去 系统设置 → 隐私与安全性 → 提醒事项 / 日历 里手动补开即可，然后重新跑一次。

## 先看计划再动手：`--dry-run`

```bash
/usr/bin/python3 "/Users/rurutia/Documents/RuruCode/RuruOS/90-System/Scripts/obos-apple-sync.py" --dry-run
```

`--dry-run` 完全不调用 JXA（哪怕是读操作也会触发权限弹窗，所以干脆不调），只解析 vault 侧、
打印会新建哪些提醒/事件；已经配对过 `reminder_id` / `calendar_id` 的笔记需要苹果侧数据才能
判断是否要更新，dry-run 下只报数量、不展开评估。不落盘、不改任何文件。

## 日志

- 每次运行的摘要 + 每个动作，写在 `~/Library/Logs/obos-sync.log`（脚本自己 append 的业务日志）。
- launchd 的标准输出/错误（比如脚本本身崩溃、Python 报错追踪）在 `~/Library/Logs/obos-sync-launchd.log`。

## 同步契约摘要

**待办 `40-Life/Tasks/*.md`（双向，配对键 `reminder_id`，清单名 `RuruOS`）**

- 笔记无 `reminder_id` 且 `done: false` → 建提醒（`due` 当天 09:00，空则不设；`priority` 由
  `kind` 换算：紧急→1，长期→9，其它→5），把新提醒 id 写回 `reminder_id`。
- 笔记有 `reminder_id`：内容以 RuruOS 为准（title/due/priority 不一致就覆盖苹果侧）；
  完成状态以苹果为准（提醒 completed 但笔记 `done:false` → 笔记补 `done:true`；
  笔记 `done:true` 但提醒未完成 → 把提醒标记完成）。
- 苹果 `RuruOS` 清单里有、但没有任何笔记的 `reminder_id` 指向它 → 新建笔记
  （`kind: 普通`，`priority: 中`，`reminder_id` 填回该提醒 id，提醒已完成则 `done: true`）。
- 笔记有 `reminder_id` 但对应提醒已经找不到 → 只清空 `reminder_id` 并记日志，不删笔记、不改 `done`。

**日程 `40-Life/Calendar/*.md`（单向 RuruOS → 苹果，配对键 `calendar_id`，日历名 `RuruOS`）**

- 笔记无 `calendar_id` → 建事件（`start` 无时间 → 全天；`end` 空 → `start` +1 小时），
  新事件 uid 写回 `calendar_id`。
- 笔记有 `calendar_id` → 内容（标题/时间/地点）不一致就更新苹果侧。
- 苹果 `RuruOS` 日历里有、但没有任何笔记的 `calendar_id` 指向它 → 删除苹果侧该事件。
- （契约未明确覆盖的边界情况）笔记有 `calendar_id` 但对应事件已经找不到 → 参照待办的
  处理精神，清空 `calendar_id` 并记日志，下次运行会当作新笔记重新建一个事件。

## 已知风险 / 第一次真机跑时留意

- 清空提醒的 `dueDate`（从「有截止日期」改成「无」）在 JXA 里用 `r.dueDate = null` 实现，
  这一步在不同 macOS 版本上是 Reminders.app JXA 里出了名不太稳定的操作；如果这条路径报错，
  日志里会看到具体某个动作的 error，不影响其它动作，下次运行会重试。
- 全天事件的起止时间换算遵循苹果日历的惯例（`endDate` 取「结束日 +1 天」的 00:00，半开区间），
  没有用真机验证过跨年/跨月边界，理论上 `datetime` 加减是对的，但值得留意一次。
- 幂等性（连续跑两次第二次零动作）在纯 Python 侧的字段比较逻辑上做了单元测试，
  但依赖 JXA 读回来的字段格式跟预期一致——第一次真机跑完之后建议再跑一次确认第二次日志里
  动作数量是 0。
