## 目标
- 使 `src/components/TorrentTable.tsx` 的每条种子卡片样式和布局与 `TorrentsPage` 列表视图（/src/pages/TorrentsPage.tsx:312-421）一致。

## 主要改动
- 容器样式：改为 `bg-gray-900/50 rounded-lg border border-gray-800 hover:border-[#00A8E1] transition-all duration-300 cursor-pointer p-4`，统一过渡与光标。
- 布局结构：统一为左侧缩略图（`w-25 h-25`，`ImageWithFallback`）+右侧信息区（标题、徽标、指标），整体 `flex gap-4`。
- 标题区：
  - 采用两行标题样式（`h3`），第一行主标题，第二行副标题 `subTitle`（若无则不渲染），均 `hover:text-[#00A8E1]`。
  - 右侧加入“下载”按钮（`Button size="sm"`），点击调用 `useTorrentDownload().downloadByTorrentId(String(torrent.id), String(torrent.title || 'download'))`。
- 徽标区：
  - 类别使用 `<Badge color="blue" border="white" size="sm" className="text-xs">`，内容为 `torrent.category`（如需字典映射，后续可接入 `useDictionaryLabels` 的 `getCategoryLabel`）。
  - FREE/VIP/HOT 使用 `<Badge color="green|yellow|red" size="sm">`。
  - 评分使用 `Star` 图标与黄色文本，`text-xs`。
  - 若未来有 `tags`，按列表视图的 `tagBadgeColor` 渲染多彩徽标；当前组件无 `tags` 字段则跳过。
- 指标区：
  - 按列表视图顺序与样式渲染：
    - 大小：`HardDrive` + `formatSize(torrent.size)`。
    - 做种：`Upload` + 绿色文本并显示“做种”。
    - 下载：`Download` + 红色文本并显示“下载”。
    - 完成：纯文本“完成”。
    - 评论：`MessageSquare` + 文本“评论”，不再仅在 `>0` 时显示。
    - 上传时间：`Calendar` + `uploadDate`（当前组件字段为 `uploadTime`，将优先使用已有字段；若存在 `uploadDate` 则显示该字段）。
    - 上传者：高亮 `#00A8E1`。
- 响应式：取消现有 `hidden md/lg:flex` 隐藏规则，跟随列表视图始终显示关键指标。

## 接口与类型调整
- `Torrent` 类型：补充可选 `subTitle?: string`；时间字段优先沿用现有 `uploadTime: string`，兼容展示为“上传时间”。
- 保留到详情页的 `Link` 但将文本样式与列表视图一致（如用户希望完全一致，也可改为纯 `h3`，这里先保留链接增强可用性）。

## 代码更新点
- 引入 `Button` 与 `useTorrentDownload`；保留 `ImageWithFallback` 与 `Badge`、`formatSize`。
- 更新外层与各区块 `className`，替换徽标与指标渲染片段，新增下载按钮与副标题渲染。
- 对关键结构与渲染逻辑补充中文注释，解释样式和交互选择（按您的要求）。

## 验证
- 运行开发服务后，在有列表数据的页面对比 `TorrentsPage` 列表视图与 `TorrentTable` 渲染，检查对齐、颜色与交互（悬停、下载节流提示）。
- 检查无 `subTitle`/无 `rating`/无 `image` 等场景下的回退渲染是否正常。

## 后续可选优化（不阻塞本次改造）
- 接入 `useDictionaryLabels` 将 `category` 映射为友好标签。
- 若需要 `tags`，在上游数据补齐并复用 `tagBadgeColor` 逻辑。
