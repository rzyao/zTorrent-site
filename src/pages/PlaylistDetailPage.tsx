import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Share2, Eye, Film, Clock, Star, Play, Plus, Edit, Trash2, Grid, List as ListIcon, Calendar, Award, TrendingUp, Bookmark } from 'lucide-react';
import { PlaylistsService } from '@/api';
import { useNavigate } from 'react-router-dom';

interface PlaylistDetailPageProps {
  playlistId: string;
  onBack: () => void;
  onFilmClick?: (filmId: string) => void;
}

export function PlaylistDetailPage({ playlistId, onBack, onFilmClick }: PlaylistDetailPageProps) {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'order' | 'rating' | 'year'>('order');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const sortedMovies = (() => {
    const list = [...movies];
    switch (sortBy) {
      case 'rating':
        return list.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
      case 'year':
        return list.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
      case 'order':
      default:
        return list.sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0));
    }
  })();
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const resp: any = await PlaylistsService.playlistsControllerGet({ id: playlistId });
        const raw = resp?.data ?? resp;
        const adapted = {
          id: raw?.id ?? playlistId,
          title: raw?.name ?? '',
          description: raw?.description ?? '',
          coverImage: raw?.coverUrl ?? raw?.backdropUrl ?? '',
          creator: '',
          creatorAvatar: '',
          moviesCount: Array.isArray(raw?.films) ? raw.films.length : 0,
          followersCount: Number(raw?.stats?.likes ?? 0),
          viewsCount: Number(raw?.stats?.views ?? 0),
          rating: 0,
          createdAt: raw?.meta?.createdAt ?? '',
          updatedAt: raw?.meta?.updatedAt ?? '',
          tags: Array.isArray(raw?.tags) ? raw.tags : [],
          films: raw?.films ?? [],
          isLiked: false,
        };
        if (!mounted) return;
        setPlaylist(adapted);
        setIsFollowing(!!adapted.isLiked);
        try {
          await PlaylistsService.playlistsControllerIncViews({ id: playlistId });
          setPlaylist((prev: any) => prev ? { ...prev, viewsCount: Number(prev.viewsCount ?? 0) + 1 } : prev);
        } catch { }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? '加载失败');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [playlistId, reloadKey]);

  useEffect(() => {
    const rawFilms: any[] = (playlist?.films ?? []) as any[];
    // 适配片单返回的影片项：优先使用后端提供的 filmId 作为影片主键
    // 修复：此前使用了 f.id，可能为片单项的局部 ID，导致跳转到 /film/:id 携带错误 ID
    const adapted = rawFilms.map((f: any, idx: number) => ({
      id: String(f?.filmId ?? f?.id ?? idx),
      title: f?.title ?? '',
      originalTitle: f?.originalTitle ?? '',
      year: Number(f?.year ?? 0),
      director: f?.director ?? '',
      poster: f?.poster ?? f?.posterUrl ?? '',
      backdrop: f?.backdrop ?? f?.backdropUrl ?? '',
      rating: Number(f?.rating ?? 0),
      genre: Array.isArray(f?.genre) ? f.genre : Array.isArray(f?.genres) ? f.genres : [],
      duration: Number(f?.duration ?? 0),
      torrentsCount: Number(f?.torrentsCount ?? (Array.isArray(f?.torrents) ? f.torrents.length : 0)),
      sort: Number(f?.sort ?? idx),
      torrents: f?.torrents ?? [],
    }));
    setMovies(adapted);
  }, [playlist]);

  // 点击影片卡片时跳转到影片详情页
  // 变更说明：原逻辑为在片单页内以弹窗方式打开影片详情（根据是否存在第一个种子决定），
  // 这导致用户感知为未跳转到详情页。现统一改为路由跳转到 `/film/:id`，
  // 并通过查询参数保留来源追踪信息，便于后续统计或回溯。
  const openFilm = (id: string) => {
    const qs = new URLSearchParams();
    // 来源片单 ID
    qs.set('source_playlist_id', String(playlistId));
    // 来源影片 ID（片单内被点击的影片）
    qs.set('source_film_id', String(id));
    // 路由跳转到影片详情页，保留来源追踪查询参数
    navigate(`/film/${id}?${qs.toString()}`, { replace: false });
  };

  const handleToggleFollow = async () => {
    const next = !isFollowing;
    setIsFollowing(next);
    setPlaylist((prev: any) => {
      if (!prev) return prev;
      const delta = next ? 1 : -1;
      return { ...prev, followersCount: Number(prev.followersCount ?? 0) + delta };
    });
    try {
      await PlaylistsService.playlistsControllerLike({ id: playlistId });
    } catch (e) {
      setIsFollowing(!next);
      setPlaylist((prev: any) => {
        if (!prev) return prev;
        const delta = next ? -1 : 1;
        return { ...prev, followersCount: Number(prev.followersCount ?? 0) + delta };
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F171E] relative">
      <div className="absolute inset-0 px-8 pt-24 pointer-events-none">
        <button
          onClick={onBack}
          className="sticky top-0 z-50 px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-all flex items-center gap-2 backdrop-blur-sm pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回片单</span>
        </button>
      </div>

      {/* 头部横幅 */}
      <div className="relative h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${playlist?.coverImage ?? ''})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/80 to-transparent" />




        {/* 片单信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              {(playlist?.tags ?? []).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-5xl text-white mb-4">{playlist?.title ?? ''}</h1>

            <div className="flex items-center gap-6 mb-4 text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-sm">{playlist?.creatorAvatar ?? ''}</span>
                </div>
                <span>{playlist?.creator ?? ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>{playlist?.moviesCount ?? 0} 部影片</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{Number(playlist?.followersCount ?? 0).toLocaleString()} 关注</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{Number(playlist?.viewsCount ?? 0).toLocaleString()} 浏览</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{typeof playlist?.rating === 'number' ? playlist!.rating.toFixed(1) : '0.0'}</span>
              </div>
            </div>

            <p className="text-gray-300 text-lg max-w-4xl mb-6 leading-relaxed">
              {playlist?.description ?? ''}
            </p>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleToggleFollow}
                className={`px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 ${isFollowing
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                  }`}
              >
                <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                <span>{isFollowing ? '已关注' : '关注片单'}</span>
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>分享</span>
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span>播放全部</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 影片列表 */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-amber-500" />
              影片列表
            </h2>
            <span className="text-gray-400">共 {sortedMovies.length} 部</span>
          </div>

          <div className="flex items-center gap-3">
            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <option value="order">默认排序</option>
              <option value="rating">评分排序</option>
              <option value="year">年份排序</option>
            </select>

            {/* 视图切换 */}
            <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${viewMode === 'grid'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${viewMode === 'list'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setReloadKey((v) => v + 1)} className="px-3 py-1 rounded bg-red-500/20 border border-red-500/50 text-red-200">
              重试
            </button>
          </div>
        )}
        {loading && (
          <div className="mb-6 text-gray-400">正在加载片单数据…</div>
        )}

        {/* 网格视图 */}
        {viewMode === 'grid' && !loading && sortedMovies.length === 0 && (
          <div className="text-gray-400">暂无影片</div>
        )}
        {viewMode === 'grid' && sortedMovies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => openFilm(movie.id)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* 评分 */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-white text-sm">{movie.rating}</span>
                  </div>

                  {/* 悬浮操作 */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>查看详情</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-white mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{movie.year}</span>
                  <span>·</span>
                  <span>{movie.duration}分钟</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <Film className="w-3 h-3" />
                  <span>{movie.torrentsCount} 个种子</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 列表视图 */}
        {viewMode === 'list' && !loading && sortedMovies.length === 0 && (
          <div className="text-gray-400">暂无影片</div>
        )}
        {viewMode === 'list' && sortedMovies.length > 0 && (
          <div className="space-y-3">
            {sortedMovies.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => openFilm(movie.id)}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* 序号 */}
                  <div className="text-2xl text-gray-600 w-8 text-center flex-shrink-0">
                    {index + 1}
                  </div>

                  {/* 海报 */}
                  <div className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-lg mb-1">{movie.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{movie.originalTitle}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{movie.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{movie.duration}分钟</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        <span>{movie.torrentsCount} 个种子</span>
                      </div>
                      <span>{movie.director}</span>
                    </div>
                  </div>

                  {/* 类型标签 */}
                  <div className="flex gap-2 flex-shrink-0">
                    {movie.genre.slice(0, 2).map((g, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* 评分 */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span className="text-white text-xl">{movie.rating}</span>
                  </div>

                  {/* 操作按钮 */}
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white transition-all flex items-center gap-2 flex-shrink-0">
                    <Play className="w-4 h-4" />
                    <span>查看</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 原弹窗详情已移除，统一走路由跳转到 /film/:id */}
    </div>
  );
}
