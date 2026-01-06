import { Star, Play, Film } from "lucide-react";
import type { PlaylistFilm } from "../types";

interface GridViewProps {
  movies: PlaylistFilm[];
  onOpenFilm: (id: string) => void;
}

// 网格视图：海报为主的卡片阵列
// 拆分原因：
// - 将展示层与数据/行为分离，卡片点击通过回调传递，保持组件纯净
export function GridView({ movies, onOpenFilm }: GridViewProps) {
  if (movies.length === 0) {
    return <div className="text-neutral-400">暂无影片</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <div key={movie.id} onClick={() => onOpenFilm(movie.id)} className="group cursor-pointer">
          <div className="relative mb-3 aspect-2/3 overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40 transition-colors group-hover:border-amber-500/50">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* 评分 */}
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-sm text-white">{movie.rating}</span>
            </div>

            {/* 类型标签 */}
            <div className="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
              {movie.itemType === "series" ? "剧集" : "电影"}
            </div>

            {/* 悬浮操作 */}
            <div className="absolute right-0 bottom-0 left-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 py-2 text-white">
                <Play className="h-4 w-4" />
                <span>查看详情</span>
              </button>
            </div>
          </div>

          <h3 className="mb-0.5 line-clamp-1 text-white transition-colors group-hover:text-amber-400">
            {movie.title}
          </h3>
          <p className="mb-2 line-clamp-1 text-xs text-neutral-500">{movie.originalTitle}</p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400">
            <span>{movie.year}</span>
            {movie.itemType === "series" && movie.episodeCount ? (
              <>
                <span>·</span>
                <span>全{movie.episodeCount}集</span>
              </>
            ) : null}
            {movie.duration > 0 && (
              <>
                <span>·</span>
                <span>{movie.duration}分钟</span>
              </>
            )}
          </div>
          {movie.torrentsCount > 0 && (
            <div className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
              <Film className="h-3 w-3" />
              <span>{movie.torrentsCount} 个种子</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
