
import { useState, useEffect } from "react";
import { SeriesService } from "@/api/services/SeriesService";
import type { EpisodeDetailResponseDto } from "@/api/models/EpisodeDetailResponseDto";
import type { EpisodeSeriesDetailDto } from "@/api/models/EpisodeSeriesDetailDto";
import type { EpisodeTorrentDetailDto } from "@/api/models/EpisodeTorrentDetailDto";

export function useEpisodeDetail(seriesId?: string, episodeId?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<EpisodeSeriesDetailDto | null>(null);
  const [episode, setEpisode] = useState<EpisodeDetailResponseDto | null>(null);
  const [torrents, setTorrents] = useState<EpisodeTorrentDetailDto[]>([]);

  useEffect(() => {
    if (!episodeId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await SeriesService.seriesEpisodesControllerDetail({ id: episodeId });
        const data = resp.data;
        
        if (!data) {
          throw new Error("分集不存在");
        }
        
        setEpisode(data);
        setSeries(data.series);
        setTorrents(data.torrents || []);

      } catch (err: any) {
        console.error("Failed to fetch episode detail:", err);
        setError(err.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [episodeId]);

  return { series, episode, torrents, loading, error };
}
