import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FavoriteActionDto } from "@/api";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useSeriesDetail } from "./hooks/useSeriesDetail";
import { Hero } from "./components/Hero";
import { InfoBar } from "./components/InfoBar";
import { EpisodeList } from "./components/EpisodeList";
import type { EpisodeItem } from "./types";
import { DetailPageSkeleton } from "@/components/skeletons/DetailPageSkeleton";

/**
 * 剧集详情页
 * - 模块化组件设计，遵循关注点分离原则
 * - 数据获取由 useSeriesDetail Hook 统一管理
 * - UI 状态与业务逻辑分离
 */
export default function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { series, episodes, loading, error } = useSeriesDetail(id);
  const queryClient = useQueryClient();

  // 同步收藏状态到缓存
  useEffect(() => {
    if (series?.isFavorited !== undefined && id) {
      queryClient.setQueryData(
        ["favorites", "check", FavoriteActionDto.targetType.SERIES, id],
        !!series.isFavorited,
      );
    }
  }, [series?.isFavorited, id, queryClient]);

  // 设置页面标题
  useDynamicTitle(series?.title || "剧集详情");

  // UI 状态

  // 加载状态 - 优雅的骨架屏
  if (loading) {
    return <DetailPageSkeleton />;
  }

  // 错误状态
  if (error || !series) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0F171E] text-white">
        <div className="text-center">
          <div className="mb-4 text-6xl">📺</div>
          <h2 className="mb-2 text-2xl font-bold text-white">{error || "未找到剧集信息"}</h2>
          <p className="text-neutral-400">该剧集可能已被移除或链接无效</p>
        </div>
        <Button onClick={() => navigate("/series")} className="general-button">
          返回剧集列表
        </Button>
      </div>
    );
  }

  // 按集号排序分集
  const sortedEpisodes: EpisodeItem[] = [...episodes].sort(
    (a, b) => a.episodeNumber - b.episodeNumber,
  );
  const firstEpisode = sortedEpisodes[0];

  // 背景图优先使用 backdropUrl
  const backdropUrl =
    series.backdropUrl || "https://images.unsplash.com/photo-1574267432644-f65e7c0e4e5a?w=1920";

  return (
    <PageContainer
      className="pb-20 text-white md:px-8 lg:px-16"
      backgroundImage={backdropUrl}
      backgroundAlt={series.title}
    >
      {/* Hero 区域 - 海报、标题、评分、导演演员等基础信息 */}
      <Hero series={series} firstEpisode={firstEpisode} />

      {/* 信息栏 - 操作按钮 + 快速选集 */}
      <InfoBar series={series} episodes={sortedEpisodes} />

      {/* 主内容区 */}
      <div className="mt-8">
        {/* 分集列表 */}
        {/* <EpisodeList episodes={sortedEpisodes} seriesTitle={series.title} /> */}
      </div>
    </PageContainer>
  );
}
