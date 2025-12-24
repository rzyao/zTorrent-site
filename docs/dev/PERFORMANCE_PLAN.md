# zTorrent-site 性能优化方案

本方案基于对项目现有架构（React 19 + Vite + React Router 7 + Zustand）的深度分析制定，旨在提升首屏加载速度（LCP）、降低交互延迟（INP）并优化内存占用。

## 1. 构建与加载优化 (Build & Loading Performance)

### 1.1 路由级代码分割 (Route-based Code Splitting)
**现状**：目前 `src/routes/AppRoutes.tsx` 中所有页面组件均为静态导入 (`import { Page } from ...`)。这意味着用户访问首页时，必须下载包含所有页面（音乐、论坛、做种等）的巨大 JavaScript Bundle，严重拖慢首屏时间。

**优化方案**：
使用 `React.lazy` 和 `Suspense` 对非首屏路由进行懒加载。

```typescript
// src/routes/AppRoutes.tsx
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// 懒加载页面组件
const MusicPage = lazy(() => import('@/pages/Music').then(module => ({ default: module.MusicPage })));
const ForumPage = lazy(() => import('@/pages/Forum').then(module => ({ default: module.ForumPage })));

// 路由定义
<Route path="music" element={
  <Suspense fallback={<LoadingSpinner />}>
    <MusicPage />
  </Suspense>
} />
```

### 1.2 Bundle 拆分策略 (Chunking Strategy)
**现状**：`vite.config.ts` 使用了默认配置。由于项目依赖了 `recharts` (图表)、`framer-motion` (动画)、`@tanstack/react-query` 等大型库，建议将它们拆分为独立的 Chunk，利用浏览器缓存。

**优化方案**：
在 `vite.config.ts` 中配置 `manualChunks`。

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-popover', 'framer-motion'],
        'data-vendor': ['@tanstack/react-query', 'axios', 'zustand'],
        'chart-vendor': ['recharts'],
      }
    }
  }
}
```

---

## 2. 运行时渲染优化 (Runtime Rendering)

### 2.1 长列表虚拟化 (Virtualization)
**现状**：在 `MusicPage` 的 `SongsSection` 和 `TorrentsList` 页面中，直接渲染了完整的列表。当数据量达到数百条时，DOM 节点数量剧增，导致滚动卡顿和内存飙升。

**优化方案**：
引入 `react-window` 仅渲染可视区域内的列表项。

```typescript
import { FixedSizeList as List } from 'react-window';

// 示例：优化歌曲列表
<List
  height={600}
  itemCount={songs.length}
  itemSize={60} // 每行高度
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <SongRow song={songs[index]} />
    </div>
  )}
</List>
```

### 2.2 搜索与交互响应 (Interaction Responsiveness)
**现状**：`MusicPage` 中的搜索框直接绑定状态。用户每次按键都会触发全页重渲染（Re-render），如果在低端设备上输入过快，会导致输入框卡顿。

**优化方案**：
使用 React 19 的 `useDeferredValue` 或传统的 Debounce 策略，将渲染更新与输入事件解耦。

```typescript
// src/pages/Music/hooks/useViewState.ts
import { useDeferredValue, useState } from 'react';

// 在 UI 中使用 deferredQuery 进行过滤，保持 input 响应流畅
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
```

---

## 3. 数据获取与状态管理 (Data Fetching & State)

### 3.1 迁移至 React Query (Migrate to React Query)
**现状**：`useMusicData.ts` 使用 `useEffect` + `Promise.all` 一次性并行请求所有数据（歌曲、歌手、专辑、歌单）。
**问题**：
1. **首屏阻塞**：必须等待所有接口返回才能渲染，哪怕用户只想看“歌曲”。
2. **缺乏缓存**：切换页面回来会重新请求。
3. **竞态条件**：手动处理 `mounted` 标志容易出错。

**优化方案**：
使用 `useQuery` 替代手动请求，并实现按需加载。

```typescript
// src/pages/Music/hooks/useMusicData.ts
import { useQuery } from '@tanstack/react-query';

export function useMusicData(activeTab: string) {
  // 只有当 tab 为 'songs' 或 'hall' 时才请求歌曲
  const { data: songs } = useQuery({
    queryKey: ['music', 'songs'],
    queryFn: MusicSongsService.songsControllerList,
    enabled: activeTab === 'songs' || activeTab === 'hall',
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
  
  // ... 其他查询类似
}
```

### 3.2 避免大对象 Context 传递
**现状**：`useViewState` 返回了多个状态 setter。如果通过 Context 传递这些未 memoized 的对象，会导致消费组件不必要的重渲染。

**优化方案**：
使用 Zustand 的 selector 模式，组件只订阅它关心的状态切片。

---

## 4. 实施路线图

1. **第一阶段（立竿见影）**：
   - [ ] 修改 `vite.config.ts` 进行分包。
   - [ ] 对 `AppRoutes.tsx` 实施路由懒加载。
   - [ ] 开启 `rollup-plugin-visualizer` 生成报告，验证体积优化。

2. **第二阶段（核心体验）**：
   - [ ] 重构 `useMusicData`，引入 React Query。
   - [ ] 对 `MusicPage` 搜索功能添加 `useDeferredValue`。

3. **第三阶段（深度优化）**：
   - [ ] 引入 `react-window` 改造长列表。
   - [ ] 优化图片加载（WebP, Lazy Loading）。

请审阅以上方案，建议从 **第一阶段** 开始执行。
