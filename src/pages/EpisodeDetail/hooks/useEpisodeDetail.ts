
import { useState, useEffect } from "react";
import { SeriesService } from "@/api/services/SeriesService";
import type { EpisodeDetailResponseDto } from "@/api/models/EpisodeDetailResponseDto";
import type { EpisodeSeriesDetailDto } from "@/api/models/EpisodeSeriesDetailDto";
import type { EpisodeTorrentDetailDto } from "@/api/models/EpisodeTorrentDetailDto";
import type { EpisodeDTO } from "@/api/models/EpisodeDTO";

// 扩展 EpisodeDTO 或使用新类型来包含 ID (如果 EpisodeDTO 确实缺少 ID)
export interface EpisodeListItem extends EpisodeDTO {
  id: string;
}

export function useEpisodeDetail(seriesId?: string, episodeId?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<EpisodeSeriesDetailDto | null>(null);
  const [episode, setEpisode] = useState<EpisodeDetailResponseDto | null>(null);
  const [torrents, setTorrents] = useState<EpisodeTorrentDetailDto[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<EpisodeListItem[]>([]);

  useEffect(() => {
    if (!episodeId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await SeriesService.seriesEpisodesControllerDetail({
          id: episodeId,
        });
        const data = resp.data;

        if (!data) {
          throw new Error("分集不存在");
        }

        setEpisode(data);
        setSeries(data.series);
        setTorrents(data.torrents || []);

        // 获取所有分集列表
        if (data.seriesId) {
          const epResp = await SeriesService.seriesEpisodesControllerList({
            seriesId: data.seriesId,
          });
          // 注意：如果 EpisodeDTO 缺少 ID，这里可能需要后端配合或检查实际返回数据
          setAllEpisodes((epResp.data?.items as any as EpisodeListItem[]) || []);
        }
      } catch (err: any) {
        console.error("Failed to fetch episode detail:", err);
        setError(err.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [episodeId]);

  return { series, episode, torrents, allEpisodes, loading, error };
}
