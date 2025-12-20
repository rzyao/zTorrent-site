import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  Outlet,
} from "react-router-dom";
import { useAccess } from "@/context/AccessContext.tsx";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { Register } from "@/pages/Register.tsx";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage.tsx";
import AppLayout from "../layouts/AppLayout.tsx";

import { HomePage } from "@/pages/HomePage.tsx";
import AdultPage from "@/pages/Adult/index.tsx";
import TorrentsPage from "@/pages/TorrentsList/index.tsx";
import { ForumPage } from "@/pages/Forum/index.tsx";
import { SubtitlesPage } from "@/pages/Subtitles/index.tsx";
import RankingPage from "@/pages/RankingPage.tsx";
import { EditMoviePage } from "@/pages/Edit/movies/index.tsx";
import { EditSeriesPage } from "@/pages/Edit/series/index.tsx";
import { EditPlaylistPage } from "@/pages/Edit/playlists/index.tsx";
import { UploadTorrentPage } from "@/pages/UploadTorrent/index.tsx";
import { MessagesPage } from "@/pages/Messages/index.tsx";
import { ControlPage } from "@/pages/Control/index.tsx";
import { RequestsPage } from "@/pages/Requests/index.tsx";
import { RulesPage } from "@/pages/Rules/index.tsx";
import { StaffPage } from "@/pages/Staff/index.tsx";
import { TicketsPage } from "@/pages/Tickets/TicketsPage.tsx";
import { ReviewPage } from "@/pages/Review/index.tsx";
import { BonusPage } from "@/pages/Bonus/index.tsx";
import { InvitePage } from "@/pages/Invite/InvitePage.tsx";
import { MoviesPage } from "@/pages/Movies/index.tsx";
import { SeriesPage } from "@/pages/Series/index.tsx";
import { PlaylistsPage } from "@/pages/Playlists/index.tsx";
import { PlaylistDetailPage } from "@/pages/PlaylistDetail/PlaylistDetailPage.tsx";
import TorrentDetailPage from "@/pages/TorrentDetail/index.tsx";
import MovieDetailPage from "@/pages/MovieDetail/index.tsx";
import { EpisodeDetailPage } from "@/pages/EpisodeDetail/EpisodeDetailPage.tsx";
import { SeriesDetailPage } from "@/pages/SeriesDetail/SeriesDetailPage.tsx";
import { TorrentRecordPage } from "@/pages/TorrentRecord/index.tsx";
import { RSSPage } from "@/pages/RSSPage.tsx";
import { GroupsPage } from "@/pages/Groups/GroupsPage.tsx";
import { CandidatesPage } from "@/pages/Candidates/index.tsx";
import { TutorialsPage } from "@/pages/Tutorials/index.tsx";
import { SeedingPage } from "@/pages/SeedingPage.tsx";

import { DeadTorrentsPage } from "@/pages/DeadTorrents/index.tsx";
import { GamesPage } from "@/pages/Games/index.tsx";
import { MagicFarmPage } from "@/pages/MagicFarm/index.tsx";
import { AnnouncementsPage } from "@/pages/Announcements/index.tsx";
import { MusicPage } from "@/pages/MusicPage.tsx";
import { PlayerPage } from "@/pages/PlayerPage.tsx";

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
    <Register
      onBack={() => navigate("/login")}
      onRegisterSuccess={() => navigate("/login")}
    />
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
    const rolesOk =
      !requiredRoles || requiredRoles.length === 0 ? true : hasRequired();
    const permsOk =
      !requiredPermissions || requiredPermissions.length === 0
        ? true
        : hasRequired();
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
            <PermissionRoute requiredPermissions={["page:adult"]} name="成人区">
              <AdultPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/adult/:category"
          element={
            <PermissionRoute requiredPermissions={["page:adult"]} name="成人区">
              <AdultPage />
            </PermissionRoute>
          }
        />

        {/* 上传与编辑 */}
        <Route
          path="/upload"
          element={
            <PermissionRoute requiredPermissions={["page:upload"]} name="上传资源">
              <UploadTorrentPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/edit/movie"
          element={
            <PermissionRoute requiredPermissions={["page:edit:movie"]} name="编辑电影">
              <EditMoviePage />
            </PermissionRoute>
          }
        />
        <Route
          path="/edit/series"
          element={
            <PermissionRoute requiredPermissions={["page:edit:series"]} name="编辑剧集">
              <EditSeriesPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/edit/playlist"
          element={
            <PermissionRoute requiredPermissions={["page:edit:playlist"]} name="编辑片单">
              <EditPlaylistPage />
            </PermissionRoute>
          }
        />

        {/* 求种与悬赏 */}
        <Route
          path="/requests"
          element={
            <PermissionRoute requiredPermissions={["page:requests"]} name="求种专区">
              <RequestsPage />
            </PermissionRoute>
          }
        />

        {/* 魔力值与邀请 */}
        <Route
          path="/invite"
          element={
            <PermissionRoute requiredPermissions={["page:invite"]} name="邀请管理">
              <InvitePage />
            </PermissionRoute>
          }
        />
        <Route
          path="/bonus"
          element={
            <PermissionRoute requiredPermissions={["page:bonus"]} name="魔力值">
              <BonusPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/torrent-history"
          element={
            <PermissionRoute requiredPermissions={["page:torrent-history"]} name="做种历史">
              <TorrentRecordPage />
            </PermissionRoute>
          }
        />

        {/* 消息与工单 */}
        <Route
          path="/messages"
          element={
            <PermissionRoute requiredPermissions={["page:messages"]} name="消息中心">
              <MessagesPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <PermissionRoute requiredPermissions={["page:tickets"]} name="工单页面">
              <TicketsPage />
            </PermissionRoute>
          }
        />

        {/* 高级功能 */}
        <Route
          path="/rss"
          element={
            <PermissionRoute requiredPermissions={["page:rss"]} name="RSS订阅">
              <RSSPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/seeding"
          element={
            <PermissionRoute requiredPermissions={["page:seeding"]} name="保种页面">
              <SeedingPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/dead-torrents"
          element={
            <PermissionRoute requiredPermissions={["page:dead-torrents"]} name="断种页面">
              <DeadTorrentsPage />
            </PermissionRoute>
          }
        />

        {/* 娱乐功能 */}
        <Route
          path="/games"
          element={
            <PermissionRoute requiredPermissions={["page:games"]} name="小游戏">
              <GamesPage onNavigateMagicFarm={() => navigate("/magicfarm")} />
            </PermissionRoute>
          }
        />
        <Route
          path="/magicfarm"
          element={
            <PermissionRoute requiredPermissions={["page:magicfarm"]} name="魔力农场">
              <MagicFarmPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/music"
          element={
            <PermissionRoute requiredPermissions={["page:music"]} name="音乐页面">
              <MusicPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/player"
          element={
            <PermissionRoute requiredPermissions={["page:player"]} name="播放器">
              <PlayerPage />
            </PermissionRoute>
          }
        />

        {/* 管理功能 */}
        <Route
          path="/groups"
          element={
            <PermissionRoute requiredPermissions={["page:groups"]} name="管理组">
              <GroupsPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/candidates"
          element={
            <PermissionRoute requiredPermissions={["page:candidates"]} name="候选页面">
              <CandidatesPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/review"
          element={
            <PermissionRoute
              requiredPermissions={["review:write"]}
              requiredRoles={["admin"]}
              combine="OR"
              name="审核页面"
            >
              <ReviewPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/control"
          element={
            <PermissionRoute requiredPermissions={["page:control"]} name="控制面板">
              <ControlPage />
            </PermissionRoute>
          }
        />
      </Route>

      {/* 未登录或未匹配路径的重定向 */}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
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
      onFilmClick={() => { }}
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
