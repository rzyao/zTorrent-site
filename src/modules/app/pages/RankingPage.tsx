import { Header } from '../layouts/Header';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { useLanguage } from '@/hooks/useLanguage';

export default function RankingPage() {
  const { t } = useLanguage();
  useDynamicTitle(t('ranking.title'));
  return (
    <div className="min-h-screen bg-[#0F171E]">
      <Header />
      <div className="pt-20 px-4 md:px-8">
        <h1 className="text-white text-2xl">{t('ranking.title')}</h1>
      </div>
    </div>
  );
}
