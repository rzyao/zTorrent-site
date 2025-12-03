# InvitePage 与后端 OpenAPI 对接实施计划

## 目标
- 用真实接口替换 `InvitePage.tsx` 中的所有模拟数据，统一状态管理与错误处理，保持现有 UI 与交互行为一致。

## 接口绑定与数据映射
- 我的邀请码（可用/全部）：调用 `POST /invites/codes/list` → 映射到 `InviteCode[]`（id, code, status, createdAt, expiresAt, usedAt?, usedBy?）。
- 邀请记录：调用 `POST /invites/records/list` → 映射到 `SentInvite[]`（id, code, recipientName, recipientEmail, status, sentAt, registeredAt?, expiresAt）。
- 我邀请的用户：调用 `POST /invites/my-users` → 映射到 `InvitedUser[]`（id, username, email, joinedAt, uploadedBytes, downloadedBytes, ratio, status, inviteCode；前端格式化为 TB 与字符串）。
- 概览统计：调用 `POST /invites/overview` → 映射 `totalInvites, usedInvites, remainingInvites, invitedUsers`。
- 魔力值：调用 `POST /bonus/overview` 或 `POST /bonus/balance` → 映射 `magicPoints`。
- 发送邀请：调用 `POST /invites/send-private`（支持 `codeId`）；可选调用 `POST /notifications/send-invite` 派发系统消息。
- 兑换邀请码：`POST /store/items/list` 获取 `invite_code` 商品；`POST /store/purchase` 完成兑换并读取 `deliveryResult.code`。

## 前端改造步骤
1. 引入服务
- 使用生成的服务：`import { InvitesService, BonusService, OpenAPI } from '@/api';`
- 使用定制封装：`import { getBonusOverview, getBonusBalance } from '@/api/custom/bonus'; import { getStoreItems, purchaseItem, getOrderDetail } from '@/api/custom/store';`

2. 状态与类型
- 新增加载与错误状态：`isLoadingCodes/isLoadingRecords/isLoadingUsers/isLoadingOverview/isLoadingBonus` 与对应 `error`。
- 将当前 `interface` 保留为展示模型；从接口返回后做映射与格式化（时间 ISO→展示、bytes→TB、ratio→字符串）。

3. 数据加载
- 在 `useEffect` 根据 `activeTab` 懒加载对应数据；概览与魔力值在页面首次渲染加载。
- 响应统一解包：优先 `{ code,message,data }` 格式，否则读取 `response.data`。

4. 发送邀请弹窗对接
- `handleSendInvite` 改为调用 `InvitesService.invitesControllerSendPrivate({ email, username, codeId })`。
- 成功后关闭弹窗并刷新“邀请记录”与“邀请码列表”；如启用通知则调用 `notifications/send-invite`。

5. 兑换按钮对接
- “立即兑换”按钮：调用 `getStoreItems` 找到 `invite_code` 商品 → `purchaseItem({ itemKey:'invite_code', quantity:1 }, idempotencyKey)` → 显示返回的 `deliveryResult.code` 并刷新“我的邀请码”。

6. 枚举与显示
- 将后端状态枚举标准化为页面枚举：`registered/pending/expired`、`unused/used/expired`。
- 保持现有 `getStatusColor/getStatusText/getStatusIcon` 映射不变，如有差异在本地统一转换。

7. 错误处理与回退
- 所有请求添加错误消息回退：`e?.body?.message || e?.message || '请求失败'`。
- 页面各区域支持加载骨架/空状态/失败重试提示（保留现有样式）。

## 代码改动点（文件范围）
- 仅修改 `src/pages/InvitePage.tsx`，不引入新文件。
- 替换模拟数据为真实服务调用与状态管理；增补 `useEffect` 与若干 `useState`。

## 验证
- 控制台与 UI 验证：加载各 Tab 时发起接口调用并正确渲染；发送邀请与兑换流程完成后列表刷新。
- 错误场景：断网或接口返回错误时显示回退提示，不影响其他区域。

## 交付
- 完成对接后提交页面变更；保留现有 UI 与交互，不添加注释。