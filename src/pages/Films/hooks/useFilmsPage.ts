import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getFilmsService, getOpenAPI, getRequest } from '@/api/lazy';
import { CollectFilmDto } from '@/api/models/CollectFilmDto';
import { PublicFilmDetailDto as PublicFilmDto } from '@/api/models/PublicFilmDetailDto';
import { ListFilmsDto } from '@/api/models/ListFilmsDto';
import { useDictionaryLabels } from '@/hooks/useDictionary';
import { getProfile } from '@/api/custom/auth';
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

  const { getCategoryLabel, refreshDictionaries } = useDictionaryLabels();

  // 读取用户默认分类字典（用于类型筛选 Chips）
  const { data: genres = [{ key: 'all', label: '全部' }] as GenreOption[] } = useQuery({
    queryKey: ['filmGenresDefault'],
    queryFn: async () => {
      const prof = await getProfile();
      const id = String(prof?.user?.id ?? prof?.user?._id ?? prof?.sub ?? '');
      if (!id) return [{ key: 'all', label: '全部' }];
      const OpenAPI = await getOpenAPI();
      const __request = await getRequest();
      const resp: any = await (__request as any)(OpenAPI, {
        method: 'POST',
        url: '/users/preferences/get-default-film-category-ids',
        body: { id },
        mediaType: 'application/json',
      });
      const body = resp?.code !== undefined ? resp : resp?.data;
      const data = body?.data ?? body;
      const keys: string[] = Array.isArray(data) ? data.map((x: any) => String(x)) : [];
      let mapped = keys.map((key) => ({ key, label: getCategoryLabel(key) || key }));
      if (mapped.some((m) => !m.label || m.label === m.key)) {
        await refreshDictionaries();
        mapped = keys.map((key) => ({ key, label: getCategoryLabel(key) || key }));
      }
      return [{ key: 'all', label: '全部' }, ...mapped];
    },
    staleTime: 1000 * 60 * 60,
  });

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

