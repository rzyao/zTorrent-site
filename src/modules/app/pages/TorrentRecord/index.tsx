import { useState } from 'react';
import { TorrentStatus } from './types';
import { useTorrentRecord } from './hooks/useTorrentRecord';
import { TorrentRecordHeader } from './components/TorrentRecordHeader';
import { TorrentRecordTabs } from './components/TorrentRecordTabs';
import { TorrentRecordFilters } from './components/TorrentRecordFilters';
import { TorrentRecordTable } from './components/TorrentRecordTable';

export default function TorrentRecordPage() {
  const [activeTab, setActiveTab] = useState<TorrentStatus>('seeding');
  const [searchQuery, setSearchQuery] = useState('');

  const { torrents, stats, isLoading, isUpdating } = useTorrentRecord({
    activeTab,
    searchQuery,
  });

  return (
    <div className="min-h-screen bg-[#0F171E] pt-6 pb-12 px-4 md:px-8">
      <div className="max-w-[1920px] mx-auto">
        <TorrentRecordHeader isUpdating={isUpdating} />

        <TorrentRecordTabs
          activeTab={activeTab}
          stats={stats}
          onTabChange={setActiveTab}
        />

        <TorrentRecordFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <TorrentRecordTable
          isLoading={isLoading}
          torrents={torrents}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}
