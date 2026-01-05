import { Routes, Route, Navigate, useNavigate, useParams, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import AppLayout from "../layouts/AppLayout.tsx";

// 导入模块化路由
import { ForumRoutes } from "./forumRoutes";
import { AdminRoutes } from "./adminRoutes";
import { AuthRoute, PermissionRoute } from "./guards";

const LoginPage = lazy(() => import("@/pages/Login.tsx"));
const Register = lazy(() => import("@/pages/Register.tsx"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPassword.tsx"));

const HomePage = lazy(() => import("@/pages/Home.tsx"));
const AdultPage = lazy(() => import("@/pages/Adult/index.tsx"));
const TorrentsPage = lazy(() => import("@/pages/TorrentsList/index.tsx"));
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

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* 公开路由 登录、注册、忘记密码页面 */}
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/register" element={<RegisterPageWrapper />} />
        <Route path="/forgot-password" element={<ForgotPasswordPageWrapper />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* 论坛模块路由 (独立布局) */}
        {ForumRoutes()}

        {/* 管理后台模块路由 (独立布局) */}
        {AdminRoutes()}

        {/* 受保护路由统一持久布局：AuthRoute + AppLayout */}
        <Route
          element={
            <AuthRoute>
              <AppLayout>
                <Outlet />
              </AppLayout>
            </AuthRoute>
          }
        >
          {/* ==================== 浏览型页面：仅需登录 ==================== */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/torrents" element={<TorrentsPage />} />
          <Route path="/torrent/:id" element={<TorrentDetailPage />} />
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

          {/* ==================== 权限控制页面 ==================== */}
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
              <PermissionRoute requiredPermissions={["edit:movie"]} name="编辑电影">
                <EditMoviePage />
              </PermissionRoute>
            }
          />
          <Route
            path="/edit/series"
            element={
              <PermissionRoute requiredPermissions={["edit:series"]} name="编辑剧集">
                <EditSeriesPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/edit/playlist"
            element={
              <PermissionRoute requiredPermissions={["edit:playlist"]} name="编辑播放列表">
                <EditPlaylistPage />
              </PermissionRoute>
            }
          />

          {/* 求种与悬赏 */}
          <Route path="/requests" element={<RequestsPage />} />

          {/* 魔力值与邀请 */}
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/bonus" element={<BonusPage />} />
          <Route path="/torrent-history" element={<TorrentRecordPage />} />

          {/* 消息与工单 */}
          <Route path="/messages" element={<MessagesPage />} />
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
