import { useEffect, useMemo, useState } from 'react';
import { OpenAPI } from '@/api';
import { request as __request } from '@/api/core/request';
import { toast } from 'sonner';
import { unwrapResponse, extractErrorMessage } from '../utils/utils';
import type { INotification, Message } from '../types/types';

export function useNotifications() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [items, setItems] = useState<INotification[]>([]);

  const load = async () => {
    try {
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/notifications/list',
        body: { page, limit },
        mediaType: 'application/json',
      });
      const data = unwrapResponse<{ items: INotification[]; total: number; page: number; limit: number }>(resp);
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const messagesUi = useMemo<Message[]>(() => {
    return (items || []).map(n => ({
      id: n.id,
      from: '系统通知',
      subject: n.title,
      content: n.content,
      timestamp: new Date(n.createdAt).toLocaleString(),
      read: !!n.readAt,
      type: 'system',
    }));
  }, [items]);

  const markRead = async (ids: string[]) => {
    try {
      await __request(OpenAPI, { method: 'POST', url: '/messages/notifications/mark-read', body: { ids }, mediaType: 'application/json' });
      toast.success('已标记为已读');
      await load();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const remove = async (id: string) => {
    try {
      await __request(OpenAPI, { method: 'POST', url: '/messages/notifications/delete', body: { id }, mediaType: 'application/json' });
      toast.success('通知已删除');
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
    load,
    markRead,
    remove,
  } as const;
}

