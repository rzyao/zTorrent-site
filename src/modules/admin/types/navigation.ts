export interface NavigationItem {
  id: string;
  platform: 'desktop' | 'mobile'; // Enum based on PRD/Plan usually
  label: string;
  path: string;
  permissions: string[]; // 权限标识列表
  sortOrder: number;
  isVisible: boolean;
  parentId?: string | null;
  icon?: string;
  children?: NavigationItem[];
}
