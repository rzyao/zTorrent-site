import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getFilmsService } from '@/api/lazy';
import { CollectFilmDto } from '@/api/models/CollectFilmDto';
import { PublicFilmDetailDto as PublicFilmDto } from '@/api/models/PublicFilmDetailDto';
import { ListFilmsDto } from '@/api/models/ListFilmsDto';
import { useDictionaryLabels } from '@/hooks/useDictionary';
import { usePreferenceCategoriesStore } from '@/stores/preferenceCategoriesStore';
import type { GenreOption, SortKey, TabKey } from '../types';

/**
 * useFilmsPage
 * 负责封装影片页的数据获取、乐观更新、导航与筛选状态
 * 将业务逻辑与展示层解耦，便于测试与复用
 */
export function useFilmsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 视图筛选状态（仅负责 UI 控件的受控值）
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const { getCategoryLabel, refreshDictionaries, getAllCategories } = useDictionaryLabels();

  // 从全局 store 获取影片分类数据
  const { film: filmCategories, isLoaded, fetchCategories } = usePreferenceCategoriesStore();

  // 首次加载时获取分类数据
  useEffect(() => {
    if (!isLoaded) {
      // 准备字典映射
      const dictCats = getAllCategories();
      const dictMap = new Map<string, string>();
      if (Array.isArray(dictCats)) {
        dictCats.forEach((c) => dictMap.set(c.key, c.label));
      }
      fetchCategories(dictMap);
    }
  }, [isLoaded, fetchCategories, getAllCategories]);

  // 根据 store 中的分类数据生成筛选选项（仅展示 show=true 的分类）
  const genres: GenreOption[] = useMemo(() => {
    const visibleCategories = filmCategories
      .filter((c) => c.show)
      .map((c) => ({ key: c.key, label: c.label || getCategoryLabel(c.key) || c.key }));
    return [{ key: 'all', label: '全部' }, ...visibleCategories];
  }, [filmCategories, getCategoryLabel]);

  // 影片列表查询
  const {
    data: filmsData,
    isLoading: loading,
    error: queryError,
    isFetching,
  } = useQuery({
    queryKey: ['films', { activeTab, selectedGenre, searchQuery, sortBy }],
    queryFn: async () => {
      const requestBody: ListFilmsDto = {
        page: 1,
        limit: 100,
        tab: activeTab === 'all' ? undefined : (activeTab as ListFilmsDto.tab),
        genre: selectedGenre === 'all' ? undefined : selectedGenre,
        search: searchQuery || undefined,
        sortBy: sortBy as ListFilmsDto.sortBy,
        year: undefined,
      };
      const FilmsService = await getFilmsService();
      const response = await FilmsService.filmsControllerListFilms(requestBody);
      return {
        items: (response.data?.items || []) as PublicFilmDto[],
        total: response.data?.total || 0,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const movies = filmsData?.items || [];
  const error = queryError ? (queryError as Error).message || '获取影片列表失败' : null;

  // 收藏/取消收藏：乐观更新
  const collectMutation = useMutation({
    mutationFn: async ({ movieId, newIsCollected }: { movieId: string; newIsCollected: boolean }) => {
      const FilmsService = await getFilmsService();
      await FilmsService.filmsControllerCollectMovie({
        filmId: movieId,
        action: newIsCollected ? CollectFilmDto.action.COLLECT : CollectFilmDto.action.UNCOLLECT,
      });
    },
    onMutate: async ({ movieId, newIsCollected }) => {
      await queryClient.cancelQueries({ queryKey: ['films'] });
      const previousFilmsData = queryClient.getQueryData(['films', { activeTab, selectedGenre, searchQuery, sortBy }]);
      queryClient.setQueryData(['films', { activeTab, selectedGenre, searchQuery, sortBy }], (old: any) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((movie: PublicFilmDto) => {
            if (movie.id === movieId) {
              return {
                ...movie,
                isCollected: newIsCollected,
                collectionsCount: movie.collectionsCount + (newIsCollected ? 1 : -1),
              };
            }
            return movie;
          }),
        };
      });
      return { previousFilmsData } as any;
    },
    onError: (err, _vars, context: any) => {
      if (context?.previousFilmsData) {
        queryClient.setQueryData(['films', { activeTab, selectedGenre, searchQuery, sortBy }], context.previousFilmsData);
      }
      console.error('收藏操作失败:', err);
    },
  });

  function handleCollectToggle(movieId: string) {
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) return;
    collectMutation.mutate({ movieId, newIsCollected: !movie.isCollected });
  }

  async function handleMovieClick(movie: PublicFilmDto) {
    try {
      const FilmsService = await getFilmsService();
      await FilmsService.filmsControllerViewMovie({ id: movie.id });
    } catch (err) {
      console.error('增加浏览次数失败:', err);
    }
    navigate(`/film/${movie.id}`);
  }

  function retry() {
    queryClient.invalidateQueries({ queryKey: ['films'] });
  }

  return {
    // 数据
    movies,
    genres,
    loading,
    error,
    isFetching,
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
    handleCollectToggle,
    handleMovieClick,
    retry,
  };
}

