import { HardDrive, Users, Eye, MessageCircle, Star, Clock, ThumbsUp, ThumbsDown, CheckCheck, Ban, ArrowRight, Plus } from 'lucide-react';
import type { Candidate } from '../types';
import { StatusBadge } from './StatusBadge';
import { getTimeRemaining, getVotePercentage } from '../utils';

export function CandidateCard({
  candidate,
  userVote,
  currentUser,
  onVote,
  onViewDetails,
}: {
  candidate: Candidate;
  userVote?: 'up' | 'down';
  currentUser: string;
  onVote: (id: string, vote: 'up' | 'down') => void;
  onViewDetails: () => void;
}) {
  const votePercentage = getVotePercentage(candidate);
  const requiredPercentage = candidate.requiredVotePercentage || 70;
  const isPassingVote = votePercentage >= requiredPercentage;

  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden hover:border-amber-500/30 transition-all group">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="relative w-full md:w-32 shrink-0">
          <div className="aspect-2/3 rounded-lg overflow-hidden">
            <img
              src={candidate.poster}
              alt={candidate.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-white">{candidate.title}</h3>
                <StatusBadge status={candidate.status} />
              </div>
              <p className="text-neutral-400 text-sm mb-1">
                {candidate.type} ({candidate.year}) · {candidate.category}
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-neutral-700/50 text-amber-400">{candidate.quality}</span>
                <span>•</span>
                <span>{candidate.resolution}</span>
                <span>•</span>
                <span>{candidate.videoCodec}</span>
                <span>•</span>
                <span>{candidate.fileSize}</span>
              </div>
            </div>
            {candidate.status === 'voting' && (
              <div className="text-right shrink-0">
                <p className="text-neutral-500 text-xs mb-1">剩余时间</p>
                <p className="text-amber-400 text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTimeRemaining(candidate.deadline)}
                </p>
              </div>
            )}
          </div>

          <p className="text-neutral-300 text-sm leading-relaxed mb-3 line-clamp-2">{candidate.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs">
              <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">文件数</p>
                <p className="text-white">{candidate.fileCount}个</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Users className="w-3.5 h-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">做种/下载</p>
                <p className="text-white">
                  <span className="text-green-400">{candidate.seeders}</span>
                  /
                  <span className="text-amber-400">{candidate.leechers}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">浏览</p>
                <p className="text-white">{candidate.views}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MessageCircle className="w-3.5 h-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">评论</p>
                <p className="text-white">{candidate.comments}</p>
              </div>
            </div>
          </div>

          {candidate.uploaderStats && (
            <div className="flex items-center gap-4 text-xs mb-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-neutral-400">上传者:</span>
                <span className="text-white">{candidate.submittedBy}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500">声誉:</span>
                <span className="text-amber-400">{candidate.uploaderStats.reputation}分</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500">分享率:</span>
                <span className="text-green-400">{candidate.uploaderStats.ratio.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500">上传数:</span>
                <span className="text-white">{candidate.uploaderStats.uploads}</span>
              </div>
            </div>
          )}

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-neutral-400">投票支持率</span>
              <div className="flex items-center gap-3">
                <span className="text-neutral-500">{candidate.votesUp + candidate.votesDown} 票</span>
                <span className={`${isPassingVote ? 'text-green-400' : 'text-amber-400'}`}>{votePercentage}%</span>
                {candidate.status === 'voting' && (
                  <span className="text-neutral-500">(需≥{requiredPercentage}%)</span>
                )}
              </div>
            </div>
            <div className="relative h-2 bg-neutral-700/50 rounded-full overflow-hidden">
              {candidate.status === 'voting' && (
                <div className="absolute h-full w-0.5 bg-white/40 z-10" style={{ left: `${requiredPercentage}%` }} />
              )}
              <div
                className={`h-full transition-all ${
                  isPassingVote ? 'bg-linear-to-r from-green-500 to-emerald-600' : 'bg-linear-to-r from-amber-500 to-orange-600'
                }`}
                style={{ width: `${votePercentage}%` }}
              />
            </div>
          </div>

          {candidate.status === 'rejected' && candidate.reason && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-2">
                <Ban className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-red-400 text-xs mb-1">驳回原因</p>
                  <p className="text-red-300 text-sm">{candidate.reason}</p>
                </div>
              </div>
            </div>
          )}

          {candidate.status === 'approved' && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-green-400 shrink-0" />
                <div className="flex-1">
                  <span className="text-green-400 text-sm">已自动发布为正式种子</span>
                  {candidate.publishedTorrentId && (
                    <span className="text-green-300 text-xs ml-2">(ID: #{candidate.publishedTorrentId})</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-32">
          {candidate.status === 'voting' && (
            <>
              <button
                onClick={() => onVote(candidate.id, 'up')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  userVote === 'up'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-neutral-700/50 text-neutral-400 hover:bg-green-500/20 hover:text-green-400 border border-neutral-600/50'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{candidate.votesUp}</span>
              </button>
              <button
                onClick={() => onVote(candidate.id, 'down')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  userVote === 'down'
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-neutral-700/50 text-neutral-400 hover:bg-red-500/20 hover:text-red-400 border border-neutral-600/50'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm">{candidate.votesDown}</span>
              </button>
            </>
          )}

          <button
            onClick={onViewDetails}
            className="flex-1 md:flex-none px-3 py-2 bg-linear-to-r from-amber-500/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-600/30 border border-amber-500/30 rounded-lg text-amber-400 text-sm transition-all"
          >
            查看详情
          </button>

          {candidate.status === 'approved' && (
            <button className="flex-1 md:flex-none px-3 py-2 bg-linear-to-r from-green-500/20 to-emerald-600/20 hover:from-green-500/30 hover:to-emerald-600/30 border border-green-500/30 rounded-lg text-green-400 text-sm transition-all flex items-center justify-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>查看种子</span>
            </button>
          )}

          {candidate.status === 'rejected' && candidate.submittedBy === currentUser && (
            <button className="flex-1 md:flex-none px-3 py-2 bg-linear-to-r from-amber-500/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-600/30 border border-amber-500/30 rounded-lg text-amber-400 text-sm transition-all flex items-center justify-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>重新提交</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
