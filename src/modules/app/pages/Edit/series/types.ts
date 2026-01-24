export interface Series {
  id: string;
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  backdrop: string;
  categories: string[];
  genres: string[];
  rating: number;
  duration: string;
  director: string;
  cast: string[];
  description: string;

  episodeCount: number;
  status: string;
  doubanLink: string;
  imdbLink: string;
  torrents: SeriesTorrent[];
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string; // 后端 DTO 可能没 id? EpisodeDTO 确实没有 ID，只有 composite key (seriesId, season, episode)。确认一下 UpdateEpisodeDto
  seriesId: string;

  episodeNumber: number;
  title: string;
  originalTitle?: string;
  overview?: string;
  airDate?: string;
  stillUrl?: string;
  voteAverage?: number;
  runtime?: number;
}

// Check UpdateEpisodeDto via view_file if needed, usually it needs identify the episode.
// Assuming (seriesId, seasonNumber, episodeNumber) is the key.

export interface EpisodeFormState {
  id?: string; // 更新时使用
  seriesId: string;

  episodeNumber: number;
  title: string;
  originalTitle?: string;
  overview?: string;
  airDate?: string;
  stillUrl?: string;
  runtime?: number;
}

export interface SeriesTorrent {
  id: string; // 绑定关系的ID or Torrent ID? 应该是 绑定的记录ID，或者直接是 Torrent 信息
  torrentId: string; // 实际种子ID
  title?: string;
  subTitle?: string;
  version: string;
  size: string;
  quality: string;
  standard?: string;
  source: string;
  codec: string;
  audio: string;
  seeders: number;
  leechers: number;
  uploadDate: string;
  isFree?: boolean;
  isVip?: boolean;

  // 绑定信息
  // 绑定信息
  episodeNumber?: number;
}

export interface Torrent {
  id: string;
  title?: string;
  subTitle?: string;
  version: string;
  size: string;
  quality: string;
  standard?: string;
  source: string;
  codec: string;
  audio: string;
  seeders: number;
  leechers: number;
  uploadDate: string;
  isFree?: boolean;
  isVip?: boolean;
}

export interface SeriesFormState {
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  backdrop: string;
  categories: string[];
  genres: string[];
  rating: number;
  duration: string;
  director: string;
  cast: string[];
  description: string;

  episodeCount: number;
  status: string;
  avgRating?: number;
  doubanLink: string;
  imdbLink: string;
  doubanRatingAverage: number;
  imdbRatingAverage: number;

  posterAttachmentId?: string;
  backdropAttachmentId?: string;
}
