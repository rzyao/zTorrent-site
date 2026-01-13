import { useState, useEffect, useRef } from "react";
import { useLocation, useOutlet, useNavigate } from "react-router-dom";
import { RouteConfig } from "@/types/routeConfig";

export interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
  closable?: boolean;
}

export const useKeepAliveTabs = (routes: RouteConfig[] = []) => {
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const [items, setItems] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState("");

  const pathNameMap = useRef<Record<string, string>>({});

  // 1. Flatten routes to build path -> name map
  useEffect(() => {
    const map: Record<string, string> = { "/": "首页" };
    const traverse = (items: any[], parentPath = "") => {
      items.forEach((item) => {
        const fullPath = item.path.startsWith("/")
          ? item.path
          : `${parentPath}/${item.path}`.replace(/\/+/g, "/");

        if (item.name) {
          map[fullPath] = item.name;
        }

        if (item.children) {
          traverse(item.children, fullPath);
        }
      });
    };

    if (routes.length > 0) {
      traverse(routes);
    }
    pathNameMap.current = map;

    // Update existing items label if new config loaded or language/name changed
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        label: map[item.key] || item.label,
      })),
    );
  }, [routes]);

  // 2. Helper to get page title
  const getPageTitle = (pathname: string) => {
    if (pathNameMap.current[pathname]) return pathNameMap.current[pathname];
    // Fallback: extract from path
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : "首页";
  };

  // 3. Listen to location change and add/update tabs
  useEffect(() => {
    const path = location.pathname;
    setActiveKey(path);

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === path);
      if (existingIndex !== -1) {
        // Update children of existing tab (to keep content fresh if needed, though usually kept alive)
        // Note: For true KeepAlive, we might NOT want to always replace children if it destroys state.
        // But with this simple implementation, we update the outlet content.
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          label: getPageTitle(path), // Also refresh label in case map updated later
          children: outlet,
        };
        return updated;
      }

      // Add new tab
      return [
        ...prev,
        {
          key: path,
          label: getPageTitle(path),
          children: outlet,
          closable: path !== "/",
        },
      ];
    });
  }, [location.pathname, outlet]);

  const removeTab = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;

    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    const newItems = items.filter((item) => item.key !== targetKey);

    if (newItems.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newItems[lastIndex].key;
      } else {
        newActiveKey = newItems[0].key;
      }
      navigate(newActiveKey);
    } else if (newItems.length === 0) {
      navigate("/");
    }

    setItems(newItems);
  };

  const onEdit = (targetKey: string, action: "add" | "remove") => {
    if (action === "remove") {
      removeTab(targetKey);
    }
  };

  const handleTabClick = (key: string) => {
    navigate(key);
  };

  return {
    items,
    activeKey,
    onEdit,
    handleTabClick,
  };
};
