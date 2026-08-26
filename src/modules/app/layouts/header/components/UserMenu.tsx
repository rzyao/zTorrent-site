import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Settings,
  History,
  Sparkles,
  TrendingUp,
  Download,
  Upload,
  UserPlus,
} from "lucide-react";
import { UserAvatar } from "@/modules/app/components/UserAvatar";
import { useAccess } from "@/context/AccessContext";
import { useUserSummary } from "@/modules/app/context/UserSummaryContext";
import { canAccess } from "@/utils/access";
import { useLanguage } from "@/hooks/useLanguage";

// 格式化字节数为人类可读格式
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + sizes[i];
}

export function UserMenu() {
  const navigate = useNavigate();
  const { access, loading } = useAccess();
  const { data: userSummary } = useUserSummary();
  const { t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部或按 Esc 关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showUserMenu]);

  const canHistory = !loading && canAccess(access, { requiredPermissions: ["torrent-history"] });
  const canInvite = !loading && canAccess(access, { requiredPermissions: ["invite"] });
  const canBonus = !loading && canAccess(access, { requiredPermissions: ["bonus"] });
  const canControl = !loading && canAccess(access, { requiredPermissions: ["control"] });

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-colors hover:bg-white/10"
      >
        <UserAvatar
          username={access?.username || t('user.defaultUser')}
          avatarUrl={access?.avatar || null}
          size="sm"
        />
      </button>

      {showUserMenu && (
        <div className="dropdown-menu absolute top-full right-0 z-60 mt-2 w-68 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl">
          {/* 用户信息区域 */}
          <div className="border-b border-neutral-700 bg-linear-to-br from-amber-500/20 to-orange-600/20 p-4">
            <div className="mb-3 flex items-center gap-3">
              <UserAvatar
                username={access?.username || t('user.defaultUser')}
                avatarUrl={access?.avatar || null}
                size="lg"
                className="shadow-amber-500/30"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-white">{access?.username || t('user.defaultUser')}</div>
                <div className="text-xs text-neutral-400">{t('user.vipMember')}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-neutral-800/50 p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-green-400">
                  <Upload className="h-3 w-3" />
                  {userSummary ? formatBytes(userSummary.uploadedBytes) : "0B"}
                </div>
                <div className="mt-1 text-neutral-500">{t('user.uploaded')}</div>
              </div>
              <div className="rounded-lg bg-neutral-800/50 p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-red-400">
                  <Download className="h-3 w-3" />
                  {userSummary ? formatBytes(userSummary.downloadedBytes) : "0B"}
                </div>
                <div className="mt-1 text-neutral-500">{t('user.downloaded')}</div>
              </div>
              <div className="rounded-lg bg-neutral-800/50 p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-400">
                  <TrendingUp className="h-3 w-3" />
                  {userSummary ? userSummary.ratio.toFixed(2) : "0.00"}
                </div>
                <div className="mt-1 text-neutral-500">{t('user.ratio')}</div>
              </div>
            </div>
          </div>
          {/* 菜单项 */}
          <div className="py-2">
            {canHistory && (
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/torrent-history");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <History className="h-5 w-5 text-amber-400" />
                <span>{t('user.torrentHistory')}</span>
              </button>
            )}
            {canInvite && (
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/invite");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <UserPlus className="h-5 w-5 text-amber-400" />
                <span>{t('user.inviteManage')}</span>
              </button>
            )}
            {canBonus && (
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/bonus");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span>{t('user.bonusManage')}</span>
              </button>
            )}
            {canControl && (
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/app/control");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Settings className="h-5 w-5 text-amber-400" />
                <span>{t('user.controlPanel')}</span>
              </button>
            )}
          </div>

          {/* 退出登录 */}
          <div className="border-t border-neutral-700 py-2">
            <button
              onClick={() => {
                setShowUserMenu(false);
                // 调用后端 /auth/logout 清除 HttpOnly Cookie（凭证已不在前端）
                try {
                  const base = (import.meta as any)?.env?.VITE_BASE_URL || "/api";
                  void fetch(`${base}/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: "{}",
                  });
                } catch {}
                window.dispatchEvent(new Event("authChange"));
                navigate("/login");
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('auth.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
