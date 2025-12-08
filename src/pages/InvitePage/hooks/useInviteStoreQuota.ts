import { useEffect, useState } from 'react';
import { getStoreItems } from '@/api/custom/store';
import type { StoreItem } from '@/api/custom/store';

export function useInviteStoreQuota(enabled: boolean = false) {
  const [quotaItems, setQuotaItems] = useState<{ invite_quota?: StoreItem; temp_invite_quota?: StoreItem }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuota = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getStoreItems({ status: 'active', page: 1, pageSize: 50 });
      const arr = Array.isArray(items) ? items : [];
      setQuotaItems({
        invite_quota: arr.find(i => i.key === 'invite_quota'),
        temp_invite_quota: arr.find(i => i.key === 'temp_invite_quota'),
      });
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchQuota();
  }, [enabled]);

  return { quotaItems, loading, error, refetch: fetchQuota };
}
