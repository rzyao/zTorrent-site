/**
 * 推荐配置页面常量定义
 */

// 推荐策略选项（用于表格和表单）
export const STRATEGY_TYPE_OPTIONS = [
  { label: "最新发布 (Latest)", value: "latest" },
  { label: "下载最多 (Hot Downloads)", value: "hot_downloads" },
  { label: "浏览最多 (Hot Views)", value: "hot_views" },
  { label: "做种最多 (Most Seeded)", value: "most_seeded" },
  { label: "最近活跃 (Recent Active)", value: "recent_active" },
];

// 策略类型枚举（用于 ProTable valueEnum）
export const STRATEGY_TYPE_ENUM = {
  latest: { text: "最新发布", status: "Processing" },
  hot_downloads: { text: "下载最多", status: "Success" },
  hot_views: { text: "浏览最多", status: "Warning" },
  most_seeded: { text: "做种最多", status: "Default" },
  recent_active: { text: "最近活跃", status: "Processing" },
} as const;

// 展示样式选项
export const DISPLAY_STYLE_OPTIONS = [
  { label: "横向滚动卡片 (Row)", value: "card_row" },
  { label: "网格列表 (Grid)", value: "card_grid" },
  { label: "大图展示 (Hero)", value: "hero_banner" },
];

// 表单默认值
export const DEFAULT_FORM_VALUES = {
  limit: 10,
  sort: 0,
  enabled: true,
  timeRange: 7,
  tabIds: [],
};
