export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  platform: 'desktop' | 'mobile';
  parentId?: string | null;
  sortOrder: number;
  isVisible: boolean;
  target?: '_self' | '_blank';
  requiredRoles?: string[];
  children?: NavigationItem[];
}

export interface NavigationResponse {
  desktop: NavigationItem[];
  mobile: NavigationItem[];
}
