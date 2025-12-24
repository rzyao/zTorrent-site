import { Edit2, Trash2 } from "lucide-react";
import type { Artist } from "../types";

export function ArtistsGrid({
  artists,
  searchQuery,
  onEdit,
  onDelete,
}: {
  artists: Artist[];
  searchQuery: string;
  onEdit: (artist: Artist) => void;
  onDelete: (id: string) => void;
}) {
  const filtered = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.length === 0 ? (
        <div className="col-span-full p-12 text-center text-neutral-500 bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50">
          <p>暂无歌手数据</p>
        </div>
      ) : (
        filtered.map((artist) => (
          <div
            key={artist.id}
            className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-6 hover:border-amber-500/50 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <img src={artist.avatar} alt={artist.name} className="w-20 h-20 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white mb-1 truncate">{artist.name}</h3>
                <p className="text-neutral-400 text-sm">{artist.country}</p>
                <p className="text-neutral-500 text-xs mt-1">出道: {artist.debutYear}</p>
              </div>
            </div>
            <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{artist.bio}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(artist)}
                className="flex-1 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                编辑
              </button>
              <button
                onClick={() => onDelete(artist.id)}
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
}

