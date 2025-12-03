## 目标
- 影片详情页的“种子列表”改为通过 `POST /films/list-film-torrents` 拉取，不再依赖详情接口返回的内嵌 `torrents` 字段。
- 统一使用现有 OpenAPI 客户端方法 `FilmsService.filmsControllerListTorrents`，与编辑页保持一致的数据来源与刷新逻辑。

## 变更点
- 文件：`src/pages/FilmDetailPage.tsx`
  - 在详情加载完成后，新增一次“种子列表”接口请求，将结果映射为 `TorrentTable` 需要的结构并写入 `detail.torrents`。
  - 调整 `mapDetail`：不再从 `raw.torrents` 初始化 `torrents`，或初始化为空，随后由列表接口结果覆盖。
  - 维持现有渲染位置：`TorrentTable` 使用 `detail.torrents` 渲染（参见 `src/pages/FilmDetailPage.tsx:416-419`）。
- 其他文件无需改动：`src/components/TorrentTable.tsx` 的展示结构保持不变。

## 技术实现
- 仍先调用详情接口：`FilmsService.filmsControllerGetMovieDetail({ id })`（参见 `src/pages/FilmDetailPage.tsx:147-165`），得到基础影片信息。
- 紧接调用列表接口：
  - 方法：`FilmsService.filmsControllerListTorrents({ filmId: effectiveFilmId, page: 1, limit: 100 })`（接口定义位于 `src/api/services/FilmsService.ts:374-400`）。
  - 响应读取兼容两种包装：优先 `resp.code/resp.data.data.items`，回退 `resp.data.items` 或顶层 `items`（参考编辑页实现 `src/pages/edit/EditMoviePage.tsx:458-487`）。
- 将 `items` 映射为 `TorrentTable` 需要的字段：
  - `id: Number(t.id ?? t.torrentId ?? 0)`
  - `title: t.version ?? t.title ?? t.quality ?? ''`
  - `category: detail.category`
  - `image: detail.poster`
  - `size: t.size ?? ''`
  - `seeders: Number(t.seeders ?? 0)`
  - `leechers: Number(t.leechers ?? 0)`
  - `completed: 0`
  - `uploader: t.uploader ?? ''`
  - `uploadTime: t.uploadDate ?? ''`
  - `isFree: Boolean(t.isFree ?? false)`
  - `isVip: Boolean(t.isVip ?? false)`
  - `isHot: false`
  - `comments: 0`
  - `rating: Number(detail.rating ?? 0)`
- 通过 `setDetail(prev => ({ ...prev, torrents: mapped }))` 覆盖 `detail.torrents` 后渲染。

## 错误与加载处理
- 保持原有 `loading/error` 流程；新增列表接口失败时仅置空 `torrents`，UI 显示“暂无种子”（已存在，`src/pages/FilmDetailPage.tsx:418-421`）。
- 如需更细粒度，可引入独立的 `torrentsLoading`/`torrentsError` 状态，但本次变更可沿用现有最简逻辑。

## 验证方式
- 打开路由 `/film/:id`（定义于 `src/routes/AppRoutes.tsx`，详情页组件为 `FilmDetailPage`），确认：
  - 详情信息正常展示；
  - “种子列表”在详情加载后刷新为列表接口返回内容；
  - 列表为空时显示“暂无种子”；
  - 列表项跳转 `to=/torrent-detail/:id` 正常。

## 影响范围与原因说明
- 只改动详情页的数据来源：提升一致性与实时性，与编辑页相同使用 `list-film-torrents`，避免详情接口内嵌数据的时效与分页限制问题。
- 展示组件 `TorrentTable` 不变，保持已存在的样式与交互，降低改动风险。