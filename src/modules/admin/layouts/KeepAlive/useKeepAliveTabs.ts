import { useState, useEffect, useRef } from "react";
import { useLocation, useOutlet, useNavigate } from "react-router-dom";
import { RouteConfig } from "@/types/routeConfig";

export interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
  closable?: boolean;
  saved?: boolean; // 是否已保存（true=已保存，false=有未保存修改，undefined=默认已保存）
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

    // 检查当前路径是否是重定向路由
    const isRedirectRoute = routes.some((route) => {
      // 规范化路由路径（确保以 / 开头）
      const routePath = route.path.startsWith("/") ? route.path : `/${route.path}`;

      // 检查根路由
      if (routePath === path && route.redirect) {
        console.log("[useKeepAliveTabs] ✅ 检测到重定向路由:", path, "->", route.redirect);
        return true;
      }

      // 检查子路由
      if (route.children) {
        return route.children.some((child) => {
          const childPath = child.path.startsWith("/")
            ? child.path
            : `${routePath}/${child.path}`.replace(/\/+/g, "/");

          if (childPath === path && child.redirect) {
            console.log("[useKeepAliveTabs] ✅ 检测到子路由重定向:", path, "->", child.redirect);
            return true;
          }
          return false;
        });
      }
      return false;
    });

    console.log("[useKeepAliveTabs] 路径:", path, "是否重定向:", isRedirectRoute);

    // 如果是重定向路由，不创建标签页
    if (isRedirectRoute) {
      console.log("[useKeepAliveTabs] ⏭️  跳过重定向路由，不创建标签页");
      return;
    }

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
  }, [location.pathname, outlet, routes]);

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
      navigate("/admin/dashboard");
    }

    setItems(newItems);
  };

  /**
   * 批量删除标签页
   * @param targetKeys 要删除的标签页 key 数组
   */
  const removeTabs = (targetKeys: string[]) => {
    const keysSet = new Set(targetKeys);
    const newItems = items.filter((item) => !keysSet.has(item.key));

    // 如果当前激活的标签被删除，需要切换到其他标签
    if (keysSet.has(activeKey)) {
      if (newItems.length > 0) {
        const currentIndex = items.findIndex((item) => item.key === activeKey);
        const newIndex = Math.min(currentIndex, newItems.length - 1);
        navigate(newItems[newIndex].key);
      } else {
        navigate("/admin/dashboard");
      }
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

  /**
   * 设置标签页的保存状态
   * @param saved 是否已保存（true=已保存，false=有未保存修改）
   * @param path 标签页路径，默认为当前路径
   */
  const setTabSaved = (saved: boolean, path?: string) => {
    const targetPath = path || location.pathname;
    setItems((prev) => prev.map((item) => (item.key === targetPath ? { ...item, saved } : item)));
  };

  return {
    items,
    activeKey,
    onEdit,
    removeTabs, // 新增：批量删除方法
    handleTabClick,
    setTabSaved,
  };
};
