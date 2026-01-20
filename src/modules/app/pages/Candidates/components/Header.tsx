import { Vote, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function CandidatesHeader({ onCreate }: { onCreate: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Vote className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-3xl">{t('candidates.title')}</h1>
          <p className="text-neutral-400 text-sm mt-1">{t('candidates.subtitle')}</p>
        </div>
      </div>

      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white transition-all shadow-lg shadow-amber-500/30"
      >
        <Plus className="w-4 h-4" />
        {t('candidates.submit')}
      </button>
    </div>
  );
}
