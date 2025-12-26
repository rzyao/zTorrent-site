import type { ReviewItem } from "../types";
import { QuickReasonSelector } from "./QuickReasonSelector";

interface Props {
  visible: boolean;
  item: ReviewItem | null;
  actionType: "approve" | "reject" | null;
  actionNotes: string;
  onNotesChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ActionModal({
  visible,
  item,
  actionType,
  actionNotes,
  onNotesChange,
  onCancel,
  onConfirm,
}: Props) {
  if (!visible || !item || !actionType) return null;

  // 处理追加理由
  const handleAddReason = (reason: string) => {
    // 只有在驳回时才追加？其实通过也可以写理由
    // 如果框里已有内容，先加个逗号或换行
    const separator = actionNotes.trim().length > 0 ? "\n" : "";
    onNotesChange(actionNotes + separator + reason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      {/* 调高 z-index 确保盖过 Drawer */}
      <div className="w-full max-w-lg rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl">
        <div className="border-b border-neutral-700 p-6">
          <h2 className="text-xl text-neutral-100">
            {actionType === "approve" ? "通过审核" : "驳回申请"}
          </h2>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between rounded-lg bg-neutral-800/50 p-4">
            <div>
              <div className="mb-1 text-sm text-neutral-400">操作项目</div>
              <div className="font-medium text-neutral-200">{item.title}</div>
            </div>
            <div
              className={`rounded px-2 py-1 text-xs ${actionType === "approve" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            >
              {actionType === "approve" ? "APPROVE" : "REJECT"}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              审核备注 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={actionNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder={
                actionType === "approve" ? "请输入通过理由 (可选)..." : "请输入驳回原因..."
              }
              className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
              rows={4}
              maxLength={500}
            />
            <div className="mt-2 flex items-center justify-between">
              {/* 只有驳回时才显示快捷理由 */}
              {actionType === "reject" ? (
                <div className="mr-4 flex-1">
                  {/* 嵌入快捷理由组件，由于容器有点小，可能需要让 reason selector 排版更紧凑 */}
                  {/* 这里我们直接使用，QuickReasonSelector 自身是 flex wrap 的 */}
                  <QuickReasonSelector onAddReason={handleAddReason} />
                </div>
              ) : (
                <div className="flex-1" />
              )}
              <div className="mt-1 shrink-0 self-end text-xs text-neutral-500">
                {actionNotes.length} / 500
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-neutral-700 p-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-neutral-700 py-2.5 text-neutral-300 transition-all hover:bg-neutral-600"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={actionNotes.trim().length === 0}
            className={`flex-1 rounded-lg py-2.5 transition-all ${actionNotes.trim().length === 0 ? "cursor-not-allowed bg-neutral-700 text-neutral-500" : actionType === "approve" ? "bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25" : "bg-linear-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/25"}`}
          >
            确认{actionType === "approve" ? "通过" : "驳回"}
          </button>
        </div>
      </div>
    </div>
  );
}
