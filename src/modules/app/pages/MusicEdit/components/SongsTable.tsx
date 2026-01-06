import { Edit2, Trash2 } from "lucide-react";
import type { Song } from "../types";

export function SongsTable({
  songs,
  searchQuery,
  onEdit,
  onDelete,
}: {
  songs: Song[];
  searchQuery: string;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}) {
  const filtered = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-neutral-500">
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
              {filtered.map((song) => (
                <tr
                  key={song.id}
                  className="border-b border-neutral-700/30 last:border-0 hover:bg-neutral-800/30 transition-all"
                >
                  <td className="px-4 py-3">
                    <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
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
                        onClick={() => onEdit(song)}
                        className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-all"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(song.id)}
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
}

