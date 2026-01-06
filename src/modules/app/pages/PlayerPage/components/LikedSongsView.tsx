import { Heart, Play, Plus } from 'lucide-react';
import type { Song } from '@/modules/app/pages/PlayerPage/types';
import { formatTime } from '@/modules/app/pages/PlayerPage/utils';

/**
 * LikedSongsView
 * 纯展示：我喜欢的歌曲列表
 * 通过 props 接收数据与交互回调，不包含业务逻辑
 */
export interface LikedSongsViewProps {
  likedSongsList: Song[];
  onSelectSongById: (songId: string) => void;
  onToggleLike: (songId: string) => void;
  onOpenAddToPlaylist: (song: Song) => void;
}

export function LikedSongsView(props: LikedSongsViewProps) {
  const { likedSongsList, onOpenAddToPlaylist, onSelectSongById, onToggleLike } = props;
  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-400 fill-current" />
        我喜欢的音乐
        <span className="text-neutral-500 text-sm">({likedSongsList.length})</span>
      </h2>
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
        {likedSongsList.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>还没有喜欢的歌曲</p>
          </div>
        ) : (
          likedSongsList.map((song) => (
            <div
              key={song.id}
              className="flex items-center gap-3 p-4 hover:bg-neutral-800/50 transition-all border-b border-neutral-700/30 last:border-0"
            >
              <button onClick={() => onSelectSongById(song.id)} className="relative shrink-0 group">
                <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{song.title}</p>
                <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
              </div>
              <span className="text-neutral-500 text-sm">{formatTime(song.duration)}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => onToggleLike(song.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all">
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <button onClick={() => onOpenAddToPlaylist(song)} className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

