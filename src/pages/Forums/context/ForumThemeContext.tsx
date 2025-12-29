import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Theme, themeConfig } from "../constants/theme";

interface ForumThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: (typeof themeConfig)["light"];
}

const ForumThemeContext = createContext<ForumThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "forum-theme-preference";

export function ForumThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    colors: themeConfig[theme],
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
