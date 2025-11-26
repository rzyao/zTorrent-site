import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthService } from '../api';
import { LoginPage } from '../pages/LoginPage';
import { Register } from '../pages/Register';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ApiTest } from '../pages/ApiTest';
import HomePage from '../pages/HomePage';
import TorrentsPage from '../pages/TorrentsPage';
import { ForumPage } from '../pages/ForumPage'; // 修复：ForumPage.tsx 为具名导出，使用具名导入以避免默认导出错误
import SubtitlesPage from '../pages/SubtitlesPage';
import RankingPage from '../pages/RankingPage';
import AppLayout from '../layouts/AppLayout';
import HomeLayout from '../layouts/HomeLayout';
import MoviePage from '../pages/MoviePage';
import TorrentDetailPage from '../pages/TorrentDetailPage/index';
import { UploadTorrentPage } from '../pages/UploadTorrentPage';
import { MessagesPage } from '../pages/MessagesPage'; // 新增：引入消息中心页面（具名导出）



function LoginPageWrapper() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onForgotPassword={() => navigate('/forgot-password')}
      onRegister={() => navigate('/register')}
      onLoginSuccess={() => navigate('/home')}
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
type UserAccess = {
  roles: string[];
  permissions: string[];
};

/**
 * 拉取并缓存当前用户的角色/权限集合
 * 说明：
 * - 为了最小侵入，此处仅在需要权限校验时拉取，避免每次路由切换重复请求
 * - 解析响应时兼容后端返回的包裹结构（存在 code/message/data）
 */
function useUserAccess() {
  const [access, setAccess] = useState<UserAccess>({ roles: [], permissions: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    AuthService.authControllerProfile()
      .then((resp: any) => {
        // 兼容响应包裹：优先取 resp.data，再取 resp
        const body = resp?.code !== undefined ? resp : resp?.data;
        const data = body?.data ?? body;
        const roles: string[] = Array.isArray(data?.roles) ? data.roles : [];
        const permissions: string[] = Array.isArray(data?.permissions) ? data.permissions : [];
        if (mounted) setAccess({ roles, permissions });
      })
      .catch((e: any) => {
        if (mounted) setError(e?.message || '获取用户权限失败');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // 登录状态变化时（登录/登出），由 useAuth 派发 authChange 事件，这里可选择性重载
    const reloadOnAuthChange = () => {
      const t = localStorage.getItem('accessToken');
      if (!t) {
        setAccess({ roles: [], permissions: [] });
        return;
      }
      setLoading(true);
      setError(null);
      AuthService.authControllerProfile()
        .then((resp: any) => {
          const body = resp?.code !== undefined ? resp : resp?.data;
          const data = body?.data ?? body;
          const roles: string[] = Array.isArray(data?.roles) ? data.roles : [];
          const permissions: string[] = Array.isArray(data?.permissions) ? data.permissions : [];
          setAccess({ roles, permissions });
        })
        .catch((e: any) => setError(e?.message || '获取用户权限失败'))
        .finally(() => setLoading(false));
    };

    window.addEventListener('authChange', reloadOnAuthChange);
    return () => {
      mounted = false;
      window.removeEventListener('authChange', reloadOnAuthChange);
    };
  }, []);

  return { access, loading, error };
}

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
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  matchAll?: boolean;
}) {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const { access, loading } = useUserAccess();
  if (loading) return <></>; // 可替换为全局加载组件

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

  if (!hasRequired()) return <Navigate to="/home" replace />;
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

      {/* 新增：消息中心路由，登录态保护 + 统一布局 */}
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
