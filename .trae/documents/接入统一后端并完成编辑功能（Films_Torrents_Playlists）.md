# 目标
将编辑页（影片/片单）从本地状态改造为真实后端对接，实现列表、详情、创建、更新、删除、版本增删与搜索，并符合统一响应（code=1000）与权限规范。

## 对接约束
- 使用已生成的 OpenAPI SDK（`FilmsService/TorrentsService/PlaylistsService`）
- 统一响应：检查 `code===1000`，取 `data`；失败展示错误
- 认证：`AppLayout` 已设置 `OpenAPI.BASE/TOKEN`，沿用 JWT

## 代码改造
### 新增Hook
- `useFilms.ts`：封装 list/get/create/update/delete/addTorrent/removeTorrent，统一解析响应与错误
- `usePlaylists.ts`：封装 list/get/create/update/delete/addFilm/removeFilm/reorder，统一解析响应

### 影片编辑页（EditMoviePage.tsx）
- 初始化：移除示例数据，加载 `listFilms({ page, limit, keyword })`，选中后调用 `getFilm(id)`
- 保存：
  - 新建→`FilmsService.filmsControllerCreate`
  - 编辑→`FilmsService.filmsControllerUpdate`
  - 删除→`FilmsService.filmsControllerDelete`
- 版本：
  - 新增：文件选择→读 Base64→`TorrentsService.torrentsControllerUploadAuto`→返回 `id`→`FilmsService.filmsControllerAddTorrent`
  - 移除：`FilmsService.filmsControllerRemoveTorrent`
- 搜索：输入 `keyword` 触发后端分页查询，更新列表
- 交互：请求态与失败提示；成功后同步局部状态（无需全量刷新）

### 片单编辑页（EditPlaylistPage.tsx）
- 初始化：移除示例数据，加载 `PlaylistsService.playlistsControllerList`
- 保存：新建/编辑/删除对应服务方法
- 影片增删与排序：`addFilm/removeFilm/reorder`
- 详情：选中后调用 `playlistsControllerGet` 显示 `movies`

## UI小幅调整
- 在“添加种子”表单增 `torrent` 文件输入（Base64）与必要字段
- 在两页添加基础的 loading/错误提示（轻量，不引入新库）

## 验证
- 使用后端统一成功码 `1000`；错误码按过滤器映射
- 实测流程：创建影片→添加版本→移除版本→编辑影片；创建片单→增删影片→更新

## 交付
- 提交 Hook 与页面改造代码；不改动已有全局认证配置
- 保持中文变量与字段映射，键名 camelCase，与文档一致