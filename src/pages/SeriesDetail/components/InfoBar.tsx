import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FavoriteActionDto } from "@/api";
import { useFavorite } from "@/hooks/useFavorite";
import { Film, Bell, UserPlus, Heart, Share2, Tv, Clock } from "lucide-react";
import ActionBtn from "@/components/ActionBtn";
import { cn } from "@/components/ui/utils";
import type { EpisodeItem, SeriesDetail } from "../types";

interface InfoBarProps {
  series: SeriesDetail;
  episodes: EpisodeItem[];
}

/**
 * 快速选集栏组件
 * 包含多个交互按钮（订阅、关注、收藏、分享）以及分集选择按钮
 */
export function InfoBar({ series, episodes }: InfoBarProps) {
  const navigate = useNavigate();

  // 本地 Mock 状态，仅用于演示
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // 收藏状态
  const {
    isFavorite,
    toggle: toggleFavorite,
    isLoading: isFavoriteLoading,
  } = useFavorite({
    targetType: FavoriteActionDto.targetType.SERIES,
    targetId: series.id,
  });

  return (
    <div className="mt-8 space-y-6">
      {/* ==== 混合布局按钮组 ==== */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 第一组：用户交互 */}
        <div className="flex items-center gap-3">
          {/* 订阅 (Primary CTA) */}
          <ActionBtn
            onClick={() => setIsSubscribed(!isSubscribed)}
            variant="amber"
            mode={isSubscribed ? "solid" : "ghost"}
            size="md"
            className="px-8"
            icon={
              <Bell className={cn("h-5 w-5 transition-colors", isSubscribed && "fill-current")} />
            }
          >
            {isSubscribed ? "已订阅" : "订阅"}
          </ActionBtn>

          {/* 关注 (Secondary) */}
          <ActionBtn
            onClick={() => setIsFollowing(!isFollowing)}
            variant="blue"
            mode={isFollowing ? "solid" : "ghost"}
            size="md"
            className="px-6"
            icon={
              <UserPlus
                className={cn("h-5 w-5 transition-colors", isFollowing && "fill-current")}
              />
            }
          >
            {isFollowing ? "已关注" : "关注"}
          </ActionBtn>

          {/* 收藏 (Secondary) */}
          <ActionBtn
            onClick={toggleFavorite}
            variant="red"
            mode={isFavorite ? "solid" : "ghost"}
            size="md"
            className="px-6"
            disabled={isFavoriteLoading}
            icon={
              <Heart className={cn("h-5 w-5 transition-colors", isFavorite && "fill-current")} />
            }
          >
            {isFavorite ? "已收藏" : "收藏"}
          </ActionBtn>
        </div>

        {/* 垂直分割线 */}
        <div className="hidden h-8 w-px bg-white/20 lg:block" />

        {/* 第二组：社交分享 */}
        <div className="flex items-center gap-3">
          <ActionBtn
            variant="neutral"
            mode="ghost"
            size="md"
            className="px-6"
            icon={<Share2 className="h-5 w-5" />}
          >
            分享
          </ActionBtn>
        </div>
      </div>

      {/* ==== 快速选集卡片 ==== */}
      {(episodes.length > 0 || Number(series.episodeCount) > 0) && (
        <div className="card rounded-xl p-5 shadow-2xl">
          <div className="mb-4 flex items-center gap-5">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <Film className="h-4 w-4 text-amber-500" />
              快速选集
            </h3>
            {/* 剧集详情信息 - 横向排列 */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              {series.episodeCount !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Tv className="h-4 w-4 text-blue-400/70" />
                  <span className="text-neutral-400">共</span>
                  <span className="font-medium text-white">{series.episodeCount} 集</span>
                </div>
              )}
              {Number(series.episodeDuration) > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-green-400/70" />
                  <span className="text-neutral-400">单集时长</span>
                  <span className="font-medium text-white">约 {series.episodeDuration} 分钟</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(() => {
              // 计算最大集数，防止 episodeCount 缺失时无法显示后部剧集
              const maxEpNum =
                episodes.length > 0 ? Math.max(...episodes.map((e) => e.episodeNumber)) : 0;
              // 优先使用 series.episodeCount，如果没有则使用最大集数
              const total = Number(series.episodeCount) || maxEpNum || episodes.length;
              // 限制最大显示数量，防止溢出，默认显示前 50 集
              const maxDisplay = Math.min(total, 50);
              // 创建集数映射用于快速查找
              const epMap = new Map(episodes.map((e) => [e.episodeNumber, e]));

              return Array.from({ length: maxDisplay }, (_, i) => i + 1).map((num) => {
                const ep = epMap.get(num);
                const isBound = !!ep;

                return (
                  <button
                    key={num}
                    disabled={!isBound}
                    onClick={() => isBound && ep && navigate(`/episodes/${ep.id}`)}
                    className={cn(
                      "flex h-10 min-w-[42px] items-center justify-center rounded-lg border px-3 text-sm font-medium shadow-inner transition-all",
                      isBound
                        ? "group cursor-pointer border-amber-500/50 bg-neutral-800/30 text-neutral-400 hover:scale-110 hover:border-amber-600 hover:bg-amber-500/15 hover:text-amber-400 active:scale-95"
                        : "cursor-default border-neutral-800/30 bg-white/5 text-neutral-600",
                    )}
                  >
                    {num}
                  </button>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
