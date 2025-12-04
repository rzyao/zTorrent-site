import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, Smartphone, Bell, Monitor, Key } from 'lucide-react';
import type { SecurityData } from '../../types';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white text-xl">安全设置</h2>
          <p className="text-neutral-400 text-sm">保护您的账户安全</p>
        </div>
      </div>

      {/* 修改密码 */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-white text-sm mb-1">修改密码</h3>
            <p className="text-neutral-400 text-xs mb-3">定期更改密码可以提高账户安全性</p>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="当前密码"
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {passwordErrors.current && (<p className="text-xs text-red-400">{passwordErrors.current}</p>)}
              <input
                type="password"
                placeholder="新密码"
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {passwordErrors.new && (<p className="text-xs text-red-400">{passwordErrors.new}</p>)}
              <input
                type="password"
                placeholder="确认新密码"
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              {passwordErrors.confirm && (<p className="text-xs text-red-400">{passwordErrors.confirm}</p>)}
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white" onClick={handleUpdatePassword} disabled={!canUpdatePassword()}>更新密码</Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 双因素认证 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1"><Smartphone className="w-4 h-4" /> 双因素认证（2FA）</div>
          <p className="text-neutral-500 text-xs">为您的账户添加额外的安全层</p>
        </div>
        <Switch checked={security.twoFactorEnabled} onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })} />
      </div>

      {/* 登录通知 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1"><Bell className="w-4 h-4" /> 登录通知</div>
          <p className="text-neutral-500 text-xs">新设备登录时发送邮件通知</p>
        </div>
        <Switch checked={security.loginNotifications} onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })} />
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 受信任设备 */}
      <div className="space-y-3">
        <label className="text-neutral-300 text-sm">受信任的设备</label>
        <div className="space-y-2">
          {[
            { name: 'Chrome on Windows', date: '最后活动：2小时前', active: true },
            { name: 'Safari on iPhone', date: '最后活动：1天前', active: false },
            { name: 'Firefox on macOS', date: '最后活动：3天前', active: false },
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
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">当前设备</span>
                ) : (
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7">移除</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* Passkey */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-neutral-800/50 to-stone-900/50 border border-neutral-700/50">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-white text-sm mb-1">重置 Passkey</h3>
            <p className="text-neutral-400 text-xs mb-3">使用生物识别或设备PIN快速登录</p>
            <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">重置 Passkey</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

