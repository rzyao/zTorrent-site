export interface Subtitle {
  id: string;
  name: string;
  type: string;
  language: string;
  languageCode: string;
  torrentName: string;
  torrentId: string;
  uploader: string;
  uploadDate: string;
  downloads: number;
  uploads: number;
  rating: number;
  reviews: number;
  verified: boolean;
  description: string;
}

export type SortBy = 'latest' | 'downloads' | 'rating' | 'uploads';
export type FilterLanguage = 'all' | 'zh' | 'en' | 'jp' | 'kr';
