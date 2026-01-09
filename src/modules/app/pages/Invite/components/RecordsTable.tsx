import { Mail } from "lucide-react";
import { getStatusColor, getStatusText, getStatusIcon } from "../utils";
import type { SentInvite } from "../types";

export function RecordsTable({ records }: { records: SentInvite[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700 bg-neutral-800">
              <th className="px-6 py-4 text-left text-sm text-neutral-400">邀请码</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">接收人</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">邮箱</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">发放时间</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">注册/过期时间</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">状态</th>
            </tr>
          </thead>
          <tbody>
            {records.map((invite) => {
              const StatusIcon = getStatusIcon(invite.status);
              return (
                <tr
                  key={invite.id}
                  className="border-b border-neutral-700 transition-colors hover:bg-neutral-800/50"
                >
                  <td className="px-6 py-4">
                    <code className="rounded bg-neutral-800 px-3 py-1.5 font-mono text-sm text-white">
                      {invite.code}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm text-white ${invite.status === "registered" ? "bg-linear-to-br from-green-500 to-emerald-600" : invite.status === "pending" ? "bg-linear-to-br from-yellow-500 to-orange-600" : "bg-neutral-700"}`}
                      >
                        {invite.recipientName.charAt(0)}
                      </div>
                      <span
                        className={invite.status === "expired" ? "text-neutral-500" : "text-white"}
                      >
                        {invite.recipientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 ${invite.status === "expired" ? "text-neutral-500" : "text-neutral-400"}`}
                    >
                      <Mail className="h-4 w-4" />
                      <span>{invite.recipientEmail}</span>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 ${invite.status === "expired" ? "text-neutral-500" : "text-neutral-400"}`}
                  >
                    {invite.sentAt}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        invite.status === "registered"
                          ? "text-green-400"
                          : invite.status === "pending"
                            ? "text-neutral-400"
                            : "text-neutral-500"
                      }
                    >
                      {invite.status === "registered" ? invite.registeredAt : invite.expiresAt}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex w-fit items-center gap-1.5 rounded-lg border px-3 py-1 text-sm ${getStatusColor(invite.status)}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {getStatusText(invite.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
