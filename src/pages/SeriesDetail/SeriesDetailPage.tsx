import { useParams, useNavigate } from "react-router-dom";
import { useSeriesDetail } from "./hooks/useSeriesDetail";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  Star,
  Calendar,
  Clock,
  Tv,
  Users,
  Heart,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PageContainer } from "@/components/PageContainer";

export function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { series, episodes, loading, error } = useSeriesDetail(id);
  const [isCollected, setIsCollected] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-amber-500"></div>
          <p className="text-gray-400">正在加载剧集信息...</p>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-white">
        <div className="text-xl text-red-500">{error || "未找到剧集信息"}</div>
        <Button onClick={() => navigate("/series")}>返回剧集列表</Button>
      </div>
    );
  }

  const posterUrl = series.posterUrl || "https://via.placeholder.com/300x450";
  const backdropUrl =
    series.backdropUrl || "https://images.unsplash.com/photo-1574267432644-f65e7c0e4e5a?w=1920";

  // 按集号排序分集
  const sortedEpisodes = [...episodes].sort((a, b) => a.episodeNumber - b.episodeNumber);

  return (
    <PageContainer
      className="pb-20 text-white md:px-8 lg:px-20"
      backgroundImage={backdropUrl}
      backgroundAlt={series.title}
    >
      <div className="relative">
        {/* 主要内容容器 */}
        <div className="relative">
          {/* 返回按钮 */}
          <div className="pt-6 pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/series")}
              className="gap-2 text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              返回剧集列表
            </Button>
          </div>

          {/* 海报和信息区 */}
          <div className="flex flex-col gap-6 pb-8 md:flex-row">
            {/* 海报 */}
            <div className="w-full shrink-0 md:w-64 lg:w-72">
              <div className="overflow-hidden rounded-lg border border-white/10 shadow-2xl transition-all duration-300 hover:border-amber-500/50">
                <img src={posterUrl} alt={series.title} className="h-auto w-full object-cover" />
              </div>
            </div>

            {/* 信息区 */}
            <div className="flex-1 space-y-4">
              {/* 标题与基本信息 */}
              <div>
                <h1 className="mb-2 text-3xl leading-tight font-bold text-white md:text-4xl">
                  {series.title}
                </h1>
                {series.originalTitle && (
                  <p className="mb-3 text-lg text-gray-400">{series.originalTitle}</p>
                )}

                {/* 标签 */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {series.year && (
                    <Badge
                      size="sm"
                      className="border-amber-500/30 bg-amber-500/20 font-semibold text-amber-400"
                    >
                      {series.year}
                    </Badge>
                  )}
                  {series.status && (
                    <Badge size="sm" className="border-green-500/30 bg-green-500/20 text-green-400">
                      {series.status}
                    </Badge>
                  )}
                  {series.categories &&
                    series.categories.map((cat, idx) => (
                      <Badge
                        key={idx}
                        size="sm"
                        className="border-blue-500/30 bg-blue-500/20 text-blue-400"
                      >
                        {cat}
                      </Badge>
                    ))}
                </div>

                {/* 类型 */}
                {series.genres && series.genres.length > 0 && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {series.genres.map((genre, idx) => (
                      <Badge key={idx} outline size="sm" className="border-white/20 text-gray-300">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {series.rating && (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-400">评分</span>
                    </div>
                    <div className="text-xl font-bold text-amber-400">{series.rating}</div>
                  </div>
                )}
                {series.episodeCount !== undefined && (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Tv className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-gray-400">集数</span>
                    </div>
                    <div className="text-xl font-bold text-white">{series.episodeCount}</div>
                  </div>
                )}
                {series.episodeDuration && (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-gray-400">单集时长</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {series.episodeDuration}
                      <span className="ml-1 text-xs text-gray-400">分钟</span>
                    </div>
                  </div>
                )}
                {series.viewsCount !== undefined && (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-400">观看</span>
                    </div>
                    <div className="text-xl font-bold text-white">{series.viewsCount}</div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="default"
                  className="gap-2 rounded-full bg-amber-500 px-6 font-semibold text-black hover:bg-amber-400"
                  onClick={() => {
                    if (sortedEpisodes.length > 0) {
                      navigate(`/episodes/${sortedEpisodes[0].id}`);
                    }
                  }}
                  disabled={sortedEpisodes.length === 0}
                >
                  <Play className="h-4 w-4 fill-current" />
                  开始观看
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="gap-2 rounded-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => setIsCollected(!isCollected)}
                >
                  {isCollected ? (
                    <>
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      已收藏
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      收藏
                    </>
                  )}
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="gap-2 rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4" />
                  分享
                </Button>
              </div>

              {/* 导演和演员 */}
              <div className="space-y-2 text-sm">
                {series.director && (
                  <div className="flex items-start gap-2">
                    <span className="min-w-[50px] text-gray-400">导演:</span>
                    <span className="text-white">{series.director}</span>
                  </div>
                )}
                {series.cast && series.cast.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="min-w-[50px] text-gray-400">主演:</span>
                    <span className="text-white">{series.cast.slice(0, 8).join(" / ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 内容区 */}
          <div className="relative">
            {/* 剧情简介 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
                剧情简介
              </h2>
              {series.description ? (
                <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-gray-300">
                  {series.description}
                </p>
              ) : (
                <p className="text-base leading-relaxed text-gray-500 italic">暂无简介</p>
              )}
            </section>

            {/* 分集列表 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
                <Tv className="h-6 w-6 text-amber-500" />
                分集列表
                <span className="ml-2 text-lg font-normal text-gray-500">
                  ({sortedEpisodes.length})
                </span>
              </h2>

              {sortedEpisodes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 bg-white/5 py-8 text-center text-gray-500">
                  <Tv className="mx-auto mb-2 h-10 w-10 text-gray-600" />
                  <p className="text-base">暂无分集信息</p>
                  <p className="mt-1 text-xs text-gray-600">请稍后再来查看</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {sortedEpisodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="group cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-amber-500/50 hover:bg-white/10"
                      onClick={() => navigate(`/episodes/${episode.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        {/* 集号 */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/20">
                          <span className="text-xl font-bold text-amber-400">
                            {episode.episodeNumber}
                          </span>
                        </div>

                        {/* 信息 */}
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 text-lg font-semibold text-white transition-colors group-hover:text-amber-400">
                            {episode.title}
                          </h3>
                          {episode.originalTitle && (
                            <p className="mb-2 text-xs text-gray-400">{episode.originalTitle}</p>
                          )}
                          {episode.overview && (
                            <p className="mb-2 line-clamp-2 text-sm text-gray-400">
                              {episode.overview}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {episode.airDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{episode.airDate}</span>
                              </div>
                            )}
                            {episode.runtime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{episode.runtime} 分钟</span>
                              </div>
                            )}
                            {episode.voteAverage && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="font-medium text-amber-400">
                                  {episode.voteAverage.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 箭头 */}
                        <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                          <ArrowLeft className="h-5 w-5 rotate-180 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
