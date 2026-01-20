import { Calendar, Clock, Film, Star } from "lucide-react";
import type { PlaylistFilm } from "../types";
import { CoverImage } from "@/modules/app/components/media/CoverImage";

interface ListViewProps {
  movies: PlaylistFilm[];
  onOpenFilm: (id: string) => void;
}

// 列表视图：以信息为主的行式列表
// 拆分原因：
// - 将列表行的结构与样式集中管理，便于维护
export function ListView({ movies, onOpenFilm }: ListViewProps) {
  if (movies.length === 0) {
    return <div className="text-neutral-400">暂无影片</div>;
  }
  return (
    <div className="space-y-3">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          onClick={() => onOpenFilm(movie.id)}
          className="app-card app-card-hover text-parent flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all duration-300"
        >
          {/* 序号 */}
          <div className="w-8 shrink-0 text-center text-2xl text-neutral-600">{index + 1}</div>

          {/* 海报 */}
          <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-800/40">
            <CoverImage
              attachableType={movie.itemType === "series" ? "series" : "movie"}
              attachableId={String(movie.id)}
              size="thumb"
            />
            <div className="absolute top-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
              {movie.itemType === "series" ? "剧集" : "电影"}
            </div>
          </div>

          {/* 信息 */}
          <div className="min-w-0 flex-1">
            <h3 className="text mb-1 text-lg font-medium">{movie.title}</h3>
            <p className="mb-2 text-sm text-neutral-400">{movie.originalTitle}</p>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{movie.year}</span>
              </div>
              {movie.itemType === "series" && movie.episodeCount ? (
                <div className="flex items-center gap-1">
                  <Film className="h-3 w-3" />
                  <span>全{movie.episodeCount}集</span>
                </div>
              ) : null}
              {movie.duration > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{movie.duration}分钟</span>
                </div>
              )}
              {movie.torrentsCount > 0 && (
                <div className="flex items-center gap-1">
                  <Film className="h-3 w-3" />
                  <span>{movie.torrentsCount} 个种子</span>
                </div>
              )}
              {movie.director && <span>{movie.director}</span>}
            </div>
          </div>

          {/* 类型标签 */}
          <div className="flex shrink-0 gap-2">
            {movie.genre.slice(0, 2).map((g, i) => (
              <span
                key={i}
                className="rounded-full border border-amber-500/30 bg-linear-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 text-sm text-amber-400"
              >
                {g}
              </span>
            ))}
          </div>

          {/* 评分 */}
          <div className="flex shrink-0 items-center gap-2">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            <span className="text-xl text-white">{movie.rating}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
