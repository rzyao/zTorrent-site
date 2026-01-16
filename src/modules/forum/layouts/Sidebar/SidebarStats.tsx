import { Users } from "lucide-react";
import { useForumTheme } from "../../context/ForumThemeContext";

/**
 * 社区统计组件
 * 显示用户总数、活跃度等统计信息
 */
export function SidebarStats() {
  const { theme, colors } = useForumTheme();

  return (
    <div className="py-4 pr-4 pl-8">
      <div className="mb-3 flex items-center gap-2">
        <Users className={`h-4 w-4 text-blue-600 dark:text-amber-500`} />
        <h3 className={`text-xs font-semibold tracking-wider uppercase ${colors.textMuted}`}>
          社区统计
        </h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className={colors.textSecondary}>总用户数</span>
          <span className={` ${colors.textPrimary}`}>128,456</span>
        </div>
        <div className="flex justify-between">
          <span className={colors.textSecondary}>今日活跃</span>
          <span className={` ${colors.textPrimary}`}>12,345</span>
        </div>
        <div className="flex justify-between">
          <span className={colors.textSecondary}>总帖子数</span>
          <span className={` ${colors.textPrimary}`}>456,789</span>
        </div>
      </div>
    </div>
  );
}
