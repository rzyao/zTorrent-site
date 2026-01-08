import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { useRouteConfig } from "@/hooks/useRouteConfig";
import DynamicIcon from "@/components/DynamicIcon";

export function AdminSidebar() {
  const { routes } = useRouteConfig();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const adminRoute = routes.find((r) => r.path === "/admin" || r.path === "admin");
  const adminChildren = adminRoute?.children || [];
  const visibleRoutes = adminChildren.filter((r) => r.isVisible !== false);

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
            visibleRoutes.map((item) => {
              const iconName = (item as any).icon as string | undefined;
              const href = item.path.startsWith("/") ? item.path : `/admin/${item.path}`;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus.has(item.id);

              // 带子菜单的项目
              if (hasChildren) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {iconName && (
                          <DynamicIcon iconName={iconName} size={18} className="text-gray-400" />
                        )}
                        {!collapsed && <span>{item.name || item.path}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-400 transition-transform",
                            isExpanded && "rotate-180",
                          )}
                        />
                      )}
                    </button>
                    {/* 子菜单 */}
                    {isExpanded && !collapsed && (
                      <div className="mt-1 ml-4 space-y-1 border-l border-gray-100 pl-4">
                        {item.children
                          ?.filter((c) => c.isVisible !== false)
                          .map((child) => {
                            const childHref = child.path.startsWith("/")
                              ? child.path
                              : `${href}/${child.path}`;
                            const childIcon = (child as any).icon as string | undefined;
                            return (
                              <NavLink
                                key={child.id}
                                to={childHref}
                                className={({ isActive }) =>
                                  cn(
                                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                                    isActive
                                      ? "bg-violet-50 font-medium text-violet-600"
                                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                                  )
                                }
                              >
                                {childIcon && (
                                  <DynamicIcon
                                    iconName={childIcon}
                                    size={16}
                                    className="text-gray-400"
                                  />
                                )}
                                <span>{child.name || child.path}</span>
                              </NavLink>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              }

              // 普通菜单项
              return (
                <NavLink
                  key={item.id}
                  to={href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-violet-50 text-violet-600" : "text-gray-600 hover:bg-gray-50",
                      collapsed && "justify-center px-2",
                    )
                  }
                >
                  {iconName && (
                    <DynamicIcon iconName={iconName} size={18} className="text-gray-400" />
                  )}
                  {!collapsed && <span>{item.name || item.path}</span>}
                </NavLink>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-gray-400">加载中...</div>
          )}
        </div>
      </nav>

      {/* 底部折叠按钮 */}
      <div className="shrink-0 border-t border-gray-100 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg py-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
}
