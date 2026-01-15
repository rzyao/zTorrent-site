import { createContext, useContext, useEffect, useLayoutEffect, useState, ReactNode } from "react";
import { Theme, themeConfig } from "../constants/theme";

interface ForumThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: (typeof themeConfig)["light"];
}

const ForumThemeContext = createContext<ForumThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "forum-theme-preference";

export function ForumThemeProvider({
  children,
  forceTheme,
}: {
  children: ReactNode;
  forceTheme?: Theme;
}) {
  const [themeState, setThemeState] = useState<Theme>(() => {
    // 这是一个惰性初始化函数，只在首次渲染时运行
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "dark";
  });

  // 如果提供了 forceTheme，优先使用它
  const activeTheme = forceTheme || themeState;

  // 同步更新 html 元素的 class
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", activeTheme === "dark");
  }, [activeTheme]);

  const toggleTheme = () => {
    if (forceTheme) return; // 如果是强制模式，禁止切换
    setThemeState((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      return newTheme;
    });
  };

  const value = {
    theme: activeTheme,
    toggleTheme,
    colors: themeConfig[activeTheme],
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
