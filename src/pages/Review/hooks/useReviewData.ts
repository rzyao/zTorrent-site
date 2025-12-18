import { useEffect, useMemo, useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { MoviesService } from '@/api/services/MoviesService';
import { PlaylistsService } from '@/api/services/PlaylistsService';
import { TorrentsService } from '@/api/services/TorrentsService';
import { SettingsService } from '@/api/services/SettingsService';
import { unwrapResponse, extractErrorMessage } from '../utils';
import type { ReviewItem, ReviewStatus, ReviewType } from '../types';

export function useReviewData() {
  useDynamicTitle('审核');

  const [typeFilter, setTypeFilter] = useState<ReviewType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('pending');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [reviewSwitches, setReviewSwitches] = useState<{ film?: boolean; playlist?: boolean; torrent?: boolean }>({});

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const typeMatch = typeFilter === 'all' || item.type === typeFilter;
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      const searchMatch = searchQuery === '' ||
        item.title?.toLowerCase?.().includes(searchQuery.toLowerCase()) ||
        item.submitter?.toLowerCase?.().includes(searchQuery.toLowerCase());
      return typeMatch && statusMatch && searchMatch;
    });
  }, [items, typeFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    pending: items.filter(i => i.status === 'pending').length,
    pendingMovies: items.filter(i => i.status === 'pending' && i.type === 'movie').length,
    pendingPlaylists: items.filter(i => i.status === 'pending' && i.type === 'playlist').length,
    pendingTorrents: items.filter(i => i.status === 'pending' && i.type === 'torrent').length,
    todayApproved: items.filter(i => i.status === 'approved' && (i.submitDate || '').startsWith(new Date().toISOString().slice(0, 10))).length,
    todayRejected: items.filter(i => i.status === 'rejected' && (i.submitDate || '').startsWith(new Date().toISOString().slice(0, 10))).length,
  }), [items]);

  const fetchTorrents = async () => {
    setLoading(true);
    try {
      const rules: any[] = [];
      if (statusFilter !== 'all') {
        rules.push({ field: 'approvalStatus', op: 'Equal', value: statusFilter });
      }
      const resp = await TorrentsService.torrentsControllerListTorrentsForAdmin({
        page,
        limit,
        keyword: searchQuery || undefined,
        sortBy: 'approvedAt',
        order: 'DESC',
        logic: rules.length > 0 ? 'AND' : undefined,
        rules: rules.length > 0 ? rules : undefined,
      } as any);
      const data = unwrapResponse(resp);
      const list: any[] = Array.isArray(data?.items) ? data.items : [];
      const mapped: ReviewItem[] = list.map((it: any) => ({
        id: String(it?.id ?? ''),
        type: 'torrent',
        title: String(it?.title ?? it?.name ?? '未命名种子'),
        submitter: String(it?.uploader?.username ?? it?.uploaderName ?? '未知'),
        submitterReputation: Number(it?.uploader?.reputation ?? 0),
        submitDate: String(it?.uploadedAt ?? it?.createdAt ?? ''),
        status: (String(it?.approvalStatus ?? 'pending') as any),
        category: String(it?.category ?? ''),
        description: String(it?.description ?? ''),
        visibility: (it?.visibility as any) ?? 'public',
        missingFields: Array.isArray(it?.missingFields) ? it.missingFields : undefined,
        sensitiveWords: Array.isArray(it?.sensitiveWords) ? it.sensitiveWords : undefined,
        screenshots: Array.isArray(it?.screenshots) ? it.screenshots : undefined,
      }));
      setItems(mapped);
      setTotal(Number(data?.total ?? mapped.length));
    } catch (e) {
      console.error(extractErrorMessage(e));
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      // TODO: 待后端实现 moviesControllerAdminList API
      // 目前使用普通列表 API
      const resp = await MoviesService.moviesControllerList({
        page,
        limit,
        keyword: searchQuery || undefined,
        // approvalStatus 字段待后端支持
      } as any);
      const data = unwrapResponse(resp);
      const list: any[] = Array.isArray(data?.items) ? data.items : [];
      const mapped: ReviewItem[] = list.map((it: any) => ({
        id: String(it?.id ?? ''),
        type: 'movie',
        title: String(it?.title ?? '未命名影片'),
        submitter: String(it?.uploader?.username ?? it?.uploaderName ?? '未知'),
        submitterReputation: Number(it?.uploader?.reputation ?? 0),
        submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ''),
        status: (String(it?.approvalStatus ?? 'pending') as any),
        category: String(it?.category ?? ''),
        description: String(it?.description ?? ''),
        image: String(it?.posterUrl ?? ''),
        rating: Number(it?.rating ?? it?.imdbRating ?? 0),
        year: String(it?.year ?? ''),
        visibility: (it?.visibility as any) ?? 'public',
      }));
      setItems(mapped);
      setTotal(Number(data?.total ?? mapped.length));
    } catch (e) {
      console.error(extractErrorMessage(e));
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const resp = await PlaylistsService.playlistsControllerAdminList({
        page,
        limit,
        keyword: searchQuery || undefined,
        approvalStatus: statusFilter === 'all' ? undefined : statusFilter,
        sortBy: 'approvedAt',
        order: 'DESC',
      } as any);
      const data = unwrapResponse(resp);
      const list: any[] = Array.isArray(data?.items) ? data.items : [];
      const mapped: ReviewItem[] = list.map((it: any) => ({
        id: String(it?.id ?? ''),
        type: 'playlist',
        title: String(it?.title ?? '未命名片单'),
        submitter: String(it?.owner?.username ?? it?.ownerUsername ?? '未知'),
        submitterReputation: Number(it?.owner?.reputation ?? 0),
        submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ''),
        status: (String(it?.approvalStatus ?? 'pending') as any),
        category: String(it?.type ?? ''),
        description: String(it?.description ?? ''),
        image: String(it?.coverUrl ?? ''),
        visibility: (it?.visibility as any) ?? 'public',
      }));
      setItems(mapped);
      setTotal(Number(data?.total ?? mapped.length));
    } catch (e) {
      console.error(extractErrorMessage(e));
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeFilter === 'torrent') fetchTorrents();
    else if (typeFilter === 'movie') fetchMovies();
    else if (typeFilter === 'playlist') fetchPlaylists();
    else {
      Promise.all([fetchTorrents(), fetchMovies()]).then(() => { });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, statusFilter, searchQuery, page, limit]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await SettingsService.settingsControllerGetReviewSwitches();
        const data = unwrapResponse(resp);
        const film = Boolean(data?.filmReview ?? data?.film);
        const playlist = Boolean(data?.playlistReview ?? data?.playlist);
        const torrent = Boolean(data?.torrentReview ?? data?.torrent);
        if (!cancelled) setReviewSwitches({ film, playlist, torrent });
      } catch (e) {
        console.error(extractErrorMessage(e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return {
    // filters
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    timeRange, setTimeRange,
    searchQuery, setSearchQuery,
    showFilters, setShowFilters,
    // data
    loading, items, setItems,
    filteredItems, stats,
    page, setPage, limit, setLimit, total, setTotal,
    reviewSwitches,
    // fetchers
    fetchTorrents, fetchMovies, fetchPlaylists,
  };
}

