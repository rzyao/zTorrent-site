# Discourse 帖子流与导航实现机制分析

本文档基于 Discourse 源码（`topic.js`, `post-stream.js`, `url.js`）分析其帖子列表、无限滚动、时间轴及跳转机制的实现方案。

## 1. 核心架构：PostStream (帖子流)

Discourse 的核心理念是将**数据结构（IDs）**与**视图数据（Posts）**分离。

### 1.1 数据模型 (PostStream Model)

`PostStream` (`app/models/post-stream.js`) 维护着两个关键数组：

1.  **`stream` (Array<number>)**:
    - **定义**: 当前话题中**所有**帖子的 ID 列表（或者至少是已知部分的完整有序列表）。
    - **作用**: 作为“地图”或“索引”，决定了帖子的绝对顺序和总数量。
    - **来源**: 初始化话题时（`TopicView`），后端返回完整的 `stream` ID 列表（对于超大话题可能是部分，但通常包含所有 ID）。

2.  **`posts` (Array<Post>)**:
    - **定义**: 当前**已渲染/可见**的帖子对象列表（Hydrated Posts）。
    - **作用**: 实际渲染到 DOM 上的数据。它只是 `stream` 的通过“滑动窗口”截取的一个子集。

### 1.2 优势

- **内存优化**: 即使话题有 10,000 个帖子，前端只需持有 10,000 个整数 ID（`stream`），以及最近查看的 20-50 个完整帖子对象（`posts`）。
- **精准定位**: 任何时候都知道当前窗口在整个话题中的位置。

---

## 2. 无限滚动列表 (Infinite Scrolling)

Discourse 实现了**双向无限滚动**（Up & Down）。

### 2.1 向下滚动 (Loading Below)

当用户滚动到底部，触发 `appendMore`：

1.  **检查**: 确认 `canAppendMore`（当前 `posts` 的最后一个帖子不是 `stream` 中的最后一个）。
2.  **计算窗口**: 获取 `stream` 中紧接在当前 `posts` 之后的 `chunk_size` 个 ID。
3.  **获取数据**: 调用 `findPostsByIds(ids)` 从后端（或缓存）获取这些 ID 对应的完整帖子数据。
4.  **追加**: 将获取到的 Post 对象 `push` 到 `posts` 数组中。

### 2.2 向上滚动 (Loading Above)

当用户滚动到顶部，触发 `prependMore`：

1.  **检查**: 确认 `canPrependMore`（当前 `posts` 的第一个帖子不是 `stream` 中的第一个）。
2.  **计算窗口**: 获取 `stream` 中位于当前 `posts` 之前的 `chunk_size` 个 ID。
3.  **获取数据**: 同样调用 `findPostsByIds(ids)`。
4.  **前置**: 将获取到的 Post 对象 `unshift` 到 `posts` 数组中。
5.  **滚动维持**: 浏览器通常会自动处理高度变化，但有时需要手动调整 `scrollTop` 以保持视觉位置不变（Discourse 使用 `viewportTracker` 来辅助）。

### 2.3 间隙 (Gaps)

如果用户直接跳转到 500 楼，`posts` 数组可能只包含 490-510 楼。此时 1-489 楼并未加载。
Discourse 不会填充中间所有的帖子，而是将其视为 **Gap**。`stream` ID 列表是连续的，只要 `posts` 中的 ID 在 `stream` 中不连续（索引不相邻），就意味着存在 Gap。

---

## 3. 跨楼层跳转 (Jump to Post)

实现“跳转到第 N 楼”的核心逻辑在于 **Route Refresh** 策略，而不仅仅是滚动。

### 3.1 路由与 URL

- 格式: `/t/:slug/:topicId/:postNumber`
- 监听: `DiscourseURL` 侦听路由变化。如果 `topicId` 不变但 `postNumber` 变化，视为**同页导航**。

### 3.2 跳转流程 (`navigatedToPost` in `url.js`)

1.  **检测**: 捕获 URL 变化，提取目标 `postNumber`。
2.  **刷新数据 (`postStream.refresh`)**:
    - 调用 `loadTopicView` 接口，参数带上 `near_post=N`。
    - **后端行为**: 后端返回包含第 N 楼及其前后上下文的一组帖子。
    - **前端更新**: `PostStream` 将 `posts` 数组**完全替换**为这组新数据（重置窗口位置）。
3.  **优化**: 如果目标帖子已经在当前的 `posts` 数组中，则跳过网络请求，直接进入滚动步骤。
4.  **滚动定位 (`jumpToPost`)**:
    - 等待渲染完成 (`schedule("afterRender", ...)`).
    - 查找 DOM 元素 `#post_N`。
    - **锁定滚动**: 使用 `LockOn` 类锁定滚动事件，防止用户操作干扰自动滚动。
    - 执行 `window.scrollTo` 将元素置于视口中间。
    - **高亮**: 添加 CSS 类高亮该帖子。

---

## 4. 时间轴显示 (Timeline)

时间轴不仅仅是滚动条，它是基于 `stream` 索引计算的精确进度指示器。

### 4.1 进度计算

- **总长度**: `stream.length` (话题总楼层数)。
- **当前位置**: 当前可见的第一个帖子在 `stream` 数组中的索引 (`progressIndex`)。
- **计算公式**:
  ```javascript
  percent = (progressIndex + currentScrollPercent - 1) / totalPosts;
  ```

### 4.2 交互逻辑

- **滚动监听**: `topic.js` 中的 `currentPostScrolled` 监听原生滚动事件，实时更新进度条。
- **拖动时间轴**:
  - 用户拖动滑块 -> 计算目标索引。
  - 从 `stream` 中找到目标 ID。
  - 触发 `postStream.refresh({ nearPost: postNumber })` -> 进入上述“跳转流程”。

---

## 5. 对我们的启示 (Implementation Plan)

要在目前的 React 项目中复刻此体验，我们需要改进 `useTopicDetail` 和相关逻辑：

1.  **后端支持**:
    - 确保 `/topic/:id` 接口支持 `nearPost` 参数。
    - 若提供 `nearPost`，返回该楼层及周边的数据（例如前后各 10 条），而不是总是返回第 1 页。

2.  **前端数据结构**:
    - 虽然不需要完全实现 ID Stream，但**必须支持“从中间加载”**。
    - `useInfiniteQuery` 的 `initialPageParam` 必须根据 `nearPost` 动态计算（`Math.floor(nearPost / pageSize)`）。
    - **关键**: 当 `nearPost` 变化时，必须强制刷新（invalidate query），从新位置开始构建缓存。

3.  **跳转组件**:
    - `TopicDetail` 组件需在 `data` 变化的 `useEffect` 中，检查 URL 的 `postNumber`。
    - 如果目标 DOM 存在，执行 `scrollIntoView`。
    - 如果不存在（说明数据还在加载或计算错误），显示 Loading 或重试。

4.  **ID 匹配**:
    - 前端 `Post` 组件的 DOM ID 必须严格等于后端返回的 `postNumber` (`id="post-315"`), **不能**使用数组索引。

此方案已在之前的修复中部分实现（ID 修正 + `initialPage` 计算），接下来的重点是确保**后端 API 配合 `nearPost` 正确返回对应页的数据**。

---

## 6. 其他核心功能模块 (Additional Features)

除了核心的滚动与导航，`topic.js` 还集成了大量业务逻辑，不仅是一个控制器，更像是一个**业务协调器**。

### 6.1 实时更新 (Real-time Updates / MessageBus)

Discourse 是实时应用，`topic.js` 通过 `MessageBus` 订阅 `/topic/:id` 频道，从后端接收推送。

- **新帖推送**: 收到 `created` 消息时，调用 `postStream.triggerNewPostsInStream` 将新帖 ID 加入流中，如果用户在底部，会自动加载显示。
- **状态同步**: 实时处理帖子的点赞 (`liked`)、编辑 (`revised`)、删除 (`deleted`)、恢复 (`recovered`) 等状态，无需刷新页面。
- **通知同步**: 实时更新通知级别 (`notification_level`)。

### 6.2 选中文本引用 (Quote & Reply)

- **机制**: 监听文本选择事件，当用户在帖子中选中文本时，显示“引用”按钮。
- **实现**: `selectText` 方法获取选区，调用 `buildQuote` 生成 Markdown 引用块，并打开编辑器 (`Composer`) 自动填入。
- **衍生功能**: 支持“引用并作为新话题回复” (`replyAsNewTopic`)。

### 6.3 复杂的帖子操作 (Complex Post Actions)

- **智能删除 (`deletePost`)**: 如果删除的帖子有回复，会弹出对话框询问是“仅删除该贴”还是“连同其回复一起删除”。
- **所有权变更**: `changePostOwner` 允许管理员更改帖子作者。
- **Wiki 与置顶**: `toggleWiki`, `togglePinned` 等状态切换。

### 6.4 速率限制处理 (Rate Limiting)

- **自动重试**: `retryOnRateLimit` 封装了 429 (Too Many Requests) 错误处理逻辑。如果收到后端限流响应，前端会自动等待指定秒数后重试，对用户透明。

### 6.5 高级导航 (Advanced Navigation)

- **日期跳转**: `jumpToDate` 允许用户跳转到“2023年5月”的帖子。实现原理是先查询该日期对应的最近 `postNumber`，然后走标准跳转流程。
- **未读跳转**: `jumpUnread` 跳转到用户上次阅读位置 (`last_read_post_number`)。

### 6.6 批量操作 (Bulk Selection)

- **多选模式**: 允许用户启用“选择模式” (`toggleMultiSelect`)，通过 `selectedPostIds` 数组管理选中项。
- **批量动作**: 支持批量删除、合并帖子、更改拥有者等。
