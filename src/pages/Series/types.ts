/**
 * 剧集页共享类型定义
 * UI 层仅依赖这些轻量模型，避免直接耦合后端 DTO
 */
export type SortKey = 'rating' | 'year' | 'createdAt' | 'viewsCount';
export type SeriesStatus = 'airing' | 'ended' | 'upcoming';

export interface GenreOption {
  key: string;
  label: string;
}

export interface StatusOption {
  key: SeriesStatus | 'all';
  label: string;
}

export interface SeriesCardData {
  id: string;
  title: string;
  originalTitle?: string;
  year: number | string;
  poster?: string;
  posterUrl?: string;
  rating: number;
  seasonNumber?: number;    // 第几季
  episodeCount?: number;    // 总集数
  status?: SeriesStatus;    // 播出状态
  director?: string;
  country?: string;
  genre?: string[];
  torrentsCount?: number;
  viewsCount?: number;
  isCollected?: boolean;
}

// 状态选项配置
export const STATUS_OPTIONS: StatusOption[] = [
  { key: 'all', label: '全部' },
  { key: 'airing', label: '连载中' },
  { key: 'ended', label: '已完结' },
  { key: 'upcoming', label: '待播出' },
];
