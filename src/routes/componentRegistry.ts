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
  HomePage: lazy(() => import("@/pages/Home")),
  TorrentsPage: lazy(() => import("@/pages/TorrentsList")),
  TorrentDetailPage: lazy(() => import("@/pages/TorrentDetail")),
  SubtitlesPage: lazy(() => import("@/pages/Subtitles")),
  RankingPage: lazy(() => import("@/pages/RankingPage")),

  // ==================== 电影与剧集 ====================
  MoviesPage: lazy(() => import("@/pages/Movies")),
  MovieDetailPage: lazy(() => import("@/pages/MovieDetail")),
  SeriesPage: lazy(() => import("@/pages/Series")),
  SeriesDetailPage: lazy(() => import("@/pages/SeriesDetail")),
  EpisodeDetailPage: lazy(() => import("@/pages/EpisodeDetail")),
  PlaylistsPage: lazy(() => import("@/pages/Playlists")),
  PlaylistDetailPage: lazy(() => import("@/pages/PlaylistDetail")),

  // ==================== 编辑页面 ====================
  EditMoviePage: lazy(() => import("@/pages/Edit/movies")),
  EditSeriesPage: lazy(() => import("@/pages/Edit/series")),
  EditPlaylistPage: lazy(() => import("@/pages/Edit/playlists")),

  // ==================== 上传与发布 ====================
  UploadTorrentPage: lazy(() => import("@/pages/UploadTorrent")),

  // ==================== 用户中心 ====================
  MessagesPage: lazy(() => import("@/pages/Messages")),
  FavoritesPage: lazy(() => import("@/pages/Favorites")),
  BonusPage: lazy(() => import("@/pages/Bonus")),
  InvitePage: lazy(() => import("@/pages/Invite/InvitePage")),
  TorrentRecordPage: lazy(() => import("@/pages/TorrentRecord")),

  // ==================== 站点信息 ====================
  RulesPage: lazy(() => import("@/pages/Rules")),
  StaffPage: lazy(() => import("@/pages/Staff")),
  TutorialsPage: lazy(() => import("@/pages/Tutorials")),
  AnnouncementsPage: lazy(() => import("@/pages/Announcements")),

  // ==================== 高级功能 ====================
  RSSPage: lazy(() => import("@/pages/RSSPage")),
  SeedingPage: lazy(() => import("@/pages/SeedingPage")),
  DeadTorrentsPage: lazy(() => import("@/pages/DeadTorrents")),
  GroupsPage: lazy(() => import("@/pages/Groups/GroupsPage")),
  CandidatesPage: lazy(() => import("@/pages/Candidates")),
  RequestsPage: lazy(() => import("@/pages/Requests")),

  // ==================== 娱乐功能 ====================
  GamesPage: lazy(() => import("@/pages/Games")),
  MagicFarmPage: lazy(() => import("@/pages/MagicFarm")),
  MusicPage: lazy(() => import("@/pages/Music")),
  PlayerPage: lazy(() => import("@/pages/PlayerPage")),

  // ==================== 成人区 ====================
  AdultPage: lazy(() => import("@/pages/Adult")),

  // ==================== 管理功能 ====================
  ControlPage: lazy(() => import("@/pages/Control")),
  DesignPage: lazy(() => import("@/pages/design")),

  // ==================== 后台管理 ====================
  ReportsPage: lazy(() => import("@/pages/Reports")),
  // 路由管理
  RouteManagePage: lazy(() => import("@/pages/admin/RouteManage")),
  ReviewPage: lazy(() => import("@/pages/Review")),
  TicketsPage: lazy(() => import("@/pages/Tickets/TicketsPage")),

  // ==================== 论坛模块 ====================
  ForumLayout: lazy(() =>
    import("@/pages/Forums/layouts/ForumLayout").then((m) => ({ default: m.ForumLayout })),
  ),
  ForumHomePage: lazy(() =>
    import("@/pages/Forums/pages/ForumHomePage").then((m) => ({ default: m.ForumHomePage })),
  ),
  TopicDetail: lazy(() =>
    import("@/pages/Forums/pages/TopicDetail").then((m) => ({ default: m.TopicDetail })),
  ),
  CategoryPage: lazy(() =>
    import("@/pages/Forums/pages/CategoryPage").then((m) => ({ default: m.CategoryPage })),
  ),
  CreateTopicPage: lazy(() =>
    import("@/pages/Forums/pages/CreateTopicPage").then((m) => ({ default: m.CreateTopicPage })),
  ),
  CategoriesPage: lazy(() =>
    import("@/pages/Forums/pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
  ),
  NewCategoryPage: lazy(() =>
    import("@/pages/Forums/pages/NewCategoryPage").then((m) => ({ default: m.NewCategoryPage })),
  ),
  EditCategoryPage: lazy(() =>
    import("@/pages/Forums/pages/EditCategoryPage").then((m) => ({ default: m.EditCategoryPage })),
  ),
  TagsPage: lazy(() =>
    import("@/pages/Forums/pages/TagsPage").then((m) => ({ default: m.TagsPage })),
  ),
  BookmarksPage: lazy(() =>
    import("@/pages/Forums/pages/BookmarksPage").then((m) => ({ default: m.BookmarksPage })),
  ),
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
