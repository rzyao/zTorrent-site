import {
  X,
  Check,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ReviewItem } from "../types";
import { useReviewItemDetail } from "../hooks/useReviewItemDetail";
import { QuickReasonSelector } from "./QuickReasonSelector";
import { TorrentDetailBody } from "@/components/business/TorrentDetailBody";
import { MovieDetailBody } from "@/components/business/MovieDetailBody";
import { PlaylistDetailBody } from "@/components/business/PlaylistDetailBody";
import { ActionModal } from "./ActionModal";

// ============================================
// Props
// ============================================

interface Props {
  item: ReviewItem;
  onClose: () => void;
  /** 点击通过时，传递到父组件处理 (可能需要进一步弹窗确认，或者直接提交) */
  onApprove: (item: ReviewItem) => void;
  /** 点击驳回时，传递到父组件处理 */
  onReject: (item: ReviewItem) => void;
}

// ============================================
// Main Component
// ============================================

export function DetailDrawer({ item, onClose, onApprove, onReject }: Props) {
  // 1. 数据层：实时抓取全量详情
  const { data, loading, error } = useReviewItemDetail(item.id, item.type);

  // 2. 本地嵌入式 Action 状态 (替代原有外弹的 ActionModal，我们在 Drawer 内部集成更顺滑的体验)
  // 为了不破坏原有父组件的 flow，我们暂时保留父组件的 onApprove/onReject 接口。
  // 但我们可以在 Drawer 底部做一个 "Confirm Bar"。
  // 目前父级 ReviewPage 的实现是：ActionModal 是独立于 Drawer 的。
  // 为了复用父级 ActionModal 的逻辑 (reviewSwitches 之类的)，我们这里仍然触发父级回调。
  // 不过为了集成 "QuickReasonSelector"，我们需要在点击驳回时，传递预设理由？
  // 现有架构下 ActionModal 是完全独立的，Drawer 只是用来 "看"。
  // 为了达到 "一键填入理由"，我们可以在这里做一层拦截：
  // 先在 Drawer 底部选择理由，然后点击 "驳回"，此时调用父级 onReject，并且能不能带上 note？
  // 回看 ReviewPage 的 handleAction 逻辑：
  // const handleAction = (item, type) => { setSelectedItem(item); setActionType(type); }
  // 它只是打开 Modal。
  // 为了真正实现 "一键"，我们最好是在 Drawer 内部直接展示 "驳回面板" 或者将 QuickReasons 放进 ActionModal。
  // *最佳方案*: 既然 PRD 要求 "沉浸式"，我们可以在 Drawer 底部做一个可展开的 Action 面板。
  // 但考虑到改动范围，我们这里先做一个折衷：
  // 在底部展示操作区，点击 "驳回" 后，弹出的 ActionModal 支持 QuickReasons。
  // 等等，用户在 ActionModal 里面看不到 QuickReasons。
  // 既然我们在 Drawer 里，那我们就在 Drawer 底部直接嵌入 QuickReasons。
  // 当用户点击 QuickReasons 时，我们把它存到一个 local state，然后点击 "驳回" 时，把这个 state 传给 ActionModal?
  // 遗憾的是 ReviewPage 的 onReject 只接受 item。

  // *重构策略*: 我们在 Drawer 底部直接重写一套 Action 处理 UI，不使用 ReviewPage 的 ActionModal 触发方式？
  // 或者修改 ActionModal 让它支持 QuickReasons。
  // 为了不影响其他页面，我们先保持 Drawer 只是 "View + Trigger"。
  // *改进*: 我们在此 Drawer 底部放置 QuickReasons，用户点了之后，我们可以复制理由到剪贴板？ 这太 Low 了。
  // *正确做法*: 本次重构的核心是 Drawer。我们可以在 Drawer 内部包含 Action 逻辑。
  // 但 ReviewPage 逻辑里已经有一套 ActionModal。
  // 我们暂时只需做到：Drawer 底部常驻 Action Bar。
  // 如果要支持一键理由，我们可以在 ReviewPage 的 ActionModal 里加 QuickReasons。
  // *修正计划*:
  // 1. Drawer 底部只展示 "通过" / "驳回" 按钮。
  // 2. 点击按钮 -> 打开 ActionModal。
  // 3. 我们把 QuickReasonSelector 加到 ActionModal 里去！(这将作为额外的 Bonus Task，或者直接在这里集成)
  // *替代方案*: 在 Drawer 底部直接显示一个 "简易操作区"：
  //   [ 驳回理由输入框 (集成 Tags) ]
  //   [ 驳回按钮 ] [ 通过按钮 ]
  // 这样就不需要弹 ActionModal 了，直接调用 API。
  // 但父组件 `useReviewActions` 封装了 API 调用。
  // 我们可以通过 `onConfirmAction(item, type, note)` 来直接调用。
  // 遗憾的是父组件 props 只传了 onApprove(item), onReject(item)。

  // 既然只能用 onApprove/onReject，那我们还是遵循现有流：
  // 1. 点击底部按钮。
  // 2. 触发父组件打开 ActionModal。
  // 3. (下一步优化) 我们去修改 ActionModal 加入 ReasonSelector。

  // 对于本次 Task 6，重点是 Wide Drawer 和 Detail Body 的集成。

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/80 backdrop-blur-sm md:items-center">
      {/* 宽幅抽屉: w-[90vw] max-w-[1600px] */}
      <div className="flex h-full w-full flex-col border-l border-neutral-700 bg-neutral-900 md:h-screen md:w-[90vw] md:max-w-[1600px]">
        {/* Header */}
        <div className="z-10 flex shrink-0 items-center justify-between border-b border-neutral-700 bg-neutral-900 p-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl text-neutral-100">审核详情</h2>
            {/* 状态徽章 */}
            <div
              className={`rounded border px-2 py-0.5 text-xs ${
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
              className="flex items-center gap-1 text-sm text-neutral-400 hover:text-amber-400"
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
        <div className="relative flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-neutral-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <p>正在拉取全量详情...</p>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-red-400">
              <AlertTriangle className="h-8 w-8" />
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="text-sm underline">
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
              {!data && <div className="py-10 text-center text-neutral-500">未找到相关数据</div>}
            </div>
          )}
        </div>

        {/* Footer (Sticky Action Bar) */}
        {item.status === "pending" && (
          <div className="z-20 shrink-0 border-t border-neutral-700 bg-neutral-900 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* 审核建议区域 (复用原 Drawer 的逻辑，稍微简化) */}
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

              {/* 按钮组 */}
              <div className="flex gap-3 md:w-1/3">
                <button
                  onClick={() => onApprove(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 py-3 text-white transition-all hover:shadow-lg hover:shadow-green-500/25"
                >
                  <Check className="h-5 w-5" />
                  通过
                </button>
                <button
                  onClick={() => onReject(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-500 to-rose-600 py-3 text-white transition-all hover:shadow-lg hover:shadow-red-500/25"
                >
                  <X className="h-5 w-5" />
                  驳回
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
