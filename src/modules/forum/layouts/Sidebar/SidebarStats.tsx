import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForumTheme } from "../../context/ForumThemeContext";

/**
 * 社区统计组件
 * 显示用户总数、活跃度等统计信息
 */
export function SidebarStats() {
  const { t } = useTranslation();
  const { theme, colors } = useForumTheme();

  return (
    <div className="py-4 pr-4 pl-8">
      <div className="mb-3 flex items-center gap-2">
        <Users className={`h-4 w-4 text-blue-600 dark:text-amber-500`} />
        <h3 className={`text-xs font-semibold tracking-wider uppercase ${colors.textMuted}`}>
          {t('forum.sidebar.communityStats')}
        </h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className={colors.textSecondary}>{t('forum.sidebar.totalUsers')}</span>
          <span className={` ${colors.textPrimary}`}>128,456</span>
        </div>
        <div className="flex justify-between">
          <span className={colors.textSecondary}>{t('forum.sidebar.todayActive')}</span>
          <span className={` ${colors.textPrimary}`}>12,345</span>
        </div>
        <div className="flex justify-between">
          <span className={colors.textSecondary}>{t('forum.sidebar.totalPosts')}</span>
          <span className={` ${colors.textPrimary}`}>456,789</span>
        </div>
      </div>
    </div>
  );
}
