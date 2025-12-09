import { useEffect, useMemo, useState } from 'react';
import { OpenAPI } from '@/api/core/OpenAPI';
import { request as __request } from '@/api/core/request';
import { toast } from 'sonner';
import { unwrapResponse, extractErrorMessage } from '../utils/utils';
import type { IMessage, Message } from '../types/types';

export function useInboxList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [items, setItems] = useState<IMessage[]>([]);

  const load = async () => {
    try {
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/inbox',
        body: { page, limit, onlyUnread, onlyFavorites },
        mediaType: 'application/json',
      });
      const data = unwrapResponse<{ items: IMessage[]; total: number; page: number; limit: number }>(resp);
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, onlyUnread, onlyFavorites]);

  const messagesUi = useMemo<Message[]>(() => {
    return (items || []).map(m => ({
      id: m.id,
      from: m.senderId,
      subject: m.content.slice(0, 32),
      content: m.content,
      timestamp: new Date(m.createdAt).toLocaleString(),
      read: !!m.readAt,
      type: 'user',
    }));
  }, [items]);

  const favorite = async (id: string) => {
    try {
      await __request(OpenAPI, { method: 'POST', url: '/messages/favorite', body: { id }, mediaType: 'application/json' });
      toast.success('已收藏');
      await load();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const unfavorite = async (id: string) => {
    try {
      await __request(OpenAPI, { method: 'POST', url: '/messages/unfavorite', body: { id }, mediaType: 'application/json' });
      toast.success('已取消收藏');
      await load();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const markRead = async (id: string) => {
    try {
      await __request(OpenAPI, { method: 'POST', url: '/messages/mark-read', body: { id }, mediaType: 'application/json' });
      toast.success('已标记为已读');
      await load();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    items,
    messagesUi,
    page,
    setPage,
    limit,
    setLimit,
    onlyUnread,
    setOnlyUnread,
    onlyFavorites,
    setOnlyFavorites,
    load,
    favorite,
    unfavorite,
    markRead,
  } as const;
}

