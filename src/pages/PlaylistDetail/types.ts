// 片单详情相关类型定义（组件与数据层共享）
// 说明：将页面内的 any 类型提炼为明确的结构，便于子组件间传递与复用

export interface PlaylistFilm {
  // 影片的唯一主键：优先使用后端提供的 filmId，其次使用 id，最后回退为索引
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  director: string;
  poster: string;
  backdrop: string;
  rating: number;
  genre: string[];
  duration: number;
  torrentsCount: number;
  sort: number;
  torrents: any[];
}

export interface PlaylistDetail {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  creator: string;
  creatorAvatar: string;
  moviesCount: number;
  followersCount: number;
  viewsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  films: any[]; // 服务端原始 films 列表，保留以便后续扩展
  isLiked: boolean;
}

