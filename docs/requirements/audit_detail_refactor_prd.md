# 审核详情页重构需求文档 (PRD)

## 1. 项目背景 (Background)

当前审核后台 (`Review/DetailDrawer`) 仅展示了资源的摘要信息（如标题、提交人），缺失了审核所需的关键决策数据（如文件列表、技术参数 MediaInfo、完整简介）。这导致审核员无法准确评估资源质量，增加了误判风险。

本项目旨在通过复用前台详情页的展示逻辑，打造一个全功能、可视化的“沉浸式审核工作台”。

## 2. 核心需求 (Core Requirements)

### 2.1 界面布局升级 (Layout Upgrade)

- **宽幅抽屉模式 (Wide Drawer)**:
  - 将现有侧边栏宽度从固定像素扩展为 **85% - 90%** 屏幕宽度（响应式）。
  - 保留右侧或底部固定的操作栏 (Sticky Footer)，确保无论内容多长，操作按钮始终可见。

### 2.2 数据深度整合 (Deep Data Integration)

审核详情页必须展示与前台完全一致的全量数据，核心模块包括：

- **种子 (Torrents)**:
  - **完整简介**: 包含海报、富文本描述、剧照轮播。
  - **技术参数**: 完整展示 MediaInfo（编码、分辨率、音轨信息等）。
  - **文件列表**: 完整文件树结构与单文件大小。
  - **用户反馈**: 评论列表（用于辅助判断资源是否有效）。
- **电影/剧集 (Movies/Series)**:
  - 演职人员表、相关推荐、元数据信息。
- **片单 (Playlists)**:
  - 包含的影片列表及其排序。

### 2.3 审核效率工具 (Efficiency Tools)

- **一键理由库 (Quick Reasons)**:
  - 在“驳回”操作中集成预设理由选择器。
  - **预设选项**: "缺少MediaInfo"、"图片/截图失效"、"描述与内容不符"、"含有违规内容"、"文件损坏/无法下载"。
  - 支持多选理由，自动合并填入备注框。

## 3. 技术实现方案 (Implementation Plan)

### 3.1 组件抽离与复用 (Component Extraction)

对现有前台页面进行解耦，提取纯展示组件 (Presentational Components)，使其不依赖路由参数 (useParams)，仅通过 Props 接收数据。

| 原页面                     | 新建可复用组件           | 路径建议                                         |
| :------------------------- | :----------------------- | :----------------------------------------------- |
| `src/pages/TorrentDetail`  | `<TorrentDetailBody />`  | `src/components/business/TorrentDetailBody.tsx`  |
| `src/pages/MovieDetail`    | `<MovieDetailBody />`    | `src/components/business/MovieDetailBody.tsx`    |
| `src/pages/PlaylistDetail` | `<PlaylistDetailBody />` | `src/components/business/PlaylistDetailBody.tsx` |

### 3.2 数据获取策略 (Data Fetching Strategy)

- **实时获取**:
  - 审核抽屉打开 (`useEffect`) 时，根据 `ReviewItem.id` 调用各模块的 `Detail Service` (如 `TorrentsSearchService.detail`)。
  - **Loading 状态**: 在数据加载期间展示骨架屏 (Skeleton)。

### 3.3 审核操作栏优化

- 保持底部固定悬浮。
- 集成 "快捷理由" 下拉菜单或 Tag 组。

## 4. 验收标准 (Acceptance Criteria)

1.  **完整性**: 打开种子审核弹窗，能清晰看到原来的 MediaInfo 代码块和完整的文件列表。
2.  **响应速度**: 点击审核列表项，弹窗迅速弹出并开始加载详细数据，加载过程中有明确反馈。
3.  **操作便捷**: 点击“驳回” -> 选择“缺少MediaInfo” -> 确认，整个流程需在 3 次点击内完成。
