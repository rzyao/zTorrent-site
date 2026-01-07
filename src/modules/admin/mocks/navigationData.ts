import type { NavigationItem } from '@/types/navigation';

export const mockNavigationData: NavigationItem[] = [
  {
    id: '1',
    platform: 'desktop',
    label: 'Dashboard',
    path: '/dashboard',
    permissions: [],
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: '2',
    platform: 'desktop',
    label: 'Torrents',
    path: '/torrents',
    permissions: ['user'],
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: '3',
    platform: 'desktop',
    label: 'Admin',
    path: '/admin',
    permissions: ['admin'],
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: '4',
    platform: 'mobile',
    label: 'Home',
    path: '/dashboard',
    permissions: [],
    sortOrder: 1,
    isVisible: true,
  },
];
