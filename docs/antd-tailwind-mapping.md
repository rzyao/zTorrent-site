# Ant Design 6.0 × Tailwind CSS 映射指南 (2026 版)

本指南旨在帮助开发者在 Tailwind CSS 项目中快速应用 Ant Design 6.0 的视觉风格，实现无缝融合 AntD 设计语言。

---

## 1. Tailwind 配置文件 (`tailwind.config.ts`)

将以下配置添加到项目的 Tailwind 配置中，即可通过 `antd-*` 前缀类名直接使用设计 token。

```typescript
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      // ============== 间距 (Spacing) ==============
      spacing: {
        "antd-xs": "8px",
        "antd-sm": "12px",
        "antd-md": "16px",
        "antd-lg": "24px",
        "antd-xl": "32px",
      },
      // ============== 圆角 (Border Radius) ==============
      borderRadius: {
        antd: "6px", // 默认圆角
        "antd-sm": "4px", // 小圆角
        "antd-lg": "8px", // 大圆角
      },
      // ============== 字号 (Font Size) ==============
      fontSize: {
        "antd-xs": ["12px", { lineHeight: "20px" }],
        "antd-sm": ["14px", { lineHeight: "22px" }],
        "antd-md": ["16px", { lineHeight: "24px" }],
        "antd-lg": ["20px", { lineHeight: "28px" }],
        "antd-xl": ["24px", { lineHeight: "32px" }],
      },
      // ============== 颜色 (Colors) ==============
      colors: {
        // 主题色
        "antd-primary": "#1677ff",
        "antd-primary-hover": "#4096ff",
        "antd-primary-active": "#0958d9",
        "antd-primary-bg": "#e6f4ff",
        // 成功色
        "antd-success": "#52c41a",
        "antd-success-hover": "#73d13d",
        "antd-success-bg": "#f6ffed",
        // 警告色
        "antd-warning": "#faad14",
        "antd-warning-hover": "#ffc53d",
        "antd-warning-bg": "#fffbe6",
        // 错误色
        "antd-error": "#ff4d4f",
        "antd-error-hover": "#ff7875",
        "antd-error-bg": "#fff2f0",
        // 文字色
        "antd-text": "rgba(0, 0, 0, 0.88)",
        "antd-text-secondary": "rgba(0, 0, 0, 0.65)",
        "antd-text-description": "rgba(0, 0, 0, 0.45)",
        "antd-text-placeholder": "rgba(0, 0, 0, 0.25)",
        "antd-text-disabled": "rgba(0, 0, 0, 0.25)",
        // 边框色
        "antd-border": "#d9d9d9",
        "antd-border-secondary": "#f0f0f0",
        // 背景色
        "antd-bg-container": "#ffffff",
        "antd-bg-layout": "#f5f5f5",
        "antd-bg-elevated": "#ffffff",
      },
      // ============== 阴影 (Box Shadow) ==============
      boxShadow: {
        antd: "0 2px 8px rgba(0, 0, 0, 0.15)",
        "antd-sm":
          "0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02)",
        "antd-lg": "0 6px 16px rgba(0, 0, 0, 0.08), 0 0 8px rgba(0, 0, 0, 0.04)",
      },
    },
  },
} satisfies Config;
```

---

## 2. 核心参数对照表

### 间距规格 (Spacing)

| AntD Token  | Tailwind 类名 | 像素值 | 使用场景         |
| ----------- | ------------- | ------ | ---------------- |
| `paddingXS` | `p-antd-xs`   | `8px`  | 紧凑型元素内边距 |
| `paddingSM` | `p-antd-sm`   | `12px` | 小型组件内边距   |
| `padding`   | `p-antd-md`   | `16px` | 默认内边距       |
| `paddingLG` | `p-antd-lg`   | `24px` | 大型容器内边距   |
| `paddingXL` | `p-antd-xl`   | `32px` | 超大区块内边距   |

📌 **应用于 `gap-*`、`m-*`、`p-*` 等。**

---

### 圆角 (Border Radius)

| AntD Token       | Tailwind 类名     | 像素值 | 典型场景               |
| ---------------- | ----------------- | ------ | ---------------------- |
| `borderRadiusSM` | `rounded-antd-sm` | `4px`  | 小型标签、徽章         |
| `borderRadius`   | `rounded-antd`    | `6px`  | 默认按钮、输入框、卡片 |
| `borderRadiusLG` | `rounded-antd-lg` | `8px`  | Modal、Drawer 边角     |

📌 **应用于元素的 `rounded-*` 类。**

---

### 文字 (Typography)

| AntD Token         | Tailwind 类名  | 字号/行高     | 适用元素     |
| ------------------ | -------------- | ------------- | ------------ |
| `fontSizeSM`       | `text-antd-xs` | `12px / 20px` | 辅助说明文字 |
| `fontSize`         | `text-antd-sm` | `14px / 22px` | 正文、表单   |
| `fontSizeLG`       | `text-antd-md` | `16px / 24px` | 小标题       |
| `fontSizeHeading4` | `text-antd-lg` | `20px / 28px` | 中标题       |
| `fontSizeHeading3` | `text-antd-xl` | `24px / 32px` | 大标题       |

📌 **应用于文本元素的 `text-*` 类。**

---

## 3. 典型的 AntD 风格组件示例 (Tailwind 实现)

以下演示如何仅用 Tailwind CSS 类名，复刻 AntD 6.0 的 Card + Button 视觉效果：

```tsx
// Card + Button 示例
function AntdStyleCard() {
  return (
    <div className="rounded-antd-lg border-antd-border bg-antd-bg-container p-antd-lg shadow-antd-sm border">
      <h2 className="text-antd-lg text-antd-text font-semibold">卡片标题</h2>
      <p className="mt-antd-xs text-antd-sm text-antd-text-description">
        这是一段描述文字，使用 Ant Design 6.0 的配色方案。
      </p>
      <div className="mt-antd-md gap-antd-sm flex">
        <button className="rounded-antd bg-antd-primary px-antd-md py-antd-xs text-antd-sm hover:bg-antd-primary-hover text-white">
          主按钮
        </button>
        <button className="rounded-antd border-antd-border px-antd-md py-antd-xs text-antd-sm text-antd-text hover:border-antd-primary hover:text-antd-primary border bg-white">
          默认按钮
        </button>
      </div>
    </div>
  );
}
```

### 效果对比

| 属性     | AntD 组件属性               | Tailwind 类名                 |
| -------- | --------------------------- | ----------------------------- |
| 卡片圆角 | `borderRadius: 8`           | `rounded-antd-lg`             |
| 卡片边框 | `border: 1px solid #d9d9d9` | `border border-antd-border`   |
| 卡片背景 | `background: #fff`          | `bg-antd-bg-container`        |
| 按钮背景 | `type="primary"`            | `bg-antd-primary`             |
| 按钮悬停 | `:hover`                    | `hover:bg-antd-primary-hover` |
| 文字颜色 | `color: rgba(0,0,0,.88)`    | `text-antd-text`              |

---

## 4. 关于全局样式继承

1. **字体栈**：Ant Design 默认使用系统字体栈。如需一致性，在全局 CSS 中添加：

   ```css
   body {
     font-family:
       -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
       sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
   }
   ```

2. **文本渲染**：AntD 开启了文本抗锯齿，可在 `body` 中添加：

   ```css
   body {
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }
   ```

3. **深色模式**：如需支持暗色主题，可配置相应的 `dark:` 变体，或在 Tailwind 配置中定义 `antd-dark-*` 系列颜色。

---

> **提示**：此配置基于 Ant Design 6.0 设计规范，如后续版本有调整，请以官方文档为准。

---

## 5. 中性色/语义色 (Neutral Colors & Semantic Colors)

### 中性色阶 (Neutral/Gray)

| 色阶等级 | Hex 值    | Tailwind 类名                  | 典型用途           |
| -------- | --------- | ------------------------------ | ------------------ |
| Gray-1   | `#ffffff` | `bg-white`                     | 容器背景、卡片背景 |
| Gray-2   | `#fafafa` | `bg-antd-bg-layout`            | 页面底色           |
| Gray-3   | `#f5f5f5` | `bg-antd-bg-layout`            | 分割区域、表头背景 |
| Gray-4   | `#f0f0f0` | `border-antd-border-secondary` | 次级分割线         |
| Gray-5   | `#d9d9d9` | `border-antd-border`           | 默认边框           |
| Gray-6   | `#bfbfbf` | `text-antd-text-placeholder`   | 禁用输入框边框     |
| Gray-7   | `#8c8c8c` | `text-antd-text-description`   | 次要说明文字       |
| Gray-8   | `#595959` | `text-antd-text-secondary`     | 辅助文字           |
| Gray-9   | `#434343` | `text-antd-text`               | 标题文字           |
| Gray-10  | `#262626` | `text-antd-text`               | 强调标题           |
| Gray-11  | `#1f1f1f` | `text-gray-900`                | 深色标题           |
| Gray-12  | `#141414` | `text-gray-950`                | 最深文字           |

📌 **应用于文本、边框、背景。**

---

## 6. 设计规格比例 (Layout Metrics)

### 布局比例规格

| 区域         | Tailwind 类名     | 像素值  | 说明               |
| ------------ | ----------------- | ------- | ------------------ |
| 顶栏高度     | `h-[64px]`        | `64px`  | 固定顶部导航栏高度 |
| 侧边栏宽度   | `w-[200px]`       | `200px` | 展开状态侧边栏     |
| 侧边栏收起   | `w-[80px]`        | `80px`  | 收起状态侧边栏     |
| 内容区内边距 | `p-antd-lg`       | `24px`  | 主内容区默认内边距 |
| 卡片间距     | `gap-antd-md`     | `16px`  | 卡片网格间距       |
| 表单项间距   | `space-y-antd-lg` | `24px`  | 表单垂直间距       |

📌 **应用于布局容器、页面结构。**

---

## 7. 交互状态样式 (Interactive States)

### 按钮/链接交互状态

| 状态     | 主题色变体         | Tailwind 类名                                                |
| -------- | ------------------ | ------------------------------------------------------------ |
| Default  | `#1677ff`          | `bg-antd-primary`                                            |
| Hover    | `#4096ff`          | `hover:bg-antd-primary-hover`                                |
| Active   | `#0958d9`          | `active:bg-antd-primary-active`                              |
| Disabled | `rgba(0,0,0,0.25)` | `disabled:bg-antd-text-disabled disabled:cursor-not-allowed` |
| Focus    | `-`                | `focus:ring-2 focus:ring-antd-primary/50`                    |

### 输入框交互状态

```tsx
// 输入框状态示例
<input
  className={cn(
    "rounded-antd border-antd-border px-antd-sm py-antd-xs text-antd-sm border",
    "placeholder:text-antd-text-placeholder",
    "hover:border-antd-primary",
    "focus:border-antd-primary focus:ring-antd-primary/20 focus:ring-2 focus:outline-none",
    "disabled:bg-antd-bg-layout disabled:text-antd-text-disabled disabled:cursor-not-allowed",
  )}
/>
```

📌 **应用于按钮、链接、表单元素。**

---

## 8. 响应式断点 (Responsive Breakpoints)

Ant Design 与 Tailwind 的响应式断点对照：

| AntD 断点 | 像素范围   | Tailwind 前缀 | 典型使用场景        |
| --------- | ---------- | ------------- | ------------------- |
| `xs`      | `< 576px`  | `sm:` 以下    | 手机竖屏            |
| `sm`      | `≥ 576px`  | `sm:`         | 手机横屏            |
| `md`      | `≥ 768px`  | `md:`         | 平板竖屏            |
| `lg`      | `≥ 992px`  | `lg:`         | 平板横屏/小型笔记本 |
| `xl`      | `≥ 1200px` | `xl:`         | 台式机              |
| `xxl`     | `≥ 1600px` | `2xl:`        | 大屏显示器          |

### 响应式布局示例

```tsx
// Grid 响应式示例
<div className="gap-antd-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* 卡片组件 */}
</div>
```

📌 **应用于栅格、展示块、导航。**

---

## 9. 降级策略 (Legacy Fallbacks)

### 9.1 样式降级

当某些浏览器不支持 CSS 变量时，建议：

```css
.button-primary {
  /* 降级值 */
  background-color: #1677ff;
  /* 现代浏览器 */
  background-color: var(--antd-primary, #1677ff);
}
```

### 9.2 组件降级

| 场景       | AntD 组件            | Tailwind 替代方案                      |
| ---------- | -------------------- | -------------------------------------- |
| 复杂表单   | `Form` + `Form.Item` | 使用 `react-hook-form` + Tailwind 样式 |
| 数据表格   | `Table`              | `@tanstack/react-table` + 自定义样式   |
| 日期选择器 | `DatePicker`         | `react-day-picker` + Tailwind 主题     |
| 消息提示   | `message`            | `sonner` 或 `react-hot-toast`          |

---

## 10. 更新日志 (Changelog)

| 版本   | 日期       | 变更内容                                        |
| ------ | ---------- | ----------------------------------------------- |
| v1.0.0 | 2026-01-07 | 初始版本，基于 Ant Design 6.0 + Tailwind CSS v4 |

---

## 📋 快速参考卡片

### 常用类名速查

```
文字：text-antd-text / text-antd-text-secondary / text-antd-text-description
背景：bg-antd-bg-container / bg-antd-bg-layout / bg-antd-primary
边框：border-antd-border / border-antd-border-secondary / rounded-antd
间距：p-antd-md / m-antd-lg / gap-antd-sm
状态：hover:bg-antd-primary-hover / disabled:opacity-50
```

### 组件快速模板

```tsx
// 主按钮
<button className="rounded-antd bg-antd-primary px-antd-md py-antd-xs text-antd-sm text-white hover:bg-antd-primary-hover">
  按钮文字
</button>

// 卡片容器
<div className="rounded-antd-lg border border-antd-border bg-antd-bg-container p-antd-lg shadow-antd-sm">
  卡片内容
</div>

// 表单输入框
<input className="w-full rounded-antd border border-antd-border px-antd-sm py-antd-xs text-antd-sm focus:border-antd-primary focus:outline-none" />
```

---

## 11. 使用建议与最佳实践

1. **保持一致性**：在 Admin 模块中统一使用 `antd-*` 前缀类名，避免与前台 Tailwind 样式混用。

2. **按需引入**：如果只需要部分 Token，可以只配置需要的颜色/间距，减少 CSS 体积。

3. **深色模式**：建议创建 `antd-dark-*` 系列变量，通过 `dark:` 前缀启用。

4. **组件封装**：将常用的组合类抽取为组件或工具函数，如 `cn(buttonVariants({ variant: 'primary' }))`。

---

> 📖 **参考资料**
>
> - [Ant Design 6.0 设计变量](https://ant.design/docs/react/customize-theme-cn)
> - [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
