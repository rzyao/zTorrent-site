import { ListMusic, Play, Plus, Trash2 } from 'lucide-react';
import type { Playlist } from '@/modules/app/pages/PlayerPage/types';

/**
 * PlaylistsView
 * 纯展示：我的歌单卡片列表
 * 通过 props 接收歌单列表与点击回调
 */
export interface PlaylistsViewProps {
  playlists: Playlist[];
  onCreate: () => void;
  onOpen: (playlistId: string) => void;
  onDelete: (playlistId: string) => void;
}

export function PlaylistsView(props: PlaylistsViewProps) {
  const { onCreate, onDelete, onOpen, playlists } = props;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-purple-400" />
          我的歌单
          <span className="text-neutral-500 text-sm">({playlists.length})</span>
        </h2>
        <button onClick={onCreate} className="px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white flex items-center gap-2 transition-all shadow-lg shadow-amber-500/30">
          <Plus className="w-4 h-4" />
          新建歌单
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => onOpen(playlist.id)}
            className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-4 hover:border-purple-500/50 transition-all group cursor-pointer relative"
          >
            <div className="relative mb-3">
              <img src={playlist.cover} alt={playlist.title} className="w-full aspect-square object-cover rounded-lg" />
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
                      onDelete(playlist.id);
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

