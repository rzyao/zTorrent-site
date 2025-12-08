import { useMemo, useState } from 'react';
import { FilterLanguage, SortBy, Subtitle } from '../types';

export function useSubtitles(subtitles: Subtitle[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [filterLanguage, setFilterLanguage] = useState<FilterLanguage>('all');
  const [selectedSubtitle, setSelectedSubtitle] = useState<Subtitle | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredSortedSubtitles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = subtitles.filter((s) => {
      const matchQuery = q
        ? (
            s.name.toLowerCase().includes(q) ||
            s.torrentName.toLowerCase().includes(q) ||
            s.uploader.toLowerCase().includes(q)
          )
        : true;
      const matchLang = filterLanguage === 'all' ? true : s.languageCode === filterLanguage;
      return matchQuery && matchLang;
    });

    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'uploads') return b.uploads - a.uploads;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latest') {
        const da = new Date(a.uploadDate).getTime();
        const db = new Date(b.uploadDate).getTime();
        return db - da;
      }
      return 0;
    });

    return sorted;
  }, [subtitles, searchQuery, filterLanguage, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterLanguage,
    setFilterLanguage,
    selectedSubtitle,
    setSelectedSubtitle,
    showUploadModal,
    setShowUploadModal,
    filteredSortedSubtitles,
  };
}
