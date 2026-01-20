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
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();
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
                <p className="mb-1 text-xs text-neutral-400">{t('candidates.timeRemaining')}</p>
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
                  {t('candidates.description')}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-300">{candidate.description}</p>
              </div>

              <div>
                <h3 className="mb-2 text-amber-400">{t('candidates.basicInfo')}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-neutral-400">{t('candidates.category')}：</span>
                    <span className="text-white">{candidate.category}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">{t('candidates.quality')}：</span>
                    <span className="text-white">{candidate.quality}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">{t('candidates.submitter')}：</span>
                    <span className="text-white">{candidate.submittedBy}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">{t('candidates.submitTime')}：</span>
                    <span className="text-white">{candidate.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-amber-400">{t('candidates.voteStats')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-neutral-400">{t('candidates.support')}</span>
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
                      <span className="text-sm text-neutral-400">{t('candidates.oppose')}</span>
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
                {t('candidates.supportUpload')}
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
                {t('candidates.opposeUpload')}
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
                    <h4 className="mb-2 text-green-400">{t('candidates.approvedNotice')}</h4>
                    <p className="mb-3 text-sm leading-relaxed text-green-300">
                      {t('candidates.approvedMessage', { votePercentage: getVotePercentage(candidate) })}
                    </p>
                    <div className="border-t border-green-500/20 pt-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="mb-1 text-green-400">{t('candidates.publishTime')}</p>
                          <p className="text-green-200">{candidate.deadline}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-green-400">{t('candidates.torrentId')}</p>
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
                {t('candidates.viewTorrentDetail')}
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
                    <h4 className="mb-1 text-red-400">{t('candidates.rejectedNotice')}</h4>
                    <p className="mb-2 text-sm leading-relaxed text-red-300">
                      {t('candidates.rejectedMessage', { votePercentage: getVotePercentage(candidate) })}
                    </p>
                    {candidate.reason && (
                      <div className="mt-2 border-t border-red-500/30 pt-2">
                        <p className="mb-1 text-xs text-red-400">{t('candidates.rejectReason')}：</p>
                        <p className="text-sm text-red-200">{candidate.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 px-4 py-3 text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-orange-700">
                {t('candidates.resubmit')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
