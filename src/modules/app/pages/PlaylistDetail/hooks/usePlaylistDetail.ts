import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistsService } from "@/api/services/PlaylistsService";
import { PlaylistsInteractionService } from "@/api/services/PlaylistsInteractionService";
import { PlaylistsItemsService } from "@/api/services/PlaylistsItemsService";
import type { PlaylistDetail, PlaylistFilm } from "../types";

// 片单详情数据获取与行为封装
// 职责：
// 1) 拉取片单信息并适配为前端使用的 PlaylistDetail
// 2) 将原始 films 适配为 PlaylistFilm 列表（确保使用 filmId 作为主键）
// 3) 处理关注/取消关注与浏览量自增等页面行为
// 4) 暴露打开影片详情的导航方法，统一来源参数
export function usePlaylistDetail(playlistId: string) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [movies, setMovies] = useState<PlaylistFilm[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // 拉取片单信息并适配
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [detailResp, itemsResp] = await Promise.all([
          PlaylistsService.playlistCoreControllerGet({ id: playlistId }),
          PlaylistsItemsService.playlistItemsControllerListItems({
            playlistId,
            page: 1,
            limit: 100,
          }),
        ]);

        const rawDetail: any = (detailResp as any)?.data ?? detailResp;
        const rawItems = itemsResp?.data?.items ?? [];

        if (!mounted) return;

        // 适配详情
        const adaptedDetail: PlaylistDetail = {
          id: rawDetail?.id ?? playlistId,
          title: rawDetail?.name ?? "",
          description: rawDetail?.description ?? "",
          coverImage: rawDetail?.coverUrl ?? rawDetail?.backdropUrl ?? "",
          creator: "",
          creatorAvatar: "",
          moviesCount: rawItems.length, // 使用实际条目数
          followersCount: Number(rawDetail?.stats?.likes ?? 0),
          viewsCount: Number(rawDetail?.stats?.views ?? 0),
          rating: 0,
          createdAt: rawDetail?.meta?.createdAt ?? "",
          updatedAt: rawDetail?.meta?.updatedAt ?? "",
          tags: Array.isArray(rawDetail?.tags) ? rawDetail.tags : [],
          films: [], // 原始 films 已废弃，保持为空
          isLiked: false,
          isFavorited: !!rawDetail?.isFavorited,
        };

        setPlaylist(adaptedDetail);
        setIsFollowing(!!adaptedDetail.isLiked);

        // 适配影片列表
        const adaptedMovies: PlaylistFilm[] = rawItems.map((f: any) => ({
          id: String(f?.itemId ?? ""),
          title: f?.title ?? "",
          originalTitle: f?.originalTitle ?? "",
          year: Number(f?.year ?? 0),
          director: "", // 接口暂缺
          poster: f?.posterUrl ?? "",
          backdrop: "", // 接口暂缺
          rating: Number(f?.rating ?? 0),
          genre: [f?.itemType === "series" ? "剧集" : "电影"], // 使用类型作为默认标签
          duration: 0, // 接口暂缺
          torrentsCount: 0, // 接口暂缺
          sort: Number(f?.sort ?? 0),
          torrents: [], // 接口暂缺
          itemType: f?.itemType ?? "movie",
          episodeCount: f?.episodeCount,
        }));
        setMovies(adaptedMovies);

        try {
          await PlaylistsInteractionService.playlistInteractionControllerIncViews({
            id: playlistId,
          });
          setPlaylist((prev) =>
            prev ? { ...prev, viewsCount: Number(prev.viewsCount ?? 0) + 1 } : prev,
          );
        } catch {
          // 忽略统计失败
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "加载失败");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [playlistId, reloadKey]);

  // 移除旧的 useEffect 适配逻辑，因为上面已经一起处理了

  // 关注/取消关注
  async function toggleFollow() {
    const next = !isFollowing;
    setIsFollowing(next);
    setPlaylist((prev) => {
      if (!prev) return prev;
      const delta = next ? 1 : -1;
      return { ...prev, followersCount: Number(prev.followersCount ?? 0) + delta };
    });
    try {
      await PlaylistsInteractionService.playlistInteractionControllerLike({ id: playlistId });
    } catch {
      // 回滚本地状态
      setIsFollowing(!next);
      setPlaylist((prev) => {
        if (!prev) return prev;
        const delta = next ? -1 : 1;
        return { ...prev, followersCount: Number(prev.followersCount ?? 0) + delta };
      });
    }
  }

  // 打开影片详情，统一带上来源追踪参数
  function openFilm(id: string) {
    const qs = new URLSearchParams();
    qs.set("source_playlist_id", String(playlistId));
    navigate(`/app/movie/${id}?${qs.toString()}`, { replace: false });
  }

  return {
    loading,
    error,
    playlist,
    movies,
    isFollowing,
    toggleFollow,
    reload: () => setReloadKey((v) => v + 1),
    openFilm,
  };
}
