import { subtitles as mockSubtitles } from './constants';
import { useSubtitles } from './hooks/useSubtitles';
import { Subtitle } from './types';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { Toolbar } from './components/Toolbar';
import { SubtitlesTable } from './components/SubtitlesTable';
import { SubtitleDetailModal } from './components/SubtitleDetailModal';
import { UploadSubtitleModal } from './components/UploadSubtitleModal';
import { FileText } from 'lucide-react';

export function SubtitlesPage() {
  const {
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
  } = useSubtitles(mockSubtitles as Subtitle[]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <Header onUploadClick={() => setShowUploadModal(true)} />
        <StatsCards subtitles={mockSubtitles as Subtitle[]} />
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterLanguage={filterLanguage}
          onFilterLanguageChange={setFilterLanguage}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
        <SubtitlesTable subtitles={filteredSortedSubtitles} onSelectSubtitle={(s) => setSelectedSubtitle(s)} />
        {filteredSortedSubtitles.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">暂无字幕</p>
          </div>
        )}
      </div>

      {selectedSubtitle && (
        <SubtitleDetailModal subtitle={selectedSubtitle} onClose={() => setSelectedSubtitle(null)} />
      )}
      {showUploadModal && (
        <UploadSubtitleModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}
