import { UserPlus } from 'lucide-react';

export function InviteHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-white text-3xl">邀请管理</h1>
      </div>
      <p className="text-neutral-400 ml-13">管理您的邀请码，邀请好友加入社区</p>
    </div>
  );
}
