import { Gamepad2, Star, Trophy, TrendingUp } from 'lucide-react';
import type { UserStats } from '../types';

export function StatsCards({ userStats }: { userStats: UserStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl text-white">{userStats.totalPlays}</div>
            <div className="text-sm text-neutral-400">游戏次数</div>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl text-white">{userStats.totalRewards}</div>
            <div className="text-sm text-neutral-400">累计奖励</div>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl text-white">#{userStats.rank}</div>
            <div className="text-sm text-neutral-400">排行榜</div>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-2xl text-white">Lv.{userStats.level}</div>
            <div className="text-sm text-neutral-400">当前等级</div>
          </div>
        </div>
      </div>
    </div>
  );
}
