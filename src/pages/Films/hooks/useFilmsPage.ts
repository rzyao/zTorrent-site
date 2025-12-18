/**
 * useFilmsPage
 * @deprecated /films 页面已废弃，此 Hook 仅用于保持类型兼容
 */
import { useState } from 'react';
import type { GenreOption, SortKey, TabKey } from '../types';

export function useFilmsPage() {
  // 视图筛选状态
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  return {
    // 数据
    movies: [],
    genres: [] as GenreOption[],
    loading: false,
    error: "此页面已废弃，请使用 /movies",
    isFetching: false,
    // 受控状态
    activeTab,
    searchQuery,
    sortBy,
    selectedGenre,
    // 更新器
    setActiveTab,
    setSearchQuery,
    setSortBy,
    setSelectedGenre,
    // 行为
    handleCollectToggle: (_?: any) => console.warn('Deprecated'),
    handleMovieClick: (_?: any) => console.warn('Deprecated'),
    retry: () => {},
  };
}
