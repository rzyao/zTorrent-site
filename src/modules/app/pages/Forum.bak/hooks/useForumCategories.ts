// @ts-nocheck
import { useState, useEffect } from 'react';
import { IForumCategory } from '../types';
import { unwrapResponse, extractErrorMessage } from '../utils';

export function useForumCategories() {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { ForumCategoriesService } = await import('@/api/services/ForumCategoriesService');
        const resp = await ForumCategoriesService.forumCategoriesControllerList({ page: 1, limit: 100, enabled: true });
        const data = unwrapResponse<{ items?: IForumCategory[]; total?: number; page?: number; limit?: number }>(resp);
        const list = Array.isArray(data?.items) ? data.items! : [];
        const ordered = list.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
        setCategories([{ id: 'all', name: '全部' }, ...ordered.map(it => ({ id: it.id, name: it.name }))]);
      } catch (err: any) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { categories, loading, error };
}

