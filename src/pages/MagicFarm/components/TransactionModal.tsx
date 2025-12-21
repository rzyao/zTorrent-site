import { X, Check } from 'lucide-react';
import type { Crop } from '../types';

// 中文说明：
// 交易弹窗纯展示组件：用于确认出售/购买等交易操作。
// - 由外部传入文案与回调，组件内部不包含业务状态。
// - 当前主要用于“出售全部”确认流程（可扩展到购买）。

interface Props {
  open: boolean;
  title: string;
  crop?: Crop;
  confirmText?: string;
  onConfirm?: () => void;
  onClose: () => void;
}

export function TransactionModal({ open, title, crop, confirmText = '确认', onConfirm, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-amber-900 text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* 内容 */}
        <div className="px-6 py-5">
          {crop ? (
            <div className="flex items-center gap-3">
              <div className="text-4xl">{crop.icon}</div>
              <div>
                <p className="text-amber-900">{crop.name}</p>
                <p className="text-sm text-amber-700">出售价：{crop.sellPrice}</p>
              </div>
            </div>
          ) : (
            <p className="text-amber-900">请确认操作</p>
          )}
        </div>
        {/* 操作区 */}
        <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition-all">取消</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all flex items-center gap-2">
            <Check className="w-4 h-4" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;

