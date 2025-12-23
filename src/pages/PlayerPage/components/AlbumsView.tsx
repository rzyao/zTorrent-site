import { Disc, Play } from 'lucide-react';
import type { Album } from '@/pages/PlayerPage/types';

/**
 * AlbumsView
 * 纯展示：专辑网格卡片
 * 通过 props 接收专辑列表，无业务逻辑
 */
export interface AlbumsViewProps {
  albums: Album[];
}

export function AlbumsView(props: AlbumsViewProps) {
  const { albums } = props;
  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl flex items-center gap-2">
        <Disc className="w-5 h-5 text-blue-400" />
        我的收藏
        <span className="text-neutral-500 text-sm">({albums.length})</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            </div>
            <h3 className="text-white truncate">{album.title}</h3>
            <p className="text-neutral-400 text-sm truncate">{album.artist}</p>
            <div className="flex items-center justify-between mt-2 text-neutral-500 text-xs">
              <span>{album.year}</span>
              <span>{album.tracks.length} 首</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

