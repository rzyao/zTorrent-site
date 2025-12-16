export interface CategoryNavItem {
  label: string;
  value: string;
  sort?: number;
  path?: string;
}

export const DEFAULT_NAV_CATEGORIES: CategoryNavItem[] = [
  { label: "全部", value: "home", path: "/home" },
  { label: "电影", value: "movie", path: "/home/movie" },
  { label: "电视剧", value: "tv", path: "/home/tv" },
  { label: "纪录片", value: "documentary", path: "/home/documentary" },
  { label: "动漫", value: "anime", path: "/home/anime" },
  { label: "音乐", value: "music", path: "/home/music" },
  { label: "游戏", value: "game", path: "/home/game" },
  { label: "软件", value: "software", path: "/home/software" },
  { label: "电子书", value: "ebook", path: "/home/ebook" },
];
