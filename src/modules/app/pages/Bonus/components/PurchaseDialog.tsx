import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/modules/app/components/ui/dialog';
import { Sparkles, Copy, Mail, Loader2 } from 'lucide-react';
import type { StoreItem } from '@/api/custom/store';
import { MailService } from '@/api/services/MailService';

export function PurchaseDialog({
  open,
  onOpenChange,
  selectedItem,
  email,
  onEmailChange,
  quantity,
  onQuantityChange,
  balance,
  submitting,
  errorMsg,
  resultCode,
  onRetry,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedItem: StoreItem | null;
  email: string;
  onEmailChange: (s: string) => void;
  quantity: number;
  onQuantityChange: (n: number) => void;
  balance: number | null;
  submitting: boolean;
  errorMsg: string | null;
  resultCode: string | null;
  onRetry: () => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border border-neutral-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>确认购买</DialogTitle>
          <DialogDescription className="text-neutral-400">请确认购买信息并提交订单</DialogDescription>
        </DialogHeader>
        {selectedItem ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-400">商品</div>
                <div className="text-white">{selectedItem.title}</div>
              </div>
              <div className="text-amber-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-lg">{selectedItem.pricePoints}</span>
              </div>
            </div>

            {selectedItem.key === 'invite_code' && (
              <div>
                <label className="block text-sm text-neutral-400 mb-1">收件邮箱</label>
                <input value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="target@example.com" className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500" />
                {email && !/^\S+@\S+\.\S+$/.test(email) && <div className="text-red-400 text-xs mt-1">邮箱格式不正确</div>}
              </div>
            )}

            <div>
              <label className="block text-sm text-neutral-400 mb-1">数量</label>
              <input type="number" min={1} value={quantity} onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value || 1)))} className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500" />
            </div>

            <div className="rounded-md bg-neutral-800 border border-neutral-700 p-3">
              <div className="text-sm text-neutral-400 mb-1">扣除积分与余额</div>
              <div className="flex items-center justify-between">
                <div className="text-white">本次将扣除：{Number(selectedItem.pricePoints) * quantity}</div>
                <div className="text-neutral-400">当前余额：{balance ?? '未知'}</div>
              </div>
              {balance !== null && Number(selectedItem.pricePoints) * quantity > (balance ?? 0) && <div className="text-red-400 text-sm mt-1">余额不足，去赚取积分</div>}
            </div>

            {errorMsg && (
              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="text-red-400">{errorMsg}</div>
                <button className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white" onClick={onRetry}>重试</button>
              </div>
            )}
            {resultCode && (
              <div className="rounded-md bg-neutral-800 border border-neutral-700 p-3">
                <div className="text-sm text-neutral-400 mb-1">{selectedItem.key === 'invite_code' ? '交付结果（邀请码）' : '交付结果'}</div>
                <div className="flex items-center justify-between">
                  <div className="text-white break-all">{resultCode}</div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white flex items-center gap-1" onClick={async () => { try { await navigator.clipboard.writeText(resultCode); console.info('[invite_code_copy]'); } catch { } }}> <Copy className="w-4 h-4" /> 复制</button>
                    {selectedItem.key === 'invite_code' && email && /^\S+@\S+\.\S+$/.test(email) && (
                      <button className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white flex items-center gap-1" onClick={async () => { try { await MailService.mailControllerSendReport({ to: email, subject: '官方邀请码', text: `您的邀请码：${resultCode}` }); console.info('[invite_code_email_send]'); } catch { } }}> <Mail className="w-4 h-4" /> 发送到邮箱</button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex items-center justify-end gap-2">
              <button className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => onOpenChange(false)} disabled={submitting}>取消</button>
              <button className={`px-4 py-2 rounded text-white ${submitting ? 'bg-neutral-700 cursor-not-allowed' : 'bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'} flex items-center gap-2`} disabled={submitting || (selectedItem.key === 'invite_code' && !/^\S+@\S+\.\S+$/.test(email)) || (balance !== null && Number(selectedItem.pricePoints) * quantity > (balance ?? 0))} onClick={onSubmit}>
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? '购买中…' : '确认购买'}
              </button>
            </DialogFooter>
          </div>
        ) : (
          <div className="text-neutral-400">未选择商品</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
