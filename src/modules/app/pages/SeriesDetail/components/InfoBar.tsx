import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FavoriteActionDto } from "@/api";
import { useFavorite } from "@/modules/app/hooks/useFavorite";
import { Film, Bell, UserPlus, Heart, Share2, Tv, Clock, Check } from "lucide-react";
import ActionBtn from "@/modules/app/components/ActionBtn";
import { ToggleButton } from "@/modules/app/components/ui/ToggleButton";
import { cn } from "@/utils/cn";
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
          <ToggleButton
            pressed={isSubscribed}
            onPressedChange={setIsSubscribed}
            activeIcon={<Bell className="h-5 w-5 fill-current" />}
            inactiveIcon={<Bell className="h-5 w-5" />}
            activeClassName="border-[0.5px] border-amber-500 bg-amber-500/10 text-amber-500"
            inactiveClassName="bg-gray-700/40 text-neutral-300 hover:bg-gray-700/60 shadow-none backdrop-blur-md"
            tooltip={isSubscribed ? "已订阅" : "订阅"}
          >
            {isSubscribed ? "已订阅" : "订阅"}
          </ToggleButton>

          {/* 关注 (Secondary) */}
          <ToggleButton
            pressed={isFollowing}
            onPressedChange={setIsFollowing}
            activeIcon={<Check className="h-5 w-5" />}
            inactiveIcon={<UserPlus className="h-5 w-5" />}
            activeClassName="border-[0.5px] border-blue-400 bg-blue-400/10 text-blue-400"
            inactiveClassName="bg-gray-700/40 text-neutral-300 hover:bg-gray-700/60 shadow-none backdrop-blur-md"
            tooltip={isFollowing ? "已关注" : "关注"}
          >
            {isFollowing ? "已关注" : "关注"}
          </ToggleButton>

          {/* 收藏 (Secondary) */}
          <ToggleButton
            pressed={isFavorite}
            onPressedChange={() => toggleFavorite()}
            isLoading={isFavoriteLoading}
            activeIcon={<Heart className="h-5 w-5 fill-current" />}
            inactiveIcon={<Heart className="h-5 w-5" />}
            activeClassName="border-[0.5px] border-red-400 bg-red-400/10 text-red-400"
            inactiveClassName="bg-gray-700/40 text-neutral-300 hover:bg-gray-700/60 shadow-none backdrop-blur-md"
            tooltip={isFavorite ? "取消收藏" : "点击收藏"}
          >
            {isFavorite ? "已收藏" : "收藏"}
          </ToggleButton>
        </div>

        {/* 垂直分割线 */}
        <div className="hidden h-8 w-px bg-white/20 lg:block" />

        {/* 第二组：社交分享 */}
        <div className="flex items-center gap-3">
          <ActionBtn
            variant="neutral"
            mode="ghost"
            size="md"
            className="px-4"
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
                    onClick={() => isBound && ep && navigate(`/app/episodes/${ep.id}`)}
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
