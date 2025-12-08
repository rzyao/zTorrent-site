// 替换右上角搜索为魔力值入口：移除 Search，新增 Sparkles 图标
import { Bell, Mail, User, TrendingUp, Upload, Download, ChartSpline, ChevronDown, Settings, LogOut, UserCircle, Sparkles, UserPlus, History, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAccess } from '@/context/AccessContext';
import { canAccess } from '@/utils/access';
import { UserAvatar } from '@/components/UserAvatar';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { ensureNamespace } from '@/utils/tabTitle';
import { useUserSummary } from '@/context/UserSummaryContext';

// 格式化字节数为人类可读格式
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + sizes[i];
}

export function Header() {
  const navigate = useNavigate();
  const { access, loading } = useAccess();
  const { logoSvg, logoUrl, title } = useSiteConfig();
  const { data: userSummary } = useUserSummary();
  // 控制用户菜单显示状态
  const [showUserMenu, setShowUserMenu] = useState(false);
  // 控制移动端导航菜单显示状态
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // 下拉菜单容器引用，用于检测外部点击
  const userMenuRef = useRef<HTMLDivElement>(null);
  // 点击外部或按 Esc 关闭菜单，并在卸载时解绑事件
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showUserMenu]);
  // 导航显示权限：根据 access.roles / access.permissions 控制菜单显示
  const canReview = !loading && canAccess(access, {
    requiredPermissions: ['review:write'],
    requiredRoles: ['admin', 'superadmin'],
    combine: 'OR',
  });
  const canUpload = !loading && canAccess(access, { requiredPermissions: ['page:upload'] });
  const canEdit = !loading && canAccess(access, { requiredPermissions: ['page:edit'] });
  const canInvite = !loading && canAccess(access, { requiredPermissions: ['page:invite'] });
  const canBonus = !loading && canAccess(access, { requiredPermissions: ['page:bonus'] });
  const canControl = !loading && canAccess(access, {
    requiredRoles: ['admin'],
    requiredPermissions: ['page:control'],
    combine: 'OR',
  });
  return (
    <>
      <header className="sticky h-16 bg-[#0F171E] z-50 px-4 md:px-8 border-b border-gray-800" style={{ top: '-64px' }}>
        <div className="flex items-center justify-between h-full max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4 md:gap-8">
            {/* 移动端汉堡菜单按钮 */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? '关闭菜单' : '打开菜单'}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <NavLink to="/home" className="flex items-center gap-2">
              {logoSvg && logoSvg.trim().length > 0 ? (
                <img
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(ensureNamespace(logoSvg))}`}
                  alt="Logo"
                  className="h-10 md:h-12"
                />
              ) : logoUrl && logoUrl.trim().length > 0 ? (
                <img src={logoUrl} alt="Logo" className="h-10 md:h-12" />
              ) : (
                <>
                  <span className="text-white text-2xl">PT</span>
                  <span className="text-[#00A8E1] text-2xl">Tracker</span>
                </>
              )}
              <span className="text-white text-xl md:text-2xl">{title || ''}</span>
            </NavLink>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/home" className="text-white hover:text-gray-300 transition-colors">首页</NavLink>
              <NavLink to="/torrents" className="text-white hover:text-gray-300 transition-colors">种子</NavLink>
              {/* <NavLink to="/subtitles" className="text-white hover:text-gray-300 transition-colors">字幕</NavLink>
            <NavLink to="/ranking" className="text-white hover:text-gray-300 transition-colors">排行榜</NavLink> */}
              {/* 新增：影片与片单导航入口，保持与现有样式一致 */}
              <NavLink to="/films" className="text-white hover:text-gray-300 transition-colors">影片</NavLink>
              <NavLink to="/playlists" className="text-white hover:text-gray-300 transition-colors">片单</NavLink>
              {canUpload && (
                <NavLink to="/upload" className="text-white hover:text-gray-300 transition-colors">上传</NavLink>
              )}
              <NavLink to="/requests" className="text-white hover:text-gray-300 transition-colors">求种</NavLink>
              {canEdit && (
                <NavLink to="/edit" className="text-white hover:text-gray-300 transition-colors">编辑</NavLink>
              )}
              <NavLink to="/forum" className="text-white hover:text-gray-300 transition-colors">论坛</NavLink>
              <NavLink to="/candidates" className="text-white hover:text-gray-300 transition-colors">候选人</NavLink>
              <NavLink to="/groups" className="text-white hover:text-gray-300 transition-colors">制作组</NavLink>
              <NavLink to="/tickets" className="text-white hover:text-gray-300 transition-colors">工单</NavLink>
              <NavLink to="/rules" className="text-white hover:text-gray-300 transition-colors">规则</NavLink>
              <NavLink to="/rss" className="text-white hover:text-gray-300 transition-colors">RSS订阅</NavLink>
              <NavLink to="/staff" className="text-white hover:text-gray-300 transition-colors">管理组</NavLink>
              {canReview && (
                <NavLink to="/review" className="text-white hover:text-gray-300 transition-colors">审核</NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 text-sm">
              {/* 上传量显示 */}
              <div className="flex items-center gap-1 text-green-400">
                <Upload className="w-4 h-4" />
                <span>{userSummary ? formatBytes(userSummary.uploadedBytes) : '0B'}</span>
              </div>
              {/* 下载量显示 */}
              <div className="flex items-center gap-1 text-red-400">
                <Download className="w-4 h-4" />
                <span>{userSummary ? formatBytes(userSummary.downloadedBytes) : '0B'}</span>
              </div>
              {/* _ratio显示 */}
              <div className="flex items-center gap-1 text-sky-400">
                <ChartSpline className="w-4 h-4" />
                <span>{userSummary ? userSummary.ratio.toFixed(2) : '0.00'}</span>
              </div>
              {/* 魔力值入口按钮，点击跳转到 /bonus */}
              <div className="flex items-center gap-1 text-yellow-400"
                onClick={() => navigate('/bonus')}
              >
                <Sparkles className="w-4 h-4" />
                <span>{userSummary ? userSummary.bonusPoints.toFixed(2) : '0.00'}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-none relative"
              onClick={() => navigate('/messages?tab=system')}
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
              onClick={() => navigate('/messages?tab=inbox')}
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
                <UserAvatar username={access?.username || '用户'} avatarUrl={access?.avatar || null} size="sm" />
                {/* <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} /> */}
              </button>

              {showUserMenu && (
                <div className="dropdown-menu absolute right-0 top-full mt-2 w-68 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden z-[60]">
                  {/* 用户信息区域 */}
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-b border-neutral-700 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <UserAvatar username={access?.username || '用户'} avatarUrl={access?.avatar || null} size="lg" className="shadow-amber-500/30" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white truncate">{access?.username || '用户'}</div>
                        <div className="text-xs text-neutral-400">VIP会员</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                        <div className="text-green-400 flex items-center justify-center gap-1">
                          <Upload className="w-3 h-3" />
                          {userSummary ? formatBytes(userSummary.uploadedBytes) : '0B'}
                        </div>
                        <div className="text-neutral-500 mt-1">上传</div>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                        <div className="text-red-400 flex items-center justify-center gap-1">
                          <Download className="w-3 h-3" />
                          {userSummary ? formatBytes(userSummary.downloadedBytes) : '0B'}
                        </div>
                        <div className="text-neutral-500 mt-1">下载</div>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                        <div className="text-yellow-400 flex items-center justify-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {userSummary ? userSummary.ratio.toFixed(2) : '0.00'}
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
                        navigate('/torrent-history');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      <History className="w-5 h-5 text-amber-400" />
                      <span>种子记录</span>
                    </button>
                    {canInvite && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/invite');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        <UserPlus className="w-5 h-5 text-amber-400" />
                        <span>邀请管理</span>
                      </button>
                    )}
                    {canBonus && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/bonus');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        <UserPlus className="w-5 h-5 text-amber-400" />
                        <span>魔力管理</span>
                      </button>
                    )}
                    {canControl && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/control');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        <Settings className="w-5 h-5 text-amber-400" />
                        <span>控制面板</span>
                      </button>
                    )}
                  </div>

                  {/* 退出登录 */}
                  <div className="border-t border-neutral-700 py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        try { localStorage.removeItem('accessToken'); } catch { }
                        navigate('/login');
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
        className={`md:hidden fixed left-0 right-0 bg-[#0F171E] border-b border-gray-800 z-[60] overflow-hidden transition-all duration-300 ease-in-out ${showMobileMenu ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        style={{ top: '64px' }}
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
            候选人
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
          {canUpload && (
            <NavLink
              to="/upload"
              className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              上传
            </NavLink>
          )}
          {canEdit && (
            <NavLink
              to="/edit"
              className="text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              编辑
            </NavLink>
          )}
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
        </nav>
      </div>

      {/* 移动端菜单打开时的遮罩层 */}
      {
        showMobileMenu && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-[55]"
            style={{ top: '64px' }}
            onClick={() => setShowMobileMenu(false)}
          />
        )
      }
    </>
  );
}
