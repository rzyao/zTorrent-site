import { TopicData } from "../types";
import { getIconByName } from "@/components/ui/icon-picker";
import { Square } from "lucide-react";

interface TopicHeaderProps {
  theme: string;
  colors: any;
  topicData?: TopicData;
}

export const TopicHeader = ({ theme, colors, topicData }: TopicHeaderProps) => {
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
      <h1 className={`mb-3 text-[24px] leading-tight font-bold ${colors.titleColor}`}>
        {topicData.title}
      </h1>
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
          <span className={`text-sm transition-colors ${colors.textSecondary}`}>
            {topicData.category}
          </span>
        </a>
        {topicData.tags.map((tag) => (
          <a
            href="#"
            key={tag}
            className={`ml-1 text-sm transition-colors ${colors.textMuted} ${colors.accentHover}`}
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
};
