import { useNavigate, useLocation } from "react-router-dom";
import { Home, Megaphone, Bookmark, ShieldCheck } from "lucide-react";
import { useForumTheme } from "../../context/ForumThemeContext";
import { useAccess } from "@/context/AccessContext";

const BASE_NAV_ITEMS = [
  { id: "topics", name: "话题", icon: Home, path: "/forum/latest" },
  { id: "bookmarks", name: "我的收藏", icon: Bookmark, path: "/forum/bookmarks" },
  { id: "announcements", name: "公告", icon: Megaphone, path: "/forum/announcements" },
];

/**
 * 侧边栏导航组件
 * 显示顶部的固定导航项（如：话题、最新等）
 */
export function SidebarNav() {
  const { colors, theme } = useForumTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { access } = useAccess();
  const isAdminOrMod = access?.roles?.includes("admin") || access?.roles?.includes("moderator");
  const NAV_ITEMS = isAdminOrMod
    ? [
        ...BASE_NAV_ITEMS,
        { id: "admin-bounty-cancel", name: "悬赏取消审核", icon: ShieldCheck, path: "/forum/admin/bounty-cancel-requests" },
      ]
    : BASE_NAV_ITEMS;

  return (
    <nav className="py-1.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        // 根据当前路径判断激活状态

        const isActive =
          (item.id === "topics" &&
            (location.pathname === "/forum" ||
              location.pathname === "/forum/" ||
              location.pathname.startsWith("/forum/latest") ||
              location.pathname.startsWith("/forum/hot"))) ||
          (item.id === "bookmarks" && location.pathname.startsWith("/forum/bookmarks")) ||
          item.path === location.pathname;

        let buttonClass: string;
        if (isActive) {
          buttonClass =
            theme === "dark" ? "bg-[#31566c] text-white" : "bg-[#d1f0ff] text-[#0088CC]";
        } else {
          buttonClass = `${colors.textSecondary} ${colors.buttonHover}`;
        }

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg py-1.5 pr-4 pl-8 ${buttonClass}`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-base">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
