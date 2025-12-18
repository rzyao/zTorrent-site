import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Star,
  Calendar,
  Clock,
  Film as FilmIcon,
  Bookmark,
  Heart,
  Share2,
} from "lucide-react";
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
    <div className="relative h-auto pt-12">
      {/* 背景图层与渐变遮罩 */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={detail.backdrop}
          alt={detail.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-[#0F171E]/50 to-transparent" />
      </div>

      {/* 海报与信息区 */}
      <div className="relative h-full max-w-[1600px] mx-auto px-4 md:px-8 flex items-end pt-4">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* 海报 */}
          <div className="flex-shrink-0">
            <div className="w-48 md:w-64 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
              <ImageWithFallback
                src={detail.poster}
                alt={detail.title}
                className="w-full h-auto"
                width={256}
                height={384}
              />
            </div>
          </div>

          {/* 信息 */}
          <div className="flex-1 space-y-4">
            {/* 标题与原名 */}
            <div>
              <h1 className="text-white text-4xl md:text-5xl mb-2">
                {detail.title}
              </h1>
              <p className="text-gray-300 text-lg md:text-xl">
                {detail.subtitle}
              </p>
            </div>

            {/* 标签与评分 */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-gray-800 text-white">
                {detail.category}
              </Badge>
              {detail.isFree && (
                <Badge className="bg-green-500 text-white">FREE</Badge>
              )}
              {detail.isHot && (
                <Badge className="bg-red-500 text-white">HOT</Badge>
              )}
              {detail.isVip && (
                <Badge className="bg-yellow-500 text-white">VIP</Badge>
              )}
              <div className="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-400">{detail.rating}</span>
                <span className="text-gray-400 text-sm">
                  ({detail.ratingCount}人评分)
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-full">
                <span className="text-gray-400 text-sm">IMDb:</span>
                <span className="text-[#00A8E1]">{detail.imdb}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-full">
                <span className="text-gray-400 text-sm">豆瓣:</span>
                <span className="text-[#00A8E1]">{detail.douban}</span>
              </div>
            </div>

            {/* 基本信息：年份/时长/子分类 */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{detail.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{detail.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <FilmIcon className="w-4 h-4 text-gray-400" />
                <span>{detail.subCategory}</span>
              </div>
            </div>

            {/* 简介 */}
            <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
              {detail.description}
            </p>

            {/* 导演/主演 */}
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-400 min-w-16">导演:</span>
                <span className="text-[#00A8E1]">{detail.director}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 min-w-16">主演:</span>
                <span className="text-gray-300">
                  {Array.isArray(detail.cast)
                    ? detail.cast.join(" / ")
                    : String(detail.cast ?? "")}
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
                    ? "bg-[#00A8E1] border-[#00A8E1] text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 mr-2 ${
                    isBookmarked ? "fill-current" : ""
                  }`}
                />
                收藏
              </Button>
              <Button
                variant="outline"
                onClick={onToggleThanked}
                className={`border-gray-700 px-6 py-6 ${
                  hasThanked
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${hasThanked ? "fill-current" : ""}`}
                />
                感谢
              </Button>
              <Button
                variant="outline"
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 px-6 py-6"
              >
                <Share2 className="w-5 h-5 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
