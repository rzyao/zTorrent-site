# Bonus页面缺失接口文档

## 范围与背景
- 页面位置：`src/pages/BonusPage.tsx`
- 路由：`src/routes/AppRoutes.tsx` 中 `path: "/bonus"`
- 当前已接入接口：
  - `GET /store/items` 用于商城列表（`src/api/custom/store.ts:getStoreItems()`；引用于 `src/pages/BonusPage.tsx:75-85`）
  - `POST /store/purchase` 用于积分下单（`src/api/custom/store.ts:purchaseItem()`；引用于 `src/pages/BonusPage.tsx:549-569`）
  - `GET /bonus/balance` 查询余额（`src/api/custom/bonus.ts:getBonusBalance()`；引用于 `src/pages/BonusPage.tsx:94-99`）
  - `GET /auth/profile` 获取当前用户（`src/api/services/AuthService.ts:authControllerProfile()`；引用于 `src/pages/BonusPage.tsx:100-107`）
  - `POST /mail/send/report` 可选发送邮件（`src/api/services/MailService.ts:mailControllerSendReport()`；引用于 `src/pages/BonusPage.tsx:521-528`）
- 仍为本地模拟数据：
  - 积分概览与收支记录（`src/pages/BonusPage.tsx:25-43` 的 `userMagic` 和 `magicRecords`；记录筛选 `src/pages/BonusPage.tsx:261-334`）

## 目标
- 定义 Bonus 页面“缺失接口”，为后端实现提供明确规范；前端将据此替换本地模拟并完善交互。

## 统一约定
- 认证：所有接口需 `Authorization: Bearer <JWT>`，后端从 JWT 解析当前用户，无需前端传 `userId`（除管理员查询场景）。
- 时间：统一采用 ISO8601 字符串，UTC 存储，前端按时区展示。
- 分页：
  - 请求：`page`（从 1 开始），`pageSize`（默认 20，最大 100）
  - 响应：`page`，`pageSize`，`total`，`items`（数组）
- 错误码：`code` 与 `message` 保持稳定、可枚举；HTTP 状态与业务码对应关系在下文给出。
- 幂等：下单接口支持 `Idempotency-Key` 请求头，避免重复扣减。

## 新增接口一：积分概览统计
- 路径：`GET /bonus/overview`
- 说明：替换页面中的本地 `userMagic` 概览数据（`src/pages/BonusPage.tsx:25-43`），用于展示累计获得/消耗、当前余额、趋势等。
- 请求：无（从 JWT 获取用户）
- 响应：
```json
{
  "balance": 1200,
  "totalEarned": 3500,
  "totalSpent": 2300,
  "monthTrend": [
    { "month": "2025-06", "earned": 200, "spent": 100 },
    { "month": "2025-07", "earned": 300, "spent": 150 }
  ],
  "rank": 42,
  "updatedAt": "2025-11-28T10:20:30Z"
}
```
- 错误：
  - `401 UNAUTHORIZED` → `UNAUTHORIZED`
  - `404 NOT_FOUND` → `OVERVIEW_NOT_FOUND`（无历史）
- 设计原因：页面概览要求无需汇总计算到前端，后端汇总能保证口径一致、性能稳定。

## 新增接口二：订单状态查询（购买交付结果）
- 路径：`GET /store/orders/:id`
- 说明：页面当前在下单后直接依据 `resp.deliveryResult.code` 展示邀请码（`src/pages/BonusPage.tsx:549-569`）。为支持异步交付或不同商品类型，需要查询订单详情与交付结果。
- 请求：路径参数 `id`
- 响应：
```json
{
  "id": "ord_123",
  "itemId": "inv_001",
  "status": "delivered", // pending|delivered|failed
  "amount": 300,
  "createdAt": "2025-11-28T10:20:30Z",
  "updatedAt": "2025-11-28T10:21:00Z",
  "deliveryResult": {
    "type": "invite_code", // invite_code|license_key|external_link
    "code": "ABCD-EFGH-IJKL"
  },
  "errorCode": null
}
```
- 错误：
  - `401 UNAUTHORIZED` → `UNAUTHORIZED`
  - `404 NOT_FOUND` → `ORDER_NOT_FOUND`
- 设计原因：抽象交付载体，兼容多商品类型与异步履约；便于轮询与失败重试展示。

## 新增接口三：订单列表（个人）
- 路径：`GET /store/orders`
- 说明：用于页面“我的购买记录”或对账展示（可后续接入）。
- 请求：
  - `page`，`pageSize`
  - 可选筛选：`status`（`pending|delivered|failed`），`itemType`（如 `invite_code`），`dateStart`，`dateEnd`
- 响应：分页：
```json
{
  "page": 1,
  "pageSize": 20,
  "total": 2,
  "items": [
    {
      "id": "ord_123",
      "itemId": "inv_001",
      "itemType": "invite_code",
      "status": "delivered",
      "amount": 300,
      "createdAt": "2025-11-28T10:20:30Z"
    }
  ]
}
```
- 错误：
  - `401 UNAUTHORIZED` → `UNAUTHORIZED`

## 现有接口的能力扩展建议（如未实现则视为新增）
- 路径：`GET /bonus/ledger`
- 说明：页面目前用本地 `magicRecords` 模拟（`src/pages/BonusPage.tsx:25-43`，筛选在 `src/pages/BonusPage.tsx:261-334`）；若后端已有基础接口，建议补充筛选与分页。
- 请求（建议参数）：
  - `page`，`pageSize`
  - `type`：`earn|spend`
  - `category`：`purchase|reward|refund|adjust`
  - `dateStart`，`dateEnd`
  - `keyword`：对 `description/metadata` 模糊搜索
- 响应：
```json
{
  "page": 1,
  "pageSize": 20,
  "total": 120,
  "items": [
    {
      "id": "led_8848",
      "type": "spend",
      "category": "purchase",
      "amount": 300,
      "balanceAfter": 900,
      "description": "购买邀请码 inv_001",
      "createdAt": "2025-11-28T10:21:00Z",
      "metadata": { "orderId": "ord_123" }
    }
  ]
}
```
- 错误：
  - `401 UNAUTHORIZED` → `UNAUTHORIZED`

## 数据模型约定
- `LedgerItem`
  - `id`，`type`（`earn|spend`），`category`（`purchase|reward|refund|adjust`），`amount`（整数，单位积分），`balanceAfter`，`description`，`createdAt`，`metadata`（对象，存放 `orderId` 等）
- `StoreItem`
  - `id`，`name`，`type`（`invite_code|license_key|external_link`），`price`（单位积分），`stock`（可选），`metadata`
- `Order`
  - `id`，`userId`（后端解析，不对外返回或仅用于审计），`itemId`，`amount`，`status`，`deliveryResult`，`createdAt`，`updatedAt`，`errorCode`
- `DeliveryResult`
  - `type`：`invite_code|license_key|external_link`
  - 对应载荷：`code` 或 `key` 或 `url`

## 错误码与HTTP状态
- `401 UNAUTHORIZED` → `UNAUTHORIZED`
- `400 BAD_REQUEST` → `INVALID_PARAMETERS`
- `404 NOT_FOUND` → `ORDER_NOT_FOUND` / `OVERVIEW_NOT_FOUND`
- `409 CONFLICT` → `BALANCE_INSUFFICIENT` / `ITEM_OUT_OF_STOCK`
- `500 INTERNAL_SERVER_ERROR` → `INTERNAL_ERROR`

## 安全与合规
- 不返回敏感字段（如其他用户信息）；所有数据限定为当前登录用户视角。
- 下单接口使用 `Idempotency-Key` 防重；订单查询仅允许访问本人的订单。

## 前端接入与替换点
- 概览卡片：用 `GET /bonus/overview` 替换 `userMagic`（`src/pages/BonusPage.tsx:25-43`）
- 收支记录：用 `GET /bonus/ledger` 分页/筛选替换 `magicRecords`（`src/pages/BonusPage.tsx:261-334`）
- 购买交付：下单后轮询/单次查询 `GET /store/orders/:id` 获取 `deliveryResult`（替代直接依赖 `resp.deliveryResult.code`）

## 实施步骤（后端）
1. 实现 `GET /bonus/overview` 并与余额、流水表联动。
2. 补全或扩展 `GET /bonus/ledger` 的分页与筛选能力。
3. 新增 `GET /store/orders/:id` 与 `GET /store/orders`，统一订单与交付结果模型。
4. 校准错误码与HTTP映射，保证与前端一致性。

## 备注
- 若现有 `BonusService` 已提供 `ledger/balance` 基础能力，上述扩展按建议项执行；确认为缺失的为 `bonus/overview`、`store/orders/:id` 与 `store/orders`。