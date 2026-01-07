/**
 * 导航设置页面常量定义
 */

/**
 * 角色下拉选项
 */
export const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
  { label: "System", value: "system" },
] as const;

/**
 * 平台 Tab 配置
 */
export const PLATFORM_TABS = [
  { label: "Desktop Navigation", key: "desktop" },
  { label: "Mobile Navigation", key: "mobile" },
] as const;

/**
 * 平台类型
 */
export type PlatformType = "desktop" | "mobile";
