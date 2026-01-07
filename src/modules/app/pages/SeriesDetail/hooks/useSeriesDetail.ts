import { useState, useEffect } from "react";
import { SeriesService } from "@/api/services/SeriesService";
import { EpisodesService } from "@/api/services/EpisodesService";
import type { SeriesDetailDto } from "@/api/models/SeriesDetailDto";
import type { EpisodeDTO } from "@/api/models/EpisodeDTO";

export interface EpisodeListItem extends EpisodeDTO {
  id: string;
}

export function useSeriesDetail(seriesId?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<SeriesDetailDto | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeListItem[]>([]);

  useEffect(() => {
    if (!seriesId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 获取剧集详情
        const resp = await SeriesService.seriesBaseControllerGetDetail({
          id: seriesId,
        });
        const data = resp.data;

        if (!data) {
          throw new Error("剧集不存在");
        }

        setSeries(data);

        // 获取分集列表
        const epResp = await EpisodesService.episodeBaseControllerList({
          seriesId: seriesId,
        });
        setEpisodes((epResp.data?.items as any as EpisodeListItem[]) || []);
      } catch (err: any) {
        console.error("Failed to fetch series detail:", err);
        setError(err.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seriesId]);

  return { series, episodes, loading, error };
}
