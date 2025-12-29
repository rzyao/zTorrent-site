export type Theme = "light" | "dark";

export interface ThemeColors {
  // 基础布局
  pageBg: string;
  borderColor: string;
  dividerColor: string;

  // 文本
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

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

  // 特殊
  shadow: string;
}

export const themeConfig: Record<Theme, ThemeColors> = {
  light: {
    pageBg: "bg-gray-50",
    borderColor: "border-gray-200",
    dividerColor: "border-gray-100",

    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    textMuted: "text-gray-500",

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

    shadow: "shadow-sm",
  },
  dark: {
    // 首页深色风格
    pageBg: "bg-[#0F171E]",
    // pageBg: "bg-neutral-900",
    borderColor: "border-neutral-700/50",
    dividerColor: "border-neutral-700/50",

    textPrimary: "text-white",
    textSecondary: "text-neutral-300",
    textMuted: "text-neutral-400",

    // 玻璃拟态
    cardBg: "bg-neutral-800/40 backdrop-blur-md",
    cardHover: "hover:bg-neutral-800/60 transition-colors",
    cardBorder: "border-neutral-700/50",

    listBg: "bg-neutral-800/40 backdrop-blur-md",
    listHover: "hover:bg-neutral-800/60 transition-colors",

    inputBg: "bg-neutral-800",
    inputBorder: "border-neutral-700",

    // 琥珀金体系
    buttonPrimary: "bg-amber-500 hover:bg-amber-600 text-white",
    buttonSecondary: "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700",
    buttonHover: "hover:bg-neutral-800",

    accentColor: "text-amber-400",
    accentHover: "hover:text-amber-400",

    shadow: "shadow-none",
  },
};
