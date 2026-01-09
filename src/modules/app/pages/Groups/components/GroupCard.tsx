/**
 * 普通制作组卡片组件（小卡片样式）。
 * 保持与原 UI 一致，纯展示组件，通过 props 传入数据。
 */
import React from "react";
import { Crown } from "lucide-react";
import type { Group } from "../types";
import { getIconComponent, getLevelBadge, getLevelColor } from "../utils";

interface GroupCardProps {
  group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const Icon = getIconComponent(group.icon);

  return (
    <div className="overflow-hidden rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/5 to-orange-600/5 transition-all hover:border-amber-400/40">
      {/* Banner */}
      <div className="relative h-24">
        <img src={group.banner} alt={group.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0F171E] to-transparent" />

        {group.recruiting && (
          <div className="absolute top-2 right-2 rounded bg-green-500 px-2 py-1 text-xs text-white">
            招募中
          </div>
        )}
      </div>

      <div className="p-4">
        {/* 头像和标题 */}
        <div className="mb-3 flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              src={group.avatar}
              alt={group.name}
              className="h-12 w-12 rounded border border-amber-500/30 object-cover"
            />
            <div className="absolute -right-1 -bottom-1 rounded-sm bg-amber-500 p-1">
              <Icon className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate text-sm text-amber-50">{group.name}</h3>
            <div
              className={`inline-flex items-center gap-1 bg-linear-to-r px-2 py-0.5 ${getLevelColor(group.level)} rounded-full`}
            >
              <Crown className="h-2.5 w-2.5 text-gray-900" />
              <span className="text-xs text-gray-900">{getLevelBadge(group.level)}</span>
            </div>
          </div>
        </div>

        {/* 描述 */}
        <p className="mb-3 line-clamp-2 text-xs text-amber-200/70">{group.description}</p>

        {/* 统计 */}
        <div className="mb-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm text-amber-300">{group.stats.members}</div>
            <div className="text-xs text-amber-400/60">成员</div>
          </div>
          <div>
            <div className="text-sm text-amber-300">{group.stats.releases}</div>
            <div className="text-xs text-amber-400/60">发布</div>
          </div>
          <div>
            <div className="text-sm text-amber-300">{group.stats.quality}%</div>
            <div className="text-xs text-amber-400/60">质量</div>
          </div>
        </div>

        {/* 按钮 */}
        <button className="w-full rounded border border-amber-500/30 bg-linear-to-r from-amber-600/20 to-orange-600/20 px-3 py-1.5 text-xs text-amber-300 transition-all hover:border-amber-400">
          查看详情
        </button>
      </div>
    </div>
  );
};
