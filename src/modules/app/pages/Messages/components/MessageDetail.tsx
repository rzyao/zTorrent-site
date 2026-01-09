import { X, Star, Trash2, Check } from 'lucide-react';
import { Button } from '@/modules/app/components/ui/button';
import type { MessageType, Message } from '../types/types';

/**
 * 消息详情组件
 * - 根据 `activeTab` 决定展示的操作集合（系统通知与私信有所不同）
 */
export function MessageDetail({
  message,
  activeTab,
  onClose,
  onMarkMessageRead,
  onFavoriteMessage,
  onUnfavoriteMessage,
  onDeleteMessage,
  onMarkNotificationRead,
  onDeleteNotification,
}: {
  message: Message;
  activeTab: MessageType;
  onClose: () => void;
  onMarkMessageRead: (id: string) => void;
  onFavoriteMessage: (id: string) => void;
  onUnfavoriteMessage: (id: string) => void;
  onDeleteMessage: (id: string) => Promise<void> | void;
  onMarkNotificationRead: (ids: string[]) => void;
  onDeleteNotification: (id: string) => void;
}) {
  const isSystem = message.type === 'system' || activeTab === 'system';

  return (
    <div className="p-6">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between border-b border-neutral-700/50 pb-4 mb-4">
        <div>
          <h2 className="text-white text-xl">{message.subject}</h2>
          <p className="text-neutral-400 text-sm mt-1">
            来自：{message.from} • {message.timestamp}
          </p>
        </div>
        <Button variant="ghost" className="text-neutral-300 hover:text-white" onClick={onClose}>
          <X className="w-4 h-4 mr-2" /> 关闭
        </Button>
      </div>

      {/* 正文 */}
      <div className="prose prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-neutral-200">{message.content}</p>
      </div>

      {/* 操作区 */}
      <div className="mt-6 flex items-center gap-2">
        {isSystem ? (
          <>
            <Button
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-700/30"
              onClick={() => onMarkNotificationRead([message.id])}
            >
              <Check className="w-4 h-4 mr-2" /> 标记已读
            </Button>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-white hover:bg-red-600/30"
              onClick={() => onDeleteNotification(message.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> 删除通知
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-700/30"
              onClick={() => onMarkMessageRead(message.id)}
            >
              <Check className="w-4 h-4 mr-2" /> 标记已读
            </Button>
            {!message.starred ? (
              <Button
                variant="ghost"
                className="text-amber-400 hover:text-white hover:bg-amber-600/30"
                onClick={() => onFavoriteMessage(message.id)}
              >
                <Star className="w-4 h-4 mr-2" /> 收藏
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-neutral-300 hover:text-white hover:bg-neutral-700/30"
                onClick={() => onUnfavoriteMessage(message.id)}
              >
                <Star className="w-4 h-4 mr-2" /> 取消收藏
              </Button>
            )}
            <Button
              variant="ghost"
              className="text-red-400 hover:text-white hover:bg-red-600/30"
              onClick={() => onDeleteMessage(message.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> 删除消息
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

