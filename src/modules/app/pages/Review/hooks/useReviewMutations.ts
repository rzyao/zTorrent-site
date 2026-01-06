
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TorrentsReviewService } from '@/api/services/TorrentsReviewService';
import { MoviesReviewService } from '@/api/services/MoviesReviewService';
import { SeriesService } from '@/api/services/SeriesService';
import { PlaylistsReviewService } from '@/api/services/PlaylistsReviewService';
import { EpisodesService } from '@/api/services/EpisodesService';
import { unwrapResponse } from '../utils';
import type { ReviewType } from '../types';

type ReviewActionParams = {
  id: string;
  type: ReviewType;
  action: 'approve' | 'reject';
  note?: string;
  reasonCode?: string;
};

export function useReviewAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type, action, note, reasonCode }: ReviewActionParams) => {
      const payload = { id, action, note, reasonCode };
      
      let resp;
      if (type === 'torrent') {
        resp = await TorrentsReviewService.torrentReviewControllerReview(payload);
      } else if (type === 'movie') {
        resp = await MoviesReviewService.movieReviewControllerReview(payload as any);
      } else if (type === 'series') {
        resp = await SeriesService.seriesReviewControllerReview(payload as any);
      } else if (type === 'playlist') {
        resp = await PlaylistsReviewService.playlistReviewControllerReview(payload);
      } else {
        throw new Error(`Unsupported review type: ${type}`);
      }
      return unwrapResponse(resp);
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['review', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['review', 'counts'] });
    },
  });
}
