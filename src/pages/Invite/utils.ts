import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const extractData = (resp: any) => {
  const body = resp?.code !== undefined ? resp : resp?.data;
  return body?.data ?? body;
};

export const formatBytesToTB = (bytes: number) => {
  const tb = bytes / Math.pow(1024, 4);
  return `${tb.toFixed(2)} TB`;
};

export const formatRatio = (ratio: number) => ratio.toFixed(2);

export const formatDate = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${da} ${hh}:${mm}`;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'unused': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'used': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'expired': return 'bg-neutral-600/20 text-neutral-400 border-neutral-600/30';
    case 'registered': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'unused': return '未使用';
    case 'used': return '已使用';
    case 'registered': return '已注册';
    case 'pending': return '待注册';
    case 'expired': return '已过期';
    default: return '未知';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'registered': return CheckCircle;
    case 'pending': return Clock;
    case 'expired': return XCircle;
    default: return Clock;
  }
};
