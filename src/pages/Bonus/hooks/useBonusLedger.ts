import { useEffect, useState } from 'react';
import { getBonusLedger } from '@/api/custom/bonus';
import type { MagicRecord, RecordType } from '../types';
import { Upload, Zap, UserPlus } from 'lucide-react';

export function useBonusLedger(enabled: boolean) {
  const [records, setRecords] = useState<MagicRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | RecordType>('all');

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    const types: Array<RecordType> = filterType === 'all' ? ['earn', 'spend'] : [filterType];
    getBonusLedger({ page: 1, pageSize: 20, types })
      .then((res) => {
        const mapped: MagicRecord[] = (res.items || []).map((it) => {
          const amt = typeof it.delta === 'string' ? parseInt(it.delta as string, 10) : Number(it.delta);
          const t: RecordType = amt >= 0 ? 'earn' : 'spend';
          const reason = it.reason || '';
          const icon = reason === 'purchase' ? UserPlus : reason === 'upload_torrent' ? Upload : Zap;
          return {
            id: it.id,
            type: t,
            amount: Math.abs(amt),
            reason,
            description: it.externalRef || '',
            timestamp: it.createdAt,
            icon,
          };
        });
        setRecords(mapped);
      })
      .catch((e: any) => setError(e?.message || '加载流水失败'))
      .finally(() => setLoading(false));
  }, [enabled, filterType]);

  return { records, loading, error, filterType, setFilterType };
}

