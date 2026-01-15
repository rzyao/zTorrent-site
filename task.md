# 任务：TorrentDetail 页面重构与规范化

## 状态

- [x] 分析现有代码与架构
- [x] 提取业务逻辑至 Custom Hook
- [x] 迁移数据获取至 TanStack Query
- [x] 拆分 UI 组件
- [x] 整合并验证

## 目标

对 `src/modules/app/pages/TorrentDetail/index.tsx` 进行深度重构，旨在解决以下问题：

1.  **架构混乱**：数据获取、状态管理与 UI 渲染耦合在单一文件中，导致文件过大 (900+ 行)。
2.  **数据层陈旧**：使用 `useEffect` 手动管理 API 请求状态，缺乏缓存与自动重试机制。
3.  **组件复用性差**：大量 UI 代码堆砌，难以维护与复用。

## 关键变更

1.  **引入 `useTorrentDetailLogic`**：集中管理种子详情的所有业务逻辑。
2.  **采用 `useQuery`**：替换 `TorrentsSearchService` 和 `TorrentsCommentsService` 的手动调用。
3.  **组件原子化**：拆分为 `TorrentHeader`, `TorrentDescription`, `TorrentStills` 等独立组件。
