---
description: 优化指定页面的样式，参考 index.css 中定义的设计规范
---

# 页面样式优化工作流

本工作流用于优化指定页面的样式，使其符合 `src/index.css` 中定义的设计规范。

## 设计规范速查

### 颜色体系

| 用途           | 颜色值                    | 说明               |
| -------------- | ------------------------- | ------------------ |
| **主色调**     | `#F59E0B` (amber-500)     | 高亮边框、焦点状态 |
| **次色调**     | `#FBBF24` (amber-400)     | hover 文字颜色     |
| **文字颜色**   | `#FCD34D` (amber-300)     | 按钮文字           |
| **渐变起始**   | `rgba(245, 158, 11, 0.2)` | amber-500/20       |
| **渐变结束**   | `rgba(249, 115, 22, 0.2)` | orange-500/20      |
| **页面背景**   | `#0F171E`                 | 深蓝黑色           |
| **卡片背景**   | `rgba(38, 38, 38, 0.4)`   | neutral-800/40     |
| **输入框背景** | `rgba(23, 23, 23, 0.5)`   | neutral-900/50     |
| **边框颜色**   | `rgba(64, 64, 64, 0.5)`   | neutral-700/50     |
| **滚动条轨道** | `rgba(38, 38, 38, 0.6)`   | neutral-800/60     |
| **滚动条滑块** | `#f97316` (orange-500)    | 主题滚动条         |

### 预定义 CSS 类

| 类名                     | 用途         | 特性                  |
| ------------------------ | ------------ | --------------------- |
| `.default-bg-color`      | 页面背景     | `#0F171E`             |
| `.card`                  | 卡片容器     | 背景 + 边框           |
| `.card-hover`            | 可悬停卡片   | 带有 hover 边框变化   |
| `.card-item`             | 卡片内部元素 | 较浅背景 + 边框       |
| `.input`                 | 输入框       | 带有 hover/focus 状态 |
| `.general-button`        | 通用按钮     | 渐变背景 + 边框       |
| `.search-button`         | 搜索按钮     | 类似 general-button   |
| `.page-container`        | 页面容器     | 响应式内边距          |
| `.scrollbar-hide`        | 隐藏滚动条   | 保留滚动功能          |
| `.scrollbar-themed`      | 主题滚动条   | 橙色滑块              |
| `.scrollbar-themed-dark` | 深色滚动条   | 深棕色滑块            |
| `.text` + `.text-parent` | 文字悬停效果 | 父级 hover 时子级变色 |
| `.native-select`         | 原生 Select  | 与 Radix UI 一致      |

### 悬浮效果模式

项目中定义了两种悬浮效果，可单独或组合使用：

#### 1. 边框变色 (`.card-hover`)

当鼠标悬停在元素上时，边框从默认的 `neutral-700/50` 变为 `amber-500/50`。

```css
/* index.css 中的定义 */
.card-hover {
  background-color: rgba(38, 38, 38, 0.4);
}
.card-hover:hover {
  border-color: rgba(245, 158, 11, 0.5); /* amber-500/50 */
}
```

**使用方式**：

```tsx
// ✅ 基础卡片 + hover 边框效果
<div className="card card-hover rounded-lg p-4">卡片内容</div>
```

#### 2. 文字变色 (`.text-parent` + `.text`)

当父元素被悬停时，内部带有 `.text` 类的子元素文字从白色变为 `amber-400`。

```css
/* index.css 中的定义 */
.text {
  color: #ffffff;
  transition: color 0.15s ease-in-out;
}
.text-parent:hover .text {
  color: #fbbf24; /* amber-400 */
}
```

**使用方式**：

```tsx
// ✅ 列表项：悬停时标题变色
<div className="text-parent cursor-pointer">
  <h3 className="text truncate">标题文字</h3>
  <p className="text-neutral-400">描述文字（不变色）</p>
</div>
```

#### 3. 组合使用（推荐）

在列表视图中，通常同时需要边框变色和文字变色效果：

```tsx
// ✅ 完整的列表项样式（参考 ListView.tsx）
<div className="card card-hover text-parent cursor-pointer rounded-lg p-4 transition-all duration-300">
  <div className="flex gap-4">
    {/* 缩略图 */}
    <div className="relative h-25 w-25 shrink-0 overflow-hidden rounded">
      <img src="..." alt="..." className="h-full w-full object-cover" />
    </div>

    {/* 信息区 */}
    <div className="flex min-w-0 flex-1 flex-col">
      <h3 className="text truncate text-white">主标题（悬停变色）</h3>
      <h3 className="text truncate text-white">副标题（悬停变色）</h3>
      <p className="text-sm text-neutral-400">其他信息（不变色）</p>
    </div>
  </div>
</div>
```

**效果说明**：

- 悬停时边框从灰色变为琥珀色（`.card-hover` 提供）
- 悬停时标题文字从白色变为琥珀色（`.text-parent` + `.text` 提供）
- 过渡动画确保变化平滑（`transition-all duration-300`）

#### 4. 其他 hover 效果

对于不使用预定义类的场景，可以使用 Tailwind 类：

```tsx
// 边框 hover
<div className="border border-neutral-700/50 hover:border-amber-500/50 transition-colors">

// 文字 hover
<span className="text-white hover:text-amber-400 transition-colors">

// 背景 hover
<div className="bg-neutral-900 hover:bg-neutral-800 transition-colors">
```

---

## 工作流步骤

### 1. 分析目标页面

// turbo
首先查看目标页面文件的结构：

```
使用 view_file_outline 查看页面组件结构
```

然后阅读页面代码，重点关注：

- 现有的 className 使用方式
- 是否有内联样式
- 颜色和间距使用是否一致

### 2. 识别样式问题

检查以下常见问题：

**颜色问题**：

- [ ] 是否使用了规范外的颜色（如纯 `bg-zinc-*`, `bg-gray-*`，应改为 `bg-neutral-*`）
- [ ] 主色调是否统一使用 `amber/orange` 系列
- [ ] 边框颜色是否使用 `neutral-700/50`

**布局问题**：

- [ ] 页面容器是否使用 `.page-container` 或等效的响应式内边距
- [ ] 卡片是否使用 `.card` 或 `.card-hover` 类
- [ ] 输入框是否使用 `.input` 类

**交互问题**：

- [ ] 按钮是否有 hover 状态
- [ ] 输入框是否有 focus 状态
- [ ] 可点击元素是否有 `cursor-pointer`

**滚动条问题**：

- [ ] 长列表是否使用主题滚动条
- [ ] 横向滚动区域是否隐藏滚动条

### 3. 应用样式优化

根据问题清单，按以下优先级修改：

#### 3.1 替换为预定义类

优先使用 `index.css` 中的预定义类：

```tsx
// ❌ 不推荐：重复定义样式
<div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl">

// ✅ 推荐：使用预定义类
<div className="card rounded-xl">
```

#### 3.2 统一颜色使用

确保颜色使用符合规范：

```tsx
// ❌ 不推荐
<span className="text-blue-400">...</span>
<div className="bg-zinc-900">...</div>
<button className="border-gray-600">...</button>

// ✅ 推荐
<span className="text-amber-400">...</span>
<div className="bg-neutral-900">...</div>
<button className="border-neutral-700/50">...</button>
```

#### 3.3 添加交互效果

为可交互元素添加适当的状态反馈：

```tsx
// ✅ 按钮 hover 效果
<button className="general-button">操作</button>

// ✅ 卡片 hover 效果
<div className="card-hover rounded-xl">...</div>

// ✅ 链接 hover 效果 (使用 text-parent 模式)
<a className="text-parent">
  <span className="text">链接文字</span>
</a>
```

#### 3.4 优化滚动区域

为需要滚动的区域添加主题滚动条：

```tsx
// ✅ 垂直滚动列表
<div className="overflow-y-auto max-h-[600px] scrollbar-themed">
  {/* 长列表内容 */}
</div>

// ✅ 隐藏滚动条（横向滚动常用）
<div className="overflow-x-auto scrollbar-hide">
  {/* 横向滚动内容 */}
</div>
```

### 4. 验证修改

// turbo
启动开发服务器预览效果：

```powershell
pnpm dev
```

### 5. 视觉检查清单

在浏览器中检查以下项目：

- [ ] 页面整体颜色是否和谐
- [ ] 卡片边框和背景是否正确显示
- [ ] 按钮 hover 效果是否正常
- [ ] 输入框 focus 效果是否正常
- [ ] 滚动条样式是否符合主题
- [ ] 响应式布局是否正常

---

## 常用 Tailwind 类速查

### 间距

```
p-2/p-4/p-6    内边距 8px/16px/24px
gap-2/gap-4    间隙 8px/16px
space-y-2      垂直间距 8px
```

### 圆角

```
rounded-lg     较大圆角 (0.5rem)
rounded-xl     更大圆角 (0.75rem)
rounded-2xl    最大圆角 (1rem)
```

### 文字

```
text-xs/sm/base/lg   12px/14px/16px/18px
text-white           白色文字
text-neutral-400     灰色次要文字
text-amber-400       高亮文字（hover）
text-amber-300       按钮文字
```

### 背景透明度

```
bg-neutral-800/40    40% 透明度
bg-neutral-900/50    50% 透明度
bg-amber-500/20      20% 透明度（渐变用）
```

---

## 示例：完整卡片组件

```tsx
<div className="card-hover rounded-xl p-4 transition-all">
  {/* 标题区 */}
  <h3 className="mb-2 text-lg font-medium text-white">卡片标题</h3>

  {/* 内容区 */}
  <p className="mb-4 text-sm text-neutral-400">卡片描述文字...</p>

  {/* 操作区 */}
  <div className="flex gap-2">
    <button className="general-button">主要操作</button>
    <button className="card-item rounded-lg px-3 py-1.5 text-sm text-white transition-colors hover:text-amber-400">
      次要操作
    </button>
  </div>
</div>
```

---

## 注意事项

1. **不要过度使用预定义类**：对于一次性的特殊样式，仍然使用 Tailwind 类
2. **保持语义化**：className 应该反映元素的用途，而非仅仅是视觉效果
3. **测试响应式**：确保修改后在移动端和桌面端都表现良好
4. **使用 cn() 函数**：条件样式必须使用 `cn()` 工具函数合并类名
