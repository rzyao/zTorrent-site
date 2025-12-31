# zTorrent 论坛编辑器 (Composer) 产品需求文档 (PRD)

## 1. 项目背景与价值主张 (Project Background & Value Proposition)

### 1.1 背景

当前 zTorrent 论坛模块缺乏统一的话题创建与回复入口。为了提供流畅的社区交互体验，我们需要实现一个功能完备的富文本编辑器（Composer）。

### 1.2 目标

**完全复刻 Discourse Composer 的核心体验**，实现以下目标：

- **一致性**：视觉风格和交互行为与 Discourse 保持高度一致。
- **无缝衔接**：支持在浏览论坛的同时进行内容创作，不打断阅读体验。
- **易用性**：提供 Markdown 实时预览、自动草稿保存等辅助功能。

## 2. 核心用户角色 (Core User Roles)

- **已登录用户 (Registered User)**:
  - 可以发起新话题 (Create Topic)。
  - 可以回复现有话题 (Reply to Topic)。
  - 可以引用特定帖子进行回复 (Reply to Post)。
  - 可以保存和恢复编辑草稿 (Draft)。

## 3. 功能模块详细说明 (Functional Requirements)

### 3.1 Composer 容器 (Composer Container) [P0]

**描述**: 一个始终固定在浏览器底部的可折叠面板。

- **状态管理**:
  - **关闭 (Closed)**: 默认状态，不可见。
  - **打开 (Open)**: 占据屏幕底部约 300px-400px 高度。
  - **全屏 (Fullscreen)**: 占据整个视口，专注写作模式。
  - **最小化 (Minimized)**: 仅显示标题栏，类似任务栏托盘。

- **交互行为**:
  - **拖拽调整高度**: 用户可以通过拖拽顶部的 "Grippie" 把手调整编辑器高度。
  - **快捷键**: `Esc` 尝试取消/关闭，`Ctrl+Enter` 提交。

### 3.2 编辑模式 (Editing Modes) [P0]

组件需根据触发上下文自动切换模式：

#### A. 创建话题模式 (New Topic Mode)

- **输入项**:
  - **标题 (Title)**: 必填。
  - **分类 (Category)**: 下拉选择器，支持搜索。若从分类页进入，自动预填。
  - **标签 (Tags)**: 多选标签输入框 (可选)。
  - **正文 (Body)**: Markdown 编辑器。

#### B. 回复模式 (Reply Mode)

- **输入项**:
  - **正文 (Body)**: 仅需输入正文。
- **上下文显示**:
  - 顶部显示 "回复给 [话题标题]"。
  - 若是引用回复，显示引用的帖子摘要。

### 3.3 正文编辑器 (Editor & Preview) [P0]

- **编辑器类型**: 纯文本 Markdown 编辑器 (Textarea)。
- **工具栏**: 提供加粗、斜体、链接、引用、代码块、上传图片、emoji 表情等常用 Markdown 快捷按钮。
- **实时预览**:
  - **桌面端**: 左右分栏布局（左侧编辑，右侧预览）。
  - **移动端**: 通过按钮切换编辑/预览视图。

### 3.4 状态持久化 (Persistence & Drafts) [P0]

- **机制**: 使用 `localStorage` 实现前端自动保存。
- **逻辑**:
  - 键值设计建议: `composer_draft_topic_{topicId}` 或 `composer_draft_new`。
  - 当编辑器内容变更时，防抖 (Debounce) 写入本地存储。
  - 页面刷新或重新打开编辑器时，自动检测并恢复草稿。
  - 发送成功后，清除对应草稿。

### 3.5 入口与触发 (Triggers) [P0]

需在以下位置实现触发逻辑：

1.  **全局导航栏**: "新建话题" 按钮 -> 打开创建模式。
2.  **话题详情页底部**: "回复" 按钮 -> 打开回复模式。
3.  **帖子操作栏**: "回复" 按钮 -> 打开引用回复模式。
4.  **分类页面**: "新建话题" 按钮 -> 打开创建模式并预填当前分类。

### 3.6 提交与反馈 (Submission) [P0]

- **API 对接**:
  - 创建话题: `POST /api/v1/store/forum/topics` (需确认具体 Path)
  - 回复话题: `POST /api/v1/store/forum/topics/:id/posts`
- **反馈**:
  - 提交中: 按钮显示 Loading 状态，禁用输入。
  - 成功: 关闭编辑器，清除草稿，自动滚动到新发布的帖子/话题。
  - 失败: 显示红色错误提示条，保留用户输入内容。

## 4. 界面规范 (UI Specifications)

### 4.1 布局参考 (Discourse)

- **背景**: 适配明/暗色模式 (`bg-background` / `dark:bg-background`)。
- **边框**: 顶部有明显边框 (`border-t`)。
- **阴影**: 悬浮阴影 (`shadow-lg`)。
- **Grippie**: 顶部居中显示拖拽把手图标。

### 4.2 响应式设计

- **Mobile (< 768px)**:
  - 默认占满全屏或大半屏。
  - 隐藏实时预览侧边栏，改为 Tab 切换。
  - 简化工具栏。

## 5. 后续规划 (Future Scope) [P1]

- 图片拖拽上传/粘贴上传。
- 更加丰富的富文本辅助工具。
- 提及用户 (@mention) 自动补全。
