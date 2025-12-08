import { Bell, Inbox, Send, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MessageType } from '../types/types';

/**
 * 标签栏组件
 * - 仅负责展示与切换，不持有业务状态
 */
export function TabBar({
  activeTab,
  unreadCount,
  onChange,
}: {
  activeTab: MessageType;
  unreadCount: { system: number; inbox: number };
  onChange: (tab: MessageType) => void;
}) {
  const itemCls = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      active ? 'bg-neutral-700/60 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-700/40'
    }`;

  return (
    <div className="flex items-center gap-2">
      {/* 系统通知 */}
      <Button variant="ghost" className={itemCls(activeTab === 'system')} onClick={() => onChange('system')}>
        <Bell className="w-4 h-4" /> 系统通知
        {unreadCount.system > 0 && <span className="ml-1 text-xs bg-red-500 text-white rounded px-1">{unreadCount.system}</span>}
      </Button>
      {/* 收件箱 */}
      <Button variant="ghost" className={itemCls(activeTab === 'inbox')} onClick={() => onChange('inbox')}>
        <Inbox className="w-4 h-4" /> 收件箱
        {unreadCount.inbox > 0 && <span className="ml-1 text-xs bg-red-500 text-white rounded px-1">{unreadCount.inbox}</span>}
      </Button>
      {/* 已发送 */}
      <Button variant="ghost" className={itemCls(activeTab === 'sent')} onClick={() => onChange('sent')}>
        <Send className="w-4 h-4" /> 已发送
      </Button>
      {/* 收藏 */}
      <Button variant="ghost" className={itemCls(activeTab === 'favorites')} onClick={() => onChange('favorites')}>
        <Star className="w-4 h-4" /> 收藏
      </Button>
      {/* 会话 */}
      <Button variant="ghost" className={itemCls(activeTab === 'threads')} onClick={() => onChange('threads')}>
        <User className="w-4 h-4" /> 会话
      </Button>
    </div>
  );
}
