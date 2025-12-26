import { X, Check, User } from "lucide-react";
import type { AuditHistory } from "../types";
import { formatDateTime } from "@/utils/format";

interface Props {
  visible: boolean;
  items: AuditHistory[];
  loading: boolean;
  onClose: () => void;
}

export function HistoryModal({ visible, items, loading, onClose }: Props) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-700 p-6">
          <h2 className="text-xl text-neutral-100">审核历史</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-neutral-800"
          >
            <X className="h-5 w-5 text-neutral-400" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <div className="space-y-4">
            {loading ? (
              <div className="py-8 text-center text-neutral-400">加载历史中…</div>
            ) : items.length > 0 ? (
              items.map((history) => (
                <div key={history.id} className="rounded-lg bg-neutral-800/50 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-neutral-400" />
                      <div>
                        <div className="text-neutral-200">{history.reviewer}</div>
                        <div className="text-xs text-neutral-500">
                          {formatDateTime(history.date)}
                        </div>
                      </div>
                    </div>
                    {history.action === "approved" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-1 text-xs text-green-400">
                        <Check className="h-3 w-3" />
                        已通过
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-1 text-xs text-red-400">
                        <X className="h-3 w-3" />
                        已驳回
                      </span>
                    )}
                  </div>
                  <div className="rounded bg-neutral-900/50 p-3 text-sm text-neutral-300">
                    {history.notes}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-neutral-400">暂无审核历史</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
