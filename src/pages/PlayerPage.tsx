import { useState, useRef, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ListMusic,
  Heart,
  Download,
  Share2,
  Disc,
  Plus,
  X,
  MoreVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  FolderHeart,
  Library,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  audioUrl: string;
  liked: boolean;
  plays: number;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  year: number;
  tracks: Song[];
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  songs: Song[];
  isOwn: boolean;
  creator: string;
}

type PlayMode = 'sequence' | 'shuffle' | 'repeat';
type LibraryView = 'liked' | 'albums' | 'playlists' | 'playlist-detail';
type DetailTab = 'lyrics' | 'comments' | 'similar';

export function PlayerPage() {
  const [songs] = useState<Song[]>([
    {
      id: '1',
      title: '夏日回忆',
      artist: '风声乐队',
      album: '青春纪念册',
      duration: 245,
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      audioUrl: '',
      liked: true,
      plays: 15420,
    },
    {
      id: '2',
      title: '星空物语',
      artist: '月光组合',
      album: '梦想的声音',
      duration: 198,
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
      audioUrl: '',
      liked: false,
      plays: 8732,
    },
    {
      id: '3',
      title: '城市之光',
      artist: 'Urban Sound',
      album: 'Metropolitan',
      duration: 223,
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      audioUrl: '',
      liked: true,
      plays: 23145,
    },
    {
      id: '4',
      title: '远方的梦',
      artist: '流浪诗人',
      album: '旅途',
      duration: 267,
      cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400',
      audioUrl: '',
      liked: false,
      plays: 12098,
    },
    {
      id: '5',
      title: '午夜电台',
      artist: 'Radio Band',
      album: 'Night Sessions',
      duration: 189,
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      audioUrl: '',
      liked: true,
      plays: 19654,
    },
    {
      id: '6',
      title: '海边漫步',
      artist: '海风',
      album: '蓝色时光',
      duration: 234,
      cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
      audioUrl: '',
      liked: false,
      plays: 7821,
    },
  ]);

  const [myAlbums] = useState<Album[]>([
    {
      id: '1',
      title: '青春纪念册',
      artist: '风声乐队',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      year: 2024,
      tracks: [songs[0]],
    },
    {
      id: '2',
      title: '梦想的声音',
      artist: '月光组合',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
      year: 2023,
      tracks: [songs[1]],
    },
  ]);

  const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      title: '夏日精选',
      description: '适合夏天听的歌曲',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      songs: [songs[0], songs[2]],
      isOwn: true,
      creator: '我',
    },
    {
      id: '2',
      title: '夜深人静',
      description: '深夜放松音乐',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      songs: [songs[4]],
      isOwn: true,
      creator: '我',
    },
    {
      id: '3',
      title: '流行热歌',
      description: '收藏的热门歌单',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      songs: [songs[2], songs[3]],
      isOwn: false,
      creator: '官方推荐',
    },
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('sequence');
  const [likedSongs, setLikedSongs] = useState(songs.filter((s) => s.liked).map((s) => s.id));
  const [libraryView, setLibraryView] = useState<LibraryView>('liked');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [selectedSongForAdd, setSelectedSongForAdd] = useState<Song | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [showPlayerDetail, setShowPlayerDetail] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>('lyrics');

  const progressRef = useRef<HTMLDivElement>(null);

  const currentSong = songs[currentSongIndex];

  // 模拟音频播放进度
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (playMode === 'shuffle') {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
    } else if (playMode === 'repeat') {
      setCurrentTime(0);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
      setCurrentTime(0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      setCurrentTime(percentage * currentSong.duration);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const cyclePlayMode = () => {
    const modes: PlayMode[] = ['sequence', 'shuffle', 'repeat'];
    const currentIndex = modes.indexOf(playMode);
    setPlayMode(modes[(currentIndex + 1) % modes.length]);
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'shuffle':
        return <Shuffle className="w-5 h-5" />;
      case 'repeat':
        return <Repeat className="w-5 h-5" />;
      default:
        return <ListMusic className="w-5 h-5" />;
    }
  };

  const getPlayModeText = () => {
    switch (playMode) {
      case 'shuffle':
        return '随机播放';
      case 'repeat':
        return '单曲循环';
      default:
        return '顺序播放';
    }
  };

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const toggleLike = (songId: string) => {
    setLikedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title: newPlaylistName,
      description: newPlaylistDesc,
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      songs: [],
      isOwn: true,
      creator: '我',
    };

    setMyPlaylists((prev) => [...prev, newPlaylist]);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setShowCreatePlaylist(false);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    if (!selectedSongForAdd) return;

    setMyPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId && playlist.isOwn) {
          if (!playlist.songs.find((s) => s.id === selectedSongForAdd.id)) {
            return {
              ...playlist,
              songs: [...playlist.songs, selectedSongForAdd],
            };
          }
        }
        return playlist;
      })
    );

    setShowAddToPlaylist(false);
    setSelectedSongForAdd(null);
  };

  const handleRemoveFromPlaylist = (playlistId: string, songId: string) => {
    setMyPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId && playlist.isOwn) {
          return {
            ...playlist,
            songs: playlist.songs.filter((s) => s.id !== songId),
          };
        }
        return playlist;
      })
    );
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setMyPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (selectedPlaylistId === playlistId) {
      setLibraryView('playlists');
      setSelectedPlaylistId(null);
    }
  };

  const openAddToPlaylist = (song: Song) => {
    setSelectedSongForAdd(song);
    setShowAddToPlaylist(true);
  };

  const likedSongsList = songs.filter((s) => likedSongs.includes(s.id));

  const renderLibraryContent = () => {
    if (libraryView === 'liked') {
      return (
        <div className="space-y-4">
          <h2 className="text-white text-xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400 fill-current" />
            我喜欢的音乐
            <span className="text-neutral-500 text-sm">({likedSongsList.length})</span>
          </h2>
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
            {likedSongsList.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>还没有喜欢的歌曲</p>
              </div>
            ) : (
              likedSongsList.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 p-4 hover:bg-neutral-800/50 transition-all border-b border-neutral-700/30 last:border-0"
                >
                  <button
                    onClick={() => handleSongSelect(songs.findIndex((s) => s.id === song.id))}
                    className="relative flex-shrink-0 group"
                  >
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{song.title}</p>
                    <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
                  </div>
                  <span className="text-neutral-500 text-sm">{formatTime(song.duration)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleLike(song.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => openAddToPlaylist(song)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    if (libraryView === 'albums') {
      return (
        <div className="space-y-4">
          <h2 className="text-white text-xl flex items-center gap-2">
            <Disc className="w-5 h-5 text-blue-400" />
            我的收藏
            <span className="text-neutral-500 text-sm">({myAlbums.length})</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {myAlbums.map((album) => (
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
                  <span>{album.tracks.length} 首</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (libraryView === 'playlists') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-purple-400" />
              我的歌单
              <span className="text-neutral-500 text-sm">({myPlaylists.length})</span>
            </h2>
            <button
              onClick={() => setShowCreatePlaylist(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white flex items-center gap-2 transition-all shadow-lg shadow-amber-500/30"
            >
              <Plus className="w-4 h-4" />
              新建歌单
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {myPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => {
                  setSelectedPlaylistId(playlist.id);
                  setLibraryView('playlist-detail');
                }}
                className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-purple-500/50 transition-all group cursor-pointer relative"
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
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white truncate">{playlist.title}</h3>
                    <p className="text-neutral-400 text-sm truncate">{playlist.creator}</p>
                    <p className="text-neutral-500 text-xs mt-1">{playlist.songs.length} 首歌曲</p>
                  </div>
                  {playlist.isOwn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`确定删除歌单"${playlist.title}"吗？`)) {
                          handleDeletePlaylist(playlist.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (libraryView === 'playlist-detail' && selectedPlaylistId) {
      const playlist = myPlaylists.find((p) => p.id === selectedPlaylistId);
      if (!playlist) return null;

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => {
                setLibraryView('playlists');
                setSelectedPlaylistId(null);
              }}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <img
                src={playlist.cover}
                alt={playlist.title}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-white text-2xl mb-1">{playlist.title}</h2>
                <p className="text-neutral-400 text-sm mb-1">{playlist.description}</p>
                <p className="text-neutral-500 text-xs">
                  {playlist.creator} · {playlist.songs.length} 首歌曲
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
            {playlist.songs.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>歌单还没有歌曲</p>
                <p className="text-sm mt-1">点击歌曲的"+"按钮添加到歌单</p>
              </div>
            ) : (
              playlist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 p-4 hover:bg-neutral-800/50 transition-all border-b border-neutral-700/30 last:border-0"
                >
                  <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
                  <button
                    onClick={() => handleSongSelect(songs.findIndex((s) => s.id === song.id))}
                    className="relative flex-shrink-0 group"
                  >
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{song.title}</p>
                    <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
                  </div>
                  <span className="text-neutral-500 text-sm">{formatTime(song.duration)}</span>
                  {playlist.isOwn && (
                    <button
                      onClick={() => handleRemoveFromPlaylist(playlist.id, song.id)}
                      className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16 pb-32">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">播放器</h1>
              <p className="text-neutral-400 text-sm mt-1">
                管理你的音乐库，畅享个性化体验
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* 左侧：音乐库导航 */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-2xl border border-neutral-700/50 p-4 sticky top-24">
              <h3 className="text-neutral-400 text-sm mb-3 px-2">我的音乐</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setLibraryView('liked')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${libraryView === 'liked'
                      ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                >
                  <Heart className={`w-4 h-4 ${libraryView === 'liked' ? 'fill-current' : ''}`} />
                  <span className="text-sm">我喜欢</span>
                  <span className="ml-auto text-xs">{likedSongsList.length}</span>
                </button>
                <button
                  onClick={() => setLibraryView('albums')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${libraryView === 'albums'
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                >
                  <FolderHeart className="w-4 h-4" />
                  <span className="text-sm">我的收藏</span>
                  <span className="ml-auto text-xs">{myAlbums.length}</span>
                </button>
                <button
                  onClick={() => {
                    setLibraryView('playlists');
                    setSelectedPlaylistId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${libraryView === 'playlists' || libraryView === 'playlist-detail'
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                >
                  <Library className="w-4 h-4" />
                  <span className="text-sm">我的歌单</span>
                  <span className="ml-auto text-xs">{myPlaylists.length}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* 右侧：音乐库内容 */}
          <div className="flex-1">{renderLibraryContent()}</div>
        </div>
      </div>

      {/* 底部播放控制栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-neutral-900 to-stone-950 border-t border-neutral-700/50 backdrop-blur-xl z-40">
        {/* 进度条 */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-1 bg-neutral-800 cursor-pointer group relative"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-600 relative transition-all"
            style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
          </div>
        </div>

        {/* 控制栏 */}
        <div className="px-4 py-3">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
            {/* 左侧：当前歌曲信息 */}
            <div
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-neutral-800/30 rounded-lg p-2 -m-2 transition-all"
              onClick={() => setShowPlayerDetail(true)}
            >
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-14 h-14 rounded-lg object-cover shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{currentSong.title}</p>
                <p className="text-neutral-400 text-sm truncate">{currentSong.artist}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(currentSong.id);
                }}
                className={`p-2 rounded-lg transition-all ${likedSongs.includes(currentSong.id)
                    ? 'text-red-400 hover:bg-red-500/20'
                    : 'text-neutral-400 hover:text-red-400 hover:bg-neutral-800'
                  }`}
              >
                <Heart
                  className={`w-5 h-5 ${likedSongs.includes(currentSong.id) ? 'fill-current' : ''}`}
                />
              </button>
            </div>

            {/* 中间：播放控制 */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={cyclePlayMode}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                  title={getPlayModeText()}
                >
                  {getPlayModeIcon()}
                </button>
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                  <ListMusic className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(currentSong.duration)}</span>
              </div>
            </div>

            {/* 右侧：音量控制 */}
            <div className="flex items-center justify-end gap-3 flex-1">
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <button
                onClick={() => setShowPlayerDetail(true)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 播放详情页 - 黑胶唱片布局 */}
      <AnimatePresence>
        {showPlayerDetail && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 z-50 flex flex-col"
          >
            {/* 顶部操作栏 */}
            <div className="flex-shrink-0 flex items-center justify-between px-8 py-6 border-b border-neutral-800/50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowPlayerDetail(false)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-white">正在播放</h2>
                  <p className="text-neutral-500 text-sm">{currentSong.album}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLike(currentSong.id)}
                  className={`p-2 rounded-lg transition-all ${likedSongs.includes(currentSong.id)
                      ? 'text-red-400 bg-red-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                >
                  <Heart
                    className={`w-5 h-5 ${likedSongs.includes(currentSong.id) ? 'fill-current' : ''}`}
                  />
                </button>
                <button className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 主内容区域 */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full max-w-[1400px] mx-auto px-8 py-8 grid grid-cols-2 gap-12">
                {/* 左侧：黑胶唱片 */}
                <div className="flex flex-col items-center justify-center">
                  {/* 黑胶唱片容器 */}
                  <div className="relative w-full max-w-[500px] aspect-square mb-12">
                    {/* 唱针 */}
                    <motion.div
                      className="absolute -top-8 right-[35%] z-20 origin-top-right"
                      animate={{ rotate: isPlaying ? 0 : -25 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative w-32 h-40">
                        {/* 唱针臂 */}
                        <div className="absolute top-0 right-0 w-2 h-32 bg-gradient-to-b from-neutral-600 to-neutral-700 rounded-full shadow-xl" />
                        {/* 唱针头 */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-neutral-400 rounded-full" />
                        {/* 唱针支点 */}
                        <div className="absolute top-0 right-0 w-4 h-4 bg-neutral-700 rounded-full border-2 border-neutral-600" />
                      </div>
                    </motion.div>

                    {/* 黑胶唱片外圈 */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-900 to-black shadow-2xl"
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      {/* 唱片纹理 */}
                      <div className="absolute inset-0 rounded-full">
                        {[...Array(30)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute inset-0 rounded-full border border-neutral-800/30"
                            style={{
                              margin: `${i * 3}px`,
                            }}
                          />
                        ))}
                      </div>

                      {/* 封面区域 */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-neutral-800">
                        <img
                          src={currentSong.cover}
                          alt={currentSong.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 中心圆点 */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 shadow-inner border-2 border-neutral-600" />
                    </motion.div>
                  </div>

                  {/* 歌曲信息 */}
                  <div className="text-center mb-8">
                    <h1 className="text-white text-3xl mb-2">{currentSong.title}</h1>
                    <p className="text-neutral-400 text-lg">{currentSong.artist}</p>
                  </div>

                  {/* 进度条 */}
                  <div className="w-full max-w-[500px] mb-6">
                    <div
                      onClick={handleProgressClick}
                      className="h-1.5 bg-neutral-800 rounded-full cursor-pointer group mb-2"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full relative transition-all"
                        style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-neutral-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(currentSong.duration)}</span>
                    </div>
                  </div>

                  {/* 播放控制 */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={cyclePlayMode}
                      className="p-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                      title={getPlayModeText()}
                    >
                      {getPlayModeIcon()}
                    </button>
                    <button
                      onClick={handlePrevious}
                      className="p-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                    >
                      <SkipBack className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handlePlayPause}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 flex items-center justify-center shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
                    >
                      {isPlaying ? (
                        <Pause className="w-7 h-7 text-white" />
                      ) : (
                        <Play className="w-7 h-7 text-white ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                    >
                      <SkipForward className="w-6 h-6" />
                    </button>
                    <button className="p-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                      <ListMusic className="w-6 h-6" />
                    </button>
                  </div>

                  {/* 音量控制 */}
                  <div className="flex items-center gap-3 mt-6 w-48">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-1 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>
                </div>

                {/* 右侧：歌词/评论/相似 */}
                <div className="flex flex-col overflow-hidden">
                  {/* Tab导航 */}
                  <div className="flex items-center gap-8 mb-6 border-b border-neutral-800">
                    <button
                      onClick={() => setDetailTab('lyrics')}
                      className={`pb-3 transition-all relative ${detailTab === 'lyrics'
                          ? 'text-white'
                          : 'text-neutral-400 hover:text-neutral-300'
                        }`}
                    >
                      歌词
                      {detailTab === 'lyrics' && (
                        <motion.div
                          layoutId="detailTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setDetailTab('comments')}
                      className={`pb-3 transition-all relative ${detailTab === 'comments'
                          ? 'text-white'
                          : 'text-neutral-400 hover:text-neutral-300'
                        }`}
                    >
                      评论
                      {detailTab === 'comments' && (
                        <motion.div
                          layoutId="detailTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setDetailTab('similar')}
                      className={`pb-3 transition-all relative ${detailTab === 'similar'
                          ? 'text-white'
                          : 'text-neutral-400 hover:text-neutral-300'
                        }`}
                    >
                      相似推荐
                      {detailTab === 'similar' && (
                        <motion.div
                          layoutId="detailTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                        />
                      )}
                    </button>
                  </div>

                  {/* Tab内容 */}
                  <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {detailTab === 'lyrics' && (
                        <motion.div
                          key="lyrics"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6 pr-4"
                        >
                          <div className="text-center py-20">
                            <Disc className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                            <p className="text-neutral-500">暂无歌词</p>
                          </div>
                        </motion.div>
                      )}

                      {detailTab === 'comments' && (
                        <motion.div
                          key="comments"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4 pr-4"
                        >
                          {/* 精彩评论 */}
                          <div>
                            <h3 className="text-neutral-400 text-sm mb-4">精彩评论</h3>
                            <div className="space-y-4">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="bg-neutral-800/30 rounded-lg p-4 hover:bg-neutral-800/50 transition-all"
                                >
                                  <div className="flex items-start gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600" />
                                    <div className="flex-1">
                                      <p className="text-neutral-300 text-sm mb-1">用户{i}</p>
                                      <p className="text-white text-sm">
                                        这首歌真的太好听了，每次听都有不同的感受！
                                      </p>
                                      <div className="flex items-center gap-4 mt-2 text-neutral-500 text-xs">
                                        <span>2024-12-09</span>
                                        <button className="hover:text-white transition-all">
                                          <Heart className="w-3 h-3 inline mr-1" />
                                          {123 + i * 10}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 最新评论 */}
                          <div className="mt-6">
                            <h3 className="text-neutral-400 text-sm mb-4">最新评论</h3>
                            <div className="space-y-4">
                              {[4, 5, 6].map((i) => (
                                <div
                                  key={i}
                                  className="bg-neutral-800/30 rounded-lg p-4 hover:bg-neutral-800/50 transition-all"
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                                    <div className="flex-1">
                                      <p className="text-neutral-300 text-sm mb-1">听众{i}</p>
                                      <p className="text-white text-sm">单曲循环中...</p>
                                      <div className="flex items-center gap-4 mt-2 text-neutral-500 text-xs">
                                        <span>刚刚</span>
                                        <button className="hover:text-white transition-all">
                                          <Heart className="w-3 h-3 inline mr-1" />
                                          {10 + i}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {detailTab === 'similar' && (
                        <motion.div
                          key="similar"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3 pr-4"
                        >
                          <h3 className="text-neutral-400 text-sm mb-4">与此歌曲相似</h3>
                          {songs
                            .filter((s) => s.id !== currentSong.id)
                            .map((song) => (
                              <div
                                key={song.id}
                                onClick={() => handleSongSelect(songs.findIndex((s) => s.id === song.id))}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800/50 cursor-pointer transition-all group"
                              >
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={song.cover}
                                    alt={song.title}
                                    className="w-14 h-14 rounded-lg object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <Play className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white truncate">{song.title}</p>
                                  <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
                                </div>
                                <span className="text-neutral-500 text-sm">
                                  {formatTime(song.duration)}
                                </span>
                              </div>
                            ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 新建歌单对话框 */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl">新建歌单</h3>
              <button
                onClick={() => {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName('');
                  setNewPlaylistDesc('');
                }}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-sm mb-2">歌单名称</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="输入歌单名称"
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-sm mb-2">描述（可选）</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="添加描述..."
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCreatePlaylist(false);
                    setNewPlaylistName('');
                    setNewPlaylistDesc('');
                  }}
                  className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 添加到歌单对话框 */}
      {showAddToPlaylist && selectedSongForAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl">添加到歌单</h3>
              <button
                onClick={() => {
                  setShowAddToPlaylist(false);
                  setSelectedSongForAdd(null);
                }}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-neutral-900/50 rounded-lg flex items-center gap-3">
              <img
                src={selectedSongForAdd.cover}
                alt={selectedSongForAdd.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{selectedSongForAdd.title}</p>
                <p className="text-neutral-400 text-sm truncate">{selectedSongForAdd.artist}</p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {myPlaylists.filter((p) => p.isOwn).length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>还没有创建歌单</p>
                  <button
                    onClick={() => {
                      setShowAddToPlaylist(false);
                      setShowCreatePlaylist(true);
                    }}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white text-sm transition-all"
                  >
                    创建歌单
                  </button>
                </div>
              ) : (
                myPlaylists
                  .filter((p) => p.isOwn)
                  .map((playlist) => {
                    const alreadyAdded = playlist.songs.find(
                      (s) => s.id === selectedSongForAdd.id
                    );
                    return (
                      <button
                        key={playlist.id}
                        onClick={() => !alreadyAdded && handleAddToPlaylist(playlist.id)}
                        disabled={!!alreadyAdded}
                        className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${alreadyAdded
                            ? 'bg-neutral-800/50 cursor-not-allowed opacity-50'
                            : 'bg-neutral-900/50 hover:bg-neutral-800'
                          }`}
                      >
                        <img
                          src={playlist.cover}
                          alt={playlist.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-white truncate">{playlist.title}</p>
                          <p className="text-neutral-400 text-sm">{playlist.songs.length} 首歌曲</p>
                        </div>
                        {alreadyAdded && <span className="text-green-400 text-sm">已添加</span>}
                      </button>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
