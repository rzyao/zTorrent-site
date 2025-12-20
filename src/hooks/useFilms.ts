import { useState, useCallback } from 'react';
import { getMoviesService } from '@/api/lazy';

type FilmFilters = {
  category?: string;
  year?: string;
  ratingMin?: number;
  ratingMax?: number;
  genreIds?: string[];
  enabled?: boolean;
};

function unwrap(response: any) {
  const body = response?.code !== undefined ? response : response?.data ?? response;
  const code = body?.code ?? 0;
  if (code !== 1000 && code !== 0) {
    const msg = body?.data?.message || body?.message || '请求失败';
    throw new Error(msg);
  }
  return body?.data ?? body;
}

export function useFilms() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const listFilms = useCallback(async (params: { page?: number; limit?: number; keyword?: string | null; filters?: FilmFilters }) => {
    setIsLoading(true);
    setError(null);
    try {
      const { page = 1, limit = 20, keyword = '', filters = {} } = params || {};
      const MoviesService = await getMoviesService();
      const res = await MoviesService.moviesControllerList({ page, limit, keyword, ...filters } as any);
      const data = unwrap(res);
      setItems(data?.items ?? []);
      setTotal(data?.total ?? 0);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '获取影片列表失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFilm = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const MoviesService = await getMoviesService();
      const res = await MoviesService.moviesControllerGetDetail({ id } as any);
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '获取影片详情失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFilm = useCallback(async (payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const MoviesService = await getMoviesService();
      const res = await MoviesService.moviesControllerCreate(payload);
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '创建影片失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFilm = useCallback(async (id: string, payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const MoviesService = await getMoviesService();
      const res = await MoviesService.moviesControllerUpdate({ id, data: payload } as any);
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '更新影片失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFilm = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const MoviesService = await getMoviesService();
      const res = await MoviesService.moviesControllerDelete({ id } as any);
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '删除影片失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTorrent = useCallback(async (filmId: string, torrentId: string, _sort?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const MoviesService = await getMoviesService();
      // 使用 moviesControllerBindTorrents 接口绑定种子
      const res = await MoviesService.moviesControllerBindTorrents({ 
        id: filmId, 
        torrentIds: [torrentId] 
      });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '绑定影片种子失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeTorrent = useCallback(async (filmId: string, torrentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const MoviesService = await getMoviesService();
      // 使用 moviesControllerUnbindTorrents 接口解绑种子
      const res = await MoviesService.moviesControllerUnbindTorrents({ 
        id: filmId, 
        torrentIds: [torrentId] 
      });
      const data = unwrap(res);
      return data;
    } catch (e: any) {
      const msg = e?.body?.data?.message || e?.body?.message || e?.message || '移除影片种子失败';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    listFilms,
    getFilm,
    createFilm,
    updateFilm,
    deleteFilm,
    addTorrent,
    removeTorrent,
    items,
    total,
    isLoading,
    error,
  };
}
