/**
 * 精选制作组卡片组件（大卡片样式）。
 * 保持与原 UI 一致，纯展示组件，通过 props 传入数据。
 */
import React from "react";
import { Crown, Star, UserPlus } from "lucide-react";
import type { Group } from "../types";
import { getIconComponent, getLevelBadge, getLevelColor } from "../utils";

interface FeaturedGroupCardProps {
  group: Group;
}

export const FeaturedGroupCard: React.FC<FeaturedGroupCardProps> = ({ group }) => {
  const Icon = getIconComponent(group.icon);

  return (
    <div className="overflow-hidden rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/5 to-orange-600/5 transition-all hover:border-amber-400/40">
      {/* Banner */}
      <div className="relative h-32">
        <img src={group.banner} alt={group.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0F171E] to-transparent" />

        {/* 等级徽章 */}
        <div
          className={`absolute top-3 right-3 bg-linear-to-r px-3 py-1 ${getLevelColor(
            group.level,
          )} flex items-center gap-1 rounded-full text-xs text-gray-900`}
        >
          <Crown className="h-3 w-3" />
          {getLevelBadge(group.level)}
        </div>

        {/* 招募中标签 */}
        {group.recruiting && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-linear-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs text-white">
            <UserPlus className="h-3 w-3" />
            招募中
          </div>
        )}
      </div>

      <div className="p-6">
        {/* 头像和标题 */}
        <div className="mb-4 flex items-start gap-4">
          <div className="relative">
            <img
              src={group.avatar}
              alt={group.name}
              className="h-16 w-16 rounded-lg border-2 border-amber-500/30 object-cover"
            />
            <div className="absolute -right-1 -bottom-1 rounded bg-amber-500 p-1">
              <Icon className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-amber-50">{group.name}</h3>
            <div className="flex flex-wrap gap-2">
              {group.achievements.map((achievement, idx) => (
                <span
                  key={idx}
                  className="rounded border border-amber-400/30 bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 描述 */}
        <p className="mb-4 line-clamp-2 text-sm text-amber-200/70">{group.description}</p>

        {/* 专长 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {group.specialties.map((specialty, idx) => (
              <span
                key={idx}
                className="rounded border border-amber-500/30 bg-linear-to-r from-amber-600/20 to-orange-600/20 px-2 py-1 text-xs text-amber-300"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mb-4 grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-amber-300">{group.stats.members}</div>
            <div className="text-xs text-amber-400/60">成员</div>
          </div>
          <div className="text-center">
            <div className="text-amber-300">{group.stats.releases}</div>
            <div className="text-xs text-amber-400/60">发布</div>
          </div>
          <div className="text-center">
            <div className="text-amber-300">{group.stats.quality}%</div>
            <div className="text-xs text-amber-400/60">质量</div>
          </div>
          <div className="text-center">
            <div className="text-amber-300">{group.stats.founded.slice(0, 4)}</div>
            <div className="text-xs text-amber-400/60">成立</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button className="flex-1 rounded bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm text-white transition-all hover:from-amber-600 hover:to-orange-600">
            查看详情
          </button>
          {group.recruiting && (
            <button className="rounded border border-green-500/30 bg-linear-to-r from-green-600/20 to-emerald-600/20 px-4 py-2 text-sm text-green-300 transition-all hover:border-green-400">
              申请加入
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
