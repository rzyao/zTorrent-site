import { Flame, Star, Headphones, Play, Heart, Plus, Bookmark, Check } from "lucide-react";
import type { Playlist, Song, Artist, Album } from "../types";
import { useLanguage } from "@/hooks/useLanguage";

interface HallSectionProps {
  featuredSongs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  likedSongs: string[];
  favoriteAlbums: string[];
  favoritePlaylists: string[];
  toggleLike: (songId: string) => void;
  toggleFavoriteAlbum: (albumId: string) => void;
  toggleFavoritePlaylist: (playlistId: string) => void;
  openAddToPlaylist: (song: Song) => void;
}

/**
 * 音乐大厅（热门推荐 / 精选歌单 / 热门歌手 / 最新专辑）
 * - 纯展示组件，通过 props 驱动交互
 */
export function HallSection({
  featuredSongs,
  artists,
  albums,
  playlists,
  likedSongs,
  favoriteAlbums,
  favoritePlaylists,
  toggleLike,
  toggleFavoriteAlbum,
  toggleFavoritePlaylist,
  openAddToPlaylist,
}: HallSectionProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      {/* 热门推荐 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-white text-xl">{t('music.hall.featured')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredSongs.slice(0, 4).map((song) => (
            <div
              key={song.id}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-amber-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img src={song.cover} alt={song.title} className="w-full aspect-square object-cover rounded-lg" />
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
                    <Heart className={`w-4 h-4 ${likedSongs.includes(song.id) ? "fill-current" : ""}`} />
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
          <h2 className="text-white text-xl">{t('music.hall.playlists')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-purple-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img src={playlist.cover} alt={playlist.title} className="w-full aspect-square object-cover rounded-lg" />
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
                    className={`w-4 h-4 ${favoritePlaylists.includes(playlist.id) ? "fill-current" : ""}`}
                  />
                </button>
              </div>
              <h3 className="text-white truncate">{playlist.title}</h3>
              <p className="text-neutral-400 text-sm truncate">{playlist.creator}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-neutral-500 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <span className="sr-only">{t('music.hall.tracks')}</span>
                    {playlist.tracks} {t('music.hall.songsUnit')}
                  </span>
                </div>
                {favoritePlaylists.includes(playlist.id) && (
                  <span className="text-purple-400 text-xs flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {t('music.hall.favorited')}
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
          <h2 className="text-white text-xl">{t('music.hall.artists')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-green-500/50 transition-all text-center cursor-pointer"
            >
              <img src={artist.avatar} alt={artist.name} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover" />
              <h3 className="text-white truncate">{artist.name}</h3>
              <p className="text-neutral-400 text-sm">{artist.followers.toLocaleString()} {t('music.hall.followers')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 最新专辑 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-white text-xl">{t('music.hall.albums')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-blue-500/50 transition-all group cursor-pointer"
            >
              <div className="relative mb-3">
                <img src={album.cover} alt={album.title} className="w-full aspect-square object-cover rounded-lg" />
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
                  <Bookmark className={`w-4 h-4 ${favoriteAlbums.includes(album.id) ? "fill-current" : ""}`} />
                </button>
              </div>
              <h3 className="text-white truncate">{album.title}</h3>
              <p className="text-neutral-400 text-sm truncate">{album.artist}</p>
              <div className="flex items-center justify-between mt-2 text-neutral-500 text-xs">
                <span>{album.year}</span>
                <div className="flex items-center gap-2">
                  <span>{album.tracks} {t('music.hall.tracksUnit')}</span>
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
}

