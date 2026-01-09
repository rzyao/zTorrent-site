import { Badge } from "@/modules/app/components/ui/badge";
import { Button } from "@/modules/app/components/ui/button";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { Star, Calendar, Clock, Film as FilmIcon, Bookmark, Heart, Share2 } from "lucide-react";
import type { FilmDetail } from "../types";
import { useFavorite } from "@/modules/app/hooks/useFavorite";
import { FavoriteActionDto } from "@/api";

/**
 * Hero 组件
 * - 承载页面顶部的海报、标题、基础信息与操作按钮
 * - 纯展示组件：只接收数据与事件回调，通过 props 驱动
 */

export function Hero({
  detail,
  hasThanked,
  onToggleThanked,
}: {
  detail: FilmDetail;
  hasThanked: boolean;
  onToggleThanked: () => void;
}) {
  const { isFavorite, toggle, isLoading } = useFavorite({
    targetType: FavoriteActionDto.targetType.MOVIE,
    targetId: detail.id,
  });

  return (
    <div className="flex w-full flex-col gap-8 pt-12 pb-4 md:flex-row">
      {/* 海报 */}
      <div className="shrink-0">
        <div className="w-48 overflow-hidden rounded-lg border-2 border-neutral-700/50 shadow-2xl md:w-64">
          <ImageWithFallback
            src={detail.poster}
            alt={detail.title}
            className="h-auto w-full"
            width={256}
            height={384}
          />
        </div>
      </div>

      {/* 信息 */}
      <div className="flex-1 space-y-4">
        {/* 标题与原名 */}
        <div>
          <h1 className="mb-2 text-4xl text-white md:text-5xl">{detail.title}</h1>
          <p className="text-lg text-neutral-300 md:text-xl">{detail.subtitle}</p>
        </div>

        {/* 标签与评分 */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-neutral-800 text-white">{detail.category}</Badge>
          {detail.isFree && <Badge className="bg-green-500 text-white">FREE</Badge>}
          {detail.isHot && <Badge className="bg-red-500 text-white">HOT</Badge>}
          {detail.isVip && <Badge className="bg-yellow-500 text-white">VIP</Badge>}
          <div className="flex items-center gap-2 rounded-full bg-neutral-900/80 px-3 py-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-amber-400">{detail.rating}</span>
            <span className="text-sm text-neutral-400">({detail.ratingCount}人评分)</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-neutral-900/80 px-3 py-1">
            <span className="text-sm text-neutral-400">IMDb:</span>
            <span className="text-amber-400">{detail.imdb}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-neutral-900/80 px-3 py-1">
            <span className="text-sm text-neutral-400">豆瓣:</span>
            <span className="text-amber-400">{detail.douban}</span>
          </div>
        </div>

        {/* 基本信息：年份/时长/子分类 */}
        <div className="flex flex-wrap items-center gap-6 text-neutral-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <span>{detail.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-neutral-400" />
            <span>{detail.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FilmIcon className="h-4 w-4 text-neutral-400" />
            <span>{detail.subCategory}</span>
          </div>
        </div>

        {/* 简介 */}
        <p className="max-w-3xl text-base leading-relaxed text-neutral-300">{detail.description}</p>

        {/* 导演/主演 */}
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="min-w-16 text-neutral-400">导演:</span>
            <span className="text-amber-400">{detail.director}</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-16 text-neutral-400">主演:</span>
            <span className="text-neutral-300">
              {Array.isArray(detail.cast) ? detail.cast.join(" / ") : String(detail.cast ?? "")}
            </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3 pt-4">
          {/* 收藏按钮 - 琥珀色 */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle();
            }}
            disabled={isLoading}
            className={`h-auto border px-4 py-2 transition-all duration-300 ${
              isFavorite
                ? "border-amber-500 bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                : "border-neutral-700/50 bg-neutral-900/50 text-gray-300 hover:border-amber-500/50 hover:bg-neutral-800/70 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
            }`}
          >
            <Bookmark className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "已收藏" : "收藏"}
          </Button>

          {/* 感谢按钮 - 红/橙色 */}
          <Button
            onClick={onToggleThanked}
            className={`h-auto border px-4 py-2 transition-all duration-300 ${
              hasThanked
                ? "border-red-500 bg-linear-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30"
                : "border-neutral-700/50 bg-neutral-900/50 text-gray-300 hover:border-red-500/50 hover:bg-neutral-800/70 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20"
            }`}
          >
            <Heart className={`mr-2 h-4 w-4 ${hasThanked ? "fill-current" : ""}`} />
            感谢
          </Button>

          {/* 分享按钮 - Ghost 蓝色 */}
          <Button className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-800/70 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20">
            <Share2 className="mr-2 h-4 w-4" />
            分享
          </Button>
        </div>
      </div>
    </div>
  );
}
