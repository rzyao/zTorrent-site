import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TorrentsReviewService } from "@/api/services/TorrentsReviewService";
import { MoviesReviewService } from "@/api/services/MoviesReviewService";
import { SeriesService } from "@/api/services/SeriesService";
import { PlaylistsReviewService } from "@/api/services/PlaylistsReviewService";
import { EpisodesService } from "@/api/services/EpisodesService";
import { SettingsService } from "@/api/services/SettingsService";
import { AuditService } from "@/api/services/AuditService";
import { unwrapResponse } from "../utils";
import type { ReviewItem, ReviewType, ReviewStatus, AuditHistory } from "../types";
import { AuditHistoryDto } from "@/api/models/AuditHistoryDto";

// Mappers - 接受 status 参数用于已审核列表（新接口不返回 approvalStatus）
const mapTorrent = (it: any, status?: ReviewStatus): ReviewItem => ({
  id: String(it?.id ?? ""),
  type: "torrent",
  title: String(it?.title ?? it?.name ?? "未命名种子"),
  // 优先使用 creator.username（新接口），回退到 uploader.username（旧接口）
  submitter: String(it?.creator?.username ?? it?.uploader?.username ?? it?.uploaderName ?? "未知"),
  submitterAvatar: it?.creator?.avatarUrl ?? it?.uploader?.avatar,
  submitterReputation: Number(it?.uploader?.reputation ?? 0),
  submitDate: String(it?.approvedAt ?? it?.uploadedAt ?? it?.createdAt ?? ""),
  // 优先使用传入的 status（已审核列表），回退到数据中的 approvalStatus
  status: (status ?? String(it?.approvalStatus ?? "pending")) as any,
  category: String(it?.category ?? ""),
  description: String(it?.description ?? ""),
  visibility: (it?.visibility as any) ?? "public",
  missingFields: Array.isArray(it?.missingFields) ? it.missingFields : undefined,
  sensitiveWords: Array.isArray(it?.sensitiveWords) ? it.sensitiveWords : undefined,
  screenshots: Array.isArray(it?.screenshots) ? it.screenshots : undefined,
});

const mapMovie = (it: any, status?: ReviewStatus): ReviewItem => ({
  id: String(it?.id ?? ""),
  type: "movie",
  title: String(it?.title ?? "未命名影片"),
  submitter: String(it?.creator?.username ?? it?.uploader?.username ?? it?.uploaderName ?? "未知"),
  submitterAvatar: it?.creator?.avatarUrl ?? it?.uploader?.avatar,
  submitterReputation: Number(it?.uploader?.reputation ?? 0),
  submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ""),
  status: (status ?? String(it?.approvalStatus ?? "pending")) as any,
  category: String(it?.category ?? ""),
  description: String(it?.description ?? ""),
  image: String(it?.posterUrl ?? ""),
  rating: Number(it?.rating ?? it?.imdbRating ?? 0),
  year: String(it?.year ?? ""),
  visibility: (it?.visibility as any) ?? "public",
});

const mapSeries = (it: any, status?: ReviewStatus): ReviewItem => ({
  id: String(it?.id ?? ""),
  type: "series",
  title: String(it?.title ?? "未命名剧集"),
  submitter: String(it?.creator?.username ?? it?.uploader?.username ?? it?.uploaderName ?? "未知"),
  submitterAvatar: it?.creator?.avatarUrl ?? it?.uploader?.avatar,
  submitterReputation: Number(it?.uploader?.reputation ?? 0),
  submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ""),
  status: (status ?? String(it?.approvalStatus ?? "pending")) as any,
  category: String(it?.category ?? ""),
  description: String(it?.description ?? ""),
  image: String(it?.posterUrl ?? ""),
  rating: Number(it?.rating ?? 0),
  year: String(it?.year ?? ""),
  visibility: (it?.visibility as any) ?? "public",
});

const mapPlaylist = (it: any, status?: ReviewStatus): ReviewItem => {
  // 后端返回结构:
  // - pending 接口: { review: {...}, resource: {...} }
  // - approved/rejected 接口: 扁平结构 { id, title, creator: {username}, ... }
  const resource = it?.resource ?? it;
  const review = it?.review;

  const id = String(resource?.id ?? it?.id ?? "");

  if (!id) {
    console.warn("[mapPlaylist] 缺少 id 字段，原始数据:", it);
  }

  return {
    id,
    type: "playlist",
    title: String(resource?.title ?? resource?.name ?? "未命名片单"),
    // 优先 creator.username（新接口），回退到 review.operator.username
    submitter: String(
      resource?.creator?.username ?? review?.operator?.username ?? resource?.creatorId ?? "未知",
    ),
    submitterAvatar: resource?.creator?.avatarUrl ?? review?.operator?.avatar ?? undefined,
    submitterReputation: 0,
    submitDate: String(resource?.approvedAt ?? review?.createdAt ?? resource?.createdAt ?? ""),
    // 优先使用传入的 status 参数
    status: (status ??
      String(
        review?.newStatus ?? review?.oldStatus ?? resource?.approvalStatus ?? "pending",
      )) as any,
    category: String(resource?.type ?? ""),
    description: String(resource?.description ?? ""),
    image: String(resource?.coverUrl ?? ""),
    visibility: (resource?.visibility as any) ?? "public",
  };
};

type FetchParams = {
  type: ReviewType;
  status: ReviewStatus;
  page: number;
  limit: number;
  keyword?: string;
};

export function useReviewItems({ type, status, page, limit, keyword }: FetchParams) {
  return useQuery({
    queryKey: ["review", "items", type, status, page, limit, keyword],
    queryFn: async () => {
      let items: ReviewItem[] = [];
      let total = 0;

      if (type === "torrent") {
        if (status === "pending") {
          const resp = await TorrentsReviewService.torrentReviewControllerPending({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapTorrent(it));
          total = data?.total || 0;
        } else if (status === "approved") {
          const resp = await TorrentsReviewService.torrentReviewControllerApproved({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapTorrent(it, "approved"));
          total = data?.total || 0;
        } else {
          const resp = await TorrentsReviewService.torrentReviewControllerRejected({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapTorrent(it, "rejected"));
          total = data?.total || 0;
        }
      } else if (type === "movie") {
        if (status === "pending") {
          const resp = await MoviesReviewService.movieReviewControllerListPending({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapMovie(it));
          total = data?.total || 0;
        } else if (status === "approved") {
          const resp = await MoviesReviewService.movieReviewControllerApproved({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapMovie(it, "approved"));
          total = data?.total || 0;
        } else {
          const resp = await MoviesReviewService.movieReviewControllerRejected({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapMovie(it, "rejected"));
          total = data?.total || 0;
        }
      } else if (type === "series") {
        if (status === "pending") {
          const resp = await SeriesService.seriesReviewControllerListPending({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapSeries(it));
          total = data?.total || 0;
        } else if (status === "approved") {
          const resp = await SeriesService.seriesReviewControllerApproved({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapSeries(it, "approved"));
          total = data?.total || 0;
        } else {
          const resp = await SeriesService.seriesReviewControllerRejected({ page, limit });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapSeries(it, "rejected"));
          total = data?.total || 0;
        }
      } else if (type === "playlist") {
        if (status === "pending") {
          const resp = await PlaylistsReviewService.playlistReviewControllerPending({
            page,
            limit,
          });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapPlaylist(it));
          total = data?.total || 0;
        } else if (status === "approved") {
          const resp = await PlaylistsReviewService.playlistReviewControllerApproved({
            page,
            limit,
          });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapPlaylist(it, "approved"));
          total = data?.total || 0;
        } else {
          const resp = await PlaylistsReviewService.playlistReviewControllerRejected({
            page,
            limit,
          });
          const data = unwrapResponse(resp);
          items = (data?.items || []).map((it) => mapPlaylist(it, "rejected"));
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
    queryKey: ["review", "counts"],
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
    queryKey: ["review", "switches"],
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
    queryKey: ["review", "history", type, id],
    queryFn: async () => {
      if (!id || !type) return [];

      // 使用新的类型枚举：torrent/movie/series/playlist
      const typeKey =
        type === "movie"
          ? AuditHistoryDto.type.MOVIE
          : type === "series"
            ? AuditHistoryDto.type.SERIES
            : type === "playlist"
              ? AuditHistoryDto.type.PLAYLIST
              : AuditHistoryDto.type.TORRENT;

      const resp = await AuditService.auditControllerHistory({
        type: typeKey,
        resourceId: id,
      });
      const data = unwrapResponse(resp);
      const items = data?.items || [];

      return items.map(
        (h: any) =>
          ({
            id: String(h?.id ?? ""),
            // 从 operator 对象读取用户名
            reviewer: String(h?.operator?.username ?? h?.reviewer ?? "未知"),
            action: (String(h?.action ?? "").toLowerCase() === "approve"
              ? "approved"
              : "rejected") as "approved" | "rejected",
            // 使用 createdAt 字段
            date: String(h?.createdAt ?? h?.timestamp ?? ""),
            notes: String(h?.note ?? ""),
          }) as AuditHistory,
      );
    },
    enabled: !!id && !!type,
  });
}
