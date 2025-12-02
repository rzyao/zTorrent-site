# Tickets 后端接口补全说明

## 缺失接口清单与补全要求
- 本文为后端实现参考，明确当前缺失的接口与补全规范：
  - 所有接口统一使用 `POST`，`body` 传参（JSON；仅附件上传使用 `multipart/form-data`）。
  - 需实现端点：
    1. `/tickets/list`（分页列表，筛选、搜索）
    2. `/tickets/stats`（状态计数）
    3. `/tickets/detail`（详情含消息）
    4. `/tickets/create`（创建工单）
    5. `/tickets/attachments/upload`（附件上传）
    6. `/tickets/reply`（回复消息）
    7. `/tickets/close`（关闭工单）
    8. `/tickets/confirm-resolved`（确认已解决并结案）
  - 每个端点下方提供：请求参数、期望响应、校验与错误码、curl 示例。

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

### 认证与权限
- 用户仅能访问自己创建或被授权可见的工单与消息。
- 回复权限：`status != closed` 时允许；用户端仅可 `authorRole=user`。
- 关闭/确认结案：仅工单创建者或被授权用户可执行。
- 后台管理权限（后续可选）：允许回退状态与调整优先级。

### 错误码约定
- `0`：成功
- `400`：参数校验失败（字段缺失、枚举非法、长度超限、分页非法等）
- `401`：未认证或令牌失效
- `403`：无访问权限（越权访问他人工单）
- `404`：资源不存在
- `409`：状态冲突（如已关闭仍尝试回复；非 resolved 状态确认结案）
- `413`：上传文件过大（如 > 10MB）
- `415`：上传文件类型不支持
- `500`：服务器内部错误

### 幂等性与重试
- 创建与回复建议支持幂等键：
  - 请求头：`Idempotency-Key: <uuid>` 或请求体携带 `clientRequestId`
  - 后端 5 分钟窗口内保障幂等，返回同一结果
- 前端重试：网络失败时可重试，后端以幂等键去重。

### 安全与合规
- 附件上传建议进行类型白名单与大小限制，并进行安全扫描（恶意文件拦截）。
- 记录审计日志：创建、回复、关闭、结案变更均记录操作者与时间。
- 速率限制：接口层面对同用户进行合理限流（如 60 req/min）。

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

### JSON Schema（参考）
```
// Ticket
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id","title","category","status","priority","createdAt","updatedAt"],
  "properties": {
    "id": {"type": "string"},
    "title": {"type": "string", "minLength": 1, "maxLength": 120},
    "category": {"type": "string", "enum": ["technical","account","resource","report","other"]},
    "status": {"type": "string", "enum": ["pending","processing","resolved","closed"]},
    "priority": {"type": "string", "enum": ["low","normal","high","urgent"]},
    "createdAt": {"type": "string", "format": "date-time"},
    "updatedAt": {"type": "string", "format": "date-time"},
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id","author","authorRole","content","timestamp"],
        "properties": {
          "id": {"type": "string"},
          "author": {"type": "string"},
          "authorRole": {"type": "string", "enum": ["user","staff"]},
          "content": {"type": "string", "minLength": 1, "maxLength": 5000},
          "timestamp": {"type": "string", "format": "date-time"},
          "attachments": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["attachmentId","url","name","size"],
              "properties": {
                "attachmentId": {"type": "string"},
                "url": {"type": "string"},
                "name": {"type": "string"},
                "size": {"type": "number", "minimum": 0}
              }
            }
          }
        }
      }
    }
  }
}
```

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
    "items": [
      {
        "id": "TK-202512-0001",
        "title": "无法访问资源库",
        "category": "resource",
        "status": "pending",
        "priority": "high",
        "createdAt": "2025-12-01T08:00:00Z",
        "updatedAt": "2025-12-01T08:00:00Z"
      }
    ]
  },
  "timestamp": "2025-12-02T10:15:30Z",
  "path": "/tickets/list"
}
```
- 业务规则：按创建时间倒序；`keyword` 对标题与首条消息内容进行 LIKE/全文检索。
- 错误码：`400`（分页参数非法）；`401`；`500`
- 示例请求：
```
# curl
curl -X POST "https://example.com/api/tickets/list" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"page":1,"pageSize":20,"status":"pending","keyword":"资源库"}'
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
  "timestamp": "2025-12-02T10:15:30Z",
  "path": "/tickets/stats"
}
```
- 业务规则：统计当前用户可见工单的状态分布。
```
# curl
curl -X POST "https://example.com/api/tickets/stats" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

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
  "data": {
    "id": "TK-202512-0001",
    "title": "无法访问资源库",
    "category": "resource",
    "status": "processing",
    "priority": "high",
    "createdAt": "2025-12-01T08:00:00Z",
    "updatedAt": "2025-12-02T09:00:00Z",
    "messages": [
      {
        "id": "MSG-1",
        "author": "Alice",
        "authorRole": "user",
        "content": "打开页面报 403。",
        "timestamp": "2025-12-01T08:00:00Z"
      },
      {
        "id": "MSG-2",
        "author": "Bob",
        "authorRole": "staff",
        "content": "已修复权限配置，请重试。",
        "timestamp": "2025-12-02T08:30:00Z"
      }
    ]
  },
  "timestamp": "2025-12-02T10:15:30Z",
  "path": "/tickets/detail"
}
```
- 错误码：`404`（不存在或无权限）；`401`
```
# curl
curl -X POST "https://example.com/api/tickets/detail" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ticketId":"TK-202512-0001"}'
```

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
  "data": { "ticketId": "TK-202512-0002" },
  "timestamp": "2025-12-02T10:15:30Z",
  "path": "/tickets/create"
}
```
- 校验：`title` 1~120；`content` 1~5000；附件大小与类型白名单（如 `png,jpg,pdf,txt`）。
```
# curl
curl -X POST "https://example.com/api/tickets/create" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 7a2c29a5-1f7f-4e2b-9e1c-1c8e0f8a1c01" \
  -d '{
    "title":"无法访问资源库",
    "category":"resource",
    "priority":"high",
    "content":"打开页面报 403",
    "attachments":[{"attachmentId":"ATT-202512-0001","url":"https://.../att.pdf","name":"att.pdf","size":98765}]
  }'
```

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
  "data": { "attachmentId": "ATT-202512-0001", "url": "https://.../att.pdf", "name": "att.pdf", "size": 98765 },
  "timestamp": "2025-12-02T10:15:30Z",
  "path": "/tickets/attachments/upload"
}
```
- 约束：单文件 ≤ 10MB（示例）；类型白名单；病毒/安全扫描（可选）。
```
# curl（multipart）
curl -X POST "https://example.com/api/tickets/attachments/upload" \
  -H "Authorization: Bearer <token>" \
  -F "purpose=create" \
  -F "file=@./att.pdf"
```

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
  "data": { "messageId": "MSG-202512-0003" },
  "timestamp": "2025-12-02T10:15:30Z",
  "path": "/tickets/reply"
}
```
- 业务规则：仅当 `status != closed` 时允许回复；用户端只能以 `authorRole=user` 追加消息。
```
# curl
curl -X POST "https://example.com/api/tickets/reply" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 0baf5d0e-4c7e-4b98-a0f1-0580a3f4cd9a" \
  -d '{
    "ticketId":"TK-202512-0001",
    "content":"已按建议重试，问题已缓解",
    "attachments":[]
  }'
```

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
  "timestamp": "2025-12-02T10:15:30Z",
  "path": "/tickets/close"
}
```
- 业务规则：用户可关闭自己的工单；关闭后不可再回复。
```
# curl
curl -X POST "https://example.com/api/tickets/close" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ticketId":"TK-202512-0001","reason":"问题已解决"}'
```

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
  "timestamp": "2025-12-02T10:15:30Z",
  "path": "/tickets/confirm-resolved"
}
```
- 业务规则：仅当当前状态为 `resolved` 时允许；状态迁移 `resolved -> closed`。
```
# curl
curl -X POST "https://example.com/api/tickets/confirm-resolved" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ticketId":"TK-202512-0001"}'
```

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

## 后端实现提示
- 分页：建议使用 `OFFSET/LIMIT` 或游标；返回 `total` 便于前端分页。
- 搜索：`keyword` 对标题与首条消息内容进行模糊匹配或全文索引（如 PostgreSQL tsvector）。
- 事务：创建与回复包含消息与附件关联写入，需事务保证一致性。
- 附件存储：对象存储（S3/OSS/MinIO），返回可访问 URL（受控权限）；支持预签名 URL（可选）。
- 审计：持久化操作日志（用户、时间、动作、工单ID、变更内容）。
- 监控：接口埋点 QPS、错误率与耗时；异常栈打点。

## 变更记录
- v1.0（2025-12-02）：初版草案。
- v1.1（2025-12-02）：补充认证/权限、错误码、幂等性、安全、JSON Schema 与 curl 示例。
