import { useEffect, useState } from 'react';
import { MoviesService } from '@/api/services/MoviesService';
import { MoviesTorrentsService } from '@/api/services/MoviesTorrentsService';
import type { FilmDetail, TorrentItem } from '../types';

/**
 * useFilmDetail
 * - 负责影片详情与关联种子列表的数据拉取与映射
 * - 隐藏后端返回结构差异，统一为页面渲染所需的 `FilmDetail` 结构
 */
export function useFilmDetail(filmId?: string) {
  const [detail, setDetail] = useState<FilmDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 简易的容错转换工具：确保数值/字符串/数组稳定
  const num = (v: any) => Number(v ?? 0);
  const str = (v: any) => String(v ?? '');
  const arr = (v: any) => (Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : []);

  // 默认背景图：后端为空时保障 UI 观感
  const defaultBackdrop = 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=1920';

  // 将后端原始数据映射为统一的 FilmDetail 结构
  const mapDetail = (raw: any): FilmDetail => {
    return {
      id: str(raw?.id),
      title: str(raw?.title),
      subtitle: str(raw?.originalTitle),
      poster: str(raw?.poster ?? raw?.posterUrl ?? ''),
      backdrop: str(raw?.backdrop ?? raw?.backdropUrl ?? defaultBackdrop),
      category: str(raw?.category),
      subCategory: '',
      year: Number(raw?.year ?? 0),
      duration: raw?.duration != null ? `${raw?.duration}分钟` : '',
      director: str(raw?.director),
      cast: arr(raw?.cast),
      imdb: str(raw?.imdbLink ?? ''),
      douban: str(raw?.doubanLink ?? ''),
      rating: num(raw?.rating),
      ratingCount: num(raw?.ratingCount),
      description: str(raw?.description),
      stills: arr(raw?.stills),
      awards: Array.isArray(raw?.awards)
        ? raw.awards.map((a: any) => ({ name: String(a), won: false, year: '', category: '' }))
        : [],
      size: '',
      files: 0,
      seeders: 0,
      leechers: 0,
      completed: 0,
      uploadDate: '',
      uploader: {
        name: '',
        avatar: '',
        level: '',
        uploads: 0,
        ratio: '',
      },
      isFree: false,
      isHot: false,
      isVip: false,
      videoCodec: '',
      videoResolution: '',
      videoFrameRate: '',
      videoBitRate: '',
      audioCodec: '',
      audioBitRate: '',
      audioLanguages: [],
      subtitles: [],
      fileList: [],
      views: num(raw?.viewsCount),
      bookmarks: num(raw?.collectionsCount),
      thanks: 0,
      comments: [],
      relatedTorrents: [],
      otherVersions: Array.isArray(raw?.torrents)
        ? raw.torrents.map((t: any) => ({ id: t?.id, title: t?.quality ?? '', seeders: t?.seeders ?? 0, size: t?.size ?? '' }))
        : [],
      torrents: [],
      isFavorited: !!raw?.isFavorited,
    };
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!filmId) return;
      try {
        setLoading(true);
        // 1) 拉取影片详情
        const resp = await MoviesService.movieBaseControllerGetDetail({ id: String(filmId) } as any);
        const body = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
        const data = body?.data ?? body;
        if (!cancelled) setDetail(mapDetail(data));

        // 2) 拉取关联的种子列表（不阻断页面展示）
        try {
          const listResp: any = await MoviesTorrentsService.movieTorrentsControllerListTorrents({ id: String(filmId) });
          const listBody = listResp?.code !== undefined ? listResp : listResp?.data ?? listResp;
          const items = listBody?.data ?? listBody?.items ?? [];
          if (!cancelled) {
            setDetail((prev) => {
              if (!prev) return prev;
              const mapped: TorrentItem[] = Array.isArray(items)
                ? items.map((t: any) => ({
                    id: String(t?.id ?? t?.torrentId ?? ''),
                    title: String(t?.version ?? t?.title ?? t?.quality ?? ''),
                    subTitle: String(t?.subTitle ?? t?.subtitle ?? ''),
                    category: String(t?.category ?? prev?.category ?? ''),
                    image: String(
                      t?.ThumbCoverPath ??
                      t?.MediumCoverPath ??
                      t?.cover ??
                      t?.originalCoverUrl ??
                      ''
                    ),
                    size: String(t?.size ?? ''),
                    seeders: Number(t?.seeders ?? 0),
                    leechers: Number(t?.leechers ?? 0),
                    completed: 0,
                    uploader: String(t?.uploader ?? ''),
                    uploadTime: String(t?.uploadedAt ?? t?.uploadDate ?? ''),
                    uploadDate: String(t?.uploadedAt ?? t?.uploadDate ?? ''),
                    isFree: Boolean(t?.isFree ?? false),
                    isVip: Boolean(t?.isVip ?? false),
                    isHot: false,
                    comments: 0,
                    rating: Number(prev?.rating ?? 0),
                  }))
                : [];
              return { ...prev, torrents: mapped };
            });
          }
        } catch {
          // 忽略列表错误，保持空数组即可
        }
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message ?? ''));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [filmId]);

  return { detail, loading, error } as const;
}

