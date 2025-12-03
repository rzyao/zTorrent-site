## 目标
- 将 FilmDetailPage 的“其他版本”模块改为“种子列表”，展示该影片的全部种子（raw.torrents）。
- 列表项可点击并跳转到“种子详情页”(`/torrent-detail/:id`)。
- 删除右侧栏的“上传者”模块。

## 关键修改点
1. 数据映射完善（保留兼容字段，不做旧结构兼容）
- 在 `mapDetail(raw)` 中新增 `torrents` 数组，直接基于后端 `raw.torrents` 映射为前端展示结构：`id, title(取quality), category(取raw.category或空), image(取poster), size, seeders, leechers, completed(默认0), uploader(空), uploadTime(空), isFree/isVip/isHot(默认false), comments(默认0), rating(取整体rating或空)`。
- 位置参考：`src/pages/FilmDetailPage.tsx:121-123` 当前对 `otherVersions` 的映射附近，新增同级字段 `torrents`。
- 原 `otherVersions` 字段后续不再使用。

2. UI：用统一“种子列表”组件替换“其他版本”卡片
- 在左侧卡片区将标题从“其他版本”改为“种子列表”。位置：`src/pages/FilmDetailPage.tsx:385`。
- 删除原有针对 `torrentDetail.otherVersions` 的卡片渲染，改为引入并渲染 `TorrentTable`：
  - 引入：`import { TorrentTable } from '@/components/TorrentTable'`
  - 渲染：`<TorrentTable torrents={torrentDetail.torrents} />`
  - 位置替换范围：`src/pages/FilmDetailPage.tsx:383-427`。
- 原因：统一种子列表的样式与信息密度，直接复用现有组件，提升一致性。

3. 列表点击跳转到种子详情
- 调整 `TorrentTable` 内标题链接，从占位 `href="#"` 改为路由跳转：
  - 引入：`import { Link } from 'react-router-dom'`
  - 替换标题处：将 `a` 改为 `<Link to={`/torrent-detail/${torrent.id}`}>`。
  - 位置：`src/components/TorrentTable.tsx:75-81`。
- 原因：确保用户点击列表标题后进入对应的种子详情页，满足交互需求。

4. 删除右侧“上传者”模块
- 直接移除侧边栏中的“上传者”卡片块。
- 位置：`src/pages/FilmDetailPage.tsx:679-704`。
- 原因：用户明确提出删除上传者模块，减少无关信息。

## 路由与跳转确认
- 已存在路由：`/torrent-detail/:id`（`src/routes/AppRoutes.tsx`）。
- 详情页组件：`src/pages/TorrentDetailPage/index.tsx` 使用 `useParams` 读取 `id`。
- 因此 `Link to={\`/torrent-detail/${torrent.id}\`}` 可直接工作，无需新增路由。

## 校验方案
- 本地运行后访问某影片详情：
  - 左侧卡片显示“种子列表”，表格内容来源于后端 `raw.torrents`。
  - 列表标题点击后跳转到 `/torrent-detail/<id>` 并正确展示详情。
  - 右侧栏不再出现“上传者”模块。
  - 当 `raw.torrents` 为空时，表格显示空态（组件自带行为空或可在页面加“暂无种子”文案）。

## 改动原因说明
- 数据改造：直接使用后端 `raw.torrents`，字段映射最小充分，避免依赖旧的“其他版本”结构。
- 组件选择：复用 `TorrentTable` 保持风格统一与可维护性；必要处稍作路由跳转增强。
- 交互一致：点击行为统一走 React Router，避免 `href="#"` 无效链接。
- 模块删除：应用户需求清理无关信息，减少视觉与认知负担。
