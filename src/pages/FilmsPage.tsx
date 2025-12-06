import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Film, Star, Calendar, Users, Eye, Play, Search, Filter, BookmarkPlus, TrendingUp, Clock, Award, Loader2 } from 'lucide-react';
import { FilmsService } from '@/api/services/FilmsService';
import { CollectFilmDto } from '@/api/models/CollectFilmDto';
import { PublicFilmDetailDto as PublicFilmDto } from '@/api/models/PublicFilmDetailDto';
import { ListFilmsDto } from '@/api/models/ListFilmsDto';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useDictionaryLabels } from '@/hooks/useDictionary';
import { getProfile } from '@/api/custom/auth';



export function FilmsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'latest' | 'classic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'latest' | 'popular'>('rating');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const { getCategoryLabel, refreshDictionaries } = useDictionaryLabels();

  const { data: genres = [{ key: 'all', label: '全部' }] } = useQuery({
    queryKey: ['filmGenresDefault'],
    queryFn: async () => {
      const prof = await getProfile();
      const id = String(prof?.user?.id ?? prof?.user?._id ?? prof?.sub ?? '');
      if (!id) return [{ key: 'all', label: '全部' }];
      const { OpenAPI } = await import('@/api/core/OpenAPI');
      const { request: __request } = await import('@/api/core/request');
      const resp: any = await __request(OpenAPI, {
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

  // 获取影片列表
  const { data: filmsData, isLoading: loading, error: queryError, isFetching } = useQuery({
    queryKey: ['films', { activeTab, selectedGenre, searchQuery, sortBy }],
    queryFn: async () => {
      const requestBody: ListFilmsDto = {
        page: 1,
        limit: 100,
        tab: activeTab === 'all' ? undefined : activeTab as ListFilmsDto.tab,
        genre: selectedGenre === 'all' ? undefined : selectedGenre,
        search: searchQuery || undefined,
        sortBy: sortBy as ListFilmsDto.sortBy,
        year: undefined
      };
      const response = await FilmsService.filmsControllerListFilms(requestBody);
      return {
        items: (response.data?.items || []) as PublicFilmDto[],
        total: response.data?.total || 0
      };
    },
    // 保持之前的数据直到新数据加载完成，避免闪烁
    placeholderData: (previousData) => previousData,
  });

  const movies = filmsData?.items || [];
  const error = queryError ? (queryError as Error).message || '获取影片列表失败' : null;

  // 收藏操作 Mutation
  const collectMutation = useMutation({
    mutationFn: async ({ movieId, newIsCollected }: { movieId: string, newIsCollected: boolean }) => {
      await FilmsService.filmsControllerCollectMovie({
        filmId: movieId,
        action: newIsCollected ? CollectFilmDto.action.COLLECT : CollectFilmDto.action.UNCOLLECT
      });
    },
    onMutate: async ({ movieId, newIsCollected }) => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: ['films'] });

      // 获取之前的快照
      const previousFilmsData = queryClient.getQueryData(['films', { activeTab, selectedGenre, searchQuery, sortBy }]);

      // 乐观更新
      queryClient.setQueryData(['films', { activeTab, selectedGenre, searchQuery, sortBy }], (old: any) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((movie: PublicFilmDto) => {
            if (movie.id === movieId) {
              return {
                ...movie,
                isCollected: newIsCollected,
                collectionsCount: movie.collectionsCount + (newIsCollected ? 1 : -1)
              };
            }
            return movie;
          })
        };
      });

      return { previousFilmsData };
    },
    onError: (err, newTodo, context: any) => {
      // 出错时回滚
      if (context?.previousFilmsData) {
        queryClient.setQueryData(['films', { activeTab, selectedGenre, searchQuery, sortBy }], context.previousFilmsData);
      }
      console.error('收藏操作失败:', err);
    },
    onSettled: () => {
      // 完成后重新获取（可选，如果乐观更新足够准确可以不加）
      // queryClient.invalidateQueries({ queryKey: ['films'] });
    }
  });

  const handleCollectToggle = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    collectMutation.mutate({ movieId, newIsCollected: !movie.isCollected });
  };

  const handleMovieClick = async (movie: PublicFilmDto) => {
    // 增加浏览次数
    try {
      await FilmsService.filmsControllerViewMovie({ id: movie.id });
    } catch (err) {
      console.error('增加浏览次数失败:', err);
    }
    navigate(`/film/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* 页面标题 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white text-3xl">影片浏览</h1>
            </div>
            <p className="text-neutral-400 ml-13">发现和收藏优质影片资源</p>
          </div>
          {isFetching && !loading && (
            <div className="flex items-center gap-2 text-neutral-400 text-sm bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>更新中...</span>
            </div>
          )}
        </div>

        {/* 标签页切换 */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
          >
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              <span>全部影片</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'trending'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>热门影片</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'latest'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>最新上映</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('classic')}
            className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === 'classic'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>经典影片</span>
            </div>
          </button>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索影片名称、导演..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-neutral-900 border border-neutral-700 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer w-full md:w-auto"
            >
              <option value="rating">评分最高</option>
              <option value="latest">最新上映</option>
              <option value="popular">最受欢迎</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
          </div>
        </div>

        {/* 类型筛选 */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {genres.map((genre) => (
            <button
              key={genre.key}
              onClick={() => setSelectedGenre(genre.key)}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${selectedGenre === genre.key
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-700 hover:bg-neutral-800 hover:text-white'
                }`}
            >
              {genre.label}
            </button>
          ))}
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-neutral-400">正在加载影片...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <Film className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-white text-xl mb-2">加载失败</h3>
            <p className="text-neutral-500 mb-6">{error}</p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['films'] })}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {/* 影片网格 */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="group bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
                  onClick={() => handleMovieClick(movie)}
                >
                  {/* 海报 */}
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={(movie as any).posterUrl || movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* 悬浮播放按钮 */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-amber-500/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* 评分标签 */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                      <span className="text-white text-sm">{movie.rating}</span>
                    </div>

                    {/* 年份标签 */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
                      <span className="text-white text-sm">{movie.year}</span>
                    </div>

                    {/* 收藏按钮 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCollectToggle(movie.id);
                      }}
                      className={`absolute bottom-3 right-3 w-8 h-8 rounded-lg backdrop-blur-sm flex items-center justify-center transition-all ${movie.isCollected
                        ? 'bg-amber-500/80 text-white'
                        : 'bg-black/60 text-neutral-400 hover:bg-black/80 hover:text-white'
                        }`}
                    >
                      <BookmarkPlus className={`w-4 h-4 ${movie.isCollected ? 'fill-current' : ''}`} />
                    </button>

                    {/* 底部信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-neutral-400 text-xs line-clamp-1">
                        {movie.originalTitle}
                      </p>
                    </div>
                  </div>

                  {/* 详细信息（悬浮显示） */}
                  <div className="p-4 space-y-3">
                    {/* 导演 */}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-neutral-400 truncate">{movie.director}</span>
                    </div>

                    {/* 时长和国家 */}
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{movie.duration}分钟</span>
                      </div>
                      <span>•</span>
                      <span>{movie.country}</span>
                    </div>

                    {/* 类型标签 */}
                    <div className="flex flex-wrap gap-1.5">
                      {(movie.genre || []).slice(0, 3).map((g, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* 统计信息 */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                      <div className="flex items-center gap-1 text-neutral-500">
                        <Film className="w-3 h-3" />
                        <span>{movie.torrentsCount} ��子</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-500">
                        <Eye className="w-3 h-3" />
                        <span>{(movie.viewsCount / 1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 空状态 */}
            {movies.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
                  <Film className="w-10 h-10 text-neutral-600" />
                </div>
                <h3 className="text-white text-xl mb-2">暂无影片</h3>
                <p className="text-neutral-500 mb-6">
                  没有找到符合条件的影片
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
