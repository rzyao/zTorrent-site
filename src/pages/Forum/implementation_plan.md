# Implementation Plan - 论坛经典首页重构

## Phase 1: 配置与基础组件

- [x] **Define Partitions**: Create `FORUM_PARTITIONS` configuration in `src/pages/Forum/constants.ts`.
- [x] **Create BoardRow**: Implement `src/pages/Forum/components/ForumIndex/BoardRow.tsx` for displaying individual board info.
- [x] **Create PartitionGroup**: Implement `src/pages/Forum/components/ForumIndex/PartitionGroup.tsx` to list boards under a partition.
- [x] **Create ForumIndex**: Implement `src/pages/Forum/components/ForumIndex/index.tsx` to assemble the full index page.

## Phase 2: 页面逻辑集成

- [x] **Refactor ForumPage**: Update `src/pages/Forum/index.tsx` to handle `viewMode` state.
  - [x] Add `viewMode` state.
  - [x] Render `ForumIndex` when in index mode.
  - [x] Handle navigation from Index -> Board List.
- [x] **Navigation Updates**: Ensure existing Breadcrumbs or Titles work with the new hierarchy.

## Phase 3: 样式与细节

- [x] **Styling**: Apply Tailwind CSS for a premium, clean look (Glassmorphism hints, distinct typography).
- [x] **Mock Data Handling**: Handle cases where some categories don't match configured partitions (put in "Uncategorized").
