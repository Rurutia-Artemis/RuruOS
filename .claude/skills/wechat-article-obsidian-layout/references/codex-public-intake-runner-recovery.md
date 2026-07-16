# Codex 公开内容采集：runner 恢复与终态判断

用于小红书或其他公开网页优先交给 standalone Codex CLI，但 runner 在真正访问来源前失败的情况。

## 先区分两类失败

### Runner／配置失败

若日志在发起公开页面请求前就因模型、CLI、推理档位或可选 MCP 初始化退出，这不是“来源不可访问”。不得据此把队列项标成 blocked／needs_review。

常见安全恢复顺序：

1. 保持 canonical URL 和 public-only 边界不变。
2. 不在内容 intake 中擅自升级 CLI 或修改全局 Codex 配置；需要升级时交给负责环境维护的角色或用户本人。
3. 对单次运行选择当前 CLI 已支持的模型。
4. 若全局推理档位是旧别名或无效值，用单次覆盖，不污染全局配置：

```bash
codex exec -m <supported-model> \
  -c 'model_reasoning_effort="medium"' \
  '<narrow-public-only-task>'
```

支持值以当次错误或实时 CLI 为准；不要把 `max` 等旧别名固化进命令。

可选 MCP 的凭据警告本身不等于采集失败。若主任务能用公开 HTML 或其他无凭据后端继续，记录警告但继续；禁止为了消除警告临时接入账号、Cookie 或 API 密钥。

### 来源访问失败

只有 runner 真正请求 canonical URL 后，确认返回登录墙、验证码、错误页、空正文、缺失图片列表或其他不可验证状态，才进入 `needs_review`。保存：

- canonical URL；
- 实际公开响应状态／页面标题；
- 明确缺失的正文、作者、时间、图片；
- public-only／no-login／no-cookie／no-bypass 边界。

不得保存分享 token，也不得把站点标题、footer、空状态数据或残缺摘要伪装成完整文章。

## 队列终态语义

- `completed`：完整成品经父代理回读验证。
- `needs_review`：处理已终止，但内容不完整或公开来源不可验证；这是终态，却不是成功完成。
- `failed`：runner／流程在没有产出可复核记录时终止，或持久化／验证本身失败。

Summary 应分别统计 `completed`、`needs_review`、`failed`。对用户可说“全部处理结束”，但必须同时报告“完整入库 N、待复核 M”，不能把 `needs_review` 混进“成功完成 N”。

## 验证与记录

- 父代理回读 Queue note，确认 YAML、canonical URL、缺失范围和 review markers。
- 扫描 `xsec_token`、`shareRedId`、`share_id`、`code` 等分享参数为零。
- 附件为零时要与公开页面未给出图片列表一致，不能只相信 runner 摘要。
- 队列中记录每次 runner attempt 的 session ID 与简短 reason；runner 配置失败和来源访问失败分开写。
- 配置默认模型后，正在运行的 parent session 和已派发 worker 可能仍使用 spawn-time 模型；新会话／新 worker 才读取新默认值。需要当前入口立即切换时，明确提示新会话或 `/restart`，不要声称当前进程已热切换。
