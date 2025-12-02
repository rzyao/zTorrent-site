## 问题根因
- 仅在下载 GET 接口解析错误消息；生成链接的 POST `/torrents/download-url` 失败时，未解析 `ApiError.body` 中的 `message/data.message`，导致仍显示通用语义。
- 当前提示使用 `alert`，需要改为统一的 `sonner` Toast（项目已有 `AppToaster` 与 `customToast`）。

## 改动方案
- 在 `src/features/download/useTorrentDownload.ts`：
  1) 调用 `TorrentsService.torrentsControllerCreateDownloadUrl` 失败时，从 `e.body` 提取后端消息：优先 `message`，回退 `data.message/msg/error/detail/description`；提取不到时兜底为“下载错误”。
  2) 统一提示接口：引入 `customToast`，将 `onInfo/onError` 替换为 `customToast.info/error/success` 调用。
  3) 保持 GET 下载失败分支同样优先使用后端消息。
- 在使用处（`TorrentsPage.tsx`、`TorrentDetailPage/index.tsx`）：
  - 移除传入的 `alert`/`console.info`，不再覆盖 Hook 的内置 Toast。

## 提示文案规则
- 有后端消息：直接显示后端消息（如“User not found”）。
- 无后端消息：兜底提示“下载错误”。
- 成功开始下载：显示“下载已开始”。
- 轻量节流：显示“操作过于频繁，请稍后再试”。

## 验收
- 提供示例 JSON（如 code 9404，message "User not found"）时，Toast 展示该具体文案；无消息时显示“下载错误”。