# 邀请管理（InvitePage）后端对接说明

## 背景与目标
- 页面 `src/pages/InvitePage.tsx` 当前使用模拟数据，需与后端 OpenAPI 接口完成对接，满足“我的邀请码、邀请记录、我的后宫（被邀请用户）、统计概览、发送邀请、魔力值兑换、VIP与成就赠码”功能。
- 已存在的接口（如 Invites/Bonus/Store 等）字段不够完备或缺少专用端点，本说明明确：缺失接口、入参、响应期望、需补全字段与推荐契约规范。

## 前端数据模型（展示字段）
- 邀请码 InviteCode（见 `src/pages/InvitePage.tsx:5-13`）
  - `id:string, code:string, status:'unused'|'used'|'expired', createdAt:string, usedAt?:string, usedBy?:string, expiresAt:string`
- 邀请记录 SentInvite（`src/pages/InvitePage.tsx:15-24`）
  - `id:string, code:string, recipientName:string, recipientEmail:string, status:'registered'|'pending'|'expired', sentAt:string, registeredAt?:string, expiresAt:string`
- 被邀请用户 InvitedUser（`src/pages/InvitePage.tsx:26-36`）
  - `id:string, username:string, email:string, joinedAt:string, uploadData:string, downloadData:string, shareRatio:string, status:'active'|'vip', inviteCode:string`
- 概览统计（页面展示）：`totalInvites, usedInvites, remainingInvites, invitedUsers, magicPoints`
- 发送邀请弹窗入参：`recipientName, recipientEmail, selectedCode.code`

## 现有接口综述（仓库已存在）
- Invites：`POST /invites/list`、`POST /invites/quota/list`、`POST /invites/send-private`、`POST /invites/resend`、`POST /invites/revoke`、`POST /invites/statistics`、`POST /invites/export`
- Bonus（魔力值）：`POST /bonus/overview`、`POST /bonus/balance`、`POST /bonus/ledger`
- Store（积分商城）：`POST /store/items/list`、`POST /store/purchase`、`POST /store/orders/detail`、`POST /store/orders/list`
- Dashboard：`GET /dashboard/me/summary`（含 `bonus` 简要）
- Levels（VIP等级）：`POST /levels/list-levels` 等（无“月度赠码”专用接口）

## 缺失/需补全的接口与字段

### 1. 我的邀请码列表（当前用户）
- 新增：`POST /invites/codes/list`
- 请求体：
```json
{ "page": 1, "limit": 10, "status": "unused" }
```
- 响应（标准封装）：
```json
{ "code":0, "message":"ok", "data":{ "items": [
  { "id":"1", "code":"MOVIE2024ABC123", "status":"unused", "createdAt":"2024-11-20T00:00:00Z", "expiresAt":"2024-12-20T00:00:00Z", "usedAt": null, "usedBy": null }
], "page":1, "limit":10, "total":5 }, "path":"/invites/codes/list", "timestamp":"2025-12-01T10:00:00Z" }
```
- 需补全字段：`id, code, status, createdAt, expiresAt, usedAt?, usedBy?`
- 说明：可与现有 `POST /invites/quota/list` 合并或保留为独立清单；前端用于“我的邀请码”卡片与可用数统计。

### 2. 发送邀请（弹窗）
- 现有：`POST /invites/send-private`
- 请求体（建议扩展）：
```json
{ "email":"zhangsan@email.com", "username":"张三", "codeId":"1" }
```
  - 若提供 `codeId` 则使用该预生成邀请码；否则由后端生成并返回。
- 响应：
```json
{ "code":0, "message":"ok", "data":{ "recordId":"r_10001", "code":"MOVIE2024ABC123", "expiresAt":"2024-12-20T00:00:00Z" }, "path":"/invites/send-private", "timestamp":"2025-12-01T10:00:00Z" }
```
- 同步通知（新增，可选）：`POST /notifications/send-invite`
  - 请求体：
```json
{ "recordId":"r_10001", "code":"MOVIE2024ABC123", "recipientEmail":"zhangsan@email.com", "recipientName":"张三", "channel":"inbox" }
```
  - 响应：
```json
{ "code":0, "message":"ok", "data":{ "delivered":true, "messageId":"msg_888", "channel":"inbox" } }
```
- 需补全：`send-private` 的返回需包含 `code` 与（可选）`expiresAt`，以便弹窗提示与记录列表展示。

### 3. 邀请记录列表
- 新增：`POST /invites/records/list`
- 请求体：
```json
{ "page":1, "limit":20, "status":"pending", "email":"user123@email.com", "dateFrom":"2024-11-01T00:00:00Z", "dateTo":"2024-12-01T00:00:00Z", "sortBy":"sentAt", "order":"DESC" }
```
- 响应：
```json
{ "code":0, "message":"ok", "data":{ "items":[
  { "id":"2", "code":"VIDEO2024GHI789", "recipientName":"User123", "recipientEmail":"user123@email.com", "status":"registered", "sentAt":"2024-11-10T09:20:00Z", "registeredAt":"2024-11-12T16:45:00Z", "expiresAt":"2024-12-10T00:00:00Z" }
], "page":1, "limit":20, "total":6 } }
```
- 需补全字段：`id, code, recipientName, recipientEmail, status, sentAt, registeredAt?, expiresAt`
- 说明：可复用 `POST /invites/list`，但需明确 items 的字段结构与状态枚举对齐前端（页面使用 `registered/pending/expired`）。

### 4. 我的后宫（被邀请用户列表）
- 新增：`POST /invites/my-users`
- 请求体：
```json
{ "page":1, "limit":20, "q":"fan" }
```
- 响应（数值字段返回，前端格式化）：
```json
{ "code":0, "message":"ok", "data":{ "items":[
  { "id":"u_1", "username":"MovieFan88", "email":"moviefan88@email.com", "joinedAt":"2024-11-08T00:00:00Z", "uploadedBytes":2750000000000, "downloadedBytes":1200000000000, "ratio":2.15, "status":"active", "inviteCode":"STREAM2024JKL012" }
], "page":1, "limit":20, "total":8 } }
```
- 需补全字段：`uploadedBytes, downloadedBytes, ratio` 为数值；前端负责显示 `TB` 与小数。

### 5. 概览统计（顶部统计卡）
- 新增：`POST /invites/overview`
- 响应：
```json
{ "code":0, "message":"ok", "data":{ "totalInvites":15, "usedInvites":8, "remainingInvites":7, "invitedUsers":8 }, "path":"/invites/overview" }
```
- 说明：`remainingInvites` 来自 `quota`；`usedInvites/invitedUsers` 聚合记录与用户表。`magicPoints` 由 Bonus 模块提供（下一节）。

### 6. 魔力值与兑换邀请码
- 余额：复用 `POST /bonus/overview` 或 `POST /bonus/balance`，返回：
```json
{ "code":0, "data":{ "balance":12580, "updatedAt":"2025-12-01T10:00:00Z" } }
```
- 商品：复用 `POST /store/items/list`，需存在 `itemKey:"invite_code"`，字段：`{ id, key, title, type:"virtual", pricePoints:500, status, stock? }`
- 购买：复用 `POST /store/purchase`
```json
{ "itemKey":"invite_code", "quantity":1 }
```
- 响应需包含交付结果：
```json
{ "code":0, "message":"ok", "data":{ "id":"ord_20001", "status":"success", "pointsCharged":500, "quantity":1, "deliveryResult":{ "ok":true, "code":"NEW2024XYZ789", "recordId":"rec_30001" } } }
```
- 订单详情：`POST /store/orders/detail` 可用于回查 `deliveryResult`
- 需补全：确保购买成功可得到 `deliveryResult.code`（邀请码）与 `recordId`；价格与库存策略可配。

### 7. VIP 特权（月度赠码）
- 新增：`POST /vip/status`
```json
{ "code":0, "data":{ "levelKey":"vip_plus", "label":"高级VIP", "expiresAt":"2026-01-01T00:00:00Z", "active":true } }
```
- 新增：`POST /vip/monthly-invites`
```json
{ "code":0, "data":{ "month":"2025-12", "granted":10, "remaining":10, "lastGrantedAt":"2025-12-01T00:00:00Z" } }
```
- 升级：可新增 `POST /vip/upgrade` 或复用商城商品（若已存在）。

### 8. 成就赠码与邀请返利
- 新增：`POST /achievements/list`
```json
{ "code":0, "data":{ "items":[
  { "key":"upload_10tb", "title":"上传量达到 10TB", "description":"累计上传≥10TB", "progress":8.5, "goal":10, "reward":{ "invites":2 } },
  { "key":"ratio_3", "title":"分享率达到 3.0", "description":"分享率≥3", "progress":2.15, "goal":3, "reward":{ "invites":1 } }
] } }
```
- 新增：`POST /achievements/claim`
```json
{ "key":"upload_10tb" }
```
```json
{ "code":0, "data":{ "claimed":true, "invitesGranted":2 } }
```
- 邀请返利规则（显示用）：`POST /invites/rewards/rules`
```json
{ "code":0, "data":{ "rules":[
  { "condition":"invited_user_uploaded>=1TB", "reward":{ "invites":1 } },
  { "condition":"invited_user_vip", "reward":{ "invites":2 } }
] } }
```

### 9. 系统消息通知（站内信/邮件）
- 新增：`POST /notifications/send-invite`
- 请求体：
```json
{ "recordId":"r_10001", "code":"MOVIE2024ABC123", "recipientEmail":"zhangsan@email.com", "recipientName":"张三", "channel":"inbox" }
```
- 响应：
```json
{ "code":0, "data":{ "delivered":true, "messageId":"msg_888", "channel":"inbox" } }
```
- 说明：也可在 `send-private` 内自动派发，若采用显式接口便于审计与重试。

## 契约与通用规范
- 响应封装：统一 `{ code:number, message:string, data:any, path?:string, timestamp?:string }`，`code=0` 表示成功。
- 时间：统一 ISO 8601（例如 `2025-12-01T10:00:00Z`）。
- 分页：`page:number, limit:number, total:number`；排序参数 `sortBy/order`。
- 字段枚举：前后端对齐上述枚举值；避免混用 `sent/accepted/expired` 与页面的 `registered/pending/expired`。
- 错误码：如 `1001_INVALID_EMAIL`、`1002_QUOTA_EXHAUSTED`、`1003_STORE_ITEM_UNAVAILABLE`、`1004_VIP_NOT_ACTIVE`。
- 幂等：`POST /store/purchase` 支持 `Idempotency-Key`；`send-private` 可接受可选 `Idempotency-Key` 避免重复发送。

## 对接优先级与落地建议
- 优先补齐 `invites` 列表字段、`send-private` 返回内容；新增 `my-users` 与 `overview` 两端点满足页面核心展示。
- 兑换流程复用 `store` 模块，确保 `deliveryResult.code` 返回一致；价格建议固定为 `500`。
- VIP/成就相关端点作为第二阶段扩展；前端现阶段可显示静态文案或“自动发放”。
- 字段命名与枚举与本文保持一致，以减少前端适配成本与回归风险。
