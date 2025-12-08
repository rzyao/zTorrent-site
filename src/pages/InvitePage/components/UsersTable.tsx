import { Mail, Upload, Download } from 'lucide-react';
import type { InvitedUser } from '../types';

export function UsersTable({ users }: { users: InvitedUser[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-800 border-b border-neutral-700">
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">用户名</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">邮箱</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">加入时间</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">上传量</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">下载量</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">分享率</th>
              <th className="text-left text-neutral-400 px-6 py-4 text-sm">状态</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">{user.username.charAt(0)}</div>
                    <span className="text-white">{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-400">{user.joinedAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-green-400">
                    <Upload className="w-4 h-4" />
                    <span>{user.uploadData}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Download className="w-4 h-4" />
                    <span>{user.downloadData}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-amber-400">{user.shareRatio}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${user.status === 'vip' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>{user.status === 'vip' ? 'VIP会员' : '活跃'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
