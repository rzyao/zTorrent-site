import { Edit2, Trash2 } from "lucide-react";
import type { Album } from "../types";

export function AlbumsGrid({
  albums,
  searchQuery,
  onEdit,
  onDelete,
}: {
  albums: Album[];
  searchQuery: string;
  onEdit: (album: Album) => void;
  onDelete: (id: string) => void;
}) {
  const filtered = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.length === 0 ? (
        <div className="col-span-full p-12 text-center text-neutral-500 bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50">
          <p>暂无专辑数据</p>
        </div>
      ) : (
        filtered.map((album) => (
          <div
            key={album.id}
            className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/50 transition-all"
          >
            <img src={album.cover} alt={album.title} className="w-full aspect-square object-cover" />
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
                  onClick={() => onEdit(album)}
                  className="flex-1 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  编辑
                </button>
                <button
                  onClick={() => onDelete(album.id)}
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
}

