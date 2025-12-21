import { useMemo, useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { Mail, Archive, Send, Star, Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessagesService } from '@/api/services/MessagesService';
import { toast } from 'sonner';
import { TabBar } from './components/TabBar';
import { SearchBar } from './components/SearchBar';
import { MessageList } from './components/MessageList';
import { MessageDetail } from './components/MessageDetail';
import { ComposeForm } from './components/ComposeForm';
import { ThreadsView } from './components/ThreadsView';
import { unwrapResponse, extractErrorMessage } from './utils/utils';
import type { Message } from './types/types';
import { useTabState } from './hooks/useTabState';
import { useSearchDebounce } from './hooks/useSearchDebounce';
import { useInboxList } from './hooks/useInboxList';
import { useOutboxList } from './hooks/useOutboxList';
import { useFavoritesList } from './hooks/useFavoritesList';
import { useNotifications } from './hooks/useNotifications';
import { useThreads } from './hooks/useThreads';
import { useCompose } from './hooks/useCompose';
import { useReply } from './hooks/useReply';
import { usePollingUnread } from './hooks/usePollingUnread';

/**
 * MessagesPage 容器组件
 * - 职责：集中管理页面状态与业务逻辑，向子组件下发纯数据与回调函数
 * - 目标：保持原有 UI，不改动路由，对外导出同名组件以确保引用路径稳定
 */
export function MessagesPage() {
  useDynamicTitle('消息');
  const { activeTab, setActiveTab } = useTabState();

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const { searchQuery, setSearchQuery, debouncedQuery } = useSearchDebounce(300);

  const inbox = useInboxList();
  const outbox = useOutboxList();
  const favorites = useFavoritesList();
  const notifications = useNotifications();

  const inboxMessagesUi = inbox.messagesUi;
  const outboxMessagesUi = outbox.messagesUi;
  const favoriteMessagesUi = favorites.messagesUi;



  const threads = useThreads();
  const activeThreadPeerUserId = threads.activePeerUserId;

  const { unreadTotalCount } = usePollingUnread(async () => {
    await threads.loadThreads();
  });

  const threadSummaries = threads.threadSummaries;
  const threadMessages = threads.threadMessages;

  const compose = useCompose();

  const reply = useReply();





  const favoriteMessage = async (id: string) => {
    if (activeTab === 'inbox') return inbox.favorite(id);
    if (activeTab === 'sent') return outbox.favorite(id);
    if (activeTab === 'favorites') return favorites.favorite(id);
  };

  const unfavoriteMessage = async (id: string) => {
    if (activeTab === 'inbox') return inbox.unfavorite(id);
    if (activeTab === 'sent') return outbox.unfavorite(id);
    if (activeTab === 'favorites') return favorites.unfavorite(id);
  };

  const markMessageRead = async (id: string) => {
    if (activeTab === 'inbox') return inbox.markRead(id);
    if (activeTab === 'sent') return outbox.markRead(id);
    if (activeTab === 'favorites') return favorites.markRead(id);
  };



  const systemMessagesUi = notifications.messagesUi;
  const markNotificationsRead = (ids: string[]) => notifications.markRead(ids);
  const deleteNotification = (id: string) => notifications.remove(id);

  /** 当前列表数据选择与过滤 */
  const getCurrentMessages = () => {
    switch (activeTab) {
      case 'system': return systemMessagesUi;
      case 'inbox': return inboxMessagesUi;
      case 'sent': return outboxMessagesUi;
      case 'favorites': return favoriteMessagesUi;
      default: return [];
    }
  };
  const messages = getCurrentMessages();
  const unreadCount = { system: systemMessagesUi.filter(m => !m.read).length, inbox: inboxMessagesUi.filter(m => !m.read).length };
  const filteredMessages = messages.filter(msg => msg.subject.toLowerCase().includes(debouncedQuery.toLowerCase()) || msg.from.toLowerCase().includes(debouncedQuery.toLowerCase()) || msg.content.toLowerCase().includes(debouncedQuery.toLowerCase()));

  /** 渲染 */
  return (
    <div className="min-h-screen bg-[#0F171E] ">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题区域（保持原样式） */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl flex items-center gap-2">消息中心 {unreadTotalCount > 0 && (<Badge className="bg-red-500 text-white">{unreadTotalCount}</Badge>)}</h1>
                <p className="text-neutral-400 text-sm mt-1">管理您的系统通知和私人消息</p>
              </div>
            </div>
            <Button onClick={() => setShowCompose(true)} className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25">
              <Send className="w-4 h-4 mr-2" />发送消息
            </Button>
          </div>
        </div>

        {/* 导航标签栏 */}
        <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700/50">
            <TabBar
              activeTab={activeTab}
              unreadCount={unreadCount}
              onChange={(tab) => { setActiveTab(tab); setSelectedMessage(null); setShowCompose(false); if (tab !== 'threads') threads.setActivePeerUserId(null); }}
            />
            {/* 快捷操作（保留原 UI，具体功能尚未接入） */}
            <div className="flex items-center gap-2">
              {activeTab === 'system' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-700/30"
                  onClick={() => {
                    const unreadIds = notifications.items.filter(n => !n.readAt).map(n => n.id);
                    if (unreadIds.length === 0) toast.info('暂无未读通知'); else markNotificationsRead(unreadIds);
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />全部已读
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-700/30"><Archive className="w-4 h-4 mr-2" />归档</Button>
              <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-700/30"><Star className="w-4 h-4 mr-2" />星标</Button>
              <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-700/30"><Trash2 className="w-4 h-4 mr-2" />回收站</Button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div>
          {showCompose ? (
            <ComposeForm
              recipientId={compose.recipientId}
              subject={compose.subject}
              content={compose.content}
              format={compose.format}
              attachments={compose.attachments}
              onRecipientChange={compose.setRecipientId}
              onSubjectChange={compose.setSubject}
              onContentChange={compose.setContent}
              onFormatChange={(v) => compose.setFormat(v)}
              onUploadImage={(file) => compose.uploadImage(file)}
              onCancel={() => setShowCompose(false)}
              onSend={async () => { await compose.sendMessage(); setShowCompose(false); await outbox.load(); await threads.loadThreads(); }}
            />
          ) : selectedMessage ? (
            <MessageDetail
              message={selectedMessage}
              activeTab={activeTab}
              onClose={() => setSelectedMessage(null)}
              onMarkMessageRead={markMessageRead}
              onFavoriteMessage={favoriteMessage}
              onUnfavoriteMessage={unfavoriteMessage}
              onDeleteMessage={async (id) => {
                try {
                  await MessagesService.messagesControllerDeleteMessage({ id });
                  toast.success('消息已删除');
                  setSelectedMessage(null);
                  if (activeTab === 'inbox') await inbox.load();
                  if (activeTab === 'sent') await outbox.load();
                  if (activeTab === 'favorites') await favorites.load();
                } catch (err: any) {
                  toast.error(extractErrorMessage(err));
                }
              }}
              onMarkNotificationRead={markNotificationsRead}
              onDeleteNotification={deleteNotification}
            />
          ) : (
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
              {/* 搜索栏 */}
              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              {/* 内容：消息列表或会话视图 */}
              {activeTab === 'threads' ? (
                <ThreadsView
                  activePeerUserId={activeThreadPeerUserId}
                  threadSummaries={threadSummaries}
                  threadMessages={threadMessages}
                  replyContent={reply.replyContent}
                  replyFormat={reply.replyFormat}
                  replyAttachments={reply.replyAttachments}
                  replyToMessageId={reply.replyToMessageId}
                  onBackToList={() => { threads.setActivePeerUserId(null); threads.clearThreadMessages(); }}
                  onSelectThread={(peer) => threads.setActivePeerUserId(peer)}
                  onLoadThreadMessages={threads.loadThreadMessages}
                  onSetReplyToMessageId={reply.setReplyToMessageId}
                  onReplyContentChange={reply.setReplyContent}
                  onReplyFormatChange={reply.setReplyFormat}
                  onUploadImage={(file) => reply.uploadImage(file)}
                  onClearReply={() => { reply.clearReply(); }}
                  onSendReply={async () => { if (!threads.activePeerUserId) return; await reply.sendReply(threads.activePeerUserId); await threads.loadThreadMessages(threads.activePeerUserId); }}
                />
              ) : (
                <MessageList messages={filteredMessages} onSelect={(msg) => setSelectedMessage(msg)} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
