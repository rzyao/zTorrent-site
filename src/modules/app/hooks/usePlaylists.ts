import { useState, useCallback } from 'react';
import { PlaylistsService } from '@/api/services/PlaylistsService';
import { PlaylistsItemsService } from '@/api/services/PlaylistsItemsService';

function unwrap(response: any) {
  const body = response?.code !== undefined ? response : response?.data ?? response;
  const code = body?.code ?? 0;
  if (code !== 1000 && code !== 0) {
    const msg = body?.data?.message || body?.message || '请求失败';
    throw new Error(msg);
  }
  return body?.data ?? body;
}

export function usePlaylists() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const listPlaylists = useCallback(async (params: { 
    listType?: 'public' | 'mine' | 'following'; 
    page?: number; 
    limit?: number; 
    keyword?: string | null; 
    type?: 'movie' | 'series' | 'adult' | 'music'; 
    visibility?: 'public' | 'private'; 
    ownerUserId?: string | null; 
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistCoreControllerList(params || {} as any);
      const data = unwrap(res);
      setItems(data?.items ?? []);
      setTotal(data?.total ?? 0);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '获取片单列表失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlaylist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistCoreControllerGet({ id });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '获取片单详情失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPlaylist = useCallback(async (payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistCoreControllerCreate(payload);
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '创建片单失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePlaylist = useCallback(async (id: string, payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistCoreControllerUpdate({ id, ...payload });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '更新片单失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePlaylist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsService.playlistCoreControllerDelete({ id });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '删除片单失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFilm = useCallback(async (playlistId: string, filmId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsItemsService.playlistItemsControllerAddItem({
        playlistId,
        itemId: filmId,
        itemType: 'movie' as any,
      });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '添加影片到片单失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFilm = useCallback(async (playlistId: string, filmId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsItemsService.playlistItemsControllerRemoveItem({
        playlistId,
        itemId: filmId,
        itemType: 'movie' as any,
      });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '从片单移除影片失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 片单内影片排序：按照给定的 filmId 顺序更新排序
  // 说明：后端已按文档更新为提交 order: string[]，返回最新 films 列表或完整 PlaylistDTO
  const reorderFilm = useCallback(async (playlistId: string, order: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsItemsService.playlistItemsControllerReorderItems({
        playlistId,
        order: order.map(id => ({
          itemId: id,
          itemType: 'movie' as any,
        })),
      });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '片单影片排序失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listItems = useCallback(async (params: { playlistId: string; page?: number; limit?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsItemsService.playlistItemsControllerListItems(params);
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '获取片单内容失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchAddableItems = useCallback(async (params: { playlistId: string; page?: number; limit?: number; keyword?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PlaylistsItemsService.playlistItemsControllerSearchAddableItems(params);
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '搜索可添加内容失败';
      setError(msg);
      throw new Error(msg);
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
    listItems,
    searchAddableItems,
    items,
    total,
    isLoading,
    error,
  };
}
