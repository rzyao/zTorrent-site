/**
 * 魔力值余额管理模块类型定义
 */

/** 用户魔力值余额模型 */
export interface UserBonusBalance {
  userId: string;
  username?: string;
  balance: string;
  lockedBalance: string;
  isFrozen: number; // 0: 正常, 1: 冻结
  updatedAt?: string;
}

/** 查询参数 */
export interface BonusBalanceQuery {
  page: number;
  limit: number;
  userId?: string;
  isFrozen?: number;
  min?: string;
  max?: string;
  sortBy?: "balance" | "lockedBalance" | "updatedAt";
  order?: "ASC" | "DESC";
}

/** 默认查询参数 */
export const DEFAULT_QUERY: BonusBalanceQuery = {
  page: 1,
  limit: 10,
  sortBy: "balance",
  order: "DESC",
};

/** 冻结状态选项 */
export const FROZEN_OPTIONS = [
  { label: "正常", value: "0" },
  { label: "已冻结", value: "1" },
] as const;

/** 排序字段选项 */
export const SORT_OPTIONS = [
  { label: "可用魔力", value: "balance" },
  { label: "预占魔力", value: "lockedBalance" },
  { label: "更新时间", value: "updatedAt" },
] as const;

/** 排序方向选项 */
export const ORDER_OPTIONS = [
  { label: "降序", value: "DESC" },
  { label: "升序", value: "ASC" },
] as const;
