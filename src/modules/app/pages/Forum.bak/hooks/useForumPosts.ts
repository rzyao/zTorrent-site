// @ts-nocheck
import { useState, useEffect, useMemo, useCallback } from 'react';
import { IForumPost } from '../types';
import { unwrapResponse, extractErrorMessage } from '../utils';

export function useForumPosts(threadId?: string) {
  const [posts, setPosts] = useState<IForumPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!threadId) return;
    try {
      const { ForumPostsService } = await import('@/api/services/ForumPostsService');
      const postsResp = await ForumPostsService.forumPostsControllerList({ threadId, page, limit });
      const postsData = unwrapResponse<{ items?: IForumPost[]; total?: number; page?: number; limit?: number }>(postsResp);
      setPosts(Array.isArray(postsData?.items) ? postsData.items! : []);
      setTotal(Number(postsData?.total || 0));
    } catch (err: any) {
      setError(extractErrorMessage(err));
    }
  }, [threadId, page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const postsMap = useMemo(() => {
    const map = new Map<string, IForumPost>();
    posts.forEach(p => map.set(p.id, p));
    return map;
  }, [posts]);

  return { posts, setPosts, total, page, setPage, limit, setLimit, error, refresh: fetchPosts, postsMap };
}

