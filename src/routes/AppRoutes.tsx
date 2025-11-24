import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { Register } from '../pages/Register';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ApiTest } from '../pages/ApiTest';
import HomePage from '../pages/HomePage';
import TorrentsPage from '../pages/TorrentsPage';
import ForumPage from '../pages/ForumPage';
import SubtitlesPage from '../pages/SubtitlesPage';
import RankingPage from '../pages/RankingPage';
import AppLayout from '../layouts/AppLayout';
import HomeLayout from '../layouts/HomeLayout';
import MoviePage from '../pages/MoviePage';
import TorrentDetailPage from '../pages/TorrentDetailPage/index';
import { UploadTorrentPage } from '../pages/UploadTorrentPage';



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

function AuthRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  if (!isLoggedIn) return <Navigate to="/login" replace />;
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
          <AuthRoute>
            <AppLayout>
              <UploadTorrentPage />
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
