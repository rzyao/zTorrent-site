// 页面头部组件：展示主标题与说明文案，保持与视觉规范一致
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function Header() {
  const { t } = useLanguage();
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-3xl">{t('deadTorrents.title')}</h1>
          <p className="text-neutral-400 text-sm mt-1">{t('deadTorrents.subtitle')}</p>
        </div>
      </div>
    </div>
  );
}

