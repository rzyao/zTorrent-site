
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { TorrentsReviewService } from '@/api/services/TorrentsReviewService';
import { MoviesReviewService } from '@/api/services/MoviesReviewService';
import { SeriesService } from '@/api/services/SeriesService';
import { PlaylistsReviewService } from '@/api/services/PlaylistsReviewService';
import { EpisodesService } from '@/api/services/EpisodesService';
import { SettingsService } from '@/api/services/SettingsService';
import { AuditService } from '@/api/services/AuditService';
import { unwrapResponse } from '../utils';
import type { ReviewItem, ReviewType, ReviewStatus, AuditHistory } from '../types';
import { ReviewHistoryDto } from '@/api/models/ReviewHistoryDto';
import { AuditHistoryDto } from '@/api/models/AuditHistoryDto';

// Mappers
const mapTorrent = (it: any): ReviewItem => ({
  id: String(it?.id ?? ''),
  type: 'torrent',
  title: String(it?.title ?? it?.name ?? '未命名种子'),
  submitter: String(it?.uploader?.username ?? it?.uploaderName ?? '未知'),
  submitterAvatar: it?.uploader?.avatar,
  submitterReputation: Number(it?.uploader?.reputation ?? 0),
  submitDate: String(it?.uploadedAt ?? it?.createdAt ?? ''),
  status: (String(it?.approvalStatus ?? 'pending') as any),
  category: String(it?.category ?? ''),
  description: String(it?.description ?? ''),
  visibility: (it?.visibility as any) ?? 'public',
  missingFields: Array.isArray(it?.missingFields) ? it.missingFields : undefined,
  sensitiveWords: Array.isArray(it?.sensitiveWords) ? it.sensitiveWords : undefined,
  screenshots: Array.isArray(it?.screenshots) ? it.screenshots : undefined,
});

const mapMovie = (it: any): ReviewItem => ({
  id: String(it?.id ?? ''),
  type: 'movie',
  title: String(it?.title ?? '未命名影片'),
  submitter: String(it?.uploader?.username ?? it?.uploaderName ?? '未知'),
  submitterAvatar: it?.uploader?.avatar,
  submitterReputation: Number(it?.uploader?.reputation ?? 0),
  submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ''),
  status: (String(it?.approvalStatus ?? 'pending') as any),
  category: String(it?.category ?? ''),
  description: String(it?.description ?? ''),
  image: String(it?.posterUrl ?? ''),
  rating: Number(it?.rating ?? it?.imdbRating ?? 0),
  year: String(it?.year ?? ''),
  visibility: (it?.visibility as any) ?? 'public',
});

const mapSeries = (it: any): ReviewItem => ({
  id: String(it?.id ?? ''),
  type: 'series',
  title: String(it?.title ?? '未命名剧集'),
  submitter: String(it?.uploader?.username ?? it?.uploaderName ?? it?.creator ?? '未知'),
  submitterAvatar: it?.uploader?.avatar,
  submitterReputation: Number(it?.uploader?.reputation ?? 0),
  submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ''),
  status: (String(it?.approvalStatus ?? 'pending') as any),
  category: String(it?.category ?? ''),
  description: String(it?.description ?? ''),
  image: String(it?.posterUrl ?? ''),
  rating: Number(it?.rating ?? 0),
  year: String(it?.year ?? ''),
  visibility: (it?.visibility as any) ?? 'public',
});

const mapPlaylist = (it: any): ReviewItem => ({
  id: String(it?.id ?? ''),
  type: 'playlist',
  title: String(it?.title ?? it?.name ?? '未命名片单'),
  submitter: String(it?.creator?.username ?? it?.owner?.username ?? it?.ownerUsername ?? '未知'),
  submitterAvatar: it?.creator?.avatarUrl ?? it?.owner?.avatar,
  submitterReputation: Number(it?.creator?.reputation ?? it?.owner?.reputation ?? 0),
  submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ''),
  status: (String(it?.approvalStatus ?? 'pending') as any),
  category: String(it?.type ?? ''),
  description: String(it?.description ?? ''),
  image: String(it?.coverUrl ?? ''),
  visibility: (it?.visibility as any) ?? 'public',
});

type FetchParams = {
  type: ReviewType;
  status: ReviewStatus;
  page: number;
  limit: number;
  keyword?: string;
};

export function useReviewItems({ type, status, page, limit, keyword }: FetchParams) {
  return useQuery({
    queryKey: ['review', 'items', type, status, page, limit, keyword],
    queryFn: async () => {
      let items: ReviewItem[] = [];
      let total = 0;

      if (type === 'torrent') {
        if (status === 'pending') {
          const resp = await TorrentsReviewService.torrentReviewControllerPending({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map(mapTorrent);
          total = data?.total || 0;
        } else {
          const historyStatus = status === 'approved' ? ReviewHistoryDto.status.APPROVED : ReviewHistoryDto.status.REJECTED;
          const resp = await TorrentsReviewService.torrentReviewControllerReviewHistory({
            page, limit, status: historyStatus, keyword
          });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map(mapTorrent);
          total = data?.total || 0;
        }
      } else if (type === 'movie') {
        if (status === 'pending') {
          const resp = await MoviesReviewService.movieReviewControllerListPending({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map(mapMovie);
          total = data?.total || 0;
        } else {
           const resp = await MoviesReviewService.movieReviewControllerReviewHistory({
             page, limit, 
             status: status === 'approved' ? 'approved' : 'rejected'
           } as any);
           const data = unwrapResponse(resp);
           items = (data?.items || []).map(mapMovie);
           total = data?.total || 0;
        }
      } else if (type === 'series') {
        if (status === 'pending') {
          const resp = await SeriesService.seriesReviewControllerListPending({ page, limit });
          const data = unwrapResponse(resp);
          // Pending items map from PendingSeriesItemDto
          items = (data?.items || []).map(mapSeries);
          total = data?.total || 0;
        } else {
          // Attempt global history list (casting to any as DTO might be outdated or strict)
          const resp = await SeriesService.seriesReviewControllerHistory({
             page, limit,
             status: status === 'approved' ? 'approved' : 'rejected'
          } as any);
          const data = unwrapResponse(resp);
          items = (data?.items || []).map(mapSeries);
          total = data?.total || 0;
        }
      } else if (type === 'playlist') {
        if (status === 'pending') {
          const resp = await PlaylistsReviewService.playlistReviewControllerPending({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map(mapPlaylist);
          total = data?.total || 0;
        } else {
           // Use the specialized review history endpoint for playlists
           const resp = await PlaylistsReviewService.playlistReviewControllerHistory({
             page, limit,
             status: status === 'approved' ? 'approved' : 'rejected'
           } as any);
           const data = unwrapResponse(resp);
           items = (data?.items || []).map(mapPlaylist);
           total = data?.total || 0;
        }
      }

      return { items, total };
    },
    placeholderData: keepPreviousData,
  });
}

export function useReviewCounts() {
  return useQuery({
    queryKey: ['review', 'counts'],
    queryFn: async () => {
      const [torrentResp, movieResp, seriesResp, playlistResp] = await Promise.all([
        TorrentsReviewService.torrentReviewControllerPending({ page: 1, limit: 1 }),
        MoviesReviewService.movieReviewControllerListPending({ page: 1, limit: 1 }),
        SeriesService.seriesReviewControllerListPending({ page: 1, limit: 1 }),
        PlaylistsReviewService.playlistReviewControllerPending({ page: 1, limit: 1 }),
      ]);

      return {
        torrent: unwrapResponse(torrentResp)?.total ?? 0,
        movie: unwrapResponse(movieResp)?.total ?? 0,
        series: unwrapResponse(seriesResp)?.total ?? 0,
        playlist: unwrapResponse(playlistResp)?.total ?? 0,
      };
    },
  });
}

export function useReviewSwitches() {
  return useQuery({
    queryKey: ['review', 'switches'],
    queryFn: async () => {
      const resp = await SettingsService.settingsControllerGetReviewSwitches({});
      const data = unwrapResponse(resp);
      return {
        movie: Boolean(data?.movieReview),
        series: Boolean(data?.seriesReview),
        playlist: Boolean(data?.playlistReview),
        torrent: Boolean(data?.torrentReview),
      };
    },
  });
}

export function useReviewItemHistory(id: string | undefined, type: ReviewType | undefined) {
    return useQuery({
        queryKey: ['review', 'history', type, id],
        queryFn: async () => {
            if (!id || !type) return [];
            
            const typeKey = (type === 'movie' || type === 'series') ? AuditHistoryDto.type.FILM : 
                             type === 'playlist' ? AuditHistoryDto.type.PLAYLIST : 
                             AuditHistoryDto.type.TORRENT;

            const resp = await AuditService.auditControllerHistory({
                type: typeKey,
                resourceId: id,
            });
            const data = unwrapResponse(resp);
            const items = data?.items || [];
            
            return items.map((h: any, idx: number) => ({
                id: String(idx), // Audit items might not have IDs in response based on type definition? Warning: original code used h.id ?? idx
                reviewer: String(h?.reviewer ?? ''),
                action: (String(h?.action ?? '').toLowerCase() === 'approved' ? 'approved' : 'rejected') as 'approved'|'rejected',
                date: String(h?.timestamp ?? ''),
                notes: String(h?.note ?? ''),
            } as AuditHistory));
        },
        enabled: !!id && !!type,
    });
}
