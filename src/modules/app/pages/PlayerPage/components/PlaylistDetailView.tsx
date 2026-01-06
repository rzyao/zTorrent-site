import { X, ListMusic, Play, Trash2 } from 'lucide-react';
import type { Playlist } from '@/modules/app/pages/PlayerPage/types';
import { formatTime } from '@/modules/app/pages/PlayerPage/utils';

/**
 * PlaylistDetailView
 * 纯展示：单个歌单详情页（带歌曲列表）
 * 通过 props 接收歌单数据与交互回调，不包含业务逻辑
 */
export interface PlaylistDetailViewProps {
  playlist: Playlist;
  onBack: () => void;
  onSelectSong: (songId: string) => void;
  onRemove: (songId: string) => void;
}

export function PlaylistDetailView(props: PlaylistDetailViewProps) {
  const { onBack, onRemove, onSelectSong, playlist } = props;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <img src={playlist.cover} alt={playlist.title} className="w-20 h-20 rounded-xl object-cover" />
          <div>
            <h2 className="text-white text-2xl mb-1">{playlist.title}</h2>
            <p className="text-neutral-400 text-sm mb-1">{playlist.description}</p>
            <p className="text-neutral-500 text-xs">{playlist.creator} · {playlist.songs.length} 首歌曲</p>
          </div>
        </div>
      </div>
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
        {playlist.songs.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>歌单还没有歌曲</p>
            <p className="text-sm mt-1">点击歌曲的"+"按钮添加到歌单</p>
          </div>
        ) : (
          playlist.songs.map((song, index) => (
            <div key={song.id} className="flex items-center gap-3 p-4 hover:bg-neutral-800/50 transition-all border-b border-neutral-700/30 last:border-0">
              <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
              <button onClick={() => onSelectSong(song.id)} className="relative shrink-0 group">
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
              {playlist.isOwn && (
                <button onClick={() => onRemove(song.id)} className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/20 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

