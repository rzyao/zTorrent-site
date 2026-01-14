# Admin UI 设计规范 (Admin UI Standards)

## 1. 表格规范 (Data Tables)

### 1.1 基础样式 (Base Styles)

- **字体**: 使用 `text-sm` (14px)。
- **行高**: 默认行高，单元格内边距为 `px-4 py-2`。
- **边框**: 行之间使用 `border-b border-gray-100` 分隔。
- **Hoever 效果**: 行 Hover 时背景色为 `hover:bg-neutral-50/50`。

### 1.2 表头 (Table Header)

- **背景色**: `bg-[#FAFAFA]` (浅灰)。
- **文字**: `text-antd-text` (#333), `font-semibold` (600权重)。
- **对齐**: 默认左对齐 (`text-left`)。

### 1.3 操作列 (Operation Column)

- **表头对齐**: **必须居中显示** (`text-center`)。
- **单元格对齐**: 内容区也需居中 (`flex justify-center`).
- **固定宽度**: 建议设置固定宽度（如 `w-[150px]`），防止挤压。

### 1.4 操作按钮 (Operation Buttons)

在表格行内使用按钮时，应保持界面整洁，**不要使用带背景色的按钮**。

| 操作类型      | 推荐组件款式     | 样式类名/属性                        | 说明                  |
| :------------ | :--------------- | :----------------------------------- | :-------------------- |
| **编辑/查看** | Text/Link Button | `variant="link"` size="small"        | 蓝色文字，无背景。    |
| **删除**      | Dangerous Link   | `variant="link" danger` size="small" | 红色文字，无背景。    |
| **更多**      | Dropdown Icon    | `variant="text" size="icon"`         | 仅显示 `...` 或图标。 |

**代码示例**:

```tsx
// 操作列定义
{
  title: "操作",
  key: "action",
  className: "text-center", // 表头居中
  render: (_, record) => (
    <div className="flex justify-center gap-2"> {/* 内容居中 */}
      <Button variant="link" size="small" onClick={() => handleEdit(record)}>
        编辑
      </Button>
      <Button variant="link" size="small" danger onClick={() => handleDelete(record)}>
        删除
      </Button>
    </div>
  )
}
```

## 2. 页面工具栏 (Page Toolbar)

位于页面或表格顶部的操作区域。

| 按钮类型        | 用途                         | 组件款式                   | 图标要求                   |
| :-------------- | :--------------------------- | :------------------------- | :------------------------- |
| **新建/主操作** | 创建新数据、最重要的业务动作 | `variant="primary"`        | `Plus` 等语义化图标 (左侧) |
| **次级操作**    | 刷新、导出、批量操作         | `variant="default"`        | 视情况添加                 |
| **危险操作**    | 批量删除                     | `variant="primary" danger` | `Trash2`                   |

**样式统一**:

- **表格操作列**: 必须使用 `size="small"` (高度 24px)，以保持表格紧凑。
- **页面工具栏**: 使用默认中号 (32px，不设置 size 属性)，视觉更加醒目。
- 间距: 按钮之间 `gap-2`。

## 3. 文字排版 (Typography)

- **主标题 (H1/Page Title)**: `text-xl font-semibold tracking-tight`。
- **副标题/描述**: `text-sm text-muted-foreground`。
- **正文**: `text-sm text-gray-900`。
- **辅助文字**: `text-xs text-muted-foreground`。

## 4. 颜色规范 (Colors)

基于 Tailwind 配置与 CSS 变量：

- **Primary (主色)**: `text-primary` (通常为品牌蓝)。
- **Border (边框)**: `border-gray-200` (常规), `border-gray-100` (轻微分割)。
- **Background (背景)**: `bg-white` (卡片/内容), `bg-muted/40` (灰色底板)。

## 5. 布局与间距 (Layout & Spacing)

### 5.1 页面内边距 (Page Padding)

- **默认内边距**: 布局已内置标准内边距（通常为 `p-6` / 24px）。
- **禁止重复设置**:
  - 页面内部的根 `div` 或 `Card` **不应**再添加额外的外边距 (`margin`) 或全页面的内边距 (`padding`)。
  - 避免出现 `p-4` 套 `p-4` 导致的间距过大问题。

**错误示例**:

```tsx
// ❌ 错误：重复设置 padding
<AdminPageContainer>
  <div className="p-6">
    {" "}
    {/* 这里多余了 */}
    <Card />
  </div>
</AdminPageContainer>
```

**正确示例**:

```tsx
// ✅ 正确：直接使用容器提供的内边距
<AdminPageContainer>
  <div className="flex flex-col gap-4">
    <Card />
    <Card />
  </div>
</AdminPageContainer>
```
