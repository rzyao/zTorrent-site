## 目标
- 在 `src/pages/edit/EditMoviePage.tsx` 中，将“添加种子”由上传新种子改为“搜索并绑定已有种子”。
- 点击“添加种子”时展示搜索框与候选列表；输入字符串后通过 `POST /torrents/search` 查询，排除已绑定当前影片的种子；选择后直接绑定到影片。

## 现状与定位
- 入口按钮：`src/pages/edit/EditMoviePage.tsx:1197–1204`（点击后打开添加表单）
- 现有添加表单：`src/pages/edit/EditMoviePage.tsx:1208–1356`（上传 `.torrent` 并创建）
- 添加逻辑：`handleAddTorrent` 使用 `TorrentsService.torrentsControllerUploadAuto` 创建新种子，再 `useFilms.addTorrent` 绑定：`src/pages/edit/EditMoviePage.tsx:358–394`
- 空状态“添加第一个种子”：`src/pages/edit/EditMoviePage.tsx:1365–1372`
- 影片详情映射（含 `torrents`）：`src/pages/edit/EditMoviePage.tsx:541–581`

## 拟改动点
- 替换 UI：将 `showTorrentForm` 对应的表单块（`1208–1356`）替换为“搜索已有种子”面板：
  - 顶部保留关闭按钮与标题改为“选择已有种子”。
  - 中间加入输入框 `torrentSearchQuery`，支持 300ms 防抖；显示搜索状态与错误提示。
  - 结果列表展示基础信息（版本、大小、质量、做种/下载数等），每项提供“绑定到当前影片”按钮。
- 逻辑调整：
  - 删除 `handleAddTorrent` 新建流程（`358–394`）与 `torrentFileBase64` 文件读取（`1298–1313`）。
  - 新增 `handleBindExistingTorrent(torrentId: string)`：调用 `useFilms.addTorrent`（`src/hooks/useFilms.ts:113–120`），成功后按现有刷新逻辑重新取片详情并更新 `selectedMovie` 与列表（参考 `358–378` 的刷新与状态管理）。
  - 新增搜索函数：`searchTorrents(q: string)` 调用 `TorrentsService.torrentsControllerSearch({ q, filmId: selectedMovie.id })`（`src/api/services/TorrentsService.ts:297–321`，模型 `src/api/models/SearchTorrentsDto.ts:5–13`）。
- 空状态按钮（`1365–1372`）点击后改为打开搜索面板，而非旧上传表单。
- 命名与状态：将 `showTorrentForm` 重命名为 `showTorrentSearch`，新增 `torrentSearchQuery`、`isSearching`、`searchResults`、`searchError`。

## 接口与数据处理
- 搜索接口：`POST /torrents/search`，请求体 `{ q: string, filmId: string }`（`src/api/services/TorrentsService.ts:297–321`）。
  - 注意 `q` 为必填；计划要求输入≥2字符后触发搜索，避免空查询带来不确定结果。
  - 统一响应解包：复用页面内或 `useFilms` 的 `unwrap` 策略（示例 `src/hooks/useFilms.ts:14–22`）。
- 绑定接口：`POST /films/film-add-torrent`（`src/api/services/FilmsService.ts:150–172`），请求体 `AddFilmTorrentDto`（`src/api/models/AddFilmTorrentDto.ts:5–9`）。

## 交互流程
- 点击“添加种子”（`1197–1204`）→ 打开“选择已有种子”面板。
- 用户输入关键词（版本/ID/片名相关）→ 防抖调用 `/torrents/search`，排除已关联当前影片的种子 → 展示结果列表。
- 点击某条结果的“绑定到当前影片”→ 调用 `useFilms.addTorrent` → 刷新影片详情映射（`mapBackendFilmToLocal`）并更新页面。
- 若无结果：展示提示“未找到匹配项，请更换关键词”。

## 错误与边界处理
- 未选择影片时禁用入口按钮与面板交互。
- 搜索中的并发控制（`isSearching`）：输入变化时取消上一次防抖计时；请求返回前避免重复请求。
- 错误提示：`searchError` 与绑定失败弹窗沿用现有 `alert` 行为（与 `handleAddTorrent` 一致）。

## 验证要点
- 打开编辑页，选择影片后点击“添加种子”可见搜索面板。
- 输入关键词后能正确调用 `/torrents/search` 并返回列表；已绑定的条目不在结果中。
- 选择结果后，影片的 `torrents` 列表即时刷新并出现新绑定项。
- 空状态下点击按钮打开搜索面板；旧的上传入口与 Base64 读取逻辑均不再出现。

## 变更原因说明
- 以“绑定已有种子”替换“创建新种子”，符合业务要求并避免重复数据。
- 使用 `filmId` 排除已关联项，防止重复绑定，保证数据一致性。
- 防抖与状态管理减少请求频率，提升交互流畅度与稳定性。
- 复用现有 `useFilms.addTorrent` 与刷新逻辑，最小化改动面并降低风险。