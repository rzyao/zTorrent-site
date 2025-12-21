import type { UserStats } from '../types';
import { Coins, Star, Zap, Gift } from 'lucide-react';

// 中文说明：
// FarmStats 为纯展示组件：负责渲染用户的金币、等级、能量等数值与视觉进度条。
// - 仅通过 props 接收数据，内部不包含任何业务逻辑或副作用。
// - 不关心具体布局容器，由上层组件（FarmHeader）负责摆放位置。

interface Props {
  userStats: UserStats;
}

export function FarmStats({ userStats }: Props) {
  return (
    <div className="flex items-center gap-4">
      {/* 用户状态卡片 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-amber-400 shadow-lg px-6 py-3">
        <div className="flex items-center gap-6">
          {/* 金币 */}
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="text-amber-900">{userStats.coins.toLocaleString()}</span>
          </div>
          <div className="w-px h-6 bg-amber-300"></div>
          {/* 等级 */}
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-amber-900">Lv.{userStats.level}</span>
          </div>
          <div className="w-px h-6 bg-amber-300"></div>
          {/* 能量与进度条 */}
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            <span className="text-amber-900">{userStats.energy}/{userStats.maxEnergy}</span>
            <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-500 to-emerald-500"
                style={{ width: `${(userStats.energy / userStats.maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 每日礼包按钮（保持与原页面一致的视觉） */}
      <button className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all">
        <Gift className="w-5 h-5" />
        <span>每日礼包</span>
      </button>
    </div>
  );
}

export default FarmStats;

