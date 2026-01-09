import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { Button } from "@/modules/app/components/ui/button";
import { Badge } from "@/modules/app/components/ui/badge";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import {
  ArrowLeft,
  Play,
  Star,
  Calendar,
  ExternalLink,
  Tv,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { SeriesDetail, EpisodeItem } from "../types";

interface HeroProps {
  series: SeriesDetail;
  firstEpisode?: EpisodeItem;
}

/**
 * 剧集详情页 Hero 组件
 * - 展示剧集海报、标题、评分、导演演员
 * - 纯展示组件，逻辑通过 props 驱动
 */
export function Hero({ series, firstEpisode }: HeroProps) {
  const navigate = useNavigate();
  const posterUrl = series.posterUrl || "https://via.placeholder.com/300x450";

  // 判断是否有外部评分
  const hasDouban = series.doubanRatingAverage !== undefined || series.doubanLink;
  const hasImdb = series.imdbRatingAverage !== undefined || series.imdbLink;

  return (
    <div className="relative pt-6">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/series")}
          className="gap-2 text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回剧集列表
        </Button>
      </div>

      {/* 主要内容区 */}
      <div className="flex flex-col gap-8 md:flex-row">
        {/* 海报区 */}
        <div className="shrink-0">
          <div className="group relative w-52 overflow-hidden rounded-xl border-2 border-neutral-700/50 shadow-2xl transition-all duration-500 hover:border-amber-500/50 hover:shadow-amber-500/20 md:w-64">
            <ImageWithFallback
              src={posterUrl}
              alt={series.title}
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              width={256}
              height={384}
            />
            {/* 海报悬浮遮罩 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                onClick={() => firstEpisode && navigate(`/episodes/${firstEpisode.id}`)}
                disabled={!firstEpisode}
                className="h-14 w-14 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
              >
                <Play className="h-6 w-6 fill-white text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* 信息区 */}
        <div className="flex-1 space-y-5">
          {/* 标题区域 */}
          <div>
            <h1 className="mb-2 font-serif text-3xl font-bold tracking-wide text-white md:text-4xl lg:text-5xl">
              {series.title}
            </h1>
            {series.originalTitle && (
              <p className="mb-4 font-sans text-base tracking-wide text-neutral-400 md:text-lg">
                {series.originalTitle}
              </p>
            )}
          </div>
          <div className="mb-5 flex items-end gap-2">
            {/* 外部评分 */}
            {(hasDouban || hasImdb) && (
              <div className="flex shrink-0 items-center gap-5">
                {/* 豆瓣评分 */}
                {hasDouban && (
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                      <span className="text-sm font-bold text-green-400">豆</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500">豆瓣</div>
                      {series.doubanRatingAverage !== undefined ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-base font-bold text-white">
                            {Number(series.doubanRatingAverage).toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-500">暂无</span>
                      )}
                    </div>
                    {series.doubanLink && (
                      <a
                        href={series.doubanLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 transition-colors hover:text-amber-400"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* 分隔线 */}
                {hasDouban && hasImdb && <div className="h-8 w-px bg-neutral-700/50" />}

                {/* IMDb 评分 */}
                {hasImdb && (
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                      <span className="text-[10px] font-bold text-yellow-400">IMDb</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500">IMDb</div>
                      {series.imdbRatingAverage !== undefined ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-base font-bold text-white">
                            {Number(series.imdbRatingAverage).toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-500">暂无</span>
                      )}
                    </div>
                    {series.imdbLink && (
                      <a
                        href={series.imdbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 transition-colors hover:text-amber-400"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* 分隔线 */}
                <div className="hidden h-8 w-px bg-neutral-700/50 lg:block" />
              </div>
            )}
          </div>
          {/* 标签组 */}
          <div className="flex flex-wrap items-center gap-4">
            {series.year && (
              <Badge className="border-amber-500/40 bg-amber-500/20 px-3 py-1 font-semibold text-amber-400">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                {series.year}
              </Badge>
            )}
            {series.status && (
              <Badge
                className={cn(
                  "px-3 py-1",
                  series.status === "ended" || series.status === "完结"
                    ? "border-green-500/40 bg-green-500/20 text-green-400"
                    : series.status === "airing" || series.status === "连载中"
                      ? "border-blue-500/40 bg-blue-500/20 text-blue-400"
                      : "border-amber-500/40 bg-amber-500/20 text-amber-400",
                )}
              >
                {series.status === "ended" || series.status === "完结"
                  ? "已完结"
                  : series.status === "airing" || series.status === "连载中"
                    ? "连载中"
                    : series.status === "upcoming"
                      ? "即将上映"
                      : series.status}
              </Badge>
            )}
            {series.categories?.map((cat, idx) => (
              <Badge
                key={idx}
                className="border-purple-500/30 bg-purple-500/20 px-3 py-1 text-purple-400"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* 类型标签 */}
          {series.genres && series.genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {series.genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-neutral-600/50 bg-neutral-800/50 px-3 py-1 text-sm text-neutral-300 transition-colors hover:border-amber-500/30 hover:text-amber-400"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* 导演和演员信息 */}
          <div className="space-y-2 text-sm">
            {series.director && (
              <div className="flex items-start gap-3">
                <span className="min-w-[50px] font-medium text-neutral-500">导演</span>
                <span className="text-amber-400">{series.director}</span>
              </div>
            )}
            {series.cast && series.cast.length > 0 && (
              <div className="flex items-start gap-3">
                <span className="min-w-[50px] font-medium text-neutral-500">主演</span>
                <span className="line-clamp-2 text-neutral-300">
                  {series.cast.slice(0, 8).join(" / ")}
                </span>
              </div>
            )}
          </div>

          {/* 剧情简介 */}
          {series.description && <InlineSynopsis description={series.description} />}
        </div>
      </div>
    </div>
  );
}

/**
 * 嵌入式剧情简介组件
 * - 移除卡片外壳，作为 Hero 信息流的一部分
 * - 采用微妙的垂直边框标识
 * - 交互更自然
 */
function InlineSynopsis({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = description.length > 200;

  return (
    <div className="max-w-3xl space-y-2.5">
      {/* 标签 - 置于左上方 */}
      <div className="flex items-center gap-2">
        <div className="h-1 w-4 rounded-full bg-amber-500/50" />
        <span className="text-[14px] font-bold tracking-widest text-neutral-300 uppercase">
          剧集简介
        </span>
      </div>

      <div className="relative">
        {/* 侧边装饰线 */}
        <div className="absolute top-1 left-0 h-[calc(100%-8px)] w-0.5 rounded-full bg-neutral-800" />

        <div className="pl-4">
          <p
            className={cn(
              "text-sm leading-relaxed text-neutral-400/90 transition-all duration-500",
              !isExpanded && isLongText && "line-clamp-3",
            )}
          >
            {description}
          </p>

          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-amber-500/80 transition-all hover:text-amber-400"
            >
              {isExpanded ? (
                <>
                  <span>收起详情</span>
                  <ChevronUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
                </>
              ) : (
                <>
                  <span>阅读完整简介</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
