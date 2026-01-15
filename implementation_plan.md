# 实施计划：TorrentDetail 页面架构重构

## 1. 准备工作

- [ ] 确认 API 服务方法签名 (已完成)
- [ ] 创建必要的目录结构：
  - `src/modules/app/pages/TorrentDetail/hooks/`
  - `src/modules/app/pages/TorrentDetail/components/`

## 2. 逻辑提取与数据层现代化 (Phase 1)

- [ ] **创建 `useTorrentDetailLogic.ts`**:
  - 定义 `useTorrentDetail` Hook。
  - 使用 `useQuery` 调用 `TorrentsSearchService.torrentSearchControllerDetail`。
  - 处理数据映射 (Mapping Logic)，将后端 DTO 转换为前端友好的 `TorrentData` 结构。
  - 废弃 `useEffect` 中的手动 fetch 逻辑。
- [ ] **创建 `useTorrentComments.ts`** (可选或整合):
  - 使用 `useQuery` 管理评论列表数据。
  - 使用 `useMutation` 管理发表评论操作。

## 3. UI 组件拆分 (Phase 2)

将 `index.tsx` 中的巨型 JSX 拆解为以下子组件：

- [ ] **`TorrentHeader.tsx`**: 包含标题、Badge 标签、操作按钮 (Download, Favorite, Share)。
- [ ] **`TorrentDescription.tsx`**: 包含简介部分及展开/收起逻辑。
- [ ] **`TorrentStills.tsx`**: 包含剧照轮播与 Lightbox 逻辑。
- [ ] **`TorrentMediaInfo.tsx`**: 包含 MediaInfo 展示逻辑。
- [ ] **`TorrentFileList.tsx`**: 包含文件列表展示逻辑。
- [ ] **`TorrentComments.tsx`**: 包含评论列表与发表评论表单。

## 4. 整合与清理 (Phase 3)

- [ ] 重写 `src/modules/app/pages/TorrentDetail/index.tsx`，引入上述 Hook 和组件。
- [ ] 移除旧的 state 定义和 `useEffect` 代码。
- [ ] 验证页面功能（数据加载、交互、下载、收藏）。
- [ ] 运行类型检查。

## 5. UI 规范化 (Design System Compliance)

虽然未找到 `admin-design-system.md`，但将执行以下通用优化：

- [ ] 确保所有按钮使用 `modules/app/components/ui` 中的标准组件。
- [ ] 统一 Tailwind 类名使用，避免硬编码颜色值，尽量使用 CSS 变量或主题色。
