import { Star, BookmarkPlus, Tv, Eye, Play } from "lucide-react";
import { CoverImage } from "@/modules/app/components/media/CoverImage";
import { ToggleButton } from "@/modules/app/components/ui/ToggleButton";
import type { SeriesCardData, SeriesStatus } from "../types";

interface SeriesCardProps {
  series: SeriesCardData;
  onClick: (series: SeriesCardData) => void;
  onToggleCollect?: (id: string) => void;
}

// 状态标签样式映射
const statusStyles: Record<SeriesStatus, { bg: string; text: string; label: string }> = {
  airing: { bg: "bg-green-500/20", text: "text-green-400", label: "连载中" },
  ended: { bg: "bg-neutral-500/20", text: "text-neutral-400", label: "已完结" },
  upcoming: { bg: "bg-blue-500/20", text: "text-blue-400", label: "待播出" },
};

/**
 * SeriesCard
 * 纯展示组件，负责渲染单个剧集卡片
 * 与 MovieCard 的区别：显示季数、集数、播出状态
 */
export function SeriesCard({ series, onClick, onToggleCollect }: SeriesCardProps) {
  const statusConfig = series.status ? statusStyles[series.status] : null;

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
      onClick={() => onClick(series)}
    >
      {/* 海报区域 */}
      <div className="relative aspect-2/3 overflow-hidden">
        <CoverImage attachableType="series" attachableId={String(series.id)} size="medium" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

        {/* 评分标签 */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-black/70 px-2.5 py-1 backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 text-purple-400" fill="currentColor" />
          <span className="text-sm text-white">{series.rating}</span>
        </div>

        {/* 年份标签 */}
        <div className="absolute top-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 backdrop-blur-sm">
          <span className="text-sm text-white">{series.year}</span>
        </div>

        {/* 收藏按钮 */}
        {onToggleCollect && (
          <ToggleButton
            pressed={series.isCollected}
            onPressedChange={() => onToggleCollect(series.id)}
            activeIcon={<BookmarkPlus className="h-5 w-5 fill-current md:h-4 md:w-4" />}
            inactiveIcon={<BookmarkPlus className="h-5 w-5 md:h-4 md:w-4" />}
            className="absolute right-3 bottom-3"
            tooltip={series.isCollected ? "取消收藏" : "收藏"}
          />
        )}

        {/* 底部标题 */}
        <div className="absolute right-0 bottom-0 left-0 p-3">
          <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-purple-400">
            {series.title}
          </h3>
          {series.originalTitle && (
            <p className="line-clamp-1 text-xs text-neutral-400">{series.originalTitle}</p>
          )}
        </div>
      </div>

      {/* 详细信息 */}
      <div className="space-y-2 p-3 md:space-y-3 md:p-4">
        {/* 季数与集数 */}
        <div className="flex items-center gap-3 text-xs md:text-sm">
          {series.seasonNumber && (
            <div className="flex items-center gap-1 text-purple-400">
              <Tv className="h-3.5 w-3.5" />
              <span>第{series.seasonNumber}季</span>
            </div>
          )}
          {series.episodeCount && (
            <div className="flex items-center gap-1 text-neutral-400">
              <Play className="h-3.5 w-3.5" />
              <span>共{series.episodeCount}集</span>
            </div>
          )}
        </div>

        {/* 播出状态标签 */}
        {statusConfig && (
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] md:text-xs ${statusConfig.bg} ${statusConfig.text} border border-current/20`}
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
              className="rounded-md border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-400 md:px-2 md:text-xs"
            >
              {g}
            </span>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-2 text-[10px] md:pt-3 md:text-xs">
          <div className="flex items-center gap-1 text-neutral-500">
            <Tv className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{series.torrentsCount ?? 0} 种子</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500">
            <Eye className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{Number((series.viewsCount || 0) / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </div>
  );
}
