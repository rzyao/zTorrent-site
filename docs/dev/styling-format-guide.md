# 格式化 className 的最佳实践方案

为了让 `className` (尤其是 Tailwind CSS 类名) 保持整洁、可读并自动排序，建议采用 **Prettier** 配合 **`prettier-plugin-tailwindcss`**。

## 1. 安装依赖

在项目根目录运行以下命令安装 Prettier 及其 Tailwind 插件：

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

## 2. 创建配置文件

在根目录创建 `.prettierrc` 文件，并添加以下配置。

### 核心配置：集成 Tailwind 插件

这个插件会自动按照 Tailwind 官方推荐的顺序对类名进行排序，并将长类名按需组织。

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js",
  "tailwindAttributes": ["className", "class"],
  "tailwindFunctions": ["cn", "cva", "clsx"],
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

## 3. 编辑器自动格式化 (VSCode)

建议在 `.vscode/settings.json` 中配置“保存时自动格式化”，这样你每次修改代码后，类名会自动排整齐。

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.documentSelectors": ["**/*.{js,jsx,ts,tsx,css,scss,html}"]
}
```

## 4. 针对超长 className 的手动优化建议

虽然 Prettier 会处理一部分，但对于逻辑复杂的超长类名，最佳实践是配合已有的 `cn` 工具函数进行手动分行：

### 优化前：

```tsx
<div className="flex items-center justify-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all duration-300 group-hover:scale-105">
```

### 优化后 (利用 `cn` 手动分行)：

```tsx
<div
  className={cn(
    "flex items-center justify-center gap-4 p-4",
    "bg-slate-900 border border-slate-800 rounded-xl",
    "hover:bg-slate-800 transition-all",
    "group-hover:scale-105 duration-300"
  )}
>
```

---

**执行建议**：
如果你同意，我可以立即为你安装依赖并生成对应的配置文件。
