import { Routes, Route, Navigate, useNavigate, useParams, Outlet } from "react-router-dom";
import { useAccess } from "@/context/AccessContext.tsx";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import AppLayout from "../layouts/AppLayout.tsx";

const LoginPage = lazy(() => import("@/pages/Login.tsx"));
const Register = lazy(() => import("@/pages/Register.tsx"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPassword.tsx"));

const HomePage = lazy(() => import("@/pages/Home.tsx"));
const AdultPage = lazy(() => import("@/pages/Adult/index.tsx"));
const TorrentsPage = lazy(() => import("@/pages/TorrentsList/index.tsx"));
const ForumPage = lazy(() => import("@/pages/Forum/index.tsx"));
const SubtitlesPage = lazy(() => import("@/pages/Subtitles/index.tsx"));
const RankingPage = lazy(() => import("@/pages/RankingPage.tsx"));
const EditMoviePage = lazy(() => import("@/pages/Edit/movies/index.tsx"));
const EditSeriesPage = lazy(() => import("@/pages/Edit/series/index.tsx"));
const EditPlaylistPage = lazy(() => import("@/pages/Edit/playlists/index.tsx"));
const UploadTorrentPage = lazy(() => import("@/pages/UploadTorrent/index.tsx"));
const MessagesPage = lazy(() => import("@/pages/Messages/index.tsx"));
const ControlPage = lazy(() => import("@/pages/Control/index.tsx"));
const RequestsPage = lazy(() => import("@/pages/Requests/index.tsx"));
const RulesPage = lazy(() => import("@/pages/Rules/index.tsx"));
const StaffPage = lazy(() => import("@/pages/Staff/index.tsx"));
const TicketsPage = lazy(() => import("@/pages/Tickets/TicketsPage.tsx"));
const ReviewPage = lazy(() => import("@/pages/Review/index.tsx"));
const BonusPage = lazy(() => import("@/pages/Bonus/index.tsx"));
const InvitePage = lazy(() => import("@/pages/Invite/InvitePage.tsx"));
const MoviesPage = lazy(() => import("@/pages/Movies/index.tsx"));
const SeriesPage = lazy(() => import("@/pages/Series/index.tsx"));
const PlaylistsPage = lazy(() => import("@/pages/Playlists/index.tsx"));
const PlaylistDetailPage = lazy(() => import("@/pages/PlaylistDetail/index.tsx"));
const TorrentDetailPage = lazy(() => import("@/pages/TorrentDetail/index.tsx"));
const MovieDetailPage = lazy(() => import("@/pages/MovieDetail/index.tsx"));
const EpisodeDetailPage = lazy(() => import("@/pages/EpisodeDetail/index.tsx"));
const SeriesDetailPage = lazy(() => import("@/pages/SeriesDetail/index.tsx"));
const TorrentRecordPage = lazy(() => import("@/pages/TorrentRecord/index.tsx"));
const RSSPage = lazy(() => import("@/pages/RSSPage.tsx"));
const GroupsPage = lazy(() => import("@/pages/Groups/GroupsPage.tsx"));
const CandidatesPage = lazy(() => import("@/pages/Candidates/index.tsx"));
const TutorialsPage = lazy(() => import("@/pages/Tutorials/index.tsx"));
const SeedingPage = lazy(() => import("@/pages/SeedingPage.tsx"));

const DeadTorrentsPage = lazy(() => import("@/pages/DeadTorrents/index.tsx"));
const GamesPage = lazy(() => import("@/pages/Games/index.tsx"));
const MagicFarmPage = lazy(() => import("@/pages/MagicFarm/index.tsx"));
const AnnouncementsPage = lazy(() => import("@/pages/Announcements/index.tsx"));
const MusicPage = lazy(() => import("@/pages/Music/index.tsx"));
const PlayerPage = lazy(() => import("@/pages/PlayerPage/index.tsx"));
const DesignPage = lazy(() => import("@/pages/design.tsx"));
const FavoritesPage = lazy(() => import("@/pages/Favorites/index.tsx"));

function LoginPageWrapper() {
  const navigate = useNavigate();
  const search = typeof window !== "undefined" ? window.location.search : "";
  const params = new URLSearchParams(search);
  const from = params.get("from") || "/home";
  const isLoggedIn = !!localStorage.getItem("accessToken");
  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }
  return (
    <LoginPage
      onForgotPassword={() => navigate("/forgot-password")}
      onRegister={() => navigate("/register")}
      onLoginSuccess={() => navigate(from)}
      onTestApi={() => navigate("/api-test")}
    />
  );
}

function RegisterPageWrapper() {
  const navigate = useNavigate();
  return (
    <Register onBack={() => navigate("/login")} onRegisterSuccess={() => navigate("/login")} />
  );
}

function ForgotPasswordPageWrapper() {
  const navigate = useNavigate();
  return <ForgotPasswordPage onBack={() => navigate("/login")} />;
}

/**
 * 基础登录态守卫：仅判断是否已登录
 * 现有项目默认使用该守卫保护需要登录的页面
 */
function AuthRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem("accessToken");
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
 * <PermissionRoute requiredPermissions={["upload"]}>
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
  combine = "AND",
  name,
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  matchAll?: boolean;
  combine?: "AND" | "OR";
  name?: string;
}) {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const { access, loading } = useAccess();
  if (loading) return <div style={{ padding: 24, color: "#ccc" }}>加载中…</div>;

  // 检查角色与权限是否满足要求
  const hasRequired = () => {
    const hasRoles =
      !requiredRoles || requiredRoles.length === 0
        ? true
        : matchAll
          ? requiredRoles.every((r) => access.roles.includes(r))
          : requiredRoles.some((r) => access.roles.includes(r));

    const hasPerms =
      !requiredPermissions || requiredPermissions.length === 0
        ? true
        : matchAll
          ? requiredPermissions.every((p) => access.permissions.includes(p))
          : requiredPermissions.some((p) => access.permissions.includes(p));

    return hasRoles && hasPerms;
  };

  const hasAnyRequired = () => {
    const rolesOk = !requiredRoles || requiredRoles.length === 0 ? true : hasRequired();
    const permsOk = !requiredPermissions || requiredPermissions.length === 0 ? true : hasRequired();
    if (combine === "OR") {
      const hasRoles =
        !requiredRoles || requiredRoles.length === 0
          ? false
          : matchAll
            ? requiredRoles.every((r) => access.roles.includes(r))
            : requiredRoles.some((r) => access.roles.includes(r));
      const hasPerms =
        !requiredPermissions || requiredPermissions.length === 0
          ? false
          : matchAll
            ? requiredPermissions.every((p) => access.permissions.includes(p))
            : requiredPermissions.some((p) => access.permissions.includes(p));
      return hasRoles || hasPerms;
    }
    return hasRequired();
  };

  if (access.username === "admin") return <>{children}</>;
  if (!hasAnyRequired()) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
          {/* ==================== 浏览型页面：仅需登录，无需细粒度权限 ==================== */}
          {/* 首页与基础浏览 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/torrents" element={<TorrentsPage />} />
          <Route path="/torrent/:id" element={<TorrentDetailPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/subtitles" element={<SubtitlesPage />} />
          <Route path="/ranking" element={<RankingPage />} />

          {/* 电影与剧集 */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetailRoute />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/series/:id" element={<SeriesDetailRoute />} />
          <Route path="/episodes/:id" element={<EpisodeDetailPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlist/:id" element={<PlaylistDetailPageWrapper />} />

          {/* 站点信息展示 */}
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />

          {/* ==================== 权限控制页面：需要细粒度权限 ==================== */}
          {/* 成人区 */}
          <Route
            path="/adult"
            element={
              <PermissionRoute requiredPermissions={["adult"]} name="成人区">
                <AdultPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/adult/:category"
            element={
              <PermissionRoute requiredPermissions={["adult"]} name="成人区">
                <AdultPage />
              </PermissionRoute>
            }
          />

          {/* 上传 */}
          <Route
            path="/upload"
            element={
              <PermissionRoute requiredPermissions={["upload"]} name="上传">
                <UploadTorrentPage />
              </PermissionRoute>
            }
          />
          {/* 编辑 */}
          <Route
            path="/edit/movie"
            element={
              <PermissionRoute requiredPermissions={["edit"]} name="编辑电影">
                <EditMoviePage />
              </PermissionRoute>
            }
          />
          <Route
            path="/edit/series"
            element={
              <PermissionRoute requiredPermissions={["edit"]} name="编辑剧集">
                <EditSeriesPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/edit/playlist"
            element={
              <PermissionRoute requiredPermissions={["edit"]} name="编辑播放列表">
                <EditPlaylistPage />
              </PermissionRoute>
            }
          />
          {/* 审核 */}
          <Route
            path="/review"
            element={
              <PermissionRoute requiredPermissions={["review"]} name="审核">
                <ReviewPage />
              </PermissionRoute>
            }
          />

          {/* 求种与悬赏 */}
          <Route path="/requests" element={<RequestsPage />} />

          {/* 魔力值与邀请 */}
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/bonus" element={<BonusPage />} />
          <Route path="/torrent-history" element={<TorrentRecordPage />} />
          <Route path="/torrent-history" element={<TorrentRecordPage />} />

          {/* 消息与工单 */}
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />

          {/* 高级功能 */}
          <Route path="/rss" element={<RSSPage />} />
          <Route path="/seeding" element={<SeedingPage />} />
          <Route path="/dead-torrents" element={<DeadTorrentsPage />} />

          {/* 娱乐功能 */}
          <Route path="/games" element={<GamesPage />} />
          <Route path="/magicfarm" element={<MagicFarmPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/player" element={<PlayerPage />} />

          {/* 管理功能 */}
          <Route path="/groups" element={<GroupsPage />} />
          {/* 候选 */}
          <Route path="/candidates" element={<CandidatesPage />} />

          {/* 控制 */}
          <Route path="/control" element={<ControlPage />} />
          {/* 设计 */}
          <Route path="/design" element={<DesignPage />} />
        </Route>

        {/* 未登录或未匹配路径的重定向 */}
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Suspense>
  );
}
function PlaylistDetailPageWrapper() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ?? "";
  if (!id) return <Navigate to="/playlists" replace />;
  return (
    <PlaylistDetailPage
      playlistId={id}
      onBack={() => navigate("/playlists")}
      onFilmClick={() => {}}
    />
  );
}

// 电影详情页路由组件
function MovieDetailRoute() {
  const params = useParams();
  const id = params.id ?? "";
  if (!id) return <Navigate to="/movies" replace />;
  return <MovieDetailPage filmId={String(id)} />;
}

// 剧集详情页路由组件
function SeriesDetailRoute() {
  const params = useParams();
  const id = params.id ?? "";
  if (!id) return <Navigate to="/series" replace />;
  return <SeriesDetailPage />;
}

function NotFoundRedirect() {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return <Navigate to={isLoggedIn ? "/home" : "/login"} replace />;
}
