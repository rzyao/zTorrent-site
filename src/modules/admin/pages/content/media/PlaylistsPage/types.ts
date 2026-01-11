/**
 * 片单管理模块类型定义
 */

/** 片单类型枚举 */
export type PlaylistType = "general" | "topic" | "series" | "director" | "curation";

/** 可见性枚举 */
export type PlaylistVisibility = "public" | "private" | "friends";

/** 审核状态枚举 */
export type ApprovalStatus = "pending" | "approved" | "rejected";

/** 片单列表项类型 */
export interface PlaylistItem {
  id: string;
  title?: string;
  coverUrl?: string;
  type?: PlaylistType;
  visibility?: PlaylistVisibility;
  views?: number;
  likes?: number;
  enabled?: boolean;
  sort?: number;
  updatedAt?: string;
  approvalStatus?: ApprovalStatus;
  approvedAt?: string;
}

/** 查询参数类型 */
export interface PlaylistQuery {
  page: number;
  limit: number;
  keyword?: string;
  type?: PlaylistType;
  visibility?: PlaylistVisibility;
  ownerUserId?: string;
  approvalStatus?: ApprovalStatus;
}

/** 默认查询参数 */
export const DEFAULT_QUERY: PlaylistQuery = {
  page: 1,
  limit: 10,
};

/** 类型选项常量 */
export const TYPE_OPTIONS = [
  { label: "通用", value: "general" },
  { label: "专题", value: "topic" },
  { label: "系列", value: "series" },
  { label: "导演", value: "director" },
  { label: "策展", value: "curation" },
] as const;

/** 可见性选项常量 */
export const VISIBILITY_OPTIONS = [
  { label: "公开", value: "public" },
  { label: "私密", value: "private" },
  { label: "好友", value: "friends" },
] as const;

/** 审核状态选项常量 */
export const APPROVAL_STATUS_OPTIONS = [
  { label: "待审", value: "pending" },
  { label: "通过", value: "approved" },
  { label: "驳回", value: "rejected" },
] as const;

/** 审核状态颜色映射 */
export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, "green" | "red" | "gold"> = {
  approved: "green",
  rejected: "red",
  pending: "gold",
};
