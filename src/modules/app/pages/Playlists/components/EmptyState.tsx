import { List, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  activeTab: 'all' | 'mine' | 'following';
  onCreate?: () => void;
}

export function EmptyState({ activeTab, onCreate }: Props) {
  const { t } = useLanguage();
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
        <List className="w-10 h-10 text-neutral-600" />
      </div>
      <h3 className="text-white text-xl mb-2">{t('playlists.empty')}</h3>
      <p className="text-neutral-500 mb-6">
        {activeTab === 'mine' ? t('playlists.emptyCreate') : t('playlists.emptyNoResults')}
      </p>
      {activeTab === 'mine' && (
        <button onClick={onCreate} className="px-8 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>{t('playlists.createPlaylist')}</span>
        </button>
      )}
    </div>
  );
}

