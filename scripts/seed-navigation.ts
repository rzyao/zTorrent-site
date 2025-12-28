import { fetch } from "undici";

// 尝试去掉 /api，因为 Swagger 显示路径为 /admin/navigation/import
const API_BASE_URL = "http://localhost:8890";

interface NavigationWithChildren {
  label: string;
  path: string;
  platform: "desktop" | "mobile";
  sortOrder: number;
  isVisible: boolean;
  icon?: string;
  permissions?: string[];
  children?: NavigationWithChildren[];
}

const DESKTOP_DATA: NavigationWithChildren[] = [
  { label: "首页", path: "/home", platform: "desktop", sortOrder: 1, isVisible: true },
  { label: "种子", path: "/torrents", platform: "desktop", sortOrder: 2, isVisible: true },
  { label: "字幕", path: "/subtitles", platform: "desktop", sortOrder: 3, isVisible: true },
  { label: "排行榜", path: "/ranking", platform: "desktop", sortOrder: 4, isVisible: true },
  { label: "电影", path: "/movies", platform: "desktop", sortOrder: 5, isVisible: true },
  { label: "剧集", path: "/series", platform: "desktop", sortOrder: 6, isVisible: true },
  { label: "片单", path: "/playlists", platform: "desktop", sortOrder: 7, isVisible: true },
  {
    label: "发布",
    path: "/upload",
    platform: "desktop",
    sortOrder: 8,
    isVisible: true,
    permissions: ["upload"],
  },
  { label: "候选", path: "/candidates", platform: "desktop", sortOrder: 9, isVisible: true },
  {
    label: "编辑",
    path: "#",
    platform: "desktop",
    sortOrder: 10,
    isVisible: true,
    children: [
      {
        label: "电影",
        path: "/edit/movie",
        platform: "desktop",
        sortOrder: 1,
        isVisible: true,
        permissions: ["edit:movie"],
      },
      {
        label: "剧集",
        path: "/edit/series",
        platform: "desktop",
        sortOrder: 2,
        isVisible: true,
        permissions: ["edit:series"],
      },
      {
        label: "片单",
        path: "/edit/playlist",
        platform: "desktop",
        sortOrder: 3,
        isVisible: true,
        permissions: ["edit:playlist"],
      },
    ],
  },
  { label: "论坛", path: "/forum", platform: "desktop", sortOrder: 11, isVisible: true },
  { label: "规则", path: "/rules", platform: "desktop", sortOrder: 12, isVisible: true },
  {
    label: "审核",
    path: "/review",
    platform: "desktop",
    sortOrder: 13,
    isVisible: true,
    permissions: ["review"],
  },
  {
    label: "其他",
    path: "#",
    platform: "desktop",
    sortOrder: 14,
    isVisible: true,
    children: [
      {
        label: "工单",
        path: "/tickets",
        platform: "desktop",
        sortOrder: 1,
        isVisible: true,
        permissions: ["tickets"],
      },
      { label: "求种", path: "/requests", platform: "desktop", sortOrder: 2, isVisible: true },
      { label: "制作组", path: "/groups", platform: "desktop", sortOrder: 3, isVisible: true },
      { label: "RSS订阅", path: "/rss", platform: "desktop", sortOrder: 4, isVisible: true },
      { label: "管理组", path: "/staff", platform: "desktop", sortOrder: 5, isVisible: true },
      { label: "使用教程", path: "/tutorials", platform: "desktop", sortOrder: 6, isVisible: true },
      { label: "保种列表", path: "/seeding", platform: "desktop", sortOrder: 7, isVisible: true },
      {
        label: "断种大厅",
        path: "/dead-torrents",
        platform: "desktop",
        sortOrder: 8,
        isVisible: true,
      },
      { label: "小游戏", path: "/games", platform: "desktop", sortOrder: 9, isVisible: true },
      {
        label: "站点公告",
        path: "/announcements",
        platform: "desktop",
        sortOrder: 10,
        isVisible: true,
      },
      { label: "音乐", path: "/music", platform: "desktop", sortOrder: 11, isVisible: true },
      { label: "播放器", path: "/player", platform: "desktop", sortOrder: 12, isVisible: true },
    ],
  },
];

const MOBILE_DATA: NavigationWithChildren[] = [
  { label: "首页", path: "/home", platform: "desktop", sortOrder: 1, isVisible: true },
  { label: "种子", path: "/torrents", platform: "desktop", sortOrder: 2, isVisible: true },
  { label: "字幕", path: "/subtitles", platform: "desktop", sortOrder: 3, isVisible: true },
  { label: "排行榜", path: "/ranking", platform: "desktop", sortOrder: 4, isVisible: true },
  { label: "电影", path: "/movies", platform: "desktop", sortOrder: 5, isVisible: true },
  { label: "剧集", path: "/series", platform: "desktop", sortOrder: 6, isVisible: true },
  { label: "片单", path: "/playlists", platform: "desktop", sortOrder: 7, isVisible: true },
  {
    label: "发布",
    path: "/upload",
    platform: "desktop",
    sortOrder: 8,
    isVisible: true,
    permissions: ["upload"],
  },
  { label: "候选", path: "/candidates", platform: "desktop", sortOrder: 9, isVisible: true },
  {
    label: "编辑",
    path: "#",
    platform: "desktop",
    sortOrder: 10,
    isVisible: true,
    children: [
      {
        label: "电影",
        path: "/edit/movie",
        platform: "desktop",
        sortOrder: 1,
        isVisible: true,
        permissions: ["edit:movie"],
      },
      {
        label: "剧集",
        path: "/edit/series",
        platform: "desktop",
        sortOrder: 2,
        isVisible: true,
        permissions: ["edit:series"],
      },
      {
        label: "片单",
        path: "/edit/playlist",
        platform: "desktop",
        sortOrder: 3,
        isVisible: true,
        permissions: ["edit:playlist"],
      },
    ],
  },
  { label: "论坛", path: "/forum", platform: "desktop", sortOrder: 11, isVisible: true },
  { label: "规则", path: "/rules", platform: "desktop", sortOrder: 12, isVisible: true },
  {
    label: "审核",
    path: "/review",
    platform: "desktop",
    sortOrder: 13,
    isVisible: true,
    permissions: ["review"],
  },
  {
    label: "工单",
    path: "/tickets",
    platform: "desktop",
    sortOrder: 1,
    isVisible: true,
    permissions: ["tickets"],
  },
  { label: "求种", path: "/requests", platform: "desktop", sortOrder: 2, isVisible: true },
  { label: "制作组", path: "/groups", platform: "desktop", sortOrder: 3, isVisible: true },
  { label: "RSS订阅", path: "/rss", platform: "desktop", sortOrder: 4, isVisible: true },
  { label: "管理组", path: "/staff", platform: "desktop", sortOrder: 5, isVisible: true },
  { label: "使用教程", path: "/tutorials", platform: "desktop", sortOrder: 6, isVisible: true },
  { label: "保种列表", path: "/seeding", platform: "desktop", sortOrder: 7, isVisible: true },
  { label: "断种大厅", path: "/dead-torrents", platform: "desktop", sortOrder: 8, isVisible: true },
  { label: "小游戏", path: "/games", platform: "desktop", sortOrder: 9, isVisible: true },
  {
    label: "站点公告",
    path: "/announcements",
    platform: "desktop",
    sortOrder: 10,
    isVisible: true,
  },
  { label: "音乐", path: "/music", platform: "desktop", sortOrder: 11, isVisible: true },
  { label: "播放器", path: "/player", platform: "desktop", sortOrder: 12, isVisible: true },
];

async function seed() {
  // 尝试两个常见的前缀策略
  const endpoints = [
    `${API_BASE_URL}/api/admin/navigation/import`, // First try with /api
    `${API_BASE_URL}/admin/navigation/import`, // Then try without /api
  ];

  const payload = {
    items: [...DESKTOP_DATA, ...MOBILE_DATA],
  };

  console.log(`Payload prepared with ${payload.items.length} top-level items.`);

  let lastError;

  for (const url of endpoints) {
    console.log(`Trying endpoint: ${url} ...`);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Seed successful at ${url}!`);
        console.log("Result:", result);
        return; // Success
      }

      if (response.status === 404) {
        console.log(`❌ 404 Not Found at ${url}`);
        lastError = new Error(`404 Not Found at ${url}`);
      } else {
        const text = await response.text();
        throw new Error(`API Error ${response.status}: ${text}`);
      }
    } catch (err: any) {
      console.error(`❌ Request failed: ${err.message}`);
      lastError = err;
    }
  }

  console.error("\n⚠️  All attempts failed.");
  if (lastError && lastError.message.includes("404")) {
    console.error("👉 The endpoint seems reachable but returning 404.");
  }
}

seed().catch(console.error);
