/**
 * 精选制作组卡片组件（大卡片样式）。
 * 保持与原 UI 一致，纯展示组件，通过 props 传入数据。
 */
import React from 'react';
import { Crown, Star, UserPlus } from 'lucide-react';
import type { Group } from '../types';
import { getIconComponent, getLevelBadge, getLevelColor } from '../utils';

interface FeaturedGroupCardProps {
  group: Group;
}

export const FeaturedGroupCard: React.FC<FeaturedGroupCardProps> = ({ group }) => {
  const Icon = getIconComponent(group.icon);

  return (
    <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg overflow-hidden hover:border-amber-400/40 transition-all">
      {/* Banner */}
      <div className="relative h-32">
        <img src={group.banner} alt={group.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] to-transparent" />

        {/* 等级徽章 */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 bg-gradient-to-r ${getLevelColor(
            group.level
          )} text-gray-900 rounded-full text-xs flex items-center gap-1`}
        >
          <Crown className="w-3 h-3" />
          {getLevelBadge(group.level)}
        </div>

        {/* 招募中标签 */}
        {group.recruiting && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs flex items-center gap-1">
            <UserPlus className="w-3 h-3" />
            招募中
          </div>
        )}
      </div>

      <div className="p-6">
        {/* 头像和标题 */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={group.avatar}
              alt={group.name}
              className="w-16 h-16 rounded-lg object-cover border-2 border-amber-500/30"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded">
              <Icon className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-amber-50 mb-1">{group.name}</h3>
            <div className="flex flex-wrap gap-2">
              {group.achievements.map((achievement, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded text-xs"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-amber-200/70 text-sm mb-4 line-clamp-2">{group.description}</p>

        {/* 专长 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {group.specialties.map((specialty, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 text-amber-300 rounded text-xs"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="text-amber-300">{group.stats.members}</div>
            <div className="text-amber-400/60 text-xs">成员</div>
          </div>
          <div className="text-center">
            <div className="text-amber-300">{group.stats.releases}</div>
            <div className="text-amber-400/60 text-xs">发布</div>
          </div>
          <div className="text-center">
            <div className="text-amber-300">{group.stats.quality}%</div>
            <div className="text-amber-400/60 text-xs">质量</div>
          </div>
          <div className="text-center">
            <div className="text-amber-300">{group.stats.founded.slice(0, 4)}</div>
            <div className="text-amber-400/60 text-xs">成立</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded text-sm transition-all">
            查看详情
          </button>
          {group.recruiting && (
            <button className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-400 text-green-300 rounded text-sm transition-all">
              申请加入
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

