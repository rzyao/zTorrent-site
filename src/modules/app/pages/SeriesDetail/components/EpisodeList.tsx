import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { Tv, Calendar, Clock, Star, Play, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import type { EpisodeItem } from "../types";

interface EpisodeListProps {
  episodes: EpisodeItem[];
  seriesTitle: string;
}

/**
 * 分集列表组件
 * - Netflix 风格的水平滚动分集卡片
 * - 支持剧照预览、评分显示
 */
export function EpisodeList({ episodes, seriesTitle }: EpisodeListProps) {
  const navigate = useNavigate();

  if (episodes.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Tv className="h-6 w-6 text-amber-500" />
          <h2 className="text-xl font-bold text-white">分集列表</h2>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700/50 bg-neutral-900/30 py-12">
          <Tv className="mb-3 h-12 w-12 text-neutral-600" />
          <p className="text-base text-neutral-500">暂无分集信息</p>
          <p className="mt-1 text-sm text-neutral-600">请稍后再来查看</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tv className="h-6 w-6 text-amber-500" />
          <h2 className="text-xl font-bold text-white">分集列表</h2>
          <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-sm text-neutral-400">
            共 {episodes.length} 集
          </span>
        </div>
      </div>

      {/* 分集网格 */}
      {/* 分集列表 */}
      <div className="flex flex-col gap-4">
        {episodes.map((episode, index) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            index={index}
            onClick={() => navigate(`/app/episodes/${episode.id}`)}
          />
        ))}
      </div>
    </section>
  );
}

interface EpisodeCardProps {
  episode: EpisodeItem;
  index: number;
  onClick: () => void;
}

function EpisodeCard({ episode, index, onClick }: EpisodeCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "app-card app-card-hover group cursor-pointer overflow-hidden rounded-xl transition-all duration-300",
        "flex flex-col sm:flex-row",
      )}
    >
      {/* 剧照区域 */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-32 sm:w-56">
        {episode.stillUrl ? (
          <ImageWithFallback
            src={episode.stillUrl}
            alt={episode.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800">
            <Tv className="h-10 w-10 text-neutral-600" />
          </div>
        )}
        {/* 集号徽章 */}
        <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/90 text-sm font-bold text-white backdrop-blur-sm">
          {episode.episodeNumber}
        </div>
        {/* 播放悬浮层 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/20 backdrop-blur-sm">
            <Play className="h-5 w-5 fill-white text-white" />
          </div>
        </div>
      </div>

      {/* 信息区域 */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* 标题 */}
          <h3 className="mb-1 line-clamp-1 text-base font-semibold text-white transition-colors group-hover:text-amber-400">
            第 {episode.episodeNumber} 集：{episode.title}
          </h3>
          {episode.originalTitle && (
            <p className="mb-2 line-clamp-1 text-xs text-neutral-500">{episode.originalTitle}</p>
          )}
          {/* 简介 */}
          {episode.overview && (
            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-400">
              {episode.overview}
            </p>
          )}
        </div>

        {/* 底部元信息 */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
          {episode.airDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{episode.airDate}</span>
            </div>
          )}
          {episode.runtime && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{episode.runtime} 分钟</span>
            </div>
          )}
          {episode.voteAverage !== undefined && episode.voteAverage > 0 && (
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-amber-400">{episode.voteAverage.toFixed(1)}</span>
            </div>
          )}
          {/* 箭头指示 */}
          <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
            <ChevronRight className="h-5 w-5 text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
