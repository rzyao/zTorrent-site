import { Eye, EyeOff, Copy, Check, Calendar, Clock, Send } from "lucide-react";
import { getStatusColor, getStatusText } from "../utils";
import type { InviteCode } from "../types";

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
      <h3 className="mb-4 flex items-center gap-2 text-lg text-white">
        <span className="h-5 w-1 rounded-full bg-linear-to-b from-green-500 to-emerald-600"></span>
        可用邀请码 ({unusedCodes.length})
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {unusedCodes.map((invite) => (
          <div
            key={invite.id}
            className="rounded-xl border border-neutral-700 bg-neutral-900 p-5 transition-all hover:border-green-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <code className="rounded-lg bg-neutral-800 px-4 py-2 font-mono text-lg text-white">
                    {showCodeMap[invite.id] ? invite.code : invite.code.slice(0, 6) + "••••••••"}
                  </code>
                  <button
                    onClick={() => onToggleShow(invite.id)}
                    className="rounded-lg p-2 transition-colors hover:bg-neutral-800"
                    title={showCodeMap[invite.id] ? "隐藏" : "显示"}
                  >
                    {showCodeMap[invite.id] ? (
                      <EyeOff className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-neutral-400" />
                    )}
                  </button>
                  <span
                    className={`rounded-lg border px-3 py-1 text-sm ${getStatusColor(invite.status)}`}
                  >
                    {getStatusText(invite.status)}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>创建于 {invite.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>过期于 {invite.expiresAt}</span>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <button
                  onClick={() => onCopy(invite.code)}
                  className="flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-white transition-all hover:bg-neutral-700"
                >
                  {copiedCode === invite.code ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>复制</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => onOpenSend(invite)}
                  className="flex items-center gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 px-4 py-2 text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-orange-700"
                >
                  <Send className="h-4 w-4" />
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
