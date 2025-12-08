import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaylistsService } from '@/api';
import type { PlaylistDetail, PlaylistFilm } from '../types';

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
        const resp: any = await PlaylistsService.playlistsControllerGet({ id: playlistId });
        const raw = resp?.data ?? resp;
        const adapted: PlaylistDetail = {
          id: raw?.id ?? playlistId,
          title: raw?.name ?? '',
          description: raw?.description ?? '',
          coverImage: raw?.coverUrl ?? raw?.backdropUrl ?? '',
          creator: '',
          creatorAvatar: '',
          moviesCount: Array.isArray(raw?.films) ? raw.films.length : 0,
          followersCount: Number(raw?.stats?.likes ?? 0),
          viewsCount: Number(raw?.stats?.views ?? 0),
          rating: 0,
          createdAt: raw?.meta?.createdAt ?? '',
          updatedAt: raw?.meta?.updatedAt ?? '',
          tags: Array.isArray(raw?.tags) ? raw.tags : [],
          films: raw?.films ?? [],
          isLiked: false,
        };
        if (!mounted) return;
        setPlaylist(adapted);
        setIsFollowing(!!adapted.isLiked);
        try {
          await PlaylistsService.playlistsControllerIncViews({ id: playlistId });
          setPlaylist((prev) => (prev ? { ...prev, viewsCount: Number(prev.viewsCount ?? 0) + 1 } : prev));
        } catch {
          // 忽略统计失败
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? '加载失败');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [playlistId, reloadKey]);

  // 适配影片项，确保 id 稳定为 filmId
  useEffect(() => {
    const rawFilms: any[] = (playlist?.films ?? []) as any[];
    const adapted = rawFilms.map((f: any, idx: number): PlaylistFilm => ({
      id: String(f?.filmId ?? f?.id ?? idx),
      title: f?.title ?? '',
      originalTitle: f?.originalTitle ?? '',
      year: Number(f?.year ?? 0),
      director: f?.director ?? '',
      poster: f?.poster ?? f?.posterUrl ?? '',
      backdrop: f?.backdrop ?? f?.backdropUrl ?? '',
      rating: Number(f?.rating ?? 0),
      genre: Array.isArray(f?.genre) ? f.genre : Array.isArray(f?.genres) ? f.genres : [],
      duration: Number(f?.duration ?? 0),
      torrentsCount: Number(f?.torrentsCount ?? (Array.isArray(f?.torrents) ? f.torrents.length : 0)),
      sort: Number(f?.sort ?? idx),
      torrents: f?.torrents ?? [],
    }));
    setMovies(adapted);
  }, [playlist]);

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
      await PlaylistsService.playlistsControllerLike({ id: playlistId });
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
    qs.set('source_playlist_id', String(playlistId));
    navigate(`/film/${id}?${qs.toString()}`, { replace: false });
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

