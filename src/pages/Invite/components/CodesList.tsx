import { Eye, EyeOff, Copy, Check, Calendar, Clock, Send } from 'lucide-react';
import { getStatusColor, getStatusText } from '../utils';
import type { InviteCode } from '../types';

export function CodesList({
  unusedCodes,
  copiedCode,
  showCodeMap,
  onToggleShow,
  onCopy,
  onOpenSend,
}: {
  unusedCodes: InviteCode[];
  copiedCode: string | null;
  showCodeMap: Record<string, boolean>;
  onToggleShow: (id: string) => void;
  onCopy: (code: string) => void;
  onOpenSend: (code: InviteCode) => void;
}) {
  return (
    <div>
      <h3 className="text-white text-lg mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-linear-to-b from-green-500 to-emerald-600 rounded-full"></span>
        可用邀请码 ({unusedCodes.length})
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {unusedCodes.map((invite) => (
          <div key={invite.id} className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <code className="text-white text-lg font-mono bg-neutral-800 px-4 py-2 rounded-lg">
                    {showCodeMap[invite.id] ? invite.code : invite.code.slice(0, 6) + '••••••••'}
                  </code>
                  <button onClick={() => onToggleShow(invite.id)} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors" title={showCodeMap[invite.id] ? '隐藏' : '显示'}>
                    {showCodeMap[invite.id] ? (
                      <EyeOff className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                  <span className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(invite.status)}`}>
                    {getStatusText(invite.status)}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>创建于 {invite.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>过期于 {invite.expiresAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => onCopy(invite.code)} className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-all flex items-center gap-2">
                  {copiedCode === invite.code ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>复制</span>
                    </>
                  )}
                </button>
                <button onClick={() => onOpenSend(invite)} className="px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20">
                  <Send className="w-4 h-4" />
                  <span>发放</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
