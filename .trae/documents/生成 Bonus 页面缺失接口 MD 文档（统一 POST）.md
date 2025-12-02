# 生成 Bonus 页面缺失接口 MD 文档（统一 POST）

## 输出目标
- 在仓库新增一份 MD 文档，汇总 Bonus 页面需要但尚未完整接入的接口，全部采用 `POST` 且使用 `body` 传参，供后端按文档实现。
- 文档将包含：接口清单、请求体与响应示例、统一约定（认证/分页/时间/错误码）、数据模型、前端替换点。

## 页面现状与缺口（概述）
- 已使用接口：商品列表、购买、余额、用户信息、邮件发送。
- 静态模拟：积分概览、收支记录（流水）。
- 建议补充（并统一为 POST）：
  - 积分概览：`POST /bonus/overview`（替换本地概览卡片数据）
  - 积分流水：`POST /bonus/ledger`（分页/筛选替换本地记录）
  - 余额查询：`POST /bonus/balance`（一致性）
  - 订单详情：`POST /store/orders/detail`（支持异步交付结果）
  - 订单列表：`POST /store/orders/list`（个人订单分页）
  - 商品列表：`POST /store/items/list`（一致性）
  - 当前用户：`POST /auth/profile`（一致性保留）
  - 购买接口：`POST /store/purchase`（保持不变，补充返回 `orderId` 与幂等头）

## 统一约定
- 认证：`Authorization: Bearer <JWT>`；查询类接口虽为 POST，但无副作用。
- 时间：ISO8601 UTC 字符串。
- 分页：`page` 从 1 开始，`pageSize` 默认 20 最大 100；响应包含 `page`、`pageSize`、`total`、`items`。
- 错误码与 HTTP 状态：`UNAUTHORIZED`/`INVALID_PARAMETERS`/`ORDER_NOT_FOUND`/`OVERVIEW_NOT_FOUND`/`BALANCE_INSUFFICIENT`/`ITEM_OUT_OF_STOCK`/`INTERNAL_ERROR`。
- 幂等：`POST /store/purchase` 支持 `Idempotency-Key` 请求头。

## 文档结构（示例）
1. 范围与背景：页面路径与现状说明
2. 目标：统一 POST 的接口补齐
a. `POST /bonus/overview`（请求体 `{}`；响应含 `balance/totalEarned/totalSpent/monthTrend/rank/updatedAt`）
b. `POST /bonus/ledger`（请求体分页+筛选；响应分页与 `LedgerItem`）
c. `POST /bonus/balance`（请求体 `{}`；响应 `balance/updatedAt`）
d. `POST /store/orders/detail`（请求体 `{ id }`；响应含交付结果）
e. `POST /store/orders/list`（请求体分页+筛选；响应分页）
f. `POST /store/items/list`（请求体可选筛选与分页；响应 `StoreItem[]`）
g. `POST /auth/profile`（请求体 `{}`；响应与现状一致）
h. `POST /store/purchase`（保持不变，补充说明返回 `orderId`）
3. 数据模型约定：`LedgerItem`、`StoreItem`、`Order`、`DeliveryResult`
4. 错误码与 HTTP 状态映射
5. 安全与合规：仅允许访问本人数据，不返回敏感信息
6. 前端接入与替换点：标注 `BonusPage.tsx` 对应替换位置
7. 实施步骤（后端）：依次实现 overview/ledger/orders/detail|list 并校准错误码

## 执行步骤（获批后）
- 新增 `docs/bonus-apis.md`，按上述结构写入完整内容（中文说明、JSON 示例齐备）。
- 对齐“统一使用 POST 与 body 传参”的约定，修订所有涉及的路径与请求体示例。
- 在文档中标注具体前端文件与行号以便后端理解替换场景。