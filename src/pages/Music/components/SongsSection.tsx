import { Play, Heart, Plus } from "lucide-react";
import type { Song, ViewMode } from "../types";

interface SongsSectionProps {
  songs: Song[];
  viewMode: ViewMode;
  likedSongs: string[];
  toggleLike: (songId: string) => void;
  openAddToPlaylist: (song: Song) => void;
}

/**
 * 单曲 Tab 内容（支持网格/列表两种视图）
 */
export function SongsSection({
  songs,
  viewMode,
  likedSongs,
  toggleLike,
  openAddToPlaylist,
}: SongsSectionProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-amber-500/50 transition-all group cursor-pointer"
          >
            <div className="relative mb-3">
              <img src={song.cover} alt={song.title} className="w-full aspect-square object-cover rounded-lg" />
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
                  <Heart className={`w-4 h-4 ${likedSongs.includes(song.id) ? "fill-current" : ""}`} />
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
    );
  }

  // 列表视图
  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
        >
          <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
          <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(song.id);
              }}
              className={`p-2 rounded-lg transition-all ${
                likedSongs.includes(song.id) ? "text-red-400 bg-red-500/20" : "text-neutral-400 hover:text-red-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${likedSongs.includes(song.id) ? "fill-current" : ""}`} />
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
  );
}

