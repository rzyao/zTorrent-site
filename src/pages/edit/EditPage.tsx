import { useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { Film, List } from 'lucide-react';
import { EditMoviePage } from './EditMoviePage';
import { EditPlaylistPage } from './EditPlaylistPage';

export function EditPage() {
  useDynamicTitle('编辑');
  const [activeTab, setActiveTab] = useState<'movie' | 'playlist'>('movie');

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="flex">
        {/* 左侧二级导航 */}
        <div className="w-64 border-r border-neutral-700/50 bg-neutral-900/30 backdrop-blur-sm min-h-screen">
          <div className="p-4 space-y-2 sticky top-16">
            <button
              onClick={() => setActiveTab('movie')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'movie'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
            >
              <Film className="w-5 h-5" />
              <span>影片编辑</span>
            </button>
            <button
              onClick={() => setActiveTab('playlist')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'playlist'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
            >
              <List className="w-5 h-5" />
              <span>片单编辑</span>
            </button>
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1">
          {activeTab === 'movie' && <EditMoviePage />}
          {activeTab === 'playlist' && <EditPlaylistPage />}
        </div>
      </div>
    </div>
  );
}
