# Tailwind CSS 与 Ant Design 融合规范

本规范旨在指导如何在项目中统一 Tailwind CSS 与 Ant Design (AntD) 的设计语言，确保自定义组件（使用 Tailwind 构建）与 AntD 原生组件在视觉上保持高度一致。

## 1. 核心映射表 (Token Mappings)

### 1.1 中性色与背景 (Neutral Colors & Backgrounds)

Ant Design 的语义化 Design Token 与 Tailwind 的 Utility Class 映射关系：

| AntD Token            | Tailwind Class     | CSS Variable                       | 用途                     |
| :-------------------- | :----------------- | :--------------------------------- | :----------------------- |
| `colorText`           | `text-neutral-900` | `var(--ant-color-text)`            | 主要文本                 |
| `colorTextSecondary`  | `text-neutral-500` | `var(--ant-color-text-secondary)`  | 次要文本                 |
| `colorTextTertiary`   | `text-neutral-400` | `var(--ant-color-text-tertiary)`   | 第三级文本（如占位符）   |
| `colorTextQuaternary` | `text-neutral-300` | `var(--ant-color-text-quaternary)` | 第四级文本（如失效文字） |
| `colorBgContainer`    | `bg-white`         | `var(--ant-color-bg-container)`    | 容器背景（默认白色）     |
| `colorBgLayout`       | `bg-gray-50`       | `var(--ant-color-bg-layout)`       | 布局背景（浅灰色）       |
| `colorBorder`         | `border-gray-200`  | `var(--ant-color-border)`          | 默认边框                 |
| `colorSplit`          | `divide-gray-100`  | `var(--ant-color-split)`           | 分割线颜色               |

### 1.2 控件高度与尺寸 (Control Heights)

| AntD Token        | Height (px) | Tailwind Class | 典型组件                               |
| :---------------- | :---------- | :------------- | :------------------------------------- |
| `controlHeightSM` | 24px        | `h-6`          | Small Button, Tag, Pagination (Mini)   |
| `controlHeight`   | 32px        | `h-8`          | Default M size (Button, Input, Select) |
| `controlHeightLG` | 40px        | `h-10`         | Large Button, Big Input                |

### 1.3 交互状态颜色 (State Colors)

| 状态     | AntD Token           | Tailwind Class 示例                                       |
| :------- | :------------------- | :-------------------------------------------------------- |
| Hover    | `colorPrimaryHover`  | `hover:bg-primary-hover` / `hover:text-primary-hover`     |
| Active   | `colorPrimaryActive` | `active:bg-primary-active` / `active:text-primary-active` |
| Disabled | `colorTextDisabled`  | `disabled:text-gray-300` / `disabled:bg-gray-100`         |

### 1.4 堆叠层级 (Z-Index)

| Token (Concept)  | Value | Tailwind Class | 用途               |
| :--------------- | :---- | :------------- | :----------------- |
| Base             | 0     | `z-0`          | 默认层级           |
| Sticky           | 100   | `z-sticky`     | 粘性布局头部       |
| Popup / Dropdown | 1000  | `z-popup`      | 下拉菜单、气泡卡片 |
| Modal            | 1000  | `z-modal`      | 对话框遮罩         |
| Message          | 1010  | `z-message`    | 全局提示 (Message) |
| Tooltip          | 1060  | `z-tooltip`    | 文字提示 (Tooltip) |

### 1.5 响应式断点 (Breakpoints)

| Name  | Width   | Usage                          |
| :---- | :------ | :----------------------------- |
| `xs`  | <576px  | Mobile Portrait                |
| `sm`  | ≥576px  | Mobile Landscape / Large Phone |
| `md`  | ≥768px  | Tablet (iPad Portrait)         |
| `lg`  | ≥992px  | Desktop (Small Laptop)         |
| `xl`  | ≥1200px | Wide Desktop                   |
| `xxl` | ≥1600px | Ultra Wide Screen              |

---

## 2. 完整配置文件 (tailwind.config.ts)

以下配置将上述所有映射关系整合到 Tailwind 中。注意使用 CSS 变量以支持动态主题切换。

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // 覆盖默认屏幕断点以匹配 AntD
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1600px",
    },
    extend: {
      colors: {
        // 品牌色与功能色
        primary: {
          DEFAULT: "var(--ant-primary-color)",
          hover: "var(--ant-primary-color-hover)",
          active: "var(--ant-primary-color-active)",
        },
        success: "var(--ant-success-color)",
        warning: "var(--ant-warning-color)",
        error: "var(--ant-error-color)",
        info: "var(--ant-info-color)",

        // 映射 AntD 中性色到 Tailwind Neutral Palette
        neutral: {
          900: "var(--ant-color-text)", // 主要文本
          500: "var(--ant-color-text-secondary)", // 次要文本
          400: "var(--ant-color-text-tertiary)", // 占位符
          300: "var(--ant-color-text-quaternary)", // 失效文本
        },
        gray: {
          50: "var(--ant-color-bg-layout)", // 页面背景
          100: "var(--ant-color-split)", // 分割线
          200: "var(--ant-color-border)", // 边框
        },
      },
      // 间距扩展 (height)
      height: {
        6: "24px", // controlHeightSM
        8: "32px", // controlHeight (Default)
        10: "40px", // controlHeightLG
      },
      // Z-Index 系统
      zIndex: {
        popup: "1000",
        modal: "1000",
        message: "1010",
        tooltip: "1060",
      },
      // 字体大小
      fontSize: {
        xs: ["12px", "1.6"], // 12px / 20px
        sm: ["14px", "1.57"], // 14px / 22px
        base: ["16px", "1.5"], // 16px / 24px
        lg: ["18px", "1.5"],
      },
      borderRadius: {
        sm: "var(--ant-border-radius-sm)", // 4px
        DEFAULT: "var(--ant-border-radius)", // 6px or 8px
        lg: "var(--ant-border-radius-lg)", // 8px
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  corePlugins: {
    // 建议禁用 preflight 以避免与 AntD 样式冲突，或手动处理 reset
    // preflight: false,
  },
} satisfies Config;
```

---

## 3. 组件实现范例 (AntdStyleButton)

使用 `clsx` 或 `cn` 工具函数组合 Tailwind 类名，以复刻 AntD 组件的交互状态。

```tsx
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "default" | "dashed" | "text" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const AntdStyleButton = ({
  className,
  variant = "default",
  size = "md",
  loading,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        // 基础样式：Flex布局，居中，过渡动画，禁止选中
        "focus-visible:ring-primary inline-flex items-center justify-center rounded font-normal whitespace-nowrap shadow-sm transition-all duration-200 focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",

        // 尺寸变体 (对应 controlHeight)
        size === "sm" && "h-6 px-2 text-xs",
        size === "md" && "h-8 px-[15px] text-sm", // AntD default height is 32px (h-8)
        size === "lg" && "h-10 px-[15px] text-base",

        // 风格变体
        variant === "primary" &&
          "bg-primary hover:bg-primary-hover active:bg-primary-active border border-transparent text-white shadow-[0_2px_0_rgba(5,5,5,0.06)]",

        variant === "default" &&
          "hover:text-primary hover:border-primary active:text-primary-active active:border-primary-active border border-gray-200 bg-white text-neutral-900 hover:bg-white",

        variant === "dashed" &&
          "hover:text-primary hover:border-primary active:text-primary-active active:border-primary-active border border-dashed border-gray-200 bg-white text-neutral-900",

        variant === "text" &&
          "border-transparent bg-transparent text-neutral-900 shadow-none hover:bg-black/5",

        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
```

---

## 4. 开发注意事项 (Best Practices)

1.  **Preflight 潜在冲突**:
    Tailwind 的 Preflight (Base Styles) 可能会重置 AntD 依赖的一些浏览器默认样式（如 Heading 样式）。
    - **解决方案 A**: 在 `tailwind.config.ts` 中禁用 `preflight: false`（如果你主要依赖 AntD 组件）。
    - **解决方案 B**: 手动补充 CSS 修复特定标签的样式。

2.  **样式混用原则**:
    尽管技术上可行，但应避免在同一个元素上混用 `className` (Tailwind) 和 `style` (Inline CSS)。尽量将 AntD 组件视为"原子"，通过 `ConfigProvider` 全局调整其样式，而不是通过 Tailwind 强行覆盖 (`!important`)。

3.  **动态主题集成**:
    为了完美支持 Dark Mode，建议使用 `antd-style` 或手动将 AntD 的 Token 导出为 CSS Variables，并在 Tailwind 配置中引用这些变量（如上所示）。

4.  **避免使用 `@apply`**:
    尽量直接在 JSX 中使用 Utility Classes。滥用 `@apply` 会导致生成的 CSS 文件体积膨胀，违背 Tailwind 的设计初衷。

---

## 5. 为什么这样做 (Why)

1.  **减少 Run-time CSS 开销**: Tailwind 是构建时生成的原子 CSS，避免了 AntD CSS-in-JS 在运行时的计算开销，提升页面渲染性能。
2.  **统一设计语言 (Consistency)**: 通过在 `tailwind.config` 中强制约束颜色和圆角，确保了手写组件与 AntD 库组件在视觉上的无缝融合，避免"割裂感"。
3.  **开发灵活性 (Flexibility)**: 对于复杂的自定义布局（如 Dashboard、Card Grid），Tailwind 的原子类比覆盖 AntD 的深层嵌套样式(`& .ant-card-body { ... }`) 更直观、更易维护。
4.  **支持 Dark Mode**: 配合 CSS 变量（`var(--ant-primary-color)`），可以轻松实现跟随 AntD `ConfigProvider` 切换的深色模式。
