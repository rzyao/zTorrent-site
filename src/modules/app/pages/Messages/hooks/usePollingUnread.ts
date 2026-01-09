import { useEffect, useState } from 'react';
import { OpenAPI } from '@/api/core/OpenAPI';
import { MessagesService } from '@/api/services/MessagesService';
import { request as __request } from '@/api/core/request';
import { unwrapResponse } from '.@/utils/cn/utils';

export function usePollingUnread(onThreadsUpdated?: () => Promise<void> | void) {
  const [lastPollAt, setLastPollAt] = useState<string | null>(null);
  const [unreadTotalCount, setUnreadTotalCount] = useState<number>(0);

  const refreshUnreadCount = async () => {
    try {
      const resp = await MessagesService.messagesControllerUnreadCount();
      const data = unwrapResponse<{ count: number }>(resp);
      const count = Number((data as any)?.count || 0);
      setUnreadTotalCount(count);
    } catch (_) { }
  };

  useEffect(() => {
    let timer: any;
    (async () => {
      await refreshUnreadCount();
      setLastPollAt(new Date().toISOString());
      timer = setInterval(async () => {
        try {
          const since = lastPollAt || new Date(Date.now() - 5 * 60 * 1000).toISOString();
          const resp = await __request(OpenAPI, { method: 'POST', url: '/messages/poll', body: { since }, mediaType: 'application/json' });
          const data = unwrapResponse<{ inboxNewCount: number; notificationsNewCount: number; threadsUpdated: Array<{ threadId: string; peerUserId: string; lastMessageAt: string; unread: number }> }>(resp);
          setLastPollAt(new Date().toISOString());
          if (Array.isArray((data as any)?.threadsUpdated) && (data as any).threadsUpdated.length > 0) {
            if (onThreadsUpdated) await onThreadsUpdated();
          }
          await refreshUnreadCount();
        } catch (_) { }
      }, 3 * 60 * 1000);
    })();
    return () => { if (timer) clearInterval(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { unreadTotalCount } as const;
}

