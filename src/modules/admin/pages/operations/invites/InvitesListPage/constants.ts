import type { InviteStatus, InviteType } from "./types";

/**
 * 邀请状态选项
 */
export const STATUS_OPTIONS = [
  { label: "已发送", value: "sent" },
  { label: "已接受", value: "accepted" },
  { label: "已过期", value: "expired" },
  { label: "已撤销", value: "revoked" },
];

/**
 * 邀请类型选项
 */
export const TYPE_OPTIONS = [
  { label: "私人邀请", value: "private-invitation" },
  { label: "官方邀请", value: "office-invitation" },
];

/**
 * 状态颜色映射
 */
export const STATUS_COLOR_MAP: Record<InviteStatus, [string, string]> = {
  sent: ["blue", "已发送"],
  accepted: ["green", "已接受"],
  expired: ["orange", "已过期"],
  revoked: ["red", "已撤销"],
};

/**
 * 类型颜色映射
 */
export const TYPE_COLOR_MAP: Record<InviteType, [string, string]> = {
  "private-invitation": ["purple", "私人邀请"],
  "office-invitation": ["gold", "官方邀请"],
};
