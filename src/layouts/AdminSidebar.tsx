import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Ticket,
  Flag,
  Route,
  Settings,
  Users,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { useRouteConfig } from "@/hooks/useRouteConfig";

/**
 * 路由路径到图标的映射
 * 用于为动态菜单项分配合适的图标
 */
const ICON_MAP: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  routes: Route,
  review: ShieldCheck,
  tickets: Ticket,
  reports: Flag,
  users: Users,
  settings: Settings,
};

/**
 * 获取路由对应的图标
 */
function getIconForPath(path: string): LucideIcon {
  // 从路径中提取最后一段作为 key
  const key = path.split("/").pop() || "";
  return ICON_MAP[key] || LayoutDashboard;
}

export function AdminSidebar() {
  const { routes } = useRouteConfig();

  // 从路由配置中提取 /admin 的子路由
  const adminRoute = routes.find((r) => r.path === "/admin");
  const adminChildren = adminRoute?.children || [];

  // 过滤出可见的子路由
  const visibleRoutes = adminChildren.filter((r) => r.isVisible !== false);

  return (
    <aside className="fixed top-0 bottom-0 left-0 z-40 hidden w-64 overflow-y-auto border-r border-neutral-800 bg-[#0F171E] md:block">
      <div className="px-4 py-6">
        <h2 className="mb-4 px-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          管理后台
        </h2>
        <nav className="space-y-1">
          {visibleRoutes.length > 0 ? (
            visibleRoutes.map((item) => {
              const Icon = getIconForPath(item.path);
              // 构建完整路径
              const href = item.path.startsWith("/") ? item.path : `/admin/${item.path}`;

              return (
                <NavLink
                  key={item.id}
                  to={href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600/10 text-blue-500"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.name || item.path}
                </NavLink>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-neutral-500">加载中...</div>
          )}
        </nav>
      </div>
    </aside>
  );
}
