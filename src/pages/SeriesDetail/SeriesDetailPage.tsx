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
import { PageContainer } from "@/layouts/PageContainer";

export function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { series, episodes, loading, error } = useSeriesDetail(id);
  const [isCollected, setIsCollected] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
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
    series.backdropUrl ||
    "https://images.unsplash.com/photo-1574267432644-f65e7c0e4e5a?w=1920";

  // 按集号排序分集
  const sortedEpisodes = [...episodes].sort(
    (a, b) => a.episodeNumber - b.episodeNumber
  );

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
              className="text-gray-400 hover:text-white hover:bg-white/10 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回剧集列表
            </Button>
          </div>

          {/* 海报和信息区 */}
          <div className="flex flex-col md:flex-row gap-6 pb-8">
            {/* 海报 */}
            <div className="w-full md:w-64 lg:w-72 shrink-0">
              <div className="rounded-lg overflow-hidden shadow-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-300">
                <img
                  src={posterUrl}
                  alt={series.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* 信息区 */}
            <div className="flex-1 space-y-4">
              {/* 标题与基本信息 */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-2">
                  {series.title}
                </h1>
                {series.originalTitle && (
                  <p className="text-lg text-gray-400 mb-3">
                    {series.originalTitle}
                  </p>
                )}

                {/* 标签 */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {series.year && (
                    <Badge
                      size="sm"
                      className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-semibold"
                    >
                      {series.year}
                    </Badge>
                  )}
                  {series.status && (
                    <Badge
                      size="sm"
                      className="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      {series.status}
                    </Badge>
                  )}
                  {series.categories &&
                    series.categories.map((cat, idx) => (
                      <Badge
                        key={idx}
                        size="sm"
                        className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                      >
                        {cat}
                      </Badge>
                    ))}
                </div>

                {/* 类型 */}
                {series.genres && series.genres.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {series.genres.map((genre, idx) => (
                      <Badge
                        key={idx}
                        outline
                        size="sm"
                        className="text-gray-300 border-white/20"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {series.rating && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-gray-400 text-xs">评分</span>
                    </div>
                    <div className="text-xl font-bold text-amber-400">
                      {series.rating}
                    </div>
                  </div>
                )}
                {series.episodeCount !== undefined && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Tv className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400 text-xs">集数</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {series.episodeCount}
                    </div>
                  </div>
                )}
                {series.episodeDuration && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400 text-xs">单集时长</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {series.episodeDuration}
                      <span className="text-xs text-gray-400 ml-1">分钟</span>
                    </div>
                  </div>
                )}
                {series.viewsCount !== undefined && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400 text-xs">观看</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {series.viewsCount}
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="default"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full gap-2 px-6"
                  onClick={() => {
                    if (sortedEpisodes.length > 0) {
                      navigate(`/episodes/${sortedEpisodes[0].id}`);
                    }
                  }}
                  disabled={sortedEpisodes.length === 0}
                >
                  <Play className="w-4 h-4 fill-current" />
                  开始观看
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white rounded-full gap-2"
                  onClick={() => setIsCollected(!isCollected)}
                >
                  {isCollected ? (
                    <>
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      已收藏
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      收藏
                    </>
                  )}
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white rounded-full gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </Button>
              </div>

              {/* 导演和演员 */}
              <div className="space-y-2 text-sm">
                {series.director && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 min-w-[50px]">导演:</span>
                    <span className="text-white">{series.director}</span>
                  </div>
                )}
                {series.cast && series.cast.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 min-w-[50px]">主演:</span>
                    <span className="text-white">
                      {series.cast.slice(0, 8).join(" / ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 内容区 */}
          <div className="relative">
            {/* 剧情简介 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                剧情简介
              </h2>
              {series.description ? (
                <p className="text-base leading-relaxed text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                  {series.description}
                </p>
              ) : (
                <p className="text-base leading-relaxed text-gray-500 italic">
                  暂无简介
                </p>
              )}
            </section>

            {/* 分集列表 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <Tv className="w-6 h-6 text-amber-500" />
                分集列表
                <span className="text-gray-500 text-lg font-normal ml-2">
                  ({sortedEpisodes.length})
                </span>
              </h2>

              {sortedEpisodes.length === 0 ? (
                <div className="text-gray-500 py-8 text-center bg-white/5 rounded-lg border border-dashed border-white/10">
                  <Tv className="w-10 h-10 mx-auto mb-2 text-gray-600" />
                  <p className="text-base">暂无分集信息</p>
                  <p className="text-xs text-gray-600 mt-1">请稍后再来查看</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {sortedEpisodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="group bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-amber-500/50 p-4 cursor-pointer transition-all duration-300"
                      onClick={() => navigate(`/episodes/${episode.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        {/* 集号 */}
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
                          <span className="text-xl font-bold text-amber-400">
                            {episode.episodeNumber}
                          </span>
                        </div>

                        {/* 信息 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors">
                            {episode.title}
                          </h3>
                          {episode.originalTitle && (
                            <p className="text-gray-400 text-xs mb-2">
                              {episode.originalTitle}
                            </p>
                          )}
                          {episode.overview && (
                            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                              {episode.overview}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {episode.airDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{episode.airDate}</span>
                              </div>
                            )}
                            {episode.runtime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{episode.runtime} 分钟</span>
                              </div>
                            )}
                            {episode.voteAverage && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-amber-400 font-medium">
                                  {episode.voteAverage.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 箭头 */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowLeft className="w-5 h-5 text-amber-400 rotate-180" />
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
