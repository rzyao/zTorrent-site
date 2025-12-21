import { useState, useEffect } from "react";
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
  Plus,
  X,
  Check,
  Bookmark,
} from "lucide-react";
import { getOpenAPI } from "@/api/lazy";
import {
  MusicSongsService,
  MusicArtistsService,
  MusicAlbumsService,
  MusicPlaylistsService,
} from "@/api";

type TabType = "hall" | "songs" | "artists" | "albums" | "playlists";
type ViewMode = "grid" | "list";

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

interface MyPlaylist {
  id: string;
  title: string;
  description: string;
  cover: string;
  songs: Song[];
  isOwn: boolean;
  creator: string;
}

export function MusicPage() {
  const [activeTab, setActiveTab] = useState<TabType>("hall");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // 交互状态
  const [likedSongs, setLikedSongs] = useState<string[]>(["1", "3"]); // 默认喜欢一些歌曲
  const [favoriteAlbums, setFavoriteAlbums] = useState<string[]>(["1"]); // 收藏的专辑
  const [favoritePlaylists, setFavoritePlaylists] = useState<string[]>(["1"]); // 收藏的歌单
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [selectedSongForAdd, setSelectedSongForAdd] = useState<Song | null>(
    null
  );

  const [myPlaylists, setMyPlaylists] = useState<MyPlaylist[]>([]);

  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);

  const [artists, setArtists] = useState<Artist[]>([]);

  const [albums, setAlbums] = useState<Album[]>([]);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const tabs = [
    { id: "hall", label: "音乐大厅", icon: Sparkles },
    { id: "songs", label: "单曲", icon: Music },
    { id: "artists", label: "歌手", icon: User },
    { id: "albums", label: "专辑", icon: Disc },
    { id: "playlists", label: "歌单", icon: ListMusic },
  ];

  useEffect(() => {
    (async () => {
      await getOpenAPI();

      try {
        const [
          songsRes,
          artistsRes,
          albumsRes,
          pubPlaylistsRes,
          myPlaylistsRes,
        ] = await Promise.all([
          MusicSongsService.songsControllerList(),
          MusicArtistsService.artistsControllerList(),
          MusicAlbumsService.albumsControllerList(),
          MusicPlaylistsService.playlistsControllerListPublic(),
          MusicPlaylistsService.playlistsControllerMy(),
        ]);
        const songs =
          (songsRes as any)?.data?.items ?? (songsRes as any)?.data ?? [];
        const artistsData =
          (artistsRes as any)?.data?.items ?? (artistsRes as any)?.data ?? [];
        const albumsData =
          (albumsRes as any)?.data?.items ?? (albumsRes as any)?.data ?? [];
        const pubPlaylists =
          (pubPlaylistsRes as any)?.data?.items ??
          (pubPlaylistsRes as any)?.data ??
          [];
        const minePlaylists =
          (myPlaylistsRes as any)?.data?.items ??
          (myPlaylistsRes as any)?.data ??
          [];
        setFeaturedSongs(songs);
        setArtists(artistsData);
        setAlbums(albumsData);
        setPlaylists(pubPlaylists);
        setMyPlaylists(minePlaylists);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // 交互函数
  const toggleLike = (songId: string) => {
    setLikedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const toggleFavoriteAlbum = (albumId: string) => {
    setFavoriteAlbums((prev) =>
      prev.includes(albumId)
        ? prev.filter((id) => id !== albumId)
        : [...prev, albumId]
    );
  };

  const toggleFavoritePlaylist = (playlistId: string) => {
    setFavoritePlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const openAddToPlaylist = (song: Song) => {
    setSelectedSongForAdd(song);
    setShowAddToPlaylist(true);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    // 这里应该与播放器页面的状态同步，实际应用中使用全局状态管理
    console.log(`添加歌曲 ${selectedSongForAdd?.title} 到歌单 ${playlistId}`);
    setShowAddToPlaylist(false);
    setSelectedSongForAdd(null);
  };

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
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-amber-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <button className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center transition-all">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                </div>
                {/* 操作按钮 */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className={`p-2 rounded-lg backdrop-blur-sm transition-all ${
                      likedSongs.includes(song.id)
                        ? "bg-red-500/80 text-white"
                        : "bg-black/50 text-white hover:bg-red-500/80"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedSongs.includes(song.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddToPlaylist(song);
                    }}
                    className="p-2 rounded-lg bg-black/50 text-white hover:bg-amber-500/80 backdrop-blur-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
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
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-purple-500/50 transition-all group cursor-pointer"
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
                {/* 收藏按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoritePlaylist(playlist.id);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all ${
                    favoritePlaylists.includes(playlist.id)
                      ? "bg-purple-500/80 text-white"
                      : "bg-black/50 text-white hover:bg-purple-500/80"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      favoritePlaylists.includes(playlist.id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-white truncate">{playlist.title}</h3>
              <p className="text-neutral-400 text-sm truncate">
                {playlist.creator}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-neutral-500 text-xs">
                  <Music className="w-3 h-3" />
                  <span>{playlist.tracks} 首歌曲</span>
                </div>
                {favoritePlaylists.includes(playlist.id) && (
                  <span className="text-purple-400 text-xs flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    已收藏
                  </span>
                )}
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
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-green-500/50 transition-all text-center cursor-pointer"
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
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-blue-500/50 transition-all group cursor-pointer"
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
                {/* 收藏按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteAlbum(album.id);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all ${
                    favoriteAlbums.includes(album.id)
                      ? "bg-blue-500/80 text-white"
                      : "bg-black/50 text-white hover:bg-blue-500/80"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      favoriteAlbums.includes(album.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-white truncate">{album.title}</h3>
              <p className="text-neutral-400 text-sm truncate">
                {album.artist}
              </p>
              <div className="flex items-center justify-between mt-2 text-neutral-500 text-xs">
                <span>{album.year}</span>
                <div className="flex items-center gap-2">
                  <span>{album.tracks} 首</span>
                  {favoriteAlbums.includes(album.id) && (
                    <span className="text-blue-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderSongs = () => (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredSongs.map((song) => (
            <div
              key={song.id}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-amber-500/50 transition-all group cursor-pointer"
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
                <span className="text-neutral-500 text-xs">
                  {song.duration}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className={`p-1.5 rounded-lg transition-all ${
                      likedSongs.includes(song.id)
                        ? "text-red-400 bg-red-500/20"
                        : "text-neutral-400 hover:text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedSongs.includes(song.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddToPlaylist(song);
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-amber-500/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
          {featuredSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
            >
              <span className="text-neutral-500 w-8 text-center">
                {index + 1}
              </span>
              <img
                src={song.cover}
                alt={song.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{song.title}</p>
                <p className="text-neutral-400 text-sm truncate">
                  {song.artist}
                </p>
              </div>
              <span className="text-neutral-500 text-sm">{song.album}</span>
              <span className="text-neutral-500 text-sm">{song.duration}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-neutral-400 hover:text-amber-400 transition-all">
                  <Play className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(song.id);
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    likedSongs.includes(song.id)
                      ? "text-red-400 bg-red-500/20"
                      : "text-neutral-400 hover:text-red-400"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedSongs.includes(song.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddToPlaylist(song);
                  }}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4" />
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
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-6 hover:border-green-500/50 transition-all text-center cursor-pointer"
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
        <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
            >
              <span className="text-neutral-500 w-8 text-center">
                {index + 1}
              </span>
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-white">{artist.name}</p>
                <p className="text-neutral-400 text-sm">
                  {artist.songs} 首歌曲
                </p>
              </div>
              <div className="text-right">
                <p className="text-neutral-400 text-sm">粉丝</p>
                <p className="text-white">
                  {artist.followers.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAlbums = () => (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-blue-500/50 transition-all group cursor-pointer"
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
                {/* 收藏按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteAlbum(album.id);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all ${
                    favoriteAlbums.includes(album.id)
                      ? "bg-blue-500/80 text-white"
                      : "bg-black/50 text-white hover:bg-blue-500/80"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      favoriteAlbums.includes(album.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-white truncate">{album.title}</h3>
              <p className="text-neutral-400 text-sm truncate">
                {album.artist}
              </p>
              <div className="flex items-center justify-between mt-2 text-neutral-500 text-xs">
                <span>{album.year}</span>
                <div className="flex items-center gap-2">
                  <span>{album.tracks} 首</span>
                  {favoriteAlbums.includes(album.id) && (
                    <Check className="w-3 h-3 text-blue-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
          {albums.map((album, index) => (
            <div
              key={album.id}
              className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
            >
              <span className="text-neutral-500 w-8 text-center">
                {index + 1}
              </span>
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteAlbum(album.id);
                }}
                className={`p-2 rounded-lg transition-all ${
                  favoriteAlbums.includes(album.id)
                    ? "text-blue-400 bg-blue-500/20"
                    : "text-neutral-400 hover:text-blue-400"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    favoriteAlbums.includes(album.id) ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlaylists = () => (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-purple-500/50 transition-all group cursor-pointer"
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
                {/* 收藏按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoritePlaylist(playlist.id);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all ${
                    favoritePlaylists.includes(playlist.id)
                      ? "bg-purple-500/80 text-white"
                      : "bg-black/50 text-white hover:bg-purple-500/80"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      favoritePlaylists.includes(playlist.id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-white truncate">{playlist.title}</h3>
              <p className="text-neutral-400 text-sm truncate">
                {playlist.creator}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-neutral-500 text-xs">
                  {playlist.tracks} 首歌曲
                </p>
                {favoritePlaylists.includes(playlist.id) && (
                  <span className="text-purple-400 text-xs flex items-center gap-1">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
          {playlists.map((playlist, index) => (
            <div
              key={playlist.id}
              className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
            >
              <span className="text-neutral-500 w-8 text-center">
                {index + 1}
              </span>
              <img
                src={playlist.cover}
                alt={playlist.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-white">{playlist.title}</p>
                <p className="text-neutral-400 text-sm">{playlist.creator}</p>
              </div>
              <span className="text-neutral-400 text-sm">
                {playlist.tracks} 首歌曲
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoritePlaylist(playlist.id);
                }}
                className={`p-2 rounded-lg transition-all ${
                  favoritePlaylists.includes(playlist.id)
                    ? "text-purple-400 bg-purple-500/20"
                    : "text-neutral-400 hover:text-purple-400"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    favoritePlaylists.includes(playlist.id)
                      ? "fill-current"
                      : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "hall":
        return renderHall();
      case "songs":
        return renderSongs();
      case "artists":
        return renderArtists();
      case "albums":
        return renderAlbums();
      case "playlists":
        return renderPlaylists();
      default:
        return renderHall();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
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
                        ? "bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 视图切换 */}
            {activeTab !== "hall" && (
              <div className="flex items-center gap-2 bg-neutral-800/40 rounded-lg p-1 border border-neutral-700/50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-neutral-700 text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="网格视图"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-neutral-700 text-white"
                      : "text-neutral-400 hover:text-white"
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

      {/* 添加到歌单对话框 */}
      {showAddToPlaylist && selectedSongForAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 p-6 max-w-md w-full shadow-2xl">
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
                <p className="text-white truncate">
                  {selectedSongForAdd.title}
                </p>
                <p className="text-neutral-400 text-sm truncate">
                  {selectedSongForAdd.artist}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {myPlaylists.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>还没有创建歌单</p>
                  <p className="text-sm mt-1">请前往播放器页面创建歌单</p>
                </div>
              ) : (
                myPlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    className="w-full p-3 rounded-lg flex items-center gap-3 transition-all bg-neutral-900/50 hover:bg-neutral-800"
                  >
                    <img
                      src={playlist.cover}
                      alt={playlist.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white truncate">{playlist.title}</p>
                      <p className="text-neutral-400 text-sm">
                        {playlist.songs.length} 首歌曲
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-neutral-400" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
