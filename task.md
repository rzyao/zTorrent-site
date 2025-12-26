# 审核详情页重构任务清单 (Task List)

## Phase 1: 组件解耦与抽象 (Component Refactoring)

- [ ] **Task 1: 提取种子详情组件** <!-- id: 1 -->
  - 源: `src/pages/TorrentDetail/index.tsx`
  - 目标: `src/components/business/TorrentDetailBody.tsx`
  - 说明: 将 UI 展示逻辑移入新组件，确保只依赖 Props (TorrentData, FileItem[], etc.)。

- [ ] **Task 2: 提取电影详情组件** <!-- id: 2 -->
  - 源: `src/pages/MovieDetail/index.tsx`
  - 目标: `src/components/business/MovieDetailBody.tsx`
  - 说明: 封装 Hero, Stills, Tabs 等子组件展示逻辑。

- [ ] **Task 3: 提取片单详情组件** <!-- id: 3 -->
  - 源: `src/pages/PlaylistDetail/index.tsx`
  - 目标: `src/components/business/PlaylistDetailBody.tsx`
  - 说明: 封装 Hero, GridView/ListView 等展示逻辑。

## Phase 2: 审核数据层建设 (Review Data Layer)

- [ ] **Task 4: 创建审核详情 Hook** <!-- id: 4 -->
  - 目标: `src/pages/Review/hooks/useReviewItemDetail.ts`
  - 说明: 接收 `id, type`，调用 `TorrentsSearchService`/`MoviesService`/`PlaylistsService` 获取全量详情，并适配为 Body 组件所需的 Props 结构。

## Phase 3: 审核界面重组 (Review UI Implementation)

- [ ] **Task 5: 实现一键驳回理由组件** <!-- id: 5 -->
  - 目标: `src/pages/Review/components/QuickReasonSelector.tsx`
  - 说明: 提供 Tags 选择器，支持多选预设理由。

- [ ] **Task 6: 重构审核详情抽屉 (DetailDrawer)** <!-- id: 6 -->
  - 目标: `src/pages/Review/components/DetailDrawer.tsx`
  - 说明:
    - 升级为宽幅布局 (90% width)。
    - 集成 `useReviewItemDetail`。
    - 动态渲染 `*DetailBody` 组件。
    - 底部 Action Bar 集成 QuickReasonSelector。

## Phase 4: 验证 (Verification)

- [ ] **Task 7: 功能与交互验证** <!-- id: 7 -->
  - 说明: 验证各类型资源详情展示无误，审核操作流程顺畅。
