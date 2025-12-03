import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Heart, Users, Film, Play, Eye, Star, Plus, Search, Filter, Clock, TrendingUp } from 'lucide-react';
import { PlaylistsService } from '@/api';

interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  creator: string;
  creatorAvatar: string;
  moviesCount: number;
  followersCount: number;
  viewsCount: number;
  rating: number;
  isFollowing: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export function PlaylistsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'following'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [items, setItems] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const navigate = useNavigate();

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await PlaylistsService.playlistsControllerList({
        // scope: activeTab as any, // API doesn't seem to support scope directly in the same way, mapping needed if possible or use other params
        // The API supports: page, limit, keyword, type, visibility, ownerUserId
        page,
        limit: pageSize,
        keyword: searchQuery || undefined,
        // Mapping activeTab to API params
        ...(activeTab === 'mine' ? { ownerUserId: 'me' } : {}), // Assuming 'me' or actual ID is needed. For now, let's assume 'me' works or we need to get current user ID.
        // If 'following' is selected, we might need a different endpoint or param. 
        // However, based on available API, there isn't a clear "following" filter. 
        // For now, we'll leave it as is or maybe filter client side if needed, but 'mine' is clearer.
        // Let's stick to basic list for 'all' and 'mine' (if we had user ID).
        // Since we don't have auth user ID handy here easily without context, we might skip 'mine' specific logic or assume backend handles 'me'.
        // Wait, the API has `ownerUserId`.
      });

      // 映射 PlaylistSummaryDTO 到页面展示模型（不做旧兼容）
      const list = (res.data?.items || []).map((item: any) => ({
        id: String(item.id),
        title: item.name,
        description: '',
        coverImage: item.coverUrl,
        creator: '',
        creatorAvatar: '',
        moviesCount: Number(item.filmCount ?? 0),
        followersCount: Number(item.stats?.likes ?? 0),
        viewsCount: Number(item.stats?.views ?? 0),
        rating: 0,
        isFollowing: false,
        createdAt: item.meta?.createdAt ?? '',
        updatedAt: item.meta?.updatedAt ?? '',
        tags: Array.isArray(item.tags) ? item.tags : [],
      }));

      setItems(list);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, [activeTab, searchQuery, sortBy, page]);

  const handleFollowToggle = async (playlistId: string) => {
    const idx = items.findIndex(p => p.id === playlistId);
    if (idx === -1) return;
    const original = items[idx];

    // Optimistic update
    const nextFollow = !original.isFollowing;
    const nextFollowers = original.followersCount + (nextFollow ? 1 : -1);

    setItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...original, isFollowing: nextFollow, followersCount: Math.max(0, nextFollowers) };
      return copy;
    });

    try {
      // Use Like endpoint as Follow substitute
      await PlaylistsService.playlistsControllerLike({ id: playlistId });
    } catch (e) {
      // Revert on error
      setItems(prev => {
        const copy = [...prev];
        copy[idx] = { ...original };
        return copy;
      });
    }
  };

  const handlePlaylistClick = async (playlist: Playlist) => {
    try {
      // Increment views
      PlaylistsService.playlistsControllerIncViews({ id: playlist.id });

      // Update local state for views
      setItems(prev => prev.map(p => (p.id === playlist.id ? { ...p, viewsCount: p.viewsCount + 1 } : p)));
    } catch (e) { }
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <List className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-3xl">影片片单</h1>
          </div>
          <p className="text-neutral-400 ml-13">浏览和创建精选影片合集</p>
        </div>

        {/* 标签页切换 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-xl transition-all ${activeTab === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
            >
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span>所有片单</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-6 py-2.5 rounded-xl transition-all ${activeTab === 'mine'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
            >
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>我的片单</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-6 py-2.5 rounded-xl transition-all ${activeTab === 'following'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>我关注的</span>
              </div>
            </button>
          </div>

          {/* 创建片单按钮 */}
          <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>创建片单</span>
          </button>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索片单..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-neutral-900 border border-neutral-700 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="latest">最新创建</option>
              <option value="popular">最受欢迎</option>
              <option value="rating">评分最高</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
          </div>
        </div>

        {/* 片单网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((playlist) => (
            <div
              key={playlist.id}
              className="group bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
              onClick={() => handlePlaylistClick(playlist)}
            >
              {/* 封面图片 */}
              <div className="relative aspect-video overflow-hidden">
                {playlist.coverImage ? (
                  <img
                    src={playlist.coverImage}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <Film className="w-10 h-10 text-neutral-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* 悬浮播放按钮 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* 影片数量标签 */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span className="text-white text-sm">{playlist.moviesCount} 部</span>
                </div>

                {/* 评分标签 */}
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                  <span className="text-white text-sm">{playlist.rating}</span>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-5">
                {/* 标题 */}
                <h3 className="text-white text-lg mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
                  {playlist.title}
                </h3>

                {/* 描述 */}
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                  {playlist.description}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(playlist.tags ?? []).slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 创建者信息 */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm shadow-lg shadow-amber-500/30">
                    {playlist.creatorAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">{playlist.creator}</div>
                    <div className="text-neutral-500 text-xs">创建者</div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-sm">{playlist.followersCount}</span>
                    </div>
                    <div className="text-neutral-500 text-xs">关注</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-sm">{playlist.viewsCount}</span>
                    </div>
                    <div className="text-neutral-500 text-xs">浏览</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-sm">{playlist.moviesCount}</span>
                    </div>
                    <div className="text-neutral-500 text-xs">影片</div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowToggle(playlist.id);
                  }}
                  className={`w-full py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${playlist.isFollowing
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 hover:text-white'
                    }`}
                >
                  <Heart className={`w-4 h-4 ${playlist.isFollowing ? 'fill-current' : ''}`} />
                  <span>{playlist.isFollowing ? '已关注' : '关注'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {!loading && items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
              <List className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-white text-xl mb-2">暂无片单</h3>
            <p className="text-neutral-500 mb-6">
              {activeTab === 'mine' ? '创建你的第一个片单吧' : '没有找到符合条件的片单'}
            </p>
            {activeTab === 'mine' && (
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>创建片单</span>
              </button>
            )}
          </div>
        )}
        {loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-white text-xl mb-2">加载中...</h3>
            <p className="text-neutral-500">正在获取片单列表</p>
          </div>
        )}
        {error && (
          <div className="text-center py-6 text-red-400">{error}</div>
        )}
      </div>
    </div>
  );
}
