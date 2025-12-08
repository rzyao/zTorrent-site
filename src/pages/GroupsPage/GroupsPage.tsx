/**
 * 页面容器组件：组装拆分后的子组件，保持原有 UI 与布局。
 *
 * 设计原则：
 * - 无业务状态（本页为静态数据），通过常量与纯函数驱动 UI。
 * - 将视觉模块拆分到 `components/`；数据结构在 `types.ts`；工具方法在 `utils.ts`；静态数据在 `constants.ts`。
 */
import React from 'react';
import { Shield, Star } from 'lucide-react';
import { mockGroups } from './constants';
import type { Group } from './types';
import { GroupsHeader } from './components/GroupsHeader';
import { StatsSummary } from './components/StatsSummary';
import { FeaturedGroupCard } from './components/FeaturedGroupCard';
import { GroupCard } from './components/GroupCard';

export const GroupsPage: React.FC = () => {
  // 将数据按是否精选进行划分，便于渲染
  const featuredGroups: Group[] = mockGroups.filter((g) => g.featured);
  const normalGroups: Group[] = mockGroups.filter((g) => !g.featured);

  return (
    <div className="min-h-screen bg-[#0F171E] pt-16">
      {/* 头部区域 */}
      <GroupsHeader />

      {/* 内容容器 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计信息 */}
        <StatsSummary groups={mockGroups} />

        {/* 精选制作组 */}
        {featuredGroups.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400" />
              <h2 className="text-amber-50">精选制作组</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredGroups.map((group) => (
                <FeaturedGroupCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        )}

        {/* 全部制作组 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="text-amber-50">全部制作组</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {normalGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

