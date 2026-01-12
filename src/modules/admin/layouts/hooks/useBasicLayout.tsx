import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "@/api/services/AuthService";
import { SettingsService } from "@/api/services/SettingsService";
import {
  setFavicon,
  setFaviconFromSvg,
  buildTitle,
  getPageNameByPath,
} from "@/modules/admin/utils/tabTitle";
import logoSvgContent from "@/assets/logo.svg?raw";
import logoUrlPath from "@/assets/logo.svg";
import { SECTION_NAME_MAP } from "../constants";
import { toast } from "sonner";
import { useRouteConfig } from "@/hooks/useRouteConfig";
import DynamicIcon from "@/modules/admin/components/DynamicIcon";
import type { MenuProps } from "antd";
import type { RouteConfig } from "@/types/routeConfig";

type MenuItem = Required<MenuProps>["items"][number];

// Admin 模块的基础路径前缀
const ADMIN_BASE_PATH = "/admin";

/**
 * 从动态路由配置中提取 Admin 模块的子路由
 */
function findAdminRoutes(routes: RouteConfig[]): RouteConfig[] {
  for (const route of routes) {
    if (route.layout === "admin" || route.path === "admin") {
      return route.children || [];
    }
  }
  return [];
}

/**
 * 将动态路由配置转换为菜单项格式
 */
interface DynamicMenuItem {
  key: string;
  label: string;
  path?: string;
  permissions?: string[];
  icon?: string; // 动态图标名称
  children?: DynamicMenuItem[];
}

function routeToMenuItem(route: RouteConfig, parentPath: string = ""): DynamicMenuItem | null {
  // 只有 isVisible 的路由才显示在菜单中
  if (route.isVisible === false) {
    return null;
  }

  // 构建相对路径（用于菜单配置）
  const relativePath = route.index
    ? parentPath || "/"
    : parentPath
      ? `${parentPath}/${route.path}`
      : `/${route.path}`;

  const children = route.children
    ?.map((child) => routeToMenuItem(child, relativePath))
    .filter((item): item is DynamicMenuItem => item !== null);

  return {
    key: route.id,
    label: route.name || route.path,
    path: relativePath,
    permissions: route.permissions,
    icon: route.icon, // 传递动态图标
    children: children && children.length > 0 ? children : undefined,
  };
}

export function useBasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [refreshKey, setRefreshKey] = React.useState(0);

  // 从动态路由获取配置
  const { routes: dynamicRoutes } = useRouteConfig();

  const [site, setSite] = React.useState<{ title: string; logoUrl: string }>({
    title: "ztorrent-admin",
    logoUrl: logoUrlPath,
  });
  const [logoImgSrc, setLogoImgSrc] = React.useState<string>("");
  const [permissions, setPermissions] = React.useState<string[]>([]);
  const [username, setUsername] = React.useState<string>("");
  const [collapsed, setCollapsed] = React.useState(false);

  const path = location.pathname;

  // 将当前路径转换为相对路径（移除 /admin 前缀）用于菜单匹配
  const relativePath = React.useMemo(() => {
    if (path.startsWith(ADMIN_BASE_PATH)) {
      const rel = path.slice(ADMIN_BASE_PATH.length);
      return rel === "" ? "/" : rel;
    }
    return path;
  }, [path]);

  // 从动态路由中提取 Admin 菜单配置
  const dynamicMenuItems = React.useMemo((): DynamicMenuItem[] => {
    const adminRoutes = findAdminRoutes(dynamicRoutes);
    return adminRoutes
      .map((route) => routeToMenuItem(route, ""))
      .filter((item): item is DynamicMenuItem => item !== null);
  }, [dynamicRoutes]);

  // 计算选中的菜单项 key
  const selectedKey = React.useMemo(() => {
    // 拍平所有菜单项
    const flattenItems = (items: DynamicMenuItem[]): DynamicMenuItem[] => {
      let res: DynamicMenuItem[] = [];
      for (const item of items) {
        if (item.path) res.push(item);
        if (item.children) res = res.concat(flattenItems(item.children));
      }
      return res;
    };

    const all = flattenItems(dynamicMenuItems);
    // 降序排列，确保匹配到最长路径
    all.sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0));

    // 使用相对路径进行匹配
    const matched = all.find(
      (item) =>
        item.path && (relativePath === item.path || relativePath.startsWith(item.path + "/")),
    );
    return matched ? matched.key : "";
  }, [relativePath, dynamicMenuItems]);

  const matchedKey = Object.keys(SECTION_NAME_MAP).find((k) => path.startsWith(k)) || "/";
  const sectionName = SECTION_NAME_MAP[matchedKey];

  // 首次加载：从系统配置接口读取站点信息并设置 favicon
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await SettingsService.settingsControllerListSettingsByGroup({
          group: "site",
        });
        const items = (resp as any)?.data ?? [];
        const get = (k: string) =>
          items.find((it: any) => it?.key === k)?.value?.toString?.() ?? "";
        const title = get("site.title") || site.title;

        const logoSvg = logoSvgContent;
        const logoUrl = logoUrlPath;

        if (!mounted) return;
        setSite({ title, logoUrl });
        if (logoSvg && logoSvg.trim()) {
          setFaviconFromSvg(logoSvg);
          setLogoImgSrc(logoUrl);
        } else {
          setFavicon(logoUrl);
          setLogoImgSrc(logoUrl);
        }
      } catch (err) {
        setFavicon(site.logoUrl);
        setLogoImgSrc(site.logoUrl);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 路由变化：更新 document.title
  React.useEffect(() => {
    const pageName = getPageNameByPath(location.pathname, SECTION_NAME_MAP);
    document.title = buildTitle(site.title, pageName);
  }, [location.pathname, site]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch {}
    toast.success("已退出登录");
    navigate("/login", { replace: true });
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  // 获取用户权限
  React.useEffect(() => {
    let mounted = true;

    try {
      const rawPerms = localStorage.getItem("permissions");
      const rawUser = localStorage.getItem("username");
      if (rawPerms) setPermissions(JSON.parse(rawPerms));
      if (rawUser) setUsername(rawUser);
    } catch {}

    AuthService.authLoginControllerProfilePost({})
      .then((res: any) => {
        if (!mounted) return;
        const perms = Array.isArray(res?.data?.permissions)
          ? (res!.data!.permissions as string[])
          : [];
        const roles = Array.isArray(res?.data?.roles) ? (res!.data!.roles as string[]) : [];
        const uname = String(
          (res as any)?.data?.user?.username || (res as any)?.data?.user?.name || "",
        );

        setPermissions(perms);
        setUsername(uname);

        try {
          localStorage.setItem("permissions", JSON.stringify(perms));
          localStorage.setItem("roles", JSON.stringify(roles));
          if (uname) localStorage.setItem("username", uname);
        } catch {}
      })
      .catch((err: any) => {
        console.warn("加载用户资料失败", err?.message || err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * 构建 Ant Design Menu 的 items 数组
   * 从动态路由配置生成，支持权限过滤
   */
  const menuItems = React.useMemo(() => {
    const isSuperAdmin = username === "admin";

    // 权限检查函数
    const can = (itemPermissions?: string[]): boolean => {
      if (isSuperAdmin) return true;
      if (!itemPermissions || itemPermissions.length === 0) return true;
      return itemPermissions.some((perm) => permissions.includes(perm));
    };

    /**
     * 将动态菜单配置转换为 Ant Design Menu 需要的格式
     */
    const transformItems = (items: DynamicMenuItem[]): MenuItem[] => {
      return items
        .filter((item) => can(item.permissions))
        .map((item): MenuItem => {
          const hasChildren = item.children && item.children.length > 0;
          const filteredChildren = hasChildren ? transformItems(item.children!) : undefined;

          // 如果有子菜单但过滤后为空，则跳过该菜单项
          if (hasChildren && (!filteredChildren || filteredChildren.length === 0)) {
            return null;
          }

          // 构建实际导航路径：菜单配置的 path 是相对路径，需要加上 /admin 前缀
          const fullPath = item.path
            ? item.path === "/"
              ? ADMIN_BASE_PATH
              : `${ADMIN_BASE_PATH}${item.path}`
            : undefined;

          return {
            key: item.key,
            icon: item.icon ? <DynamicIcon iconName={item.icon} size={16} /> : null,
            label: item.label,
            children: filteredChildren,
            // 只有叶子节点（无子菜单且有 path）才添加点击事件
            onClick: !hasChildren && fullPath ? () => navigate(fullPath) : undefined,
          };
        })
        .filter((item): item is MenuItem => item !== null);
    };

    return transformItems(dynamicMenuItems);
  }, [permissions, username, dynamicMenuItems, navigate]);

  return {
    site,
    logoImgSrc,
    collapsed,
    setCollapsed,
    selectedKey,
    menuItems,
    sectionName,
    refreshKey,
    handleRefresh,
    handleLogout,
  };
}
