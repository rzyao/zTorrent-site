# 实施计划 - 论坛编辑器 (Forum Composer)

## 1. 目标 (Goal)

构建一个与 Discourse 高度一致的全局论坛编辑器 (`ForumComposer`)，支持话题创建、回复、引用、草稿保存、Markdown 预览和高度调整功能。

## 2. 架构设计 (Architecture)

### 2.1 状态管理 (State Management)

使用 Zustand 创建 `useComposerStore`，全局管理编辑器状态：

- `isOpen`: boolean
- `mode`: 'CREATE_TOPIC' | 'REPLY' | 'EDIT'
- `viewState`: 'NORMAL' | 'MINIMIZED' | 'FULLSCREEN'
- `composerHeight`: number (px)
- `draft`: { title, categoryId, tags, body, ... }
- `meta`: { replyToPostId, replyToTopicId, quoteContent, ... }

### 2.2 组件结构 (Component Structure)

- `src/pages/Forums/components/Composer/`
  - `ForumComposer.tsx` (主容器，处理拖拽、布局状态)
  - `ComposerStore.ts` (Zustand 状态库)
  - `ComposerEditor.tsx` (TextArea + Markdown 工具栏)
  - `ComposerPreview.tsx` (Markdown 渲染预览)
  - `ComposerHeader.tsx` (操作栏、最小化/关闭按钮)
  - `ComposerToolbar.tsx` (编辑器工具栏)
  - `ComposerInputs.tsx` (标题、分类、标签输入区域 - 仅 Create 模式显示)

## 3. 实施步骤 (Phases)

### Phase 1: 基础设施与状态 (Infrastructure & State)

- [ ] 创建 `useComposerStore`，定义所有核心状态和 Action。
- [ ] 在 `ForumLayout` 中挂载 `ForumComposer` 组件，确保全局可用。
- [ ] 实现基础的 "抽屉" 布局和显隐逻辑。

### Phase 2: UI 框架与交互 (UI Shell & Interaction)

- [ ] 实现 `Grippie` (拖拽把手) 和高度调整逻辑 (Resizing)。
- [ ] 实现 最小化/全屏/还原 的视图状态切换。
- [ ] 实现 `ComposerHeader` 和 `ComposerInputs` (标题、分类选择器)。

### Phase 3: 编辑器核心 (Editor Core)

- [ ] 实现 `ComposerEditor` (Textarea + 基础样式)。
- [ ] 实现 `ComposerPreview` (基于 `react-markdown` 或现有 Markdown 组件)。
- [ ] 实现 `ComposerToolbar` (加粗、链接、引用等快捷键)。
- [ ] 实现 移动端/桌面端 响应式布局适配。

### Phase 4: 业务逻辑与 API (Logic & API)

- [ ] **草稿系统**: 实现 `localStorage` 自动保存与恢复。
- [ ] **API 对接**:
  - `POST /topics` (创建)
  - `POST /topics/:id/posts` (回复)
- [ ] **引用功能**: 处理 `replyToPostId` 和引用文本的插入。

### Phase 5: 集成与入口 (Integration)

- [ ] **Navbar**: 绑定 "新建话题" 按钮。
- [ ] **TopicDetail**: 绑定 "回复" 按钮。
- [ ] **PostItem**: 绑定 "引用/回复" 按钮。
- [ ] **CategoryPage**: 绑定 "新建话题" 按钮 (预填分类)。

## 4. 验证计划 (Verification)

- 验证拖拽调整高度是否流畅且不卡顿。
- 验证刷新页面后，草稿内容是否自动恢复。
- 验证创建话题和回复接口能否成功调用并跳转。
