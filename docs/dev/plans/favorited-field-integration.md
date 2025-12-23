# 详情页 `isFavorited` 字段对接与优化规划

## 1. 现状分析

目前前端在展示详情页（电影、剧集、种子、片单）的收藏状态时，采用了以下流程：

1. 调用详情接口获取基础数据。
2. 详情页中的 `FavoriteButton` 组件独立调用 `useFavorite` Hook。
3. `useFavorite` 内部通过 `favoritesControllerCheck` 接口再次向后端查询该用户是否已收藏该资源。

**相关文件**:

- `src/hooks/useFavorite.ts` (核心逻辑)
- `src/pages/MovieDetail/index.tsx` (电影详情)
- `src/pages/SeriesDetail/index.tsx` (剧集详情)
- `src/pages/TorrentDetail/index.tsx` (种子详情)
- `src/pages/PlaylistDetail/index.tsx` (片单详情)

**当前痛点**:

- 每次进入详情页都会多出一次 API 请求（check 收藏状态）。
- 详情接口已经包含了 `isFavorited` 字段，这部分数据未被利用。

## 2. 对接方案

### 2.1 API 与模型层

- [x] **确认生成状态**: `MovieDetailDto`, `SeriesDetailDto`, `PlaylistDTO` 均已包含 `isFavorited: boolean`。
- [ ] **更新种子模型**: `TorrentDetail` 的映射逻辑需要手动增加 `isFavorited` 字段解析。

### 2.2 状态管理优化 (TanStack Query)

为了在不改变 `FavoriteButton` 独立性的前提下利用详情页数据，我们将采用 **“预设缓存 (Seed Cache)”** 策略：

1. **修改 `useFavorite`**:
   - 确保 `staleTime` 合理，防止立即失效。
2. **详情页同步**:
   - 在详情页加载成功后，自动将 `isFavorited` 的值写入 `['favorites', 'check', targetType, targetId]` 的 Query Cache 中。
   - 这样 `FavoriteButton` 初始化时，`useQuery` 会直接命中该缓存，从而跳过网络请求。

### 2.3 各页面适配工作

#### 电影详情 (`MovieDetail`)

- [ ] 在 `MovieDetailPage` 中，获取 `detail` 数据后，使用 `queryClient.setQueryData` 写入收藏状态。

#### 剧集详情 (`SeriesDetail`)

- [ ] 同上，在页面组件中同步缓存。

#### 种子详情 (`TorrentDetail`)

- [ ] 修改 `load` 函数中的 `mapped` 对象，提取 `isFavorited`。
- [ ] 更新 `TorrentData` 类型定义。
- [ ] 同步缓存。

#### 片单详情 (`PlaylistDetail`)

- [ ] 确认其使用了 `FavoriteButton`。
- [ ] 同步缓存。

## 3. 功能扩展建议 (Value Add)

> [!TIP]
> 利用现有字段提升交互体验

- **性能提升**: 详情页首屏请求数减少 1 个。
- **状态一致性**: 当用户在详情页点击收藏后，`useFavorite` 的 Optimistic Update 会更新缓存，详情页如果后续重新渲染也能保持同步。

## 4. 实施步骤

1. **Step 1**: 更新 `TorrentDetail` 的模型定义和解析逻辑。
2. **Step 2**: 在各详情页实现 `Query Cache` 注入逻辑。
3. **Step 3**: 验证。
