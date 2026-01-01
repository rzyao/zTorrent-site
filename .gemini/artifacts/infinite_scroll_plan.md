# 无限滚动实现计划

## 目标

实现类似 Discourse 的无限上拉加载功能，用于：

1. Topic 列表页面（话题列表）
2. Post 列表页面（话题详情内的回复列表）

## 技术方案

### 依赖

- `@tanstack/react-query` 的 `useInfiniteQuery`
- Intersection Observer API（用于检测滚动到底部）

### 需要修改的文件

#### 1. Topic 列表

- `src/pages/Forums/hooks/useForumsTopicsQuery.ts`
  - 将 `useQuery` 改为 `useInfiniteQuery`
  - 实现 `getNextPageParam` 函数
- `src/pages/Forums/pages/CategoryPage/TopicList.tsx`（或相关组件）
  - 添加 Intersection Observer 触发加载
  - 渲染 `fetchNextPage` 时的 Loading 状态

#### 2. Post 列表

- `src/pages/Forums/pages/TopicDetail/hooks/useTopicDetail.ts`
  - 将 posts 的 `useQuery` 改为 `useInfiniteQuery`
- `src/pages/Forums/pages/TopicDetail/index.tsx`
  - 添加 Intersection Observer 触发加载

## 实现步骤

### Step 1: 创建通用的 useIntersectionObserver Hook

用于检测元素进入视口，触发加载更多。

### Step 2: 修改 useForumsTopicsQuery

改为 `useInfiniteQuery`，支持分页加载。

### Step 3: 更新 Topic 列表组件

使用新的 hook 并添加滚动加载触发器。

### Step 4: 修改 useTopicDetail 中的 posts 查询

改为 `useInfiniteQuery`。

### Step 5: 更新 TopicDetail 组件

添加帖子列表的无限滚动加载。
