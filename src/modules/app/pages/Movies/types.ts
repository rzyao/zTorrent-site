/**
 * 电影页共享类型定义
 * UI 层仅依赖这些轻量模型，避免直接耦合后端 DTO
 */
export type SortKey = 'rating' | 'year' | 'createdAt' | 'viewsCount';

export interface GenreOption {
  key: string;
  label: string;
}

export interface MovieCardData {
  id: string;
  title: string;
  originalTitle: string;
  year: number | string;
  poster?: string;
  posterUrl?: string;
  rating: number;
  director?: string;
  duration?: number;
  country?: string;
  genre?: string[];
  torrentsCount?: number;
  viewsCount?: number;
  isCollected?: boolean;
}
