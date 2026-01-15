export interface TorrentDetailPageProps {
  torrentId?: string | number;
}

export interface TorrentData {
  id: number | string;
  title: string;
  subTitle: string;
  category: string;
  videoCodec: string;
  standard: string;
  audioCodec: string;
  medium: string;
  productionTeam: string;
  size: string;
  uploadDate: string;
  seeders: number;
  leechers: number;
  completed: number;
  comments: number;
  thanks: number;
  rating: number;
  imdb: string;
  douban: string;
  uploader: string;
  uploaderLevel: string;
  isFree: boolean;
  promotionEnd: string;
  views: number;
  description: string;
  downloadUrl: string;
  isFavorited?: boolean;
}

export interface FileItem {
  name: string;
  size: string;
  type: "file" | "folder";
  children?: FileItem[];
}

export interface Comment {
  id: number | string;
  user: string;
  userLevel: string;
  avatar: string;
  date: string;
  content: string;
  thanks: number;
}

export interface RelatedTorrent {
  id: number | string;
  title: string;
  size: string;
  seeders: number;
  leechers: number;
  isFree: boolean;
}

/**
 * 结构化电影/剧集信息的英文键名接口。
 */
export interface EnglishMovieInfo {
  TranslationName: string | null;
  FilmName: string | null;
  Year: string | null;
  Country: string | null;
  Category: string[] | null;
  Language: string | null;
  ReleaseDate: string | null;
  DoubanRating: string | null;
  DoubanLink: string | null;
  EpisodesCount: string | null;
  Runtime: string | null;
  Director: string[] | null;
  Writer: string[] | null;
  Actors: string[] | null;
}

/**
 * 最终输出的完整英文结构接口。
 */
export interface DescriptionData {
  SourceInfo: string[];
  MovieInfo: EnglishMovieInfo;
  Synopsis?: string;
}

/**
 * 原始中文键名接口 (假设的输入结构)。
 */
export interface ChineseMovieInfo {
  译名?: string;
  片名?: string;
  年代?: string;
  产地?: string;
  类别?: string[];
  语言?: string;
  上映日期?: string;
  豆瓣评分?: string;
  豆瓣链接?: string;
  集数?: string;
  片长?: string;
  导演?: string[];
  编剧?: string[];
  主演?: string[];
}

export interface ChineseInputData {
  引用信息: string[];
  影片信息: ChineseMovieInfo;
  简介?: string;
}
