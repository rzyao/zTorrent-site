# 论坛主题切换功能实施计划 (Implementation Plan)

> **基于 PRD 版本**: v1.0
> **目标**: 实现论坛页面的深色/浅色主题手动切换及持久化。

## Step 1: 基础设施搭建 (Foundation)

构建主题管理的核心逻辑，包括状态管理、持久化存储和样式配置中心。

### Task 1.1: 创建主题 Context 与 Hook

- **ID**: 1.1
- **Depends On**: None
- **Description**: 创建 `ForumThemeContext` 用于管理主题状态，并封装 `useForumTheme` Hook 供组件使用。
- **Subtasks**:
  - [ ] 在 `src/pages/Forums/context/ForumThemeContext.tsx` 创建 Context。
  - [ ] 定义 `Theme` 类型 (`'light' | 'dark'`)。
  - [ ] 实现 `ForumThemeProvider` 组件。
  - [ ] 在 Provider 初始化时从 `localStorage` 读取 `forum-theme-preference`，默认为 `'light'`。
  - [ ] 实现 `toggleTheme` 方法，切换状态并同步写入 `localStorage`。
  - [ ] 导出 `useForumTheme` Hook。

### Task 1.2: 定义主题样式系统

- **ID**: 1.2
- **Depends On**: 1.1
- **Description**: 将 PRD 中定义的设计规范转化为代码中的配置对象，便于统一管理和维护。
- **Subtasks**:
  - [ ] 创建 `src/pages/Forums/constants/theme.ts`。
  - [ ] 定义 `themeConfig` 对象，包含 `light` 和 `dark` 两个键。
  - [ ] 按照 PRD 3.2.1 章节录入 `bg`, `text`, `border`, `card` 等类名映射。
  - [ ] 编写一个辅助函数 `getThemeClass(theme, key)` (可选，或直接在组件中访问对象)。

## Step 2: 组件适配 (Component Adaptation)

将现有的硬编码样式替换为基于主题状态的动态样式。

### Task 2.1: 适配 Header 组件与添加切换按钮

- **ID**: 2.1
- **Depends On**: 1.2
- **Description**: 改造 `Header.tsx` 以支持主题样式，并添加切换按钮。
- **Subtasks**:
  - [ ] 引入 `useForumTheme` Hook。
  - [ ] 替换 Header 容器的背景色 (`bg-white` -> dynamic) 和边框色。
  - [ ] 替换文字颜色 (`text-gray-900` -> dynamic)。
  - [ ] 在通知按钮左侧添加主题切换 Button。
  - [ ] 根据当前 `theme` 显示 `Sun` 或 `Moon` 图标 (来自 `lucide-react`)。
  - [ ] 绑定点击事件调用 `toggleTheme`。

### Task 2.2: 适配 Sidebar 组件

- **ID**: 2.2
- **Depends On**: 1.2
- **Description**: 改造 `Sidebar.tsx` 以适配深色/浅色模式。
- **Subtasks**:
  - [ ] 引入 `useForumTheme` Hook。
  - [ ] 替换 Sidebar 容器背景和边框。
  - [ ] 更新分类菜单项的 `active` 和 `inactive` 状态样式（深色模式下需使用 `amber` 高亮）。

### Task 2.3: 适配 ForumList 组件

- **ID**: 2.3
- **Depends On**: 1.2
- **Description**: 改造 `ForumList.tsx`，这是内容最丰富的部分，涉及卡片、标签、按钮等。
- **Subtasks**:
  - [ ] 引入 `useForumTheme` Hook。
  - [ ] 替换筛选/排序栏的背景和边框。
  - [ ] 替换话题卡片 (`article`) 的背景、边框和阴影效果。
  - [ ] 更新标题、摘要、元数据的文字颜色。
  - [ ] 适配标签 (`Badge` 类似元素) 的背景色和文字色。

### Task 2.4: 适配 TopicDetail 组件

- **ID**: 2.4
- **Depends On**: 1.2
- **Description**: 改造话题详情页。
- **Subtasks**:
  - [ ] 引入 `useForumTheme` Hook。
  - [ ] 适配详情内容区域的背景和文字。
  - [ ] 适配评论列表和输入框样式。

## Step 3: 整合与优化 (Integration & Polish)

完成最后的组装，确保过渡流畅，无样式漏洞。

### Task 3.1: 页面级整合

- **ID**: 3.1
- **Depends On**: 2.4
- **Description**: 在 `Forums/index.tsx` 中应用 Provider 并处理全局背景。
- **Subtasks**:
  - [ ] 使用 `ForumThemeProvider` 包裹 `Forums/index.tsx` 的内容。
  - [ ] 将最外层 `div` 的背景色改为动态获取。
  - [ ] 确保 `Header`, `Sidebar`, `Main` 布局结构中的背景色层级正确。

### Task 3.2: 添加过渡动画与验收

- **ID**: 3.2
- **Depends On**: 3.1
- **Description**: 提升用户体验并进行最终测试。
- **Subtasks**:
  - [ ] 在主要容器上添加 `transition-colors duration-200` 类。
  - [ ] 验证深色模式下是否所有元素都符合 PRD 规范（特别是琥珀色高亮）。
  - [ ] 验证刷新页面后主题是否保持。
  - [ ] 检查控制台是否有 Errors/Warnings。
