import { useEffect, useState } from 'react';
import { InvitesService } from '@/api';
import { extractData, formatDate, formatBytesToTB, formatRatio } from '../utils';
import type { InvitedUser } from '../types';

export function useInvitedUsers(enabled: boolean = false) {
  const [users, setUsers] = useState<InvitedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await InvitesService.invitesControllerMyUsers({ page: 1, limit: 50 });
      const data = extractData(resp);
      const items = (data?.items || []).map((it: any) => ({
        id: String(it.id),
        username: String(it.username),
        email: String(it.email),
        joinedAt: formatDate(it.joinedAt).split(' ')[0],
        uploadData: formatBytesToTB(Number(it.uploadedBytes || 0)),
        downloadData: formatBytesToTB(Number(it.downloadedBytes || 0)),
        shareRatio: formatRatio(Number(it.ratio || 0)),
        status: String(it.status) === 'vip' ? 'vip' : 'active',
        inviteCode: String(it.inviteCode || ''),
      }));
      setUsers(items);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchUsers();
  }, [enabled]);

  return { users, loading, error, refetch: fetchUsers };
}
