# Forum List Redesign Implementation Plan

## Step 1: Data Structure Enhancement

### Task 1.1: Enhance Mock Data

- **ID**: 1.1
- **Depends On**: None
- **Description**: 更新 `ForumList.tsx` 中的 `mockTopics` 数据结构，为每个话题增加参与者信息，以支持多头像显示逻辑。
- **Subtasks**:
  - [ ] 为每个 topic 对象增加 `participants` 数组，包含活跃回复者的头像 URL。
  - [ ] 确保 `lastReplier` 信息包含头像 URL（不仅是时间）。
  - [ ] 确保 `author` 信息包含头像 URL。

## Step 2: Component Refactoring - Filter Tabs

### Task 2.1: Redesign Filter Tabs

- **ID**: 2.1
- **Depends On**: None
- **Description**: 将顶部的筛选栏（最新/最热/趋势）从胶囊按钮样式改为“文本+底部高亮条”风格。
- **Subtasks**:
  - [ ] 移除旧的 `bg-blue-100` 等按钮背景样式。
  - [ ] 实现文本点击交互。
  - [ ] 添加选中状态下的底部 Border (Brand Color) 和字体加粗效果。
  - [ ] 适配深色模式下的文字和高亮色。

## Step 3: Component Refactoring - Topic List Item

### Task 3.1: Implement Responsive Layout

- **ID**: 3.1
- **Depends On**: 1.1
- **Description**: 重构话题列表项的 DOM 结构，实现 Desktop (三栏) 和 Mobile (两栏) 的响应式切换。
- **Subtasks**:
  - [ ] 移除旧的 Card 样式（圆角、阴影），改为扁平列表 + `border-bottom`。
  - [ ] 使用 Flexbox 或 Grid 实现 Desktop 端的三栏布局 (Info / Participants / Stats)。
  - [ ] 使用媒体查询 (`md:hidden` / `md:flex`) 实现 Mobile 端的两栏紧凑布局。

### Task 3.2: Implement Avatar Group (Desktop)

- **ID**: 3.2
- **Depends On**: 3.1
- **Description**: 在 Desktop 视图中实现 5 槽位的头像组显示逻辑。
- **Subtasks**:
  - [ ] Slot 1: 显示楼主头像。
  - [ ] Slot 2-4: 显示活跃参与者头像（从 mock 数据获取）。
  - [ ] Slot 5: 显示最新回复者头像。
  - [ ] 处理头像的圆形裁切、边框（用于在深色背景下从视觉上分割头像）和尺寸控制。

### Task 3.3: Implement Mobile View Details

- **ID**: 3.3
- **Depends On**: 3.1
- **Description**: 优化移动端视图的右侧信息展示。
- **Subtasks**:
  - [ ] 仅显示最新回复者头像（小尺寸）。
  - [ ] 高亮显示回复数。
  - [ ] 垂直堆叠布局调整。

## Step 4: Theming and Polish

### Task 4.1: Dark Mode Adaptation

- **ID**: 4.1
- **Depends On**: 3.1, 2.1
- **Description**: 确保重构后的组件符合 PRD 定义的深色模式规范。
- **Subtasks**:
  - [ ] 背景色在深色模式下使用 `#0F171E`。
  - [ ] Hover 效果在深色模式下使用 `bg-white/5`。
  - [ ] 分割线颜色适配。

### Task 4.2: Cleanup

- **ID**: 4.2
- **Depends On**: 4.1
- **Description**: 清理不再使用的旧样式代码和辅助函数。
- **Subtasks**:
  - [ ] 移除旧的 Card 类名引用。
  - [ ] 验证所有交互（点击话题、切换 Tab）正常工作。
