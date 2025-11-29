import { useState, useCallback } from 'react';
import { PlaylistsService } from '@/api/services/PlaylistsService';

function unwrap(response: any) {
  const body = response?.code !== undefined ? response : response?.data ?? response;
  const code = body?.code ?? 0;
  if (code !== 1000 && code !== 0) {
    const msg = body?.message || '请求失败';
    throw new Error(msg);
  }
  return body?.data ?? body;
}

export function usePlaylists() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const listPlaylists = useCallback(async (params: { page?: number; limit?: number; keyword?: string | null; type?: 'general' | 'topic' | 'series' | 'director' | 'curation'; visibility?: 'public' | 'private' | 'friends'; ownerUserId?: string | null; }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistsControllerList(params || {} as any);
      const data = unwrap(res);
      setItems(data?.items ?? []);
      setTotal(data?.total ?? 0);
      return data;
    } catch (e: any) {
      setError(e.message || '获取片单列表失败');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlaylist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistsControllerGet({ id });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      setError(e.message || '获取片单详情失败');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPlaylist = useCallback(async (payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistsControllerCreate(payload);
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      setError(e.message || '创建片单失败');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePlaylist = useCallback(async (id: string, payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistsControllerUpdate({ id, data: payload });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      setError(e.message || '更新片单失败');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePlaylist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistsControllerDelete({ id });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      setError(e.message || '删除片单失败');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFilm = useCallback(async (playlistId: string, filmId: string, sort?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistsControllerAddFilm({ playlistId, filmId, sort });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      setError(e.message || '添加影片到片单失败');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFilm = useCallback(async (playlistId: string, filmId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistsControllerRemoveFilm({ playlistId, filmId });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      setError(e.message || '从片单移除影片失败');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reorderFilm = useCallback(async (playlistId: string, filmId: string, sort: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistsControllerReorder({ playlistId, filmId, sort });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      setError(e.message || '片单影片排序失败');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    listPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addFilm,
    removeFilm,
    reorderFilm,
    items,
    total,
    isLoading,
    error,
  };
}

