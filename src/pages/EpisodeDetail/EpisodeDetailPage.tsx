import { useParams, useNavigate } from "react-router-dom";
import { useEpisodeDetail } from "./hooks/useEpisodeDetail";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  Download,
  Calendar,
  Clock,
  HardDrive,
  Upload,
  Star,
  MessageSquare,
} from "lucide-react";
import { PageContainer } from "@/layouts/PageContainer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { formatSize } from "@/utils/format";
import { formatDate } from "@/pages/Invite/utils";
import { LoadingState, ErrorState } from "@/pages/Series/components/States";
import { useTorrentDownload } from "@/utils/useTorrentDownload";
import { useDownloaders } from "@/context/DownloadersContext";
import { DownloadToDownloaderModal } from "@/components/DownloadToDownloaderModal";
import { useState } from "react";

export function EpisodeDetailPage() {
  const { episodeId } = useParams<{
    episodeId: string;
  }>();
  const navigate = useNavigate();
  const { series, episode, torrents, allEpisodes, loading, error } =
    useEpisodeDetail(undefined, episodeId);

  // 下载能力
  const { downloadByTorrentId } = useTorrentDownload({
    onInfo: (m) => console.info(m),
    onError: (m) => alert(m),
  });

  // 下载器全局状态
  const { downloaders } = useDownloaders();

  // 下载弹窗状态
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedTorrent, setSelectedTorrent] = useState<{
    id: string;
    title: string;
  } | null>(null);

  /**
   * 处理下载按钮点击
   */
  const handleDownload = (id: string, title: string) => {
    if (downloaders.length > 0) {
      setSelectedTorrent({ id, title });
      setDownloadModalOpen(true);
    } else {
      downloadByTorrentId(id, title);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        正在加载...
      </div>
    );
  }

  if (error || !episode || !series) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-white">
        <div className="text-xl text-red-500">{error || "未找到分集信息"}</div>
        <Button onClick={() => navigate("/series")}>返回剧集列表</Button>
      </div>
    );
  }

  const seriesId = episode.seriesId;

  const posterUrl = series.posterUrl;

  return (
    <div className="min-h-screen bg-[#0F171E] text-white pb-20">
      <div className="relative">
        {/* 背景图层与渐变遮罩 - 独立于内容之外 */}
        <div className="absolute inset-0 h-[600px]">
          <ImageWithFallback
            src={
              series.backdropUrl ||
              "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=1920"
            }
            alt={series.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-[#0F171E]/50 to-transparent" />
        </div>

        {/* 统一的居中内容容器 */}
        <div className="relative max-w-[1600px] mx-auto px-4 md:px-8 lg:px-20 flex flex-col items-center">
          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* 分集信息区 - 占比 2 */}
            <div className="flex-[2] min-w-0">
              {/* 返回按钮 */}
              <div className="pt-6 pb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/series/${seriesId}`)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回剧集详情
                </Button>
              </div>

              {/* 海报与信息区 (Hero Section) */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* Series Poster */}
                <div className="w-32 md:w-48 lg:w-56 shrink-0 rounded-lg overflow-hidden shadow-2xl border-2 border-white/10">
                  <img
                    src={posterUrl}
                    alt={series.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 信息区 */}
                <div className="flex-initial max-w-2xl space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
                    <span
                      onClick={() => navigate(`/series/${seriesId}`)}
                      className="cursor-pointer hover:underline hover:text-amber-400 transition-colors"
                    >
                      {series.title}
                    </span>
                    <span className="text-gray-500 mx-2">/</span>
                    <span className="text-amber-400">
                      第 {episode.episodeNumber} 集
                    </span>
                  </h1>
                  <div className="flex items-center gap-2 text-amber-500 font-medium text-lg">
                    本集中文名: {episode.title}
                  </div>
                  <div className="flex items-center gap-2 text-amber-500 font-medium text-lg">
                    本集原名: {episode.originalTitle}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300">
                    {episode.airDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{episode.airDate}</span>
                      </div>
                    )}
                    {episode.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{episode.runtime} 分钟</span>
                      </div>
                    )}
                    {/* Vote average if available */}
                    {episode.voteAverage && (
                      <div className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs font-bold border border-amber-500/30">
                        TMDB {episode.voteAverage.toFixed(1)}
                      </div>
                    )}
                  </div>
                  {/* 
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      size="lg"
                      className="bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full gap-2 px-8"
                      onClick={() => {
                      }}
                    >
                      <Play className="w-5 h-5 fill-current" />
                      立即播放
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/20 hover:bg-white/10 text-white rounded-full gap-2"
                      onClick={() =>
                        document
                          .getElementById("torrents")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <Download className="w-5 h-5" />
                      下载资源
                    </Button>
                  </div> */}
                </div>
              </div>

              {/* 内容区 - 资源列表与详情 */}
              <div className="py-12 space-y-8">
                {/* 剧照 */}
                {episode.stillUrl && (
                  <section>
                    <h3 className="text-2xl font-bold mb-4 text-white">剧照</h3>
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                      <ImageWithFallback
                        src={episode.stillUrl}
                        alt={`${episode.title} 剧照`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </section>
                )}

                {/* Overview */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    剧情简介
                  </h3>
                  {episode.description ? (
                    <p className="text-lg leading-relaxed text-gray-300 bg-white/5 p-6 rounded-lg border border-white/10">
                      {episode.description}
                    </p>
                  ) : (
                    <p className="text-lg leading-relaxed text-gray-500 italic">
                      暂无简介
                    </p>
                  )}
                </section>

                {/* Torrents List */}
                <section
                  id="torrents"
                  className="pt-8 border-t border-white/10"
                >
                  <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    <Download className="w-6 h-6 text-amber-500" />
                    资源下载
                    <span className="text-gray-500 text-lg font-normal ml-2">
                      ({torrents.length})
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {torrents.length === 0 ? (
                      <div className="text-gray-500 py-12 text-center bg-white/5 rounded-lg border border-dashed border-white/10">
                        <Download className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                        <p className="text-lg">暂无匹配资源</p>
                        <p className="text-sm text-gray-600 mt-1">
                          请稍后再来查看
                        </p>
                      </div>
                    ) : (
                      torrents.map((t) => (
                        <div
                          key={t.id}
                          className="group card card-hover text-parent rounded-lg transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-lg hover:shadow-amber-500/10"
                          onClick={() => navigate(`/torrent/${t.id}`)}
                        >
                          <div className="flex gap-4 p-4">
                            {/* 缩略图 */}
                            <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden hidden md:block border border-white/10">
                              <ImageWithFallback
                                src={t.cover}
                                alt={t.title || t.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* 信息区 */}
                            <div className="flex flex-col justify-between flex-1 min-w-0">
                              <div className="flex items-start gap-3 mb-2">
                                <div className="flex flex-col flex-1 min-w-0">
                                  <h3 className="text-white text-lg font-semibold truncate group-hover:text-amber-400 transition-colors">
                                    {t.title || t.name}
                                  </h3>
                                  {t.subTitle && (
                                    <p className="text-gray-400 text-sm truncate mt-0.5">
                                      {t.subTitle}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  className="general-button hidden md:flex items-center gap-2 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(t.id, t.title || t.name);
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                  下载
                                </Button>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {t.standard && (
                                  <Badge
                                    size="sm"
                                    className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-semibold"
                                  >
                                    {t.standard}
                                  </Badge>
                                )}
                                {t.productionTeam && (
                                  <Badge
                                    outline
                                    size="sm"
                                    className="text-xs border-white/20 text-gray-300"
                                  >
                                    {t.productionTeam}
                                  </Badge>
                                )}
                                {t.source && (
                                  <Badge
                                    outline
                                    size="sm"
                                    className="text-xs border-white/20 text-gray-300"
                                  >
                                    {t.source}
                                  </Badge>
                                )}
                                {t.videoCodec && (
                                  <Badge
                                    outline
                                    size="sm"
                                    className="text-xs border-white/20 text-gray-300"
                                  >
                                    {t.videoCodec}
                                  </Badge>
                                )}
                                {t.audioCodec && (
                                  <Badge
                                    outline
                                    size="sm"
                                    className="text-xs border-white/20 text-gray-300"
                                  >
                                    {t.audioCodec}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <HardDrive className="w-4 h-4" />
                                  <span className="font-medium">
                                    {formatSize(t.size)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Upload className="w-4 h-4 text-green-400" />
                                  <span className="text-green-400 font-medium">
                                    {t.seeders}
                                  </span>
                                  <span className="text-gray-500">做种</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Download className="w-4 h-4 text-red-400" />
                                  <span className="text-red-400 font-medium">
                                    {t.downloads}
                                  </span>
                                  <span className="text-gray-500">下载</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(t.uploadedAt)}</span>
                                </div>
                              </div>

                              {/* 移动端下载按钮 */}
                              <div className="mt-3 md:hidden">
                                <Button
                                  size="sm"
                                  className="general-button w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(t.id, t.title || t.name);
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                  下载资源
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* 剧集信息区 - 占比 1 */}
            <div className="flex-[1] min-w-0 pt-16">
              <div className="sticky top-24 bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                <h3 className="text-xl font-bold text-white/90">剧集信息</h3>

                {/* 基本信息 */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-sm">剧集状态</span>
                    <span className="text-white">{series.status}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-sm">总集数</span>
                    <span className="text-white">{series.episodeCount} 集</span>
                  </div>
                  {series.year && (
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-sm">年份</span>
                      <span className="text-white">{series.year}</span>
                    </div>
                  )}
                  {series.episodeDuration && (
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-sm">单集时长</span>
                      <span className="text-white">
                        {series.episodeDuration} 分钟
                      </span>
                    </div>
                  )}
                </div>

                {/* 类型标签 */}
                {series.genres && series.genres.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-gray-400 text-sm mb-2">类型</div>
                    <div className="flex flex-wrap gap-2">
                      {series.genres.map((genre, idx) => (
                        <Badge
                          key={idx}
                          size="sm"
                          className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 导演 */}
                {series.director && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-gray-400 text-sm mb-1">导演</div>
                    <div className="text-white">{series.director}</div>
                  </div>
                )}

                {/* 演员 */}
                {series.cast && series.cast.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-gray-400 text-sm mb-2">主演</div>
                    <div className="flex flex-wrap gap-2">
                      {series.cast.slice(0, 6).map((actor, idx) => (
                        <span key={idx} className="text-white text-sm">
                          {actor}
                          {idx < Math.min(series.cast!.length, 6) - 1 && (
                            <span className="text-gray-500 mx-1">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 评分信息 */}
                {(series.rating ||
                  series.doubanRatingAverage ||
                  series.imdbRatingAverage) && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-gray-400 text-sm mb-3">评分</div>
                    <div className="space-y-2">
                      {series.rating && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">TMDB</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-amber-400 font-bold">
                              {series.rating}
                            </span>
                          </div>
                        </div>
                      )}
                      {series.doubanRatingAverage && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">豆瓣</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-amber-400 font-bold">
                              {series.doubanRatingAverage}
                            </span>
                          </div>
                        </div>
                      )}
                      {series.imdbRatingAverage && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">IMDb</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-amber-400 font-bold">
                              {series.imdbRatingAverage}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 外部链接 */}
                {(series.doubanLink || series.imdbLink) && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-gray-400 text-sm mb-3">外部链接</div>
                    <div className="flex flex-col gap-2">
                      {series.doubanLink && (
                        <a
                          href={series.doubanLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                        >
                          豆瓣页面 →
                        </a>
                      )}
                      {series.imdbLink && (
                        <a
                          href={series.imdbLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                        >
                          IMDb 页面 →
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* 分集选择 */}
                <div className="pt-6 border-t border-white/10">
                  <div className="text-gray-400 text-sm mb-4">分集</div>
                  <div className="flex flex-wrap gap-2">
                    {allEpisodes.length > 0
                      ? allEpisodes
                          .sort((a, b) => a.episodeNumber - b.episodeNumber)
                          .map((ep) => (
                            <button
                              key={ep.id}
                              onClick={() =>
                                navigate(`/series/${seriesId}/episode/${ep.id}`)
                              }
                              className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm transition-all hover:scale-105 shrink-0 ${
                                ep.id === episodeId
                                  ? "bg-amber-500/80 border-amber-500 text-black font-bold shadow-lg shadow-amber-500/20"
                                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30"
                              }`}
                              title={ep.title}
                            >
                              {ep.episodeNumber}
                            </button>
                          ))
                      : // Fallback if no episodes fetched (should not happen with the hook update)
                        Array.from({ length: series.episodeCount || 0 }).map(
                          (_, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 flex items-center justify-center rounded-md border border-white/5 bg-white/5 text-gray-600 cursor-not-allowed shrink-0"
                            >
                              {i + 1}
                            </div>
                          )
                        )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下载弹窗 */}
      {selectedTorrent && (
        <DownloadToDownloaderModal
          open={downloadModalOpen}
          onClose={() => {
            setDownloadModalOpen(false);
            setSelectedTorrent(null);
          }}
          torrentId={selectedTorrent.id}
          torrentTitle={selectedTorrent.title}
        />
      )}
    </div>
  );
}
