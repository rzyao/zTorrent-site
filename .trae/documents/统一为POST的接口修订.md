# Bonus 接口统一使用 POST 与 Body 传参的修订方案

## 改动原则
- 所有读取与写入接口统一改为 `POST`，参数通过 JSON `body` 传递，`Content-Type: application/json`。
- 认证方式不变：`Authorization: Bearer <JWT>`。
- 分页与筛选参数统一在 `body` 中传入。
- 语义保持：查询类接口虽改为 `POST`，但不产生副作用；写入类接口继续保证幂等设计。

## 接口变更清单

### 积分概览
- 原：`GET /bonus/overview`
- 现：`POST /bonus/overview`
- 请求 Body：
```json
{}
```
- 响应：与原文档一致（`balance`、`totalEarned`、`totalSpent`、`monthTrend`、`rank`、`updatedAt`）。

### 订单详情（交付结果）
- 原：`GET /store/orders/:id`
- 现：`POST /store/orders/detail`
- 请求 Body：
```json
{ "id": "ord_123" }
```
- 响应：与原文档一致（`status`、`amount`、`deliveryResult` 等）。

### 订单列表（个人）
- 原：`GET /store/orders`
- 现：`POST /store/orders/list`
- 请求 Body：
```json
{
  "page": 1,
  "pageSize": 20,
  "status": "pending|delivered|failed",
  "itemType": "invite_code|license_key|external_link",
  "dateStart": "2025-11-01T00:00:00Z",
  "dateEnd": "2025-11-30T23:59:59Z"
}
```
- 响应：分页结构与原一致（`page`、`pageSize`、`total`、`items`）。

### 积分流水（扩展建议）
- 原：`GET /bonus/ledger`
- 现：`POST /bonus/ledger`
- 请求 Body：
```json
{
  "page": 1,
  "pageSize": 20,
  "type": "earn|spend",
  "category": "purchase|reward|refund|adjust",
  "dateStart": "2025-11-01T00:00:00Z",
  "dateEnd": "2025-11-30T23:59:59Z",
  "keyword": "邀请码"
}
```
- 响应：与原文档一致（分页与 `LedgerItem` 模型）。

### 余额查询
- 原：`GET /bonus/balance`
- 现：`POST /bonus/balance`
- 请求 Body：
```json
{}
```
- 响应：
```json
{ "balance": 1200, "updatedAt": "2025-11-28T10:20:30Z" }
```

### 商品列表（若需一致性）
- 原：`GET /store/items`
- 现：`POST /store/items/list`
- 请求 Body（可选筛选）：
```json
{ "itemType": "invite_code", "page": 1, "pageSize": 50 }
```
- 响应：与原 `StoreItem` 列表一致。

### 下单（保持）
- 原：`POST /store/purchase`
- 现：`POST /store/purchase`（不变）
- 请求头：`Idempotency-Key`
- 请求 Body：
```json
{ "itemId": "inv_001", "quantity": 1, "deliverToEmail": "user@example.com" }
```
- 响应：可返回 `orderId`，前端再调用 `POST /store/orders/detail` 获取最终交付结果。

### 当前用户（若需一致性）
- 原：`GET /auth/profile`
- 现：`POST /auth/profile`
- 请求 Body：`{}`
- 响应：与原一致。

### 发送邮件（保持）
- 原：`POST /mail/send/report`
- 现：`POST /mail/send/report`（不变）

## 公共约定（保留并适配 POST）
- 时间：ISO8601 UTC 字符串。
- 分页：`page`、`pageSize` 在请求 Body；响应保留 `page`、`pageSize`、`total`、`items`。
- 错误码与 HTTP 状态（不变）：
  - `401 UNAUTHORIZED` → `UNAUTHORIZED`
  - `400 BAD_REQUEST` → `INVALID_PARAMETERS`
  - `404 NOT_FOUND` → `ORDER_NOT_FOUND` / `OVERVIEW_NOT_FOUND`
  - `409 CONFLICT` → `BALANCE_INSUFFICIENT` / `ITEM_OUT_OF_STOCK`
  - `500 INTERNAL_SERVER_ERROR` → `INTERNAL_ERROR`

## 变更原因与影响
- 原因：统一网关策略与参数传递方式，避免 URL 过长与缓存歧义，简化服务端路由与权限控制。
- 前端影响：`src/api/*` 服务方法需将查询改为 `POST` 并传入 body；`docs/bonus-apis.md` 将按本方案修订，供后端对齐实现。

## 执行步骤
1. 修订 `docs/bonus-apis.md` 为统一 `POST` 版本（新增 `detail`/`list` 路径以替代 RESTful `:id`）。
2. 与后端确认网关及安全策略（JWT 解析、Idempotency-Key 生效范围）。
3. 前端服务层待后端上线后统一切换为 `POST` 并适配新路径。