export const TORRENT_FIELD_OPTIONS = [
  { label: "标题", value: "title", type: "text" as const },
  { label: "发布者ID", value: "uploaderId", type: "text" as const },
  { label: "大小", value: "size", type: "text" as const },
  { label: "做种人数", value: "seeders", type: "text" as const },
  { label: "下载人数", value: "downloads", type: "text" as const },
  { label: "是否可见", value: "visible", type: "bool" as const },
  { label: "是否启用", value: "isEnabled", type: "bool" as const },
  { label: "是否封禁", value: "isBanned", type: "bool" as const },
  { label: "上传时间", value: "uploadedAt", type: "date" as const },
  { label: "更新时间", value: "updatedAt", type: "date" as const },
  { label: "审核通过时间", value: "approvedAt", type: "date" as const },
];
