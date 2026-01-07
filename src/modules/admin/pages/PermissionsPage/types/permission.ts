export type PermissionType = 'api' | 'page' | 'button';
export type PermissionScope = 'admin' | 'web';

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

export interface Role {
  id: string;
  key?: string;
  name: string;
  description: string;
  permission_ids: string[];
  permissions_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface PaginationParams {
  page: number;
  page_size: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
