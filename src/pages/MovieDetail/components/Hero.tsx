import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Star, Calendar, Clock, Film as FilmIcon, Bookmark, Heart, Share2 } from "lucide-react";
import type { FilmDetail } from "../types";

/**
 * Hero 组件
 * - 承载页面顶部的海报、标题、基础信息与操作按钮
 * - 纯展示组件：只接收数据与事件回调，通过 props 驱动
 */
export function Hero({
  detail,
  isBookmarked,
  hasThanked,
  onToggleBookmark,
  onToggleThanked,
}: {
  detail: FilmDetail;
  isBookmarked: boolean;
  hasThanked: boolean;
  onToggleBookmark: () => void;
  onToggleThanked: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-8 pt-12 pb-4 md:flex-row">
      {/* 海报 */}
      <div className="shrink-0">
        <div className="w-48 overflow-hidden rounded-lg border-2 border-gray-700 shadow-2xl md:w-64">
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
          <p className="text-lg text-gray-300 md:text-xl">{detail.subtitle}</p>
        </div>

        {/* 标签与评分 */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-gray-800 text-white">{detail.category}</Badge>
          {detail.isFree && <Badge className="bg-green-500 text-white">FREE</Badge>}
          {detail.isHot && <Badge className="bg-red-500 text-white">HOT</Badge>}
          {detail.isVip && <Badge className="bg-yellow-500 text-white">VIP</Badge>}
          <div className="flex items-center gap-2 rounded-full bg-gray-900/80 px-3 py-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400">{detail.rating}</span>
            <span className="text-sm text-gray-400">({detail.ratingCount}人评分)</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-900/80 px-3 py-1">
            <span className="text-sm text-gray-400">IMDb:</span>
            <span className="text-[#00A8E1]">{detail.imdb}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-900/80 px-3 py-1">
            <span className="text-sm text-gray-400">豆瓣:</span>
            <span className="text-[#00A8E1]">{detail.douban}</span>
          </div>
        </div>

        {/* 基本信息：年份/时长/子分类 */}
        <div className="flex flex-wrap items-center gap-6 text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{detail.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{detail.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FilmIcon className="h-4 w-4 text-gray-400" />
            <span>{detail.subCategory}</span>
          </div>
        </div>

        {/* 简介 */}
        <p className="max-w-3xl text-base leading-relaxed text-gray-300">{detail.description}</p>

        {/* 导演/主演 */}
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="min-w-16 text-gray-400">导演:</span>
            <span className="text-[#00A8E1]">{detail.director}</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-16 text-gray-400">主演:</span>
            <span className="text-gray-300">
              {Array.isArray(detail.cast) ? detail.cast.join(" / ") : String(detail.cast ?? "")}
            </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onToggleBookmark}
            className={`border-gray-700 px-6 py-6 ${
              isBookmarked
                ? "border-[#00A8E1] bg-[#00A8E1] text-white"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <Bookmark className={`mr-2 h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
            收藏
          </Button>
          <Button
            variant="outline"
            onClick={onToggleThanked}
            className={`border-gray-700 px-6 py-6 ${
              hasThanked
                ? "border-red-500 bg-red-500 text-white"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <Heart className={`mr-2 h-5 w-5 ${hasThanked ? "fill-current" : ""}`} />
            感谢
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 bg-gray-900 px-6 py-6 text-white hover:bg-gray-800"
          >
            <Share2 className="mr-2 h-5 w-5" />
            分享
          </Button>
        </div>
      </div>
    </div>
  );
}
