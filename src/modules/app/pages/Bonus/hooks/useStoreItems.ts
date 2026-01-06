import { useEffect, useState } from 'react';
import { getStoreItems } from '@/api/custom/store';
import type { StoreItem } from '@/api/custom/store';

export function useStoreItems(enabled: boolean) {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    getStoreItems({ page: 1, pageSize: 50, status: 'active' })
      .then((resp: StoreItem[]) => setItems(Array.isArray(resp) ? resp : []))
      .catch((e: any) => setError(e?.message || '加载商城商品失败'))
      .finally(() => setLoading(false));
    try { console.info('[store_list_view]'); } catch { }
  }, [enabled]);

  return { items, loading, error };
}

