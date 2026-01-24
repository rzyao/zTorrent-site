import { Star, BookmarkPlus, Users, Clock, Eye, Film } from "lucide-react";
import { CoverImage } from "@/modules/app/components/media/CoverImage";
import type { MovieCardData } from "../types";

interface MovieCardProps {
  movie: MovieCardData;
  onClick: (movie: MovieCardData) => void;
  onToggleCollect?: (id: string) => void;
}

/**
 * MovieCard
 * 纯展示组件，负责渲染单个电影卡片
 */
export function MovieCard({ movie, onClick, onToggleCollect }: MovieCardProps) {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
      onClick={() => onClick(movie)}
    >
      {/* 海报区域 */}
      <div className="relative aspect-2/3 overflow-hidden">
        <CoverImage
          attachableType="movie"
          attachableId={String(movie.id)}
          size="medium"
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

        {/* 评分与年份标签 */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-black/70 px-2.5 py-1 backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
          <span className="text-sm text-white">{movie.rating}</span>
        </div>
        <div className="absolute top-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 backdrop-blur-sm">
          <span className="text-sm text-white">{movie.year}</span>
        </div>

        {/* 收藏按钮 */}
        {onToggleCollect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollect(movie.id);
            }}
            className={`absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-sm transition-all md:h-8 md:w-8 ${
              movie.isCollected
                ? "bg-amber-500/80 text-white"
                : "bg-black/60 text-neutral-400 hover:bg-black/80 hover:text-white"
            }`}
          >
            <BookmarkPlus
              className={`h-5 w-5 md:h-4 md:w-4 ${movie.isCollected ? "fill-current" : ""}`}
            />
          </button>
        )}

        {/* 底部标题 */}
        <div className="absolute right-0 bottom-0 left-0 p-3">
          <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
            {movie.title}
          </h3>
          <p className="line-clamp-1 text-xs text-neutral-400">{movie.originalTitle}</p>
        </div>
      </div>

      {/* 详细信息（卡片下半部分） */}
      <div className="space-y-2 p-3 md:space-y-3 md:p-4">
        {/* 导演 */}
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <Users className="h-3 w-3 shrink-0 text-amber-400 md:h-3.5 md:w-3.5" />
          <span className="truncate text-neutral-400">{movie.director}</span>
        </div>

        {/* 时长与国家 */}
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 md:gap-3 md:text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{movie.duration}分钟</span>
          </div>
          <span>•</span>
          <span>{movie.country}</span>
        </div>

        {/* 类型标签 */}
        <div className="flex flex-wrap gap-1 md:gap-1.5">
          {(movie.genre || []).slice(0, 3).map((g, index) => (
            <span
              key={index}
              className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400 md:px-2 md:text-xs"
            >
              {g}
            </span>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-2 text-[10px] md:pt-3 md:text-xs">
          <div className="flex items-center gap-1 text-neutral-500">
            <Film className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{movie.torrentsCount} 种子</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500">
            <Eye className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{Number((movie.viewsCount || 0) / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </div>
  );
}
