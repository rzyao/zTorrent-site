import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ThemeSwitcher() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let theme = "app"; // Default theme

    if (path.startsWith("/admin")) {
      theme = "admin";
    } else if (path.startsWith("/forum")) {
      theme = "forum";
    }

    // Set theme on document root to allow global CSS variables (fixing Portals)
    document.documentElement.setAttribute("data-theme", theme);
  }, [location.pathname]);

  return null;
}
