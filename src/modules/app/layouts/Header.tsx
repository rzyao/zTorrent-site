import { Bell, Mail, Upload, Download, ChartSpline, Sparkles, Menu, X } from "lucide-react";
import Logo from "@/assets/logo.svg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useAccess } from "@/context/AccessContext";
import { canAccess } from "@/utils/access";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useUserSummary } from "@/context/UserSummaryContext";
import { DesktopNav } from "./header/DesktopNav";
import { MobileNav } from "./header/MobileNav";
import { UserMenu } from "./header/components/UserMenu";

// 格式化字节数为人类可读格式
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + sizes[i];
}

// 将魔力值格式化为：去掉小数，并按每4位一组以撇号分隔
function formatBonusPoints(value?: number): string {
  const n = Math.max(0, Math.floor(Number(value ?? 0)));
  const s = String(n);
  const groups: string[] = [];
  for (let i = s.length; i > 0; i -= 4) {
    const start = Math.max(0, i - 4);
    groups.unshift(s.slice(start, i));
  }
  return groups.join("'");
}

export function Header() {
  const navigate = useNavigate();
  const { access, loading: accessLoading } = useAccess();
  const { title } = useSiteConfig();
  const { data: userSummary } = useUserSummary();

  // 控制移动端导航菜单显示状态
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const canBonus = !accessLoading && canAccess(access, { requiredPermissions: ["bonus"] });

  return (
    <>
      <header
        className="sticky z-50 h-16 border-b border-gray-800 bg-[#0F171E] px-4 md:px-8"
        style={{ top: "-64px" }}
      >
        <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            {/* 移动端汉堡菜单按钮 */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? "关闭菜单" : "打开菜单"}
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <NavLink to="/app/home" className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="h-7 md:h-9" />
              <span className="text-xl text-white md:text-2xl">{title || ""}</span>
            </NavLink>

            {/* 桌面端导航菜单 - 配置驱动 */}
            <DesktopNav />
          </div>

          <div className="flex items-center gap-4">
            {/* 桌面端：用户数据面板 (上传/下载/魔力值) */}
            <div className="hidden items-center gap-6 text-sm lg:flex">
              {/* 上传量显示 */}
              <div className="flex items-center gap-1 text-green-400">
                <Upload className="h-4 w-4" />
                <span>{userSummary ? formatBytes(userSummary.uploadedBytes) : "0B"}</span>
              </div>
              {/* 下载量显示 */}
              <div className="flex items-center gap-1 text-red-400">
                <Download className="h-4 w-4" />
                <span>{userSummary ? formatBytes(userSummary.downloadedBytes) : "0B"}</span>
              </div>
              {/* 分享率显示 */}
              <div className="flex items-center gap-1 text-sky-400">
                <ChartSpline className="h-4 w-4" />
                <span>{userSummary ? userSummary.ratio.toFixed(2) : "0.00"}</span>
              </div>
              {/* 魔力值入口按钮 */}
              {canBonus && (
                <div
                  className="flex cursor-pointer items-center gap-1 text-yellow-400"
                  onClick={() => navigate("/app/bonus")}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{formatBonusPoints(userSummary?.bonusPoints)}</span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-none text-white hover:bg-white/10"
              onClick={() => navigate("/app/messages?tab=system")}
            >
              <Bell className="h-5 w-5" />
              {userSummary && userSummary.unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-none text-white hover:bg-white/10"
              onClick={() => navigate("/app/messages?tab=inbox")}
            >
              <Mail className="h-5 w-5" />
              {userSummary && userSummary.unreadInbox > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>

            {/* 用户菜单 - 已拆分组件 */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* 移动端展开导航菜单 */}
      <div
        className={`fixed right-0 left-0 z-60 overflow-hidden border-b border-gray-800 bg-[#0F171E] transition-all duration-300 ease-in-out md:hidden ${
          showMobileMenu ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ top: "64px" }}
      >
        <MobileNav onClose={() => setShowMobileMenu(false)} />
      </div>

      {/* 移动端菜单打开时的遮罩层 */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-55 bg-black/50 md:hidden"
          style={{ top: "64px" }}
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </>
  );
}
