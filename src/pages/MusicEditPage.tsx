import { useEffect, useState } from 'react';
import {
  Music,
  User,
  Disc,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Image as ImageIcon,
  Upload,
  Calendar,
  Hash,
  Clock,
} from 'lucide-react';

type TabType = 'songs' | 'artists' | 'albums';
type ModalType = 'add' | 'edit' | null;

interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: string;
  cover: string;
  year: number;
  genre: string;
}

interface Artist {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  country: string;
  debutYear: number;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  year: number;
  genre: string;
  tracks: number;
  description: string;
}

export function MusicEditPage() {
  const [activeTab, setActiveTab] = useState<TabType>('songs');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<Song | Artist | Album | null>(null);

  const [songs, setSongs] = useState<Song[]>([]);

  const [artists, setArtists] = useState<Artist[]>([]);

  const [albums, setAlbums] = useState<Album[]>([]);

  // 表单状态
  const [formData, setFormData] = useState<any>({});

  const tabs = [
    { id: 'songs', label: '单曲管理', icon: Music },
    { id: 'artists', label: '歌手管理', icon: User },
    { id: 'albums', label: '专辑管理', icon: Disc },
  ];

  const handleAdd = () => {
    setModalType('add');
    setSelectedItem(null);
    setFormData({});
  };

  const handleEdit = (item: Song | Artist | Album) => {
    setModalType('edit');
    setSelectedItem(item);
    setFormData(item);
  };

  const handleDelete = (id: string) => {
    if (!confirm('确定要删除吗？此操作不可恢复。')) return;
    (async () => {
      const { getOpenAPI } = await import('@/api/lazy');
      await getOpenAPI();
      const { MusicSongsService, MusicArtistsService, MusicAlbumsService } = await import('@/api');
      try {
        if (activeTab === 'songs') {
          await MusicSongsService.songsControllerDelete();
          const res = await MusicSongsService.songsControllerList();
          setSongs((res as any)?.data?.items ?? (res as any)?.data ?? []);
        } else if (activeTab === 'artists') {
          await MusicArtistsService.artistsControllerDelete();
          const res = await MusicArtistsService.artistsControllerList();
          setArtists((res as any)?.data?.items ?? (res as any)?.data ?? []);
        } else if (activeTab === 'albums') {
          await MusicAlbumsService.albumsControllerDelete();
          const res = await MusicAlbumsService.albumsControllerList();
          setAlbums((res as any)?.data?.items ?? (res as any)?.data ?? []);
        }
      } catch {
        if (activeTab === 'songs') {
          setSongs(songs.filter((s) => s.id !== id));
        } else if (activeTab === 'artists') {
          setArtists(artists.filter((a) => a.id !== id));
        } else if (activeTab === 'albums') {
          setAlbums(albums.filter((a) => a.id !== id));
        }
      }
    })();
  };

  const handleSave = () => {
    (async () => {
      const { getOpenAPI } = await import('@/api/lazy');
      await getOpenAPI();
      const { MusicSongsService, MusicArtistsService, MusicAlbumsService } = await import('@/api');
      try {
        if (activeTab === 'songs') {
          if (modalType === 'add') {
            await MusicSongsService.songsControllerCreate();
          } else {
            await MusicSongsService.songsControllerUpdate();
          }
          const res = await MusicSongsService.songsControllerList();
          const items = (res as any)?.data?.items ?? (res as any)?.data ?? [];
          setSongs(items);
        } else if (activeTab === 'artists') {
          if (modalType === 'add') {
            await MusicArtistsService.artistsControllerCreate();
          } else {
            await MusicArtistsService.artistsControllerUpdate();
          }
          const res = await MusicArtistsService.artistsControllerList();
          const items = (res as any)?.data?.items ?? (res as any)?.data ?? [];
          setArtists(items);
        } else if (activeTab === 'albums') {
          if (modalType === 'add') {
            await MusicAlbumsService.albumsControllerCreate();
          } else {
            await MusicAlbumsService.albumsControllerUpdate();
          }
          const res = await MusicAlbumsService.albumsControllerList();
          const items = (res as any)?.data?.items ?? (res as any)?.data ?? [];
          setAlbums(items);
        }
      } catch {}
    })();

    setModalType(null);
    setSelectedItem(null);
    setFormData({});
  };

  const renderSongsList = () => {
    const filteredSongs = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
        {filteredSongs.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>暂无单曲数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800/50 border-b border-neutral-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-neutral-400 text-sm">封面</th>
                  <th className="px-4 py-3 text-left text-neutral-400 text-sm">歌名</th>
                  <th className="px-4 py-3 text-left text-neutral-400 text-sm">歌手</th>
                  <th className="px-4 py-3 text-left text-neutral-400 text-sm">专辑</th>
                  <th className="px-4 py-3 text-left text-neutral-400 text-sm">时长</th>
                  <th className="px-4 py-3 text-left text-neutral-400 text-sm">年份</th>
                  <th className="px-4 py-3 text-left text-neutral-400 text-sm">风格</th>
                  <th className="px-4 py-3 text-right text-neutral-400 text-sm">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song) => (
                  <tr
                    key={song.id}
                    className="border-b border-neutral-700/30 last:border-0 hover:bg-neutral-800/30 transition-all"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-white">{song.title}</td>
                    <td className="px-4 py-3 text-neutral-300">{song.artist}</td>
                    <td className="px-4 py-3 text-neutral-300">{song.album}</td>
                    <td className="px-4 py-3 text-neutral-400">{song.duration}</td>
                    <td className="px-4 py-3 text-neutral-400">{song.year}</td>
                    <td className="px-4 py-3 text-neutral-400">{song.genre}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(song)}
                          className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-all"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(song.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderArtistsList = () => {
    const filteredArtists = artists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArtists.length === 0 ? (
          <div className="col-span-full p-12 text-center text-neutral-500 bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>暂无歌手数据</p>
          </div>
        ) : (
          filteredArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-6 hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1 truncate">{artist.name}</h3>
                  <p className="text-neutral-400 text-sm">{artist.country}</p>
                  <p className="text-neutral-500 text-xs mt-1">出道: {artist.debutYear}</p>
                </div>
              </div>
              <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{artist.bio}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(artist)}
                  className="flex-1 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(artist.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderAlbumsList = () => {
    const filteredAlbums = albums.filter(
      (album) =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlbums.length === 0 ? (
          <div className="col-span-full p-12 text-center text-neutral-500 bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50">
            <Disc className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>暂无专辑数据</p>
          </div>
        ) : (
          filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/50 transition-all"
            >
              <img
                src={album.cover}
                alt={album.title}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <h3 className="text-white mb-1 truncate">{album.title}</h3>
                <p className="text-neutral-400 text-sm truncate">{album.artist}</p>
                <div className="flex items-center gap-4 mt-2 text-neutral-500 text-xs">
                  <span>{album.year}</span>
                  <span>{album.genre}</span>
                  <span>{album.tracks} 首</span>
                </div>
                <p className="text-neutral-400 text-sm line-clamp-2 mt-3">{album.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(album)}
                    className="flex-1 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(album.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'songs':
        return renderSongsList();
      case 'artists':
        return renderArtistsList();
      case 'albums':
        return renderAlbumsList();
      default:
        return null;
    }
  };

  useEffect(() => {
    (async () => {
      const { getOpenAPI } = await import('@/api/lazy');
      await getOpenAPI();
      const { MusicSongsService, MusicArtistsService, MusicAlbumsService } = await import('@/api');
      try {
        const [songsRes, artistsRes, albumsRes] = await Promise.all([
          MusicSongsService.songsControllerList(),
          MusicArtistsService.artistsControllerList(),
          MusicAlbumsService.albumsControllerList(),
        ]);
        const songsData = (songsRes as any)?.data?.items ?? (songsRes as any)?.data ?? [];
        const artistsData = (artistsRes as any)?.data?.items ?? (artistsRes as any)?.data ?? [];
        const albumsData = (albumsRes as any)?.data?.items ?? (albumsRes as any)?.data ?? [];
        setSongs(songsData);
        setArtists(artistsData);
        setAlbums(albumsData);
      } catch {}
    })();
  }, []);

  const renderModal = () => {
    if (!modalType) return null;

    const isAdd = modalType === 'add';
    const title = isAdd
      ? `新增${activeTab === 'songs' ? '单曲' : activeTab === 'artists' ? '歌手' : '专辑'}`
      : `编辑${activeTab === 'songs' ? '单曲' : activeTab === 'artists' ? '歌手' : '专辑'}`;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl">{title}</h3>
            <button
              onClick={() => {
                setModalType(null);
                setSelectedItem(null);
                setFormData({});
              }}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === 'songs' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">歌名</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="输入歌名"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">歌手</label>
                    <input
                      type="text"
                      value={formData.artist || ''}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      placeholder="输入歌手"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">专辑</label>
                    <input
                      type="text"
                      value={formData.album || ''}
                      onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                      placeholder="输入专辑"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">时长</label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="例如: 3:45"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">年份</label>
                    <input
                      type="number"
                      value={formData.year || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, year: parseInt(e.target.value) })
                      }
                      placeholder="2024"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">风格</label>
                    <input
                      type="text"
                      value={formData.genre || ''}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="流行/摇滚/电子等"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-400 text-sm mb-2">封面URL</label>
                  <input
                    type="text"
                    value={formData.cover || ''}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </>
            )}

            {activeTab === 'artists' && (
              <>
                <div>
                  <label className="block text-amber-400 text-sm mb-2">艺名</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="输入艺名"
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">国家/地区</label>
                    <input
                      type="text"
                      value={formData.country || ''}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="中国/美国等"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">出道年份</label>
                    <input
                      type="number"
                      value={formData.debutYear || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, debutYear: parseInt(e.target.value) })
                      }
                      placeholder="2020"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-400 text-sm mb-2">简介</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="输入艺人简介..."
                    rows={3}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-400 text-sm mb-2">头像URL</label>
                  <input
                    type="text"
                    value={formData.avatar || ''}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </>
            )}

            {activeTab === 'albums' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">专辑名</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="输入专辑名"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">艺人</label>
                    <input
                      type="text"
                      value={formData.artist || ''}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      placeholder="输入艺人"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">年份</label>
                    <input
                      type="number"
                      value={formData.year || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, year: parseInt(e.target.value) })
                      }
                      placeholder="2024"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">风格</label>
                    <input
                      type="text"
                      value={formData.genre || ''}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="流行/摇滚等"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-sm mb-2">曲目数</label>
                    <input
                      type="number"
                      value={formData.tracks || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, tracks: parseInt(e.target.value) })
                      }
                      placeholder="12"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-400 text-sm mb-2">专辑描述</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="输入专辑描述..."
                    rows={3}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-400 text-sm mb-2">封面URL</label>
                  <input
                    type="text"
                    value={formData.cover || ''}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-700">
            <button
              onClick={() => {
                setModalType(null);
                setSelectedItem(null);
                setFormData({});
              }}
              className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-all"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Edit2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">音乐编辑</h1>
              <p className="text-neutral-400 text-sm mt-1">管理和维护音乐库中的单曲、歌手和专辑</p>
            </div>
          </div>

          {/* Tab导航和操作栏 */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-neutral-800/40 rounded-xl p-1 border border-neutral-700/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {/* 搜索框 */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              {/* 添加按钮 */}
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white flex items-center gap-2 transition-all shadow-lg shadow-amber-500/30"
              >
                <Plus className="w-4 h-4" />
                新增{activeTab === 'songs' ? '单曲' : activeTab === 'artists' ? '歌手' : '专辑'}
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        {renderContent()}
      </div>

      {/* 编辑/新增对话框 */}
      {renderModal()}
    </div>
  );
}
