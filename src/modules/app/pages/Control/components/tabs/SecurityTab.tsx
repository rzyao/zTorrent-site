import { Button } from '@/modules/app/components/ui/button';
import { Separator } from '@/modules/app/components/ui/separator';
import { Switch } from '@/modules/app/components/ui/switch';
import { Shield, Lock, Smartphone, Bell, Monitor, Key } from 'lucide-react';
import type { SecurityData } from '../../types';
import { useLanguage } from '@/hooks/useLanguage';

interface SecurityTabProps {
  security: SecurityData;
  setSecurity: (next: SecurityData) => void;
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (v: string) => void;
  passwordErrors: { current?: string; new?: string; confirm?: string };
  canUpdatePassword: () => boolean;
  handleUpdatePassword: () => void;
}

// 安全设置 Tab
// 职责：修改密码、2FA、登录通知、受信任设备、Passkey
export function SecurityTab(props: SecurityTabProps) {
  const {
    security,
    setSecurity,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    passwordErrors,
    canUpdatePassword,
    handleUpdatePassword,
  } = props;

  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white text-xl">{t('security.title')}</h2>
          <p className="text-neutral-400 text-sm">{t('security.subtitle')}</p>
        </div>
      </div>

      {/* 修改密码 */}
      <div className="p-5 rounded-xl bg-linear-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-white text-sm mb-1">{t('security.changePassword')}</h3>
            <p className="text-neutral-400 text-xs mb-3">{t('security.changePasswordDesc')}</p>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePassword();
              }}
            >
              <input
                type="password"
                name="current-password"
                autoComplete="current-password"
                placeholder={t('security.currentPassword')}
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {passwordErrors.current && (<p className="text-xs text-red-400">{passwordErrors.current}</p>)}
              <input
                type="password"
                name="new-password"
                autoComplete="new-password"
                placeholder={t('security.newPassword')}
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {passwordErrors.new && (<p className="text-xs text-red-400">{passwordErrors.new}</p>)}
              <input
                type="password"
                name="confirm-password"
                autoComplete="new-password"
                placeholder={t('security.confirmNewPassword')}
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              {passwordErrors.confirm && (<p className="text-xs text-red-400">{passwordErrors.confirm}</p>)}
              <Button type="submit" size="sm" className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white" disabled={!canUpdatePassword()}>{t('security.updatePassword')}</Button>
            </form>
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 双因素认证 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1"><Smartphone className="w-4 h-4" /> {t('security.twoFactor')}</div>
          <p className="text-neutral-500 text-xs">{t('security.twoFactorDesc')}</p>
        </div>
        <Switch checked={security.twoFactorEnabled} onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })} />
      </div>

      {/* 登录通知 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1"><Bell className="w-4 h-4" /> {t('security.loginNotify')}</div>
          <p className="text-neutral-500 text-xs">{t('security.loginNotifyDesc')}</p>
        </div>
        <Switch checked={security.loginNotifications} onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })} />
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 受信任设备 */}
      <div className="space-y-3">
        <label className="text-neutral-300 text-sm">{t('security.trustedDevices')}</label>
        <div className="space-y-2">
          {[
            { name: 'Chrome on Windows', date: t('security.lastActive', { time: t('time.hoursAgo', { count: 2 }) }), active: true },
            { name: 'Safari on iPhone', date: t('security.lastActive', { time: t('time.daysAgo', { count: 1 }) }), active: false },
            { name: 'Firefox on macOS', date: t('security.lastActive', { time: t('time.daysAgo', { count: 3 }) }), active: false },
          ].map((device, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
              <div className="flex items-center gap-3">
                <Monitor className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-white text-sm">{device.name}</p>
                  <p className="text-neutral-500 text-xs">{device.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {device.active ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">{t('security.currentDevice')}</span>
                ) : (
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7">{t('security.remove')}</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* Passkey */}
      <div className="p-5 rounded-xl bg-linear-to-br from-neutral-800/50 to-stone-900/50 border border-neutral-700/50">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-white text-sm mb-1">{t('security.resetPasskey')}</h3>
            <p className="text-neutral-400 text-xs mb-3">{t('security.resetPasskeyDesc')}</p>
            <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">{t('security.resetPasskey')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

