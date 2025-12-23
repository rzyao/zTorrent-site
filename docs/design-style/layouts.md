# Layouts Design System (布局设计系统)

## Style: DarkGlass (暗色玻璃拟态)

> 简要描述：大屏宽屏优先的响应式网格布局。

### Dashboard Grid (仪表盘网格)

**Visual Summary**:

- **Max Width**: `max-w-[1920px]` (超宽屏支持)
- **Padding**: `px-4 py-6 md:px-14` (大屏下增加两侧留白)
- **Grid System**:
  - Top: `3-6-3` 比例
  - Bottom: `1-1-1` 三等分

#### Code Snippet

```tsx
<PageContainer className="max-w-[1920px] px-4 py-6 md:px-14">
  {/* Top Section: 3-6-3 Grid */}
  <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
    <div className="lg:col-span-3">...</div> {/* Left Sidebar */}
    <div className="lg:col-span-6">...</div> {/* Main Content / Carousel */}
    <div className="lg:col-span-3">...</div> {/* Right Sidebar */}
  </div>

  {/* Bottom Section: 3 Equal Cols */}
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <section>...</section>
    <section>...</section>
    <section>...</section>
  </div>
</PageContainer>
```
