import { useMemo, useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../constants';
import { Announcement, AnnouncementType } from '../types';

export function useAnnouncements(initialFilter: AnnouncementType | 'all' = 'all') {
  const [filter, setFilter] = useState<AnnouncementType | 'all'>(initialFilter);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filtered = useMemo(
    () => MOCK_ANNOUNCEMENTS.filter((a) => filter === 'all' || a.type === filter),
    [filter]
  );

  const pinned = useMemo(() => filtered.filter((a) => a.isPinned), [filtered]);
  const normal = useMemo(() => filtered.filter((a) => !a.isPinned), [filtered]);

  const select = (a: Announcement | null) => setSelectedAnnouncement(a);

  return {
    filter,
    setFilter,
    selectedAnnouncement,
    select,
    filteredAnnouncements: filtered,
    pinnedAnnouncements: pinned,
    normalAnnouncements: normal,
  };
}

