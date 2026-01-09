import {
  HardDrive,
  Users,
  Eye,
  MessageCircle,
  Star,
  Clock,
  ThumbsUp,
  ThumbsDown,
  CheckCheck,
  Ban,
  ArrowRight,
  Plus,
} from "lucide-react";
import type { Candidate } from "../types";
import { StatusBadge } from "./StatusBadge";
import { getTimeRemaining, getVotePercentage } from "../utils";

export function CandidateCard({
  candidate,
  userVote,
  currentUser,
  onVote,
  onViewDetails,
}: {
  candidate: Candidate;
  userVote?: "up" | "down";
  currentUser: string;
  onVote: (id: string, vote: "up" | "down") => void;
  onViewDetails: () => void;
}) {
  const votePercentage = getVotePercentage(candidate);
  const requiredPercentage = candidate.requiredVotePercentage || 70;
  const isPassingVote = votePercentage >= requiredPercentage;

  return (
    <div className="group overflow-hidden rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm transition-all hover:border-amber-500/30">
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <div className="relative w-full shrink-0 md:w-32">
          <div className="aspect-2/3 overflow-hidden rounded-lg">
            <img
              src={candidate.poster}
              alt={candidate.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="text-white">{candidate.title}</h3>
                <StatusBadge status={candidate.status} />
              </div>
              <p className="mb-1 text-sm text-neutral-400">
                {candidate.type} ({candidate.year}) · {candidate.category}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span className="rounded bg-neutral-700/50 px-2 py-0.5 text-amber-400">
                  {candidate.quality}
                </span>
                <span>•</span>
                <span>{candidate.resolution}</span>
                <span>•</span>
                <span>{candidate.videoCodec}</span>
                <span>•</span>
                <span>{candidate.fileSize}</span>
              </div>
            </div>
            {candidate.status === "voting" && (
              <div className="shrink-0 text-right">
                <p className="mb-1 text-xs text-neutral-500">剩余时间</p>
                <p className="flex items-center gap-1 text-sm text-amber-400">
                  <Clock className="h-3 w-3" />
                  {getTimeRemaining(candidate.deadline)}
                </p>
              </div>
            )}
          </div>

          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-neutral-300">
            {candidate.description}
          </p>

          <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="flex items-center gap-2 text-xs">
              <HardDrive className="h-3.5 w-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">文件数</p>
                <p className="text-white">{candidate.fileCount}个</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Users className="h-3.5 w-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">做种/下载</p>
                <p className="text-white">
                  <span className="text-green-400">{candidate.seeders}</span>/
                  <span className="text-amber-400">{candidate.leechers}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Eye className="h-3.5 w-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">浏览</p>
                <p className="text-white">{candidate.views}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MessageCircle className="h-3.5 w-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">评论</p>
                <p className="text-white">{candidate.comments}</p>
              </div>
            </div>
          </div>

          {candidate.uploaderStats && (
            <div className="mb-3 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400" />
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
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-neutral-400">投票支持率</span>
              <div className="flex items-center gap-3">
                <span className="text-neutral-500">
                  {candidate.votesUp + candidate.votesDown} 票
                </span>
                <span className={`${isPassingVote ? "text-green-400" : "text-amber-400"}`}>
                  {votePercentage}%
                </span>
                {candidate.status === "voting" && (
                  <span className="text-neutral-500">(需≥{requiredPercentage}%)</span>
                )}
              </div>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-neutral-700/50">
              {candidate.status === "voting" && (
                <div
                  className="absolute z-10 h-full w-0.5 bg-white/40"
                  style={{ left: `${requiredPercentage}%` }}
                />
              )}
              <div
                className={`h-full transition-all ${
                  isPassingVote
                    ? "bg-linear-to-r from-green-500 to-emerald-600"
                    : "bg-linear-to-r from-amber-500 to-orange-600"
                }`}
                style={{ width: `${votePercentage}%` }}
              />
            </div>
          </div>

          {candidate.status === "rejected" && candidate.reason && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <div className="flex items-start gap-2">
                <Ban className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  <p className="mb-1 text-xs text-red-400">驳回原因</p>
                  <p className="text-sm text-red-300">{candidate.reason}</p>
                </div>
              </div>
            </div>
          )}

          {candidate.status === "approved" && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
              <div className="flex items-center gap-2">
                <CheckCheck className="h-4 w-4 shrink-0 text-green-400" />
                <div className="flex-1">
                  <span className="text-sm text-green-400">已自动发布为正式种子</span>
                  {candidate.publishedTorrentId && (
                    <span className="ml-2 text-xs text-green-300">
                      (ID: #{candidate.publishedTorrentId})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 gap-2 md:w-32 md:flex-col">
          {candidate.status === "voting" && (
            <>
              <button
                onClick={() => onVote(candidate.id, "up")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all md:flex-none ${
                  userVote === "up"
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                    : "border border-neutral-600/50 bg-neutral-700/50 text-neutral-400 hover:bg-green-500/20 hover:text-green-400"
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">{candidate.votesUp}</span>
              </button>
              <button
                onClick={() => onVote(candidate.id, "down")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all md:flex-none ${
                  userVote === "down"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "border border-neutral-600/50 bg-neutral-700/50 text-neutral-400 hover:bg-red-500/20 hover:text-red-400"
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="text-sm">{candidate.votesDown}</span>
              </button>
            </>
          )}

          <button
            onClick={onViewDetails}
            className="flex-1 rounded-lg border border-amber-500/30 bg-linear-to-r from-amber-500/20 to-orange-600/20 px-3 py-2 text-sm text-amber-400 transition-all hover:from-amber-500/30 hover:to-orange-600/30 md:flex-none"
          >
            查看详情
          </button>

          {candidate.status === "approved" && (
            <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-green-500/30 bg-linear-to-r from-green-500/20 to-emerald-600/20 px-3 py-2 text-sm text-green-400 transition-all hover:from-green-500/30 hover:to-emerald-600/30 md:flex-none">
              <ArrowRight className="h-3.5 w-3.5" />
              <span>查看种子</span>
            </button>
          )}

          {candidate.status === "rejected" && candidate.submittedBy === currentUser && (
            <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-linear-to-r from-amber-500/20 to-orange-600/20 px-3 py-2 text-sm text-amber-400 transition-all hover:from-amber-500/30 hover:to-orange-600/30 md:flex-none">
              <Plus className="h-3.5 w-3.5" />
              <span>重新提交</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
