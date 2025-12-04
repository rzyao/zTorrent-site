// 控制台页面的类型定义
// 说明：集中管理各板块的数据结构与枚举，便于跨组件复用与维护

// Tab 类型枚举（与左侧菜单对应）
export type TabType = 'profile' | 'preferences' | 'security' | 'notifications' | 'privacy';

// 个人信息类型
export interface ProfileData {
  username: string;
  avatar: string;
  signature: string;
  location: string;
  bio: string;
}

// 网站偏好类型
export interface PreferencesData {
  language: string;
  theme: string;
  defaultView: 'grid' | 'list';
}

// 安全设置类型
export interface SecurityData {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  trustedDevices: number;
}

// 通知设置类型
export interface NotificationsData {
  emailNotifications: boolean;
  torrentComments: boolean;
  privateMessages: boolean;
  systemAnnouncements: boolean;
  downloadComplete: boolean;
  ratioWarnings: boolean;
}

// 隐私设置类型
export interface PrivacyData {
  showProfile: boolean;
  showStats: boolean;
  allowMessages: boolean;
  showOnlineStatus: boolean;
}

// 分类选项类型（用于多选组件）
export interface KeyLabelOption {
  key: string;
  label: string;
}

