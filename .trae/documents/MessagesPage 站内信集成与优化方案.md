## 目标与范围

* 完成“系统通知、收件箱、发件箱、我的收藏、会话详情、轮询提醒”端到端对接与 UI 优化

* 保留现有视觉风格与交互（按钮、徽标、分隔线、卡片），将本地 mock 数据替换为后端接口

* 统一鉴权与响应解包，明确错误处理与可用性优化

## 数据与状态

* 增加统一响应工具函数：`unwrapResponse` 与 `extractErrorMessage`（与论坛页保持一致，便于兼容统一响应与直返）

* 在 `src/pages/MessagesPage.tsx` 内新增前端类型：

  * 消息对象：`{ id, threadId, senderId, recipientId, content, format, attachments?, replyToMessageId?, createdAt, readAt? }`

  * 会话摘要：`{ threadId, peerUserId, lastPreview?, lastMessageAt?, unread }`

  * 系统通知：`{ id, userId?, type, title, content, contentFormat, attachments?, createdAt, readAt? }`

* 为各 Tab 分别维护分页与过滤：`page/limit`、`onlyUnread/onlyFavorites`（收件箱/发件箱）、搜索关键字

* 会话详情状态：`activeThreadPeerUserId`、消息时间线列表、输入框内容、引用消息 ID

* 轮询：`lastPollAt`（ISO 字符串），定时器 3 分钟一次

## 接口对接策略

* 优先复用代码生成的服务

  * 发送：`MessagesService.messagesControllerSend`（src/api/services/MessagesService.ts:21）

  * 会话列表：`MessagesService.messagesControllerThreads`（src/api/services/MessagesService.ts:52）

  * 会话消息：`MessagesService.messagesControllerListMessages`（src/api/services/MessagesService.ts:92）

  * 会话全部已读：`MessagesService.messagesControllerMarkRead`（src/api/services/MessagesService.ts:133）

  * 未读总数：`MessagesService.messagesControllerUnreadCount`（src/api/services/MessagesService.ts:163）

  * 删除消息/会话：`messagesControllerDeleteMessage`、`messagesControllerDeleteThread`（src/api/services/MessagesService.ts:190, 221）

* 对未生成的端点，直接用底层请求工具调用（自动注入 JWT）

  * 系统通知：`POST /messages/notifications/list|mark-read|delete`

  * 收件箱/发件箱/收藏：`POST /messages/inbox|outbox|favorites`

  * 单条已读：`POST /messages/mark-read`

  * 收藏/取消收藏：`POST /messages/favorite|unfavorite`

  * 轮询：`POST /messages/poll`

  * 说明：统一使用 `__request(OpenAPI, { method:'POST', url, body })`（src/api/core/request.ts），响应通过 `unwrapResponse` 解包

## 系统通知（Tab：系统通知）

* 列表：加载 `POST /messages/notifications/list`，分页 `page/limit`

* 操作：批量标记已读（选中项 → `mark-read`）、软删单条（`delete`）

* 展示：支持 `contentFormat` 渲染（plain 纯文本；html 用 `dangerouslySetInnerHTML`；markdown 后续引入库）

* 原因：与后端统一响应对齐，功能闭环可用

## 收件箱/发件箱/我的收藏（Tab：收件箱/发件箱/收藏）

* 列表：分别对接 `POST /messages/inbox|outbox|favorites`，支持分页；收件箱支持 `onlyUnread/onlyFavorites`，发件箱支持 `onlyFavorites`

* 操作：收藏/取消收藏、软删、单条已读

* 搜索：在前端输入框防抖（300ms）后带上 `search` 或在前端过滤预览文本

* 原因：用户侧行为为主（收藏与过滤），契合文档的字段与交互建议

## 会话与详情（Tab：会话）

* 会话列表：`POST /messages/threads`，显示最后预览与未读角标，点击进入详情

* 详情消息时间线：`POST /messages/threads/messages`，进入时自动调用 `POST /messages/threads/mark-read`（对当前用户）

* 操作：回复（可引用 `replyToMessageId`）、删除单条、收藏/取消收藏、单条已读（必要时）

* 展示：根据 `format` 渲染；图片附件以缩略图形式展示，点击放大

* 原因：提升对话上下文体验，满足“会话级已读与回复”要求

## 发送/回复与图片上传

* 发送新消息：表单包含收件人、内容、格式选择、附件（图片）

* 图片上传：用 `ImagesService.imagesControllerUpload` 拿到 URL（src/api/services/ImagesService.ts:15），将 URL 放入 `attachments[]`

* 回复：`POST /messages/reply`，附带 `peerUserId` 与 `replyToMessageId`（引用）

* 原因：闭环的消息发布流程，遵循后端附件与富文本规范

## 已读、收藏、删除

* 单条已读：`POST /messages/mark-read`（消息详情或列表项快捷按钮）

* 会话全部已读：`POST /messages/threads/mark-read`（进入会话时触发）

* 收藏/取消收藏：`POST /messages/favorite|unfavorite`

* 软删消息/会话：`POST /messages/delete`、`POST /messages/threads/delete`

* 原因：对齐文档“软删不影响对端显示”，并用徽标/过滤体现用户侧行为

## 未读与轮询

* 未读总数：页面加载与轮询后更新（徽标显示）

* 轮询：每 3 分钟调 `POST /messages/poll`，`since=lastPollAt`；根据返回 `threadsUpdated` 刷新会话列表，并弹出轻提示

* 原因：低频轮询避免过度请求，保证提醒时效

## 富文本渲染

* `format='plain'`：安全显示纯文本

* `format='html'`：直接用 `dangerouslySetInnerHTML`（后端已白名单清洗）

* `format='markdown'`：计划引入 `react-markdown`（依赖新增），或先按纯文本显示，待审批后补充

* 原因：遵从后端约定，确保安全性与可读性

## 分页与搜索

* 使用现有通用分页组件（src/components/ui/pagination.tsx）驱动翻页

* 搜索框前端防抖；列表 API 支持则带参查询，否则在前端过滤（尤其会话预览）

* 原因：降低抖动与请求频率，保持响应速度

## 错误处理与鉴权

* 鉴权：自动注入 `Authorization: Bearer <JWT>`（src/layouts/AppLayout.tsx:5-6），无感对接

* 错误：统一用 `extractErrorMessage` 提示，搭配 `sonner` 的 `toast` 成功/失败提示（已在登录页使用）

* 原因：一致的用户反馈与日志定位

## 实施步骤与改动点

1. 在 `src/pages/MessagesPage.tsx` 文件顶部新增 `unwrapResponse`/`extractErrorMessage` 与数据类型定义；补充各 Tab 状态（分页、过滤、搜索、选中会话）与轮询状态
2. 将现有 mock 列表替换为接口请求逻辑：

   * 系统通知 Tab：加载/标记已读/删除

   * 收件箱/发件箱/收藏 Tab：加载列表、分页与过滤、收藏/取消收藏、单条已读、软删

   * 会话 Tab：加载会话摘要、进入会话后加载时间线并会话级已读；详情区支持回复（含引用）与附件展示
3. 接入图片上传与附件拼装；发送消息弹窗支持格式选择与附件上传
4. 加入未读总数显示与 3 分钟轮询；刷新会话列表与徽标
5. 优化搜索防抖、错误提示与加载态；同步 URL 参数保存当前 Tab 与分页

## 代码参考

* `MessagesService` 现有端点：

  * 发送：src/api/services/MessagesService.ts:21

  * 会话列表：src/api/services/MessagesService.ts:52

  * 会话消息：src/api/services/MessagesService.ts:92

  * 会话全部已读：src/api/services/MessagesService.ts:133

  * 未读总数：src/api/services/MessagesService.ts:163

  * 删除消息/会话：src/api/services/MessagesService.ts:190, 221

* `OpenAPI` 与请求底层工具：

  * BASE/TOKEN 注入：src/layouts/AppLayout.tsx:5-6

  * 通用请求：src/api/core/request.ts（`__request` 与 `getHeaders`）

* 图片上传：src/api/services/ImagesService.ts:15

* 统一响应工具示例：src/pages/ForumPage.tsx:30-47

* 分页组件：src/components/ui/pagination.tsx

## 备注

* Markdown 渲染建议新增依赖：`react-markdown`（待确认后添加），其余功能不需新依赖

* 不改动代码生成文件，仅在页面内调用缺失端点，确保维护成本最低

