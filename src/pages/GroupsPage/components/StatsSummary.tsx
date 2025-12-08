/**
 * 页面统计信息组件（纯展示）。
 * 接收 `groups`，内部计算并渲染统计卡片。
 */
import React from 'react';
import { Users, CheckCircle2, TrendingUp, User } from 'lucide-react';
import type { Group } from '../types';

interface StatsSummaryProps {
  groups: Group[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ groups }) => {
  const activeGroups = groups.length;
  const recruitingCount = groups.filter((g) => g.recruiting).length;
  const totalReleases = groups.reduce((sum, g) => sum + g.stats.releases, 0);
  const totalMembers = groups.reduce((sum, g) => sum + g.stats.members, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* 活跃制作组 */}
      <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-amber-300/60 text-sm">活跃制作组</div>
            <div className="text-amber-50">{activeGroups}</div>
          </div>
        </div>
      </div>

      {/* 正在招募 */}
      <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <div className="text-green-300/60 text-sm">正在招募</div>
            <div className="text-green-50">{recruitingCount}</div>
          </div>
        </div>
      </div>

      {/* 总发布数 */}
      <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-blue-300/60 text-sm">总发布数</div>
            <div className="text-blue-50">{totalReleases}</div>
          </div>
        </div>
      </div>

      {/* 总成员数 */}
      <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <User className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-purple-300/60 text-sm">总成员数</div>
            <div className="text-purple-50">{totalMembers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

