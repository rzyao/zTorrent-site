// 替换右上角搜索为魔力值入口：移除 Search，新增 Sparkles 图标
import {
  Bell,
  Mail,
  User,
  TrendingUp,
  Upload,
  Download,
  ChartSpline,
  ChevronDown,
  Settings,
  LogOut,
  UserCircle,
  Sparkles,
  UserPlus,
  History,
  Menu,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAccess } from "@/context/AccessContext";
import { canAccess } from "@/utils/access";
import { UserAvatar } from "@/components/UserAvatar";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { ensureNamespace } from "@/utils/tabTitle";
import { useUserSummary } from "@/context/UserSummaryContext";

// 格式化字节数为人类可读格式
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + sizes[i];
}

// 将魔力值格式化为：去掉小数，并按每4位一组以撇号分隔
// 变更原因：根据需求，顶部右侧魔力值显示使用撇号 (' ) 代替点号 (.)
// 示例：12345678.90 -> "1234'5678"
function formatBonusPoints(value?: number): string {
  const n = Math.max(0, Math.floor(Number(value ?? 0)));
  const s = String(n);
  const groups: string[] = [];
  for (let i = s.length; i > 0; i -= 4) {
    const start = Math.max(0, i - 4);
    groups.unshift(s.slice(start, i));
  }
  // 使用撇号作为分隔符，满足“用'代替.号”的展示需求
  return groups.join("'");
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { access, loading } = useAccess();
  const { logoSvg, logoUrl, title } = useSiteConfig();
  const { data: userSummary } = useUserSummary();
  // 控制用户菜单显示状态
  const [showUserMenu, setShowUserMenu] = useState(false);
  // 控制移动端导航菜单显示状态
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // 发布下拉菜单展开状态：true 显示菜单，false 隐藏；用于配合箭头旋转
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  // 发布下拉菜单延时隐藏的定时器引用：在鼠标/键盘离开时延迟 200ms 再隐藏，避免移动到子菜单过程闪断
  const publishMenuTimeoutRef = useRef<number | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuTimeoutRef = useRef<number | null>(null);
  // 新增：编辑下拉菜单显示状态与延迟隐藏定时器，交互与“发布/其他”保持一致
  const [showEditMenu, setShowEditMenu] = useState(false);
  const editMenuTimeoutRef = useRef<number | null>(null);
  // 下拉菜单容器引用，用于检测外部点击
  const userMenuRef = useRef<HTMLDivElement>(null);
  // 点击外部或按 Esc 关闭菜单，并在卸载时解绑事件
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
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
  // 导航显示权限：根据 access.roles / access.permissions 控制菜单显示
  const canReview =
    !loading &&
    canAccess(access, {
      requiredPermissions: ["review:write"],
      requiredRoles: ["admin", "superadmin"],
      combine: "OR",
    });
  return (
    <>
      <header
        className="sticky h-16 bg-[#0F171E] z-50 px-4 md:px-8 border-b border-gray-800"
        style={{ top: "-64px" }}
      >
        <div className="flex items-center justify-between h-full max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4 md:gap-8">
            {/* 移动端汉堡菜单按钮 */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? "关闭菜单" : "打开菜单"}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <NavLink to="/home" className="flex items-center gap-2">
              {logoSvg && logoSvg.trim().length > 0 ? (
                <img
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(
                    ensureNamespace(logoSvg)
                  )}`}
                  alt="Logo"
                  className="h-7 md:h-9"
                />
              ) : logoUrl && logoUrl.trim().length > 0 ? (
                <img src={logoUrl} alt="Logo" className="h-7 md:h-9" />
              ) : (
                <>
                  <span className="text-white text-2xl">PT</span>
                  <span className="text-[#00A8E1] text-2xl">Tracker</span>
                </>
              )}
              <span className="text-white text-xl md:text-2xl">
                {title || ""}
              </span>
            </NavLink>
            <nav className="hidden md:flex items-center gap-6">
              {/* 选中高亮：激活路由使用 text-amber-400 */}
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-400 transition-colors"
                    : "text-white hover:text-gray-300 transition-colors"
                }
              >
                推荐
              </NavLink>
              <NavLink
                to="/torrents"
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-400 transition-colors"
                    : "text-white hover:text-gray-300 transition-colors"
                }
              >
                种子
              </NavLink>
              {/* <NavLink to="/subtitles" className="text-white hover:text-gray-300 transition-colors">字幕</NavLink>
            <NavLink to="/ranking" className="text-white hover:text-gray-300 transition-colors">排行榜</NavLink> */}
              {/* 新增：影片与片单导航入口，保持与现有样式一致 */}
              <NavLink
                to="/films"
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-400 transition-colors"
                    : "text-white hover:text-gray-300 transition-colors"
                }
              >
                影片
              </NavLink>
              <NavLink
                to="/playlists"
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-400 transition-colors"
                    : "text-white hover:text-gray-300 transition-colors"
                }
              >
                片单
              </NavLink>
              {/* <div
                className="relative group"
                onMouseEnter={() => {
                  // 进入触发区域：清除可能存在的隐藏定时器，立即显示菜单，避免抖动
                  if (publishMenuTimeoutRef.current) { clearTimeout(publishMenuTimeoutRef.current); publishMenuTimeoutRef.current = null; }
                  setShowPublishMenu(true);
                }}
                onMouseLeave={() => {
                  // 离开触发区域：开启 200ms 隐藏定时器，给用户移动到下拉菜单的缓冲时间
                  if (publishMenuTimeoutRef.current) { clearTimeout(publishMenuTimeoutRef.current); }
                  publishMenuTimeoutRef.current = window.setTimeout(() => { setShowPublishMenu(false); }, 200);
                }}
                onFocus={() => {
                  // 键盘聚焦到触发元素：清除隐藏定时器并显示菜单，保证键盘可达性
                  if (publishMenuTimeoutRef.current) { clearTimeout(publishMenuTimeoutRef.current); publishMenuTimeoutRef.current = null; }
                  setShowPublishMenu(true);
                }}
                onBlur={() => {
                  // 键盘焦点离开触发元素：延迟 200ms 隐藏，下拉菜单在短暂过渡期间保持可见
                  if (publishMenuTimeoutRef.current) { clearTimeout(publishMenuTimeoutRef.current); }
                  publishMenuTimeoutRef.current = window.setTimeout(() => { setShowPublishMenu(false); }, 200);
                }}
              >
                <NavLink
                  to="/upload"
                  className={({ isActive }) => ((isActive || showPublishMenu) ? 'text-amber-400 transition-colors' : 'text-white hover:text-gray-300 transition-colors') + ' flex items-center gap-1'}
                >
                  发布
                  {/* 箭头根据 showPublishMenu 动态旋转，指示展开/收起状态 */}
              {/* <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPublishMenu ? 'rotate-180' : ''}`} />
            </NavLink>
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-full w-24 py-2 bg-[#0F171E] rounded-xl shadow-lg border border-gray-800 z-50 transform-gpu transition-[opacity,transform] ease-out duration-150 ${showPublishMenu ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-1'}`}
              style={{ willChange: 'opacity, transform', contain: 'content' }}
            >
              <NavLink to="/upload" className="block px-4 py-2 text-white hover:bg-white/10 transition-colors">发资源</NavLink>
              <NavLink to="/subtitles" className="block px-4 py-2 text-white hover:bg-white/10 transition-colors">发字幕</NavLink>
            </div>
          </div>  */}
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  (isActive || showPublishMenu
                    ? "text-amber-400 transition-colors"
                    : "text-white hover:text-gray-300 transition-colors") +
                  " flex items-center gap-1"
                }
              >
                发布
              </NavLink>
              <NavLink
                to="/candidates"
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-400 transition-colors"
                    : "text-white hover:text-gray-300 transition-colors"
                }
              >
                候选
              </NavLink>

              {
                <div
                  className="relative group"
                  onMouseEnter={() => {
                    // 进入触发区域：清除隐藏定时器并显示菜单
                    if (editMenuTimeoutRef.current) {
                      clearTimeout(editMenuTimeoutRef.current);
                      editMenuTimeoutRef.current = null;
                    }
                    setShowEditMenu(true);
                  }}
                  onMouseLeave={() => {
                    // 离开触发区域：延迟 200ms 隐藏，避免抖动
                    if (editMenuTimeoutRef.current) {
                      clearTimeout(editMenuTimeoutRef.current);
                    }
                    editMenuTimeoutRef.current = window.setTimeout(() => {
                      setShowEditMenu(false);
                    }, 200);
                  }}
                  onFocus={() => {
                    // 键盘聚焦可展开菜单，保证可达性
                    if (editMenuTimeoutRef.current) {
                      clearTimeout(editMenuTimeoutRef.current);
                      editMenuTimeoutRef.current = null;
                    }
                    setShowEditMenu(true);
                  }}
                  onBlur={() => {
                    // 键盘失焦后延迟隐藏
                    if (editMenuTimeoutRef.current) {
                      clearTimeout(editMenuTimeoutRef.current);
                    }
                    editMenuTimeoutRef.current = window.setTimeout(() => {
                      setShowEditMenu(false);
                    }, 200);
                  }}
                >
                  <button
                    type="button"
                    className={`${
                      ["/edit/movie", "/edit/playlist"].includes(
                        location.pathname
                      ) || showEditMenu
                        ? "text-amber-400 transition-colors"
                        : "text-white hover:text-gray-300 transition-colors"
                    } flex items-center gap-1`}
                  >
                    编辑
                    {/* 箭头根据 showEditMenu 动态旋转，指示展开/收起状态 */}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showEditMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full w-28 py-2 bg-[#0F171E] rounded-xl shadow-lg border border-gray-800 z-50 transform-gpu transition-[opacity,transform] ease-out duration-150 ${
                      showEditMenu
                        ? "opacity-100 pointer-events-auto translate-y-0"
                        : "opacity-0 pointer-events-none translate-y-1"
                    }`}
                    style={{
                      willChange: "opacity, transform",
                      contain: "content",
                    }}
                  >
                    <NavLink
                      to="/edit/movie"
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      影片编辑
                    </NavLink>
                    <NavLink
                      to="/edit/playlist"
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      片单编辑
                    </NavLink>
                  </div>
                </div>
              }
              <NavLink
                to="/forum"
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-400 transition-colors"
                    : "text-white hover:text-gray-300 transition-colors"
                }
              >
                论坛
              </NavLink>

              <NavLink
                to="/rules"
                className="block px-4 py-2 text-white hover:text-gray-300 transition-colors"
              >
                规则
              </NavLink>

              {canReview && (
                <NavLink
                  to="/review"
                  className={({ isActive }) =>
                    isActive
                      ? "text-amber-400 transition-colors"
                      : "text-white hover:text-gray-300 transition-colors"
                  }
                >
                  审核
                </NavLink>
              )}
              <div
                className="relative group"
                onMouseEnter={() => {
                  if (moreMenuTimeoutRef.current) {
                    clearTimeout(moreMenuTimeoutRef.current);
                    moreMenuTimeoutRef.current = null;
                  }
                  setShowMoreMenu(true);
                }}
                onMouseLeave={() => {
                  if (moreMenuTimeoutRef.current) {
                    clearTimeout(moreMenuTimeoutRef.current);
                  }
                  moreMenuTimeoutRef.current = window.setTimeout(() => {
                    setShowMoreMenu(false);
                  }, 200);
                }}
                onFocus={() => {
                  if (moreMenuTimeoutRef.current) {
                    clearTimeout(moreMenuTimeoutRef.current);
                    moreMenuTimeoutRef.current = null;
                  }
                  setShowMoreMenu(true);
                }}
                onBlur={() => {
                  if (moreMenuTimeoutRef.current) {
                    clearTimeout(moreMenuTimeoutRef.current);
                  }
                  moreMenuTimeoutRef.current = window.setTimeout(() => {
                    setShowMoreMenu(false);
                  }, 200);
                }}
              >
                {/* 新增路径纳入高亮集合：/music 与 /player */}
                <button
                  type="button"
                  className={`${
                    [
                      "/groups",
                      "/rss",
                      "/staff",
                      "/tutorials",
                      "/seeding",
                      "/dead-torrents",
                      "/games",
                      "/announcements",
                      "/music",
                      "/player",
                    ].includes(location.pathname) || showMoreMenu
                      ? "text-amber-400 transition-colors"
                      : "text-white hover:text-gray-300 transition-colors"
                  } flex items-center gap-1`}
                >
                  其他
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showMoreMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full w-32 py-2 bg-[#0F171E] rounded-xl shadow-lg border border-gray-800 z-50 transform-gpu transition-[opacity,transform] ease-out duration-150 ${
                    showMoreMenu
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none translate-y-1"
                  }`}
                  style={{
                    willChange: "opacity, transform",
                    contain: "content",
                  }}
                >
                  <NavLink
                    to="/tickets"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    工单
                  </NavLink>
                  <NavLink
                    to="/requests"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    求种
                  </NavLink>
                  <NavLink
                    to="/subtitles"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    字幕
                  </NavLink>
                  <NavLink
                    to="/groups"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    制作组
                  </NavLink>
                  <NavLink
                    to="/rss"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    RSS订阅
                  </NavLink>
                  <NavLink
                    to="/staff"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    管理组
                  </NavLink>
                  <NavLink
                    to="/tutorials"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    使用教程
                  </NavLink>
                  <NavLink
                    to="/seeding"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    保种列表
                  </NavLink>
                  <NavLink
                    to="/dead-torrents"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    断种大厅
                  </NavLink>
                  <NavLink
                    to="/games"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    小游戏
                  </NavLink>
                  <NavLink
                    to="/announcements"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    站点公告
                  </NavLink>
                  {/* 新增：音乐与播放器入口 */}
                  <NavLink
                    to="/music"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    音乐
                  </NavLink>
                  <NavLink
                    to="/player"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    播放器
                  </NavLink>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 text-sm">
              {/* 上传量显示 */}
              <div className="flex items-center gap-1 text-green-400">
                <Upload className="w-4 h-4" />
                <span>
                  {userSummary ? formatBytes(userSummary.uploadedBytes) : "0B"}
                </span>
              </div>
              {/* 下载量显示 */}
              <div className="flex items-center gap-1 text-red-400">
                <Download className="w-4 h-4" />
                <span>
                  {userSummary
                    ? formatBytes(userSummary.downloadedBytes)
                    : "0B"}
                </span>
              </div>
              {/* _ratio显示 */}
              <div className="flex items-center gap-1 text-sky-400">
                <ChartSpline className="w-4 h-4" />
                <span>
                  {userSummary ? userSummary.ratio.toFixed(2) : "0.00"}
                </span>
              </div>
              {/* 魔力值入口按钮，点击跳转到 /bonus */}
              <div
                className="flex items-center gap-1 text-yellow-400"
                onClick={() => navigate("/bonus")}
              >
                <Sparkles className="w-4 h-4" />
                {/* 显示为每4位加点的整数分组，无小数 */}
                <span>{formatBonusPoints(userSummary?.bonusPoints)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-none relative"
              onClick={() => navigate("/messages?tab=system")}
            >
              <Bell className="w-5 h-5" />
              {userSummary && userSummary.unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-none relative"
              onClick={() => navigate("/messages?tab=inbox")}
            >
              <Mail className="w-5 h-5" />
              {userSummary && userSummary.unreadInbox > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>

            {/* 用户菜单 */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 transition-colors rounded-lg"
              >
                <UserAvatar
                  username={access?.username || "用户"}
                  avatarUrl={access?.avatar || null}
                  size="sm"
                />
                {/* <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} /> */}
              </button>

              {showUserMenu && (
                <div className="dropdown-menu absolute right-0 top-full mt-2 w-68 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden z-[60]">
                  {/* 用户信息区域 */}
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-b border-neutral-700 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <UserAvatar
                        username={access?.username || "用户"}
                        avatarUrl={access?.avatar || null}
                        size="lg"
                        className="shadow-amber-500/30"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white truncate">
                          {access?.username || "用户"}
                        </div>
                        <div className="text-xs text-neutral-400">VIP会员</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                        <div className="text-green-400 flex items-center justify-center gap-1">
                          <Upload className="w-3 h-3" />
                          {userSummary
                            ? formatBytes(userSummary.uploadedBytes)
                            : "0B"}
                        </div>
                        <div className="text-neutral-500 mt-1">上传</div>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                        <div className="text-red-400 flex items-center justify-center gap-1">
                          <Download className="w-3 h-3" />
                          {userSummary
                            ? formatBytes(userSummary.downloadedBytes)
                            : "0B"}
                        </div>
                        <div className="text-neutral-500 mt-1">下载</div>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                        <div className="text-yellow-400 flex items-center justify-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {userSummary ? userSummary.ratio.toFixed(2) : "0.00"}
                        </div>
                        <div className="text-neutral-500 mt-1">分享率</div>
                      </div>
                    </div>
                  </div>
                  {/* 菜单项 */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/torrent-history");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      <History className="w-5 h-5 text-amber-400" />
                      <span>种子记录</span>
                    </button>
                    {
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/invite");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        <UserPlus className="w-5 h-5 text-amber-400" />
                        <span>邀请管理</span>
                      </button>
                    }
                    {
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/bonus");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        <UserPlus className="w-5 h-5 text-amber-400" />
                        <span>魔力管理</span>
                      </button>
                    }
                    {
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/control");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        <Settings className="w-5 h-5 text-amber-400" />
                        <span>控制面板</span>
                      </button>
                    }
                  </div>

                  {/* 退出登录 */}
                  <div className="border-t border-neutral-700 py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        try {
                          localStorage.removeItem("accessToken");
                        } catch {}
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>退出登录</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 移动端展开导航菜单 */}
      <div
        className={`md:hidden fixed left-0 right-0 bg-[#0F171E] border-b border-gray-800 z-[60] overflow-hidden transition-all duration-300 ease-in-out ${
          showMobileMenu ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ top: "64px" }}
      >
        <nav className="flex flex-col py-4 px-4 space-y-1 max-h-[calc(80vh-32px)] overflow-y-auto">
          <NavLink
            to="/home"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            首页
          </NavLink>
          <NavLink
            to="/torrents"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            种子
          </NavLink>
          <NavLink
            to="/forum"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            论坛
          </NavLink>
          <NavLink
            to="/candidates"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            候选
          </NavLink>
          <NavLink
            to="/groups"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            制作组
          </NavLink>
          <NavLink
            to="/films"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            影片
          </NavLink>
          <NavLink
            to="/playlists"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            片单
          </NavLink>
          {/* 新增移动端入口：音乐 */}
          <NavLink
            to="/music"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            音乐
          </NavLink>
          {/* 新增移动端入口：播放器 */}
          <NavLink
            to="/player"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            播放器
          </NavLink>
          {
            <NavLink
              to="/upload"
              className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              上传
            </NavLink>
          }
          {
            <NavLink
              to="/edit/movie"
              className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              影片编辑
            </NavLink>
          }
          {
            <NavLink
              to="/edit/playlist"
              className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              片单编辑
            </NavLink>
          }
          {canReview && (
            <NavLink
              to="/review"
              className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              审核
            </NavLink>
          )}
          <NavLink
            to="/tickets"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            工单
          </NavLink>
          <NavLink
            to="/requests"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            求种
          </NavLink>
          <NavLink
            to="/rules"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            规则
          </NavLink>
          <NavLink
            to="/rss"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            RSS订阅
          </NavLink>
          <NavLink
            to="/staff"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            管理组
          </NavLink>
          <NavLink
            to="/announcements"
            className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(false)}
          >
            站点公告
          </NavLink>
        </nav>
      </div>

      {/* 移动端菜单打开时的遮罩层 */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[55]"
          style={{ top: "64px" }}
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </>
  );
}
