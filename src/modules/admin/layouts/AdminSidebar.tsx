import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { useRouteConfig, RouteItem } from "@/hooks/useRouteConfig";
import DynamicIcon from "@/modules/admin/components/DynamicIcon";

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

interface MenuItemProps {
  item: RouteItem;
  parentPath: string;
  depth: number;
  collapsed: boolean;
  expandedMenus: Set<string>;
  toggleMenu: (id: string) => void;
  location: ReturnType<typeof useLocation>;
}

/**
 * 递归检查当前路径是否在某个菜单项或其子孙项中
 */
function isPathActiveInTree(item: RouteItem, parentPath: string, currentPath: string): boolean {
  const itemPath = item.path.startsWith("/") ? item.path : `${parentPath}/${item.path}`;
  const normalizedPath = itemPath.replace(/\/+/g, "/");

  // 精确匹配当前项
  if (currentPath === normalizedPath) {
    return true;
  }

  // 递归检查子项
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => isPathActiveInTree(child, normalizedPath, currentPath));
  }

  return false;
}

/**
 * 递归菜单项组件 - 支持无限嵌套
 */
function MenuItem({
  item,
  parentPath,
  depth,
  collapsed,
  expandedMenus,
  toggleMenu,
  location,
}: MenuItemProps) {
  const iconName = (item as any).icon as string | undefined;
  const href = (item.path.startsWith("/") ? item.path : `${parentPath}/${item.path}`).replace(
    /\/+/g,
    "/",
  );
  const hasChildren =
    item.children && item.children.filter((c) => c.isVisible !== false).length > 0;
  const isExpanded = expandedMenus.has(item.id);

  // 检查当前项或其子孙项是否激活
  const isActive = location.pathname === href;
  const isChildActive = hasChildren && isPathActiveInTree(item, parentPath, location.pathname);
  const isParentActive = isChildActive && !isActive;

  // 缩进样式（根据深度调整）
  const indentClass = depth > 0 ? "ml-4 border-l border-gray-100 pl-4" : "";

  // 带子菜单的项目
  if (hasChildren) {
    return (
      <div className={cn(depth > 0 && "mt-1", indentClass)}>
        <button
          onClick={() => toggleMenu(item.id)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50",
            isActive || isParentActive ? "text-admin-primary" : "text-gray-600",
            collapsed && "justify-center px-2",
          )}
        >
          <div className="flex items-center gap-3">
            {iconName && (
              <DynamicIcon
                iconName={iconName}
                size={depth === 0 ? 18 : 16}
                className={isActive || isParentActive ? "text-admin-primary" : "text-gray-400"}
              />
            )}
            {!collapsed && (
              <span className={isActive || isParentActive ? "text-admin-primary" : "text-gray-600"}>
                {item.name || item.path}
              </span>
            )}
          </div>
          {!collapsed && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isActive || isParentActive ? "text-admin-primary" : "text-gray-400",
                isExpanded && "rotate-180",
              )}
            />
          )}
        </button>
        {/* 递归渲染子菜单 */}
        {isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children
              ?.filter((c) => c.isVisible !== false)
              .map((child) => (
                <MenuItem
                  key={child.id}
                  item={child}
                  parentPath={href}
                  depth={depth + 1}
                  collapsed={collapsed}
                  expandedMenus={expandedMenus}
                  toggleMenu={toggleMenu}
                  location={location}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  // 普通菜单项（无子菜单）
  return (
    <div className={cn(depth > 0 && "mt-1", indentClass)}>
      <NavLink
        to={href}
        end
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm no-underline transition-colors hover:bg-gray-50",
          isActive ? "text-admin-primary font-medium" : "text-gray-500",
          collapsed && "justify-center px-2",
        )}
      >
        {iconName && (
          <DynamicIcon
            iconName={iconName}
            size={depth === 0 ? 18 : 16}
            className={isActive ? "text-admin-primary" : "text-gray-400"}
          />
        )}
        {!collapsed && <span>{item.name || item.path}</span>}
      </NavLink>
    </div>
  );
}

export function AdminSidebar({ collapsed, onCollapse }: AdminSidebarProps) {
  const { routes } = useRouteConfig();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const location = useLocation();

  const adminRoute = routes.find((r) => r.path === "/admin" || r.path === "admin");
  const adminChildren = adminRoute?.children || [];
  const visibleRoutes = adminChildren.filter((r) => r.isVisible !== false);

  /**
   * 递归查找需要展开的菜单 ID 列表
   */
  const findExpandedIds = useMemo(() => {
    const result: string[] = [];

    function traverse(items: RouteItem[], parentPath: string): boolean {
      for (const item of items) {
        const itemPath = item.path.startsWith("/") ? item.path : `${parentPath}/${item.path}`;
        const normalizedPath = itemPath.replace(/\/+/g, "/");

        if (item.children && item.children.length > 0) {
          const childActive = traverse(item.children, normalizedPath);
          if (childActive) {
            result.push(item.id);
            return true;
          }
        }

        if (
          location.pathname === normalizedPath ||
          location.pathname.startsWith(normalizedPath + "/")
        ) {
          return true;
        }
      }
      return false;
    }

    traverse(visibleRoutes, "/admin");
    return result;
  }, [location.pathname, visibleRoutes]);

  // 自动展开逻辑：当路径变化时，确保所有祖先菜单都是展开状态
  useEffect(() => {
    if (collapsed) return;

    setExpandedMenus((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const id of findExpandedIds) {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [findExpandedIds, collapsed]);

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "fixed top-0 bottom-0 left-0 z-50 hidden flex-col border-r border-gray-100 bg-white shadow-sm transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* 顶部品牌区域 */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 px-4">
        {/* 使用橘子 emoji 作为 Logo 占位 */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-orange-400 to-orange-500 text-xl shadow-sm">
          🍊
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-gray-800">GuoYuan</span>
        )}
      </div>

      {/* 菜单区域 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {visibleRoutes.length > 0 ? (
            visibleRoutes.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                parentPath="/admin"
                depth={0}
                collapsed={collapsed}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
                location={location}
              />
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-400">加载中...</div>
          )}
        </div>
      </nav>

      {/* 底部折叠按钮 */}
      <div className="shrink-0 border-t border-gray-100 p-3">
        <button
          onClick={() => onCollapse(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg py-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
}
