import { Bell } from 'lucide-react';
import { Announcement } from './types';
import { AnnouncementsPageProps } from './types';
import { useAnnouncements } from './hooks/useAnnouncements';
import { FilterBar } from './components/FilterBar';
import { AnnouncementCard } from './components/AnnouncementCard';
import { AnnouncementDetail } from './components/AnnouncementDetail';
import { StatsSidebar } from './components/StatsSidebar';

export function AnnouncementsPage({ onAnnouncementClick }: AnnouncementsPageProps) {
  const {
    filter,
    setFilter,
    selectedAnnouncement,
    select,
    filteredAnnouncements,
    pinnedAnnouncements,
    normalAnnouncements,
  } = useAnnouncements('all');

  const handleCardClick = (a: Announcement) => {
    select(a);
    onAnnouncementClick?.(a.id);
  };

  return (
    <div className="min-h-screen bg-[#0F171E] pt-16">
      <div className="bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-amber-700/20 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-amber-400" />
            <h1 className="text-amber-50">站点公告</h1>
          </div>
          <p className="text-amber-200/70">及时了解站点最新动态、活动和规则变更</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <FilterBar value={filter} onChange={setFilter} />

            {pinnedAnnouncements.length > 0 && (
              <div className="space-y-3">
                {pinnedAnnouncements.map((a) => (
                  <AnnouncementCard key={a.id} data={a} variant="pinned" onClick={handleCardClick} />
                ))}
              </div>
            )}

            <div className="space-y-3">
              {normalAnnouncements.map((a) => (
                <AnnouncementCard key={a.id} data={a} variant="normal" onClick={handleCardClick} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedAnnouncement ? (
              <AnnouncementDetail data={selectedAnnouncement} onClose={() => select(null)} />
            ) : (
              <StatsSidebar announcements={filteredAnnouncements} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

