import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubtitlesService } from '../../../api/services/SubtitlesService';
import { TorrentsService } from '../../../api/services/TorrentsService';
import type { FilterLanguage, SortBy, Subtitle, TorrentOption, UploadForm } from '../types';
import type { ListSubtitlesDto } from '../../../api/models/ListSubtitlesDto';
import type { UploadSubtitleDto } from '../../../api/models/UploadSubtitleDto';
import type { GetSubtitleDto } from '../../../api/models/GetSubtitleDto';

export interface SubtitlesStats {
  totalSubtitles: number;
  totalDownloads: number;
  totalUploads: number;
  avgRating: number;
}

function unwrap<T>(resp: any): T {
  if (!resp) return resp as T;
  if (typeof resp === 'object' && 'data' in resp && resp.data != null) return resp.data as T;
  return resp as T;
}

export function useSubtitlesRemote(params: {
  searchQuery: string;
  filterLanguage: FilterLanguage;
  sortBy: SortBy;
  page?: number;
  limit?: number;
}) {
  const { searchQuery, filterLanguage, sortBy } = params;
  const [page, setPage] = useState(params.page ?? 1);
  const [limit, setLimit] = useState(params.limit ?? 20);

  const [items, setItems] = useState<Subtitle[]>([]);
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listParams: ListSubtitlesDto = useMemo(() => ({
    search: searchQuery || undefined,
    language: filterLanguage,
    sortBy,
    page,
    limit,
  }), [searchQuery, filterLanguage, sortBy, page, limit]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await SubtitlesService.subtitlesControllerList(listParams);
      const body = unwrap<{ data: Subtitle[]; pagination: { total: number; page: number; limit: number; totalPages: number } } | Subtitle[]>(resp);
      if (Array.isArray(body)) {
        setItems(body);
        setPagination({ total: body.length, page, limit, totalPages: 1 });
      } else {
        setItems(body.data);
        setPagination(body.pagination);
      }
    } catch (e: any) {
      setError(e?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [listParams, page, limit]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const [stats, setStats] = useState<SubtitlesStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const resp = await SubtitlesService.subtitlesControllerStats();
      setStats(unwrap<SubtitlesStats>(resp));
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const [torrentOptions, setTorrentOptions] = useState<TorrentOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const fetchOptions = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const resp = await TorrentsService.torrentsOptionsControllerOptions();
      const body = unwrap<{ data: TorrentOption[] } | TorrentOption[]>(resp);
      setTorrentOptions(Array.isArray(body) ? body : body.data);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const upload = useCallback(async (form: UploadForm) => {
    const dto: UploadSubtitleDto = {
      file: form.file as Blob,
      name: form.name,
      type: form.type as UploadSubtitleDto.type,
      language: form.language,
      torrentId: form.torrentId,
      description: form.description || undefined,
    };
    const resp = await SubtitlesService.subtitlesControllerUpload(dto);
    return unwrap<Subtitle>(resp);
  }, []);

  const [detail, setDetail] = useState<Subtitle | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const fetchDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const resp = await SubtitlesService.subtitlesControllerDetail({ id } as GetSubtitleDto);
      setDetail(unwrap<Subtitle>(resp));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const like = useCallback(async (id: string) => {
    await SubtitlesService.subtitlesControllerLike({ id } as GetSubtitleDto);
  }, []);

  const report = useCallback(async (id: string) => {
    await SubtitlesService.subtitlesControllerReport({ id } as GetSubtitleDto);
  }, []);

  const download = useCallback(async (id: string, filename?: string) => {
    const base = (await import('../../../api/core/OpenAPI')).OpenAPI.BASE;
    const token = await ((await import('../../../api/core/OpenAPI')).OpenAPI.TOKEN?.({ method: 'POST', url: '' } as any) as Promise<string>);
    const resp = await fetch(`${base}/api/subtitles/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ id }),
    });
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `subtitle-${id}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  return {
    items,
    pagination,
    loading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refresh: fetchList,
    stats,
    statsLoading,
    refreshStats: fetchStats,
    torrentOptions,
    optionsLoading,
    upload,
    detail,
    detailLoading,
    fetchDetail,
    like,
    report,
    download,
  };
}
