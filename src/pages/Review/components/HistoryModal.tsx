import { X, Check, User } from 'lucide-react';
import type { AuditHistory } from '../types';

interface Props {
  visible: boolean;
  items: AuditHistory[];
  loading: boolean;
  onClose: () => void;
}

export function HistoryModal({ visible, items, loading, onClose }: Props) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl text-neutral-100">审核历史</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-neutral-400">加载历史中…</div>
            ) : items.length > 0 ? (
              items.map((history) => (
                <div key={history.id} className="bg-neutral-800/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-neutral-400" />
                      <div>
                        <div className="text-neutral-200">{history.reviewer}</div>
                        <div className="text-xs text-neutral-500">{history.date}</div>
                      </div>
                    </div>
                    {history.action === 'approved' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        <Check className="w-3 h-3" />
                        已通过
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        <X className="w-3 h-3" />
                        已驳回
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-neutral-300 bg-neutral-900/50 rounded p-3">{history.notes}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-400">暂无审核历史</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

