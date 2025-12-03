# 邀请管理（InvitePage）后端对接说明

## 背景与目标
- 页面 `src/pages/InvitePage.tsx` 当前使用模拟数据，需与后端 OpenAPI 接口完成对接，满足“我的邀请码、邀请记录、我的后宫（被邀请用户）、统计概览、发送邀请、魔力值兑换、VIP与成就赠码”功能。
- 已存在的接口（如 InvitesService/Bonus/Store 等）字段不够完备或缺少专用端点，本说明明确：缺失接口、入参、响应期望、需补全字段与推荐契约规范。

## 页面数据模型（前端展示字段）
- 邀请码 InviteCode（见 `src/pages/InvitePage.tsx:5-13`）
  - id:string, code:string, status:'unused'|'used'|'expired', createdAt:string, usedAt?:string, usedBy?:string, expiresAt:string
- 邀请记录 SentInvite（`src/pages/InvitePage.tsx:15-24`）
  - id:string, code:string, recipientName:string, recipientEmail:string,
  - status:'registered'|'pending'|'expired', sentAt:string, registeredAt?:string, expiresAt:string
- 被邀请用户 InvitedUser（`src/pages/InvitePage.tsx:26-36`）
  - id:string, username:string, email:string, joinedAt:string,
  - uploadData:string, downloadData:string, shareRatio:string, status:'active'|'vip', inviteCode:string
- 概览统计（页面展示）：`totalInvites, usedInvites, remainingInvites, invitedUsers, magicPoints`
- 发送邀请弹窗入参：`recipientName, recipientEmail, selectedCode.code`

## 现有接口综述（已在仓库）
- Invites：`POST /invites/list`、`POST /invites/quota/list`、`POST /invites/send-private`、`POST /invites/resend`、`POST /invites/revoke`、`POST /invites/statistics`、`POST /invites/export`
- Bonus（魔力值）：`POST /bonus/overview`、`POST /bonus/balance`、`POST /bonus/ledger`
- Store（积分商城）：`POST /store/items/list`、`POST /store/purchase`、`POST /store/orders/detail`、`POST /store/orders/list`
- Dashboard：`GET /dashboard/me/summary`（含 `bonus` 简要）
- Levels（VIP等级）：`POST /levels/list-levels` 等（无“月度赠码”专用接口）

## 缺失/需补全的接口与字段

### 1. 我的邀请码列表（当前用户）
- 新增：`POST /invites/codes/list`
- 请求体：`{ page:number, limit:number, status?:'unused'|'used'|'expired' }`
- 响应（标准封装）：`{ code:0, message:'ok', data:{ items: InviteCode[], page:number, limit:number, total:number }, path, timestamp }`
- 需补全字段（后端返回 items 每项）：`id, code, status, createdAt, expiresAt, usedAt?, usedBy?`
- 说明：可与现有 `POST /invites/quota/list` 合并或保留为独立清单；前端用于“我的邀请码”卡片与可用数统计。

### 2. 发送邀请（弹窗）
- 现有：`POST /invites/send-private`
- 请求体（建议扩展）：`{ email:string, username:string, codeId?:string }`
  - 若提供 `codeId` 则使用该预生成邀请码；否则由后端生成并返回。
- 响应：`{ code:0, message:'ok', data:{ recordId:string, code:string, expiresAt?:string }, path, timestamp }`
- 同步通知（新增，可选）：`POST /notifications/send-invite`
  - 请求体：`{ recordId:string, code:string, recipientEmail:string, recipientName:string, channel:'inbox'|'email' }`
  - 响应：`{ code:0, data:{ delivered:boolean, messageId?:string } }`
- 需补全：`send-private` 的返回需包含 `code` 与（可选）`expiresAt`，以便弹窗提示与记录列表展示。

### 3. 邀请记录列表
- 新增：`POST /invites/records/list`
- 请求体：`{ page:number, limit:number, status?:'registered'|'pending'|'expired', email?:string, dateFrom?:string, dateTo?:string, sortBy?:'sentAt'|'expiresAt'|'registeredAt', order?:'ASC'|'DESC' }`
- 响应：`{ code:0, message:'ok', data:{ items: SentInvite[], page, limit, total }, path, timestamp }`
- 需补全字段：`id, code, recipientName, recipientEmail, status, sentAt, registeredAt?, expiresAt`
- 说明：可复用现有 `POST /invites/list`，但需明确 items 的字段结构与状态枚举对齐前端。

### 4. 我的后宫（被邀请用户列表）
- 新增：`POST /invites/my-users`
- 请求体：`{ page:number, limit:number, q?:string }`
- 响应：`{ code:0, message:'ok', data:{ items:[{ id, username, email, joinedAt, uploadedBytes:number, downloadedBytes:number, ratio:number, status:'active'|'vip', inviteCode:string }], page, limit, total }, path, timestamp }`
- 需补全字段：以数值 `uploadedBytes/downloadedBytes/ratio` 返回；前端负责格式化为 `TB`、`分享率` 小数。

### 5. 概览统计（顶部统计卡）
- 新增：`POST /invites/overview`
- 响应：`{ code:0, message:'ok', data:{ totalInvites:number, usedInvites:number, remainingInvites:number, invitedUsers:number }, path, timestamp }`
- 说明：`remainingInvites` 可来自 `quota`；`usedInvites/invitedUsers` 可聚合记录与用户表。`magicPoints` 由 Bonus 模块提供（见下一节）。

### 6. 魔力值与兑换邀请码
- 余额：复用 `POST /bonus/overview` 或 `POST /bonus/balance`，返回：`{ balance:number|string, updatedAt?:string }`
- 商品：复用 `POST /store/items/list`，需存在 `itemKey:'invite_code'`，字段：`{ id, key, title, type:'virtual', pricePoints:500, status, stock? }`
- 购买：复用 `POST /store/purchase`
  - 请求体：`{ itemKey:'invite_code', quantity:number, payload?:{ note?:string } }`
  - 响应需包含交付结果：`{ code:0, data:{ id, status:'success'|'pending', pointsCharged:number, quantity:number, deliveryResult:{ ok:boolean, code:string, recordId:string } } }`
- 订单详情：`POST /store/orders/detail` 可用于回查 `deliveryResult`
- 需补全：确保购买成功可得到 `deliveryResult.code`（邀请码）与 `recordId`；价格与库存策略可配。

### 7. VIP 特权（月度赠码）
- 新增：`POST /vip/status`
  - 响应：`{ code:0, data:{ levelKey:string, label:string, expiresAt?:string, active:boolean } }`
- 新增：`POST /vip/monthly-invites`
  - 响应：`{ code:0, data:{ month:string, granted:number, remaining:number, lastGrantedAt?:string } }`
- 升级：可新增 `POST /vip/upgrade` 或复用现有会员购买流程（若已存在商城项）。

### 8. 成就赠码与邀请返利
- 新增：`POST /achievements/list`
  - 响应：`{ code:0, data:{ items:[{ key, title, description, progress:number, goal:number, reward:{ invites:number } }] } }`
- 新增：`POST /achievements/claim`
  - 请求体：`{ key:string }`
  - 响应：`{ code:0, data:{ claimed:boolean, invitesGranted:number } }`
- 邀请返利规则（显示用）：`POST /invites/rewards/rules`
  - 响应：`{ code:0, data:{ rules:[{ condition:'upload>=1TB_by_invited_user', reward:{ invites:1 } }, { condition:'invited_user_vip', reward:{ invites:2 } }] } }`

### 9. 系统消息通知（站内信/邮件）
- 新增：`POST /notifications/send-invite`
  - 请求体：`{ recordId:string, code:string, recipientEmail:string, recipientName:string, channel:'inbox'|'email' }`
  - 响应：`{ code:0, data:{ delivered:boolean, messageId?:string, channel } }`
- 说明：也可在 `send-private` 内自动派发，若采用显式接口便于审计与重试。

## 契约与通用规范
- 响应封装：统一 `{ code:number, message:string, data:any, path?:string, timestamp?:string }`，`code=0` 表示成功。
- 时间：统一 ISO 8601（例如 `2025-12-01T10:00:00Z`）。
- 分页：`page:number, limit:number, total:number`；排序参数 `sortBy/order`。
- 字段枚举：前后端对齐上述枚举值；避免混用 `sent/accepted/expired` 与页面的 `registered/pending/expired`。
- 错误码：如 `1001_INVALID_EMAIL`、`1002_QUOTA_EXHAUSTED`、`1003_STORE_ITEM_UNAVAILABLE`、`1004_VIP_NOT_ACTIVE`。
- 幂等：`POST /store/purchase` 支持 `Idempotency-Key`；`send-private` 可接受可选 `Idempotency-Key` 避免重复发送。

## 示例（请求/响应）
- `POST /invites/codes/list`
```json
{ "page":1, "limit":10, "status":"unused" }
```
```json
{ "code":0, "message":"ok", "data":{ "items":[{ "id":"1","code":"MOVIE2024ABC123","status":"unused","createdAt":"2024-11-20T00:00:00Z","expiresAt":"2024-12-20T00:00:00Z" }], "page":1, "limit":10, "total":5 } }
```
- `POST /invites/send-private`
```json
{ "email":"zhangsan@email.com", "username":"张三", "codeId":"1" }
```
```json
{ "code":0, "message":"ok", "data":{ "recordId":"r_10001", "code":"MOVIE2024ABC123", "expiresAt":"2024-12-20T00:00:00Z" } }
```
- `POST /invites/my-users`
```json
{ "page":1, "limit":20 }
```
```json
{ "code":0, "message":"ok", "data":{ "items":[{ "id":"u_1","username":"MovieFan88","email":"moviefan88@email.com","joinedAt":"2024-11-08T00:00:00Z","uploadedBytes":2750000000000,"downloadedBytes":1200000000000,"ratio":2.15,"status":"active","inviteCode":"STREAM2024JKL012" }], "page":1, "limit":20, "total":8 } }
```
- `POST /store/purchase`
```json
{ "itemKey":"invite_code", "quantity":1 }
```
```json
{ "code":0, "message":"ok", "data":{ "id":"ord_20001", "status":"success", "pointsCharged":500, "quantity":1, "deliveryResult":{ "ok":true, "code":"NEW2024XYZ789", "recordId":"rec_30001" } } }
```

## 落地建议
- 优先补齐 `invites` 相关列表与发送的字段结构；新增 `my-users` 与 `overview` 两个端点满足页面核心展示。
- 兑换流程复用 `store` 模块，确保 `deliveryResult.code` 返回一致。
- VIP/成就相关端点作为第二阶段扩展；前端现阶段可显示静态文案或“自动发放”。
- 字段命名与枚举请与本文一致，以减少前端适配成本。