# Stats Design System (统计组件设计系统)

## Style: DarkGlass (暗色玻璃拟态)

### Highlight Stat Card (高亮统计卡)

**Visual Summary**:

- **Background**: 线性渐变 `bg-linear-to-br from-blue-500/20 to-cyan-600/20`
- **Border**: `border border-blue-500/30`
- **Typography**: 大号数字 (`text-3xl`)

#### Code Snippet

```tsx
<div className="rounded-lg border border-blue-500/30 bg-linear-to-br from-blue-500/20 to-cyan-600/20 p-4 text-center">
  <div className="mb-1 text-3xl text-blue-400">28,547</div>
  <div className="text-sm text-neutral-400">注册用户</div>
</div>
```

### Grid Stat Item (网格统计项)

**Visual Summary**:

- **Background**: `bg-neutral-900/30`
- **Border**: `border border-neutral-700/50`
- **Layout**: 2列网格 (`grid-cols-2`)
- **Typography**: 中号数字 (`text-xl`) + 变色强调

#### Code Snippet

```tsx
<div className="grid grid-cols-2 gap-3">
  <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-3 text-center">
    <div className="mb-1 text-xl text-green-400">15,680</div>
    <div className="text-xs text-neutral-500">种子数</div>
  </div>
  {/* Repeat for other stats */}
</div>
```
