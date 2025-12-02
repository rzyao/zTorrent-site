# Tickets 页面缺失接口整理与 API 文档

## 目标
- 整理 Tickets 页面所需但尚未存在的接口，统一为 `POST`，请求使用 `body` 传参（JSON；上传附件使用 `multipart/form-data`）。
- 生成面向后端的 Markdown 文档，明确每个端点的请求/响应、校验约束、错误码与示例，便于后端快速补齐。
- 说明前端改造点，后端完成后可按既有服务风格无缝接入。

## 前端现状与缺口
- 页面与路由：`/tickets`（列表、创建、详情与回复）。目前为静态模拟数据，无任何后端 API 对接。
- 需要的能力：
  - 列表与统计：分页、筛选（状态/分类）、关键词搜索；状态计数卡片。
  - 详情：拉取单工单详情及消息列表。
  - 创建：创建工单（标题/分类/优先级/正文），可选附件上传。
  - 回复与流转：在未关闭工单下回复；关闭工单；对“已解决”进行用户确认结案。

## 设计约定
- 统一约定
  - Base URL：`/api`
  - 认证：`Authorization: Bearer <token>`（如站点其它服务保持一致）
  - Content-Type：默认 `application/json`；附件上传为 `multipart/form-data`
  - 时间：ISO 8601 字符串（示例：`2025-12-02T10:15:30Z`）
  - ID：字符串（雪花/UUID 均可）
  - 枚举：
    - `TicketStatus`：`pending|processing|resolved|closed`
    - `TicketCategory`：`technical|account|resource|report|other`
    - `TicketPriority`：`low|normal|high|urgent`
    - `AuthorRole`：`user|staff`
- 统一响应包裹体（与现有服务保持一致）：
  - 成功：`{ code: 0, message: "OK", data, timestamp, path }`
  - 失败：`{ code, message, data?: null, timestamp, path }`
  - 常见错误码：`401 UNAUTHORIZED`、`400 INVALID_PARAMETERS`、`404 NOT_FOUND`、`409 CONFLICT`、`500 INTERNAL_ERROR`

## 数据模型
- Ticket
  - `id: string`
  - `title: string`
  - `category: TicketCategory`
  - `status: TicketStatus`
  - `priority: TicketPriority`
  - `createdAt: string`
  - `updatedAt: string`
  - `messages?: TicketMessage[]`
- TicketMessage
  - `id: string`
  - `author: string`
  - `authorRole: AuthorRole`
  - `content: string`
  - `timestamp: string`
  - `attachments?: Attachment[]`
- Attachment
  - `attachmentId: string`
  - `url: string`
  - `name: string`
  - `size: number`
  - `uploadedAt: string`

## 端点清单（全部 POST + body）

### 1) 获取工单列表
- Path：`/tickets/list`
- Auth：需要
- Request（JSON）：
```
{
  "page": 1,
  "pageSize": 20,
  "status": "pending|processing|resolved|closed", // 可选
  "category": "technical|account|resource|report|other", // 可选
  "keyword": "字符串" // 可选，匹配标题/正文
}
```
- Response：
```
{
  "code": 0,
  "message": "OK",
  "data": {
    "page": 1,
    "pageSize": 20,
    "total": 123,
    "items": [Ticket, ...]
  },
  "timestamp": "...",
  "path": "/tickets/list"
}
```
- 业务规则：按创建时间倒序；`keyword` 对标题与首条消息内容进行 LIKE/全文检索。
- 错误码：`400`（分页参数非法）；`401`；`500`
- 示例请求：
```
POST /api/tickets/list
Content-Type: application/json
Authorization: Bearer <token>

{"page":1,"pageSize":20,"status":"pending"}
```

### 2) 获取状态统计
- Path：`/tickets/stats`
- Auth：需要
- Request（JSON）：`{}`
- Response：
```
{
  "code": 0,
  "message": "OK",
  "data": {
    "pending": 10,
    "processing": 5,
    "resolved": 2,
    "closed": 20
  },
  "timestamp": "...",
  "path": "/tickets/stats"
}
```
- 业务规则：统计当前用户可见工单的状态分布。

### 3) 获取工单详情
- Path：`/tickets/detail`
- Auth：需要
- Request（JSON）：
```
{ "ticketId": "string" }
```
- Response：
```
{
  "code": 0,
  "message": "OK",
  "data": Ticket,
  "timestamp": "...",
  "path": "/tickets/detail"
}
```
- 错误码：`404`（不存在或无权限）；`401`

### 4) 创建工单
- Path：`/tickets/create`
- Auth：需要
- Request（JSON）：
```
{
  "title": "string",
  "category": "technical|account|resource|report|other",
  "priority": "low|normal|high|urgent",
  "content": "string",
  "attachments": [ // 可选，若先走上传接口则传返回的附件对象
    { "attachmentId": "string", "url": "string", "name": "string", "size": 12345 }
  ]
}
```
- Response：
```
{
  "code": 0,
  "message": "OK",
  "data": { "ticketId": "string" },
  "timestamp": "...",
  "path": "/tickets/create"
}
```
- 校验：`title` 1~120；`content` 1~5000；附件大小与类型白名单（如 `png,jpg,pdf,txt`）。

### 5) 上传附件
- Path：`/tickets/attachments/upload`
- Auth：需要
- Request（multipart/form-data）：
  - `ticketId`（可选，用于回复时绑定已有工单；创建时可不传）
  - `purpose`: `create|reply`
  - `file`: 二进制文件
- Response：
```
{
  "code": 0,
  "message": "OK",
  "data": { "attachmentId": "string", "url": "string", "name": "string", "size": 12345 },
  "timestamp": "...",
  "path": "/tickets/attachments/upload"
}
```
- 约束：单文件 ≤ 10MB（示例）；类型白名单；病毒/安全扫描（可选）。

### 6) 回复工单
- Path：`/tickets/reply`
- Auth：需要
- Request（JSON）：
```
{
  "ticketId": "string",
  "content": "string",
  "attachments": [ { "attachmentId": "string", "url": "string", "name": "string", "size": 12345 } ]
}
```
- Response：
```
{
  "code": 0,
  "message": "OK",
  "data": { "messageId": "string" },
  "timestamp": "...",
  "path": "/tickets/reply"
}
```
- 业务规则：仅当 `status != closed` 时允许回复；用户端只能以 `authorRole=user` 追加消息。

### 7) 关闭工单
- Path：`/tickets/close`
- Auth：需要
- Request（JSON）：
```
{ "ticketId": "string", "reason": "string" }
```
- Response：
```
{
  "code": 0,
  "message": "OK",
  "data": { "status": "closed" },
  "timestamp": "...",
  "path": "/tickets/close"
}
```
- 业务规则：用户可关闭自己的工单；关闭后不可再回复。

### 8) 确认已解决（结案）
- Path：`/tickets/confirm-resolved`
- Auth：需要
- Request（JSON）：
```
{ "ticketId": "string" }
```
- Response：
```
{
  "code": 0,
  "message": "OK",
  "data": { "status": "closed" },
  "timestamp": "...",
  "path": "/tickets/confirm-resolved"
}
```
- 业务规则：仅当当前状态为 `resolved` 时允许；状态迁移 `resolved -> closed`。

## 状态机建议
- 允许的迁移：
  - `pending -> processing -> resolved -> closed`
  - 用户行为：`pending|processing` 下可回复；`resolved` 下可“确认已解决”；任何状态下用户可主动 `close`。
  - 管理端（后续可选）：允许调整优先级与回退状态。

## 前端接入与改造点
- 新增 `TicketsService`（与现有 `AuthService/BonusService` 风格一致），方法：
  - `list`, `stats`, `detail`, `create`, `uploadAttachment`, `reply`, `close`, `confirmResolved`
- 将列表页与统计卡片的数据源替换为 `/tickets/list` 与 `/tickets/stats`。
- 创建页：先走附件上传（如有），随后 `/tickets/create`；成功后跳转详情。
- 详情页：用 `/tickets/detail` 拉取；回复调用 `/tickets/reply`；关闭与确认结案分别调用对应端点。
- 错误处理：沿用全局响应包裹体与 Toast/UI 交互。

## 交付
- 我将把以上内容生成成 `docs/tickets-api.md` 文件并提交到仓库，供后端对照实现（待你确认后执行）。
