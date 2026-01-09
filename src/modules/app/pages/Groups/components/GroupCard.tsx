/**
 * 普通制作组卡片组件（小卡片样式）。
 * 保持与原 UI 一致，纯展示组件，通过 props 传入数据。
 */
import React from 'react';
import { Crown } from 'lucide-react';
import type { Group } from '../types';
import { getIconComponent, getLevelBadge, getLevelColor } from '.@/utils/cn';

interface GroupCardProps {
  group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const Icon = getIconComponent(group.icon);

  return (
    <div className="bg-linear-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg overflow-hidden hover:border-amber-400/40 transition-all">
      {/* Banner */}
      <div className="relative h-24">
        <img src={group.banner} alt={group.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0F171E] to-transparent" />

        {group.recruiting && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white rounded text-xs">招募中</div>
        )}
      </div>

      <div className="p-4">
        {/* 头像和标题 */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">
            <img
              src={group.avatar}
              alt={group.name}
              className="w-12 h-12 rounded object-cover border border-amber-500/30"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-sm">
              <Icon className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-amber-50 text-sm mb-1 truncate">{group.name}</h3>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 bg-linear-to-r ${getLevelColor(group.level)} rounded-full`}>
              <Crown className="w-2.5 h-2.5 text-gray-900" />
              <span className="text-gray-900 text-xs">{getLevelBadge(group.level)}</span>
            </div>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-amber-200/70 text-xs mb-3 line-clamp-2">{group.description}</p>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div>
            <div className="text-amber-300 text-sm">{group.stats.members}</div>
            <div className="text-amber-400/60 text-xs">成员</div>
          </div>
          <div>
            <div className="text-amber-300 text-sm">{group.stats.releases}</div>
            <div className="text-amber-400/60 text-xs">发布</div>
          </div>
          <div>
            <div className="text-amber-300 text-sm">{group.stats.quality}%</div>
            <div className="text-amber-400/60 text-xs">质量</div>
          </div>
        </div>

        {/* 按钮 */}
        <button className="w-full px-3 py-1.5 bg-linear-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded text-xs transition-all">
          查看详情
        </button>
      </div>
    </div>
  );
};

