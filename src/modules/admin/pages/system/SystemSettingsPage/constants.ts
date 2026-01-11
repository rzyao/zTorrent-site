import type { SettingGroupInfo, SettingType } from "./types";

/**
 * 静态分组元信息：用于左侧分组导航与文案说明
 * 使用约定：
 * - `key` 必须与后端设置键的前缀保持一致（如 `site.xxx` → `site`），用于构建分组筛选与徽标统计
 */
export const GROUP_INFO: SettingGroupInfo[] = [
  {
    key: "site",
    name: "站点基础",
    description: "站点名称、域名、联系方式等基础信息",
  },
  {
    key: "tracker",
    name: "Tracker 配置",
    description: "Tracker announce 地址、协议参数等核心配置",
  },
  {
    key: "register",
    name: "注册配置",
    description: "注册、邀请、密码策略等认证相关配置",
  },
  { key: "invite", name: "邀请配置", description: "邀请注册相关配置" },
  { key: "rate_limit", name: "限流配置", description: "限流策略配置" },
  {
    key: "mail",
    name: "邮件配置",
    description: "SMTP 服务器、邮件模板等邮件系统配置",
  },
  {
    key: "security",
    name: "安全配置",
    description: "IP 黑名单、CSRF、限流等安全策略配置",
  },
  {
    key: "bonus",
    name: "魔力系统",
    description: "魔力值获得、兑换等魔力系统配置",
  },
  { key: "hr", name: "HR 考核", description: "Hit and Run 检测与处罚规则配置" },
  {
    key: "review",
    name: "审核设置",
    description: "种子、影片、片单等审核相关配置",
  },
  {
    key: "download",
    name: "下载设置",
    description: "并发下载限制等下载相关配置",
  },
  {
    key: "logging",
    name: "日志配置",
    description: "日志级别、输出目标等日志系统配置",
  },
  {
    key: "audit",
    name: "审计配置",
    description: "审计开关、保留期限等审计系统配置",
  },
  { key: "oauth", name: "OAuth", description: "第三方登录提供者配置" },
  {
    key: "legal",
    name: "法务信息",
    description: "服务条款、隐私政策、DMCA 等法务相关配置",
  },
];

/** 设置类型枚举：用于创建表单类型选择 */
export const SETTING_TYPES: SettingType[] = [
  "string",
  "number",
  "boolean",
  "json",
  "datetime",
  "password",
  "rate",
];
