## 目标
- 使用后端 OpenAPI 客户端对接 `PlaylistDetailPage`，移除本地模拟数据
- 保留现有交互与样式，接入真实的片单详情、影片列表、关注/浏览量逻辑

## 接入点与依赖
- 服务入口：`src/api/index.ts` 导出的 `PlaylistsService`、`FilmsService`
- 请求管线：`src/api/core/OpenAPI.ts` 配置、`src/api/core/request.ts` axios 封装
- 相关页面参考：`src/pages/PlaylistsPage.tsx`（点赞/浏览量接入示例）；`src/pages/FilmDetailPage.tsx`（种子详情弹窗数据来源）

## 页面数据流改造
1. 移除模拟数据
   - 删除 `playlistData` 与 `movies: Movie[]`（`src/pages/PlaylistDetailPage.tsx:41-88, 92-184`）
   - 删除本地 `interface Movie`，改用 API 返回字段映射到本页 UI 模型
2. 新增状态管理
   - `loading`、`error`：页面加载与错误态
   - `playlist`：片单详情（从 `PlaylistsService.playlistsControllerGet({ id })` 获取）
   - `movies`：片单内影片数组（优先从 `playlistsControllerGet` 的返回体中提取；若返回体未直接提供，则回退为 `FilmsService` 按片单过滤的列表方案）
3. 首次加载
   - 在 `useEffect` 中调用 `PlaylistsService.playlistsControllerGet({ id: playlistId })`
   - 解析返回体：标题、描述、封面、创建者、统计（影片数、关注数、浏览量、评分）、标签
   - 解析影片项：`id`、`title`、`originalTitle`、`year`、`director`、`poster/backdrop`、`rating`、`genre`、`duration`、`torrentsCount`；若含 `torrents`，保留以便弹窗使用
   - 加载完成后调用 `PlaylistsService.playlistsControllerIncViews({ id: playlistId })`，并将本地 `viewsCount` +1
4. 关注/点赞
   - 以按钮触发 `PlaylistsService.playlistsControllerLike({ id: playlistId })`
   - 服务成功后：切换 `isFollowing`，并本地自增/回退 `followersCount`
   - 初始关注态：若详情返回有 `isLiked` 字段则用之；否则默认 `false`

## 排序与视图
- 排序 `sortBy: 'order' | 'rating' | 'year'`
  - `order`：优先使用影片项的 `sort` 字段；如不存在则用数组原始序
  - `rating`：按 `rating` 降序
  - `year`：按 `year` 降序
- 视图切换保持不变（网格/列表），对 `movies` 的渲染改为使用接口数据

## 详情弹窗对接
- 现逻辑：点击电影卡片调用 `openFilm(movie.id)` 并传入到 `FilmDetail` 作为 `torrentId`（`src/pages/PlaylistDetailPage.tsx:335-356, 451-455`）
- 调整：
  - 若影片含 `torrents`（如 `PublicFilmDetailDto.torrents`），选择第一个或评分最佳的 `torrent.id` 作为 `selectedTorrentId` 传给 `FilmDetail`
  - 若无种子数据：不打开弹窗，改为触发 `onFilmClick?.(filmId)`，保持外部路由跳转能力

## 类型与映射
- 因 `PlaylistsService` 部分返回为 `Record<string, any>`，新增一个本地适配器：
  - `adaptPlaylist(data: any) => { id, title, description, coverImage, creator, creatorAvatar?, moviesCount, followersCount, viewsCount, rating, createdAt, updatedAt, tags }`
  - `adaptMovie(item: any) => { id, title, originalTitle, year, director, poster, backdrop, rating, genre, duration, torrentsCount, torrents? }`
- 尽量复用已生成模型字段（如 `PublicFilmDto` 命名：`posterUrl`/`backdropUrl`），适配器内兼容后端实际字段名

## 错误与空态
- 加载错误：在工具栏区域显示错误信息并提供重试按钮
- 空列表：在影片列表区域显示“暂无影片”的占位内容
- 保持现有样式与动效，不改变 UI 结构

## 代码变更位置（关键引用）
- 删除模拟数据与改造数据源：`src/pages/PlaylistDetailPage.tsx:41-88, 92-184`
- 点击交互与弹窗处理：`src/pages/PlaylistDetailPage.tsx:335-356, 451-455`
- 工具栏排序/视图逻辑复用：`src/pages/PlaylistDetailPage.tsx:291-323, 327-374, 376-448`

## 验证方案
- 启动前端开发环境后：
  - 进入片单详情页，观察：封面与信息是否来自后端；浏览量是否自增；关注按钮是否联动计数
  - 切换排序与视图：检查影片渲染是否正确
  - 点击卡片：若存在种子，弹出 `FilmDetail`；否则走 `onFilmClick`
- 网络失败时：确认错误提示与重试逻辑

## 实施说明
- 按用户规则添加详细代码注释，解释每一步改动原因
- 不做旧代码兼容，直接切换到真实数据流
- 严格使用已存在的服务与封装（不引入新库）

请确认上述方案，确认后我将开始具体改造与实现。