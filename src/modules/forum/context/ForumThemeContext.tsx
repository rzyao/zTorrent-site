import { createContext, useContext, useEffect, useLayoutEffect, useState, ReactNode } from "react";
import { Theme, themeConfig } from "../constants/theme";

interface ForumThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: (typeof themeConfig)["light"];
}

const ForumThemeContext = createContext<ForumThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "forum-theme-preference";

export function ForumThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 这是一个惰性初始化函数，只在首次渲染时运行
    // 我们可以直接在这里读取 localStorage，避免 useEffect 导致的二次渲染（闪烁）
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      // 如果没有保存的主题，跟随系统偏好 (System Preference)
      // 这与 index.html 中的阻塞脚本逻辑保持一致
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    // 默认回退到浅色 (Light) - 如果系统是浅色或无法判断
    return "light";
  });

  // 同步更新 html 元素的 class，使 Tailwind 的 dark: 前缀生效
  // 使用 useLayoutEffect 确保在浏览器绘制前样式已就绪，消除切换时的闪烁/延迟
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      return newTheme;
    });
  };

  const value = {
    theme,
    toggleTheme,
    colors: themeConfig[theme], // themeConfig[theme] 现在指向同一个对象 FORUM_THEME
  };

  return <ForumThemeContext.Provider value={value}>{children}</ForumThemeContext.Provider>;
}

export function useForumTheme() {
  const context = useContext(ForumThemeContext);
  if (context === undefined) {
    throw new Error("useForumTheme must be used within a ForumThemeProvider");
  }
  return context;
}
