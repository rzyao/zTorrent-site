# 对接 Bonus 页面统一 POST 接口的实施计划

## 目标
- 将前端 Bonus 页面与相关服务统一改造为按后端文档的 POST+body 传参，替换现有 GET 与本地静态数据。
- 完成：服务层封装、页面数据接入、购买交付查询、错误处理与类型对齐。

## 变更范围与文件
- `src/api/custom/bonus.ts`：余额、概览、流水（统一 POST）
- `src/api/custom/store.ts`：商品列表（统一 POST）、购买（保持 POST）、订单详情/订单列表（新增）
- `src/api/services/AuthService.ts`（如使用）：`/auth/profile` 改为 POST（或在 custom 层新增统一封装）
- `src/pages/BonusPage.tsx`：替换本地 `userMagic` 和 `magicRecords`，接入概览与流水；改造购买后交付查询逻辑

## 接口与前端函数映射
- `POST /bonus/balance` → `getBonusBalance()`（改为 POST，`body: {}`）
- `POST /bonus/overview` → `getBonusOverview()`（新增）
- `POST /bonus/ledger` → `getBonusLedger(filters)`（新增，分页/筛选）
- `POST /store/items/list` → `getStoreItems(filters)`（改为 POST，支持分页/筛选）
- `POST /store/purchase` → `purchaseItem(payload)`（保持 POST，加入 `Idempotency-Key` 头支持）
- `POST /store/orders/detail` → `getOrderDetail({ id })`（新增，用于交付结果轮询/查询）
- `POST /store/orders/list` → `getOrdersList(filters)`（新增，个人订单列表）
- `POST /auth/profile` → `getProfile()`（新增封装或替换原 GET）

## 类型与数据转换策略
- 后端金额/积分字段为字符串（如 `balance`, `pointsCharged`, `delta`）。
- custom 层提供“原始响应+可选解析”两套：
  - 返回原始字符串给上层（避免精度问题）
  - 页面展示处按需 `parseInt` 转数字，仅用于显示（例如：`Number(balance)`）。
- 新增类型：`OverviewResponse`, `LedgerItem`, `LedgerRequest`, `OrderDetail`, `OrderListResponse`, `StoreItemListRequest`。

## 页面改造要点（`src/pages/BonusPage.tsx`）
- 概览卡片：在页面加载或切换到“概览”标签时调用 `getBonusOverview()`，替换本地 `userMagic`（参考：`src/pages/BonusPage.tsx:25-43`）。
- 流水列表：调用 `getBonusLedger()`，传入分页与筛选，替换本地 `magicRecords` 与前端筛选逻辑（参考：`src/pages/BonusPage.tsx:261-334`）。
- 商品列表：`getStoreItems({ page, pageSize, status: 'active' })` 替换原 GET（参考：`src/pages/BonusPage.tsx:75-85`）。
- 余额读取：改为 `POST /bonus/balance`（参考：`src/pages/BonusPage.tsx:94-99`）。
- 用户信息：改为 `POST /auth/profile` 或保留现有封装，维持数据结构一致（参考：`src/pages/BonusPage.tsx:100-107`）。
- 购买交付：下单成功返回 `orderId` 后，调用 `getOrderDetail({ id: orderId })` 获取 `deliveryResult`，替换直接从购买响应中取 `deliveryResult.code`（参考：`src/pages/BonusPage.tsx:521-569`）。
- 错误处理：统一处理后端 `code/message`，将常见错误码与提示文案对齐（余额不足、参数错误、未登录等）。

## 安全与幂等
- 通过 `OpenAPI` 配置自动携带 `Authorization`；购买接口加入 `Idempotency-Key`（如 `uuid`）请求头避免重复扣款。
- 所有查询接口虽为 POST，但严格无副作用；后端以 JWT 的 `sub` 限定本人数据访问。

## 验证与测试
- 本地运行 `pnpm run dev`，在 Bonus 页进行：
  - 切到“概览”→ 显示后端概览数据
  - 切到“流水”→ 能分页筛选正确加载
  - 打开“商城”→ 商品列表来自 `/store/items/list`
  - 购买→ 返回 `orderId`，查询订单详情显示 `deliveryResult`
  - 非法筛选→ 显示 `INVALID_PARAMETERS` 对应文案
- 控制台与网络面板检查请求方法为 POST、请求体 JSON 正确。

## 实施步骤
1. 更新 `src/api/custom/bonus.ts`：改造 `getBonusBalance`；新增 `getBonusOverview/getBonusLedger`。
2. 更新 `src/api/custom/store.ts`：改造 `getStoreItems`；新增 `getOrderDetail/getOrdersList`；`purchaseItem` 增加幂等头支持。
3. 新增/改造 `getProfile`（POST），或维持现有 GET 并注释迁移计划。
4. 改造 `src/pages/BonusPage.tsx`：替换静态数据与调用点（含 loading/error 状态）。
5. 联调与验证，确保所有请求为 POST 且字段对齐。

## 备注
- 保持不对旧代码做兼容分支；直接替换为新接口。
- 所有新增/改造代码将补充详细中文注释，解释每一步改动原因与边界。