import { useParams, useNavigate } from "react-router-dom";
import { useEpisodeDetail } from "./hooks/useEpisodeDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Download, Calendar, Clock } from "lucide-react";
import { PageContainer } from "@/layouts/PageContainer";
import { LoadingState, ErrorState } from "@/pages/Series/components/States"; // Reuse from Series if possible, or generic
// Note: States might not be exported from Series/components/States. I will use generic ones if they fail.
// Checking Series/components/States exists from Step 34.

export function EpisodeDetailPage() {
  const { seriesId, episodeId } = useParams<{
    seriesId: string;
    episodeId: string;
  }>();
  const navigate = useNavigate();
  const { series, episode, torrents, loading, error } = useEpisodeDetail(
    seriesId,
    episodeId
  );

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
        <Button onClick={() => navigate(`/series/${seriesId}`)}>
          返回剧集详情
        </Button>
      </div>
    );
  }

  const posterUrl = series.posterUrl;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] flex items-end">
        <div className="absolute inset-0 bg-neutral-900" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20">
          <div className="container mx-auto flex flex-col md:flex-row gap-8 items-end">
            {/* Series Poster (Small) */}
            <div className="w-32 md:w-48 lg:w-56 shrink-0 hidden md:block rounded-lg overflow-hidden shadow-2xl border border-white/10">
              <img
                src={posterUrl}
                alt={series.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-amber-500 font-medium">
                <span
                  onClick={() => navigate(`/series/${seriesId}`)}
                  className="cursor-pointer hover:underline"
                >
                  {series.title}
                </span>
                <span>&gt;</span>
                <span>第 {episode.episodeNumber} 集</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {episode.title}
              </h1>

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

              <div className="flex items-center gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full gap-2 px-8"
                  onClick={() => {
                    /* TODO: Play logic */
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-white/90">剧情简介</h3>
            <p className="text-lg leading-relaxed text-gray-300">
              {episode.description || "暂无简介"}
            </p>
          </section>

          {/* Torrents List */}
          <section id="torrents" className="pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold mb-6 text-white/90 flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-500" />
              资源下载 ({torrents.length})
            </h3>

            <div className="grid gap-4">
              {torrents.length === 0 ? (
                <div className="text-gray-500 py-8 text-center bg-white/5 rounded-lg border border-dashed border-white/10">
                  暂无匹配资源
                </div>
              ) : (
                torrents.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-medium text-amber-400 truncate mb-1"
                        title={t.title}
                      >
                        {t.title || t.name}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="bg-white/10 px-1.5 py-0.5 rounded">
                          {t.size}
                        </span>
                        <span>做种: {t.seeders}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/torrent/${t.id}`)}
                    >
                      查看
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar (Optional) */}
        <div className="space-y-8">
          {/* Next/Prev Episode Navigation could go here */}
        </div>
      </div>
    </div>
  );
}
