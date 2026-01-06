# Ant Design 6.0 设计规范与 Tailwind 映射表

## 1. 间距系统 (Spacing)

AntD 采用 8px 栅格系统，而 Tailwind 的单位（1单位 = 4px）与之完美匹配。

| AntD Token  | 像素值 | Tailwind 类名 | 典型用法                 |
| :---------- | :----- | :------------ | :----------------------- |
| `marginXXS` | 4px    | `m-1`         | 极小间距（如图标与文字） |
| `marginXS`  | 8px    | `m-2`         | 控件内部组件间距         |
| `marginMD`  | 16px   | `m-4`         | 最常用的标准组件间距     |
| `marginLG`  | 24px   | `m-6`         | 大容器内边距             |
| `marginXL`  | 32px   | `m-8`         | 页面大板块间距           |

## 2. 圆角系统 (Border Radius)

AntD 6.0 默认圆角更加克制，旨在传达工业级严谨感。

| AntD Token          | 像素值 | Tailwind 类名    | 典型用法                      |
| :------------------ | :----- | :--------------- | :---------------------------- |
| `borderRadiusSM`    | 2px    | `rounded-sm`     | 标签 (Tag)、小按钮            |
| `borderRadius`      | 6px    | `rounded-[6px]`  | 组件容器、输入框、卡片 (默认) |
| `borderRadiusLG`    | 8px    | `rounded-lg`     | 弹窗 (Modal)、卡片大圆角      |
| `borderRadiusOuter` | 10px   | `rounded-[10px]` | 组合容器的外层圆角            |

## 3. 字号与行高 (Typography)

AntD 的文字系统专注于阅读体验，主站默认采用 14px 作为正文字号。

| AntD Token   | 像素值 | Tailwind 类名     | 含义                   |
| :----------- | :----- | :---------------- | :--------------------- |
| `fontSizeSM` | 12px   | `text-xs`         | 辅助文本、底部版权信息 |
| `fontSize`   | 14px   | `text-sm`         | 正文、常规文字 (Base)  |
| `fontSizeLG` | 16px   | `text-base`       | 列表、标签标题         |
| `fontSizeXL` | 20px   | `text-xl`         | 页面二级标题           |
| `lineHeight` | 1.5715 | `leading-relaxed` | 默认文本行高比例       |

## 4. 色彩系统 (Color Palette)

AntD 6.0 默认蓝色及其它语义色保持了同样的高级感。

| 类别       | AntD Token     | 十六位码  | Tailwind 映射     |
| :--------- | :------------- | :-------- | :---------------- |
| **主色**   | `colorPrimary` | `#1677ff` | `blue-600` (接近) |
| **成功色** | `colorSuccess` | `#52c41a` | `green-500`       |
| **警告色** | `colorWarning` | `#faad14` | `amber-500`       |
| **错误色** | `colorError`   | `#ff4d4f` | `red-500`         |
| **边框色** | `colorBorder`  | `#d9d9d9` | `gray-300`        |

## 5. 中性色与背景 (Neutral Colors & Background)

| AntD Token             | 十六位/RGBA           | Tailwind 映射     | 建议用途             |
| :--------------------- | :-------------------- | :---------------- | :------------------- |
| `colorText`            | `rgba(0, 0, 0, 0.88)` | `neutral-900`     | 正文（高亮文本）     |
| `colorTextDescription` | `rgba(0, 0, 0, 0.45)` | `neutral-500`     | 描述文字（次要）     |
| `colorTextPlaceholder` | `rgba(0, 0, 0, 0.25)` | `neutral-400`     | 占位文字             |
| `colorBgBase`          | `#ffffff`             | `white`           | 背景基准色           |
| `colorBgContainer`     | `#ffffff`             | `bg-white`        | 容器背景（卡片、菜单 |
| `colorBgLayout`        | `#f5f5f5`             | `bg-gray-50`      | 布局背景（灰色背景） |
| `colorBgSpotlight`     | `rgba(0, 0, 0, 0.85)` | `bg-zinc-800`     | 浮层背景 (Tooltip)   |
| `colorBorderSecondary` | `rgba(0, 0, 0, 0.06)` | `border-gray-100` | 浅色分割线           |

## 6. 控件高度规范 (Control Heights)

AntD 对外层高度有严格规定，封装自定义组件（如 Search Bar）时建议对齐。

| 尺寸        | AntD Token        | 像素值 | Tailwind 类名 | 典型场景       |
| :---------- | :---------------- | :----- | :------------ | :------------- |
| **Small**   | `controlHeightSM` | 24px   | `h-6`         | 小号输入框     |
| **Default** | `controlHeight`   | 32px   | `h-8`         | 标准按钮       |
| **Large**   | `controlHeightLG` | 40px   | `h-10`        | 登录页、主操作 |

## 7. 状态色系统 (State Colors)

AntD 的状态色经过光学设计，包含 **Hover** 和 **Active** 逻辑。

| 状态       | AntD Token           | Tailwind 映射                    |
| :--------- | :------------------- | :------------------------------- |
| **Hover**  | `colorPrimaryHover`  | `blue-500` (比主色浅)            |
| **Active** | `colorPrimaryActive` | `blue-700` (比主色深)            |
| **Text**   | `colorPrimaryText`   | `text-blue-600`                  |
| **Border** | `colorPrimaryBorder` | `border-blue-200` (浅色边框背景) |

## 8. 响应式断点 (Responsive Breakpoints)

AntD 与 Tailwind 的默认断点非常接近，建议保持对齐。

| 名称    | AntD Token  | 屏幕范围 (>= pixels) | Tailwind 对应 |
| :------ | :---------- | :------------------- | :------------ |
| **xs**  | `screenXS`  | < 576px              | `-`           |
| **sm**  | `screenSM`  | 576px                | `sm`          |
| **md**  | `screenMD`  | 768px                | `md`          |
| **lg**  | `screenLG`  | 992px                | `lg`          |
| **xl**  | `screenXL`  | 1200px               | `xl`          |
| **xxl** | `screenXXL` | 1600px               | `2xl`         |

## 9. 堆叠层级 (Z-Index)

避免在项目中混乱使用 `z-index`，复用 AntD 的层级常量。

| 功能层级         | AntD Token             | 数值 | Tailwind 类名 |
| :--------------- | :--------------------- | :--- | :------------ |
| **Base**         | `zIndexBase`           | 0    | `z-0`         |
| **Popup**        | `zIndexPopupBase`      | 1000 | `z-[1000]`    |
| **Drawer/Modal** | `zIndexModalBase` + 10 | 1010 | `z-[1010]`    |
| **Message**      | `zIndexPopupBase` + 10 | 1010 | `z-[1010]`    |
| **Affix**        | `zIndexPopupBase`      | 1010 | `z-[1010]`    |

---

## 实战：在 `tailwind.config.js` 中完美复刻

为了在项目中享受高度统一的 AntD 体验，建议在 Tailwind 配置文件中进行扩展。

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      spacing: {
        "antd-xs": "4px",
        "antd-sm": "8px",
        "antd-md": "16px",
        "antd-lg": "24px",
        "antd-xl": "32px",
      },
      borderRadius: {
        "antd-sm": "2px",
        antd: "6px", // AntD 默认圆角
        "antd-lg": "8px",
        "antd-outer": "10px",
      },
      fontSize: {
        antd: ["14px", "22px"], // [字号, 行高]
        "antd-sm": ["12px", "20px"],
        "antd-lg": ["16px", "24px"],
        "antd-xl": ["20px", "28px"],
      },
      colors: {
        "antd-primary": "#1677ff",
        "antd-primary-hover": "#4096ff",
        "antd-primary-active": "#0958d9",
        "antd-success": "#52c41a",
        "antd-warning": "#faad14",
        "antd-error": "#ff4d4f",
        "antd-border": "#d9d9d9",
        "antd-border-secondary": "rgba(0, 0, 0, 0.06)",
        "antd-text": "rgba(0, 0, 0, 0.88)",
        "antd-text-description": "rgba(0, 0, 0, 0.45)",
        "antd-bg-container": "#ffffff",
        "antd-bg-layout": "#f5f5f5",
      },
      boxShadow: {
        "antd-low": "0 2px 8px rgba(0, 0, 0, 0.15)",
        "antd-mid": "0 6px 16px rgba(0, 0, 0, 0.08)",
      },
      zIndex: {
        "antd-popup": "1000",
        "antd-modal": "1010",
      },
    },
  },
};
```

---

## 3.0 时代的性能建议

由于 Ant Design 6.0 默认开启了 **Zero-runtime** (零运行时) 模式，你可以结合 Tailwind 获得极佳的性能：

1.  **减少重绘**：使用 Tailwind 处理简单的布局和间距，只在复杂渲染逻辑（如 Table/Tree）时调用 AntD 组件。
2.  **样式层级**：在 CSS 中使用 `@layer` 确保 Tailwind 的 Utilities 层级高于 AntD 的默认样式，从而方便覆盖。
3.  **Token 复用**：通过 `tailwind.config.js` 复用 Token，可以大幅减少 CSS Bundle 的体积。
