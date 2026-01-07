export type SettingType =
  | "string"
  | "number"
  | "boolean"
  | "json"
  | "datetime"
  | "password"
  | "rate";

export type SettingGroup =
  | "site"
  | "tracker"
  | "register"
  | "invite"
  | "download"
  | "bonus"
  | "hr"
  | "mail"
  | "security"
  | "logging"
  | "audit"
  | "oauth"
  | "legal"
  | "review"
  | "rate_limit";

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: SettingType;
  group: SettingGroup;
  description?: string;
  mutable: boolean;
  sort?: number;
  json_schema?: string;
  updated_by?: string;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export interface SettingGroupInfo {
  key: SettingGroup;
  name: string;
  description: string;
  icon?: string;
}
