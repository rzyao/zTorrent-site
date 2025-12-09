import { Routes, Route, Navigate, useNavigate, useParams, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAccess } from '@/context/AccessContext.tsx';
import { LoginPage } from '@/pages/LoginPage.tsx';
import { Register } from '@/pages/Register.tsx';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage.tsx';
import AppLayout from '../layouts/AppLayout.tsx';
import HomeLayout from '../layouts/HomeLayout.tsx';
const Fallback = <div style={{ padding: 24, color: '#ccc' }}>加载中…</div>;

const HomePage = lazy(() => import('@/pages/HomePage.tsx'));
const TorrentsPage = lazy(() => import('@/pages/TorrentsList/index.tsx'));
const ForumPage = lazy(() => import('@/pages/Forum/ForumPage.tsx').then(m => ({ default: m.ForumPage })));
const SubtitlesPage = lazy(() => import('@/pages/Subtitles/index.tsx').then(m => ({ default: m.SubtitlesPage })));
const RankingPage = lazy(() => import('@/pages/RankingPage.tsx'));
const EditMoviePage = lazy(() => import('@/pages/Edit/movies/index.tsx').then(m => ({ default: m.EditMoviePage })));
const EditPlaylistPage = lazy(() => import('@/pages/Edit/playlists/index.tsx').then(m => ({ default: m.EditPlaylistPage })));
const MoviePage = lazy(() => import('@/pages/MoviePage.tsx'));
const UploadTorrentPage = lazy(() => import('@/pages/UploadTorrent/index.tsx').then(m => ({ default: m.UploadTorrentPage })));
const MessagesPage = lazy(() => import('@/pages/Messages/index.tsx').then(m => ({ default: m.MessagesPage })));
const ControlPage = lazy(() => import('@/pages/Control/index.tsx').then(m => ({ default: m.ControlPage })));
const RequestsPage = lazy(() => import('@/pages/Requests/index.tsx').then(m => ({ default: m.RequestsPage })));
const RulesPage = lazy(() => import('@/pages/Rules/index.tsx').then(m => ({ default: m.RulesPage })));
const StaffPage = lazy(() => import('@/pages/Staff/index.tsx').then(m => ({ default: m.StaffPage })));
const TicketsPage = lazy(() => import('@/pages/Tickets/TicketsPage.tsx').then(m => ({ default: m.TicketsPage })));
const ReviewPage = lazy(() => import('@/pages/Review/index.tsx').then(m => ({ default: m.ReviewPage })));
const BonusPage = lazy(() => import('@/pages/Bonus/index.tsx').then(m => ({ default: m.BonusPage })));
const InvitePage = lazy(() => import('@/pages/Invite/InvitePage.tsx').then(m => ({ default: m.InvitePage })));
const FilmsPage = lazy(() => import('@/pages/FilmsPage.tsx').then(m => ({ default: m.FilmsPage })));
const PlaylistsPage = lazy(() => import('@/pages/PlaylistsPage.tsx').then(m => ({ default: m.PlaylistsPage })));
const PlaylistDetailPage = lazy(() => import('@/pages/PlaylistDetail/PlaylistDetailPage.tsx').then(m => ({ default: m.PlaylistDetailPage })));
const TorrentDetailPage = lazy(() => import('@/pages/TorrentDetail/index.tsx'));
const FilmDetailPage = lazy(() => import('@/pages/FilmDetail/FilmDetailPage.tsx'));
const TorrentRecordPage = lazy(() => import('@/pages/TorrentRecord/index.tsx').then(m => ({ default: m.TorrentRecordPage })));
const RSSPage = lazy(() => import('@/pages/RSSPage.tsx').then(m => ({ default: m.RSSPage })));
const GroupsPage = lazy(() => import('@/pages/Groups/GroupsPage.tsx').then(m => ({ default: m.GroupsPage })));
const CandidatesPage = lazy(() => import('@/pages/Candidates/index.tsx').then(m => ({ default: m.CandidatesPage })));
const TutorialsPage = lazy(() => import('@/pages/Tutorials/index.tsx').then(m => ({ default: m.TutorialsPage })));
const SeedingPage = lazy(() => import('@/pages/SeedingPage.tsx').then(m => ({ default: m.SeedingPage })));
const DownloaderPage = lazy(() => import('@/pages/Downloader/index.tsx').then(m => ({ default: m.DownloaderPage })));
const DeadTorrentsPage = lazy(() => import('@/pages/DeadTorrents/index.tsx').then(m => ({ default: m.DeadTorrentsPage })));
const GamesPage = lazy(() => import('@/pages/Games/index.tsx').then(m => ({ default: m.GamesPage })));
const MagicFarmPage = lazy(() => import('@/pages/MagicFarm/index.tsx').then(m => ({ default: m.MagicFarmPage })));
const AnnouncementsPage = lazy(() => import('@/pages/Announcements/index.tsx').then(m => ({ default: m.AnnouncementsPage })));



function LoginPageWrapper() {
  const navigate = useNavigate();
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(search);
  const from = params.get('from') || '/home';
  const isLoggedIn = !!localStorage.getItem('accessToken');
  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }
  return (
    <LoginPage
      onForgotPassword={() => navigate('/forgot-password')}
      onRegister={() => navigate('/register')}
      onLoginSuccess={() => navigate(from)}
      onTestApi={() => navigate('/api-test')}
    />
  );
}

function RegisterPageWrapper() {
  const navigate = useNavigate();
  return (
    <Register onBack={() => navigate('/login')} onRegisterSuccess={() => navigate('/login')} />
  );
}

function ForgotPasswordPageWrapper() {
  const navigate = useNavigate();
  return <ForgotPasswordPage onBack={() => navigate('/login')} />;
}

/**
 * 基础登录态守卫：仅判断是否已登录
 * 现有项目默认使用该守卫保护需要登录的页面
 */
function AuthRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * 用户权限数据（来自后端 /auth/profile）结构
 */
// 统一从 AccessContext 获取权限数据

/**
 * 基于后端权限字符的高级路由守卫
 * 用法示例：
 * <PermissionRoute requiredPermissions={["page:upload"]}>
 *   <AppLayout><UploadTorrentPage /></AppLayout>
 * </PermissionRoute>
 *
 * 校验策略：
 * - 先检查是否已登录
 * - 拉取用户 roles/permissions 后进行匹配
 * - 默认 matchAll=true：必须全部满足；设为 false 时只需满足其中任意一个
 * - 任一校验失败时，重定向到 /home（也可按需改为提示页）
 */
function PermissionRoute({
  children,
  requiredPermissions,
  requiredRoles,
  matchAll = true,
  combine = 'AND',
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  matchAll?: boolean;
  combine?: 'AND' | 'OR';
}) {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const { access, loading } = useAccess();
  if (loading) return <div style={{ padding: 24, color: '#ccc' }}>加载中…</div>;

  // 检查角色与权限是否满足要求
  const hasRequired = () => {
    const hasRoles = !requiredRoles || requiredRoles.length === 0
      ? true
      : matchAll
        ? requiredRoles.every(r => access.roles.includes(r))
        : requiredRoles.some(r => access.roles.includes(r));

    const hasPerms = !requiredPermissions || requiredPermissions.length === 0
      ? true
      : matchAll
        ? requiredPermissions.every(p => access.permissions.includes(p))
        : requiredPermissions.some(p => access.permissions.includes(p));

    return hasRoles && hasPerms;
  };

  const hasAnyRequired = () => {
    const rolesOk = !requiredRoles || requiredRoles.length === 0 ? true : hasRequired();
    const permsOk = !requiredPermissions || requiredPermissions.length === 0 ? true : hasRequired();
    if (combine === 'OR') {
      const hasRoles = !requiredRoles || requiredRoles.length === 0 ? false : (
        matchAll ? requiredRoles.every(r => access.roles.includes(r)) : requiredRoles.some(r => access.roles.includes(r))
      );
      const hasPerms = !requiredPermissions || requiredPermissions.length === 0 ? false : (
        matchAll ? requiredPermissions.every(p => access.permissions.includes(p)) : requiredPermissions.some(p => access.permissions.includes(p))
      );
      return hasRoles || hasPerms;
    }
    return hasRequired();
  };

  if (access.username === 'admin') return <>{children}</>;
  if (!hasAnyRequired()) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* 公开路由 登录、注册、忘记密码页面 */}
      <Route path="/login" element={<LoginPageWrapper />} />
      <Route path="/register" element={<RegisterPageWrapper />} />
      <Route path="/forgot-password" element={<ForgotPasswordPageWrapper />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      {/* 受保护路由统一持久布局：AuthRoute + AppLayout 持久化，内部通过 Outlet 渲染子页面 */}
      <Route
        element={
          <AuthRoute>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </AuthRoute>
        }
      >
        <Route
          path="/home"
          element={
            <PermissionRoute>
              <HomeLayout />
            </PermissionRoute>
          }
        >
          <Route index element={
            <PermissionRoute requiredPermissions={['page:home']}>
              <Suspense fallback={Fallback}>
                <HomePage />
              </Suspense>
            </PermissionRoute>
          } />
          <Route path=":category" element={
            <PermissionRoute requiredPermissions={['page:home']}>
              <Suspense fallback={Fallback}>
                <HomePage />
              </Suspense>
            </PermissionRoute>
          } />
          <Route path="movie" element={
            <PermissionRoute requiredPermissions={['page:movie']}>
              <Suspense fallback={Fallback}>
                <MoviePage />
              </Suspense>
            </PermissionRoute>
          } />
          <Route path="movie/:category" element={
            <PermissionRoute requiredPermissions={['page:movie']}>
              <Suspense fallback={Fallback}>
                <MoviePage />
              </Suspense>
            </PermissionRoute>
          } />
        </Route>

        <Route path="/torrents" element={
          <PermissionRoute requiredPermissions={['page:torrents']}>
            <Suspense fallback={Fallback}>
              <TorrentsPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/forum" element={
          <PermissionRoute requiredPermissions={['page:forum']}>
            <Suspense fallback={Fallback}>
              <ForumPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/subtitles" element={<Suspense fallback={Fallback}><SubtitlesPage /></Suspense>} />
        <Route path="/ranking" element={
          <PermissionRoute requiredPermissions={['page:ranking']}>
            <Suspense fallback={Fallback}>
              <RankingPage />
            </Suspense>
          </PermissionRoute>
        } />

        {/* 影片与片单 */}
        <Route path="/films" element={
          <PermissionRoute requiredPermissions={['page:films']}>
            <Suspense fallback={Fallback}>
              <FilmsPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/film/:id" element={
          <PermissionRoute requiredPermissions={['page:films']}>
            <FilmDetailRoute />
          </PermissionRoute>
        } />
        <Route path="/playlists" element={
          <PermissionRoute requiredPermissions={['page:playlists']}>
            <Suspense fallback={Fallback}>
              <PlaylistsPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/playlist/:id" element={
          <PermissionRoute requiredPermissions={['page:playlists']}>
            <PlaylistDetailPageWrapper />
          </PermissionRoute>
        } />

        {/* 魔力值与邀请、历史 */}
        <Route path="/invite" element={
          <PermissionRoute requiredPermissions={['page:invite']}>
            <Suspense fallback={Fallback}>
              <InvitePage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/bonus" element={
          <PermissionRoute requiredPermissions={['page:bonus']}>
            <Suspense fallback={Fallback}>
              <BonusPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/torrent-history" element={
          <PermissionRoute requiredPermissions={['page:torrent-history']}>
            <Suspense fallback={Fallback}>
              <TorrentRecordPage />
            </Suspense>
          </PermissionRoute>
        } />

        {/* 求种与上传、编辑 */}
        <Route path="/requests" element={
          <PermissionRoute requiredPermissions={['page:requests']}>
            <Suspense fallback={Fallback}>
              <RequestsPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/upload" element={
          <Suspense fallback={Fallback}>
            <UploadTorrentPage />
          </Suspense>
        } />
        {/* 新增：编辑页面拆分为两个独立路由（不做旧兼容，移除 /edit） */}
        <Route path="/edit/movie" element={
          <PermissionRoute requiredPermissions={['page:edit']}>
            <Suspense fallback={Fallback}>
              <EditMoviePage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/edit/playlist" element={
          <PermissionRoute requiredPermissions={['page:edit']}>
            <Suspense fallback={Fallback}>
              <EditPlaylistPage />
            </Suspense>
          </PermissionRoute>
        } />

        {/* 审核页需权限守卫，但保持持久布局不重挂载 */}
        <Route
          path="/review"
          element={
            <PermissionRoute requiredPermissions={["review:write"]} requiredRoles={["admin"]} combine="OR">
              <Suspense fallback={Fallback}>
                <ReviewPage />
              </Suspense>
            </PermissionRoute>
          }
        />

        <Route path="/messages" element={
          <PermissionRoute requiredPermissions={['page:messages']}>
            <Suspense fallback={Fallback}>
              <MessagesPage />
            </Suspense>
          </PermissionRoute>
        } />

        {/* 控制面板 */}
        <Route path="/control" element={
          <PermissionRoute requiredPermissions={['page:control']}>
            <Suspense fallback={Fallback}>
              <ControlPage />
            </Suspense>
          </PermissionRoute>
        } />

        {/* 规则、管理组、工单 */}
        <Route path="/groups" element={<Suspense fallback={Fallback}><GroupsPage /></Suspense>} />
        <Route path="/candidates" element={<Suspense fallback={Fallback}><CandidatesPage /></Suspense>} />
        <Route path="/rules" element={
          <PermissionRoute requiredPermissions={['page:rules']}>
            <Suspense fallback={Fallback}>
              <RulesPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/staff" element={
          <PermissionRoute requiredPermissions={['page:staff']}>
            <Suspense fallback={Fallback}>
              <StaffPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/tickets" element={
          <PermissionRoute requiredPermissions={['page:tickets']}>
            <Suspense fallback={Fallback}>
              <TicketsPage />
            </Suspense>
          </PermissionRoute>
        } />

        {/* 教程 */}
        <Route path="/tutorials" element={<Suspense fallback={Fallback}><TutorialsPage /></Suspense>} />

        {/* 保种列表 */}
        <Route path="/seeding" element={<Suspense fallback={Fallback}><SeedingPage /></Suspense>} />

        {/* 下载器 */}
        <Route path="/downloader" element={<Suspense fallback={Fallback}><DownloaderPage /></Suspense>} />

        {/* 断种大厅 */}
        <Route path="/dead-torrents" element={<Suspense fallback={Fallback}><DeadTorrentsPage /></Suspense>} />

        <Route path="/rss" element={<Suspense fallback={Fallback}><RSSPage /></Suspense>} />

        {/* 站点公告 */}
        <Route path="/announcements" element={<Suspense fallback={Fallback}><AnnouncementsPage /></Suspense>} />

        {/* 小游戏 */}
        <Route path="/games" element={<Suspense fallback={Fallback}><GamesPage onNavigateMagicFarm={() => navigate('/magicfarm')} /></Suspense>} />

        {/* 魔力农场 */}
        <Route path="/magicfarm" element={<Suspense fallback={Fallback}><MagicFarmPage /></Suspense>} />

        {/* 详情与重定向 */}
        <Route path="/torrent/:id" element={
          <PermissionRoute requiredPermissions={['page:torrent']}>
            {/* 使用 Suspense 包裹懒加载组件，fallback 为加载占位 */}
            <Suspense fallback={Fallback}>
              <TorrentDetailPage />
            </Suspense>
          </PermissionRoute>
        } />
        <Route path="/torrent" element={<Navigate to="/torrents" replace />} />
      </Route>

      {/* 未登录或未匹配路径的重定向 */}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}
function PlaylistDetailPageWrapper() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ?? '';
  if (!id) return <Navigate to="/playlists" replace />;
  return (
    <PlaylistDetailPage
      playlistId={id}
      onBack={() => navigate('/playlists')}
      onFilmClick={() => { }}
    />
  );
}
function FilmDetailRoute() {
  const params = useParams();
  const id = params.id ?? '';
  if (!id) return <Navigate to="/films" replace />;
  return (
    // 使用 Suspense 以在懒加载期间展示占位，提高用户体验
    <Suspense fallback={<div style={{ padding: 24, color: '#ccc' }}>加载中…</div>}>
      <FilmDetailPage filmId={String(id)} />
    </Suspense>
  );
}
function NotFoundRedirect() {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  return <Navigate to={isLoggedIn ? '/home' : '/login'} replace />;
}
