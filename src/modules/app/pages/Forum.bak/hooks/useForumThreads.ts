// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { IForumThread } from '../types';
import { unwrapResponse, extractErrorMessage } from '.@/utils/cn';

interface UseForumThreadsProps {
  categoryId: string;
  searchQuery: string;
}

export function useForumThreads({ categoryId, searchQuery }: UseForumThreadsProps) {
  const [threads, setThreads] = useState<IForumThread[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { ForumThreadsService } = await import('@/api/services/ForumThreadsService');
      const resp = await ForumThreadsService.forumThreadsControllerList({
        page,
        limit,
        categoryId: categoryId === 'all' ? undefined : categoryId,
        search: searchQuery || undefined,
      });
      const data = unwrapResponse<{ items?: IForumThread[]; total?: number; page?: number; limit?: number }>(resp);
      setThreads(Array.isArray(data?.items) ? data.items! : []);
      setTotal(Number(data?.total || 0));
    } catch (err: any) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, limit, categoryId, searchQuery]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return { threads, setThreads, total, page, setPage, limit, setLimit, loading, error, refresh: fetchThreads };
}

