import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";

export type RecordItem = {
  id?: string;
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
};

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

export type AdvRule = {
  field: AdvField;
  op: AdvancedRuleDto.op;
  value?: any;
  range?: [any, any];
};
