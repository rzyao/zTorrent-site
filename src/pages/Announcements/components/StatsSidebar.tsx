import { Announcement } from '../types';

interface StatsSidebarProps {
  announcements: Announcement[];
}

export function StatsSidebar({ announcements }: StatsSidebarProps) {
  const total = announcements.length;
  const unread = announcements.filter((a) => !a.isRead).length;
  const pinned = announcements.filter((a) => a.isPinned).length;

  return (
    <div className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6 sticky top-20">
      <h3 className="text-amber-50 mb-4">公告统计</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-[#0F171E]/30 rounded-lg">
          <span className="text-amber-300">总公告数</span>
          <span className="text-amber-50">{total}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-[#0F171E]/30 rounded-lg">
          <span className="text-amber-300">未读公告</span>
          <span className="text-red-400">{unread}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-[#0F171E]/30 rounded-lg">
          <span className="text-amber-300">置顶公告</span>
          <span className="text-amber-400">{pinned}</span>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20 rounded-lg">
        <p className="text-amber-300 text-sm text-center">点击左侧公告查看详细内容</p>
      </div>
    </div>
  );
}
