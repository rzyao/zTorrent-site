import { useState } from 'react';
import {
  Music,
  Play,
  Heart,
  MoreVertical,
  Search,
  TrendingUp,
  Clock,
  User,
  Disc,
  ListMusic,
  Grid,
  List,
  Flame,
  Star,
  Headphones,
  Sparkles,
} from 'lucide-react';

type TabType = 'hall' | 'songs' | 'artists' | 'albums' | 'playlists';
type ViewMode = 'grid' | 'list';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  plays: number;
}

interface Artist {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  songs: number;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  year: number;
  tracks: number;
}

interface Playlist {
  id: string;
  title: string;
  cover: string;
  tracks: number;
  creator: string;
}

export function MusicPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hall');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // 示例数据
  const featuredSongs: Song[] = [
    {
      id: '1',
      title: '夏日回忆',
      artist: '风声乐队',
      album: '青春纪念册',
      duration: '4:05',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      plays: 15420,
    },
    {
      id: '2',
      title: '星空物语',
      artist: '月光组合',
      album: '梦想的声音',
      duration: '3:18',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
      plays: 8732,
    },
    {
      id: '3',
      title: '城市之光',
      artist: 'Urban Sound',
      album: 'Metropolitan',
      duration: '3:43',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      plays: 23145,
    },
    {
      id: '4',
      title: '远方的梦',
      artist: '流浪诗人',
      album: '旅途',
      duration: '4:27',
      cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400',
      plays: 12098,
    },
  ];

  const artists: Artist[] = [
    {
      id: '1',
      name: '风声乐队',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
      followers: 128000,
      songs: 42,
    },
    {
      id: '2',
      name: '月光组合',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      followers: 95000,
      songs: 38,
    },
    {
      id: '3',
      name: 'Urban Sound',
      avatar: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      followers: 210000,
      songs: 56,
    },
    {
      id: '4',
      name: '流浪诗人',
      avatar: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300',
      followers: 76000,
      songs: 29,
    },
  ];

  const albums: Album[] = [
    {
      id: '1',
      title: '青春纪念册',
      artist: '风声乐队',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      year: 2024,
      tracks: 12,
    },
    {
      id: '2',
      title: '梦想的声音',
      artist: '月光组合',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
      year: 2023,
      tracks: 10,
    },
    {
      id: '3',
      title: 'Metropolitan',
      artist: 'Urban Sound',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      year: 2024,
      tracks: 14,
    },
    {
      id: '4',
      title: '旅途',
      artist: '流浪诗人',
      cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400',
      year: 2023,
      tracks: 11,
    },
  ];

  const playlists: Playlist[] = [
    {
      id: '1',
      title: '热门新歌',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      tracks: 50,
      creator: '官方推荐',
    },
    {
      id: '2',
      title: '经典回忆',
      cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
      tracks: 100,
      creator: '时光机',
    },
    {
      id: '3',
      title: '电子律动',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      tracks: 75,
      creator: 'DJ Mix',
    },
    {
      id: '4',
      title: '民谣情怀',
      cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400',
      tracks: 60,
      creator: '音乐达人',
    },
  ];

  const tabs = [
    { id: 'hall', label: '音乐大厅', icon: Sparkles },
    { id: 'songs', label: '单曲', icon: Music },
    { id: 'artists', label: '歌手', icon: User },
    { id: 'albums', label: '专辑', icon: Disc },
    { id: 'playlists', label: '歌单', icon: ListMusic },
  ];

  const renderHall = () => (
    <div className="space-y-8">
      {/* 热门推荐 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-white text-xl">热门推荐</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredSongs.slice(0, 4).map((song) => (
            <div
              key={song.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-amber-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center transition-all">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-white truncate">{song.title}</h3>
              <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
              <div className="flex items-center gap-2 mt-2 text-neutral-500 text-xs">
                <Headphones className="w-3 h-3" />
                <span>{song.plays.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 精选歌单 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-400" />
          <h2 className="text-white text-xl">精选歌单</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-purple-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img
                  src={playlist.cover}
                  alt={playlist.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center transition-all">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-white truncate">{playlist.title}</h3>
              <p className="text-neutral-400 text-sm truncate">{playlist.creator}</p>
              <div className="flex items-center gap-2 mt-2 text-neutral-500 text-xs">
                <Music className="w-3 h-3" />
                <span>{playlist.tracks} 首歌曲</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 热门歌手 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h2 className="text-white text-xl">热门歌手</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-green-500/50 transition-all text-center cursor-pointer"
            >
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
              />
              <h3 className="text-white truncate">{artist.name}</h3>
              <p className="text-neutral-400 text-sm">
                {artist.followers.toLocaleString()} 粉丝
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 最新专辑 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          <h2 className="text-white text-xl">最新专辑</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-blue-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-white truncate">{album.title}</h3>
              <p className="text-neutral-400 text-sm truncate">{album.artist}</p>
              <div className="flex items-center justify-between mt-2 text-neutral-500 text-xs">
                <span>{album.year}</span>
                <span>{album.tracks} 首</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderSongs = () => (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredSongs.map((song) => (
            <div
              key={song.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-amber-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center transition-all">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-white truncate">{song.title}</h3>
              <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-neutral-500 text-xs">{song.duration}</span>
                <button className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 transition-all">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
          {featuredSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
            >
              <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
              <img
                src={song.cover}
                alt={song.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{song.title}</p>
                <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
              </div>
              <span className="text-neutral-500 text-sm">{song.album}</span>
              <span className="text-neutral-500 text-sm">{song.duration}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-neutral-400 hover:text-amber-400 transition-all">
                  <Play className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-neutral-400 hover:text-red-400 transition-all">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-neutral-400 hover:text-white transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderArtists = () => (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-6 hover:border-green-500/50 transition-all text-center cursor-pointer"
            >
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-white truncate mb-1">{artist.name}</h3>
              <p className="text-neutral-400 text-sm mb-2">
                {artist.followers.toLocaleString()} 粉丝
              </p>
              <p className="text-neutral-500 text-xs">{artist.songs} 首歌曲</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
            >
              <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-white">{artist.name}</p>
                <p className="text-neutral-400 text-sm">{artist.songs} 首歌曲</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-400 text-sm">粉丝</p>
                <p className="text-white">{artist.followers.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAlbums = () => (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-blue-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-white truncate">{album.title}</h3>
              <p className="text-neutral-400 text-sm truncate">{album.artist}</p>
              <div className="flex items-center justify-between mt-2 text-neutral-500 text-xs">
                <span>{album.year}</span>
                <span>{album.tracks} 首</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
          {albums.map((album, index) => (
            <div
              key={album.id}
              className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
            >
              <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
              <img
                src={album.cover}
                alt={album.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-white">{album.title}</p>
                <p className="text-neutral-400 text-sm">{album.artist}</p>
              </div>
              <div className="flex items-center gap-8 text-neutral-400 text-sm">
                <span>{album.year}</span>
                <span>{album.tracks} 首</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlaylists = () => (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-purple-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img
                  src={playlist.cover}
                  alt={playlist.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center transition-all">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-white truncate">{playlist.title}</h3>
              <p className="text-neutral-400 text-sm truncate">{playlist.creator}</p>
              <p className="text-neutral-500 text-xs mt-2">{playlist.tracks} 首歌曲</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
          {playlists.map((playlist, index) => (
            <div
              key={playlist.id}
              className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
            >
              <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
              <img
                src={playlist.cover}
                alt={playlist.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-white">{playlist.title}</p>
                <p className="text-neutral-400 text-sm">{playlist.creator}</p>
              </div>
              <span className="text-neutral-400 text-sm">{playlist.tracks} 首歌曲</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'hall':
        return renderHall();
      case 'songs':
        return renderSongs();
      case 'artists':
        return renderArtists();
      case 'albums':
        return renderAlbums();
      case 'playlists':
        return renderPlaylists();
      default:
        return renderHall();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl">音乐</h1>
                <p className="text-neutral-400 text-sm mt-1">
                  发现你喜欢的音乐，探索无限可能
                </p>
              </div>
            </div>

            {/* 搜索框 */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索音乐、歌手、专辑..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-all"
              />
            </div>
          </div>

          {/* Tab导航 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-neutral-800/40 rounded-xl p-1 border border-neutral-700/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 视图切换 */}
            {activeTab !== 'hall' && (
              <div className="flex items-center gap-2 bg-neutral-800/40 rounded-lg p-1 border border-neutral-700/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="网格视图"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="列表视图"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        {renderContent()}
      </div>
    </div>
  );
}
