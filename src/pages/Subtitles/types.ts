// 字幕中心页面 - 类型定义
// 说明：将页面中的数据结构集中到 types.ts，便于组件与钩子共享、提高可维护性与类型安全。

export type SortBy = 'latest' | 'downloads' | 'rating' | 'uploads';
export type FilterLanguage = 'all' | 'zh' | 'en' | 'jp' | 'kr';

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

export interface UploadForm {
  name: string;
  type: string;
  language: string;
  torrentId: string;
  description: string;
  file: File | null;
}

export interface TorrentOption {
  id: string;
  name: string;
}

