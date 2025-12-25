import { useEffect, useState } from 'react';
import { AuditService } from '@/api/services/AuditService';
import { unwrapResponse, extractErrorMessage } from '../utils';
import type { AuditHistory, ReviewItem } from '../types';

export function useReviewHistory(selectedItem: ReviewItem | null, showHistory: boolean) {
  const [historyItems, setHistoryItems] = useState<AuditHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!showHistory || !selectedItem) return;
      setHistoryLoading(true);
      try {
        const typeKey = selectedItem.type === 'movie' || selectedItem.type === 'series' ? 'film' : selectedItem.type;
        const resp = await AuditService.auditControllerHistory({ type: typeKey as any, resourceId: String(selectedItem.id) });
        const data = unwrapResponse(resp);
        const items: any[] = Array.isArray(data?.items) ? data.items : [];
        const mapped: AuditHistory[] = items.map((h: any, idx: number) => ({
          id: String(h?.id ?? idx),
          reviewer: String(h?.reviewer ?? h?.operator ?? ''),
          action: (String(h?.action ?? '').toLowerCase() === 'approved' ? 'approved' : 'rejected'),
          date: String(h?.timestamp ?? h?.createdAt ?? ''),
          notes: String(h?.note ?? h?.reason ?? ''),
        }));
        if (!cancelled) setHistoryItems(mapped);
      } catch (e) {
        console.error(extractErrorMessage(e));
        if (!cancelled) setHistoryItems([]);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [showHistory, selectedItem]);

  return { historyItems, historyLoading, setHistoryItems };
}

