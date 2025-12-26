# 审核详情页重构实施计划 (Implementation Plan)

本文档基于 `docs/requirements/audit_detail_refactor_prd.md`，旨在将审核详情页从简单的列表摘要展示，升级为包含完整信息（MediaInfo、文件列表、图文简介）的沉浸式工作台。

## Phase 1: 组件解耦与抽象 (Component Refactoring)

本阶段的目标是将现有前台详情页的展示逻辑（UI）与数据获取逻辑（Hooks/Pages）分离，提取出可复用的 "Body" 组件。

### 1.1 提取种子详情组件

- **源文件**: `src/pages/TorrentDetail/index.tsx`
- **目标**: 创建 `src/components/business/TorrentDetailBody.tsx`
- **工作内容**:
  - 将 `MediaInfo`、`FileListItem`、`Carousel`、`Description`、`Comments` 等渲染逻辑移入新组件。
  - 移除所有 `useParams`, `useFavorite`, `useQuery` 等副作用 hooks，仅接受 Props 数据。
- **Props 结构**:
  ```typescript
  interface TorrentDetailBodyProps {
    data: TorrentData; // 核心元数据
    fileList: FileItem[]; // 文件列表
    mediaInfo: string; // 技术参数
    stills?: string[]; // 剧照
    comments?: Comment[]; // 评论列表
    // ...其他展示所需数据
  }
  ```

### 1.2 提取电影详情组件

- **源文件**: `src/pages/MovieDetail/index.tsx`
- **目标**: 创建 `src/components/business/MovieDetailBody.tsx`
- **工作内容**:
  - 提取 `Hero`, `Stills`, `TorrentTabs`, `AwardsSidebar` 等子组件的组合逻辑。
  - 同样通过 Props 接收 `FilmDetail` 数据。

### 1.3 提取片单详情组件

- **源文件**: `src/pages/PlaylistDetail/index.tsx`
- **目标**: 创建 `src/components/business/PlaylistDetailBody.tsx`
- **工作内容**:
  - 提取 `Hero`, `GridView`, `ListView` 等展示逻辑。

## Phase 2: 审核数据层建设 (Review Data Layer)

本阶段目标是在审核模块中建立独立的数据获取机制，不再依赖列表页的简略信息。

### 2.1 创建通用详情 Hook

- **文件**: `src/pages/Review/hooks/useReviewItemDetail.ts`
- **功能**:
  - 接收 `id` 和 `type` (`torrent` | `movie` | `playlist`)。
  - 内部根据 `type` 分发调用不同的 API 服务：
    - Torrent -> `TorrentsSearchService.torrentSearchControllerDetail`
    - Movie -> `MoviesService.movieBaseControllerGetDetail` (及相关关联接口)
    - Playlist -> `PlaylistsService.playlistCoreControllerGet`
  - 统一管理 Loading / Error 状态。
  - **关键**: 需将不同服务的返回数据适配为上述 Body 组件所需的 Props 格式。

## Phase 3: 审核界面重组 (Review UI Implementation)

本阶段将新的数据层和 UI 组件整合进 `DetailDrawer`。

### 3.1 改造 DetailDrawer

- **文件**: `src/pages/Review/components/DetailDrawer.tsx`
- **样式调整**: 将宽度改为 `w-[90vw]` 或 `max-w-[1600px]`，实现宽幅抽屉。
- **逻辑接入**:
  - 引入 `useReviewItemDetail` 获取全量数据。
  - 根据 `item.type` 条件渲染 `<TorrentDetailBody />`, `<MovieDetailBody />` 或 `<PlaylistDetailBody />`。
  - 处理数据加载时的 Skeleton 状态。

### 3.2 优化操作栏 (Sticky Footer)

- **常驻底部**: 确保操作栏不随内容滚动。
- **历史记录**: 集成 `HistoryModal` 或直接在侧边展示简略历史。

## Phase 4: 效率工具集成 (Efficiency Tools)

### 4.1 实现“一键理由”

- **组件**: 新增 `src/pages/Review/components/QuickReasonSelector.tsx`。
- **功能**:
  - 提供预设 Tag（如 "缺少MediaInfo", "图片失效"）。
  - 点击 Tag 自动追加文本到 `ActionModal` 的备注框中。
  - 集成到 `DetailDrawer` 的驳回流程中（或直接在 Footer 提供带理由的驳回按钮）。

## Phase 5: 验证与回归 (Verification)

- **功能验证**:
  - 点击种子：MediaInfo 是否显示？文件树是否完整？
  - 点击电影：演员表、关联种子是否显示？
  - 点击片单：包含影片是否列出？
- **交互验证**: 驳回操作是否顺畅？理由填充是否正确？
- **性能验证**: 弹窗加载速度是否在可接受范围内？
