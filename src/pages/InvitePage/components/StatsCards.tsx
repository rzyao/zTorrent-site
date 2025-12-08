import { Gift, Check, Clock, Users, Sparkles } from 'lucide-react';

export function StatsCards({
  totalInvites,
  usedInvites,
  remainingInvites,
  magicPoints,
  invitedUsersCount,
}: {
  totalInvites: number;
  usedInvites: number;
  remainingInvites: number;
  magicPoints: number;
  invitedUsersCount: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">总邀请数</span>
          <Gift className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-white text-3xl">{totalInvites}</div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-green-500/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">已使用</span>
          <Check className="w-5 h-5 text-green-400" />
        </div>
        <div className="text-white text-3xl">{usedInvites}</div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">剩余可用</span>
          <Clock className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-white text-3xl">{remainingInvites}</div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">后宫人数</span>
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div className="text-white text-3xl">{invitedUsersCount}</div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">魔力值</span>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-white text-3xl">{magicPoints.toLocaleString()}</div>
      </div>
    </div>
  );
}
