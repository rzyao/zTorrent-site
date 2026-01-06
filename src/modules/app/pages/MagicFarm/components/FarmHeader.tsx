import { Sun } from 'lucide-react';
import type { UserStats } from '../types';
import { FarmStats } from './FarmStats';

// 中文说明：
// FarmHeader 为页面顶部的头部区域，组合用户状态与天气信息。
// - 内部仅进行 UI 排版，不持有任何状态。
// - 通过 props 接收用户状态并传递给子组件。

interface Props {
  userStats: UserStats;
}

export function FarmHeader({ userStats }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between">
      {/* 左侧用户状态与礼包 */}
      <FarmStats userStats={userStats} />

      {/* 右侧天气信息卡片（与原页面保持一致） */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-blue-300 shadow-lg px-6 py-3">
        <div className="flex items-center gap-3">
          <Sun className="w-6 h-6 text-yellow-500" />
          <div>
            <p className="text-sm text-blue-900">晴朗</p>
            <p className="text-xs text-blue-700">成长速度 +20%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmHeader;

