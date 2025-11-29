## 目标与范围
- 接入后端积分商城：按文档对接 `GET /store/items`、`POST /store/purchase`，联动 `GET /bonus/balance`。
- 保留现有“魔力值中心”三段式标签，重点改造“魔力商城”页签为真实数据与购买流程。
- 使用现有 OpenAPI/axios 封装与 Radix Dialog，符合代码库既有风格与认证机制。

## 技术方案
- HTTP 封装：复用 `src/api/core/request.ts` 与 `OpenAPI`；自动携带 `Authorization: Bearer <token>`（已由 `OpenAPI.TOKEN` 提供）。
- 自定义轻量客户端：新增 `src/api/custom/store.ts` 与 `src/api/custom/bonus.ts` 封装非生成端点。
  - `getStoreItems(): Promise<StoreItem[]>` → `GET /store/items`
  - `purchaseItem(req): Promise<PurchaseResult>` → `POST /store/purchase`
  - `getBonusBalance(): Promise<{ balance:number }>` → `GET /bonus/balance`
- 响应标准化：统一兼容两类响应（直接对象或 `{code,message,data}` 包装），避免页面重复解析。
- 用户ID来源：打开购买弹窗时调用 `AuthService.authControllerProfile()`，从 `data.user.id`（或 `sub`）获取 `userId`；若后端从 JWT 提取，则可容错为不传。

## 页面改造（`src/pages/BonusPage.tsx`）
- 状态管理：新增 `items/loading/error`、`balance`、`purchaseOpen`、`selectedItem`、`email`、`quantity`、`submitting`、`result/errorMsg`。
- 列表数据：当激活“魔力商城”页签时触发 `getStoreItems()` 加载；展示 `title`、`pricePoints`、`type`、`status`。
  - 按 `status` 控制按钮：`active` 显示“购买”，否则灰显并提示“暂不可购买”。
  - 将静态 `shopItems` 替换为服务端列表；保留样式与图标风格一致性（缺省图标用现有 `lucide-react`）。
- 购买弹窗：用项目现有 Radix `Dialog`（`src/components/ui/dialog.tsx`）。
  - 字段渲染：依据 `item.key` 判断；`invite_code` 需要 `email`（必填、格式校验），公共字段含 `quantity`（默认1）。
  - 二次确认：在弹窗内实时展示扣分金额（`pricePoints * quantity`）与当前余额（调用 `getBonusBalance()`）；余额不足时禁用“确认购买”。
  - 提交：调用 `purchaseItem({ userId, itemKey, quantity, payload })`；成功后在弹窗中展示 `deliveryResult.code`，并提供“复制邀请码”“发送到邮箱”。
  - 失败处理：提示后端返回原因；保留订单号（若返回）用于重试与客服。
- 交付结果操作：
  - 复制：`navigator.clipboard.writeText(deliveryResult.code)` 成功提示与埋点。
  - 发送到邮箱：复用 `MailService.mailControllerSendReport({ to: email, subject: '官方邀请码', text: '您的邀请码：...' })` 作为二次发送选项（后端购买已发送时，此为补充）。

## 交互与错误态
- 余额不足：弹窗内高亮提示“余额不足，去赚取积分”；禁用确认按钮。
- 商品未上架：列表卡片显示“暂不可购买”；按钮禁用。
- 参数缺失：表单校验阻止提交；错误文案位于字段下方。
- 失败重试：在错误提示旁保留“重试”按钮；如有 `orderId`，在日志中记录并随重试一起提交。

## 埋点与日志
- 列表曝光：进入“魔力商城”页签时记录 `store_list_view`。
- 点击购买：记录 `store_item_click`（含 `itemKey`、`pricePoints`）。
- 下单提交：记录 `store_purchase_submit`；成功/失败分别记录 `store_purchase_success`/`store_purchase_failure`（含失败原因）。
- 邀请码复制：记录 `invite_code_copy`；二次发送邮件记录 `invite_code_email_send`。
- 先以 `console.info` 打点，后续可接入统一埋点服务。

## 路由与导航（可选）
- 保留现有 `/bonus` 页签结构；若需要独立商城页：新增 `/store` 路由并渲染同一商城网格组件。
- 头部入口：右上角 `Sparkles` 图标按钮可指向 `/bonus?tab=shop` 或 `/store`。

## 安全与一致性
- 认证：所有请求自动携带 JWT；`401` 由全局拦截器处理并跳转登录。
- 输入校验：邮箱使用简单正则校验；数量限制为正整数，最小1。
- 代码风格：复用 Tailwind 与 Radix 样式；在新增代码中补充详细中文注释，说明每一步改动的原因与选择。

## 实施步骤
1) 新增 `src/api/custom/store.ts` 与 `src/api/custom/bonus.ts` 封装三接口，含类型与响应标准化。
2) 改造 `BonusPage.tsx`：“魔力商城”页签接入真实列表与加载/错误态；按钮打开购买弹窗。
3) 实现购买弹窗逻辑：字段校验、余额提示、提交、结果展示与“复制/发送到邮箱”。
4) 添加轻量埋点（`console.info`）与错误重试能力；完善空态与禁用态。
5) 自测与联调：验证登录态、余额不足、商品未上架、参数缺失、购买成功交付邀请码。

如确认该方案，我将开始编码并在关键位置加入详细中文注释，同时在提交中逐项解释改动原因。