## 目标
- 按后端已更新的 Swagger/OpenAPI，完成前端对接：提交新增 7 字段、读取并展示兼容新的返回结构。

## 涉及文件
- `src/pages/edit/EditMoviePage.tsx`
- `src/hooks/useFilms.ts`
- 参考：`src/api/models/CreateFilmDto.ts`、`UpdateFilmDto.ts`、`PublicFilmDto.ts`、`PublicFilmDetailDto.ts`、`PublicFilmTorrentDto.ts`（已包含新字段）

## 具体改动
- 提交时包含新增 7 字段
  - 更新 `handleSaveMovie` 的 `payload`，加入：`awards`, `region`, `language`, `doubanLink`, `imdbLink`, `doubanRatingAverage`, `imdbRatingAverage`
  - 仍使用 `posterUrl/backdropUrl`（Create/Update DTO 支持）
- 修正详情获取方法名
  - `useFilms.getFilm` 从 `FilmsService.filmsControllerGetFilm` 更换为 `FilmsService.filmsControllerGetMovieDetail`
- 适配新的返回模型（列表与详情）
  - `mapBackendFilmToLocal`：
    - 海报/背景读取 `detail.poster`、`detail.backdrop`（保留旧 `posterUrl/coverUrl/backdropUrl` 作为回退）
    - 类型读取 `detail.genre`（而非 `genres`）
    - 年份可能为 `number`，转换为 `string`
    - 时长为 `number`（分钟），转换为字符串显示（如 `139分钟`）
    - 评分字段保持 `detail.rating` 显示；新增平均分存入表单（已实现），用于创建时的默认评分
    - 种子列表 `PublicFilmTorrentDto`：无 `version/source/codec/audio`，使用 `quality` 作为 `version`，其他缺失字段置空，保留列表显示与统计
- 表单校验与 UI
  - 已具备：新增链接的 URL 校验与评分范围校验；保留

## 验证计划
- 创建影片：填写/使用 PT-Gen 自动填充，保存后从详情接口读取确认新增字段已持久化
- 编辑影片：修改扩展字段并提交，确认列表与详情展示正常
- 列表与筛选：确保映射后的 `poster/genre/year/rating` 显示与搜索正常

## 风险与回退
- 返回字段差异导致映射空值：已做兼容与回退处理（多来源字段择优）
- 种子版本文案减少：以 `quality` 代替 `version`，UI 文案保持可读

## 备注
- 现阶段不改动 UI 对新增 7 字段的详情展示（编辑表单已支持）；如需在详情页增加展示，可在后续迭代实现。