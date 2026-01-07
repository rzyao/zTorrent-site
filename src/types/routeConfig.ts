/**
 * 路由配置类型定义
 * 用于动态路由系统
 */

/**
 * 布局类型
 */
export type LayoutType = "app" | "admin" | "forum" | "none";

/**
 * 单个路由配置项
 */
export interface RouteConfig {
  /** 路由唯一标识 */
  id: string;
  /** 路由路径 */
  path: string;
  /** 组件注册表中的 key */
  component: string;
  /** 使用的布局类型 */
  layout?: LayoutType;
  /** 所需权限列表 */
  permissions?: string[];
  /** 子路由 */
  children?: RouteConfig[];
  /** 路由名称（用于面包屑/权限展示） */
  name?: string;
  /** 是否为索引路由 */
  index?: boolean;
  /** 重定向目标 */
  redirect?: string;
  /** 重定向是否在新标签页打开 */
  openInNewTab?: boolean;
  /** 是否在菜单中可见 */
  isVisible?: boolean;
  /** 是否启用(加载到路由表) */
  isEnabled?: boolean;
}

/**
 * 路由配置响应
 */
export interface RouteConfigResponse {
  routes: RouteConfig[];
}
