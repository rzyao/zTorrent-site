import { Routes, Route, Navigate, useNavigate, useParams, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthService } from '../api';
import { useAccess } from '@/context/AccessContext';
import { LoginPage } from '../pages/LoginPage';
import { Register } from '../pages/Register';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ApiTest } from '../pages/ApiTest';
import HomePage from '../pages/HomePage';
import TorrentsPage from '../pages/TorrentsPage';
import { ForumPage } from '../pages/forum/ForumPage'; // 修复：ForumPage.tsx 为具名导出，使用具名导入以避免默认导出错误
import SubtitlesPage from '../pages/SubtitlesPage';
import RankingPage from '../pages/RankingPage';
import { EditPage } from '../pages/edit/EditPage';
import AppLayout from '../layouts/AppLayout';
import HomeLayout from '../layouts/HomeLayout';
import MoviePage from '../pages/MoviePage';
import TorrentDetailPage from '../pages/TorrentDetailPage/index';
import { UploadTorrentPage } from '../pages/UploadTorrentPage';
import { MessagesPage } from '../pages/MessagesPage'; // 新增：引入消息中心页面（具名导出）
import { ControlPage } from '../pages/ControlPage'; // 新增：控制台页面（具名导出）
import { RequestsPage } from '../pages/RequestsPage'; // 新增：求种专区页面（具名导出）
import { RulesPage } from '../pages/RulesPage'; // 新增：站点规则页面（具名导出）
import { StaffPage } from '../pages/StaffPage';
import { TicketsPage } from '../pages/TicketsPage';
import { ReviewPage } from '../pages/ReviewPage';
// 系统设置页已移除（管理端页面不在用户端呈现）
// 新增：魔力值中心页面（具名导出）
import { BonusPage } from '../pages/BonusPage';
import { InvitePage } from '../pages/InvitePage';
// 新增：影片浏览与片单页面（具名导出）
import { FilmsPage } from '../pages/FilmsPage';
import { PlaylistsPage } from '../pages/PlaylistsPage';
import { PlaylistDetailPage } from '../pages/PlaylistDetailPage';
import FilmDetailPage from '../pages/FilmDetail';
import { TorrentRecordPage } from '../pages/TorrentRecord';



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
  return (
    <Routes>
      {/* 公开路由 登录、注册、忘记密码页面 */}
      <Route path="/login" element={<LoginPageWrapper />} />
      <Route path="/register" element={<RegisterPageWrapper />} />
      <Route path="/forgot-password" element={<ForgotPasswordPageWrapper />} />
      <Route path="/api-test" element={<ApiTest />} />
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
              <HomePage />
            </PermissionRoute>
          } />
          <Route path=":category" element={
            <PermissionRoute requiredPermissions={['page:home']}>
              <HomePage />
            </PermissionRoute>
          } />
          <Route path="movie" element={
            <PermissionRoute requiredPermissions={['page:movie']}>
              <MoviePage />
            </PermissionRoute>
          } />
          <Route path="movie/:category" element={
            <PermissionRoute requiredPermissions={['page:movie']}>
              <MoviePage />
            </PermissionRoute>
          } />
        </Route>

        <Route path="/torrents" element={
          <PermissionRoute requiredPermissions={['page:torrents']}>
            <TorrentsPage />
          </PermissionRoute>
        } />
        <Route path="/forum" element={
          <PermissionRoute requiredPermissions={['page:forum']}>
            <ForumPage />
          </PermissionRoute>
        } />
        <Route path="/subtitles" element={
          <PermissionRoute requiredPermissions={['page:subtitles']}>
            <SubtitlesPage />
          </PermissionRoute>
        } />
        <Route path="/ranking" element={
          <PermissionRoute requiredPermissions={['page:ranking']}>
            <RankingPage />
          </PermissionRoute>
        } />

        {/* 影片与片单 */}
        <Route path="/films" element={
          <PermissionRoute requiredPermissions={['page:films']}>
            <FilmsPage />
          </PermissionRoute>
        } />
        <Route path="/film/:id" element={
          <PermissionRoute requiredPermissions={['page:films']}>
            <FilmDetailRoute />
          </PermissionRoute>
        } />
        <Route path="/playlists" element={
          <PermissionRoute requiredPermissions={['page:playlists']}>
            <PlaylistsPage />
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
            <InvitePage />
          </PermissionRoute>
        } />
        <Route path="/bonus" element={
          <PermissionRoute requiredPermissions={['page:bonus']}>
            <BonusPage />
          </PermissionRoute>
        } />
        <Route path="/torrent-history" element={
          <PermissionRoute requiredPermissions={['page:torrent-history']}>
            <TorrentRecordPage />
          </PermissionRoute>
        } />

        {/* 求种与上传、编辑 */}
        <Route path="/requests" element={
          <PermissionRoute requiredPermissions={['page:requests']}>
            <RequestsPage />
          </PermissionRoute>
        } />
        <Route path="/upload" element={
          <PermissionRoute requiredPermissions={['page:upload']}>
            <UploadTorrentPage />
          </PermissionRoute>
        } />
        <Route path="/edit" element={
          <PermissionRoute requiredPermissions={['page:edit']}>
            <EditPage />
          </PermissionRoute>
        } />

        {/* 审核页需权限守卫，但保持持久布局不重挂载 */}
        <Route
          path="/review"
          element={
            <PermissionRoute requiredPermissions={["review:write"]} requiredRoles={["admin"]} combine="OR">
              <ReviewPage />
            </PermissionRoute>
          }
        />

        <Route path="/messages" element={
          <PermissionRoute requiredPermissions={['page:messages']}>
            <MessagesPage />
          </PermissionRoute>
        } />

        {/* 控制面板 */}
        <Route path="/control" element={
          <PermissionRoute requiredPermissions={['page:control']}>
            <ControlPage />
          </PermissionRoute>
        } />

        {/* 规则、管理组、工单 */}
        <Route path="/rules" element={
          <PermissionRoute requiredPermissions={['page:rules']}>
            <RulesPage />
          </PermissionRoute>
        } />
        <Route path="/staff" element={
          <PermissionRoute requiredPermissions={['page:staff']}>
            <StaffPage />
          </PermissionRoute>
        } />
        <Route path="/tickets" element={
          <PermissionRoute requiredPermissions={['page:tickets']}>
            <TicketsPage />
          </PermissionRoute>
        } />

        {/* 详情与重定向 */}
        <Route path="/torrent/:id" element={
          <PermissionRoute requiredPermissions={['page:torrent']}>
            <TorrentDetailPage />
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
  return <FilmDetailPage filmId={String(id)} />;
}
function NotFoundRedirect() {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  return <Navigate to={isLoggedIn ? '/home' : '/login'} replace />;
}
