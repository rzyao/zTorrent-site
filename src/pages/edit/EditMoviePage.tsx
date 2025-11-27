import { useState } from 'react';
import {
  Film,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Image as ImageIcon,
  Star,
  Calendar,
  Clock,
  Award,
  Users,
  Video,
  FileText,
  Link,
  Download,
  Upload as UploadIcon,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Torrent {
  id: string;
  version: string; // 例如: "4K HDR REMUX", "1080p BluRay"
  size: string;
  quality: string;
  source: string; // BluRay, WEB-DL, HDTV
  codec: string; // H.264, H.265, AV1
  audio: string; // DTS-HD MA, Dolby Atmos
  seeders: number;
  leechers: number;
  uploadDate: string;
  isFree?: boolean;
  isVip?: boolean;
}

interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  backdrop: string;
  category: string; // 电影, 剧集, 纪录片, 动漫
  genres: string[]; // 科幻, 动作, 剧情
  rating: number;
  duration: string; // 169分钟 或 8集
  director: string;
  cast: string[];
  description: string;
  torrents: Torrent[];
  createdAt: string;
  updatedAt: string;
}

export function EditMoviePage() {
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: '1',
      title: '星际穿越',
      originalTitle: 'Interstellar',
      year: '2014',
      poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=400',
      backdrop: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=1920',
      category: '电影',
      genres: ['科幻', '剧情', '冒险'],
      rating: 9.8,
      duration: '169分钟',
      director: '克里斯托弗·诺兰',
      cast: ['马修·麦康纳', '安妮·海瑟薇', '杰西卡·查斯坦'],
      description: '在地球即将毁灭之际，前宇航员库珀必须离开家人，带领一支探险队穿越虫洞，寻找人类的新家园。',
      torrents: [
        {
          id: 't1',
          version: '4K HDR REMUX 国英双语',
          size: '68.5 GB',
          quality: '2160p',
          source: 'BluRay',
          codec: 'H.265',
          audio: 'Dolby Atmos',
          seeders: 2847,
          leechers: 156,
          uploadDate: '2024-11-10',
          isFree: true,
        },
        {
          id: 't2',
          version: '1080p BluRay 国语',
          size: '18.2 GB',
          quality: '1080p',
          source: 'BluRay',
          codec: 'H.264',
          audio: 'DTS-HD MA',
          seeders: 1234,
          leechers: 89,
          uploadDate: '2024-10-15',
        },
        {
          id: 't3',
          version: '720p WEB-DL',
          size: '4.5 GB',
          quality: '720p',
          source: 'WEB-DL',
          codec: 'H.264',
          audio: 'AAC',
          seeders: 567,
          leechers: 34,
          uploadDate: '2024-09-20',
        },
      ],
      createdAt: '2024-09-15',
      updatedAt: '2024-11-10',
    },
    {
      id: '2',
      title: '盗梦空间',
      originalTitle: 'Inception',
      year: '2010',
      poster: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=400',
      backdrop: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=1920',
      category: '电影',
      genres: ['科幻', '动作', '悬疑'],
      rating: 9.6,
      duration: '148分钟',
      director: '克里斯托弗·诺兰',
      cast: ['莱昂纳多·迪卡普里奥', '玛丽昂·歌迪亚', '汤姆·哈迪'],
      description: '一个专业的盗梦者进入他人梦境盗取机密，这次他要完成一个看似不可能的任务：在梦中植入想法。',
      torrents: [
        {
          id: 't4',
          version: '4K UHD BluRay',
          size: '76.3 GB',
          quality: '2160p',
          source: 'BluRay',
          codec: 'H.265',
          audio: 'DTS-HD MA',
          seeders: 1892,
          leechers: 345,
          uploadDate: '2024-11-05',
        },
      ],
      createdAt: '2024-10-01',
      updatedAt: '2024-11-05',
    },
    {
      id: '3',
      title: '权力的游戏',
      originalTitle: 'Game of Thrones',
      year: '2011-2019',
      poster: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400',
      backdrop: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920',
      category: '剧集',
      genres: ['奇幻', '剧情', '冒险'],
      rating: 9.5,
      duration: '全8季73集',
      director: 'David Benioff / D.B. Weiss',
      cast: ['艾米莉亚·克拉克', '基特·哈灵顿', '彼特·丁拉基'],
      description: '七个王国为了争夺铁王座而展开的权力斗争，同时北方的异鬼威胁正在逼近。',
      torrents: [
        {
          id: 't5',
          version: '全八季 1080p BluRay 内封中字',
          size: '124.8 GB',
          quality: '1080p',
          source: 'BluRay',
          codec: 'H.264',
          audio: 'DTS-HD MA',
          seeders: 2156,
          leechers: 89,
          uploadDate: '2024-10-20',
          isFree: true,
        },
      ],
      createdAt: '2024-09-10',
      updatedAt: '2024-10-20',
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTorrentForm, setShowTorrentForm] = useState(false);

  // 影片编辑表单状态
  const [movieForm, setMovieForm] = useState({
    title: '',
    originalTitle: '',
    year: '',
    poster: '',
    backdrop: '',
    category: '电影',
    genres: [] as string[],
    rating: 0,
    duration: '',
    director: '',
    cast: [] as string[],
    description: '',
  });

  // 种子编辑表单状态
  const [torrentForm, setTorrentForm] = useState({
    version: '',
    size: '',
    quality: '1080p',
    source: 'BluRay',
    codec: 'H.264',
    audio: 'DTS-HD MA',
    isFree: false,
    isVip: false,
  });

  const handleCreateNew = () => {
    setMovieForm({
      title: '',
      originalTitle: '',
      year: '',
      poster: '',
      backdrop: '',
      category: '电影',
      genres: [],
      rating: 0,
      duration: '',
      director: '',
      cast: [],
      description: '',
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedMovie(null);
  };

  const handleEdit = (movie: Movie) => {
    setMovieForm({
      title: movie.title,
      originalTitle: movie.originalTitle,
      year: movie.year,
      poster: movie.poster,
      backdrop: movie.backdrop,
      category: movie.category,
      genres: movie.genres,
      rating: movie.rating,
      duration: movie.duration,
      director: movie.director,
      cast: movie.cast,
      description: movie.description,
    });
    setSelectedMovie(movie);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSaveMovie = () => {
    if (isCreating) {
      const newMovie: Movie = {
        id: Date.now().toString(),
        ...movieForm,
        torrents: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setMovies([newMovie, ...movies]);
      setSelectedMovie(newMovie);
      setIsCreating(false);
    } else if (selectedMovie) {
      setMovies(
        movies.map((m) =>
          m.id === selectedMovie.id
            ? {
              ...m,
              ...movieForm,
              updatedAt: new Date().toISOString().split('T')[0],
            }
            : m
        )
      );
      setSelectedMovie({
        ...selectedMovie,
        ...movieForm,
      });
      setIsEditing(false);
    }
  };

  const handleDeleteMovie = (id: string) => {
    if (confirm('确定要删除这部影片吗？所有关联的种子也会被删除。')) {
      setMovies(movies.filter((m) => m.id !== id));
      if (selectedMovie?.id === id) {
        setSelectedMovie(null);
      }
    }
  };

  const handleAddTorrent = () => {
    if (selectedMovie) {
      const newTorrent: Torrent = {
        id: 't' + Date.now(),
        ...torrentForm,
        seeders: 0,
        leechers: 0,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      const updatedMovie = {
        ...selectedMovie,
        torrents: [...selectedMovie.torrents, newTorrent],
      };
      setSelectedMovie(updatedMovie);
      setMovies(movies.map((m) => (m.id === selectedMovie.id ? updatedMovie : m)));
      setShowTorrentForm(false);
      setTorrentForm({
        version: '',
        size: '',
        quality: '1080p',
        source: 'BluRay',
        codec: 'H.264',
        audio: 'DTS-HD MA',
        isFree: false,
        isVip: false,
      });
    }
  };

  const handleRemoveTorrent = (torrentId: string) => {
    if (selectedMovie) {
      const updatedMovie = {
        ...selectedMovie,
        torrents: selectedMovie.torrents.filter((t) => t.id !== torrentId),
      };
      setSelectedMovie(updatedMovie);
      setMovies(movies.map((m) => (m.id === selectedMovie.id ? updatedMovie : m)));
    }
  };

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
      {/* 页面标题 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className='flex items-end gap-1'>
              <h1 className="text-white text-3xl">影片编辑</h1>
              <p className="text-neutral-400 text-sm mt-1">
                管理影片信息和关联的种子版本
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加影片
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧影片列表 */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden">
            <div className="p-4 border-b border-neutral-700/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索影片..."
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="p-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">暂无影片</p>
                </div>
              ) : (
                filteredMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setIsEditing(false);
                      setIsCreating(false);
                      setShowTorrentForm(false);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${selectedMovie?.id === movie.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30'
                      : 'bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600'
                      }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-16 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm mb-1 truncate">
                          {movie.title}
                        </h3>
                        <p className="text-neutral-400 text-xs mb-2 truncate">
                          {movie.originalTitle}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                            {movie.category}
                          </Badge>
                          <span className="text-neutral-500 text-xs">{movie.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 text-xs flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {movie.rating}
                          </span>
                          <span className="text-neutral-500 text-xs">
                            {movie.torrents.length} 个版本
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
                <span className="text-neutral-400 text-sm">总影片数</span>
                <span className="text-white">{movies.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">电影</span>
                <span className="text-amber-400">
                  {movies.filter((m) => m.category === '电影').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">剧集</span>
                <span className="text-amber-400">
                  {movies.filter((m) => m.category === '剧集').length}
                </span>
              </div>
              <Separator className="bg-neutral-700/50" />
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">总种子数</span>
                <span className="text-green-400">
                  {movies.reduce((sum, m) => sum + m.torrents.length, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧详情/编辑区 */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 md:p-8">
            {/* 创建/编辑影片表单 */}
            {(isCreating || isEditing) && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Edit className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-white text-xl">
                      {isCreating ? '添加影片' : '编辑影片'}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 中文标题 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">中文标题</label>
                    <input
                      type="text"
                      value={movieForm.title}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, title: e.target.value })
                      }
                      placeholder="例如: 星际穿越"
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* 原始标题 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">原始标题</label>
                    <input
                      type="text"
                      value={movieForm.originalTitle}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, originalTitle: e.target.value })
                      }
                      placeholder="例如: Interstellar"
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* 年份 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">年份</label>
                    <input
                      type="text"
                      value={movieForm.year}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, year: e.target.value })
                      }
                      placeholder="例如: 2014"
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* 类别 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">类别</label>
                    <select
                      value={movieForm.category}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, category: e.target.value })
                      }
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="电影">电影</option>
                      <option value="剧集">剧集</option>
                      <option value="纪录片">纪录片</option>
                      <option value="动漫">动漫</option>
                      <option value="综艺">综艺</option>
                    </select>
                  </div>

                  {/* 评分 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">评分</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={movieForm.rating}
                      onChange={(e) =>
                        setMovieForm({
                          ...movieForm,
                          rating: parseFloat(e.target.value),
                        })
                      }
                      placeholder="例如: 9.8"
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* 时长 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">时长/集数</label>
                    <input
                      type="text"
                      value={movieForm.duration}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, duration: e.target.value })
                      }
                      placeholder="例如: 169分钟 或 全8季"
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* 导演 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">导演</label>
                  <input
                    type="text"
                    value={movieForm.director}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, director: e.target.value })
                    }
                    placeholder="例如: 克里斯托弗·诺兰"
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 演员 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">
                    主演（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={movieForm.cast.join(', ')}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        cast: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="例如: 马修·麦康纳, 安妮·海瑟薇"
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 类型标签 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">
                    类型标签（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={movieForm.genres.join(', ')}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        genres: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="例如: 科幻, 剧情, 冒险"
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 简介 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">简介</label>
                  <textarea
                    value={movieForm.description}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, description: e.target.value })
                    }
                    rows={4}
                    placeholder="输入影片简介..."
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                  />
                </div>

                {/* 海报 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">海报图片</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={movieForm.poster}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, poster: e.target.value })
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
                </div>

                {/* 背景图 */}
                <div className="space-y-2">
                  <label className="text-neutral-300 text-sm">背景图片</label>
                  <input
                    type="text"
                    value={movieForm.backdrop}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, backdrop: e.target.value })
                    }
                    placeholder="输入图片URL..."
                    className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveMovie}
                    disabled={!movieForm.title}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存影片
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

            {/* 影片详情展示 */}
            {!isCreating && !isEditing && selectedMovie && (
              <div className="space-y-6">
                {/* 影片头部 */}
                <div className="flex items-start gap-4">
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-32 h-48 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-white text-2xl mb-1">
                          {selectedMovie.title}
                        </h2>
                        <p className="text-neutral-400 text-sm mb-3">
                          {selectedMovie.originalTitle} ({selectedMovie.year})
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-amber-500/20 text-amber-400">
                            {selectedMovie.category}
                          </Badge>
                          {selectedMovie.genres.map((genre) => (
                            <Badge
                              key={genre}
                              className="bg-neutral-700/50 text-neutral-300"
                            >
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(selectedMovie)}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMovie(selectedMovie.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white">{selectedMovie.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Clock className="w-4 h-4" />
                        {selectedMovie.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Users className="w-4 h-4" />
                        {selectedMovie.director}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Video className="w-4 h-4" />
                        {selectedMovie.torrents.length} 个版本
                      </div>
                    </div>

                    <p className="text-neutral-400 text-sm">
                      {selectedMovie.description}
                    </p>
                  </div>
                </div>

                <Separator className="bg-neutral-700/50" />

                {/* 种子列表 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      种子版本
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => setShowTorrentForm(true)}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加种子
                    </Button>
                  </div>

                  {/* 添加种子表单 */}
                  {showTorrentForm && (
                    <div className="mb-6 p-6 rounded-xl bg-neutral-900/30 border border-amber-500/30 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white">添加新种子版本</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowTorrentForm(false)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-neutral-300 text-sm">版本描述</label>
                          <input
                            type="text"
                            value={torrentForm.version}
                            onChange={(e) =>
                              setTorrentForm({
                                ...torrentForm,
                                version: e.target.value,
                              })
                            }
                            placeholder="例如: 4K HDR REMUX 国英双语"
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 mt-2"
                          />
                        </div>

                        <div>
                          <label className="text-neutral-300 text-sm">文件大小</label>
                          <input
                            type="text"
                            value={torrentForm.size}
                            onChange={(e) =>
                              setTorrentForm({ ...torrentForm, size: e.target.value })
                            }
                            placeholder="例如: 68.5 GB"
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 mt-2"
                          />
                        </div>

                        <div>
                          <label className="text-neutral-300 text-sm">质量</label>
                          <select
                            value={torrentForm.quality}
                            onChange={(e) =>
                              setTorrentForm({
                                ...torrentForm,
                                quality: e.target.value,
                              })
                            }
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 mt-2"
                          >
                            <option value="2160p">2160p (4K)</option>
                            <option value="1080p">1080p</option>
                            <option value="720p">720p</option>
                            <option value="480p">480p</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-neutral-300 text-sm">来源</label>
                          <select
                            value={torrentForm.source}
                            onChange={(e) =>
                              setTorrentForm({
                                ...torrentForm,
                                source: e.target.value,
                              })
                            }
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 mt-2"
                          >
                            <option value="BluRay">BluRay</option>
                            <option value="WEB-DL">WEB-DL</option>
                            <option value="HDTV">HDTV</option>
                            <option value="REMUX">REMUX</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-neutral-300 text-sm">编码</label>
                          <select
                            value={torrentForm.codec}
                            onChange={(e) =>
                              setTorrentForm({ ...torrentForm, codec: e.target.value })
                            }
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 mt-2"
                          >
                            <option value="H.265">H.265 (HEVC)</option>
                            <option value="H.264">H.264 (AVC)</option>
                            <option value="AV1">AV1</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 text-sm text-neutral-300">
                          <input
                            type="checkbox"
                            checked={torrentForm.isFree}
                            onChange={(e) =>
                              setTorrentForm({
                                ...torrentForm,
                                isFree: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-900"
                          />
                          免费下载
                        </label>
                        <label className="flex items-center gap-2 text-sm text-neutral-300">
                          <input
                            type="checkbox"
                            checked={torrentForm.isVip}
                            onChange={(e) =>
                              setTorrentForm({
                                ...torrentForm,
                                isVip: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-900"
                          />
                          VIP专享
                        </label>
                      </div>

                      <Button
                        onClick={handleAddTorrent}
                        disabled={!torrentForm.version || !torrentForm.size}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        添加种子
                      </Button>
                    </div>
                  )}

                  {/* 种子列表 */}
                  {selectedMovie.torrents.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-neutral-700 rounded-xl">
                      <Video className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500 text-sm mb-3">
                        还没有添加种子版本
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setShowTorrentForm(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加第一个种子
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedMovie.torrents.map((torrent) => (
                        <div
                          key={torrent.id}
                          className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600 transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-white">{torrent.version}</h4>
                                {torrent.isFree && (
                                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                                    FREE
                                  </Badge>
                                )}
                                {torrent.isVip && (
                                  <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                                    VIP
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-neutral-400">
                                <div>
                                  <span className="text-neutral-500">大小:</span>{' '}
                                  {torrent.size}
                                </div>
                                <div>
                                  <span className="text-neutral-500">质量:</span>{' '}
                                  {torrent.quality}
                                </div>
                                <div>
                                  <span className="text-neutral-500">来源:</span>{' '}
                                  {torrent.source}
                                </div>
                                <div>
                                  <span className="text-neutral-500">编码:</span>{' '}
                                  {torrent.codec}
                                </div>
                                <div>
                                  <span className="text-neutral-500">音频:</span>{' '}
                                  {torrent.audio}
                                </div>
                                <div className="flex items-center gap-1">
                                  <UploadIcon className="w-3 h-3 text-green-400" />
                                  <span className="text-green-400">
                                    {torrent.seeders}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Download className="w-3 h-3 text-red-400" />
                                  <span className="text-red-400">
                                    {torrent.leechers}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-neutral-500">上传:</span>{' '}
                                  {torrent.uploadDate}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTorrent(torrent.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 空状态 */}
            {!isCreating && !isEditing && !selectedMovie && (
              <div className="text-center py-20">
                <Film className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">选择一部影片</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  从左侧列表选择影片进行编辑，或添加新影片
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加新影片
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
