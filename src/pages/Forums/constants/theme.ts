export type Theme = "light" | "dark";

export interface ThemeColors {
  // 基础布局
  pageBg: string; // 页面背景
  headerBg: string; // 头部背景
  borderColor: string; // 边框颜色
  dividerColor: string; // 分隔线颜色

  // 文本
  textPrimary: string; // 主文本
  textSecondary: string; // 次级文本
  textMuted: string; // 弱化文本
  usernameColor: string; // 用户名颜色
  titleColor: string; // 标题颜色
  footerButtonText: string; // 底部按钮文本
  footerButtonBg: string; // 底部按钮背景

  // 头像
  avatarBorder: string; // 头像边框

  // 组件
  cardBg: string; // 卡片背景
  cardHover: string; // 卡片悬停
  cardBorder: string; // 卡片边框

  // 列表样式
  listBg: string; // 列表背景
  listHover: string; // 列表悬停

  // 交互元素
  inputBg: string; // 输入框背景
  inputBorder: string; // 输入框边框
  buttonPrimary: string; // 主按钮
  buttonSecondary: string; // 次按钮
  buttonHover: string; // 按钮悬停

  // 强调色
  accentColor: string; // 强调色文本
  accentHover: string; // 强调色悬停

  // 下拉菜单项
  menuItemActive: string; // 菜单激活项
  menuItemHover: string; // 菜单悬停项

  // 特殊
  shadow: string; // 阴影

  // 滚动条 (New)
  scrollbarMain: string;
  scrollbarSidebar: string;

  // 导航/筛选状态
  navItemActive: string; // 导航项激活态
  navItemInactive: string; // 导航项非激活态
}

/**
 * 统一的主题配置
 * 使用 Tailwind CSS 的 dark: 前缀来实现暗黑模式自动切换
 * 不再需要在 JS 中判断 theme === 'dark'
 */
export const FORUM_THEME: ThemeColors = {
  // 基础布局
  headerBg: "bg-white dark:bg-[#111111]",
  pageBg: "bg-white dark:bg-[#222222]",
  borderColor: "border-gray-200 dark:border-neutral-700/50",
  dividerColor: "border-gray-200 dark:border-neutral-600/60",

  // 文本
  textPrimary: "text-gray-900 dark:text-[#dadada]",
  textSecondary: "text-gray-600 dark:text-neutral-400",
  textMuted: "text-gray-500 dark:text-neutral-500",
  usernameColor: "text-[#222] dark:text-[#bdbdbd]",
  titleColor: "text-gray-900 dark:text-[#DDDDDD]",
  footerButtonText: "text-[#222] dark:text-[#dedede]",
  footerButtonBg: "bg-neutral-200 dark:bg-[#2C2C2c]",

  // 头像
  avatarBorder: "border-gray-200 dark:border-[#184d65]",

  // 组件
  cardBg: "bg-white dark:bg-neutral-800/40 dark:backdrop-blur-md",
  cardHover: "hover:shadow-md dark:hover:bg-neutral-800/60",
  cardBorder: "border-gray-200 dark:border-neutral-700/50",

  // 列表样式
  listBg: "bg-white dark:bg-[#222222]",
  listHover: "hover:bg-gray-50 dark:hover:bg-neutral-800/50",

  // 交互元素
  inputBg: "bg-white dark:bg-neutral-800",
  inputBorder: "border-gray-300 dark:border-neutral-700",
  buttonPrimary:
    "bg-[#0088CC] hover:bg-[#007bb5] text-white dark:bg-amber-500 dark:hover:bg-amber-600",
  buttonSecondary:
    "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:border dark:border-neutral-700",
  buttonHover: "hover:bg-gray-100 dark:hover:bg-[#333333]",

  // 强调色
  accentColor: "text-blue-600 dark:text-amber-400",
  accentHover: "hover:text-blue-600 dark:hover:text-amber-400",

  // 下拉菜单项
  menuItemActive: "bg-blue-50 text-blue-600 dark:bg-[#31566c] dark:text-amber-500",
  menuItemHover: "hover:bg-gray-100 dark:hover:bg-[#31566c]",

  // 特殊
  shadow: "shadow-sm dark:shadow-none",

  // 滚动条
  scrollbarMain: "scrollbar-main",
  scrollbarSidebar: "scrollbar-sidebar",

  // 导航/筛选状态
  navItemActive: "bg-blue-50 text-blue-600 dark:bg-amber-500/10 dark:text-amber-500",
  navItemInactive:
    "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
};

// 保持向下兼容，但建议尽快迁移到 FORUM_THEME
export const themeConfig = {
  light: FORUM_THEME,
  dark: FORUM_THEME,
};
