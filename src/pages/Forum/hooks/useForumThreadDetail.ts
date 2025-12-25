import { useState, useEffect } from 'react';
import { IForumThread } from '../types';
import { unwrapResponse, extractErrorMessage } from '../utils';
import { VIEW_TTL_MS } from '../constants';
import { getOpenAPI, getRequest } from '@/api/lazy';

export function useForumThreadDetail(
  onThreadUpdate?: (updatedThread: IForumThread) => void
) {
  const [selectedThread, setSelectedThread] = useState<IForumThread | null>(null);
  const [threadDetail, setThreadDetail] = useState<IForumThread | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getViewKey = (id: string) => `forum:viewed:${id}`;
  const now = () => Date.now();
  const shouldCountView = (id: string) => {
    try {
      const raw = localStorage.getItem(getViewKey(id));
      if (!raw) return true;
      const data = JSON.parse(raw);
      return typeof data?.ts !== 'number' || (now() - data.ts) > VIEW_TTL_MS;
    } catch {
      return true;
    }
  };
  const markViewed = (id: string) => {
    try { localStorage.setItem(getViewKey(id), JSON.stringify({ ts: now() })); } catch { }
  };

  // 跨标签页同步
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('forum:viewed:')) {
         // Trigger update if needed by resetting state with same value to trigger effect? 
         // Actually the original code just did setSelectedThread(st => st ? { ...st } : st);
         setSelectedThread(st => st ? { ...st } : st);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!selectedThread) { setThreadDetail(null); return; }
      // If we already have detail for this ID, maybe don't fetch immediately? 
      // But we need to check for updates.
      
      try {
        const { ForumThreadsService } = await import('@/api/services/ForumThreadsService');
        const detailResp = await ForumThreadsService.forumThreadsControllerGet({ id: selectedThread.id });
        const detail = unwrapResponse<IForumThread>(detailResp);
        
        if (!cancelled) {
          setThreadDetail(detail);
          
          // View counting logic
          if (typeof detail?.viewsCount === 'number' && detail.viewsCount !== selectedThread.viewsCount) {
             const updated = { ...selectedThread, viewsCount: detail.viewsCount };
             // Only update if ID matches (it should)
             if (updated.id === selectedThread.id) {
                 setSelectedThread(updated);
                 onThreadUpdate?.(updated);
                 markViewed(detail.id);
             }
          } else {
             if (shouldCountView(selectedThread.id)) {
                const old = selectedThread.viewsCount;
                // Optimistic
                const optimistic = { ...selectedThread, viewsCount: old + 1 };
                setSelectedThread(optimistic);
                onThreadUpdate?.(optimistic);

                try {
                    const request = await getRequest();
                    const OpenAPI = await getOpenAPI();
                    const incResp = await (request as any)(OpenAPI, {
                      method: 'POST',
                      url: '/forum/threads/inc-views',
                      body: { id: selectedThread.id },
                      mediaType: 'application/json',
                    });
                    const incData = unwrapResponse<{ viewsCount?: number }>(incResp) as any;
                    const latest = typeof incData?.viewsCount === 'number' ? incData.viewsCount : undefined;
                    if (typeof latest === 'number') {
                        const confirmed = { ...selectedThread, viewsCount: latest };
                         if (confirmed.id === selectedThread.id) {
                            setSelectedThread(confirmed);
                            onThreadUpdate?.(confirmed);
                         }
                    }
                    markViewed(selectedThread.id);
                } catch (err: any) {
                    const OpenAPI2 = await getOpenAPI();
                    if ((OpenAPI2 as any).BASE) {
                        // Rollback
                        const rollback = { ...selectedThread, viewsCount: old };
                         if (rollback.id === selectedThread.id) {
                            setSelectedThread(rollback);
                            onThreadUpdate?.(rollback);
                         }
                    }
                    setError(extractErrorMessage(err));
                }
             }
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(extractErrorMessage(err));
      }
    })();
    return () => { cancelled = true; };
  }, [selectedThread?.id]); 

  // Visibility change logic
  useEffect(() => {
    const handler = async () => {
      try {
        const OpenAPI = await getOpenAPI();
        if (document.visibilityState === 'hidden' && selectedThread && shouldCountView(selectedThread.id) && (OpenAPI as any).BASE) {
          const url = `${String((OpenAPI as any).BASE).replace(/\/$/, '')}/forum/threads/inc-views`;
          const payload = JSON.stringify({ id: selectedThread.id });
          navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
          markViewed(selectedThread.id);
        }
      } catch { }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [selectedThread?.id]);

  return { selectedThread, setSelectedThread, threadDetail, error };
}
