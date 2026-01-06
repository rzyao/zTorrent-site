import { Clock, Check, X } from 'lucide-react';
import type { ReviewStatus } from '../types';

export function StatusBadge({ status }: { status: ReviewStatus }) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
          <Clock className="w-3 h-3" />
          待审核
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
          <Check className="w-3 h-3" />
          已通过
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
          <X className="w-3 h-3" />
          已驳回
        </span>
      );
  }
}

