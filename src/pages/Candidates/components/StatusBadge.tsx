import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { Candidate } from '../types';

export function StatusBadge({ status }: { status: Candidate['status'] }) {
  if (status === 'voting') {
    return (
      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
        <Clock className="w-3 h-3 mr-1" />
        投票中
      </Badge>
    );
  }
  if (status === 'approved') {
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        已通过
      </Badge>
    );
  }
  if (status === 'rejected') {
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
        <XCircle className="w-3 h-3 mr-1" />
        已驳回
      </Badge>
    );
  }
  return null;
}
