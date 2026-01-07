import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";

export type AdvField =
  | "username"
  | "email"
  | "status"
  | "level"
  | "isVip"
  | "vipLevel"
  | "hasDownloadPermission"
  | "lastLoginAt"
  | "createdAt"
  | "lastVisitAt"
  | "lastLoginIp"
  | "roles"
  | "permissions"
  | "passkey";

export type AdvRule = {
  field: AdvField;
  op: AdvancedRuleDto.op;
  value?: any;
  range?: [any, any];
};
