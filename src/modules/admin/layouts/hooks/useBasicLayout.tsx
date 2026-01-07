import React from "react";
import { App } from "antd";
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
import { setMessageInstance } from "@/modules/admin/utils/globalMessage";
import { SECTION_NAME_MAP } from "../constants";
import { RAW_MENU_ITEMS, MENU_ICONS, type RawMenuItem } from "../constants/menuConfig";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

export function useBasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [refreshKey, setRefreshKey] = React.useState(0);

  // 注入 message 实例到全局工具
  React.useEffect(() => {
    setMessageInstance(message);
  }, [message]);

  const [site, setSite] = React.useState<{ title: string; logoUrl: string }>({
    title: "ztorrent-admin",
    logoUrl: logoUrlPath,
  });
  const [logoImgSrc, setLogoImgSrc] = React.useState<string>("");
  const [permissions, setPermissions] = React.useState<string[]>([]);
  const [username, setUsername] = React.useState<string>("");
  const [collapsed, setCollapsed] = React.useState(false);

  const path = location.pathname;
  // 移除 routes 导入，改为使用 RAW_MENU_ITEMS 计算
  const selectedKey = React.useMemo(() => {
    const findMatch = (items: RawMenuItem[]): string | undefined => {
      for (const item of items) {
        if (item.children) {
          const childMatch = findMatch(item.children);
          if (childMatch) return childMatch;
        }
        // 简单的前缀匹配，优先匹配更长的路径（如果需要更复杂的逻辑，可以后续优化）
        // 注意：这里假设 menuConfig 中的 path 不包含参数占位符，且是有效的前缀
        if (item.path && (path === item.path || path.startsWith(item.path + "/"))) {
          return item.key;
        }
      }
      return undefined;
    };

    // 为了找到“最佳”匹配（最长路径），最好先拍平再排序
    const flattenItems = (items: RawMenuItem[]): RawMenuItem[] => {
      let res: RawMenuItem[] = [];
      for (const item of items) {
        if (item.path) res.push(item);
        if (item.children) res = res.concat(flattenItems(item.children));
      }
      return res;
    };

    const all = flattenItems(RAW_MENU_ITEMS);
    // 降序排列，确保匹配到最长路径
    all.sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0));

    const matched = all.find(
      (item) => item.path && (path === item.path || path.startsWith(item.path + "/")),
    );
    return matched ? matched.key : "dashboard";
  }, [path]);

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
    message.success("已退出登录");
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

  // 菜单权限映射（从 RAW_MENU_ITEMS 提取）
  const menuPerms = React.useMemo(() => {
    const collect = (items: RawMenuItem[], acc: Record<string, string | undefined> = {}) => {
      for (const item of items) {
        if (item.key && item.perm) acc[item.key] = item.perm;
        if (item.children && item.children.length) collect(item.children, acc);
      }
      return acc;
    };
    return collect(RAW_MENU_ITEMS);
  }, []);

  /**
   * 构建 Ant Design Menu 的 items 数组
   * 优化点：
   * 1. 使用静态的 RAW_MENU_ITEMS 配置，避免每次渲染创建新对象
   * 2. 使用 onClick 导航代替 <Link> 组件，减少 React 元素开销
   * 3. icon 从预创建的 MENU_ICONS 映射获取，避免重复实例化
   */
  const menuItems = React.useMemo(() => {
    const isSuperAdmin = username === "admin";

    // 权限检查函数
    const can = (menuKey?: string, fallbackPerm?: string): boolean => {
      const required = menuPerms[menuKey || ""] ?? fallbackPerm;
      return isSuperAdmin || !required || permissions.includes(required);
    };

    /**
     * 将原始菜单配置转换为 Ant Design Menu 需要的格式
     * 使用 onClick 代替 <Link>，提升渲染性能
     */
    const transformItems = (items: RawMenuItem[]): MenuItem[] => {
      return items
        .filter((item) => can(item.key, item.perm))
        .map((item): MenuItem => {
          const hasChildren = item.children && item.children.length > 0;
          const filteredChildren = hasChildren ? transformItems(item.children!) : undefined;

          // 如果有子菜单但过滤后为空，则跳过该菜单项
          if (hasChildren && (!filteredChildren || filteredChildren.length === 0)) {
            return null;
          }

          return {
            key: item.key,
            icon: MENU_ICONS[item.key],
            label: item.label,
            children: filteredChildren,
            // 只有叶子节点（无子菜单且有 path）才添加点击事件
            onClick: !hasChildren && item.path ? () => navigate(item.path!) : undefined,
          };
        })
        .filter((item): item is MenuItem => item !== null);
    };

    return transformItems(RAW_MENU_ITEMS);
  }, [permissions, username, menuPerms, navigate]);

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
