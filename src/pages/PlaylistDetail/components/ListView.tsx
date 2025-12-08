import { Calendar, Clock, Film, Star } from 'lucide-react';
import type { PlaylistFilm } from '../types';

interface ListViewProps {
  movies: PlaylistFilm[];
  onOpenFilm: (id: string) => void;
}

// 列表视图：以信息为主的行式列表
// 拆分原因：
// - 将列表行的结构与样式集中管理，便于维护
export function ListView({ movies, onOpenFilm }: ListViewProps) {
  if (movies.length === 0) {
    return <div className="text-gray-400">暂无影片</div>;
  }
  return (
    <div className="space-y-3">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          onClick={() => onOpenFilm(movie.id)}
          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* 序号 */}
            <div className="text-2xl text-gray-600 w-8 text-center flex-shrink-0">
              {index + 1}
            </div>

            {/* 海报 */}
            <div className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            {/* 信息 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-lg mb-1">{movie.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{movie.originalTitle}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{movie.duration}分钟</span>
                </div>
                <div className="flex items-center gap-1">
                  <Film className="w-3 h-3" />
                  <span>{movie.torrentsCount} 个种子</span>
                </div>
                <span>{movie.director}</span>
              </div>
            </div>

            {/* 类型标签 */}
            <div className="flex gap-2 flex-shrink-0">
              {movie.genre.slice(0, 2).map((g, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* 评分 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span className="text-white text-xl">{movie.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

