import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Download, AlertCircle } from 'lucide-react';
import type { NotificationsData } from '../../types';

interface NotificationsTabProps {
  notifications: NotificationsData;
  setNotifications: (next: NotificationsData) => void;
}

// 通知设置 Tab
// 职责：邮箱、评论、私信、系统公告、下载完成、分享率警告
export function NotificationsTab({ notifications, setNotifications }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Bell className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white text-xl">通知设置</h2>
          <p className="text-neutral-400 text-sm">选择您想接收的通知类型</p>
        </div>
      </div>

      {/* 邮件通知 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1"><Mail className="w-4 h-4" /> 启用邮件通知</div>
          <p className="text-neutral-500 text-xs">接收重要通知和更新的邮件</p>
        </div>
        <Switch checked={notifications.emailNotifications} onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })} />
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 种子评论 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="text-neutral-300 text-sm mb-1">种子评论</div>
          <p className="text-neutral-500 text-xs">有人评论您的种子时通知您</p>
        </div>
        <Switch checked={notifications.torrentComments} onCheckedChange={(checked) => setNotifications({ ...notifications, torrentComments: checked })} />
      </div>

      {/* 私信 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="text-neutral-300 text-sm mb-1">私人消息</div>
          <p className="text-neutral-500 text-xs">收到新私信时通知您</p>
        </div>
        <Switch checked={notifications.privateMessages} onCheckedChange={(checked) => setNotifications({ ...notifications, privateMessages: checked })} />
      </div>

      {/* 系统公告 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="text-neutral-300 text-sm mb-1">系统公告</div>
          <p className="text-neutral-500 text-xs">接收站点重要公告和更新</p>
        </div>
        <Switch checked={notifications.systemAnnouncements} onCheckedChange={(checked) => setNotifications({ ...notifications, systemAnnouncements: checked })} />
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 下载完成 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1"><Download className="w-4 h-4" /> 下载完成</div>
          <p className="text-neutral-500 text-xs">种子下载完成时通知您</p>
        </div>
        <Switch checked={notifications.downloadComplete} onCheckedChange={(checked) => setNotifications({ ...notifications, downloadComplete: checked })} />
      </div>

      {/* 分享率警告 */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1"><AlertCircle className="w-4 h-4" /> 分享率警告</div>
          <p className="text-neutral-500 text-xs">分享率低于阈值时通知您</p>
        </div>
        <Switch checked={notifications.ratioWarnings} onCheckedChange={(checked) => setNotifications({ ...notifications, ratioWarnings: checked })} />
      </div>
    </div>
  );
}

