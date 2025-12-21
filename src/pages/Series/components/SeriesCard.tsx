import { Star, BookmarkPlus, Tv, Eye, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import type { SeriesCardData, SeriesStatus } from "../types";

interface SeriesCardProps {
  series: SeriesCardData;
  onClick: (series: SeriesCardData) => void;
  onToggleCollect?: (id: string) => void;
}

// 状态标签样式映射
const statusStyles: Record<
  SeriesStatus,
  { bg: string; text: string; label: string }
> = {
  airing: { bg: "bg-green-500/20", text: "text-green-400", label: "连载中" },
  ended: { bg: "bg-neutral-500/20", text: "text-neutral-400", label: "已完结" },
  upcoming: { bg: "bg-blue-500/20", text: "text-blue-400", label: "待播出" },
};

/**
 * SeriesCard
 * 纯展示组件，负责渲染单个剧集卡片
 * 与 MovieCard 的区别：显示季数、集数、播出状态
 */
export function SeriesCard({
  series,
  onClick,
  onToggleCollect,
}: SeriesCardProps) {
  const statusConfig = series.status ? statusStyles[series.status] : null;

  return (
    <div
      className="group bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
      onClick={() => onClick(series)}
    >
      {/* 海报区域 */}
      <div className="relative aspect-2/3 overflow-hidden">
        <ImageWithFallback
          src={
            series.posterUrl ||
            series.poster ||
            "https://via.placeholder.com/300x450?text=No+Poster"
          }
          alt={series.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

        {/* 评分标签 */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-purple-400" fill="currentColor" />
          <span className="text-white text-sm">{series.rating}</span>
        </div>

        {/* 年份标签 */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
          <span className="text-white text-sm">{series.year}</span>
        </div>

        {/* 收藏按钮 */}
        {onToggleCollect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollect(series.id);
            }}
            className={`absolute bottom-3 right-3 w-10 h-10 md:w-8 md:h-8 rounded-lg backdrop-blur-sm flex items-center justify-center transition-all ${
              series.isCollected
                ? "bg-purple-500/80 text-white"
                : "bg-black/60 text-neutral-400 hover:bg-black/80 hover:text-white"
            }`}
          >
            <BookmarkPlus
              className={`w-5 h-5 md:w-4 md:h-4 ${
                series.isCollected ? "fill-current" : ""
              }`}
            />
          </button>
        )}

        {/* 底部标题 */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {series.title}
          </h3>
          {series.originalTitle && (
            <p className="text-neutral-400 text-xs line-clamp-1">
              {series.originalTitle}
            </p>
          )}
        </div>
      </div>

      {/* 详细信息 */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        {/* 季数与集数 */}
        <div className="flex items-center gap-3 text-xs md:text-sm">
          {series.seasonNumber && (
            <div className="flex items-center gap-1 text-purple-400">
              <Tv className="w-3.5 h-3.5" />
              <span>第{series.seasonNumber}季</span>
            </div>
          )}
          {series.episodeCount && (
            <div className="flex items-center gap-1 text-neutral-400">
              <Play className="w-3.5 h-3.5" />
              <span>共{series.episodeCount}集</span>
            </div>
          )}
        </div>

        {/* 播出状态标签 */}
        {statusConfig && (
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] md:text-xs ${statusConfig.bg} ${statusConfig.text} border border-current/20`}
            >
              {statusConfig.label}
            </span>
          </div>
        )}

        {/* 类型标签 */}
        <div className="flex flex-wrap gap-1 md:gap-1.5">
          {(series.genre || []).slice(0, 3).map((g, index) => (
            <span
              key={index}
              className="px-1.5 md:px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] md:text-xs border border-purple-500/20"
            >
              {g}
            </span>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-neutral-800 text-[10px] md:text-xs">
          <div className="flex items-center gap-1 text-neutral-500">
            <Tv className="w-2.5 h-2.5 md:w-3 md:h-3" />
            <span>{series.torrentsCount ?? 0} 种子</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500">
            <Eye className="w-2.5 h-2.5 md:w-3 md:h-3" />
            <span>{Number((series.viewsCount || 0) / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </div>
  );
}
