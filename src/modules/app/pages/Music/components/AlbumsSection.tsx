import { Play, Bookmark } from "lucide-react";
import type { Album, ViewMode } from "../types";

interface AlbumsSectionProps {
  albums: Album[];
  viewMode: ViewMode;
  favoriteAlbums: string[];
  toggleFavoriteAlbum: (albumId: string) => void;
}

/**
 * 专辑 Tab 内容（支持网格/列表两种视图）
 */
export function AlbumsSection({
  albums,
  viewMode,
  favoriteAlbums,
  toggleFavoriteAlbum,
}: AlbumsSectionProps) {
  if (viewMode === "grid") {
    return (
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
                <span>{album.tracks} 首</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
      {albums.map((album, index) => (
        <div
          key={album.id}
          className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
        >
          <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
          <img src={album.cover} alt={album.title} className="w-16 h-16 rounded-lg object-cover" />
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
            <Bookmark className={`w-4 h-4 ${favoriteAlbums.includes(album.id) ? "fill-current" : ""}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

