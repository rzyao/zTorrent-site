# 重构 Tickets 后端接口补全文档

## 变更目标
- 将现有文档改为“后端对接说明”，删除/改写偏前端视角的“目标”段落。
- 明确列出当前缺失的接口、每个接口的请求参数与期望响应、校验与错误码、需要后端补全的工作项。

## 文档结构调整
- 标题：`Tickets 后端接口补全说明`
- 统一约定：认证、Content-Type、响应包裹体、时间与ID格式
- 缺失接口清单（总表）：逐项标注“需实现/可选”
- 接口规格（逐条）：
  - 路径与用途
  - 请求体字段（JSON Schema/示例）
  - 响应体结构（示例）
  - 校验规则与错误码
  - curl 示例（便于联调）
- 数据模型参考：`Ticket`/`TicketMessage`/`Attachment`（简化为后端需要的字段）
- 安全与幂等：附件大小与类型、`Idempotency-Key` 建议
- 交付与联调：完成后联调步骤与验证点

## 缺失接口清单（需实现）
1. `POST /tickets/list`：分页列表（筛选与搜索）
2. `POST /tickets/stats`：状态计数
3. `POST /tickets/detail`：详情与消息列表
4. `POST /tickets/create`：创建工单
5. `POST /tickets/attachments/upload`：上传附件（multipart/form-data）
6. `POST /tickets/reply`：回复工单
7. `POST /tickets/close`：关闭工单
8. `POST /tickets/confirm-resolved`：确认已解决并结案

## 每个接口将提供的规范内容（示例）
- 请求体（字段、类型、范围、是否必填）
- 响应体（包裹体 + `data` 结构）
- 业务校验（状态限制、长度限制、白名单）
- 错误码使用约定（400/401/403/404/409/413/415/500）
- curl 联调示例

## 执行步骤
1. 重写 `docs/tickets-api.md`：将“## 目标”改为“## 缺失接口清单与补全要求”，并整体替换内容为后端视角结构。
2. 为每个端点补充请求/响应示例与校验、错误码与 curl 示例。
3. 增补统一约定、数据模型参考、幂等与安全章节。

## 交付
- 输出更新后的 `docs/tickets-api.md`，后端可直接按文档实现与联调。