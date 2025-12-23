/**
 * 影片详情页面的类型定义集合
 * 将页面所需的所有数据结构集中在此，便于复用与维护
 */

export interface UploaderInfo {
  name: string;
  avatar: string;
  level: string;
  uploads: number;
  ratio: string;
}

export interface AwardItem {
  name: string;
  won: boolean;
  year: string;
  category: string;
}

export interface TorrentItem {
  id: string;
  title: string;
  subTitle?: string;
  category: string;
  image: string;
  size: string;
  seeders: number;
  leechers: number;
  completed: number;
  uploader: string;
  uploadTime: string;
  uploadDate: string;
  isFree: boolean;
  isVip: boolean;
  isHot: boolean;
  comments: number;
  rating: number;
}

export interface CommentUser {
  name: string;
  level: string;
}

export interface CommentItem {
  id: string;
  user: CommentUser;
  rating: number;
  content: string;
  date: string;
  likes: number;
  replies: number;
}

export interface RelatedItem {
  id: string | number;
  title: string;
  thumbnail: string;
  rating: number;
  seeders: number;
  size: string;
  isFree?: boolean;
  isHot?: boolean;
}

export interface FilmDetail {
  id: string;
  title: string;
  subtitle: string;
  poster: string;
  backdrop: string;
  category: string;
  subCategory: string;
  year: number;
  duration: string;
  director: string;
  cast: string[];
  imdb: string;
  douban: string;
  rating: number;
  ratingCount: number;
  description: string;
  stills: string[];
  awards: AwardItem[];
  size: string;
  files: number;
  seeders: number;
  leechers: number;
  completed: number;
  uploadDate: string;
  uploader: UploaderInfo;
  isFree: boolean;
  isHot: boolean;
  isVip: boolean;
  videoCodec: string;
  videoResolution: string;
  videoFrameRate: string;
  videoBitRate: string;
  audioCodec: string;
  audioBitRate: string;
  audioLanguages: string[];
  subtitles: string[];
  fileList: string[];
  views: number;
  bookmarks: number;
  thanks: number;
  comments: CommentItem[];
  relatedTorrents: RelatedItem[];
  otherVersions: Array<{ id: string | number; title: string; seeders: number; size: string }>;
  torrents: TorrentItem[];
  isFavorited?: boolean;
}

