// 空状态组件
// 说明：当下载器列表为空时展示占位与入口按钮。

import { Download, Plus } from 'lucide-react';

export function EmptyState({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="text-center py-16 bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50">
      <Download className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
      <p className="text-neutral-400 mb-4">还没有添加任何下载器</p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg shadow-amber-500/30"
      >
        <Plus className="w-5 h-5" />
        添加第一个下载器
      </button>
    </div>
  );
}

