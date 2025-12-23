# Cards Design System (卡片设计系统)

## Style: DarkGlass (暗色玻璃拟态)

> 简要描述：使用深色半透明背景与细微边框，营造现代、深邃且富有层次感的界面风格。大量使用 Neutral 色系作为基底，辅以 Amber, Blue, Red 等高亮色点缀，强调内容的层级与交互感。

### Generic Container (通用区块容器)

**Visual Summary**:

- **Background**: `bg-neutral-800/40`
- **Border**: `border border-neutral-700/50`
- **Radius**: `rounded-xl`
- **Padding**: `p-5`
- **Header**: Flex布局，白色标题配高亮图标。

#### Code Snippet

```tsx
<div className="h-full rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="flex items-center gap-2 text-lg text-white">
      <Icon className="h-5 w-5 text-amber-400" />
      Title
    </h2>
  </div>
  {/* Content */}
</div>
```

### Request Card (求种卡片)

**Visual Summary**:

- **Background**: `bg-neutral-900/30`
- **Border**: `border border-neutral-700/50`
- **Interactive**: `hover:border-amber-500/30` (金色微光)
- **Content**: 适合展示标题、状态徽章与多项元数据。

#### Code Snippet

```tsx
<div className="group cursor-pointer rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4 transition-all hover:border-amber-500/30">
  <div className="mb-2 flex items-start justify-between gap-3">
    <h3 className="line-clamp-2 flex-1 text-sm text-white transition-colors group-hover:text-amber-400">
      Title
    </h3>
    <Badge>Status</Badge>
  </div>
  <div className="flex items-center gap-3 text-xs text-neutral-500">{/* Metadata */}</div>
</div>
```

### Recommendation Card (推荐卡片)

**Visual Summary**:

- **Structure**: 左图右文 (Flex布局)
- **Image**: `h-28 w-20 rounded-lg object-cover` (电影海报风格)
- **Interactive**: 同样采用 `hover:border-amber-500/30` 统一交互语言。

#### Code Snippet

```tsx
<div className="group flex cursor-pointer gap-3 rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-3 transition-all hover:border-amber-500/30">
  <img src="..." className="h-28 w-20 shrink-0 rounded-lg object-cover" />
  <div className="min-w-0 flex-1">{/* Content */}</div>
</div>
```

### Forum Post Item (论坛列表项)

**Visual Summary**:

- **Appearance**: 更轻量级，**无边框**，纯背景色交互。
- **Background**: `bg-neutral-900/30` -> `hover:bg-neutral-800/50`
- **Usage**: 适用于高密度的列表信息。

#### Code Snippet

```tsx
<div className="group cursor-pointer rounded-lg bg-neutral-900/30 p-3 transition-colors hover:bg-neutral-800/50">
  <h4 className="mb-2 text-sm text-white transition-colors group-hover:text-amber-400">Title</h4>
  {/* Meta */}
</div>
```
