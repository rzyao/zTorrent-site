import { Send, X, AlertCircle } from 'lucide-react';
import type { InviteCode } from '../types';

export function SendInviteModal({
  open,
  selectedCode,
  recipientName,
  recipientEmail,
  onChangeName,
  onChangeEmail,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  selectedCode: InviteCode | null;
  recipientName: string;
  recipientEmail: string;
  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open || !selectedCode) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-linear-to-r from-amber-500/20 to-orange-600/20 border-b border-neutral-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white text-lg">发放邀请码</h3>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-neutral-400 text-sm mb-2">邀请码</label>
            <code className="block text-white text-lg font-mono bg-neutral-800 px-4 py-3 rounded-lg text-center">{selectedCode.code}</code>
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-2">接收人姓名 <span className="text-red-400">*</span></label>
            <input type="text" value={recipientName} onChange={(e) => onChangeName(e.target.value)} placeholder="请输入接收人姓名" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors" />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-2">接收人邮箱 <span className="text-red-400">*</span></label>
            <input type="email" value={recipientEmail} onChange={(e) => onChangeEmail(e.target.value)} placeholder="请输入接收人邮箱" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors" />
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-blue-400 text-sm">邀请码将通过系统消息发送给接收人，请确保信息准确无误。</p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-800/50 border-t border-neutral-700 px-6 py-4 flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">取消</button>
          <button onClick={onConfirm} disabled={!recipientName || !recipientEmail} className="flex-1 px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">确认发放</button>
        </div>
      </div>
    </div>
  );
}
