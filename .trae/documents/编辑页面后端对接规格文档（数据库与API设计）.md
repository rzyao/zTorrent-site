# 目标
为“编辑页面（影片/片单）”提供后端对接规格文档，使后端依据本文档完成数据库表结构与API设计，并与现有OpenAPI风格保持一致。

## 适配现状与约束
- 现有前端：`EditMoviePage` 与 `EditPlaylistPage` 基于本地状态，无后端持久化。
- 现有OpenAPI服务：存在 `FilmsService`、`TorrentsService` 等服务，接口返回统一包裹 `{ code, message, data, path, timestamp }`，方法多为 `POST`，路径如 `/films/create-film`。
- 命名与风格：延续 `xxxControllerCreate/Update/Delete/List` 与 `/entity/action` 的URL风格。

## 数据库设计（ER与字段）
### 核心实体
1. Film（影片）
- 字段：`id (uuid)`、`title`、`original_title`、`year`、`category (enum: film|series|documentary|anime)`、`rating (decimal)`、`duration`、`director`、`description (text)`、`poster_url`、`backdrop_url`、`enabled (bool)`、`sort (int)`、`created_at`、`updated_at`
- 说明：与现有 `CreateFilmDto` 对齐并扩展字段以满足前端表单；保留 `enabled/sort`。

2. Genre（类型）
- 字段：`id (uuid)`、`name (unique)`
- 关系：`film_genres(film_id, genre_id)` 多对多；为搜索与分类做索引。

3. Person（人物，可选）
- 字段：`id`、`name`；关系：`film_cast(film_id, person_id)` 多对多；如不需要可先以 `cast JSON[]` 存在 `films`。

4. Torrent（种子）（复用既有表）
- 关键字段参考既有系统：`id`、`version`、`size`、`quality`、`source`、`codec`、`audio`、`is_free`、`is_vip`、`seeders`、`leechers`、`upload_date`、`...`
- 关系：`film_torrents(film_id, torrent_id, sort)`；唯一索引 `(film_id, torrent_id)`，`sort` 用于版本排序。

5. Playlist（片单）
- 字段：`id (uuid)`、`title`、`description`、`cover_url`、`visibility (enum: public|private|friends)`、`owner_user_id`、`views (int)`、`likes (int)`、`enabled (bool)`、`sort (int)`、`created_at`、`updated_at`
- 关系：`playlist_films(playlist_id, film_id, sort)`；唯一索引 `(playlist_id, film_id)`；`sort` 控制片单中的影片顺序。

### 索引与约束
- `films(title)`、`films(director)` 文本索引；`film_genres(genre_id)` 普通索引。
- `film_torrents(film_id, torrent_id)` 唯一约束；`playlist_films(playlist_id, sort)` 排序辅助索引。

## API设计（契约与DTO）
### 通用规范
- 鉴权：所有接口需要登录；编辑相关需要权限 `page:edit` 或更细粒度如 `film:write`、`playlist:write`。
- 响应包裹：`{ code, message, data, path, timestamp }`；错误码：`400/401/403/404/409/422/500`。
- 分页与查询：`page, limit, sortBy, sortOrder, keyword, filters{category, year, ratingMin, ratingMax, genreIds[]}`。

### 影片（FilmsService 扩展）
- `POST /films/create-film` → `CreateFilmDto`
  - 请求：`{ title, description?, coverUrl?, enabled?, sort? , originalTitle?, year?, category?, rating?, duration?, director?, posterUrl?, backdropUrl?, genres?[] , cast?[] }`
  - 响应：`data: { id }`
- `POST /films/update-film` → `{ id, data: UpdateFilmDto }`
  - `UpdateFilmDto` 同上所有可选字段；响应：`data: { id, updatedAt }`
- `POST /films/delete-film` → `FilmIdDto { id }`
  - 响应：`data: { success: true }`
- `POST /films/list-films` → `ListFilmsDto`
  - 响应：`data: { items: FilmSummary[], total, page, limit }`
- `POST /films/film-add-torrent` → `AddFilmTorrentDto { filmId, torrentId, sort? }`
- `POST /films/update-film-torrent` → `{ id: string, data: UpdateFilmTorrentDto { sort? } }`
- `POST /films/film-remove-torrent` → `{ filmId, torrentId }`
- `POST /films/get-film` → `{ id }` 返回详情：包含 `torrents[]`、`genres[]`、`cast[]`

### 种子（TorrentsService 供编辑页调用）
- `POST /torrents/create` → 用于从编辑页新建版本
  - 请求：`{ version, size, quality, source, codec, audio, isFree, isVip, uploadDate? }`
  - 响应：`data: { id }`
- `POST /torrents/update` → `{ id, data }`
- `POST /torrents/delete` → `{ id }`
- `POST /torrents/list` → 供选择已有版本时检索

### 片单（新增 PlaylistsService）
- `POST /playlists/create-playlist`
  - 请求：`{ title, description?, coverUrl?, visibility, enabled?, sort? }`
  - 响应：`data: { id }`
- `POST /playlists/update-playlist` → `{ id, data }`
- `POST /playlists/delete-playlist` → `{ id }`
- `POST /playlists/list-playlists` → 支持分页/过滤：`{ page, limit, keyword, visibility?, ownerUserId? }`
- `POST /playlists/get-playlist` → `{ id }` 返回详情含 `movies[]`
- `POST /playlists/add-film` → `{ playlistId, filmId, sort? }`
- `POST /playlists/remove-film` → `{ playlistId, filmId }`
- `POST /playlists/reorder-film` → `{ playlistId, filmId, sort }`
- 可选统计：`POST /playlists/increment-views`、`POST /playlists/like`

### DTO示例
- `FilmSummary`: `{ id, title, originalTitle?, year?, category?, rating?, posterUrl?, torrentCount }`
- `FilmDetail`: `FilmSummary + { backdropUrl?, duration?, director?, description?, genres[], cast[], torrents[] }`
- `PlaylistSummary`: `{ id, title, coverUrl?, visibility, views, likes }`
- `PlaylistDetail`: `PlaylistSummary + { description?, movies: FilmSummary[] }`

## 校验规则
- 影片：`title` 必填；`year` 为 `YYYY` 或 `YYYY-YYYY`；`rating` 0–10；`category` 受限枚举；`genres[]`、`cast[]` 最大长度约束；图片URL格式校验。
- 种子：`version`、`quality`、`source`、`codec`、`audio` 必填；`size` 规范（如 `68.5 GB`）；`isFree/isVip` 为布尔；
- 片单：`title` 必填；`visibility` 枚举；`movies` 去重；`sort` 非负整数。

## 权限与审计
- 权限：编辑页相关API需要 `page:edit`；删除动作建议单独权限位，如 `film:delete`、`playlist:delete`。
- 审计：对 `create/update/delete` 记录操作人、时间、IP；软删除可选。

## 前端交互映射
- 影片“保存”：
  1) 新建→`/films/create-film`；编辑→`/films/update-film`
  2) 成功后刷新局部：`/films/get-film` 或前端本地状态同步
- 添加版本：如版本不存在→`/torrents/create` 后 `/films/film-add-torrent`；存在则直接 `/film-add-torrent`
- 移除版本：`/films/film-remove-torrent`
- 片单保存：新建→`/playlists/create-playlist`；编辑→`/playlists/update-playlist`
- 片单增删影片：`/playlists/add-film`、`/playlists/remove-film`；排序→`/playlists/reorder-film`

## 索引与性能建议
- `films(title, director)` 建全文索引；`film_genres(genre_id)`、`playlist_films(playlist_id, sort)` 建组合索引。
- 列表接口默认分页；支持关键字与多条件过滤；

## 错误码与返回示例
- `400 参数错误`、`401 未认证`、`403 禁止访问`、`404 不存在`、`409 冲突(重复绑定)`、`422 校验失败`、`500 服务器错误`。
- 返回示例统一使用现有包裹结构，并包含 `data` 的具体对象或分页列表。

## 落地步骤（后端）
1. 建表与迁移：`films/genres/film_genres/film_torrents/playlists/playlist_films(+ 可选 persons/film_cast)`
2. 实现服务：扩展 `FilmsService` 与新增 `PlaylistsService`、复用 `TorrentsService`
3. 接口鉴权与权限位：中间件校验 `page:edit` 等
4. 编写DTO与校验器：枚举与格式规则落地
5. 提供OpenAPI描述：生成前端SDK，保证类型对齐

——
确认后，我将据此在仓库 `docs/` 下生成“后端对接规格文档”，包含字段级定义、示例请求/响应与ER图建议，并逐节对应到当前前端表单字段。