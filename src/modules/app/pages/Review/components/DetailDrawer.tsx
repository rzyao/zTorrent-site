import { X, Check, RotateCcw, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";
import { ReviewItem } from "../types";
import { useReviewItemDetail } from "../hooks/useReviewItemDetail";
import { TorrentDetailBody } from "@/modules/app/components/business/TorrentDetailBody";
import { MovieDetailBody } from "@/modules/app/components/business/MovieDetailBody";
import { PlaylistDetailBody } from "@/modules/app/components/business/PlaylistDetailBody";

// ============================================
// Props
// ============================================

interface Props {
  item: ReviewItem;
  onClose: () => void;
  onApprove: (item: ReviewItem) => void;
  onReject: (item: ReviewItem) => void;
}

// ============================================
// Main Component
// ============================================

export function DetailDrawer({ item, onClose, onApprove, onReject }: Props) {
  const { data, loading, error } = useReviewItemDetail(item.id, item.type);

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200">
      {/* 居中弹窗: h-[90vh] w-[90vw] max-w-[1600px] */}
      <div className="flex h-[90vh] w-full flex-col overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl md:w-[90vw] md:max-w-[1600px]">
        {/* Header */}
        <div className="z-10 flex shrink-0 items-center justify-between border-b border-neutral-700 bg-neutral-900 px-6 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium text-neutral-100">审核详情</h2>
            {/* 状态徽章 */}
            <div
              className={`rounded border px-2 py-0.5 text-xs font-medium ${
                item.status === "pending"
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                  : item.status === "approved"
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {item.status.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 外部链接跳转 */}
            <a
              href={data?.torrent?.data.downloadUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-amber-400"
            >
              <ExternalLink className="h-4 w-4" />
              <span>原始链接</span>
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-neutral-800"
            >
              <X className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="relative flex-1 overflow-y-auto bg-neutral-900/50">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-neutral-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <p>正在拉取全量详情...</p>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-red-400">
              <AlertTriangle className="h-8 w-8" />
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm underline hover:text-red-300"
              >
                刷新重试
              </button>
            </div>
          ) : (
            <div className="p-6 pb-32">
              {/* 根据类型渲染 Body */}
              {item.type === "torrent" && data?.torrent && (
                <TorrentDetailBody
                  data={data.torrent.data}
                  fileList={data.torrent.fileList}
                  mediaInfo={data.torrent.mediaInfo}
                  stills={data.torrent.stills}
                  comments={data.torrent.comments}
                />
              )}

              {(item.type === "movie" || item.type === "series") && data?.movie && (
                <MovieDetailBody detail={data.movie.detail} />
              )}

              {item.type === "playlist" && data?.playlist && (
                <PlaylistDetailBody playlist={data.playlist.detail} movies={data.playlist.movies} />
              )}

              {/* 如果数据为空的兜底 */}
              {!data && (
                <div className="flex h-full flex-col items-center justify-center py-20 text-neutral-500">
                  <p>未找到相关数据</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer (Sticky Action Bar) - 根据状态显示不同操作 */}
        <div className="z-20 shrink-0 border-t border-neutral-700 bg-neutral-900 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* 审核建议区域（仅待审核状态显示） */}
            {item.status === "pending" && (
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">系统建议:</span>
                  {!item.missingFields?.length && !item.sensitiveWords?.length ? (
                    <span className="text-sm text-green-400">内容完整，建议通过</span>
                  ) : (
                    <span className="text-sm text-orange-400">存在潜在问题，请仔细甄别</span>
                  )}
                </div>
                {/* 敏感词/缺失字段展示 */}
                {(item.missingFields?.length || 0) > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {item.missingFields?.map((f) => (
                      <span
                        key={f}
                        className="rounded border border-orange-500/20 bg-orange-500/20 px-2 py-0.5 text-orange-400"
                      >
                        缺: {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 已审核状态提示 */}
            {item.status !== "pending" && (
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">
                    当前状态:
                    <span
                      className={
                        item.status === "approved" ? "ml-1 text-green-400" : "ml-1 text-red-400"
                      }
                    >
                      {item.status === "approved" ? "已通过" : "已驳回"}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* 按钮组 - 根据状态显示不同按钮 */}
            <div className="flex gap-3 md:w-1/3">
              {/* 待审核: 显示通过和驳回 */}
              {item.status === "pending" && (
                <>
                  <button
                    onClick={() => onApprove(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 py-2.5 text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98]"
                  >
                    <Check className="h-5 w-5" />
                    通过
                  </button>
                  <button
                    onClick={() => onReject(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-500 to-rose-600 py-2.5 text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98]"
                  >
                    <X className="h-5 w-5" />
                    驳回
                  </button>
                </>
              )}
              {/* 已通过: 只显示驳回 */}
              {item.status === "approved" && (
                <button
                  onClick={() => onReject(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-500 to-rose-600 py-2.5 text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98]"
                >
                  <X className="h-5 w-5" />
                  驳回
                </button>
              )}
              {/* 已驳回: 只显示通过 */}
              {item.status === "rejected" && (
                <button
                  onClick={() => onApprove(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 py-2.5 text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98]"
                >
                  <Check className="h-5 w-5" />
                  重新通过
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
