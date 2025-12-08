import { Star, Play, Film } from 'lucide-react';
import type { PlaylistFilm } from '../types';

interface GridViewProps {
  movies: PlaylistFilm[];
  onOpenFilm: (id: string) => void;
}

// 网格视图：海报为主的卡片阵列
// 拆分原因：
// - 将展示层与数据/行为分离，卡片点击通过回调传递，保持组件纯净
export function GridView({ movies, onOpenFilm }: GridViewProps) {
  if (movies.length === 0) {
    return <div className="text-gray-400">暂无影片</div>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          onClick={() => onOpenFilm(movie.id)}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* 评分 */}
            <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-white text-sm">{movie.rating}</span>
            </div>

            {/* 悬浮操作 */}
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                <span>查看详情</span>
              </button>
            </div>
          </div>

          <h3 className="text-white mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{movie.year}</span>
            <span>·</span>
            <span>{movie.duration}分钟</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <Film className="w-3 h-3" />
            <span>{movie.torrentsCount} 个种子</span>
          </div>
        </div>
      ))}
    </div>
  );
}

