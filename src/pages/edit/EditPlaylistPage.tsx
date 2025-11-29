import { useEffect, useState } from 'react';
import {
  ListVideo,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Image as ImageIcon,
  Lock,
  Globe,
  Users,
  GripVertical,
  Star,
  Calendar,
  Eye,
  Film,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useFilms } from '@/hooks/useFilms';

interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  category: string;
  rating: number;
  torrentCount: number; // 关联的种子数量
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  visibility: 'public' | 'private' | 'friends';
  movies: Movie[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

export function EditPlaylistPage() {
  const { listPlaylists, getPlaylist, createPlaylist, updatePlaylist, deletePlaylist, addFilm, removeFilm, reorderFilm } = usePlaylists();
  const { listFilms } = useFilms();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      title: '诺兰电影全集',
      description: '克里斯托弗·诺兰导演的经典作品合集，包含《星际穿越》、《盗梦空间》等杰作。',
      cover: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=400',
      visibility: 'public',
      movies: [
        {
          id: 'm1',
          title: '星际穿越',
          originalTitle: 'Interstellar',
          year: '2014',
          poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
          category: '科幻',
          rating: 9.8,
          torrentCount: 3,
        },
        {
          id: 'm2',
          title: '盗梦空间',
          originalTitle: 'Inception',
          year: '2010',
          poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
          category: '科幻',
          rating: 9.6,
          torrentCount: 1,
        },
        {
          id: 'm3',
          title: '蝙蝠侠：黑暗骑士',
          originalTitle: 'The Dark Knight',
          year: '2008',
          poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
          category: '动作',
          rating: 9.7,
          torrentCount: 2,
        },
      ],
      createdAt: '2024-11-15',
      updatedAt: '2024-11-22',
      views: 1248,
      likes: 89,
    },
    {
      id: '2',
      title: '经典科幻电影',
      description: '精选的科幻电影杰作，适合科幻爱好者收藏。',
      cover: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400',
      visibility: 'public',
      movies: [
        {
          id: 'm4',
          title: '黑客帝国',
          originalTitle: 'The Matrix',
          year: '1999',
          poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
          category: '科幻',
          rating: 9.4,
          torrentCount: 4,
        },
        {
          id: 'm5',
          title: '银翼杀手2049',
          originalTitle: 'Blade Runner 2049',
          year: '2017',
          poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
          category: '科幻',
          rating: 9.1,
          torrentCount: 2,
        },
      ],
      createdAt: '2024-11-18',
      updatedAt: '2024-11-20',
      views: 856,
      likes: 64,
    },
    {
      id: '3',
      title: '我的私人收藏',
      description: '个人珍藏的精品影片，仅自己可见。',
      cover: 'https://images.unsplash.com/photo-1613399421098-f943ea81f1c4?w=400',
      visibility: 'private',
      movies: [
        {
          id: 'm6',
          title: '教父',
          originalTitle: 'The Godfather',
          year: '1972',
          poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
          category: '剧情',
          rating: 9.9,
          torrentCount: 3,
        },
      ],
      createdAt: '2024-11-10',
      updatedAt: '2024-11-21',
      views: 23,
      likes: 0,
    },
  ]);

  // 可选的影片库（用于添加到片单）
  const availableMovies: Movie[] = [
    {
      id: 'am1',
      title: '肖申克的救赎',
      originalTitle: 'The Shawshank Redemption',
      year: '1994',
      poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
      category: '剧情',
      rating: 9.8,
      torrentCount: 2,
    },
    {
      id: 'am2',
      title: '辛德勒的名单',
      originalTitle: "Schindler's List",
      year: '1993',
      poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
      category: '剧情',
      rating: 9.8,
      torrentCount: 1,
    },
    {
      id: 'am3',
      title: '低俗小说',
      originalTitle: 'Pulp Fiction',
      year: '1994',
      poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=200',
      category: '剧情',
      rating: 9.5,
      torrentCount: 2,
    },
  ];

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [available, setAvailable] = useState<Movie[]>([]);

  // 编辑表单状态
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    cover: '',
    visibility: 'public' as 'public' | 'private' | 'friends',
  });

  const handleCreateNew = () => {
    setEditForm({
      title: '',
      description: '',
      cover: '',
      visibility: 'public',
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedPlaylist(null);
  };

  const handleEdit = (playlist: Playlist) => {
    setEditForm({
      title: playlist.title,
      description: playlist.description,
      cover: playlist.cover,
      visibility: playlist.visibility,
    });
    setSelectedPlaylist(playlist);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = async () => {
    const payload: any = {
      title: editForm.title,
      description: editForm.description,
      coverUrl: editForm.cover,
      visibility: editForm.visibility,
      type: 'general',
      enabled: true,
      sort: 0,
    };
    try {
      if (isCreating) {
        const res = await createPlaylist(payload);
        const newId = res?.id || res;
        const detail = await getPlaylist(String(newId));
        const mapped = mapBackendPlaylistToLocal(detail);
        setPlaylists([mapped, ...playlists]);
        setSelectedPlaylist(mapped);
        setIsCreating(false);
      } else if (selectedPlaylist) {
        await updatePlaylist(selectedPlaylist.id, payload);
        const detail = await getPlaylist(selectedPlaylist.id);
        const mapped = mapBackendPlaylistToLocal(detail);
        setPlaylists(playlists.map((p) => (p.id === mapped.id ? mapped : p)));
        setSelectedPlaylist(mapped);
        setIsEditing(false);
      }
    } catch (e: any) {
      alert(e?.message || '保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个片单吗？')) {
      try {
        await deletePlaylist(id);
        setPlaylists(playlists.filter((p) => p.id !== id));
        if (selectedPlaylist?.id === id) {
          setSelectedPlaylist(null);
        }
      } catch (e: any) {
        alert(e?.message || '删除失败');
      }
    }
  };

  const handleAddMovie = async (movie: Movie) => {
    if (selectedPlaylist) {
      try {
        await addFilm(selectedPlaylist.id, movie.id);
        const detail = await getPlaylist(selectedPlaylist.id);
        const mapped = mapBackendPlaylistToLocal(detail);
        setSelectedPlaylist(mapped);
        setPlaylists(playlists.map((p) => (p.id === mapped.id ? mapped : p)));
      } catch (e: any) {
        alert(e?.message || '添加影片失败');
      }
    }
  };

  const handleRemoveMovie = async (movieId: string) => {
    if (selectedPlaylist) {
      try {
        await removeFilm(selectedPlaylist.id, movieId);
        const detail = await getPlaylist(selectedPlaylist.id);
        const mapped = mapBackendPlaylistToLocal(detail);
        setSelectedPlaylist(mapped);
        setPlaylists(playlists.map((p) => (p.id === mapped.id ? mapped : p)));
      } catch (e: any) {
        alert(e?.message || '移除影片失败');
      }
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'friends':
        return <Users className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return '公开';
      case 'private':
        return '私密';
      case 'friends':
        return '好友可见';
      default:
        return '公开';
    }
  };

  const filteredPlaylists = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      try {
        const list = await listPlaylists({ page: 1, limit: 50, keyword: searchQuery });
        const mapped = (list?.items ?? []).map(mapBackendPlaylistToLocal);
        setPlaylists(mapped);
      } catch {}
      try {
        const films = await listFilms({ page: 1, limit: 50, keyword: '' });
        const availableMapped = (films?.items ?? []).map((f: any) => ({
          id: String(f?.id ?? ''),
          title: f?.title ?? '',
          originalTitle: f?.originalTitle ?? '',
          year: String(f?.year ?? ''),
          poster: f?.posterUrl ?? f?.coverUrl ?? '',
          category: f?.category ?? '',
          rating: Number(f?.rating ?? 0),
          torrentCount: Number(f?.torrentCount ?? 0),
        }));
        setAvailable(availableMapped);
      } catch {}
    })();
  }, [searchQuery]);

  function mapBackendPlaylistToLocal(detail: any): Playlist {
    const movies = Array.isArray(detail?.movies) ? detail.movies.map((f: any) => ({
      id: String(f?.id ?? ''),
      title: f?.title ?? '',
      originalTitle: f?.originalTitle ?? '',
      year: String(f?.year ?? ''),
      poster: f?.posterUrl ?? f?.coverUrl ?? '',
      category: f?.category ?? '',
      rating: Number(f?.rating ?? 0),
      torrentCount: Number(f?.torrentCount ?? 0),
    })) : [];
    return {
      id: String(detail?.id ?? ''),
      title: detail?.title ?? '',
      description: detail?.description ?? '',
      cover: detail?.coverUrl ?? '',
      visibility: detail?.visibility ?? 'public',
      movies,
      createdAt: String(detail?.createdAt ?? ''),
      updatedAt: String(detail?.updatedAt ?? ''),
      views: Number(detail?.views ?? 0),
      likes: Number(detail?.likes ?? 0),
    };
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
      {/* 页面标题 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <ListVideo className="w-5 h-5 text-white" />
            </div>
            <div className='flex items-end gap-1'>
              <h1 className="text-white text-3xl">片单编辑</h1>
              <p className="text-neutral-400 text-sm mt-1">
                创建和管理您的影片收藏片单
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            创建片单
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧片单列表 */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden">
            <div className="p-4 border-b border-neutral-700/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索片单..."
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="p-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredPlaylists.length === 0 ? (
                <div className="text-center py-12">
                  <ListVideo className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">暂无片单</p>
                </div>
              ) : (
                filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => {
                      setSelectedPlaylist(playlist);
                      setIsEditing(false);
                      setIsCreating(false);
                      setShowAddMovie(false);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${selectedPlaylist?.id === playlist.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30'
                      : 'bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600'
                      }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={playlist.cover}
                        alt={playlist.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm mb-1 truncate">
                          {playlist.title}
                        </h3>
                        <p className="text-neutral-400 text-xs line-clamp-2 mb-2">
                          {playlist.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${playlist.visibility === 'public'
                              ? 'bg-green-500/20 text-green-400'
                              : playlist.visibility === 'private'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                              }`}
                          >
                            {getVisibilityIcon(playlist.visibility)}
                            <span className="ml-1">
                              {getVisibilityText(playlist.visibility)}
                            </span>
                          </Badge>
                          <span className="text-neutral-500 text-xs">
                            {playlist.movies.length} 部影片
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-6 bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
            <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-4">
              统计信息
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">总片单数</span>
                <span className="text-white">{playlists.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">公开片单</span>
                <span className="text-green-400">
                  {playlists.filter((p) => p.visibility === 'public').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">私密片单</span>
                <span className="text-red-400">
                  {playlists.filter((p) => p.visibility === 'private').length}
                </span>
              </div>
              <Separator className="bg-neutral-700/50" />
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">总观看次数</span>
                <span className="text-amber-400">
                  {playlists.reduce((sum, p) => sum + p.views, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">总点赞数</span>
                <span className="text-amber-400">
                  {playlists.reduce((sum, p) => sum + p.likes, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧详情/编辑区 */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 md:p-8">
            {/* 创建/编辑表单 */}
            {(isCreating || isEditing) && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Edit className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-white text-xl">
                      {isCreating ? '创建片单' : '编辑片单'}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* 片单标题 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">片单标题</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    placeholder="输入片单标题..."
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 片单描述 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">片单描述</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={4}
                    placeholder="描述一下这个片单..."
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                  />
                </div>

                {/* 封面图片 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">封面图片</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={editForm.cover}
                      onChange={(e) =>
                        setEditForm({ ...editForm, cover: e.target.value })
                      }
                      placeholder="输入图片URL..."
                      className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Button
                      variant="outline"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      上传
                    </Button>
                  </div>
                  {editForm.cover && (
                    <img
                      src={editForm.cover}
                      alt="预览"
                      className="w-full h-48 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>

                {/* 可见性 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">可见性</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() =>
                        setEditForm({ ...editForm, visibility: 'public' })
                      }
                      className={`p-4 rounded-xl border transition-all ${editForm.visibility === 'public'
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                        }`}
                    >
                      <Globe className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-sm">公开</p>
                    </button>
                    <button
                      onClick={() =>
                        setEditForm({ ...editForm, visibility: 'friends' })
                      }
                      className={`p-4 rounded-xl border transition-all ${editForm.visibility === 'friends'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                        }`}
                    >
                      <Users className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-sm">好友可见</p>
                    </button>
                    <button
                      onClick={() =>
                        setEditForm({ ...editForm, visibility: 'private' })
                      }
                      className={`p-4 rounded-xl border transition-all ${editForm.visibility === 'private'
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                        }`}
                    >
                      <Lock className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-sm">私密</p>
                    </button>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={!editForm.title}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存片单
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-700/30"
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* 片单详情展示 */}
            {!isCreating && !isEditing && selectedPlaylist && (
              <div className="space-y-6">
                {/* 片单头部 */}
                <div className="flex items-start gap-4">
                  <img
                    src={selectedPlaylist.cover}
                    alt={selectedPlaylist.title}
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-white text-2xl mb-2">
                          {selectedPlaylist.title}
                        </h2>
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            className={`${selectedPlaylist.visibility === 'public'
                              ? 'bg-green-500/20 text-green-400'
                              : selectedPlaylist.visibility === 'private'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                              }`}
                          >
                            {getVisibilityIcon(selectedPlaylist.visibility)}
                            <span className="ml-1">
                              {getVisibilityText(selectedPlaylist.visibility)}
                            </span>
                          </Badge>
                          <span className="text-neutral-400 text-sm flex items-center gap-1">
                            <Film className="w-4 h-4" />
                            {selectedPlaylist.movies.length} 部影片
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(selectedPlaylist)}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(selectedPlaylist.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-neutral-400 text-sm mb-3">
                      {selectedPlaylist.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        创建于 {selectedPlaylist.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {selectedPlaylist.views} 次观看
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {selectedPlaylist.likes} 个点赞
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-neutral-700/50" />

                {/* 影片列表 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white">片单影片</h3>
                    <Button
                      size="sm"
                      onClick={() => setShowAddMovie(!showAddMovie)}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加影片
                    </Button>
                  </div>

                  {/* 添加影片面板 */}
                  {showAddMovie && (
                    <div className="mb-6 p-6 rounded-xl bg-neutral-900/30 border border-amber-500/30">
                      <h4 className="text-white mb-4">从影片库选择</h4>
                      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                        {availableMovies.map((movie) => (
                          <div
                            key={movie.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50 hover:border-amber-500/30 transition-all"
                          >
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-12 h-16 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-white text-sm truncate">
                                {movie.title}
                              </h5>
                              <p className="text-neutral-400 text-xs truncate">
                                {movie.originalTitle} ({movie.year})
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-amber-400 text-xs flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  {movie.rating}
                                </span>
                                <span className="text-neutral-500 text-xs">
                                  {movie.torrentCount} 个版本
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddMovie(movie)}
                              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                            >
                              添加
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPlaylist.movies.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-neutral-700 rounded-xl">
                      <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500 text-sm mb-3">
                        片单中还没有影片
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setShowAddMovie(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加第一部影片
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedPlaylist.movies.map((movie, index) => (
                        <div
                          key={movie.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600 transition-all group"
                        >
                          <div className="cursor-move text-neutral-600 group-hover:text-neutral-400">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <span className="text-neutral-500 text-sm w-6">
                            {index + 1}
                          </span>
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-12 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm mb-1 truncate">
                              {movie.title}
                            </h4>
                            <p className="text-neutral-400 text-xs mb-2 truncate">
                              {movie.originalTitle}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                              <Badge className="bg-neutral-800 text-neutral-300">
                                {movie.category}
                              </Badge>
                              <span>{movie.year}</span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                {movie.rating}
                              </span>
                              <span>{movie.torrentCount} 个版本</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveMovie(movie.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 空状态 */}
            {!isCreating && !isEditing && !selectedPlaylist && (
              <div className="text-center py-20">
                <ListVideo className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">选择一个片单</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  从左侧列表选择片单进行编辑，或创建新的片单
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  创建新片单
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
