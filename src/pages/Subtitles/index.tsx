import { useEffect, useState } from 'react';
import type { Subtitle, SortBy, FilterLanguage, UploadForm } from './types';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { Toolbar } from './components/Toolbar';
import { SubtitlesList } from './components/SubtitlesList';
import { SubtitleDetailModal } from './components/SubtitleDetailModal';
import { UploadSubtitleModal } from './components/UploadSubtitleModal';
import { useSubtitlesRemote } from './hooks/useSubtitlesRemote';



export default function SubtitlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [filterLanguage, setFilterLanguage] = useState<FilterLanguage>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    name: '',
    type: 'SRT',
    language: 'zh',
    torrentId: '',
    description: '',
    file: null,
  });
  const {
    items,
    stats,
    torrentOptions,
    upload,
    detail,
    detailLoading,
    fetchDetail,
    like,
    report,
    download,
  } = useSubtitlesRemote({ searchQuery, filterLanguage, sortBy });

  const handleUploadSubmit = async () => {
    await upload(uploadForm);
    setShowUploadModal(false);
    setUploadForm({ name: '', type: 'SRT', language: 'zh', torrentId: '', description: '', file: null });
  };

  const handleFileChange = (file: File | null) => {
    setUploadForm((prev) => ({ ...prev, file }));
  };

  const patchUploadForm = (patch: Partial<UploadForm>) => {
    setUploadForm((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <Header onClickUpload={() => setShowUploadModal(true)} />

        <StatsCards stats={stats} />

        <Toolbar
          searchQuery={searchQuery}
          filterLanguage={filterLanguage}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterLanguage}
          onSortChange={setSortBy}
        />
        <SubtitlesList subtitles={items} onSelect={(s) => setSelectedSubtitleId(s.id)} />
      </div>

      <SubtitleDetailModal
        open={!!selectedSubtitleId}
        subtitle={detail}
        onClose={() => { setSelectedSubtitleId(null); }}
        onDownload={(s) => download(s.id, `${s.name}.${s.type.toLowerCase()}`)}
        onLike={(s) => like(s.id)}
        onReport={(s) => report(s.id)}
      />

      {selectedSubtitleId && (
        <Fetcher id={selectedSubtitleId} onFetch={fetchDetail} />
      )}

      <UploadSubtitleModal
        open={showUploadModal}
        uploadForm={uploadForm}
        availableTorrents={torrentOptions}
        onFileChange={handleFileChange}
        onFormPatch={patchUploadForm}
        onSubmit={handleUploadSubmit}
        onCancel={() => setShowUploadModal(false)}
      />
    </div>
  );
}

function Fetcher({ id, onFetch }: { id: string; onFetch: (id: string) => void }) {
  useEffect(() => { onFetch(id); }, [id, onFetch]);
  return null;
}
