/**
 * 组件注册表
 * 建立 componentKey → lazy component 映射
 * 用于动态路由系统根据后端配置加载对应组件
 */
import { lazy, LazyExoticComponent, ComponentType } from "react";

// 类型定义
type LazyComponent = LazyExoticComponent<ComponentType<any>>;

/**
 * 组件注册表
 * key 为组件标识符，value 为懒加载组件
 */
export const componentRegistry: Record<string, LazyComponent> = {
  // ==================== 公共页面 ====================
  HomePage: lazy(() => import("@/modules/app/pages/Home")),
  TorrentsPage: lazy(() => import("@/modules/app/pages/TorrentsList")),
  TorrentDetailPage: lazy(() => import("@/modules/app/pages/TorrentDetail")),
  SubtitlesPage: lazy(() => import("@/modules/app/pages/Subtitles")),
  RankingPage: lazy(() => import("@/modules/app/pages/RankingPage")),

  // ==================== 电影与剧集 ====================
  MoviesPage: lazy(() => import("@/modules/app/pages/Movies")),
  MovieDetailPage: lazy(() => import("@/modules/app/pages/MovieDetail")),
  SeriesPage: lazy(() => import("@/modules/app/pages/Series")),
  SeriesDetailPage: lazy(() => import("@/modules/app/pages/SeriesDetail")),
  EpisodeDetailPage: lazy(() => import("@/modules/app/pages/EpisodeDetail")),
  PlaylistsPage: lazy(() => import("@/modules/app/pages/Playlists")),
  PlaylistDetailPage: lazy(() => import("@/modules/app/pages/PlaylistDetail")),

  // ==================== 编辑页面 ====================
  EditMoviePage: lazy(() => import("@/modules/app/pages/Edit/movies")),
  EditSeriesPage: lazy(() => import("@/modules/app/pages/Edit/series")),
  EditPlaylistPage: lazy(() => import("@/modules/app/pages/Edit/playlists")),

  // ==================== 上传与发布 ====================
  UploadTorrentPage: lazy(() => import("@/modules/app/pages/UploadTorrent")),

  // ==================== 用户中心 ====================
  MessagesPage: lazy(() => import("@/modules/app/pages/Messages")),
  FavoritesPage: lazy(() => import("@/modules/app/pages/Favorites")),
  BonusPage: lazy(() => import("@/modules/app/pages/Bonus")),
  InvitePage: lazy(() => import("@/modules/app/pages/Invite/InvitePage")),
  TorrentRecordPage: lazy(() => import("@/modules/app/pages/TorrentRecord")),

  // ==================== 站点信息 ====================
  RulesPage: lazy(() => import("@/modules/app/pages/Rules")),
  StaffPage: lazy(() => import("@/modules/app/pages/Staff")),
  TutorialsPage: lazy(() => import("@/modules/app/pages/Tutorials")),
  AnnouncementsPage: lazy(() => import("@/modules/app/pages/Announcements")),

  // ==================== 高级功能 ====================
  RSSPage: lazy(() => import("@/modules/app/pages/RSSPage")),
  SeedingPage: lazy(() => import("@/modules/app/pages/SeedingPage")),
  DeadTorrentsPage: lazy(() => import("@/modules/app/pages/DeadTorrents")),
  GroupsPage: lazy(() => import("@/modules/app/pages/Groups/GroupsPage")),
  CandidatesPage: lazy(() => import("@/modules/app/pages/Candidates")),
  RequestsPage: lazy(() => import("@/modules/app/pages/Requests")),

  // ==================== 娱乐功能 ====================
  GamesPage: lazy(() => import("@/modules/app/pages/Games")),
  MagicFarmPage: lazy(() => import("@/modules/app/pages/MagicFarm")),
  MusicPage: lazy(() => import("@/modules/app/pages/Music")),
  PlayerPage: lazy(() => import("@/modules/app/pages/PlayerPage")),

  // ==================== 成人区 ====================
  AdultPage: lazy(() => import("@/modules/app/pages/Adult")),

  // ==================== 管理功能 ====================
  ControlPage: lazy(() => import("@/modules/app/pages/Control")),
  DesignPage: lazy(() => import("@/modules/app/pages/design")),

  // ==================== 后台管理 ====================
  ReportsPage: lazy(() => import("@/modules/app/pages/Reports")),
  ReviewPage: lazy(() => import("@/modules/app/pages/Review")),
  TicketsPage: lazy(() => import("@/modules/app/pages/Tickets/TicketsPage")),

  // ==================== 论坛模块 ====================
  ForumLayout: lazy(() =>
    import("@/modules/forum/layouts/ForumLayout").then((m) => ({ default: m.ForumLayout })),
  ),
  ForumHomePage: lazy(() =>
    import("@/modules/forum/pages/ForumHomePage").then((m) => ({ default: m.ForumHomePage })),
  ),
  TopicDetail: lazy(() =>
    import("@/modules/forum/pages/TopicDetail").then((m) => ({ default: m.TopicDetail })),
  ),
  CategoryPage: lazy(() =>
    import("@/modules/forum/pages/CategoryPage").then((m) => ({ default: m.CategoryPage })),
  ),
  CreateTopicPage: lazy(() =>
    import("@/modules/forum/pages/CreateTopicPage").then((m) => ({ default: m.CreateTopicPage })),
  ),
  CategoriesPage: lazy(() =>
    import("@/modules/forum/pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
  ),
  NewCategoryPage: lazy(() =>
    import("@/modules/forum/pages/NewCategoryPage").then((m) => ({ default: m.NewCategoryPage })),
  ),
  EditCategoryPage: lazy(() =>
    import("@/modules/forum/pages/EditCategoryPage").then((m) => ({ default: m.EditCategoryPage })),
  ),
  TagsPage: lazy(() =>
    import("@/modules/forum/pages/TagsPage").then((m) => ({ default: m.TagsPage })),
  ),
  BookmarksPage: lazy(() =>
    import("@/modules/forum/pages/BookmarksPage").then((m) => ({ default: m.BookmarksPage })),
  ),

  // ==================== Admin 模块 - 核心概览 ====================
  AdminDashboard: lazy(() => import("@/modules/admin/pages/Dashboard")),

  // ==================== Admin 模块 - 站点内容 (content) ====================
  // 种子管理
  AdminTorrents: lazy(() => import("@/modules/admin/pages/content/torrents/TorrentsList")),
  AdminTorrentRecords: lazy(
    () => import("@/modules/admin/pages/content/torrents/TorrentRecordsByTorrent"),
  ),
  AdminTorrentDownloadRecords: lazy(
    () => import("@/modules/admin/pages/content/torrents/TorrentDownloadRecords"),
  ),
  AdminUserDownloadRecords: lazy(
    () => import("@/modules/admin/pages/content/torrents/UserDownloadRecords"),
  ),
  // 影视库
  AdminFilms: lazy(() => import("@/modules/admin/pages/content/media/films/Films")),
  AdminFilmDetail: lazy(() => import("@/modules/admin/pages/content/media/films/FilmDetail")),
  AdminPlaylists: lazy(() => import("@/modules/admin/pages/content/media/playlists/Playlists")),
  AdminPlaylistDetail: lazy(
    () => import("@/modules/admin/pages/content/media/playlists/PlaylistDetail"),
  ),
  // 分类配置
  AdminTorrentCategories: lazy(
    () => import("@/modules/admin/pages/content/categories/TorrentCategories"),
  ),
  AdminMovieCategories: lazy(
    () => import("@/modules/admin/pages/content/categories/MovieCategories"),
  ),
  AdminSeriesCategories: lazy(
    () => import("@/modules/admin/pages/content/categories/SeriesCategories"),
  ),
  AdminPlaylistCategories: lazy(
    () => import("@/modules/admin/pages/content/categories/PlaylistCategories"),
  ),
  AdminAdultTorrentCategories: lazy(
    () => import("@/modules/admin/pages/content/categories/AdultTorrentCategories"),
  ),
  AdminAdultMovieCategories: lazy(
    () => import("@/modules/admin/pages/content/categories/AdultMovieCategories"),
  ),
  AdminAdultSeriesCategories: lazy(
    () => import("@/modules/admin/pages/content/categories/AdultSeriesCategories"),
  ),
  AdminAdultPlaylistCategories: lazy(
    () => import("@/modules/admin/pages/content/categories/AdultPlaylistCategories"),
  ),

  // ==================== Admin 模块 - 用户与安全 (users-security) ====================
  // 用户管理
  AdminUsers: lazy(() => import("@/modules/admin/pages/users-security/users/list/UsersList")),
  AdminPunishmentRecords: lazy(
    () => import("@/modules/admin/pages/users-security/users/punishments"),
  ),
  AdminLevels: lazy(() => import("@/modules/admin/pages/users-security/users/levels")),
  // 权限中心
  AdminRoles: lazy(() => import("@/modules/admin/pages/users-security/permissions/roles")),
  AdminWebPermissions: lazy(() =>
    import("@/modules/admin/pages/users-security/permissions/perms").then((m) => ({
      default: m.WebPermissions,
    })),
  ),
  AdminAdminPermissions: lazy(() =>
    import("@/modules/admin/pages/users-security/permissions/perms").then((m) => ({
      default: m.AdminPermissions,
    })),
  ),

  // ==================== Admin 模块 - 社区运营 (operations) ====================
  // 互动管理
  AdminTicketsList: lazy(
    () => import("@/modules/admin/pages/operations/interaction/tickets/TicketsList"),
  ),
  AdminTicketDetail: lazy(
    () => import("@/modules/admin/pages/operations/interaction/tickets/TicketDetail"),
  ),
  AdminRecommendationConfig: lazy(
    () => import("@/modules/admin/pages/operations/interaction/recommendation"),
  ),
  // 邀请系统
  AdminInvitesList: lazy(() => import("@/modules/admin/pages/operations/invites/InvitesList")),
  AdminInviteQuotaList: lazy(() => import("@/modules/admin/pages/operations/invites/InviteQuota")),
  AdminInvitesStatistics: lazy(() => import("@/modules/admin/pages/operations/invites/Statistics")),
  AdminSendInvite: lazy(() => import("@/modules/admin/pages/operations/invites/SendInvite")),
  // 导航管理

  // ==================== Admin 模块 - 经济系统 (economy) ====================
  // 魔力值中心
  AdminBonusBalances: lazy(() => import("@/modules/admin/pages/economy/bonus/Balances")),
  AdminBonusLedger: lazy(() => import("@/modules/admin/pages/economy/bonus/Ledger")),
  AdminBonusBatchAdjust: lazy(() => import("@/modules/admin/pages/economy/bonus/BatchAdjust")),
  AdminBonusRules: lazy(() => import("@/modules/admin/pages/economy/bonus/Rules")),
  AdminBonusAdjustments: lazy(() => import("@/modules/admin/pages/economy/bonus/Adjustments")),
  // 商城管理
  AdminStoreItems: lazy(() => import("@/modules/admin/pages/economy/store/Items")),
  AdminStoreOrders: lazy(() => import("@/modules/admin/pages/economy/store/Orders")),

  // ==================== Admin 模块 - 系统配置 (system) ====================
  // 基础设置
  AdminSystemSettings: lazy(() => import("@/modules/admin/pages/system/settings")),
  // 路由管理
  RouteManagePage: lazy(() => import("@/modules/admin/pages/system/routes")),
  // 字典管理
  AdminPunishmentTypes: lazy(
    () => import("@/modules/admin/pages/system/dictionary/punishment-types"),
  ),
  AdminBanReasons: lazy(() => import("@/modules/admin/pages/system/dictionary/ban-reasons")),
  AdminUnbanReasons: lazy(() => import("@/modules/admin/pages/system/dictionary/unban-reasons")),
  AdminBanDays: lazy(() => import("@/modules/admin/pages/system/dictionary/ban-days")),
};

/**
 * 获取组件
 * @param key 组件标识符
 * @returns 懒加载组件，如果未找到则返回 undefined
 */
export function getComponent(key: string): LazyComponent | undefined {
  return componentRegistry[key];
}

/**
 * 检查组件是否存在
 * @param key 组件标识符
 */
export function hasComponent(key: string): boolean {
  return key in componentRegistry;
}
