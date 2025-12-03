## 目标
- 在所有触发“下载种子”的前端调用中，将来源信息一并发送到后端：`POST /torrents/download-url`，请求体为 `{ torrentId: string, source: { filmId: string, playListId: string } }`。
- 来源信息从 URL 获取，遵循文档 `docs/URL 参数透传方案.md` 的约定：`source_playlist_id`、`source_film_id`。

## 代码改动
### 新增 Hook：URL 来源追踪
- 新增 `src/hooks/useSourceTracker.ts`：
  - 常量 `SOURCE_KEYS = { PLAYLIST: 'source_playlist_id', FILM: 'source_film_id' }`。
  - `useSourceTracker(currentFilmId?: string)`：
    - 读取当前 URL 的 `source_playlist_id`、`source_film_id`；`currentFilmId` 优先作为 `filmId`。
    - 返回：
      - `sourcePayload: { filmId: string, playListId: string }`
      - `getNextQueryString(): string`（将已知来源参数拼成下一级跳转 query）。
      - `playListId: string`（必要时用于 UI 展示）。

### 扩展下载流程 Hook
- 修改 `src/features/download/useTorrentDownload.ts`：
  - `downloadByTorrentId(torrentId: string, name?: string, sourceOverride?: { filmId: string; playListId: string })`
  - 默认行为：使用 `useSearchParams`（或复用 `useSourceTracker`）从当前 URL 读取来源参数；若传入 `sourceOverride`，则以覆盖值为准。
  - 调用 `TorrentsService.torrentsControllerCreateDownloadUrl({ torrentId, source })`，确保 `source` 字段始终存在（缺失时以空字符串降级）。
  - 其余下载逻辑保持不变（获取一次性链接、GET 下载、保存文件、下载记录）。

### 片单详情页：打开影片时植入来源参数
- 修改 `src/pages/PlaylistDetailPage.tsx` 的影片项点击逻辑：
  - 在 `openFilm(id)` 中，除继续打开弹窗外，使用 `navigate` 设置当前 URL 的 `search`，追加：`source_playlist_id=<当前片单ID>&source_film_id=<当前影片ID>`；这样弹窗内的下载逻辑也能从 URL 读取来源。
  - 弹窗关闭时可选择恢复原始 `search`（可先不恢复，保持来源信息在会话内生效）。

### 详情页与列表页的下载按钮
- `src/pages/TorrentsPage.tsx`：无来源时，`downloadByTorrentId` 自动从 URL 读到空参数，后端接收 `filmId: ''`、`playListId: ''`（符合文档的场景 4/5）。
- `src/pages/TorrentDetailPage/index.tsx`：保持使用 `downloadByTorrentId`；当通过带参数的链接进入（或由片单页写入的 `search`），能正确携带来源信息。

## 场景验证
- 场景 1：片单 → 影片 → 下载
  - URL：`/playlist/P1?…`（打开影片时写入 `source_playlist_id=P1`、`source_film_id=F1`）
  - 结果：`{ filmId: 'F1', playListId: 'P1' }`
- 场景 2：片单 → 影片 → 种子 → 下载
  - 影片页 `getNextQueryString()` 生成 query，跳到种子详情或保持在弹窗，但 URL 已含两参。
  - 结果：`{ filmId: 'F1', playListId: 'P1' }`
- 场景 3：首页/搜索 → 影片 → 种子 → 下载
  - 无 `playlist` 来源，仅有 `filmId`（若路由含影片 ID）；当前实现以弹窗为主，URL可能无 `filmId`，则降级为空字符串。
- 场景 4：首页/搜索 → 种子 → 下载
  - 结果：`{ filmId: '', playListId: '' }`
- 场景 5：首页/搜索 → 影片 → 下载
  - 结果：`{ filmId: 'F1', playListId: '' }`（若 URL 写入 `filmId`；否则降级为空）。

## 代码位置与变更点
- 新增：`src/hooks/useSourceTracker.ts`
- 修改：`src/features/download/useTorrentDownload.ts`（在请求体中加入 `source`）
- 修改：`src/pages/PlaylistDetailPage.tsx`（在 `openFilm` 时写入 URL search 来源参数）
- 参考：接口定义已支持 `source`（`src/api/services/TorrentsService.ts:62-92`）。

## 风险与兼容
- 现有“弹窗式详情”不走路由跳转，可能缺少 `filmId`；通过向 URL 写入 `search` 可无侵入满足来源读取。
- 若后续对“影片详情”改为路由页面，可直接使用 `useSourceTracker` 的 `getNextQueryString()` 在链接中透传参数。

## 交付与测试
- 单元测试：为 `useSourceTracker` 与 `useTorrentDownload` 增加参数解析与请求体构造的测试。
- 手动验证：按 5 种场景走一遍，检查请求体的 `source` 字段是否符合预期。