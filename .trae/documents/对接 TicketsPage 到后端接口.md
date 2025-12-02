# TicketsPage 前端对接计划

## 改动目标
- 将 `src/pages/TicketsPage.tsx` 从本地静态数据改为调用后端接口，覆盖：列表与统计、详情、创建（含附件上传）、回复、关闭、确认结案。

## 使用的服务
- 引入 `TicketsService`（`@/api`），使用以下方法：
  - `ticketsControllerList`、`ticketsControllerStats`、`ticketsControllerDetail`
  - `ticketsControllerCreate`、`ticketsControllerUpload`、`ticketsControllerReply`
  - `ticketsControllerClose`、`ticketsControllerConfirmResolved`
- DTO：`ListTicketsDto`、`CreateTicketDto`、`UploadAttachmentDto`、`ReplyDto`、`CloseTicketDto`、`ConfirmResolvedDto`、`TicketDetailDto`

## 页面改造
- 列表页
  - 新增状态：`loadingList`、`listError`、`page/pageSize`、`stats`
  - 在筛选（`filterStatus/filterCategory`）与搜索（`searchQuery`）变更时调用 `list` 与 `stats`。
  - 用返回的 `items` 渲染；保留现有 UI 样式。
- 详情页
  - 选中工单时调用 `detail` 拉取最新 `messages`；进入详情视图。
  - 回复：`status != closed` 时允许，调用 `reply` 后刷新详情。
  - 关闭：调用 `close` 后刷新详情与列表。
  - 确认结案：仅 `resolved` 时调用 `confirmResolved`；刷新详情与列表。
- 创建页
  - 附件上传：添加隐藏 `<input type="file">`，点击占位框触发选择；调用 `upload` 得到附件对象，累计到本地附件列表。
  - 提交：构造 `CreateTicketDto`（含 `attachments` 与可选 `clientRequestId`），调用 `create`；成功后跳转到新工单详情并刷新列表。

## 错误处理与提示
- 使用 `customToast`（或 `sonner` 的 `toast`）提示成功/失败。
- 响应处理兼容两种成功码：`resp.code === 0 || resp.code === 1000`；失败则显示 `resp.message`。
- 认证错误由全局拦截器处理；本页不重复处理。

## 幂等与安全
- 创建与回复附带 `clientRequestId`（UUID）；上传限制遵循后端：≤10MB，`png|jpg|jpeg|pdf|txt`。

## 实施步骤
1. 在 `TicketsPage.tsx` 引入 `TicketsService` 与相关 DTO 类型、`customToast`。
2. 添加状态与副作用，接入 `/list` 与 `/stats`。
3. 接入 `/detail`，并改造选择逻辑为异步拉取详情。
4. 接入 `/upload` 与 `/create` 流程；调用成功后跳转详情。
5. 接入 `/reply`、`/close`、`/confirm-resolved` 按钮逻辑。
6. 统一响应判断与错误提示；代码保持现有风格与 UI。

## 交付
- 提交修改后的 `src/pages/TicketsPage.tsx`，自测基本流程（列表加载、详情、创建与回复、关闭与结案）。