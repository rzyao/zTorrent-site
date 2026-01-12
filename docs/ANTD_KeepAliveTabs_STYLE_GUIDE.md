# Ant Design Editable Card Tabs 样式规范

本文档记录了 Ant Design `Tabs` 组件在 `type="editable-card"` 模式下的样式特征，用于在移除 Ant Design 依赖后，使用 Tailwind CSS 精确还原其视觉效果。

## 1. 容器栏 (Tab Bar)

| 属性       | Ant Design 默认值        | Tailwind CSS 等效值         | 备注                                    |
| :--------- | :----------------------- | :-------------------------- | :-------------------------------------- |
| **背景色** | `#f5f5f5`                | `bg-[#f5f5f5]`              | 极浅灰，深于纯白，用于区分内容区。      |
| **底边框** | `1px solid #f0f0f0`      | `border-b border-[#f0f0f0]` | 贯穿的浅灰分割线，分隔 Tab 栏与内容区。 |
| **内边距** | Top: `4px`               | `pt-1`                      | 顶部留白，制造卡片的高度错落感。        |
|            | Left/Right: `2px`~`16px` | `px-4`                      | 视具体布局而定。                        |

## 2. 标签项 (Tab Trigger) - 通用结构

| 属性     | Ant Design 默认值   | Tailwind CSS 等效值                | 备注                 |
| :------- | :------------------ | :--------------------------------- | :------------------- |
| **形状** | 上方圆角 `6px`      | `rounded-t-md` (或 `rounded-t-lg`) | 下方直角。           |
| **间距** | Right: `2px`        | `mr-[2px]`                         | 标签之间的微小间隙。 |
| **边框** | `1px solid #f0f0f0` | `border border-[#f0f0f0]`          | 左、上、右三面边框。 |
| **高度** | 约 `32px` - `40px`  | `h-9` (36px)                       | 标准高度。           |

## 3. 标签项 - 未选中状态 (Inactive)

| 属性         | Ant Design 默认值              | Tailwind CSS 等效值 | 备注                         |
| :----------- | :----------------------------- | :------------------ | :--------------------------- |
| **背景色**   | `#fafafa`                      | `bg-[#fafafa]`      | 比容器略亮，但比选中态暗。   |
| **文字颜色** | `#1f1f1f` / `rgba(0,0,0,0.88)` | `text-neutral-600`  | 标准黑灰。                   |
| **字重**     | Normal (400)                   | `font-normal`       |                              |
| **底部边框** | `1px solid #f0f0f0`            | (包含在通用边框中)  | 与容器底线重合，无特殊处理。 |

## 4. 标签项 - 选中状态 (Active)

| 属性         | Ant Design 默认值     | Tailwind CSS 等效值                       | 备注                                                                |
| :----------- | :-------------------- | :---------------------------------------- | :------------------------------------------------------------------ |
| **背景色**   | `#ffffff`             | `bg-white`                                | 纯白背景。                                                          |
| **文字颜色** | Primary Color         | `text-blue-600` / `text-[#1677ff]`        | 高亮显示 (Ant Design 默认蓝色)。                                    |
| **字重**     | Medium (500)          | `font-medium`                             | 加粗以示强调。                                                      |
| **底部边框** | **透明/白色**         | `border-b-white` / `border-b-transparent` | 关键：去除底部灰色边框。                                            |
| **布局位置** | `margin-bottom: -1px` | `-mb-[1px] z-10`                          | **核心技巧**：向下延伸 1px 并提升层级，遮挡容器底线，实现连通效果。 |

## 5. 关闭按钮 (Close Icon)

| 属性           | Ant Design 默认值      | Tailwind CSS 等效值                           | 备注                         |
| :------------- | :--------------------- | :-------------------------------------------- | :--------------------------- |
| **默认状态**   | 灰色，无背景           | `text-neutral-400`                            |                              |
| **Hover 状态** | 深灰文字，圆形浅灰背景 | `hover:bg-neutral-200 hover:text-neutral-600` | 通常伴随 `transition` 动画。 |

## 6. CSS 实现示例 (Tailwind)

```tsx
<TabsTrigger
  className={cn(
    // 通用布局
    "group relative h-9 min-w-[100px] rounded-t-lg border border-transparent px-4 py-2 text-sm transition-all",

    // 未选中状态 (Inactive)
    "border-[#f0f0f0] bg-[#fafafa] text-neutral-600 hover:text-neutral-900",

    // 选中状态 (Active)
    "data-[state=active]:z-10", // 提升层级
    "data-[state=active]:-mb-px", // 向下延伸覆盖底线
    "data-[state=active]:bg-white", // 白底
    "data-[state=active]:border-[#f0f0f0]", // 保持边框颜色
    "data-[state=active]:border-b-white", // 底部边框变白(核心)
    "data-[state=active]:font-medium", // 加粗
    "data-[state=active]:text-[#1677ff]", // 主色文字 (Default Antd Blue)
  )}
>
  {/* Label */}
  {item.label}

  {/* Close Icon */}
  <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 opacity-60 hover:bg-neutral-200 hover:text-neutral-600 hover:opacity-100">
    ×
  </span>
</TabsTrigger>
```
