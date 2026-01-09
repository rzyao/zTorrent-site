import {
  X,
  Clock,
  FileText,
  ThumbsUp,
  ThumbsDown,
  CheckCheck,
  Ban,
  ArrowRight,
  Info,
} from "lucide-react";
import type { Candidate } from "../types";
import { StatusBadge } from "./StatusBadge";
import { getTimeRemaining, getVotePercentage } from "../utils";

export function CandidateDetailModal({
  candidate,
  onClose,
  onVote,
  userVote,
}: {
  candidate: Candidate;
  onClose: () => void;
  onVote: (id: string, vote: "up" | "down") => void;
  userVote?: "up" | "down";
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-neutral-700 bg-linear-to-br from-neutral-800 to-stone-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-700 bg-linear-to-br from-neutral-800 to-stone-900 p-6">
          <div>
            <h2 className="mb-1 text-2xl text-white">{candidate.title}</h2>
            <p className="text-sm text-neutral-400">
              {candidate.type} ({candidate.year})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-neutral-700 p-2 text-white transition-colors hover:bg-neutral-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <StatusBadge status={candidate.status} />
            {candidate.status === "voting" && (
              <div className="text-right">
                <p className="mb-1 text-xs text-neutral-400">剩余时间</p>
                <p className="flex items-center gap-1 text-amber-400">
                  <Clock className="h-4 w-4" />
                  {getTimeRemaining(candidate.deadline)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <img src={candidate.poster} alt={candidate.title} className="w-full rounded-lg" />
            </div>
            <div className="space-y-4 md:col-span-2">
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-amber-400">
                  <FileText className="h-4 w-4" />
                  资源描述
                </h3>
                <p className="text-sm leading-relaxed text-neutral-300">{candidate.description}</p>
              </div>

              <div>
                <h3 className="mb-2 text-amber-400">基本信息</h3>
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
                <h3 className="mb-2 text-amber-400">投票统计</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-neutral-400">支持</span>
                    </div>
                    <span className="text-white">{candidate.votesUp}</span>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-700">
                      <div
                        className="h-full bg-linear-to-r from-green-500 to-emerald-600"
                        style={{
                          width: `${(candidate.votesUp / (candidate.votesUp + candidate.votesDown)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-neutral-400">反对</span>
                    </div>
                    <span className="text-white">{candidate.votesDown}</span>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-700">
                      <div
                        className="h-full bg-linear-to-r from-red-500 to-rose-600"
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
            <h3 className="mb-3 flex items-center gap-2 text-amber-400">
              <Info className="h-4 w-4" />
              MediaInfo
            </h3>
            <div className="rounded-lg bg-black/40 p-4 font-mono text-xs text-green-400">
              <pre className="whitespace-pre-wrap">{candidate.mediainfo}</pre>
            </div>
          </div>

          {candidate.status === "voting" && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onVote(candidate.id, "up")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 transition-all ${
                  userVote === "up"
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                    : "border border-neutral-600 bg-neutral-700/50 text-neutral-300 hover:bg-green-500/20 hover:text-green-400"
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
                支持上传
              </button>
              <button
                onClick={() => onVote(candidate.id, "down")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 transition-all ${
                  userVote === "down"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "border border-neutral-600 bg-neutral-700/50 text-neutral-300 hover:bg-red-500/20 hover:text-red-400"
                }`}
              >
                <ThumbsDown className="h-5 w-5" />
                反对上传
              </button>
            </div>
          )}

          {candidate.status === "approved" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-green-500/30 bg-linear-to-r from-green-500/20 to-emerald-600/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                    <CheckCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-green-400">系统通知：候选已通过审核并自动发布</h4>
                    <p className="mb-3 text-sm leading-relaxed text-green-300">
                      恭喜！您的候选资源已获得社区支持（支持率 {getVotePercentage(candidate)}
                      %），系统已自动将其发布为正式种子，现在所有用户都可以搜索和下载该资源。
                    </p>
                    <div className="border-t border-green-500/20 pt-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="mb-1 text-green-400">发布时间</p>
                          <p className="text-green-200">{candidate.deadline}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-green-400">种子ID</p>
                          <p className="font-mono text-green-200">
                            #{candidate.publishedTorrentId || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 px-4 py-3 text-white shadow-lg shadow-green-500/30 transition-all hover:from-green-600 hover:to-emerald-700">
                <ArrowRight className="h-5 w-5" />
                查看种子详情页
              </button>
            </div>
          )}

          {candidate.status === "rejected" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-red-500/30 bg-linear-to-r from-red-500/20 to-rose-600/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20">
                    <Ban className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-red-400">系统通知：候选已被驳回</h4>
                    <p className="mb-2 text-sm leading-relaxed text-red-300">
                      您的候选资源未通过社区审核（支持率 {getVotePercentage(candidate)}
                      %），请查看驳回原因后重新提交。
                    </p>
                    {candidate.reason && (
                      <div className="mt-2 border-t border-red-500/30 pt-2">
                        <p className="mb-1 text-xs text-red-400">驳回原因：</p>
                        <p className="text-sm text-red-200">{candidate.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 px-4 py-3 text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-orange-700">
                重新提交候选
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
