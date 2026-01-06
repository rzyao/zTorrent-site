import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { formatDateTime } from "@/utils/format";
import {
  Calendar,
  Clock,
  Film as FilmIcon,
  Star,
  Award,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Heart,
  Eye,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TorrentTable } from "@/components/TorrentTable";

// 引用 MovieDetail types (若路径不同请调整)
import type { FilmDetail, CommentItem, TorrentItem, AwardItem } from "@/modules/app/pages/MovieDetail/types";

// ===================================
// Props Definition
// ===================================

export interface MovieDetailBodyProps {
  detail: FilmDetail;
  /** 控制标签页 */
  activeTab?: string;
  onActiveTabChange?: (val: string) => void;
  // 仅作轻量交互展示，不涉及实际业务逻辑回调（收藏/感谢等在审核页一般只需要看状态，不需要操作）
  // 但为了复用性，若需操作可预留 Optional Callback
}

// ===================================
// Sub Components (Hero, Stills, Tabs)
// ===================================

// 复用 Hero 逻辑，改为纯静态展示（移除 useFavorite）
function HeroSection({ detail }: { detail: FilmDetail }) {
  return (
    <div className="flex w-full flex-col gap-8 pb-4 md:flex-row">
      <div className="shrink-0">
        <div className="w-32 overflow-hidden rounded-lg border-2 border-neutral-700/50 shadow-2xl md:w-48">
          <ImageWithFallback
            src={detail.poster}
            alt={detail.title}
            className="h-auto w-full"
            width={192}
            height={288}
          />
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <div>
          <h1 className="mb-1 text-2xl text-white md:text-3xl">{detail.title}</h1>
          <p className="text-base text-neutral-300 md:text-lg">{detail.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-neutral-800 text-xs text-white">{detail.category}</Badge>
          {detail.isFree && <Badge className="bg-green-500 text-xs text-white">FREE</Badge>}
          {detail.isHot && <Badge className="bg-red-500 text-xs text-white">HOT</Badge>}
          {detail.isVip && <Badge className="bg-yellow-500 text-xs text-white">VIP</Badge>}
          <div className="flex items-center gap-2 rounded-full bg-neutral-900/80 px-2 py-0.5 text-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-amber-400">{detail.rating}</span>
            <span className="text-neutral-400">({detail.ratingCount}人)</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-neutral-900/80 px-2 py-0.5 text-xs">
            <span className="text-neutral-400">IMDb:</span>
            <span className="text-amber-400">{detail.imdb}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-neutral-400" />
            <span>{detail.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-neutral-400" />
            <span>{detail.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <FilmIcon className="h-3 w-3 text-neutral-400" />
            <span>{detail.subCategory}</span>
          </div>
        </div>

        <p className="line-clamp-3 max-w-3xl text-sm leading-relaxed text-neutral-300">
          {detail.description}
        </p>

        <div className="space-y-1 text-xs">
          <div className="flex gap-2">
            <span className="min-w-10 text-neutral-400">导演:</span>
            <span className="text-amber-400">{detail.director}</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-10 text-neutral-400">主演:</span>
            <span className="line-clamp-1 text-neutral-300">
              {Array.isArray(detail.cast) ? detail.cast.join(" / ") : String(detail.cast ?? "")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StillsSection({ stills }: { stills: string[] }) {
  if (!stills || stills.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg text-white">剧照</h2>
      <div className="rounded-lg bg-neutral-900/50 p-2">
        <Carousel className="w-full">
          <CarouselContent>
            {stills.map((screenshot, index) => (
              <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
                <div className="group relative aspect-video overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={screenshot}
                    alt={`剧照 ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 border-neutral-700/50 bg-neutral-900/80 text-white hover:bg-neutral-800" />
          <CarouselNext className="right-2 border-neutral-700/50 bg-neutral-900/80 text-white hover:bg-neutral-800" />
        </Carousel>
      </div>
    </div>
  );
}

function AwardsSection({ awards }: { awards: AwardItem[] }) {
  if (!awards || awards.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="mb-3 flex items-center gap-2 text-lg text-white">
        <Award className="h-4 w-4 text-amber-400" />
        获奖情况
      </h2>
      <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/50 p-4">
        <div className="space-y-3">
          {awards.map((award, index) => (
            <div
              key={index}
              className="flex items-start gap-3 border-b border-neutral-700/50 pb-3 last:border-0 last:pb-0"
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  award.won ? "bg-amber-500/20" : "bg-neutral-800"
                }`}
              >
                {award.won ? (
                  <Award className="h-3 w-3 text-amber-400" />
                ) : (
                  <Star className="h-3 w-3 text-neutral-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="text-sm text-white">{award.name}</h3>
                  <Badge
                    className={
                      award.won
                        ? "bg-amber-500 px-1 py-0 text-[10px] text-white"
                        : "bg-neutral-700 px-1 py-0 text-[10px] text-neutral-300"
                    }
                  >
                    {award.won ? "获奖" : "提名"}
                  </Badge>
                  <span className="text-xs text-neutral-500">{award.year}</span>
                </div>
                <p className="text-xs text-neutral-400">{award.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================================
// Main Component
// ===================================

export function MovieDetailBody({
  detail,
  activeTab = "torrents",
  onActiveTabChange,
}: MovieDetailBodyProps) {
  const [localTab, setLocalTab] = useState(activeTab);

  const handleTabChange = (val: string) => {
    setLocalTab(val);
    onActiveTabChange?.(val);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* 顶部 Hero */}
      <HeroSection detail={detail} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* 左侧主要内容 */}
        <div className="min-w-0">
          <StillsSection stills={detail.stills} />

          {/* Tabs 区域 */}
          <Tabs value={localTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full justify-start bg-neutral-900/50 p-1">
              <TabsTrigger
                value="torrents"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                种子列表
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                评论 ({Array.isArray(detail.comments) ? detail.comments.length : 0})
              </TabsTrigger>
            </TabsList>

            {/* 种子列表 */}
            <TabsContent
              value="torrents"
              className="mt-4 rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4"
            >
              <h3 className="mb-4 font-medium text-white">包含种子</h3>
              {Array.isArray(detail.torrents) && detail.torrents.length > 0 ? (
                // 强制转类型以适配 TorrentTable
                <TorrentTable torrents={detail.torrents as any} filmId={detail.id} />
              ) : (
                <div className="py-4 text-center text-sm text-neutral-500">暂无种子</div>
              )}
            </TabsContent>

            {/* 评论 */}
            <TabsContent value="comments" className="mt-4 space-y-4">
              {Array.isArray(detail.comments) && detail.comments.length > 0 ? (
                detail.comments.map((comment, idx) => (
                  <div
                    key={comment.id || idx}
                    className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 bg-neutral-700 text-xs">U</Avatar>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{comment.user.name}</span>
                          <Badge className="bg-amber-500 px-1 py-0 text-[10px] text-white">
                            {comment.user.level}
                          </Badge>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: comment.rating || 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="mb-2 text-xs text-neutral-300">{comment.content}</p>
                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                          <span>{formatDateTime(comment.date)}</span>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{comment.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-neutral-500">暂无评论</div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-6">
          <AwardsSection awards={detail.awards} />
        </div>
      </div>
    </div>
  );
}
