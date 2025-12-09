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

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  backdrop: string;
  category: string;
  genres: string[];
  rating: number;
  duration: string;
  director: string;
  cast: string[];
  description: string;
  torrents: Torrent[];
  createdAt: string;
  updatedAt: string;
}

export interface MovieFormState {
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  backdrop: string;
  category: string;
  genres: string[];
  rating: number;
  duration: string;
  director: string;
  cast: string[];
  description: string;
  awards: string[];
  region: string[];
  language: string[];
  doubanLink: string;
  imdbLink: string;
  doubanRatingAverage: number;
  imdbRatingAverage: number;
}
