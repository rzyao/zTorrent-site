# 根据 OpenAPI 完成编辑片单对接的实施计划

## 前置与生成
- 运行 `npm run api:generate`，从 `http://localhost:8890/api-docs-json` 生成并更新 `src/api` 客户端（axios）。
- 确认运行时基址：`OpenAPI.BASE` 来自 `VITE_API_BASE_URL`；令牌从 `localStorage.accessToken`。
- 保留 `src/api/custom/*` 自定义封装，必要时同步字段变更。

## Hook 接入改造
- 更新 `src/hooks/usePlaylists.ts`：
  - 使用最新 `PlaylistsService` 接口对齐：`create/update/delete/get/list/addFilm/removeFilm/reorderFilm`。
  - 返回值类型改为生成的 `PlaylistDTO/PlaylistSummaryDTO/PlaylistItemDTO`，移除 `any` 映射。
  - 统一错误处理：非 `code=0` 走异常提示；不做旧兼容。
- 更新 `src/hooks/useFilms.ts`：
  - 使用 `FilmsService.listFilms` 替代模拟数据，支持 `page/limit/keyword/genreIds`。
  - 列表项类型使用 `FilmListItemDTO`，覆盖 `poster/year/duration/genres`。

## 页面对接改造
- `src/pages/edit/EditPlaylistPage.tsx`：
  - 移除静态 `availableMovies`，改为从 `useFilms` 加载的 `available` 渲染选择面板。
  - 创建/编辑/删除调用 `usePlaylists` 接口；成功后以最新 `PlaylistDTO` 回填。
  - 添加/移除影片调用对应接口；直接使用返回的最新片单刷新右侧详情。
  - 排序交互：引入简单拖拽（可选 `dnd-kit`），在确认时调用 `reorderFilm`，提交 `order: string[]` 并应用返回的 `films` 顺序。
  - 统一使用生成模型的字段名（`coverUrl/tags/visibility/stats/meta/films.position`）。
- `src/pages/PlaylistsPage.tsx`：
  - 列表数据使用 `listPlaylists`，展示项切换为 `PlaylistSummaryDTO` 字段。
- `src/pages/PlaylistDetailPage.tsx`：
  - 详情展示使用 `getPlaylist` 的 `PlaylistDTO`，字段一致化。

## 上传与封面（若已对接）
- 若后端提供 `POST /images/upload`（base64 JSON）：在编辑页封面上传处调用，拿 `url` 写入 `coverUrl` 并参与保存。

## 类型与模型统一
- 引入生成类型：`import { PlaylistDTO, PlaylistItemDTO, PlaylistSummaryDTO } from '@/api/models'`。
- 去除自定义的旧类型与 `any`，不做旧兼容。

## 错误处理与提示
- 统一处理 `{ code, message }`，`code!=0` 走错误提示；具体错误码含 `1001/1004/1403/1500`。
- 对关键操作（保存、添加、移除、排序）增加失败提示信息。

## 验证与预览
- 启动开发环境，验证：
  - 列表分页与搜索；
  - 创建/编辑/删除片单；
  - 添加/移除/排序影片后返回最新片单并刷新；
  - 封面上传与保存；
  - 错误码场景提示。

## 备注
- 不做旧兼容：彻底替换旧字段与模拟数据。
- 代码内加入详细注释，解释每处对接的原因与改动点。