import { X, Clock, FileText, ThumbsUp, ThumbsDown, Upload, Info } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { Candidate } from '../types';

export function DetailModal({
  candidate,
  onClose,
  userVote,
  onVote,
  getTimeRemaining,
}: {
  candidate: Candidate;
  onClose: () => void;
  userVote?: 'up' | 'down';
  onVote: (id: string, type: 'up' | 'down') => void;
  getTimeRemaining: (deadline: string) => string;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-br from-neutral-800 to-stone-900 border-b border-neutral-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white text-2xl mb-1">{candidate.title}</h2>
            <p className="text-neutral-400 text-sm">
              {candidate.type} ({candidate.year})
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <StatusBadge status={candidate.status} />
            {candidate.status === 'voting' && (
              <div className="text-right">
                <p className="text-neutral-400 text-xs mb-1">剩余时间</p>
                <p className="text-amber-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getTimeRemaining(candidate.deadline)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <img src={candidate.poster} alt={candidate.title} className="w-full rounded-lg" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-amber-400 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  资源描述
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed">{candidate.description}</p>
              </div>

              <div>
                <h3 className="text-amber-400 mb-2">基本信息</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-neutral-400">分类：</span>
                    <span className="text-white">{candidate.category}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">质量：</span>
                    <span className="text-white">{candidate.quality}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">提交者：</span>
                    <span className="text-white">{candidate.submittedBy}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">提交时间：</span>
                    <span className="text-white">{candidate.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-amber-400 mb-2">投票统计</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <ThumbsUp className="w-4 h-4 text-green-400" />
                      <span className="text-neutral-400 text-sm">支持</span>
                    </div>
                    <span className="text-white">{candidate.votesUp}</span>
                    <div className="w-32 h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                        style={{
                          width: `${(candidate.votesUp / (candidate.votesUp + candidate.votesDown)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <ThumbsDown className="w-4 h-4 text-red-400" />
                      <span className="text-neutral-400 text-sm">反对</span>
                    </div>
                    <span className="text-white">{candidate.votesDown}</span>
                    <div className="w-32 h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-rose-600"
                        style={{
                          width: `${(candidate.votesDown / (candidate.votesUp + candidate.votesDown)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-amber-400 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              MediaInfo
            </h3>
            <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-green-400">
              <pre className="whitespace-pre-wrap">{candidate.mediainfo}</pre>
            </div>
          </div>

          {candidate.status === 'voting' && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onVote(candidate.id, 'up')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${userVote === 'up'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-green-500/20 hover:text-green-400 border border-neutral-600'
                  }`}
              >
                <ThumbsUp className="w-5 h-5" />
                支持上传
              </button>
              <button
                onClick={() => onVote(candidate.id, 'down')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${userVote === 'down'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-red-500/20 hover:text-red-400 border border-neutral-600'
                  }`}
              >
                <ThumbsDown className="w-5 h-5" />
                反对上传
              </button>
            </div>
          )}

          {candidate.status === 'approved' && (
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white transition-all shadow-lg shadow-green-500/30">
              <Upload className="w-5 h-5" />
              获取上传链接
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
