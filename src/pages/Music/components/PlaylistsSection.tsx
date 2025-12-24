import { Play, Bookmark, Check } from "lucide-react";
import type { Playlist, ViewMode } from "../types";

interface PlaylistsSectionProps {
  playlists: Playlist[];
  viewMode: ViewMode;
  favoritePlaylists: string[];
  toggleFavoritePlaylist: (playlistId: string) => void;
}

/**
 * 歌单 Tab 内容（支持网格/列表两种视图）
 */
export function PlaylistsSection({
  playlists,
  viewMode,
  favoritePlaylists,
  toggleFavoritePlaylist,
}: PlaylistsSectionProps) {
  if (viewMode === "grid") {
    return (
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
              <p className="text-neutral-500 text-xs">{playlist.tracks} 首歌曲</p>
              {favoritePlaylists.includes(playlist.id) && (
                <span className="text-purple-400 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
      {playlists.map((playlist, index) => (
        <div
          key={playlist.id}
          className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
        >
          <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
          <img src={playlist.cover} alt={playlist.title} className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1">
            <p className="text-white">{playlist.title}</p>
            <p className="text-neutral-400 text-sm">{playlist.creator}</p>
          </div>
          <span className="text-neutral-400 text-sm">{playlist.tracks} 首歌曲</span>
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
              className={`w-4 h-4 ${favoritePlaylists.includes(playlist.id) ? "fill-current" : ""}`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

