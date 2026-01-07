// @ts-nocheck
import { IForumCategory } from "../../types";
import { CATEGORY_ICONS } from "../../constants";
// @ts-ignore
import * as Icons from "lucide-react";

interface BoardRowProps {
  category: IForumCategory;
  onClick: () => void;
}

export function BoardRow({ category, onClick }: BoardRowProps) {
  // 动态获取图�?
  const iconName = CATEGORY_ICONS[category.id] || "MessageSquare";
  // @ts-ignore
  const Icon = Icons[iconName] || Icons.MessageSquare;

  // 格式化时�?- 简单处理，后续可优�?
  const formatTime = (timeStr?: string | null) => {
    if (!timeStr) return "-";
    try {
      const d = new Date(timeStr);
      // 如果是今�?
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString([], { month: "numeric", day: "numeric" });
    } catch {
      return "-";
    }
  };

  return (
    <div
      className="group flex cursor-pointer items-center justify-between border-b border-white/5 bg-neutral-900/40 p-4 transition-colors hover:bg-neutral-800/60"
      onClick={onClick}
    >
      <div className="flex flex-1 items-center gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-amber-500 transition-transform group-hover:scale-105 group-hover:bg-neutral-700 group-hover:text-amber-400">
          <Icon size={24} />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-medium text-neutral-100 transition-colors group-hover:text-amber-400">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-0.5 truncate text-sm text-neutral-500">{category.description}</p>
          )}
        </div>
      </div>

      {/* Stats - Hide on mobile */}
      <div className="hidden w-32 flex-col items-end justify-center px-4 text-sm text-neutral-400 md:flex">
        <div className="flex gap-2">
          <span>{category.threadsCount ?? 0}</span>
          <span className="text-neutral-600">主题</span>
        </div>
        {/* 假设�?postsCount 也可以显�?*/}
        {/* <div className="flex gap-2 text-xs">
           <span>{category.postsCount ?? 0}</span>
           <span className="text-neutral-600">帖数</span> 
        </div> */}
      </div>

      {/* Last Post - Hide on small mobile */}
      <div className="hidden w-64 items-center justify-end border-l border-white/5 pl-4 sm:flex">
        {category.lastPostAt ? (
          <div className="flex flex-col items-end overflow-hidden text-right">
            {/* 暂时无法获取 title �?author，仅显示时间和提�?*/}
            <span className="max-w-[200px] truncate text-sm text-neutral-300">
              {/* 这里如果�?lastThreadTitle 则显示，否则显示 "最新回�? */}
              最新动�?
            </span>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
              {/* <span>User</span> */}
              <span>{formatTime(category.lastPostAt)}</span>
            </div>
          </div>
        ) : (
          <span className="text-sm text-neutral-600">暂无动�?/span>
        )}
      </div>
    </div>
  );
}

