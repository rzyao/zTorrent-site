import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import { ListPunishmentRecordsDto } from "@/api/models/ListPunishmentRecordsDto";

/**
 * 处罚记录项类型
 */
export interface PunishmentRecord {
  id: string;
  userId?: string;
  userUsername?: string | null;
  type?: string;
  typeLabel?: string;
  reason?: string;
  reasonLabel?: string;
  detailReason?: string | null;
  durationDays?: number;
  startsAt?: string;
  expiresAt?: string;
  handlerId?: string;
  handlerUsername?: string | null;
  revoked?: boolean;
  revokeReason?: string | null;
  revokeReasonLabel?: string | null;
  revokeDetailReason?: string | null;
  sourcePunishmentId?: string | null;
  createdAt?: string;
  recordSource?: "active" | "history";
}

/**
 * 查询参数类型
 */
export interface PunishmentQuery {
  page: number;
  limit: number;
  userId?: string;
  type?: string;
  reason?: string;
  revoked?: boolean;
  active?: boolean;
  search?: string;
  sortBy?: ListPunishmentRecordsDto["sortBy"];
  order?: ListPunishmentRecordsDto["order"];
}

/**
 * 高级搜索字段类型
 */
export type AdvField =
  | "userId"
  | "type"
  | "reason"
  | "detailReason"
  | "durationDays"
  | "startsAt"
  | "expiresAt"
  | "handlerId"
  | "revoked"
  | "revokeReason"
  | "revokeDetailReason"
  | "sourcePunishmentId"
  | "createdAt";

/**
 * 高级搜索规则类型
 */
export interface AdvRule {
  field: AdvField;
  op: AdvancedRuleDto.op;
  value?: unknown;
  range?: [unknown, unknown];
}

/**
 * 默认查询参数
 */
export const DEFAULT_QUERY: PunishmentQuery = {
  page: 1,
  limit: 10,
};

/**
 * 下拉选项类型
 */
export interface SelectOption {
  label: string;
  value: string;
}
