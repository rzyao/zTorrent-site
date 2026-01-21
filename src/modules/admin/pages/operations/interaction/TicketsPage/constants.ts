/**
 * 工单相关常量映射
 */

export const statusText: Record<string, string> = {
  pending: "待处理",
  processing: "处理中",
  resolved: "已解决",
  closed: "已关闭",
};

export const statusColor: Record<string, string> = {
  pending: "blue",
  processing: "orange",
  resolved: "green",
  closed: "default",
};

export const statusOptions = [
  { value: "pending", label: statusText.pending },
  { value: "processing", label: statusText.processing },
  { value: "resolved", label: statusText.resolved },
  { value: "closed", label: statusText.closed },
];

/** 工单类别映射 */
export const categoryText: Record<string, string> = {
  technical: "技术问题",
  account: "账号问题",
  resource: "资源问题",
  report: "举报投诉",
  other: "其他",
};

export const categoryOptions = [
  { value: "technical", label: categoryText.technical },
  { value: "account", label: categoryText.account },
  { value: "resource", label: categoryText.resource },
  { value: "report", label: categoryText.report },
  { value: "other", label: categoryText.other },
];

/** 优先级映射 */
export const priorityText: Record<string, string> = {
  low: "低",
  normal: "普通",
  high: "高",
  urgent: "紧急",
};

export const priorityColor: Record<string, string> = {
  low: "default",
  normal: "blue",
  high: "orange",
  urgent: "red",
};

export const priorityOptions = [
  { value: "low", label: priorityText.low },
  { value: "normal", label: priorityText.normal },
  { value: "high", label: priorityText.high },
  { value: "urgent", label: priorityText.urgent },
];
