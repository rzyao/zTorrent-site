export type Theme = "light" | "dark";

export interface ThemeColors {
  // 基础布局
  pageBg: string;
  headerBg: string;
  borderColor: string;
  dividerColor: string;

  // 文本
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  usernameColor: string;
  titleColor: string;
  footerButtonText: string;
  footerButtonBg: string;

  // 头像
  avatarBorder: string;

  // 组件
  cardBg: string;
  cardHover: string;
  cardBorder: string;

  // 列表样式 (New)
  listBg: string;
  listHover: string;

  // 交互元素
  inputBg: string;
  inputBorder: string;
  buttonPrimary: string;
  buttonSecondary: string;
  buttonHover: string;

  // 强调色
  accentColor: string;
  accentHover: string;

  // 下拉菜单项
  menuItemActive: string;
  menuItemHover: string;

  // 特殊
  shadow: string;
}

export const themeConfig: Record<Theme, ThemeColors> = {
  light: {
    pageBg: "bg-gray-50",
    headerBg: "bg-white",
    borderColor: "border-gray-200",
    dividerColor: "border-gray-200",

    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    textMuted: "text-gray-500",
    usernameColor: "text-[#222]",
    titleColor: "text-gray-900",
    footerButtonText: "text-[#222]",
    footerButtonBg: "bg-neutral-200",

    avatarBorder: "border-gray-200",

    cardBg: "bg-white",
    // 浅色模式下卡片hover一般不需要变色，或者变一点点
    cardHover: "hover:shadow-md transition-shadow",
    cardBorder: "border-gray-200",

    listBg: "bg-white",
    listHover: "hover:bg-gray-50",

    inputBg: "bg-white",
    inputBorder: "border-gray-300",

    buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
    buttonSecondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    buttonHover: "hover:bg-gray-100",

    accentColor: "text-blue-600",
    accentHover: "hover:text-blue-600",

    menuItemActive: "bg-blue-50 text-blue-600",
    menuItemHover: "hover:bg-gray-100",

    shadow: "shadow-sm",
  },
  dark: {
    // 首页深色风格
    pageBg: "bg-[#111111]",
    headerBg: "bg-[#111111]",
    // pageBg: "bg-neutral-900",
    borderColor: "border-neutral-700/50",
    dividerColor: "border-neutral-600/60",

    textPrimary: "text-[#dadada]",
    textSecondary: "text-neutral-400",
    textMuted: "text-neutral-500",
    usernameColor: "text-[#bdbdbd]",
    titleColor: "text-[#DDDDDD]",
    footerButtonText: "text-[#dedede]",
    footerButtonBg: "bg-[#2C2C2c]",

    avatarBorder: "border-[#184d65]",

    // 玻璃拟态
    cardBg: "bg-neutral-800/40 backdrop-blur-md",
    cardHover: "hover:bg-neutral-800/60 transition-colors",
    cardBorder: "border-neutral-700/50",

    listBg: "bg-[#222222]",
    listHover: "hover:bg-neutral-800/50 transition-colors",

    inputBg: "bg-neutral-800",
    inputBorder: "border-neutral-700",

    // 琥珀金体系
    buttonPrimary: "bg-amber-500 hover:bg-amber-600 text-white",
    buttonSecondary: "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700",
    buttonHover: "hover:bg-neutral-800",

    accentColor: "text-amber-400",
    accentHover: "hover:text-amber-400",

    menuItemActive: "bg-[#31566c] text-amber-500",
    menuItemHover: "hover:bg-[#31566c]",

    shadow: "shadow-none",
  },
};
