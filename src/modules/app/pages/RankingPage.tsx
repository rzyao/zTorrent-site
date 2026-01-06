import { Header } from '../layouts/Header';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';

export default function RankingPage() {
  useDynamicTitle('排行榜');
  return (
    <div className="min-h-screen bg-[#0F171E]">
      <Header />
      <div className="pt-20 px-4 md:px-8">
        <h1 className="text-white text-2xl">排行榜</h1>
      </div>
    </div>
  );
}
