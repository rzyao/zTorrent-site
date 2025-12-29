# Implementation Plan - UI Consistency Fixes

## 1. 目标 (Goal)

修复 `TopicDetail.tsx` 页面与参考页面 (Reference) 之间的视觉差异，特别是用户指出的 "Suggest Topics" table 以及之前的 Avatar、Timeline 等问题。

## 2. 变更详情 (Changes)

### 2.1 样式调整 (TopicDetail.tsx)

#### A. Suggested Topics (重点)

- [x] **Grid Headers**:
  - 移除 `uppercase`。
  - 字体大小从 `text-[11px]` 改为 `text-[15px]` 或 `text-base`。
  - 字重从 `font-bold` 改为 `font-medium`。
  - 底部边框从 `border-b-2` 改为 `border-b`。
- [x] **Grid Rows**:
  - 调整 Grid 列宽，确保统计数字列紧凑。
  - 确保 `hover` 效果柔和。

#### B. Component Sizing & Layout

- [x] **Avatar**: 将帖子头像尺寸从 `h-12 w-12` (48px) 调整为 `h-[45px] w-[45px]`。
- [x] **Timeline**:
  - 宽度 `w-[140px]` -> `w-[112px]`。
  - 左侧间距 `ml-6` -> `ml-3`。
- [x] **Post Spacing**:
  - `py-6` -> `py-3` (更紧凑的帖子间距)。
- [x] **Title**:
  - `text-[1.7em]` -> `text-[24px]` (Pixel perfect)。

## 3. 验证步骤 (Verification)

1.  自动构建并加载页面 `/forum/topic/287`。
2.  检查 "Suggested Topics" 表头是否不再是大写粗体。
3.  检查头像是否略微变小。
4.  检查右侧时间轴是否变窄。
