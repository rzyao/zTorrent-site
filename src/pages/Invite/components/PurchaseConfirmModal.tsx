import { X, Sparkles, Loader2 } from 'lucide-react';

export function PurchaseConfirmModal({
  open,
  type,
  quantity,
  unitPrice,
  magicPoints,
  submitting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  type: 'permanent' | 'temp';
  quantity: number;
  unitPrice?: number | string;
  magicPoints: number;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  const priceNum = typeof unitPrice === 'string' ? parseFloat(unitPrice) : Number(unitPrice ?? 0);
  const total = priceNum * quantity;
  const name = type === 'permanent' ? '永久邀请名额' : '临时邀请名额';
  const insufficient = total > magicPoints;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-b border-neutral-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white text-lg">确认购买</h3>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">商品</span>
              <span className="text-white">{name}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">单价</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-white">{priceNum || '-'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">数量</span>
              <span className="text-white">{quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-sm">总计</span>
              <div className={`flex items-center gap-1 ${insufficient ? 'text-red-400' : 'text-amber-400'}`}>
                <Sparkles className="w-4 h-4" />
                <span className="text-white">{Number.isFinite(total) ? total : '-'}</span>
              </div>
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-sm">当前魔力值</span>
              <span className="text-white">{magicPoints.toLocaleString()}</span>
            </div>
            {insufficient && (
              <div className="text-red-400 text-sm mt-2">余额不足，请先获取更多魔力值</div>
            )}
          </div>
        </div>
        <div className="bg-neutral-800/50 border-t border-neutral-700 px-6 py-4 flex gap-3">
          <button onClick={onCancel} disabled={submitting} className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">取消</button>
          <button onClick={onConfirm} disabled={submitting || insufficient || !Number.isFinite(total) || total <= 0} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? '购买中…' : '确认购买'}
          </button>
        </div>
      </div>
    </div>
  );
}
