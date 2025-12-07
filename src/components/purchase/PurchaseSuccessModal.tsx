import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Sparkles, CheckCircle, Copy, Calendar, User } from 'lucide-react';
import { useMemo } from 'react';
import type { PurchaseSuccessPayload } from '../../hooks/usePurchase';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  payload?: PurchaseSuccessPayload | null;
};

export function PurchaseSuccessModal({ open, onOpenChange, payload }: Props) {
  const expiresText = useMemo(() => {
    const iso = (payload?.deliveryResult as any)?.expiresAt as string | undefined;
    if (!iso) return '';
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${da} ${hh}:${mm}`;
  }, [payload]);

  const code = useMemo(() => String((payload?.deliveryResult as any)?.code ?? ''), [payload]);
  const added = useMemo(() => Number((payload?.deliveryResult as any)?.added ?? 0), [payload]);
  const charged = useMemo(() => Number(payload?.pointsCharged ?? 0), [payload]);
  const quantity = useMemo(() => Number(payload?.quantity ?? 0), [payload]);
  const targetUserId = useMemo(() => String((payload?.deliveryResult as any)?.targetUserId ?? ''), [payload]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border border-neutral-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            购买成功
          </DialogTitle>
          <DialogDescription className="text-neutral-400">订单已完成交付，以下为本次回执</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-neutral-800 border border-neutral-700 p-3">
            <div className="text-sm text-neutral-400 mb-1">本次扣除积分与数量</div>
            <div className="flex items-center justify-between">
              <div className="text-white flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>扣除：{Number.isFinite(charged) ? charged : '-'}</span>
              </div>
              <div className="text-neutral-400">数量：{Number.isFinite(quantity) ? quantity : '-'}</div>
            </div>
          </div>

          <div className="rounded-md bg-neutral-800 border border-neutral-700 p-3">
            <div className="text-sm text-neutral-400 mb-1">交付信息</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-400" />
                <span>目标用户：{targetUserId || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>新增资源：{Number.isFinite(added) ? added : '-'}</span>
              </div>
              {!!expiresText && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>到期时间：{expiresText}</span>
                </div>
              )}
            </div>
          </div>

          {!!code && (
            <div className="rounded-md bg-neutral-800 border border-neutral-700 p-3">
              <div className="text-sm text-neutral-400 mb-1">兑换码</div>
              <div className="flex items-center justify-between">
                <div className="text-white break-all font-mono">{code}</div>
                <button
                  className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white flex items-center gap-1"
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(code); } catch {}
                  }}
                >
                  <Copy className="w-4 h-4" /> 复制
                </button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
            onClick={() => onOpenChange(false)}
          >
            我知道了
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

