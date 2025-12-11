import { useEffect, useState } from 'react';
import { PlaylistsService } from '@/api/services/PlaylistsService';
import type { Playlist } from '../types';

export function usePlaylists() {
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'following'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [items, setItems] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await PlaylistsService.playlistsControllerList({
        page,
        limit: pageSize,
        keyword: searchQuery || undefined,
        ...(activeTab === 'mine' ? { ownerUserId: 'me' } : {}),
      });

      const list = (res.data?.items || []).map((item: any) => ({
        id: String(item.id),
        title: item.name,
        description: '',
        coverImage: item.coverUrl,
        creator: '',
        creatorAvatar: '',
        moviesCount: Number(item.filmCount ?? 0),
        followersCount: Number(item.stats?.likes ?? 0),
        viewsCount: Number(item.stats?.views ?? 0),
        rating: 0,
        isFollowing: false,
        createdAt: item.meta?.createdAt ?? '',
        updatedAt: item.meta?.updatedAt ?? '',
        tags: Array.isArray(item.tags) ? item.tags : [],
      }));

      setItems(list);
    } catch (e: any) {
      setError(e?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery, sortBy, page]);

  const toggleFollow = async (playlistId: string) => {
    const idx = items.findIndex(p => p.id === playlistId);
    if (idx === -1) return;
    const original = items[idx];
    const nextFollow = !original.isFollowing;
    const nextFollowers = original.followersCount + (nextFollow ? 1 : -1);
    setItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...original, isFollowing: nextFollow, followersCount: Math.max(0, nextFollowers) };
      return copy;
    });
    try {
      await PlaylistsService.playlistsControllerLike({ id: playlistId });
    } catch {
      setItems(prev => {
        const copy = [...prev];
        copy[idx] = { ...original } as Playlist;
        return copy;
      });
    }
  };

  const incViews = async (playlistId: string) => {
    try {
      PlaylistsService.playlistsControllerIncViews({ id: playlistId });
      setItems(prev => prev.map(p => (p.id === playlistId ? { ...p, viewsCount: p.viewsCount + 1 } : p)));
    } catch { }
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    items,
    loading,
    error,
    page,
    setPage,
    pageSize,
    loadPlaylists,
    toggleFollow,
    incViews,
  };
}

