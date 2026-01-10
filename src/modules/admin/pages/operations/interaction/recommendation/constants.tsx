/**
 * 推荐配置页面常量定义
 */

// 推荐策略选项（用于表格和表单�?
export const STRATEGY_TYPE_OPTIONS = [
  { label: "最新发�?(Latest)", value: "latest" },
  { label: "下载最�?(Hot Downloads)", value: "hot_downloads" },
  { label: "浏览最�?(Hot Views)", value: "hot_views" },
  { label: "做种最�?(Most Seeded)", value: "most_seeded" },
  { label: "最近活�?(Recent Active)", value: "recent_active" },
];

// 策略类型枚举（用�?ProTable valueEnum�?
export const STRATEGY_TYPE_ENUM = {
  latest: { text: "最新发�?, status: "Processing" },
  hot_downloads: { text: "下载最�?, status: "Success" },
  hot_views: { text: "浏览最�?, status: "Warning" },
  most_seeded: { text: "做种最�?, status: "Default" },
  recent_active: { text: "最近活�?, status: "Processing" },
} as const;

// 展示样式选项
export const DISPLAY_STYLE_OPTIONS = [
  { label: "横向滚动卡片 (Row)", value: "card_row" },
  { label: "网格列表 (Grid)", value: "card_grid" },
  { label: "大图展示 (Hero)", value: "hero_banner" },
];

// 表单默认�?
export const DEFAULT_FORM_VALUES = {
  limit: 10,
  sort: 0,
  enabled: true,
  timeRange: 7,
  tabIds: [],
};
