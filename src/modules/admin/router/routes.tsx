import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import BasicLayout from "@/modules/admin/layouts";
import Dashboard from "@/modules/admin/pages/Dashboard";
import Users from "@/modules/admin/pages/Users";
import SystemSettings from "@/modules/admin/pages/SystemSettings";
import TorrentCategories from "@/modules/admin/pages/Categories/TorrentCategories";
import MovieCategories from "@/modules/admin/pages/Categories/MovieCategories";
import SeriesCategories from "@/modules/admin/pages/Categories/SeriesCategories";
import PlaylistCategories from "@/modules/admin/pages/Categories/PlaylistCategories";
import AdultTorrentCategories from "@/modules/admin/pages/Categories/AdultTorrentCategories";
import AdultMovieCategories from "@/modules/admin/pages/Categories/AdultMovieCategories";
import AdultSeriesCategories from "@/modules/admin/pages/Categories/AdultSeriesCategories";
import AdultPlaylistCategories from "@/modules/admin/pages/Categories/AdultPlaylistCategories";
import Torrents from "@/modules/admin/pages/Torrents/Index";
import TorrentRecordsByTorrentPage from "@/modules/admin/pages/Torrents/TorrentRecordsByTorrent";
import Films from "@/modules/admin/pages/Films/Films";
import FilmDetail from "@/modules/admin/pages/Films/FilmDetail";
import Playlists from "@/modules/admin/pages/Playlists/Playlists";
import PlaylistDetail from "@/modules/admin/pages/Playlists/PlaylistDetail";
import Roles from "@/modules/admin/pages/Roles";
import { WebPermissions, AdminPermissions } from "@/modules/admin/pages/PermissionsPage";
import PunishmentRecords from "@/modules/admin/pages/PunishmentRecords";
import PunishmentTypes from "@/modules/admin/pages/Dictionary/PunishmentTypes";
import BanReasons from "@/modules/admin/pages/Dictionary/BanReasons";
import UnbanReasons from "@/modules/admin/pages/Dictionary/UnbanReasons";
import BanDays from "@/modules/admin/pages/Dictionary/BanDays";
import Levels from "@/modules/admin/pages/Levels";
import StoreItemsPage from "@/modules/admin/pages/Store/Items";
import StoreOrdersPage from "@/modules/admin/pages/Store/Orders";
import BonusAdjustmentsPage from "@/modules/admin/pages/Bonus/Adjustments";
import InvitesList from "@/modules/admin/pages/Invites/InvitesList";
import InviteQuotaList from "@/modules/admin/pages/Invites/InviteQuotaList";
import SendInvite from "@/modules/admin/pages/Invites/SendInvite";
import InvitesStatistics from "@/modules/admin/pages/Invites/InvitesStatistics";
import TicketsList from "@/modules/admin/pages/Tickets/TicketsList";
import TicketDetail from "@/modules/admin/pages/Tickets/TicketDetail";
import Login from "@/modules/admin/pages/Login";
import BonusBalancesPage from "@/modules/admin/pages/Bonus/Balances";
import BonusLedgerPage from "@/modules/admin/pages/Bonus/Ledger";
import BonusBatchAdjustPage from "@/modules/admin/pages/Bonus/BatchAdjust";
import BonusRulesView from "@/modules/admin/pages/Bonus/Rules";
import UserDownloadRecordsPage from "@/modules/admin/pages/Torrents/UserDownloadRecords";
import RecommendationConfigPage from "@/modules/admin/pages/RecommendationConfig";
import { DesktopNavigation, MobileNavigation } from "@/modules/admin/pages/Navigation/exports";

export type AppRouteObject = RouteObject & {
  meta?: {
    menuKey?: string;
    perm?: string;
  };
  children?: AppRouteObject[];
};

export const routes: AppRouteObject[] = [
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <BasicLayout />,
    children: [
      { index: true, element: <Dashboard />, meta: { menuKey: "dashboard" } },
      {
        path: "system",
        element: <SystemSettings />,
        meta: { menuKey: "system" },
      },
      {
        path: "recommendation-config",
        element: <RecommendationConfigPage />,
        meta: {
          menuKey: "recommendation-config",
          perm: "admin/recommendations",
        },
      },
      {
        path: "navigation",
        element: <Navigate to="/navigation/desktop" replace />,
      },
      {
        path: "navigation/desktop",
        element: <DesktopNavigation />,
        meta: {
          menuKey: "navigation-desktop",
          perm: "admin/navigation",
        },
      },
      {
        path: "navigation/mobile",
        element: <MobileNavigation />,
        meta: {
          menuKey: "navigation-mobile",
          perm: "admin/navigation",
        },
      },
      {
        path: "categories",
        element: <Navigate to="/categories/torrent" replace />,
      },
      { path: "edit", element: <Navigate to="/" replace /> },
      {
        path: "categories/torrent",
        element: <TorrentCategories />,
        meta: { menuKey: "categories-torrent" },
      },
      {
        path: "categories/movie",
        element: <MovieCategories />,
        meta: { menuKey: "categories-movie" },
      },
      {
        path: "categories/series",
        element: <SeriesCategories />,
        meta: { menuKey: "categories-series" },
      },
      {
        path: "categories/playlist",
        element: <PlaylistCategories />,
        meta: { menuKey: "categories-playlist" },
      },
      {
        path: "categories/adult",
        element: <Navigate to="/categories/adult/torrent" replace />,
      },
      {
        path: "categories/adult/torrent",
        element: <AdultTorrentCategories />,
        meta: { menuKey: "categories-adult-torrent" },
      },
      {
        path: "categories/adult/movie",
        element: <AdultMovieCategories />,
        meta: { menuKey: "categories-adult-movie" },
      },
      {
        path: "categories/adult/series",
        element: <AdultSeriesCategories />,
        meta: { menuKey: "categories-adult-series" },
      },
      {
        path: "categories/adult/playlist",
        element: <AdultPlaylistCategories />,
        meta: { menuKey: "categories-adult-playlist" },
      },
      {
        path: "torrents",
        element: <Torrents />,
        meta: { menuKey: "torrents-list", perm: "admin/torrents" },
      },
      {
        path: "torrents/records",
        element: <TorrentRecordsByTorrentPage />,
        meta: { menuKey: "torrents-records", perm: "admin/torrents" },
      },
      {
        path: "torrents/records/:id",
        element: <TorrentRecordsByTorrentPage />,
        meta: { menuKey: "torrents-records", perm: "admin/torrents" },
      },
      {
        path: "torrents/user-records",
        element: <UserDownloadRecordsPage />,
        meta: { menuKey: "torrents-user-records", perm: "admin/torrents" },
      },
      {
        path: "torrents/user-records/:id",
        element: <UserDownloadRecordsPage />,
        meta: { menuKey: "torrents-user-records", perm: "admin/torrents" },
      },
      {
        path: "movies",
        element: <Films />,
        meta: { menuKey: "movies", perm: "manage_torrents" },
      },
      {
        path: "movies/:id",
        element: <FilmDetail />,
        meta: { menuKey: "movies", perm: "manage_torrents" },
      },
      {
        path: "playlists",
        element: <Playlists />,
        meta: { menuKey: "playlists", perm: "manage_playlists" },
      },
      {
        path: "playlists/:id",
        element: <PlaylistDetail />,
        meta: { menuKey: "playlists", perm: "manage_playlists" },
      },
      { path: "users", element: <Users />, meta: { menuKey: "users-list" } },
      {
        path: "users/punishments",
        element: <PunishmentRecords />,
        meta: { menuKey: "users-punishments" },
      },
      {
        path: "users/roles",
        element: <Roles />,
        meta: { menuKey: "users-roles", perm: "admin/roles" },
      },
      {
        path: "users/permissions",
        element: <Navigate to="/users/permissions/web" replace />,
      },
      {
        path: "users/permissions/web",
        element: <WebPermissions />,
        meta: {
          menuKey: "permissions-web",
          perm: "admin/permissions",
        },
      },
      {
        path: "users/permissions/admin",
        element: <AdminPermissions />,
        meta: {
          menuKey: "permissions-admin",
          perm: "admin/permissions",
        },
      },
      {
        path: "users/levels",
        element: <Levels />,
        meta: { menuKey: "users-levels", perm: "admin/levels" },
      },
      {
        path: "dictionary/punishment-types",
        element: <PunishmentTypes />,
        meta: { menuKey: "punishment-types" },
      },
      {
        path: "dictionary/ban-reasons",
        element: <BanReasons />,
        meta: { menuKey: "ban-reasons" },
      },
      {
        path: "dictionary/unban-reasons",
        element: <UnbanReasons />,
        meta: { menuKey: "unban-reasons" },
      },
      {
        path: "dictionary/ban-days",
        element: <BanDays />,
        meta: { menuKey: "ban-days" },
      },
      {
        path: "store/items",
        element: <StoreItemsPage />,
        meta: { menuKey: "store-items", perm: "manage_store" },
      },
      {
        path: "store/orders",
        element: <StoreOrdersPage />,
        meta: { menuKey: "store-orders", perm: "manage_store" },
      },
      {
        path: "bonus/balances",
        element: <BonusBalancesPage />,
        meta: { menuKey: "bonus-balances", perm: "manage_bonus" },
      },
      {
        path: "bonus/ledger",
        element: <BonusLedgerPage />,
        meta: { menuKey: "bonus-ledger", perm: "manage_bonus" },
      },
      {
        path: "bonus/batch-adjust",
        element: <BonusBatchAdjustPage />,
        meta: { menuKey: "bonus-batch-adjust", perm: "manage_bonus" },
      },
      {
        path: "bonus/rules",
        element: <BonusRulesView />,
        meta: { menuKey: "bonus-rules", perm: "manage_bonus" },
      },
      {
        path: "bonus/adjust",
        element: <BonusAdjustmentsPage />,
        meta: { menuKey: "bonus-adjust", perm: "manage_bonus" },
      },
      {
        path: "invites/list",
        element: <InvitesList />,
        meta: { menuKey: "invites-list", perm: "manage-invites" },
      },
      {
        path: "invites/quota",
        element: <InviteQuotaList />,
        meta: { menuKey: "invites-quota", perm: "manage-invites" },
      },
      {
        path: "invites/statistics",
        element: <InvitesStatistics />,
        meta: { menuKey: "invites-statistics", perm: "manage-invites" },
      },
      {
        path: "invites/send",
        element: <SendInvite />,
        meta: { menuKey: "invites-send", perm: "send-official-invite" },
      },
      {
        path: "tickets",
        element: <TicketsList />,
        meta: { menuKey: "tickets", perm: "manage-tickets" },
      },
      {
        path: "tickets/:id",
        element: <TicketDetail />,
        meta: { menuKey: "tickets", perm: "manage-tickets" },
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
];
