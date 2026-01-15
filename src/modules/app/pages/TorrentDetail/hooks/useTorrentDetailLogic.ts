import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TorrentsSearchService } from "@/api/services/TorrentsSearchService";
import { FavoriteActionDto } from "@/api";
import { useFavorite } from "@/modules/app/hooks/useFavorite";
import { formatSize } from "@/utils/format";
import { TorrentData, FileItem, RelatedTorrent, Comment } from "../types";

export function useTorrentDetailLogic(propsId?: string | number) {
  const { id } = useParams();
  const effectiveId = propsId ?? id;
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["torrent", "detail", String(effectiveId)],
    queryFn: async () => {
      const resp = await TorrentsSearchService.torrentSearchControllerDetail({
        id: String(effectiveId),
      });
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const data: any = body?.data ?? body;

      // Safe mapping helpers
      const num = (v: any) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      };
      const str = (v: any) => String(v ?? "");

      // Map TorrentData
      const torrentData: TorrentData = {
        id: data?.id,
        title: str(data?.title),
        subTitle: str(data?.subTitle),
        category: str(data?.category),
        videoCodec: str(data?.videoCodec),
        standard: str(data?.standard),
        audioCodec: str(data?.audioCodec),
        medium: str(data?.source),
        productionTeam: str(data?.productionTeam),
        size: str(data?.size),
        uploadDate: str(data?.uploadDate),
        seeders: num(data?.seeders),
        leechers: num(data?.leechers),
        completed: num(data?.completed),
        comments: num(data?.comments),
        thanks: num(data?.thanks),
        rating: num(data?.rating),
        imdb: str(data?.imdb),
        douban: str(data?.douban),
        uploader: str(data?.uploader),
        uploaderLevel: str(data?.uploaderLevel),
        isFree: Boolean(data?.isFree),
        promotionEnd: str(data?.promotionEnd),
        views: num(data?.views),
        description: str(data?.description),
        downloadUrl: str(
          data?.downloadUrl ?? data?.downloadURL ?? data?.download_link ?? data?.download,
        ),
        isFavorited: !!data?.isFavorited,
      };

      // Map Files
      let rawFiles: any[] = [];
      try {
        if (typeof data?.multiFileList === "string") {
          rawFiles = JSON.parse(data.multiFileList);
        } else if (Array.isArray(data?.multiFileList)) {
          rawFiles = data.multiFileList;
        }
      } catch (e) {
        console.error("Failed to parse multiFileList", e);
      }

      const fileList: FileItem[] = Array.isArray(rawFiles)
        ? rawFiles.map((f: any) => {
            if (typeof f === "string") {
              return {
                name: f,
                size: "未知",
                type: "file" as const,
              };
            }
            return {
              name: str(f?.name),
              size: str(f?.size),
              type: "file" as const,
            };
          })
        : [];

      // Map Related Torrents
      const relatedTorrents: RelatedTorrent[] = Array.isArray(data?.relatedTorrents)
        ? data.relatedTorrents.map((t: any) => ({
            id: t?.id,
            title: str(t?.title ?? ""),
            size: str(t?.size ?? ""),
            seeders: num(t?.seeders ?? 0),
            leechers: num(t?.leechers ?? 0),
            isFree: Boolean(t?.isFree ?? false),
          }))
        : [];

      // Map Stills
      const stills: string[] = Array.isArray(data?.stills)
        ? data.stills.map((s: any) => str(s))
        : [];

      // Map Comments (Initial load from detail usually is empty or partial, but index.tsx was fetching separately too?
      // index.tsx used `comments` from detail response if available, but also called `fetchComments`.
      // The detail API might return some comments. We map them here.)
      const initialComments: Comment[] = Array.isArray(data?.commentsList) // Assuming commentsList or comments
        ? data.commentsList.map((c: any, i: number) => ({
            id: c?.id ?? i,
            user: str(c?.user ?? c?.username ?? ""),
            userLevel: str(c?.userLevel ?? ""),
            avatar: str(c?.avatar ?? ""),
            date: str(c?.date ?? ""),
            content: str(c?.content ?? ""),
            thanks: num(c?.thanks ?? 0),
          }))
        : [];

      // Pre-set favorite cache
      if (data?.isFavorited !== undefined) {
        queryClient.setQueryData(
          ["favorites", "check", FavoriteActionDto.targetType.TORRENT, String(effectiveId)],
          !!data.isFavorited,
        );
      }

      return {
        torrentData,
        fileList,
        relatedTorrents,
        stills,
        mediaInfo: str(data?.mediaInfo),
        initialComments,
      };
    },
    enabled: !!effectiveId,
  });

  // Favorite Logic
  const favorite = useFavorite({
    targetType: FavoriteActionDto.targetType.TORRENT,
    targetId: String(effectiveId),
    enabled: !!effectiveId,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    effectiveId,
    favorite,
  };
}
