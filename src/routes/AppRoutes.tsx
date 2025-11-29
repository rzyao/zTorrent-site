import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
      {/* 受保护路由 */}
      <Route
        path="/home"
        element={
          <AuthRoute>
            <AppLayout>
              <HomeLayout />
            </AppLayout>
          </AuthRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path=":category" element={<HomePage />} />
        <Route path="movie" element={<MoviePage />} />
        <Route path="movie/:category" element={<MoviePage />} />
      </Route>

      <Route
        path="/torrents"
        element={
          <AuthRoute>
            <AppLayout>
              <TorrentsPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      <Route
        path="/forum"
        element={
          <AuthRoute>
            <AppLayout>
              <ForumPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      <Route
        path="/subtitles"
        element={
          <AuthRoute>
            <AppLayout>
              <SubtitlesPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      <Route
        path="/ranking"
        element={
          <AuthRoute>
            <AppLayout>
              <RankingPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      {/* 新增：魔力值中心路由，登录态保护 + 统一布局 */}
      <Route
        path="/invite"
        element={
          <AuthRoute>
            <AppLayout>
              <InvitePage />
            </AppLayout>
          </AuthRoute>
        }
      />

      <Route
        path="/bonus"
        element={
          <AuthRoute>
            <AppLayout>
              <BonusPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      {/* 求种专区路由：登录态保护 + 统一布局
          说明：该页面用于发布和浏览求种需求，默认仅要求登录。
          如需限制为特定角色或权限，可改为：
          <PermissionRoute requiredPermissions={["page:requests"]}> ... </PermissionRoute>
      */}
      <Route
        path="/requests"
        element={
          <AuthRoute>
            <AppLayout>
              <RequestsPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      <Route
        path="/upload"
        element={
          // 示例：如需按权限控制上传页，替换为 PermissionRoute 并标注所需权限键
          // <PermissionRoute requiredPermissions={["page:upload"]}>
          //   <AppLayout>
          //     <UploadTorrentPage />
          //   </AppLayout>
          // </PermissionRoute>
          <AuthRoute>
            <AppLayout>
              <UploadTorrentPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      {/* 编辑中心路由：登录态保护 + 统一布局
          说明：当前按登录态开放（AuthRoute）。如需仅对特定角色/权限开放，
          可改用 PermissionRoute，并设置 requiredPermissions 或 requiredRoles：
          <PermissionRoute requiredPermissions={["page:edit"]}>
            <AppLayout>
              <EditPage />
            </AppLayout>
          </PermissionRoute>
      */}
      <Route
        path="/edit"
        element={
          <AuthRoute>
            <AppLayout>
              <EditPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      {/* 新增：消息中心路由，登录态保护 + 统一布局 */}
      <Route
        path="/review"
        element={
          <PermissionRoute requiredPermissions={["review:write"]} requiredRoles={["admin"]} combine="OR">
            <AppLayout>
              <ReviewPage />
            </AppLayout>
          </PermissionRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <AuthRoute>
            <AppLayout>
              <MessagesPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      {/* 控制台路由：登录态保护 + 统一布局
          说明：该页面承载账户设置与偏好管理，默认仅要求登录。
          如需限制给特定角色/权限，可改为：
          <PermissionRoute requiredPermissions={["page:control"]}> ... </PermissionRoute>
      */}
      <Route
        path="/control"
        element={
          <AuthRoute>
            <AppLayout>
              <ControlPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      {/* 站点规则路由：登录态保护 + 统一布局
          说明：该页面展示站点规则与说明，默认仅要求登录。
          如需开放给未登录用户，可移除 AuthRoute 改为直接渲染。*/}
      <Route
        path="/rules"
        element={
          <AuthRoute>
            <AppLayout>
              <RulesPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <AuthRoute>
            <AppLayout>
              <StaffPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <AuthRoute>
            <AppLayout>
              <TicketsPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      {/* 管理端系统设置页不在用户端路由中呈现，已移除 */}

      <Route
        path="/torrent-detail/:id"
        element={
          <AuthRoute>
            <AppLayout>
              <TorrentDetailPage />
            </AppLayout>
          </AuthRoute>
        }
      />

      <Route path="/torrent-detail" element={<Navigate to="/torrents" replace />} />



      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}
function NotFoundRedirect() {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  return <Navigate to={isLoggedIn ? '/home' : '/login'} replace />;
}
