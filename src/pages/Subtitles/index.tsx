import { useState } from 'react';
import type { Subtitle, SortBy, FilterLanguage, UploadForm, TorrentOption } from './types';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { Toolbar } from './components/Toolbar';
import { SubtitlesList } from './components/SubtitlesList';
import { SubtitleDetailModal } from './components/SubtitleDetailModal';
import { UploadSubtitleModal } from './components/UploadSubtitleModal';
import { useSubtitlesList } from './hooks/useSubtitlesList';



export function SubtitlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [filterLanguage, setFilterLanguage] = useState<FilterLanguage>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<Subtitle | null>(null);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    name: '',
    type: 'SRT',
    language: 'zh',
    torrentId: '',
    description: '',
    file: null,
  });

  // 字幕列表数据
  const subtitles: Subtitle[] = [
    {
      id: '1',
      name: 'Interstellar.2014.1080p.BluRay.x264.CHT&ENG',
      type: 'SRT',
      language: '简体中文',
      languageCode: 'zh',
      torrentName: '星际穿越 Interstellar (2014) 4K HDR REMUX',
      torrentId: 'T001',
      uploader: 'SubMaster',
      uploadDate: '2024-12-08 14:32',
      downloads: 15820,
      uploads: 342,
      rating: 4.9,
      reviews: 234,
      verified: true,
      description: '官方简繁英三语字幕，时间轴完美匹配BluRay版本，已校对无错字',
    },
    {
      id: '2',
      name: 'Inception.2010.4K.BluRay.简繁英三语',
      type: 'ASS',
      language: '简体中文',
      languageCode: 'zh',
      torrentName: '盗梦空间 Inception (2010) 4K UHD BluRay',
      torrentId: 'T002',
      uploader: 'CinemaSub',
      uploadDate: '2024-12-07 18:20',
      downloads: 12450,
      uploads: 268,
      rating: 4.8,
      reviews: 189,
      verified: true,
      description: '特效字幕，带时间线和特殊样式，适配4K版本',
    },
    {
      id: '3',
      name: 'The.Matrix.1999.1080p.BluRay.English',
      type: 'SRT',
      language: 'English',
      languageCode: 'en',
      torrentName: 'The Matrix (1999) 1080p BluRay',
      torrentId: 'T003',
      uploader: 'MatrixFan',
      uploadDate: '2024-12-06 22:15',
      downloads: 9680,
      uploads: 156,
      rating: 4.7,
      reviews: 145,
      verified: false,
      description: 'Original English subtitles, perfectly synced',
    },
    {
      id: '4',
      name: 'Avatar.The.Way.of.Water.2022.4K.简体中文',
      type: 'SRT',
      language: '简体中文',
      languageCode: 'zh',
      torrentName: '阿凡达：水之道 Avatar: The Way of Water (2022) 4K',
      torrentId: 'T004',
      uploader: 'Avatar3DSub',
      uploadDate: '2024-12-05 16:45',
      downloads: 18920,
      uploads: 445,
      rating: 4.9,
      reviews: 312,
      verified: true,
      description: '官方简体中文字幕，已修正时间轴，完美匹配4K HDR版本',
    },
    {
      id: '5',
      name: 'Blade.Runner.2049.2017.简繁双语',
      type: 'ASS',
      language: '简繁中文',
      languageCode: 'zh',
      torrentName: '银翼杀手2049 Blade Runner 2049 (2017) 1080p',
      torrentId: 'T005',
      uploader: 'BladeRunner',
      uploadDate: '2024-12-04 12:30',
      downloads: 7234,
      uploads: 198,
      rating: 4.6,
      reviews: 98,
      verified: true,
      description: '简繁双语字幕，带特效样式，适合高清收藏',
    },
    {
      id: '6',
      name: 'Dune.2021.2160p.WEB-DL.English.SDH',
      type: 'SRT',
      language: 'English',
      languageCode: 'en',
      torrentName: 'Dune (2021) 4K WEB-DL',
      torrentId: 'T006',
      uploader: 'DuneFan',
      uploadDate: '2024-12-03 09:18',
      downloads: 11560,
      uploads: 287,
      rating: 4.8,
      reviews: 203,
      verified: true,
      description: 'English SDH subtitles for hearing impaired, WEB-DL version',
    },
    {
      id: '7',
      name: 'Oppenheimer.2023.IMAX.简体中文',
      type: 'SRT',
      language: '简体中文',
      languageCode: 'zh',
      torrentName: '奥本海默 Oppenheimer (2023) 4K IMAX',
      torrentId: 'T007',
      uploader: 'IMAXSub',
      uploadDate: '2024-12-02 20:45',
      downloads: 16780,
      uploads: 398,
      rating: 4.9,
      reviews: 267,
      verified: true,
      description: 'IMAX版本专用字幕，精校版无错字',
    },
    {
      id: '8',
      name: 'The.Godfather.1972.简体中文.精校版',
      type: 'SRT',
      language: '简体中文',
      languageCode: 'zh',
      torrentName: '教父 The Godfather (1972) 4K Restored',
      torrentId: 'T008',
      uploader: 'ClassicFilm',
      uploadDate: '2024-12-01 15:22',
      downloads: 8950,
      uploads: 213,
      rating: 4.8,
      reviews: 156,
      verified: true,
      description: '修复版字幕，根据4K修复版重新校对',
    },
  ];

  // 模拟种子列表（用于关联）
  const availableTorrents: TorrentOption[] = [
    { id: 'T001', name: '星际穿越 Interstellar (2014) 4K HDR REMUX' },
    { id: 'T002', name: '盗梦空间 Inception (2010) 4K UHD BluRay' },
    { id: 'T003', name: 'The Matrix (1999) 1080p BluRay' },
    { id: 'T004', name: '阿凡达：水之道 Avatar: The Way of Water (2022) 4K' },
    { id: 'T005', name: '银翼杀手2049 Blade Runner 2049 (2017) 1080p' },
    { id: 'T006', name: 'Dune (2021) 4K WEB-DL' },
  ];

  const visibleSubtitles = useSubtitlesList(subtitles, searchQuery, filterLanguage, sortBy);

  const handleUploadSubmit = () => {
    console.log('Upload subtitle:', uploadForm);
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <Header onClickUpload={() => setShowUploadModal(true)} />

        <StatsCards subtitles={subtitles} />

        <Toolbar
          searchQuery={searchQuery}
          filterLanguage={filterLanguage}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterLanguage}
          onSortChange={setSortBy}
        />

        <SubtitlesList subtitles={visibleSubtitles} onSelect={setSelectedSubtitle} />
      </div>

      <SubtitleDetailModal open={!!selectedSubtitle} subtitle={selectedSubtitle} onClose={() => setSelectedSubtitle(null)} />

      <UploadSubtitleModal
        open={showUploadModal}
        uploadForm={uploadForm}
        availableTorrents={availableTorrents}
        onFileChange={handleFileChange}
        onFormPatch={patchUploadForm}
        onSubmit={handleUploadSubmit}
        onCancel={() => setShowUploadModal(false)}
      />
    </div>
  );
}
