# Buttons Design System (按钮设计系统)

## Style: DarkGlass (暗色玻璃拟态)

> 简要描述：基于 Lucide 图标的圆形透明按钮，主要用于轮播图控制。

### Carousel Control Button (轮播控制按钮)

**Visual Summary**:

- **Shape**: 圆形 (`rounded-full`)
- **Size**: `h-10 w-10`
- **Background**: `bg-black/50` -> `hover:bg-black/70`
- **Visibility**: 默认透明 (`opacity-0`)，父级悬停时显示 (`group-hover:opacity-100`)

#### Code Snippet

```tsx
<button
  onClick={handler}
  className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-black/70"
>
  <ChevronLeft className="h-6 w-6" />
</button>
```

### Carousel Indicator (轮播指示器)

**Visual Summary**:

- **State: Active**: `w-8 bg-amber-400` (拉长且高亮)
- **State: Inactive**: `h-2 w-2 bg-white/50 hover:bg-white/70`

#### Code Snippet

```tsx
<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
  {items.map((_, index) => (
    <button
      className={`h-2 w-2 rounded-full transition-all ${
        index === currentSlide ? "w-8 bg-amber-400" : "bg-white/50 hover:bg-white/70"
      }`}
    />
  ))}
</div>
```
