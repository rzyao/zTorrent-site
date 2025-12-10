import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export function StatusBadge({ status }: { status: 'voting' | 'approved' | 'rejected' }) {
  if (status === 'voting') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">
        <Clock className="w-3 h-3" />
        投票中
      </div>
    );
  }
  if (status === 'approved') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
        <CheckCircle2 className="w-3 h-3" />
        已通过
      </div>
    );
  }
  if (status === 'rejected') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-xs">
        <XCircle className="w-3 h-3" />
        已驳回
      </div>
    );
  }
  return null;
}
