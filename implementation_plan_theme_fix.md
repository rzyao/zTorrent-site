# 实施计划 - 主题切换性能优化

## 1. 问题分析

用户在切换主题（深色/浅色）时遇到明显的界面卡顿。
**原因**: 大量组件（特别是列表项和交互元素）使用了 `transition-colors` 和 `transition-all`。当主题变量在 `<html>` 根元素改变时，浏览器试图同时对成百上千个 DOM 元素进行 200ms 的颜色插值动画，导致主线程阻塞。

## 2. 解决方案

**策略**: 移除不必要的 CSS 过渡效果，特别是针对 `background-color`, `border-color`, `text-color` 的全局过渡。
仅保留用户交互（如 Hover、展开/收起）时的局部过渡效果，或完全移除颜色相关的过渡。

## 3. 实施步骤

### Phase 1: 核心布局优化

- [x] **ForumLayout & Header**: 移除容器级的 `transition-colors`，确保大面积背景切换瞬间完成，不占用合成器资源。
- [x] **Theme Constants**: 清理 `theme.ts` 中定义的 Tailwind 类字符串，移除嵌入的 `transition` 类。

### Phase 2:列表与侧边栏优化

- [x] **Sidebar Components**: 移除 `SidebarTags`, `SidebarCategories`, `SidebarNav` 按钮的过渡。这些按钮数量较多，影响显著。
- [x] **ForumList**: 移除话题列表项的过渡。这是首屏最大的性能瓶颈源（通常有 20-50 个复杂 DOM 节点）。
- [x] **CategoriesPage**: 移除分类列表卡片的颜色过渡。

### Phase 3: 详情页优化

- [x] **Post Component**: 移除帖子底部操作按钮（点赞、回复等）的 `transition-all`。
- [x] **TopicFooter & Timeline**: 移除底部统计区和时间轴组件的非必要动画。

## 4. 验证

- 手动切换主题，确保无延迟。
- 检查控制台无 CSS 相关警告。
- 确认 Hover 状态下的视觉反馈依然存在（虽然不再有渐变，但响应更迅速）。
