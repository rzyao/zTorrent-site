import { TopicData } from "../types";
import { getIconByName } from "@/modules/forum/components/ui/icon-picker";
import { Square } from "lucide-react";
import { Button } from "@/modules/forum/components/ui/button";

import { useForumTheme } from "../../../context/ForumThemeContext";

interface TopicHeaderProps {
  topicData?: TopicData;
  canEdit?: boolean;
  onEdit?: () => void;
}

export const TopicHeader = ({ topicData, canEdit, onEdit }: TopicHeaderProps) => {
  const { colors } = useForumTheme();
  // 如果没有传入 topicData，显示占位符
  if (!topicData) {
    return (
      <div className="pb-0">
        <div className="mb-3 h-8 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      </div>
    );
  }

  // 获取类别图标组件
  const CategoryIcon = topicData.categoryIcon ? getIconByName(topicData.categoryIcon) : null;

  return (
    <div className="pb-2">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className={`text-[24px] leading-tight font-bold ${colors.titleColor}`}>
            {topicData.title}
          </h1>
          {topicData.bounty && (
            <>
              {topicData.bounty.status === "open" && (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  悬赏 {topicData.bounty.amount}
                </span>
              )}
              {topicData.bounty.status === "awarded" && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  已采纳
                </span>
              )}
              {topicData.bounty.status === "expired" && (
                <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  已到期
                </span>
              )}
              {topicData.bounty.status === "canceled" && (
                <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  已取消
                </span>
              )}
            </>
          )}
        </div>
        {canEdit && (
          <Button variant="default" size="sm" onClick={onEdit}>
            编辑话题
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <a href="#" className="group flex items-center gap-1.5">
          {/* 类别图标或颜色方块 */}
          {CategoryIcon ? (
            <CategoryIcon className="h-3.5 w-3.5" style={{ color: topicData.categoryColor }} />
          ) : topicData.categoryColor ? (
            <span
              className="h-3 w-3 rounded-[2px]"
              style={{ backgroundColor: topicData.categoryColor }}
            />
          ) : (
            <Square className="h-3 w-3 opacity-50" />
          )}
          <span className={`text-sm ${colors.textSecondary}`}>{topicData.category}</span>
        </a>
        {topicData.tags.map((tag) => (
          <a
            href="#"
            key={tag}
            className={`ml-1 text-sm ${colors.textMuted} ${colors.accentHover}`}
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
};
