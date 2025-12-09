import type { ReviewItem } from '../types';

interface Props {
  visible: boolean;
  item: ReviewItem | null;
  actionType: 'approve' | 'reject' | null;
  actionNotes: string;
  onNotesChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ActionModal({ visible, item, actionType, actionNotes, onNotesChange, onCancel, onConfirm }: Props) {
  if (!visible || !item || !actionType) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-neutral-700">
          <h2 className="text-xl text-neutral-100">{actionType === 'approve' ? '通过审核' : '驳回申请'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <div className="text-sm text-neutral-400 mb-2">操作项目</div>
            <div className="text-neutral-200">{item.title}</div>
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-2 block">审核备注 <span className="text-red-400">*</span></label>
            <textarea
              value={actionNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder={actionType === 'approve' ? '请输入通过理由...' : '请输入驳回原因...'}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-neutral-500 mt-1 text-right">{actionNotes.length} / 500</div>
          </div>
        </div>
        <div className="p-6 border-t border-neutral-700 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-all">取消</button>
          <button onClick={onConfirm} disabled={actionNotes.trim().length === 0} className={`flex-1 py-2.5 rounded-lg transition-all ${actionNotes.trim().length === 0 ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' : actionType === 'approve' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/25'}`}>确认{actionType === 'approve' ? '通过' : '驳回'}</button>
        </div>
      </div>
    </div>
  );
}

