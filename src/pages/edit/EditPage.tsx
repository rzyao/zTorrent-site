import { useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { Film, List } from 'lucide-react';
import { EditMoviePage } from './EditMoviePage';
import { EditPlaylistPage } from './EditPlaylistPage';

export function EditPage() {
  useDynamicTitle('编辑');
  const [activeTab, setActiveTab] = useState<'movie' | 'playlist'>('movie');

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 pt-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('movie')}
            className={`px-6 py-2.5 rounded-xl transition-all flex items中心 gap-2 ${activeTab === 'movie'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:text-white hover:bg-neutral-700'
              }`}
          >
            <Film className="w-4 h-4" />
            <span>影片编辑</span>
          </button>
          <button
            onClick={() => setActiveTab('playlist')}
            className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'playlist'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:text-white hover:bg-neutral-700'
              }`}
          >
            <List className="w-4 h-4" />
            <span>片单编辑</span>
          </button>
        </div>
      </div>
      <div className="flex-1">
        {activeTab === 'movie' && <EditMoviePage />}
        {activeTab === 'playlist' && <EditPlaylistPage />}
      </div>
    </div>
  );
}
