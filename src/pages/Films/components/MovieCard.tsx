import {
  Play,
  Star,
  BookmarkPlus,
  Users,
  Clock,
  Eye,
  Film,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import type { FilmCardData } from "../types";

interface MovieCardProps {
  movie: FilmCardData;
  onClick: (movie: FilmCardData) => void;
  onToggleCollect: (id: string) => void;
}

/**
 * MovieCard
 * 纯展示组件，负责渲染单个影片卡片
 */
export function MovieCard({ movie, onClick, onToggleCollect }: MovieCardProps) {
  return (
    <div
      className="group bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
      onClick={() => onClick(movie)}
    >
      {/* 海报区域 */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <ImageWithFallback
          src={
            (movie as any).posterUrl ||
            movie.poster ||
            "https://via.placeholder.com/300x450?text=No+Poster"
          }
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* 悬浮播放按钮 */}
        {/*         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-amber-500/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
          </div>
        </div> */}

        {/* 评分与年份标签 */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
          <span className="text-white text-sm">{movie.rating}</span>
        </div>
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
          <span className="text-white text-sm">{movie.year}</span>
        </div>

        {/* 收藏按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollect(movie.id);
          }}
          className={`absolute bottom-3 right-3 w-10 h-10 md:w-8 md:h-8 rounded-lg backdrop-blur-sm flex items-center justify-center transition-all ${
            movie.isCollected
              ? "bg-amber-500/80 text-white"
              : "bg-black/60 text-neutral-400 hover:bg-black/80 hover:text-white"
          }`}
        >
          <BookmarkPlus
            className={`w-5 h-5 md:w-4 md:h-4 ${
              movie.isCollected ? "fill-current" : ""
            }`}
          />
        </button>

        {/* 底部标题 */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-neutral-400 text-xs line-clamp-1">
            {movie.originalTitle}
          </p>
        </div>
      </div>

      {/* 详细信息（卡片下半部分） */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        {/* 导演 */}
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <Users className="w-3 md:w-3.5 h-3 md:h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-neutral-400 truncate">{movie.director}</span>
        </div>

        {/* 时长与国家 */}
        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
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
              className="px-1.5 md:px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] md:text-xs border border-amber-500/20"
            >
              {g}
            </span>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-neutral-800 text-[10px] md:text-xs">
          <div className="flex items-center gap-1 text-neutral-500">
            <Film className="w-2.5 h-2.5 md:w-3 md:h-3" />
            <span>{movie.torrentsCount} 种子</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500">
            <Eye className="w-2.5 h-2.5 md:w-3 md:h-3" />
            <span>{Number((movie.viewsCount || 0) / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </div>
  );
}
