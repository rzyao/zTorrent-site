# Discourse 风格话题详情页实现计划

基于 `discourse-post-stream-analysis.md` 文档，按照 Discourse 的模式重构话题详情页。

## 核心目标

1. **时间轴显示**: 精确的进度指示器，支持拖拽跳转
2. **双向无限滚动**: 支持向上、向下加载更多帖子
3. **跨楼层跳转**: 通过 URL 导航到任意楼层

---

## 实现清单

### 1. 重构 `useTopicDetail` Hook (核心)

**文件**: `hooks/useTopicDetail.ts`

**改动**:

- [x] 已添加 `nearPost` 参数和 `initialPage` 计算
- [ ] 添加 `fetchPreviousPage` 支持向上滚动
- [ ] 添加 `hasPreviousPage` 状态
- [ ] 维护全局 `stream` (帖子 ID 列表) 用于位置计算
- [ ] 添加 `totalPostsCount` 用于时间轴（从 topic 获取）

### 2. 更新 `TopicDetail` 组件

**文件**: `index.tsx`

**改动**:

- [ ] 向上滚动加载 (`fetchPreviousPage`)
- [ ] 向下滚动加载 (`fetchNextPage`) - 已有
- [ ] 滚动位置维护（向上加载后保持位置）
- [ ] 时间轴进度计算（基于后端 `totalPostsCount`）
- [ ] 楼层跳转高亮效果

### 3. 更新 `Timeline` 组件

**文件**: `components/Timeline.tsx`

**改动**:

- [ ] 接收 `totalPostsCount` (后端总数) 而非前端列表长度
- [ ] 拖拽时调用 `onJumpToPost(postNumber)` 而非百分比滚动
- [ ] 点击"返回顶部"/"跳到底部"按钮触发路由跳转

### 4. 后端 API 依赖

**确认后端支持**:

- [ ] GET `/posts?topicId=X&page=N` 返回 `{ items, total, page, limit }`
- [ ] `total` 必须是话题的**真实总帖子数**
- [ ] 考虑添加 `nearPost` 参数直接定位

---

## 详细设计

### A. 双向无限滚动

```
当前实现:
  只支持向下滚动 (fetchNextPage)

目标:
  ┌─────────────────────────────┐
  │  ↑ 加载更多 (prependMore)   │  <- 滚动到顶部时触发
  ├─────────────────────────────┤
  │         帖子列表             │
  ├─────────────────────────────┤
  │  ↓ 加载更多 (appendMore)    │  <- 滚动到底部时触发
  └─────────────────────────────┘
```

**实现步骤**:

1. 在滚动容器顶部添加 `loadMorePrevRef` 观察器
2. 触发 `fetchPreviousPage()` 加载上一页
3. 加载后维护滚动位置（防止视图跳动）

### B. 时间轴进度计算

```
当前问题:
  totalPosts = 已加载帖子数 (例如 20)

应该:
  totalPosts = topic.replyCount + 1 (例如 315)
```

**数据流**:

1. `useTopicDetail` 返回 `{ topicData, totalPostsCount }`
2. `TopicDetail` 传递给 `Timeline`
3. `Timeline` 显示 `currentPost / totalPostsCount`

### C. 跨楼层跳转

```
路由: /forum/topic/:topicId/:postNumber?

跳转流程:
1. 用户点击时间轴或引用链接
2. navigate(`/forum/topic/${topicId}/${postNumber}`)
3. TopicDetail 检测 postNumber 变化
4. useTopicDetail 计算 nearPost 对应页码
5. 刷新数据 (invalidate + refetch)
6. 滚动到目标帖子
```

---

## 执行顺序

1. **Phase 1**: 修复时间轴显示（使用后端总数）
2. **Phase 2**: 实现向上滚动加载
3. **Phase 3**: 完善跨楼层跳转（已部分实现）

开始执行...
