# PlaylistsPage 接入 OpenAPI 客户端的实施计划

## 目标
- 用 `PlaylistsService.publicPlaylistsController*` 接口替换当前模拟数据，实现列表、搜索、排序、关注/取消关注、（可选）浏览量上报与创建入口对接。

## 代码改动概览
- 文件：`src/pages/PlaylistsPage.tsx`
  - 删除模拟数据（`allPlaylists`、`myPlaylists`、`followingPlaylists`，见 26-156、158-191、193 行），改为加载服务端数据。
  - 引入 `PlaylistsService` 与必要类型（`PublicListPlaylistsDto` 等）。
  - 新增 `useEffect`/`useMemo` + 本地状态管理：`items`、`loading`、`error`、分页 `page/pageSize`（若暂不分页，可固定 `page=1/pageSize=20`）。
  - 列表加载：调用 `PlaylistsService.publicPlaylistsControllerList({ scope, q, sort, page, pageSize })`，将返回的 `items` 绑定到渲染（替换现有 `filteredPlaylists`）。
  - 搜索与排序：直接通过依赖（`searchQuery`, `sortBy`, `activeTab`）重新请求；删除前端纯本地过滤（206-209）。
  - 关注/取消关注：在 `handleFollowToggle` 中调用 `PlaylistsService.publicPlaylistsControllerFollow(id, { action })` 并更新本地 `items` 的对应项（支持乐观更新与失败回滚）。
  - 详情点击：保留导航逻辑；可在点击时调用 `publicPlaylistsControllerView(id)` 进行浏览量上报（可选）。
  - 创建按钮：导航到现有创建页（若沿用后台管理页 `EditPlaylistPage`），或弹出创建表单后调用 `publicPlaylistsControllerCreate` 并刷新列表。
  - 加载与错误态：在网格位置增加 `loading` 骨架与错误提示（保持当前空状态逻辑）。

## 接入细节
- 参数映射：
  - `scope` ← `activeTab`（`'all' | 'mine' | 'following'`，来源 22、195-204）
  - `q` ← `searchQuery`（来源 286-297）
  - `sort` ← `sortBy`（来源 298-307、24）
  - `page`/`pageSize`：新增本地状态或常量
- 响应映射：
  - 使用返回的 `items: PlaylistCardDto[]` 直接驱动 UI，字段与当前前端所需一致（卡片使用位置 320-347、352-371、373-382、385-407、410-423）。
- 认证与 BASE：
  - 确认 `OpenAPI.BASE` 与 `OpenAPI.TOKEN` 在 `src/layouts/AppLayout.tsx` 已初始化（按后端更新的 swagger）。

## 验证
- 在页面进行以下用例验证：
  - 标签切换三种 `scope` 均能返回数据。
  - 搜索关键字与三种排序生效且与后端规则一致。
  - 关注/取消关注按钮状态与计数实时更新，并处理未登录/失败错误。
  -（可选）点击卡片触发浏览量上报并看到数值增长。
  - 创建入口能成功创建并刷新列表。

## 交付内容
- 完成 `PlaylistsPage.tsx` 的对接改造；不更改其他页面逻辑。
- 保持 UI 与交互一致，增加加载与错误态处理。

## 备注
- 后端将列表与详情使用 `POST` 路径（`/api/playlists/list`、`/api/playlists/detail`）；前端按生成的 `PlaylistsService` 方法调用，无需自行构造 URL。