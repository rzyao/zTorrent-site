import axios from "axios";

/**
 * 路由配置数据
 * 所有子路由使用相对路径，由 React Router 自动拼接
 */
const routesData = [
  // ==================== AppLayout 布局下的页面 ====================
  {
    routeKey: "app",
    path: "app",
    component: "",
    layout: "app",
    name: "前台",
    children: [
      {
        routeKey: "app-home",
        path: "home",
        component: "HomePage",
        name: "首页",
        layout: "app",
        sortOrder: 1,
      },
      {
        routeKey: "app-torrents",
        path: "torrents",
        component: "TorrentsPage",
        name: "种子列表",
        layout: "app",
        sortOrder: 2,
      },
      {
        routeKey: "app-torrent-detail",
        path: "torrent/:id",
        component: "TorrentDetailPage",
        name: "种子详情",
        layout: "app",
        isVisible: false,
      },
      {
        routeKey: "app-subtitles",
        path: "subtitles",
        component: "SubtitlesPage",
        name: "字幕",
        layout: "app",
        sortOrder: 3,
      },
      {
        routeKey: "app-ranking",
        path: "ranking",
        component: "RankingPage",
        name: "排行榜",
        layout: "app",
        sortOrder: 4,
      },

      // 电影与剧集
      {
        routeKey: "app-movies",
        path: "movies",
        component: "MoviesPage",
        name: "电影",
        layout: "app",
        sortOrder: 5,
      },
      {
        routeKey: "app-movie-detail",
        path: "movie/:id",
        component: "MovieDetailPage",
        name: "电影详情",
        layout: "app",
        isVisible: false,
      },
      {
        routeKey: "app-series",
        path: "series",
        component: "SeriesPage",
        name: "剧集",
        layout: "app",
        sortOrder: 6,
      },
      {
        routeKey: "app-series-detail",
        path: "series/:id",
        component: "SeriesDetailPage",
        name: "剧集详情",
        layout: "app",
        isVisible: false,
      },
      {
        routeKey: "app-episode-detail",
        path: "episodes/:id",
        component: "EpisodeDetailPage",
        name: "分集详情",
        layout: "app",
        isVisible: false,
      },
      {
        routeKey: "app-playlists",
        path: "playlists",
        component: "PlaylistsPage",
        name: "片单",
        layout: "app",
        sortOrder: 7,
      },
      {
        routeKey: "app-playlist-detail",
        path: "playlist/:id",
        component: "PlaylistDetailPage",
        name: "片单详情",
        layout: "app",
        isVisible: false,
      },

      // 站点信息
      {
        routeKey: "app-rules",
        path: "rules",
        component: "RulesPage",
        name: "规则",
        layout: "app",
        sortOrder: 8,
      },
      {
        routeKey: "app-staff",
        path: "staff",
        component: "StaffPage",
        name: "管理组",
        layout: "app",
        sortOrder: 9,
      },
      {
        routeKey: "app-tutorials",
        path: "tutorials",
        component: "TutorialsPage",
        name: "使用教程",
        layout: "app",
        sortOrder: 9,
      },
      {
        routeKey: "app-announcements",
        path: "announcements",
        component: "AnnouncementsPage",
        name: "公告",
        layout: "app",
        sortOrder: 10,
      },

      // 权限控制页面
      {
        routeKey: "app-adult",
        path: "adult",
        component: "AdultPage",
        name: "成人区",
        layout: "app",
        permissions: ["adult"],
        sortOrder: 99,
      },
      {
        routeKey: "app-adult-category",
        path: "adult/:category",
        component: "AdultPage",
        name: "成人区分类",
        layout: "app",
        permissions: ["adult"],
        isVisible: false,
      },
      {
        routeKey: "app-upload",
        path: "upload",
        component: "UploadTorrentPage",
        name: "上传",
        layout: "app",
        permissions: ["upload"],
        sortOrder: 11,
      },
      {
        routeKey: "app-edit-movie",
        path: "edit/movie",
        component: "EditMoviePage",
        name: "编辑电影",
        layout: "app",
        permissions: ["edit:movie"],
        isVisible: false,
      },
      {
        routeKey: "app-edit-series",
        path: "edit/series",
        component: "EditSeriesPage",
        name: "编辑剧集",
        layout: "app",
        permissions: ["edit:series"],
        isVisible: false,
      },
      {
        routeKey: "app-edit-playlist",
        path: "edit/playlist",
        component: "EditPlaylistPage",
        name: "编辑片单",
        layout: "app",
        permissions: ["edit:playlist"],
        isVisible: false,
      },

      // 用户功能
      {
        routeKey: "app-requests",
        path: "requests",
        component: "RequestsPage",
        name: "求种",
        layout: "app",
        sortOrder: 12,
      },
      {
        routeKey: "app-invite",
        path: "invite",
        component: "InvitePage",
        name: "邀请",
        layout: "app",
        sortOrder: 13,
      },
      {
        routeKey: "app-bonus",
        path: "bonus",
        component: "BonusPage",
        name: "魔力值",
        layout: "app",
        sortOrder: 14,
      },
      {
        routeKey: "app-torrent-history",
        path: "torrent-history",
        component: "TorrentRecordPage",
        name: "记录",
        layout: "app",
        sortOrder: 15,
      },
      {
        routeKey: "app-messages",
        path: "messages",
        component: "MessagesPage",
        name: "消息",
        layout: "app",
        sortOrder: 16,
      },
      {
        routeKey: "app-favorites",
        path: "favorites",
        component: "FavoritesPage",
        name: "收藏",
        layout: "app",
        sortOrder: 17,
      },

      // 高级功能
      {
        routeKey: "app-rss",
        path: "rss",
        component: "RSSPage",
        name: "RSS订阅",
        layout: "app",
        sortOrder: 18,
      },
      {
        routeKey: "app-seeding",
        path: "seeding",
        component: "SeedingPage",
        name: "保种列表",
        layout: "app",
        sortOrder: 19,
      },
      {
        routeKey: "app-dead-torrents",
        path: "dead-torrents",
        component: "DeadTorrentsPage",
        name: "断种大厅",
        layout: "app",
        sortOrder: 20,
      },

      // 娱乐功能
      {
        routeKey: "app-games",
        path: "games",
        component: "GamesPage",
        name: "小游戏",
        layout: "app",
        sortOrder: 21,
      },
      {
        routeKey: "app-magicfarm",
        path: "magicfarm",
        component: "MagicFarmPage",
        name: "魔法农场",
        layout: "app",
        sortOrder: 22,
      },
      {
        routeKey: "app-music",
        path: "music",
        component: "MusicPage",
        name: "音乐",
        layout: "app",
        sortOrder: 23,
      },
      {
        routeKey: "app-player",
        path: "player",
        component: "PlayerPage",
        name: "播放器",
        layout: "app",
        sortOrder: 24,
      },

      // 管理功能
      {
        routeKey: "app-groups",
        path: "groups",
        component: "GroupsPage",
        name: "制作组",
        layout: "app",
        sortOrder: 25,
      },
      {
        routeKey: "app-candidates",
        path: "candidates",
        component: "CandidatesPage",
        name: "候选",
        layout: "app",
        sortOrder: 26,
      },
      {
        routeKey: "app-control",
        path: "control",
        component: "ControlPage",
        name: "控制",
        layout: "app",
        sortOrder: 27,
      },
      {
        routeKey: "app-design",
        path: "design",
        component: "DesignPage",
        name: "设计",
        layout: "app",
        sortOrder: 28,
      },
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
        layout: "forum",
        isIndex: true,
      },
      {
        routeKey: "forum-hot",
        path: "hot",
        component: "ForumHomePage",
        name: "热门话题",
        layout: "forum",
      },
      {
        routeKey: "forum-latest",
        path: "latest",
        component: "ForumHomePage",
        name: "最新发布",
        layout: "forum",
      },
      {
        routeKey: "forum-topic",
        path: "topic/:topicId",
        component: "TopicDetail",
        name: "话题详情",
        layout: "forum",
        isVisible: false,
      },
      {
        routeKey: "forum-topic-post",
        path: "topic/:topicId/:postNumber",
        component: "TopicDetail",
        name: "话题详情",
        layout: "forum",
        isVisible: false,
      },
      {
        routeKey: "forum-category",
        path: "category/:categoryKey",
        component: "CategoryPage",
        name: "分类",
        layout: "forum",
        isVisible: false,
      },
      {
        routeKey: "forum-category-sort",
        path: "category/:categoryKey/:sortBy",
        component: "CategoryPage",
        name: "分类",
        layout: "forum",
        isVisible: false,
      },
      {
        routeKey: "forum-tag",
        path: "tag/:tagName",
        component: "CategoryPage",
        name: "标签",
        layout: "forum",
        isVisible: false,
      },
      {
        routeKey: "forum-categories",
        path: "categories",
        component: "CategoriesPage",
        name: "类别概览",
        layout: "forum",
      },
      {
        routeKey: "forum-tags",
        path: "tags",
        component: "TagsPage",
        name: "标签概览",
        layout: "forum",
      },
      {
        routeKey: "forum-new-category",
        path: "new-category",
        component: "NewCategoryPage",
        name: "新建类别",
        layout: "forum",
        permissions: ["forum:create-category"],
      },
      {
        routeKey: "forum-edit-category",
        path: "category/:categoryKey/edit",
        component: "EditCategoryPage",
        name: "编辑类别",
        layout: "forum",
        permissions: ["forum:edit-category"],
        isVisible: false,
      },
      {
        routeKey: "forum-create",
        path: "create",
        component: "CreateTopicPage",
        name: "发布话题",
        layout: "forum",
        permissions: ["forum:create-topic"],
      },
      {
        routeKey: "forum-bookmarks",
        path: "bookmarks",
        component: "BookmarksPage",
        name: "我的收藏",
        layout: "forum",
      },
    ],
  },

  // ==================== 后台管理 (AdminLayout) ====================
  {
    routeKey: "admin",
    path: "admin",
    component: "AdminDashboard",
    layout: "admin",
    name: "管理后台",
    sortOrder: 200,
    children: [
      {
        routeKey: "admin-dashboard",
        path: "",
        component: "AdminDashboard",
        name: "仪表盘",
        layout: "admin",
        sortOrder: 0,
        isIndex: true,
      },
      {
        routeKey: "admin-system",
        path: "system",
        component: "AdminSystemSettings",
        name: "系统设置",
        layout: "admin",
        sortOrder: 10,
      },
      {
        routeKey: "admin-recommendation-config",
        path: "recommendation-config",
        component: "AdminRecommendationConfig",
        name: "推荐配置",
        layout: "admin",
        permissions: ["admin/recommendations"],
        sortOrder: 20,
      },

      // 导航管理
      {
        routeKey: "admin-navigation",
        path: "navigation",
        name: "导航管理",
        layout: "admin",
        sortOrder: 30,
        children: [
          {
            routeKey: "admin-navigation-desktop",
            path: "desktop",
            component: "AdminDesktopNavigation",
            name: "桌面端导航",
            layout: "admin",
            permissions: ["admin/navigation"],
            sortOrder: 0,
          },
          {
            routeKey: "admin-navigation-mobile",
            path: "mobile",
            component: "AdminMobileNavigation",
            name: "移动端导航",
            layout: "admin",
            permissions: ["admin/navigation"],
            sortOrder: 10,
          },
        ],
      },

      // 分类管理
      {
        routeKey: "admin-categories",
        path: "categories",
        name: "分类管理",
        layout: "admin",
        sortOrder: 40,
        children: [
          {
            routeKey: "admin-categories-torrent",
            path: "torrent",
            component: "AdminTorrentCategories",
            name: "种子分类",
            layout: "admin",
            sortOrder: 0,
          },
          {
            routeKey: "admin-categories-movie",
            path: "movie",
            component: "AdminMovieCategories",
            name: "电影分类",
            layout: "admin",
            sortOrder: 10,
          },
          {
            routeKey: "admin-categories-series",
            path: "series",
            component: "AdminSeriesCategories",
            name: "剧集分类",
            layout: "admin",
            sortOrder: 20,
          },
          {
            routeKey: "admin-categories-playlist",
            path: "playlist",
            component: "AdminPlaylistCategories",
            name: "播放列表分类",
            layout: "admin",
            sortOrder: 30,
          },
          {
            routeKey: "admin-categories-adult",
            path: "adult",
            name: "成人分类",
            layout: "admin",
            sortOrder: 40,
            children: [
              {
                routeKey: "admin-categories-adult-torrent",
                path: "torrent",
                component: "AdminAdultTorrentCategories",
                name: "种子",
                layout: "admin",
                sortOrder: 0,
              },
              {
                routeKey: "admin-categories-adult-movie",
                path: "movie",
                component: "AdminAdultMovieCategories",
                name: "电影",
                layout: "admin",
                sortOrder: 10,
              },
              {
                routeKey: "admin-categories-adult-series",
                path: "series",
                component: "AdminAdultSeriesCategories",
                name: "剧集",
                layout: "admin",
                sortOrder: 20,
              },
              {
                routeKey: "admin-categories-adult-playlist",
                path: "playlist",
                component: "AdminAdultPlaylistCategories",
                name: "播放列表",
                layout: "admin",
                sortOrder: 30,
              },
            ],
          },
        ],
      },

      // 种子管理
      {
        routeKey: "admin-torrents",
        path: "torrents",
        name: "种子管理",
        layout: "admin",
        sortOrder: 50,
        children: [
          {
            routeKey: "admin-torrents-list",
            path: "",
            component: "AdminTorrents",
            name: "种子列表",
            layout: "admin",
            permissions: ["admin/torrents"],
            sortOrder: 0,
            isIndex: true,
          },
          {
            routeKey: "admin-torrents-records",
            path: "records",
            component: "AdminTorrentRecords",
            name: "下载记录",
            layout: "admin",
            permissions: ["admin/torrents"],
            sortOrder: 10,
          },
          {
            routeKey: "admin-torrents-records-id",
            path: "records/:id",
            component: "AdminTorrentRecords",
            name: "下载记录",
            layout: "admin",
            permissions: ["admin/torrents"],
            isVisible: false,
          },
          {
            routeKey: "admin-torrents-user-records",
            path: "user-records",
            component: "AdminUserDownloadRecords",
            name: "用户下载记录",
            layout: "admin",
            permissions: ["admin/torrents"],
            sortOrder: 20,
          },
          {
            routeKey: "admin-torrents-user-records-id",
            path: "user-records/:id",
            component: "AdminUserDownloadRecords",
            name: "用户下载记录",
            layout: "admin",
            permissions: ["admin/torrents"],
            isVisible: false,
          },
        ],
      },

      // 影片管理
      {
        routeKey: "admin-movies",
        path: "movies",
        component: "AdminFilms",
        name: "影片管理",
        layout: "admin",
        permissions: ["manage_torrents"],
        sortOrder: 60,
      },
      {
        routeKey: "admin-movies-detail",
        path: "movies/:id",
        component: "AdminFilmDetail",
        name: "影片详情",
        layout: "admin",
        permissions: ["manage_torrents"],
        isVisible: false,
      },

      // 播放列表管理
      {
        routeKey: "admin-playlists",
        path: "playlists",
        component: "AdminPlaylists",
        name: "播放列表管理",
        layout: "admin",
        permissions: ["manage_playlists"],
        sortOrder: 70,
      },
      {
        routeKey: "admin-playlists-detail",
        path: "playlists/:id",
        component: "AdminPlaylistDetail",
        name: "播放列表详情",
        layout: "admin",
        permissions: ["manage_playlists"],
        isVisible: false,
      },

      // 用户管理
      {
        routeKey: "admin-users",
        path: "users",
        name: "用户管理",
        layout: "admin",
        sortOrder: 80,
        children: [
          {
            routeKey: "admin-users-list",
            path: "",
            component: "AdminUsers",
            name: "用户列表",
            layout: "admin",
            sortOrder: 0,
            isIndex: true,
          },
          {
            routeKey: "admin-users-punishments",
            path: "punishments",
            component: "AdminPunishmentRecords",
            name: "处罚记录",
            layout: "admin",
            sortOrder: 10,
          },
          {
            routeKey: "admin-users-roles",
            path: "roles",
            component: "AdminRoles",
            name: "角色管理",
            layout: "admin",
            permissions: ["admin/roles"],
            sortOrder: 20,
          },
          {
            routeKey: "admin-users-permissions",
            path: "permissions",
            name: "权限管理",
            layout: "admin",
            sortOrder: 30,
            children: [
              {
                routeKey: "admin-permissions-web",
                path: "web",
                component: "AdminWebPermissions",
                name: "前台权限",
                layout: "admin",
                permissions: ["admin/permissions"],
                sortOrder: 0,
              },
              {
                routeKey: "admin-permissions-admin",
                path: "admin",
                component: "AdminAdminPermissions",
                name: "后台权限",
                layout: "admin",
                permissions: ["admin/permissions"],
                sortOrder: 10,
              },
            ],
          },
          {
            routeKey: "admin-users-levels",
            path: "levels",
            component: "AdminLevels",
            name: "等级管理",
            layout: "admin",
            permissions: ["admin/levels"],
            sortOrder: 40,
          },
        ],
      },
      // 字典管理
      {
        routeKey: "admin-dictionary",
        path: "dictionary",
        name: "字典管理",
        layout: "admin",
        sortOrder: 90,
        children: [
          {
            routeKey: "admin-punishment-types",
            path: "punishment-types",
            component: "AdminPunishmentTypes",
            name: "处罚类型",
            layout: "admin",
            sortOrder: 0,
          },
          {
            routeKey: "admin-ban-reasons",
            path: "ban-reasons",
            component: "AdminBanReasons",
            name: "封禁原因",
            layout: "admin",
            sortOrder: 10,
          },
          {
            routeKey: "admin-unban-reasons",
            path: "unban-reasons",
            component: "AdminUnbanReasons",
            name: "解封原因",
            layout: "admin",
            sortOrder: 20,
          },
          {
            routeKey: "admin-ban-days",
            path: "ban-days",
            component: "AdminBanDays",
            name: "封禁天数",
            layout: "admin",
            sortOrder: 30,
          },
        ],
      },

      // 商城管理
      {
        routeKey: "admin-store",
        path: "store",
        name: "商城管理",
        layout: "admin",
        sortOrder: 100,
        children: [
          {
            routeKey: "admin-store-items",
            path: "items",
            component: "AdminStoreItems",
            name: "商品管理",
            layout: "admin",
            permissions: ["manage_store"],
            sortOrder: 0,
          },
          {
            routeKey: "admin-store-orders",
            path: "orders",
            component: "AdminStoreOrders",
            name: "订单管理",
            layout: "admin",
            permissions: ["manage_store"],
            sortOrder: 10,
          },
        ],
      },
      // 魔力管理
      {
        routeKey: "admin-bonus",
        path: "bonus",
        name: "魔力管理",
        layout: "admin",
        sortOrder: 110,
        children: [
          {
            routeKey: "admin-bonus-balances",
            path: "balances",
            component: "AdminBonusBalances",
            name: "余额查询",
            layout: "admin",
            permissions: ["manage_bonus"],
            sortOrder: 0,
          },
          {
            routeKey: "admin-bonus-ledger",
            path: "ledger",
            component: "AdminBonusLedger",
            name: "账本记录",
            layout: "admin",
            permissions: ["manage_bonus"],
            sortOrder: 10,
          },
          {
            routeKey: "admin-bonus-batch-adjust",
            path: "batch-adjust",
            component: "AdminBonusBatchAdjust",
            name: "批量调整",
            layout: "admin",
            permissions: ["manage_bonus"],
            sortOrder: 20,
          },
          {
            routeKey: "admin-bonus-rules",
            path: "rules",
            component: "AdminBonusRules",
            name: "规则配置",
            layout: "admin",
            permissions: ["manage_bonus"],
            sortOrder: 30,
          },
          {
            routeKey: "admin-bonus-adjust",
            path: "adjust",
            component: "AdminBonusAdjustments",
            name: "手动调整",
            layout: "admin",
            permissions: ["manage_bonus"],
            sortOrder: 40,
          },
        ],
      },

      // 邀请管理
      {
        routeKey: "admin-invites",
        path: "invites",
        name: "邀请管理",
        layout: "admin",
        sortOrder: 120,
        children: [
          {
            routeKey: "admin-invites-list",
            path: "list",
            component: "AdminInvitesList",
            name: "邀请列表",
            layout: "admin",
            permissions: ["manage-invites"],
            sortOrder: 0,
          },
          {
            routeKey: "admin-invites-quota",
            path: "quota",
            component: "AdminInviteQuotaList",
            name: "配额管理",
            layout: "admin",
            permissions: ["manage-invites"],
            sortOrder: 10,
          },
          {
            routeKey: "admin-invites-statistics",
            path: "statistics",
            component: "AdminInvitesStatistics",
            name: "邀请统计",
            layout: "admin",
            permissions: ["manage-invites"],
            sortOrder: 20,
          },
          {
            routeKey: "admin-invites-send",
            path: "send",
            component: "AdminSendInvite",
            name: "发送邀请",
            layout: "admin",
            permissions: ["send-official-invite"],
            sortOrder: 30,
          },
        ],
      },

      // 工单管理
      {
        routeKey: "admin-tickets",
        path: "tickets",
        component: "AdminTicketsList",
        name: "工单管理",
        layout: "admin",
        permissions: ["manage-tickets"],
        sortOrder: 130,
      },
      {
        routeKey: "admin-tickets-detail",
        path: "tickets/:id",
        component: "AdminTicketDetail",
        name: "工单详情",
        layout: "admin",
        permissions: ["manage-tickets"],
        isVisible: false,
      },

      // 路由管理
      {
        routeKey: "admin-routes",
        path: "routes",
        component: "RouteManagePage",
        name: "路由管理",
        layout: "admin",
        sortOrder: 140,
      },
    ],
  },
];

async function login() {
  const LOGIN_URL = "http://localhost:48230/auth/login";
  try {
    console.log("正在尝试登录以获取授权 token...");
    const response = await axios.post(LOGIN_URL, {
      username: "admin", // 默认管理员账号
      password: "123456", // 默认或开发环境密码
    });

    // 兼容不同的响应结构
    const data = response.data?.data || response.data;
    const token = data?.accessToken || data?.access_token;

    if (!token) {
      throw new Error("登录成功但未返回 token");
    }

    console.log("✅ 登录成功，已获取 Token");
    return token;
  } catch (error: any) {
    console.error("❌ 登录失败:", error.response?.data?.message || error.message);
    throw error;
  }
}

async function main() {
  const API_URL = "http://localhost:48230/routes/import";

  console.log("准备导入路由配置...");
  console.log(`目标 API: ${API_URL}`);
  console.log(`路由数量: ${routesData.length} 个根节点`);

  // 输出每个根节点的摘要
  console.log("\n========== 待导入数据摘要 ==========");
  for (const route of routesData) {
    const childCount = route.children?.length || 0;
    console.log(
      `- [${route.layout}] ${route.path} (routeKey: ${route.routeKey}, children: ${childCount})`,
    );
  }
  console.log("=====================================\n");

  try {
    // 输出发送的完整 JSON 数据
    const payload = { items: routesData };
    console.log("发送的 JSON 数据结构:");
    console.log(JSON.stringify(payload, null, 2).substring(0, 2000) + "...[截断]\n");

    const token = await login();
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios.post(API_URL, payload, config);

    console.log("========================================");
    console.log("导入成功！");
    console.log("响应状态码:", response.status);
    console.log("响应数据:", JSON.stringify(response.data, null, 2));

    // 自动清理缓存
    console.log("\n正在尝试清理路由缓存...");
    const clearUrl = "http://localhost:48230/routes/clear-cache";
    try {
      await axios.post(clearUrl, {}, config);
      console.log("✅ 缓存清理成功");
    } catch (clearErr: any) {
      console.warn("⚠️ 缓存清理失败:", clearErr.message);
    }

    // 验证：查询完整路由树
    console.log("\n========== 验证：查询数据库中的路由树 ==========");
    try {
      const treeResp = await axios.post("http://localhost:48230/admin/routes/tree", {}, config);
      const treeData = treeResp.data?.data;
      const routes = Array.isArray(treeData) ? treeData : [treeData];

      console.log(`数据库中的根节点数量: ${routes.length}`);
      for (const route of routes) {
        if (route) {
          console.log(
            `- [${route.layout || "无"}] ${route.path || "/"} (id: ${route.id}, children: ${route.children?.length || 0})`,
          );
        }
      }

      // 检查 admin 路由
      const adminRoute = routes.find((r: any) => r?.layout === "admin" || r?.path === "admin");
      if (adminRoute) {
        console.log("\n✅ Admin 路由已正确存储!");
        console.log("   Admin 子路由数量:", adminRoute.children?.length || 0);
      } else {
        console.log("\n❌ Admin 路由未找到！后端可能未正确存储数据。");
      }
    } catch (verifyErr: any) {
      console.warn("验证失败:", verifyErr.response?.data || verifyErr.message);
    }

    console.log("========================================");
  } catch (error: any) {
    console.error("========================================");
    console.error("导入失败！");
    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("错误信息:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("错误:", error.message);
    }
    console.error("========================================");
  }
}

main();
