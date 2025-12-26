
import { useState, useEffect } from "react";
import { ReviewType } from "@/pages/Review/types";
import { TorrentsSearchService } from "@/api/services/TorrentsSearchService";
import { MoviesService } from "@/api/services/MoviesService";
import { MoviesTorrentsService } from "@/api/services/MoviesTorrentsService";
import { PlaylistsService } from "@/api/services/PlaylistsService";
import { PlaylistsItemsService } from "@/api/services/PlaylistsItemsService";

// 引用目标 Body 组件所需的类型
import { TorrentData, FileItem, Comment } from "@/pages/TorrentDetail/types";
import { FilmDetail, TorrentItem as MovieTorrentItem } from "@/pages/MovieDetail/types";
import { PlaylistDetail, PlaylistFilm } from "@/pages/PlaylistDetail/types";

// ============================================
// Types
// ============================================

export interface ReviewDetailState {
  // 联合类型，根据 type 区分
  torrent?: {
    data: TorrentData;
    fileList: FileItem[];
    mediaInfo: string;
    stills: string[];
    comments: Comment[];
  };
  movie?: {
    detail: FilmDetail;
  };
  playlist?: {
    detail: PlaylistDetail;
    movies: PlaylistFilm[];
  };
}

// ============================================
// Helpers (复用前台的映射逻辑)
// ============================================

const str = (v: any) => String(v ?? "");
const num = (v: any) => Number(v ?? 0);
const arr = (v: any) => (Array.isArray(v) ? v : []);

// ============================================
// Hook
// ============================================

export function useReviewItemDetail(id: string, type: ReviewType) {
  const [data, setData] = useState<ReviewDetailState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !type) return;

    let mounted = true;
    setLoading(true);
    setError(null);
    setData(null); // 清空上一次数据

    const load = async () => {
      try {
        if (type === "torrent") {
          // 1. Torrent Logic
          // 复用 useTorrentDownload / TorrentDetailPage 的逻辑
          const resp = await TorrentsSearchService.torrentSearchControllerDetail({ id });
          const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
          const raw = body?.data ?? body;

          if (!mounted) return;

          // Map TorrentData
          const torrentData: TorrentData = {
            id: Number(raw?.id),
            title: str(raw?.title),
            subTitle: str(raw?.subTitle),
            category: str(raw?.category),
            videoCodec: str(raw?.videoCodec),
            standard: str(raw?.standard),
            audioCodec: str(raw?.audioCodec),
            medium: str(raw?.source),
            productionTeam: str(raw?.productionTeam),
            size: str(raw?.size),
            uploadDate: str(raw?.uploadDate),
            seeders: num(raw?.seeders),
            leechers: num(raw?.leechers),
            completed: num(raw?.completed),
            comments: num(raw?.comments),
            thanks: num(raw?.thanks),
            rating: num(raw?.rating),
            imdb: str(raw?.imdb),
            douban: str(raw?.douban),
            uploader: str(raw?.uploader),
            uploaderLevel: str(raw?.uploaderLevel),
            isFree: Boolean(raw?.isFree),
            promotionEnd: str(raw?.promotionEnd),
            views: num(raw?.views),
            description: str(raw?.description),
            downloadUrl: str(raw?.downloadUrl ?? raw?.downloadURL),
            isFavorited: !!raw?.isFavorited,
          };

          // Map FileList
          let rawFiles: any[] = [];
          try {
             if (typeof raw?.multiFileList === "string") {
                rawFiles = JSON.parse(raw.multiFileList);
             } else if (Array.isArray(raw?.multiFileList)) {
                rawFiles = raw.multiFileList;
             }
          } catch(e) {}

          const fileList: FileItem[] = rawFiles.map((f: any) => {
             if (typeof f === "string") return { name: f, size: "", type: "file" };
             return { name: str(f?.name), size: str(f?.size), type: "file" };
          });
          
          // Map Comments
          const comments: Comment[] = arr(raw?.comments).map((c: any, i: number) => ({
             id: c?.id ?? i,
             user: str(c?.user ?? c?.username),
             userLevel: str(c?.userLevel),
             avatar: str(c?.avatar),
             date: str(c?.date),
             content: str(c?.content),
             thanks: num(c?.thanks),
          }));

          setData({
            torrent: {
              data: torrentData,
              fileList,
              mediaInfo: str(raw?.mediaInfo),
              stills: arr(raw?.stills).map((s: any) => str(s)),
              comments,
            },
          });

        } else if (type === "movie" || type === "series") {
          // 2. Movie/Series Logic (Series 也可以用 MovieDetailBody 展示，核心结构类似)
          // 注意：如果 series 结构差异大，可能需要单独适配，但通常 MovieDetailBody 通用
          
          // Promise.all 并行拉取详情和种子列表
          const [detailResp, torrentsResp] = await Promise.all([
             MoviesService.movieBaseControllerGetDetail({ id } as any),
             MoviesTorrentsService.movieTorrentsControllerListTorrents({ id })
          ]);

          if (!mounted) return;

          const detailBody: any = (detailResp as any)?.data ?? detailResp; // 适配不同响应结构
          const rawDetail = detailBody?.data ?? detailBody;

          const torrentsBody: any = (torrentsResp as any)?.data ?? torrentsResp;
          const rawTorrents = torrentsBody?.data ?? torrentsBody?.items ?? [];

          // Map Torrent List (for Movie)
          const torrents: MovieTorrentItem[] = arr(rawTorrents).map((t: any) => ({
             id: str(t?.id ?? t?.torrentId),
             title: str(t?.version ?? t?.title ?? t?.quality),
             subTitle: str(t?.subTitle),
             category: str(t?.category ?? rawDetail?.category),
             image: str(t?.ThumbCoverPath ?? t?.cover),
             size: str(t?.size),
             seeders: num(t?.seeders),
             leechers: num(t?.leechers),
             completed: 0,
             uploader: str(t?.uploader),
             uploadTime: str(t?.uploadedAt),
             uploadDate: str(t?.uploadedAt),
             isFree: Boolean(t?.isFree),
             isVip: Boolean(t?.isVip),
             isHot: false,
             comments: 0,
             rating: num(rawDetail?.rating),
          }));

          // Map FilmDetail
          const filmDetail: FilmDetail = {
             id: str(rawDetail?.id),
             title: str(rawDetail?.title),
             subtitle: str(rawDetail?.originalTitle),
             poster: str(rawDetail?.poster ?? rawDetail?.posterUrl),
             backdrop: str(rawDetail?.backdrop ?? rawDetail?.backdropUrl),
             category: str(rawDetail?.category),
             subCategory: str(rawDetail?.subCategory),
             year: num(rawDetail?.year),
             duration: str(rawDetail?.duration),
             director: str(rawDetail?.director),
             cast: arr(rawDetail?.cast),
             imdb: str(rawDetail?.imdbLink),
             douban: str(rawDetail?.doubanLink),
             rating: num(rawDetail?.rating),
             ratingCount: num(rawDetail?.ratingCount),
             description: str(rawDetail?.description),
             stills: arr(rawDetail?.stills),
             awards: arr(rawDetail?.awards).map((a:any) => ({ name: str(a), won: false, year:'', category:'' })),
             size: '',
             files: 0,
             seeders: 0,
             leechers: 0,
             completed: 0,
             uploadDate: '',
             uploader: { name: '', avatar: '', level: '', uploads: 0, ratio: '' },
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
             views: num(rawDetail?.viewsCount),
             bookmarks: num(rawDetail?.collectionsCount),
             thanks: 0,
             comments: [], // 暂时留空
             relatedTorrents: [],
             otherVersions: [],
             torrents, // 注入关联种子
             isFavorited: !!rawDetail?.isFavorited,
          };

          setData({ movie: { detail: filmDetail } });

        } else if (type === "playlist") {
          // 3. Playlist Logic
          const [detailResp, itemsResp] = await Promise.all([
             PlaylistsService.playlistCoreControllerGet({ id }),
             PlaylistsItemsService.playlistItemsControllerListItems({ playlistId: id, page: 1, limit: 100 })
          ]);
          
          if (!mounted) return;

          const rawDetail: any = (detailResp as any)?.data ?? detailResp;
          const rawItems = (itemsResp as any)?.data?.items ?? [];

          const playlistDetail: PlaylistDetail = {
             id: str(rawDetail?.id),
             title: str(rawDetail?.name),
             description: str(rawDetail?.description),
             coverImage: str(rawDetail?.coverUrl ?? rawDetail?.backdropUrl),
             creator: '', // 接口可能缺省
             creatorAvatar: '',
             moviesCount: rawItems.length,
             followersCount: num(rawDetail?.stats?.likes),
             viewsCount: num(rawDetail?.stats?.views),
             rating: 0,
             createdAt: str(rawDetail?.meta?.createdAt),
             updatedAt: str(rawDetail?.meta?.updatedAt),
             tags: arr(rawDetail?.tags),
             films: [],
             isLiked: false,
             isFavorited: !!rawDetail?.isFavorited,
          };

          const movies: PlaylistFilm[] = rawItems.map((f: any) => ({
             id: str(f?.itemId),
             title: str(f?.title),
             originalTitle: str(f?.originalTitle),
             year: num(f?.year),
             director: '',
             poster: str(f?.posterUrl),
             backdrop: '',
             rating: num(f?.rating),
             genre: [f?.itemType === 'series' ? '剧集' : '电影'],
             duration: 0,
             torrentsCount: 0,
             sort: num(f?.sort),
             torrents: [],
             itemType: f?.itemType ?? 'movie',
             episodeCount: f?.episodeCount,
          }));

          setData({ playlist: { detail: playlistDetail, movies } });
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "加载详情失败");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [id, type]);

  return { data, loading, error };
}
