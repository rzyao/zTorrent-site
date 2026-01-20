import { Separator } from '@/modules/app/components/ui/separator';
import { Switch } from '@/modules/app/components/ui/switch';
import { Eye, Mail } from 'lucide-react';
import type { PrivacyData } from '../../types';
import { useLanguage } from '@/hooks/useLanguage';

interface PrivacyTabProps {
  privacy: PrivacyData;
  setPrivacy: (next: PrivacyData) => void;
}

// 隐私设置 Tab
// 职责：公开资料、显示统计、私信、在线状态
export function PrivacyTab({ privacy, setPrivacy }: PrivacyTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Eye className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white text-xl">{t('privacy.title')}</h2>
          <p className="text-neutral-400 text-sm">{t('privacy.subtitle')}</p>
        </div>
      </div>

      {/* 显示个人资料 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="text-neutral-300 text-sm mb-1">{t('privacy.publicProfile')}</div>
          <p className="text-neutral-500 text-xs">{t('privacy.publicProfileDesc')}</p>
        </div>
        <Switch checked={privacy.showProfile} onCheckedChange={(checked) => setPrivacy({ ...privacy, showProfile: checked })} />
      </div>

      {/* 显示统计 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="text-neutral-300 text-sm mb-1">{t('privacy.showStats')}</div>
          <p className="text-neutral-500 text-xs">{t('privacy.showStatsDesc')}</p>
        </div>
        <Switch checked={privacy.showStats} onCheckedChange={(checked) => setPrivacy({ ...privacy, showStats: checked })} />
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 允许私信 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1"><Mail className="w-4 h-4" /> {t('privacy.allowMessages')}</div>
          <p className="text-neutral-500 text-xs">{t('privacy.allowMessagesDesc')}</p>
        </div>
        <Switch checked={privacy.allowMessages} onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })} />
      </div>

      {/* 在线状态 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="text-neutral-300 text-sm mb-1">{t('privacy.showOnlineStatus')}</div>
          <p className="text-neutral-500 text-xs">{t('privacy.showOnlineStatusDesc')}</p>
        </div>
        <Switch checked={privacy.showOnlineStatus} onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnlineStatus: checked })} />
      </div>


    </div>
  );
}
