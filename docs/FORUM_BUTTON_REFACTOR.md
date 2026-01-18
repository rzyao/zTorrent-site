# 论坛按钮修改位置清单 (Button Locations)

## 1. 话题底部主操作栏 (Topic Footer)

**文件路径**: `src/modules/forum/pages/TopicDetail/components/TopicFooter.tsx`

- **功能按钮**: 分享、点赞、收藏、举报、回复。
- **修改详情**: 统一使用 `rounded-full` 全圆角，全部接入新 `Button` 组件。

## 2. 帖子内容右下角细项 (Post Actions)

**文件路径**: `src/modules/forum/pages/TopicDetail/components/PostParts/PostFooter.tsx`

- **功能按钮**: 点赞、编辑、链接、收藏、举报、回复。
- **修改详情**: `Like` 与 `Bookmark` 使用 `iconOnly` 模式（透明背景/无边框），其余按钮优化了悬浮样式。

## 3. 右侧时间轴与浮动工具 (Timeline & Sidebar)

**相关文件**:

- `src/modules/forum/pages/TopicDetail/components/Timeline.tsx` (回复、通知按钮)
- `src/modules/forum/pages/TopicDetail/components/TopicAdminMenu.tsx` (扳手图标)
- `src/modules/forum/pages/TopicDetail/components/NotificationSelector.tsx` (通知状态文字)
- **修改详情**: 为所有图标按钮添加了 `cursor-pointer` (悬浮小手)；通知选择器已完成全中文化。
