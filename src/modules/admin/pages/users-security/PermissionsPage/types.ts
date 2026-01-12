export type PermissionType = "api" | "page" | "button";
export type PermissionScope = "admin" | "web";

export interface Permission {
  id: string;
  key: string; // 权限键，如：admin/users/create
  name: string;
  description?: string;
  type: PermissionType;
  scope: PermissionScope;
  parent_id?: string;
  children?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface PermissionsPageProps {
  /** 权限作用范围：web (网页端) 或 admin (后台管理) */
  scope: "admin" | "web";
  /** 页面标题 */
  title?: string;
}
