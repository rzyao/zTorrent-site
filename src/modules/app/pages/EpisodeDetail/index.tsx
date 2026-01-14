import { useParams, useNavigate } from "react-router-dom";
import { useEpisodeDetail } from "./hooks/useEpisodeDetail";
import { Button } from "@/modules/app/components/ui/button";
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
import { PageContainer } from "@/modules/app/components/PageContainer";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { Badge } from "@/modules/app/components/ui/badge";
import { formatSize } from "@/utils/format";
import { formatDate } from "@/modules/app/pages/Invite/utils";
import { LoadingState, ErrorState } from "@/modules/app/pages/Series/components/States";
import { useTorrentDownload } from "@/modules/app/hooks/useTorrentDownload";
import { useDownloaders } from "@/modules/app/context/DownloadersContext";
import { DownloadToDownloaderModal } from "@/modules/app/components/DownloadToDownloaderModal";
import { useState } from "react";

export default function EpisodeDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { series, episode, torrents, allEpisodes, loading, error } = useEpisodeDetail(
    undefined,
    id,
  );

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
    return <div className="flex h-screen items-center justify-center text-white">正在加载...</div>;
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
    <div className="min-h-screen bg-[#0F171E] pb-20 text-white">
      <div className="relative">
        {/* 背景图层与渐变遮罩 - 独立于内容之外 */}
        <div className="absolute inset-0 h-[600px]">
          <ImageWithFallback
            src={
              series.backdropUrl ||
              "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=1920"
            }
            alt={series.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0F171E] via-[#0F171E]/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0F171E] via-[#0F171E]/50 to-transparent" />
        </div>

        {/* 统一的居中内容容器 */}
        <div className="relative mx-auto flex max-w-[1600px] flex-col items-center px-4 md:px-8 lg:px-20">
          <div className="flex w-full flex-col gap-8 lg:flex-row">
            {/* 分集信息区 - 占比 2 */}
            <div className="min-w-0 flex-[2]">
              {/* 返回按钮 */}
              <div className="pt-6 pb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/app/series/${seriesId}`)}
                  className="gap-2 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回剧集详情
                </Button>
              </div>

              {/* 海报与信息区 (Hero Section) */}
              <div className="flex flex-col gap-8 md:flex-row">
                {/* Series Poster */}
                <div className="w-32 shrink-0 overflow-hidden rounded-lg border-2 border-white/10 shadow-2xl md:w-48 lg:w-56">
                  <img src={posterUrl} alt={series.title} className="h-full w-full object-cover" />
                </div>

                {/* 信息区 */}
                <div className="max-w-2xl flex-initial space-y-4">
                  <h1 className="text-3xl leading-tight font-bold text-white md:text-4xl">
                    <span
                      onClick={() => navigate(`/app/series/${seriesId}`)}
                      className="cursor-pointer transition-colors hover:text-amber-400 hover:underline"
                    >
                      {series.title}
                    </span>
                    <span className="mx-2 text-gray-500">/</span>
                    <span className="text-amber-400">第 {episode.episodeNumber} 集</span>
                  </h1>
                  <div className="flex items-center gap-2 text-lg font-medium text-amber-500">
                    本集中文名: {episode.title}
                  </div>
                  <div className="flex items-center gap-2 text-lg font-medium text-amber-500">
                    本集原名: {episode.originalTitle}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 md:text-base">
                    {episode.airDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{episode.airDate}</span>
                      </div>
                    )}
                    {episode.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{episode.runtime} 分钟</span>
                      </div>
                    )}
                    {/* Vote average if available */}
                    {episode.voteAverage && (
                      <div className="rounded border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-500">
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
              <div className="space-y-8 py-12">
                {/* 剧照 */}
                {episode.stillUrl && (
                  <section>
                    <h3 className="mb-4 text-2xl font-bold text-white">剧照</h3>
                    <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                      <ImageWithFallback
                        src={episode.stillUrl}
                        alt={`${episode.title} 剧照`}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </section>
                )}

                {/* Overview */}
                <section>
                  <h3 className="mb-4 text-2xl font-bold text-white">剧情简介</h3>
                  {episode.description ? (
                    <p className="rounded-lg border border-white/10 bg-white/5 p-6 text-lg leading-relaxed text-gray-300">
                      {episode.description}
                    </p>
                  ) : (
                    <p className="text-lg leading-relaxed text-gray-500 italic">暂无简介</p>
                  )}
                </section>

                {/* Torrents List */}
                <section id="torrents" className="border-t border-white/10 pt-8">
                  <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                    <Download className="h-6 w-6 text-amber-500" />
                    资源下载
                    <span className="ml-2 text-lg font-normal text-gray-500">
                      ({torrents.length})
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {torrents.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-white/10 bg-white/5 py-12 text-center text-gray-500">
                        <Download className="mx-auto mb-3 h-12 w-12 text-gray-600" />
                        <p className="text-lg">暂无匹配资源</p>
                        <p className="mt-1 text-sm text-gray-600">请稍后再来查看</p>
                      </div>
                    ) : (
                      torrents.map((t) => (
                        <div
                          key={t.id}
                          className="group app-card app-card-hover text-parent cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                          onClick={() => navigate(`/app/torrent/${t.id}`)}
                        >
                          <div className="flex gap-4 p-4">
                            {/* 缩略图 */}
                            <div className="relative hidden h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10 md:block">
                              <ImageWithFallback
                                src={t.cover}
                                alt={t.title || t.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>

                            {/* 信息区 */}
                            <div className="flex min-w-0 flex-1 flex-col justify-between">
                              <div className="mb-2 flex items-start gap-3">
                                <div className="flex min-w-0 flex-1 flex-col">
                                  <h3 className="truncate text-lg font-semibold text-white transition-colors group-hover:text-amber-400">
                                    {t.title || t.name}
                                  </h3>
                                  {t.subTitle && (
                                    <p className="mt-0.5 truncate text-sm text-gray-400">
                                      {t.subTitle}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hidden shrink-0 items-center gap-2 rounded-lg border-[#92702a] bg-transparent text-[#d4a733] hover:border-[#d4a733] hover:bg-[#d4a733]/10 hover:text-[#e8bc4a] md:flex"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(t.id, t.title || t.name);
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                  下载
                                </Button>
                              </div>

                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                {t.standard && (
                                  <Badge
                                    size="sm"
                                    className="border-amber-500/30 bg-amber-500/20 font-semibold text-amber-400"
                                  >
                                    {t.standard}
                                  </Badge>
                                )}
                                {t.productionTeam && (
                                  <Badge
                                    outline
                                    size="sm"
                                    className="border-white/20 text-xs text-gray-300"
                                  >
                                    {t.productionTeam}
                                  </Badge>
                                )}
                                {t.source && (
                                  <Badge
                                    outline
                                    size="sm"
                                    className="border-white/20 text-xs text-gray-300"
                                  >
                                    {t.source}
                                  </Badge>
                                )}
                                {t.videoCodec && (
                                  <Badge
                                    outline
                                    size="sm"
                                    className="border-white/20 text-xs text-gray-300"
                                  >
                                    {t.videoCodec}
                                  </Badge>
                                )}
                                {t.audioCodec && (
                                  <Badge
                                    outline
                                    size="sm"
                                    className="border-white/20 text-xs text-gray-300"
                                  >
                                    {t.audioCodec}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <HardDrive className="h-4 w-4" />
                                  <span className="font-medium">{formatSize(t.size)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Upload className="h-4 w-4 text-green-400" />
                                  <span className="font-medium text-green-400">{t.seeders}</span>
                                  <span className="text-gray-500">做种</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Download className="h-4 w-4 text-red-400" />
                                  <span className="font-medium text-red-400">{t.downloads}</span>
                                  <span className="text-gray-500">下载</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(t.uploadedAt)}</span>
                                </div>
                              </div>

                              {/* 移动端下载按钮 */}
                              <div className="mt-3 md:hidden">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full rounded-lg border-[#92702a] bg-transparent text-[#d4a733] hover:border-[#d4a733] hover:bg-[#d4a733]/10 hover:text-[#e8bc4a]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(t.id, t.title || t.name);
                                  }}
                                >
                                  <Download className="h-4 w-4" />
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
            <div className="min-w-0 flex-[1] pt-16">
              <div className="sticky top-24 space-y-6 rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-bold text-white/90">剧集信息</h3>

                {/* 基本信息 */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-400">剧集状态</span>
                    <span className="text-white">{series.status}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-400">总集数</span>
                    <span className="text-white">{series.episodeCount} 集</span>
                  </div>
                  {series.year && (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-400">年份</span>
                      <span className="text-white">{series.year}</span>
                    </div>
                  )}
                  {series.episodeDuration && (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-400">单集时长</span>
                      <span className="text-white">{series.episodeDuration} 分钟</span>
                    </div>
                  )}
                </div>

                {/* 类型标签 */}
                {series.genres && series.genres.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="mb-2 text-sm text-gray-400">类型</div>
                    <div className="flex flex-wrap gap-2">
                      {series.genres.map((genre, idx) => (
                        <Badge
                          key={idx}
                          size="sm"
                          className="border-amber-500/30 bg-amber-500/20 text-amber-400"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 导演 */}
                {series.director && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="mb-1 text-sm text-gray-400">导演</div>
                    <div className="text-white">{series.director}</div>
                  </div>
                )}

                {/* 演员 */}
                {series.cast && series.cast.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="mb-2 text-sm text-gray-400">主演</div>
                    <div className="flex flex-wrap gap-2">
                      {series.cast.slice(0, 6).map((actor, idx) => (
                        <span key={idx} className="text-sm text-white">
                          {actor}
                          {idx < Math.min(series.cast!.length, 6) - 1 && (
                            <span className="mx-1 text-gray-500">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 评分信息 */}
                {(series.rating || series.doubanRatingAverage || series.imdbRatingAverage) && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="mb-3 text-sm text-gray-400">评分</div>
                    <div className="space-y-2">
                      {series.rating && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">TMDB</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-amber-400">{series.rating}</span>
                          </div>
                        </div>
                      )}
                      {series.doubanRatingAverage && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">豆瓣</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-amber-400">
                              {series.doubanRatingAverage}
                            </span>
                          </div>
                        </div>
                      )}
                      {series.imdbRatingAverage && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">IMDb</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-amber-400">
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
                  <div className="border-t border-white/10 pt-4">
                    <div className="mb-3 text-sm text-gray-400">外部链接</div>
                    <div className="flex flex-col gap-2">
                      {series.doubanLink && (
                        <a
                          href={series.doubanLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                        >
                          豆瓣页面 →
                        </a>
                      )}
                      {series.imdbLink && (
                        <a
                          href={series.imdbLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                        >
                          IMDb 页面 →
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* 分集选择 */}
                <div className="border-t border-white/10 pt-6">
                  <div className="mb-4 text-sm text-gray-400">分集</div>
                  <div className="flex flex-wrap gap-2">
                    {allEpisodes.length > 0
                      ? allEpisodes
                          .sort((a, b) => a.episodeNumber - b.episodeNumber)
                          .map((ep) => (
                            <button
                              key={ep.id}
                              onClick={() => navigate(`/app/episodes/${ep.id}`)}
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-sm transition-all hover:scale-105 ${
                                ep.id === id
                                  ? "border-amber-500 bg-amber-500/80 font-bold text-black shadow-lg shadow-amber-500/20"
                                  : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:bg-white/10"
                              }`}
                              title={ep.title}
                            >
                              {ep.episodeNumber}
                            </button>
                          ))
                      : // Fallback if no episodes fetched (should not happen with the hook update)
                        Array.from({ length: series.episodeCount || 0 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-md border border-white/5 bg-white/5 text-gray-600"
                          >
                            {i + 1}
                          </div>
                        ))}
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
