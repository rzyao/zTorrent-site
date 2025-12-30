# Forums (论坛) 接口对接规划

## 1. 现状分析

| 维度         | 详情                                                                                                                                                     |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **相关文件** | `src/pages/Forums/pages/TopicDetail/index.tsx`<br>`src/pages/Forums/pages/ForumList.tsx`<br>`src/pages/Forums/pages/TopicDetail/hooks/useTopicDetail.ts` |
| **API 服务** | `src/api/services/ForumsTopicsService.ts` (可用)<br>`src/api/services/ForumsPostsService.ts` (存在参数缺失问题)                                          |
| **当前状态** | 页面目前完全依赖 Mock 数据 (`mockTopics`, `mockTopicData`)。`useTopicDetail` Hook 尝试调用了不存在的 `ForumThreadsService`，需修复。                     |

## 2. 对接任务清单

### 2.1 API 层 (`src/api`)

- [x] 确认 `ForumsTopicsService` 已生成且包含 `topicsControllerFindAll` 和 `topicsControllerFindOneByParam`。
- [ ] **注意**: `ForumsPostsService.postsControllerFindAll` 生成代码似乎缺少 `requestBody` 参数。
  - _方案_: 尝试通过类型断言 `(ForumsPostsService.postsControllerFindAll as any)(body)` 绕过 TS 检查，或确认是否需重新生成 API。

### 2.2 数据层 (Hooks)

- [ ] **创建 `useForumsTopicsQuery.ts`**:
  - 封装 `ForumsTopicsService.topicsControllerFindAll`。
  - 支持分页 (`page`, `limit`) 和筛选 (`categoryId`, `search`)。
  - Query Key: `['forums', 'topics', { category, search, page }]`。

- [ ] **修复/重构 `useTopicDetail.ts`**:
  - 修正 Service 引用为 `ForumsTopicsService`。
  - 使用 `ForumsTopicsService.topicsControllerFindOneByParam(id)` 获取详情。
  - 尝试修复 `ForumsPostsService` 调用获取回复列表。
  - Query Key: `['forums', 'topic', id]` 和 `['forums', 'posts', id]`。

- [ ] **创建 Mutations**:
  - `useTopicCreateMutation` (调用 `topicsControllerCreate`)。
  - `usePostCreateMutation` (调用 `postsControllerCreate`)。

### 2.3 UI 组件

- [ ] **`ForumList.tsx`**:
  - 移除 `mockTopics`。
  - 集成 `useForumsTopicsQuery`。
  - 处理 Loading (骨架屏) 和 Empty 状态。
  - 对接分页器 (如果 UI 支持)。

- [ ] **`TopicDetail/index.tsx`**:
  - 移除内部使用的 `mockTopicData` 回退逻辑。
  - 确保 `useTopicDetail` 返回正确的数据结构（需适配 DTO 到 `TopicData` 类型的转换）。
  - 处理 `TopicHeader`, `Post`, `Timeline` 的数据绑定。

## 3. 功能扩展建议 (Value Add)

> [!TIP]
> 提升用户体验的建议

- **建议 1**: **骨架屏优化** - 为话题列表和详情页添加与 Discourse 风格一致的 Skeleton Loading，避免布局跳跃。
- **建议 2**: **预加载** - 鼠标悬停在话题链接时预加载详情数据 (`queryClient.prefetchQuery`)。
- **建议 3**: **无限滚动** - `ForumList` 支持无限滚动加载更多话题，而非传统分页。
