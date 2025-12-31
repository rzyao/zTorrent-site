# 任务清单 - 主题切换性能优化

- [x] **Step 1: CSS 变量与 Transition 优化**
  - [x] 移除 `src/pages/Forums/constants/theme.ts` 中的 `transition` 属性
  - [x] 移除 `ForumLayout` 和 `Header` 的全局 `transition-colors`
- [x] **Step 2: 组件级优化 (Sidebar)**
  - [x] 优化 `Sidebar`, `SidebarTags`, `SidebarCategories`, `SidebarNav`
- [x] **Step 3: 组件级优化 (Topic List)**
  - [x] 优化 `ForumList/index.tsx` (Topic Items)
  - [x] 优化 `ForumFilterBar.tsx`
  - [x] 优化 `CategoriesPage.tsx`
- [x] **Step 4: 组件级优化 (Topic Detail)**
  - [x] 优化 `Post.tsx` (Action buttons)
  - [x] 优化 `TopicFooter.tsx`
  - [x] 优化 `TopicHeader.tsx`
  - [x] 优化 `SuggestedTopics.tsx`
  - [x] 优化 `NotificationSelector.tsx`
  - [x] 优化 `Timeline.tsx`
