# Favorites 模块接口对接与扩展规划

## 1. 现状分析 (Current State)

### 1.1 后端接口能力

根据 `docs/dev/favorites-api.md`，后端提供了完整的通用收藏功能：

- **核心功能**: 添加、取消、批量操作、状态检查、列表查询。
- **支持类型**: `torrent` (种子), `movie` (电影), `series` (剧集), `playlist` (播放列表)。
- **高级特性**: 支持收藏时添加备注 (`note`)。

### 1.2 前端代码现状

- **现有 Favorites**: 仅存在 `useFavoritesList` (位于 `pages/Messages/hooks/`), 但这是专用于 **站内信 (Messages)** 的收藏功能，调用的是 `/messages/favorites` 接口。
- **API Client**:
  - 存在相关 DTO (`FavoriteActionDto`, `ListFavoritesDto` 等)。
  - **缺失 Service**: `src/api/services/FavoritesService.ts` 文件不存在，导致无法直接调用 `/favorites/*` 接口。这可能是上次 API 生成时未包含该 Tag 或文件未被正确导出。
- **Store/State**: 目前没有用于管理通用收藏状态的 Global Store。
- **UI**: 尚未在详情页 (Movie/Torrent/Series) 集成收藏按钮。

## 2. 对接方案 (Integration Strategy)

### 2.1 API 层 (API Layer)

- [ ] **重新生成 API Client**: 运行 `npm run api:generate` 以确保 `FavoritesService` 被正确生成并导出。
- [ ] **验证**: 确保 `src/api/index.ts` 导出了 `FavoritesService`。

### 2.2 状态管理 (State Management)

- [ ] **创建 `useFavoritesStore` (Zustand)**:
  - 虽然收藏列表主要依赖 React Query 缓存，但为了跨组件同步“是否已收藏”的状态（例如在列表页和详情页同时显示），建议创建一个轻量级 Store 或利用 React Query 的 `QueryKey` 进行缓存管理。
  - **推荐方案**: 直接使用 **React Query (`useQuery`, `useMutation`)** 配合 `invalidateQueries` 即可，不需要额外的 Zustand Store，除非需要跨多页面的复杂状态同步。
  - **Query Keys**: `['favorites', 'check', targetType, targetId]` 和 `['favorites', 'list', targetType]`.

### 2.3 业务逻辑 Hooks

- [ ] **创建 `useFavorite` Hook (`src/hooks/useFavorite.ts`)**:
  - **Input**: `targetType`, `targetId`
  - **Output**: `{ isFavorite, toggle, isLoading, updateNote }`
  - **Logic**:
    - Mount 时调用 `FavoritesService.check()`.
    - `toggle` 调用 `add` 或 `remove`.
    - 成功后自动 invalidate 相关 Query.
    - 包含 `Optimistic Updates` (乐观更新) 以提供即时反馈。

### 2.4 UI 组件 (Components)

- [ ] **创建 `FavoriteButton` 组件 (`src/components/common/FavoriteButton.tsx`)**:
  - 通用按钮，支持 Heart 图标切换。
  - 支持传入 `targetType` 和 `targetId`。
  - 可选显示 `note` 输入框 (Tooltip 或 Popover)。

- [ ] **集成点**:
  - `MovieDetail` / `SeriesDetail` / `TorrentDetail` 页面头部。
  - 列表页卡片 (Hover 时显示)。

- [ ] **创建 `FavoritesPage` (`src/pages/Favorites/index.tsx`)**:
  - 路由: `/my/favorites`
  - Tab 切换: 全部 / 种子 / 电影 / 剧集 / 歌单。
  - 列表展示: 复用现有的 `MovieCard`, `TorrentItem` 等组件。

## 3. 扩展与优化建议 (Extensions & Optimizations)

### 3.1 增强交互：收藏备注 (User Notes)

- **现状**: 接口支持 `note` 字段，但通常 UI 只做一个简单的“爱心”按钮。
- **建议**:
  - **长按/右键** 收藏按钮时，弹出 Modal 允许输入备注（例如：“待看”，“强烈推荐”）。
  - 在收藏列表页，显示这些备注。

### 3.2 批量管理 (Batch Operations)

- **场景**: 用户在收藏列表中整理内容。
- **建议**:
  - 在 `FavoritesPage` 实现“管理模式”。
  - 支持多选项目，调用 `batch-remove` 接口一次性删除。
  - 支持多选项目，批量修改备注（如果接口支持，或前端循环调用）。

### 3.3 离线/本地状态同步

- **场景**: 用户未登录时。
- **建议**:
  - 未登录时点击收藏，提示登录，或使用 `localStorage` 暂存，登录后询问是否合并（需后端支持批量添加）。

## 4. 实施步骤 (Implementation Steps)

1.  **API Fix**: 运行 `npm run api:generate` 并确认 `FavoritesService` 存在。(如果失败，需检查后端 OpenApi JSON)。
2.  **Hook Dev**: 实现 `src/hooks/useFavorite.ts` (核心逻辑)。
3.  **Component Dev**: 开发 `FavoriteButton`。
4.  **Page Dev**: 开发 `FavoritesPage` 及其路由配置。
5.  **Integration**: 将 `FavoriteButton` 放到各个详情页。
