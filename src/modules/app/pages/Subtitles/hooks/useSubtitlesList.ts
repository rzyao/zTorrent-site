import { useMemo } from 'react';
import type { FilterLanguage, SortBy, Subtitle } from '../types';

export function useSubtitlesList(
  subtitles: Subtitle[],
  searchQuery: string,
  filterLanguage: FilterLanguage,
  sortBy: SortBy,
) {
  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = subtitles.filter((s) => {
      const matchLang = filterLanguage === 'all' ? true : s.languageCode === filterLanguage;
      const matchQuery = q
        ? [s.name, s.torrentName, s.uploader].some((f) => f.toLowerCase().includes(q))
        : true;
      return matchLang && matchQuery;
    });

    list = list.slice().sort((a, b) => {
      switch (sortBy) {
        case 'latest': {
          // 字符串日期格式：yyyy-MM-dd HH:mm，直接比较可读性不高；此处简单转 Date 比较
          const da = new Date(a.uploadDate.replace(/-/g, '/'));
          const db = new Date(b.uploadDate.replace(/-/g, '/'));
          return db.getTime() - da.getTime();
        }
        case 'downloads':
          return b.downloads - a.downloads;
        case 'uploads':
          return b.uploads - a.uploads;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return list;
  }, [subtitles, searchQuery, filterLanguage, sortBy]);
}

