import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, ThumbsDown, Clock, Eye, MessageCircle, AlertTriangle, Upload } from 'lucide-react';
import type { Candidate } from '../types';
import { StatusBadge } from './StatusBadge';

export function CandidateCard({
  candidate,
  userVote,
  onVote,
  onViewDetail,
  getVotePercentage,
  getTimeRemaining,
}: {
  candidate: Candidate;
  userVote?: 'up' | 'down';
  onVote: (id: string, type: 'up' | 'down') => void;
  onViewDetail: () => void;
  getVotePercentage: (c: Candidate) => number;
  getTimeRemaining: (deadline: string) => string;
}) {
  const votePercentage = getVotePercentage(candidate);
  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/30 transition-all group">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img src={candidate.poster} alt={candidate.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={candidate.status} />
        </div>
        {candidate.status === 'voting' && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-amber-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getTimeRemaining(candidate.deadline)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <Badge className="bg-neutral-900/70 text-amber-400 text-xs">{candidate.quality}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white mb-1 line-clamp-1">{candidate.title}</h3>
        <p className="text-neutral-400 text-sm mb-3 line-clamp-1">
          {candidate.type} ({candidate.year})
        </p>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>支持率</span>
            <span className={`${votePercentage >= 70 ? 'text-green-400' : 'text-amber-400'}`}>{votePercentage}%</span>
          </div>
          <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${votePercentage >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'}`}
              style={{ width: `${votePercentage}%` }}
            />
          </div>
        </div>

        {candidate.status === 'voting' && (
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => onVote(candidate.id, 'up')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${userVote === 'up' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-neutral-700/50 text-neutral-400 hover:bg-green-500/20 hover:text-green-400'}`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{candidate.votesUp}</span>
            </button>
            <button
              onClick={() => onVote(candidate.id, 'down')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${userVote === 'down' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-neutral-700/50 text-neutral-400 hover:bg-red-500/20 hover:text-red-400'}`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="text-sm">{candidate.votesDown}</span>
            </button>
          </div>
        )}

        {candidate.status === 'rejected' && candidate.reason && (
          <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {candidate.reason}
            </p>
          </div>
        )}

        {candidate.status === 'approved' && (
          <div className="mb-3">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-green-500/30">
              <Upload className="w-4 h-4" />
              立即上传
            </button>
          </div>
        )}

        <Separator className="bg-neutral-700/50 my-3" />

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {candidate.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {candidate.comments}
            </span>
          </div>
          <button onClick={onViewDetail} className="text-amber-400 hover:text-amber-300 transition-colors">
            查看详情
          </button>
        </div>
      </div>
    </div>
  );
}
