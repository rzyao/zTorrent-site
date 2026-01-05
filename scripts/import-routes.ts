import axios from "axios";

/**
 * 路由配置数据
 * 所有子路由使用相对路径，由 React Router 自动拼接
 */
const routesData = [
  // ==================== AppLayout 布局下的页面 ====================
  {
    routeKey: "app-layout",
    path: "/",
    component: "",
    layout: "app",
    name: "前台",
    children: [
      { routeKey: "home", path: "home", component: "HomePage", name: "首页", sortOrder: 1 },
      {
        routeKey: "torrents",
        path: "torrents",
        component: "TorrentsPage",
        name: "种子列表",
        sortOrder: 2,
      },
      {
        routeKey: "torrent-detail",
        path: "torrent/:id",
        component: "TorrentDetailPage",
        name: "种子详情",
        isVisible: false,
      },
      {
        routeKey: "subtitles",
        path: "subtitles",
        component: "SubtitlesPage",
        name: "字幕",
        sortOrder: 3,
      },
      {
        routeKey: "ranking",
        path: "ranking",
        component: "RankingPage",
        name: "排行榜",
        sortOrder: 4,
      },

      // 电影与剧集
      { routeKey: "movies", path: "movies", component: "MoviesPage", name: "电影", sortOrder: 5 },
      {
        routeKey: "movie-detail",
        path: "movie/:id",
        component: "MovieDetailPage",
        name: "电影详情",
        isVisible: false,
      },
      { routeKey: "series", path: "series", component: "SeriesPage", name: "剧集", sortOrder: 6 },
      {
        routeKey: "series-detail",
        path: "series/:id",
        component: "SeriesDetailPage",
        name: "剧集详情",
        isVisible: false,
      },
      {
        routeKey: "episode-detail",
        path: "episodes/:id",
        component: "EpisodeDetailPage",
        name: "分集详情",
        isVisible: false,
      },
      {
        routeKey: "playlists",
        path: "playlists",
        component: "PlaylistsPage",
        name: "片单",
        sortOrder: 7,
      },
      {
        routeKey: "playlist-detail",
        path: "playlist/:id",
        component: "PlaylistDetailPage",
        name: "片单详情",
        isVisible: false,
      },

      // 站点信息
      { routeKey: "rules", path: "rules", component: "RulesPage", name: "规则", sortOrder: 8 },
      { routeKey: "staff", path: "staff", component: "StaffPage", name: "管理组", sortOrder: 9 },
      {
        routeKey: "tutorials",
        path: "tutorials",
        component: "TutorialsPage",
        name: "使用教程",
        sortOrder: 9,
      },
      {
        routeKey: "announcements",
        path: "announcements",
        component: "AnnouncementsPage",
        name: "公告",
        sortOrder: 10,
      },

      // 权限控制页面
      {
        routeKey: "adult",
        path: "adult",
        component: "AdultPage",
        name: "成人区",
        permissions: ["adult"],
        sortOrder: 99,
      },
      {
        routeKey: "adult-category",
        path: "adult/:category",
        component: "AdultPage",
        name: "成人区分类",
        permissions: ["adult"],
        isVisible: false,
      },
      {
        routeKey: "upload",
        path: "upload",
        component: "UploadTorrentPage",
        name: "上传",
        permissions: ["upload"],
        sortOrder: 11,
      },
      {
        routeKey: "edit-movie",
        path: "edit/movie",
        component: "EditMoviePage",
        name: "编辑电影",
        permissions: ["edit:movie"],
        isVisible: false,
      },
      {
        routeKey: "edit-series",
        path: "edit/series",
        component: "EditSeriesPage",
        name: "编辑剧集",
        permissions: ["edit:series"],
        isVisible: false,
      },
      {
        routeKey: "edit-playlist",
        path: "edit/playlist",
        component: "EditPlaylistPage",
        name: "编辑片单",
        permissions: ["edit:playlist"],
        isVisible: false,
      },

      // 用户功能
      {
        routeKey: "requests",
        path: "requests",
        component: "RequestsPage",
        name: "求种",
        sortOrder: 12,
      },
      { routeKey: "invite", path: "invite", component: "InvitePage", name: "邀请", sortOrder: 13 },
      { routeKey: "bonus", path: "bonus", component: "BonusPage", name: "魔力值", sortOrder: 14 },
      {
        routeKey: "torrent-history",
        path: "torrent-history",
        component: "TorrentRecordPage",
        name: "记录",
        sortOrder: 15,
      },
      {
        routeKey: "messages",
        path: "messages",
        component: "MessagesPage",
        name: "消息",
        sortOrder: 16,
      },
      {
        routeKey: "favorites",
        path: "favorites",
        component: "FavoritesPage",
        name: "收藏",
        sortOrder: 17,
      },

      // 高级功能
      { routeKey: "rss", path: "rss", component: "RSSPage", name: "RSS订阅", sortOrder: 18 },
      {
        routeKey: "seeding",
        path: "seeding",
        component: "SeedingPage",
        name: "保种列表",
        sortOrder: 19,
      },
      {
        routeKey: "dead-torrents",
        path: "dead-torrents",
        component: "DeadTorrentsPage",
        name: "断种大厅",
        sortOrder: 20,
      },

      // 娱乐功能
      { routeKey: "games", path: "games", component: "GamesPage", name: "小游戏", sortOrder: 21 },
      {
        routeKey: "magicfarm",
        path: "magicfarm",
        component: "MagicFarmPage",
        name: "魔法农场",
        sortOrder: 22,
      },
      { routeKey: "music", path: "music", component: "MusicPage", name: "音乐", sortOrder: 23 },
      {
        routeKey: "player",
        path: "player",
        component: "PlayerPage",
        name: "播放器",
        sortOrder: 24,
      },

      // 管理功能
      {
        routeKey: "groups",
        path: "groups",
        component: "GroupsPage",
        name: "制作组",
        sortOrder: 25,
      },
      {
        routeKey: "candidates",
        path: "candidates",
        component: "CandidatesPage",
        name: "候选",
        sortOrder: 26,
      },
      {
        routeKey: "control",
        path: "control",
        component: "ControlPage",
        name: "控制",
        sortOrder: 27,
      },
      { routeKey: "design", path: "design", component: "DesignPage", name: "设计", sortOrder: 28 },
    ],
  },

  // ==================== 论坛模块 (ForumLayout) ====================
  {
    routeKey: "forum",
    path: "forum",
    component: "ForumLayout",
    layout: "forum",
    name: "论坛",
    sortOrder: 100,
    children: [
      {
        routeKey: "forum-home",
        path: "",
        component: "ForumHomePage",
        name: "论坛首页",
        isIndex: true,
      },
      { routeKey: "forum-hot", path: "hot", component: "ForumHomePage", name: "热门话题" },
      { routeKey: "forum-latest", path: "latest", component: "ForumHomePage", name: "最新发布" },
      {
        routeKey: "forum-topic",
        path: "topic/:topicId",
        component: "TopicDetail",
        name: "话题详情",
        isVisible: false,
      },
      {
        routeKey: "forum-topic-post",
        path: "topic/:topicId/:postNumber",
        component: "TopicDetail",
        name: "话题详情",
        isVisible: false,
      },
      {
        routeKey: "forum-category",
        path: "category/:categoryId",
        component: "CategoryPage",
        name: "分类",
        isVisible: false,
      },
      {
        routeKey: "forum-category-sort",
        path: "category/:categoryId/:sortBy",
        component: "CategoryPage",
        name: "分类",
        isVisible: false,
      },
      {
        routeKey: "forum-tag",
        path: "tag/:tagName",
        component: "CategoryPage",
        name: "标签",
        isVisible: false,
      },
      {
        routeKey: "forum-categories",
        path: "categories",
        component: "CategoriesPage",
        name: "类别概览",
      },
      { routeKey: "forum-tags", path: "tags", component: "TagsPage", name: "标签概览" },
      {
        routeKey: "forum-new-category",
        path: "new-category",
        component: "NewCategoryPage",
        name: "新建类别",
        permissions: ["forum:create-category"],
      },
      {
        routeKey: "forum-edit-category",
        path: "category/:categoryId/edit",
        component: "EditCategoryPage",
        name: "编辑类别",
        permissions: ["forum:edit-category"],
        isVisible: false,
      },
      {
        routeKey: "forum-create",
        path: "create",
        component: "CreateTopicPage",
        name: "发布话题",
        permissions: ["forum:create-topic"],
      },
      {
        routeKey: "forum-bookmarks",
        path: "bookmarks",
        component: "BookmarksPage",
        name: "我的收藏",
      },
    ],
  },

  // ==================== 后台管理 (AdminLayout) ====================
  {
    routeKey: "admin",
    path: "admin",
    component: "",
    layout: "admin",
    name: "管理后台",
    sortOrder: 200,
    children: [
      {
        routeKey: "admin-dashboard",
        path: "dashboard",
        component: "",
        name: "仪表盘",
        sortOrder: 1,
      },
      {
        routeKey: "admin-reports",
        path: "reports",
        component: "ReportsPage",
        name: "举报管理",
        sortOrder: 2,
      },
      {
        routeKey: "admin-review",
        path: "review",
        component: "ReviewPage",
        name: "审核",
        sortOrder: 3,
      },
      {
        routeKey: "admin-tickets",
        path: "tickets",
        component: "TicketsPage",
        name: "工单",
        sortOrder: 4,
      },
      {
        routeKey: "admin-routes",
        path: "routes",
        component: "RouteManagePage",
        name: "路由管理",
        sortOrder: 5,
      },
    ],
  },
];

async function main() {
  const API_URL = "http://localhost:8890/routes/import";

  console.log("准备导入路由配置...");
  console.log(`目标 API: ${API_URL}`);
  console.log(`路由数量: ${routesData.length} 个根节点`);

  try {
    const response = await axios.post(API_URL, {
      items: routesData,
    });

    console.log("========================================");
    console.log("导入成功！");
    console.log("响应数据:", response.data);
    console.log("========================================");
  } catch (error: any) {
    console.error("========================================");
    console.error("导入失败！");
    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("错误信息:", error.response.data);
    } else {
      console.error("错误:", error.message);
    }
    console.error("========================================");
  }
}

main();
