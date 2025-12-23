# Badges Design System (徽章设计系统)

## Style: DarkGlass (暗色玻璃拟态)

> 简要描述：使用极低透明度的背景 (`/20`) 配合稍重的同色系边框 (`/30`)，文字颜色高亮，在深色背景下清晰可读且不刺眼。

### Status Badge (状态徽章)

**Visual Summary**:

- **System/Error**: Red
- **Event/Warning/Hot**: Amber
- **Notice/Info/Cold**: Blue
- **Success/Seeders**: Green
- **Default/Text**: Neutral

#### Code Snippet

```tsx
// System / Error / Hot
<Badge className="bg-red-500/20 text-red-400 border-red-500/30">
  System
</Badge>

// Event / VIP / Gold
<Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
  Event
</Badge>

// Notice / Filled / Blue
<Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
  Notice
</Badge>

// Free / Open / Green
<Badge className="bg-green-500/20 text-green-400 border-green-500/30">
  Free
</Badge>

// Category / Purple
<Badge className="border-purple-500/30 bg-purple-500/20 text-xs text-purple-400">
  Movie
</Badge>
```

### Solid Badge (实心徽章 - 仅用于强强调)

**Visual Summary**:

- **Usage**: “置顶”等需要极强视觉权重的场景。
- **Style**: `border-0 bg-red-500 text-white`

```tsx
<Badge className="border-0 bg-red-500 text-xs text-white">置顶</Badge>
```
