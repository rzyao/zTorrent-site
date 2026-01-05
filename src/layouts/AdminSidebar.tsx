import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, Ticket, Flag, Users, Settings } from "lucide-react";
import { cn } from "@/components/ui/utils";

const ADMIN_NAV_ITEMS = [
  {
    title: "仪表盘",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "审核中心",
    href: "/admin/review",
    icon: ShieldCheck,
  },
  {
    title: "工单管理",
    href: "/admin/tickets",
    icon: Ticket,
  },
  {
    title: "举报管理",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    title: "用户管理",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <aside className="fixed top-0 bottom-0 left-0 z-40 hidden w-64 overflow-y-auto border-r border-neutral-800 bg-[#0F171E] md:block">
      <div className="px-4 py-6">
        <h2 className="mb-4 px-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          管理后台
        </h2>
        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600/10 text-blue-500"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
