import { useEffect, useState } from 'react';
import { getBonusOverview } from '@/api/custom/bonus';

export type BonusOverview = { current: number; totalEarned: number; totalSpent: number; rank?: number } | null;

export function useBonusOverview(enabled: boolean) {
  const [overview, setOverview] = useState<BonusOverview>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    getBonusOverview()
      .then((o) => {
        const current = typeof o.balance === 'string' ? parseInt(o.balance as string, 10) : Number(o.balance);
        const totalEarned = typeof o.totalEarned === 'string' ? parseInt(o.totalEarned as string, 10) : Number(o.totalEarned);
        const totalSpent = typeof o.totalSpent === 'string' ? parseInt(o.totalSpent as string, 10) : Number(o.totalSpent);
        setOverview({ current, totalEarned, totalSpent, rank: o.rank });
      })
      .catch((e: any) => setError(e?.message || '加载概览失败'))
      .finally(() => setLoading(false));
  }, [enabled]);

  return { overview, loading, error };
}

