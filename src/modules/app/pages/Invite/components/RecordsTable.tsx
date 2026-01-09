import { Mail } from 'lucide-react';
import { getStatusColor, getStatusText, getStatusIcon } from '.@/utils/cn';
import type { SentInvite } from '../types';

export function RecordsTable({ records }: { records: SentInvite[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-800 border-b border-neutral-700">
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">邀请码</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">接收人</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">邮箱</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">发放时间</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">注册/过期时间</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">状态</th>
            </tr>
          </thead>
          <tbody>
            {records.map((invite) => {
              const StatusIcon = getStatusIcon(invite.status);
              return (
                <tr key={invite.id} className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <code className="text-white font-mono text-sm bg-neutral-800 px-3 py-1.5 rounded">{invite.code}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${invite.status === 'registered' ? 'bg-linear-to-br from-green-500 to-emerald-600' : invite.status === 'pending' ? 'bg-linear-to-br from-yellow-500 to-orange-600' : 'bg-neutral-700'}`}>{invite.recipientName.charAt(0)}</div>
                      <span className={invite.status === 'expired' ? 'text-neutral-500' : 'text-white'}>{invite.recipientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 ${invite.status === 'expired' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      <Mail className="w-4 h-4" />
                      <span>{invite.recipientEmail}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${invite.status === 'expired' ? 'text-neutral-500' : 'text-neutral-400'}`}>{invite.sentAt}</td>
                  <td className="px-6 py-4">
                    <span className={invite.status === 'registered' ? 'text-green-400' : invite.status === 'pending' ? 'text-neutral-400' : 'text-neutral-500'}>{invite.status === 'registered' ? invite.registeredAt : invite.expiresAt}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-1.5 w-fit ${getStatusColor(invite.status)}`}>
                      <StatusIcon className="w-4 h-4" />
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
