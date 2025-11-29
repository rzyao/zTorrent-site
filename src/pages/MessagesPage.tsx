import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Inbox,
  Send,
  Bell,
  User,
  Clock,
  Trash2,
  Reply,
  Archive,
  Star,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OpenAPI, MessagesService } from '@/api';
import { request as __request } from '@/api/core/request';
import { toast } from 'sonner';

/**
 * 统一响应解包辅助函数
 * 作用：兼容后端统一响应结构 `{ code, message, data, path, timestamp }`
 * 与直接返回数据两种情况，统一取出 `data` 字段以便使用。
 */
function unwrapResponse<T = any>(response: any): T {
  const body = response?.code !== undefined ? response : response?.data;
  return (body?.data ?? body) as T;
}

/**
 * 统一错误信息提取辅助函数
 * 作用：从 `ApiError.body` 中提取后端 `message` 字段，若不存在则回退通用 `err.message`。
 */
function extractErrorMessage(err: any): string {
  try {
    const body = err?.body;
    const wrapped = body?.code !== undefined ? body : body?.data;
    return wrapped?.message || err?.message || '请求失败';
  } catch (_) {
    return err?.message || '请求失败';
  }
}

/**
 * 后端站内信相关数据模型（用于类型标注与开发体验）
 */
interface IMessage {
  id: string;
  threadId: string;
  senderId: string;
  recipientId: string;
  content: string;
  format: 'plain' | 'markdown' | 'html';
  attachments?: string[] | null;
  replyToMessageId?: string | null;
  createdAt: string;
  readAt?: string | null;
}

interface IThreadSummary {
  threadId: string;
  peerUserId: string;
  lastPreview: string | null;
  lastMessageAt: string | null;
  unread: number;
}

interface INotification {
  id: string;
  userId: string | null;
  type: string;
  title: string;
  content: string;
  contentFormat: 'plain' | 'markdown' | 'html';
  attachments?: string[] | null;
  createdAt: string;
  readAt?: string | null;
}

type MessageType = 'system' | 'inbox' | 'sent' | 'favorites' | 'threads';

interface Message {
  id: string;
  from: string;
  fromAvatar?: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  starred?: boolean;
  type: 'system' | 'user';
}

export function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTabRaw = (searchParams.get('tab') || 'inbox') as string;
  const allowedTabs: MessageType[] = ['system', 'inbox', 'sent', 'favorites', 'threads'];
  const initialTab = (allowedTabs.includes(initialTabRaw as MessageType) ? initialTabRaw : 'inbox') as MessageType;
  const [activeTab, setActiveTab] = useState<MessageType>(initialTab);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  /**
   * 新增：各 Tab 分页/过滤状态与会话详情状态
   * 说明：先行建立状态，以便后续逐步替换 mock 为接口对接。
   */
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [notificationsLimit, setNotificationsLimit] = useState(20);

  const [inboxPage, setInboxPage] = useState(1);
  const [inboxLimit, setInboxLimit] = useState(20);
  const [inboxOnlyUnread, setInboxOnlyUnread] = useState<boolean>(false);
  const [inboxOnlyFavorites, setInboxOnlyFavorites] = useState<boolean>(false);

  const [outboxPage, setOutboxPage] = useState(1);
  const [outboxLimit, setOutboxLimit] = useState(20);
  const [outboxOnlyFavorites, setOutboxOnlyFavorites] = useState<boolean>(false);

  const [favoritesPage, setFavoritesPage] = useState(1);
  const [favoritesLimit, setFavoritesLimit] = useState(20);

  /**
   * 收件箱/发件箱/收藏：后端消息列表状态
   */
  const [inboxItems, setInboxItems] = useState<IMessage[]>([]);
  const [outboxItems, setOutboxItems] = useState<IMessage[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<IMessage[]>([]);

  /**
   * 将消息映射为当前列表 UI 的 `Message` 结构（便于复用现有渲染）
   */
  const inboxMessagesUi = useMemo<Message[]>(() => {
    return (inboxItems || []).map(m => ({
      id: m.id,
      from: m.senderId,
      subject: m.content.slice(0, 32),
      content: m.content,
      timestamp: new Date(m.createdAt).toLocaleString(),
      read: !!m.readAt,
      type: 'user',
    }));
  }, [inboxItems]);

  const outboxMessagesUi = useMemo<Message[]>(() => {
    return (outboxItems || []).map(m => ({
      id: m.id,
      from: '我',
      subject: m.content.slice(0, 32),
      content: m.content,
      timestamp: new Date(m.createdAt).toLocaleString(),
      read: !!m.readAt,
      type: 'user',
    }));
  }, [outboxItems]);

  const favoriteMessagesUi = useMemo<Message[]>(() => {
    return (favoriteItems || []).map(m => ({
      id: m.id,
      from: m.senderId,
      subject: m.content.slice(0, 32),
      content: m.content,
      timestamp: new Date(m.createdAt).toLocaleString(),
      read: !!m.readAt,
      starred: true,
      type: 'user',
    }));
  }, [favoriteItems]);

  /**
   * 加载各列表
   */
  const loadInbox = async () => {
    try {
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/inbox',
        body: { page: inboxPage, limit: inboxLimit, onlyUnread: inboxOnlyUnread, onlyFavorites: inboxOnlyFavorites },
        mediaType: 'application/json',
      });
      const data = unwrapResponse<{ items: IMessage[]; total: number; page: number; limit: number }>(resp);
      setInboxItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const loadOutbox = async () => {
    try {
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/outbox',
        body: { page: outboxPage, limit: outboxLimit, onlyFavorites: outboxOnlyFavorites },
        mediaType: 'application/json',
      });
      const data = unwrapResponse<{ items: IMessage[]; total: number; page: number; limit: number }>(resp);
      setOutboxItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const loadFavorites = async () => {
    try {
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/favorites',
        body: { page: favoritesPage, limit: favoritesLimit },
        mediaType: 'application/json',
      });
      const data = unwrapResponse<{ items: IMessage[]; total: number; page: number; limit: number }>(resp);
      setFavoriteItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    if (activeTab === 'inbox') loadInbox();
    if (activeTab === 'sent') loadOutbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, inboxPage, inboxLimit, inboxOnlyUnread, inboxOnlyFavorites, outboxPage, outboxLimit, outboxOnlyFavorites]);

  useEffect(() => {
    if (activeTab === 'favorites') loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, favoritesPage, favoritesLimit]);

  const [threadsPage, setThreadsPage] = useState(1);
  const [threadsLimit, setThreadsLimit] = useState(20);
  const [activeThreadPeerUserId, setActiveThreadPeerUserId] = useState<string | null>(null);
  const [timelinePage, setTimelinePage] = useState(1);
  const [timelineLimit, setTimelineLimit] = useState(50);

  /**
   * 轮询：记录上次轮询时间，用于 `since` 参数。
   */
  const [lastPollAt, setLastPollAt] = useState<string | null>(null);
  const [unreadTotalCount, setUnreadTotalCount] = useState<number>(0);

  /** 会话摘要与时间线状态 */
  const [threadSummaries, setThreadSummaries] = useState<IThreadSummary[]>([]);
  const [threadMessages, setThreadMessages] = useState<IMessage[]>([]);

  /** 发送新消息表单状态 */
  const [composeRecipientId, setComposeRecipientId] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [composeFormat, setComposeFormat] = useState<'plain' | 'markdown' | 'html'>('plain');
  const [composeAttachments, setComposeAttachments] = useState<string[]>([]);

  /** 会话回复状态 */
  const [replyContent, setReplyContent] = useState('');
  const [replyFormat, setReplyFormat] = useState<'plain' | 'markdown' | 'html'>('plain');
  const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

  /** 上传图片并加入附件数组 */
  const handleUploadImage = async (file: File, pushTo: 'compose' | 'reply') => {
    try {
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/images/upload',
        formData: { file },
        mediaType: 'multipart/form-data',
      });
      const data = unwrapResponse<{ url: string }>(resp);
      const url = (data as any)?.url;
      if (typeof url === 'string' && url) {
        if (pushTo === 'compose') setComposeAttachments(prev => [...prev, url]);
        else setReplyAttachments(prev => [...prev, url]);
        toast.success('图片上传成功');
      } else {
        toast.error('图片上传失败');
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  /** 发送私信 */
  const sendMessage = async () => {
    try {
      if (!composeRecipientId || !composeContent) {
        toast.error('请填写收件人与内容');
        return;
      }
      const resp = await MessagesService.messagesControllerSend({
        recipientId: composeRecipientId,
        content: composeContent,
        format: composeFormat,
        attachments: composeAttachments,
      } as any);
      unwrapResponse(resp);
      toast.success('消息已发送');
      setShowCompose(false);
      setComposeRecipientId('');
      setComposeSubject('');
      setComposeContent('');
      setComposeAttachments([]);
      // 刷新发件箱或会话
      await loadOutbox();
      await loadThreads();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  /** 会话回复 */
  const replyMessage = async () => {
    try {
      if (!activeThreadPeerUserId || !replyContent) {
        toast.error('请填写回复内容');
        return;
      }
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/reply',
        body: {
          peerUserId: activeThreadPeerUserId,
          replyToMessageId: replyToMessageId || undefined,
          content: replyContent,
          format: replyFormat,
          attachments: replyAttachments,
        },
        mediaType: 'application/json',
      });
      unwrapResponse(resp);
      toast.success('回复已发送');
      setReplyContent('');
      setReplyAttachments([]);
      setReplyToMessageId(null);
      await loadThreadMessages(activeThreadPeerUserId);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const loadThreads = async () => {
    try {
      const resp = await MessagesService.messagesControllerThreads({ page: threadsPage, limit: threadsLimit });
      const data = unwrapResponse<{ items: IThreadSummary[]; total: number; page: number; limit: number }>(resp);
      setThreadSummaries(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const loadThreadMessages = async (peerUserId: string) => {
    try {
      const resp = await MessagesService.messagesControllerListMessages({ peerUserId, page: timelinePage, limit: timelineLimit });
      const data = unwrapResponse<{ items: IMessage[]; total: number; page: number; limit: number }>(resp);
      setThreadMessages(Array.isArray(data?.items) ? data.items : []);
      // 进入会话后标记会话全部已读
      await MessagesService.messagesControllerMarkRead({ peerUserId });
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    if (activeTab === 'threads') {
      loadThreads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, threadsPage, threadsLimit]);

  /** 未读总数与轮询 */
  const refreshUnreadCount = async () => {
    try {
      const resp = await MessagesService.messagesControllerUnreadCount();
      const data = unwrapResponse<{ count: number }>(resp);
      const count = Number((data as any)?.count || 0);
      setUnreadTotalCount(count);
    } catch (_) { }
  };

  useEffect(() => {
    refreshUnreadCount();
    setLastPollAt(new Date().toISOString());
    const timer = setInterval(async () => {
      try {
        const since = lastPollAt || new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const resp = await __request(OpenAPI, {
          method: 'POST',
          url: '/messages/poll',
          body: { since },
          mediaType: 'application/json',
        });
        const data = unwrapResponse<{ inboxNewCount: number; notificationsNewCount: number; threadsUpdated: Array<{ threadId: string; peerUserId: string; lastMessageAt: string; unread: number }> }>(resp);
        setLastPollAt(new Date().toISOString());
        if (Array.isArray((data as any)?.threadsUpdated) && (data as any).threadsUpdated.length > 0) {
          toast.info('有新会话更新');
          await loadThreads();
        }
        await refreshUnreadCount();
      } catch (_) { }
    }, 3 * 60 * 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 消息级操作：收藏/取消收藏、单条已读、软删
   */
  const favoriteMessage = async (id: string) => {
    try {
      await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/favorite',
        body: { id },
        mediaType: 'application/json',
      });
      toast.success('已收藏');
      if (activeTab === 'inbox') await loadInbox();
      if (activeTab === 'sent') await loadOutbox();
      if (activeTab === 'favorites') await loadFavorites();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const unfavoriteMessage = async (id: string) => {
    try {
      await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/unfavorite',
        body: { id },
        mediaType: 'application/json',
      });
      toast.success('已取消收藏');
      if (activeTab === 'inbox') await loadInbox();
      if (activeTab === 'sent') await loadOutbox();
      if (activeTab === 'favorites') await loadFavorites();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const markMessageRead = async (id: string) => {
    try {
      await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/mark-read',
        body: { id },
        mediaType: 'application/json',
      });
      toast.success('已标记为已读');
      if (activeTab === 'inbox') await loadInbox();
      if (activeTab === 'sent') await loadOutbox();
      if (activeTab === 'favorites') await loadFavorites();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && allowedTabs.includes(t as MessageType)) {
      setActiveTab(t as MessageType);
    }
  }, [searchParams]);

  /** URL同步当前Tab */
  useEffect(() => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('tab', activeTab);
      return p;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /** 搜索防抖 */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * 系统通知：从后端加载，替换本地模拟
   */
  const [systemNotifications, setSystemNotifications] = useState<INotification[]>([]);

  /**
   * 将系统通知映射为当前列表 UI 的 `Message` 结构（仅用于展示）
   */
  const systemMessagesUi = useMemo<Message[]>(() => {
    return (systemNotifications || []).map((n) => ({
      id: n.id,
      from: '系统通知',
      subject: n.title,
      content: n.content,
      timestamp: new Date(n.createdAt).toLocaleString(),
      read: !!n.readAt,
      type: 'system',
    }));
  }, [systemNotifications]);

  /**
   * 加载系统通知列表
   */
  const loadSystemNotifications = async () => {
    try {
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/notifications/list',
        body: { page: notificationsPage, limit: notificationsLimit },
        mediaType: 'application/json',
      });
      const data = unwrapResponse<{ items: INotification[]; total: number; page: number; limit: number }>(resp);
      setSystemNotifications(Array.isArray(data?.items) ? data.items : []);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    if (activeTab === 'system') {
      loadSystemNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, notificationsPage, notificationsLimit]);

  /**
   * 标记系统通知为已读（支持单条或批量）
   */
  const markNotificationsRead = async (ids: string[]) => {
    try {
      await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/notifications/mark-read',
        body: { ids },
        mediaType: 'application/json',
      });
      toast.success('已标记为已读');
      await loadSystemNotifications();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  /**
   * 删除（软删）单条系统通知
   */
  const deleteNotification = async (id: string) => {
    try {
      await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/notifications/delete',
        body: { id },
        mediaType: 'application/json',
      });
      toast.success('通知已删除');
      await loadSystemNotifications();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  // 模拟数据 - 收件箱
  const inboxMessages: Message[] = [
    {
      id: '4',
      from: 'ZhangSan',
      fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangSan',
      subject: '关于《星际穿越》种子',
      content: '你好！我看到你发布的《星际穿越》4K版本，画质非常棒！请问有HDR版本吗？',
      timestamp: '2024-11-22 14:25',
      read: false,
      starred: true,
      type: 'user',
    },
    {
      id: '5',
      from: 'LiSi',
      fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiSi',
      subject: '感谢分享',
      content: '非常感谢你分享的资源，质量很好！已经做种了，会一直保持。',
      timestamp: '2024-11-21 18:40',
      read: true,
      type: 'user',
    },
    {
      id: '6',
      from: 'WangWu',
      fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangWu',
      subject: '求助：下载速度慢',
      content: '你好，我在下载你的种子时速度很慢，可能是什么原因？需要端口转发吗？',
      timestamp: '2024-11-20 11:30',
      read: true,
      type: 'user',
    },
  ];

  // 模拟数据 - 发件箱
  const sentMessages: Message[] = [
    {
      id: '7',
      from: '我',
      subject: '回复：关于《星际穿越》种子',
      content: '你好！HDR版本正在制作中，预计下周发布。请关注我的主页，会第一时间更新。',
      timestamp: '2024-11-22 14:30',
      read: true,
      type: 'user',
    },
    {
      id: '8',
      from: '我',
      subject: '种子更新通知',
      content: '我已经更新了《盗梦空间》的种子，修正了字幕问题，欢迎下载！',
      timestamp: '2024-11-21 16:00',
      read: true,
      type: 'user',
    },
  ];

  const getCurrentMessages = () => {
    switch (activeTab) {
      case 'system':
        return systemMessagesUi;
      case 'inbox':
        return inboxMessagesUi;
      case 'sent':
        return outboxMessagesUi;
      case 'favorites':
        return favoriteMessagesUi;
      default:
        return [];
    }
  };

  const messages = getCurrentMessages();
  const unreadCount = {
    system: systemMessagesUi.filter(m => !m.read).length,
    inbox: inboxMessagesUi.filter(m => !m.read).length,
  };

  const filteredMessages = messages.filter(
    msg =>
      msg.subject.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      msg.from.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      msg.content.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl flex items-center gap-2">消息中心 {unreadTotalCount > 0 && (<Badge className="bg-red-500 text-white">{unreadTotalCount}</Badge>)}</h1>
                <p className="text-neutral-400 text-sm mt-1">
                  管理您的系统通知和私人消息
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCompose(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
            >
              <Send className="w-4 h-4 mr-2" />
              发送消息
            </Button>
          </div>
        </div>

        {/* 导航标签栏 - 横向布局 */}
        <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700/50">
            <div className="flex items-center gap-2">
              {/* 系统通知 */}
              <button
                onClick={() => {
                  setActiveTab('system');
                  setSelectedMessage(null);
                  setShowCompose(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${activeTab === 'system'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white'
                  : 'text-neutral-400 hover:bg-neutral-700/30 hover:text-white'
                  }`}
              >
                <Bell className="w-5 h-5" />
                <span>系统通知</span>
                {unreadCount.system > 0 && (
                  <Badge className="bg-red-500 text-white ml-1">
                    {unreadCount.system}
                  </Badge>
                )}
              </button>

              {/* 收件箱 */}
              <button
                onClick={() => {
                  setActiveTab('inbox');
                  setSelectedMessage(null);
                  setShowCompose(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${activeTab === 'inbox'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white'
                  : 'text-neutral-400 hover:bg-neutral-700/30 hover:text-white'
                  }`}
              >
                <Inbox className="w-5 h-5" />
                <span>收件箱</span>
                {unreadCount.inbox > 0 && (
                  <Badge className="bg-red-500 text-white ml-1">
                    {unreadCount.inbox}
                  </Badge>
                )}
              </button>

              {/* 发件箱 */}
              <button
                onClick={() => {
                  setActiveTab('sent');
                  setSelectedMessage(null);
                  setShowCompose(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${activeTab === 'sent'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white'
                  : 'text-neutral-400 hover:bg-neutral-700/30 hover:text-white'
                  }`}
              >
                <Send className="w-5 h-5" />
                <span>发件箱</span>
              </button>

              {/* 我的收藏 */}
              <button
                onClick={() => {
                  setActiveTab('favorites');
                  setSelectedMessage(null);
                  setShowCompose(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white'
                  : 'text-neutral-400 hover:bg-neutral-700/30 hover:text-white'
                  }`}
              >
                <Star className="w-5 h-5" />
                <span>我的收藏</span>
              </button>

              {/* 会话 */}
              <button
                onClick={() => {
                  setActiveTab('threads');
                  setSelectedMessage(null);
                  setShowCompose(false);
                  setActiveThreadPeerUserId(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${activeTab === 'threads'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white'
                  : 'text-neutral-400 hover:bg-neutral-700/30 hover:text-white'
                  }`}
              >
                <Inbox className="w-5 h-5" />
                <span>会话</span>
              </button>
            </div>

            {/* 快捷操作 */}
            <div className="flex items-center gap-2">
              {activeTab === 'system' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-700/30"
                  onClick={() => {
                    const unreadIds = systemNotifications.filter(n => !n.readAt).map(n => n.id);
                    if (unreadIds.length === 0) {
                      toast.info('暂无未读通知');
                    } else {
                      markNotificationsRead(unreadIds);
                    }
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  全部已读
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white hover:bg-neutral-700/30"
              >
                <Archive className="w-4 h-4 mr-2" />
                归档
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white hover:bg-neutral-700/30"
              >
                <Star className="w-4 h-4 mr-2" />
                星标
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white hover:bg-neutral-700/30"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                回收站
              </Button>
            </div>
          </div>
        </div>

        {/* 内容区域 - 全宽 */}
        <div>
          {showCompose ? (
            /* 发送消息表单 */
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-amber-400" />
                  发送新消息
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCompose(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    收件人 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="输入用户名"
                    value={composeRecipientId}
                    onChange={(e) => setComposeRecipientId(e.target.value)}
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    主题 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="输入消息主题"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    内容 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={12}
                    placeholder="输入消息内容..."
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none resize-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 text-sm mb-2 block">格式</label>
                    <Select value={composeFormat} onValueChange={(v) => setComposeFormat(v as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择格式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plain">纯文本</SelectItem>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-neutral-300 text-sm mb-2 block">图片附件</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file, 'compose');
                      }}
                      className="w-full text-neutral-300 text-sm"
                    />
                    {composeAttachments.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {composeAttachments.map((url, idx) => (
                          <img key={idx} src={url} alt="attachment" className="w-full h-24 object-cover rounded-md" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCompose(false)}
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    取消
                  </Button>
                  <Button onClick={sendMessage} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    发送
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedMessage ? (
            /* 消息详情 */
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-white text-lg mb-2">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <User className="w-4 h-4" />
                        <span>{selectedMessage.from}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Clock className="w-4 h-4" />
                        <span>{selectedMessage.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMessage(null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-neutral-900/40 rounded-lg p-6 text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>
                {selectedMessage.type === 'user' && (activeTab === 'inbox' || activeTab === 'sent' || activeTab === 'favorites') && (
                  <div className="mt-6 flex gap-3">
                    {!selectedMessage.read && (
                      <Button
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        onClick={() => markMessageRead(selectedMessage.id)}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        标记已读
                      </Button>
                    )}
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                      <Reply className="w-4 h-4 mr-2" />
                      回复
                    </Button>
                    <Button
                      variant="outline"
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      onClick={() => favoriteMessage(selectedMessage.id)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      收藏
                    </Button>
                    {activeTab === 'favorites' && (
                      <Button
                        variant="outline"
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                        onClick={() => unfavoriteMessage(selectedMessage.id)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        取消收藏
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-neutral-700 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      onClick={async () => {
                        try {
                          await MessagesService.messagesControllerDeleteMessage({ id: selectedMessage.id });
                          toast.success('消息已删除');
                          setSelectedMessage(null);
                          if (activeTab === 'inbox') await loadInbox();
                          if (activeTab === 'sent') await loadOutbox();
                          if (activeTab === 'favorites') await loadFavorites();
                        } catch (err: any) {
                          toast.error(extractErrorMessage(err));
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </Button>
                  </div>
                )}
                {selectedMessage.type === 'system' && (
                  <div className="mt-6 flex gap-3">
                    {!selectedMessage.read && (
                      <Button
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        onClick={() => markNotificationsRead([selectedMessage.id])}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        标记已读
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-neutral-700 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => deleteNotification(selectedMessage.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 消息列表 或 会话视图 */
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
              {/* 搜索栏 */}
              <div className="border-b border-neutral-700/50 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索消息..."
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                  />
                </div>
              </div>

              {/* 内容：根据 Tab 决定渲染消息列表或会话列表/时间线 */}
              {activeTab === 'threads' ? (
                activeThreadPeerUserId ? (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white">会话详情</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neutral-400 hover:text-white"
                        onClick={() => {
                          setActiveThreadPeerUserId(null);
                          setThreadMessages([]);
                        }}
                      >
                        返回列表
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {threadMessages.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500">
                          <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                          <p>暂无消息</p>
                        </div>
                      ) : (
                        threadMessages.map(msg => (
                          <div key={msg.id} className="bg-neutral-900/40 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-neutral-400">{msg.senderId}</span>
                              <span className="text-xs text-neutral-500">{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                            {msg.format === 'html' ? (
                              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: msg.content }} />
                            ) : (
                              <div className="text-neutral-300 whitespace-pre-wrap">{msg.content}</div>
                            )}
                            {Array.isArray(msg.attachments) && msg.attachments?.length ? (
                              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                                {msg.attachments!.map((url, idx) => (
                                  <img key={idx} src={url} alt="attachment" className="w-full h-32 object-cover rounded-md" />
                                ))}
                              </div>
                            ) : null}
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-neutral-400 hover:text-white"
                                onClick={() => setReplyToMessageId(msg.id)}
                              >
                                引用回复
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {/* 回复输入区 */}
                    <div className="mt-6 bg-neutral-900/40 rounded-lg p-4">
                      {replyToMessageId && (
                        <div className="mb-2 text-xs text-neutral-500">引用消息ID：{replyToMessageId}</div>
                      )}
                      <textarea
                        rows={6}
                        placeholder="输入回复内容..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none resize-none transition-all"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="text-neutral-300 text-sm mb-2 block">格式</label>
                          <Select value={replyFormat} onValueChange={(v) => setReplyFormat(v as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择格式" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="plain">纯文本</SelectItem>
                              <SelectItem value="markdown">Markdown</SelectItem>
                              <SelectItem value="html">HTML</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-neutral-300 text-sm mb-2 block">图片附件</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadImage(file, 'reply');
                            }}
                            className="w-full text-neutral-300 text-sm"
                          />
                          {replyAttachments.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                              {replyAttachments.map((url, idx) => (
                                <img key={idx} src={url} alt="attachment" className="w-full h-24 object-cover rounded-md" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-4">
                        <Button
                          variant="outline"
                          className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                          onClick={() => {
                            setReplyContent('');
                            setReplyAttachments([]);
                            setReplyToMessageId(null);
                          }}
                        >
                          清空
                        </Button>
                        <Button onClick={replyMessage} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                          <Reply className="w-4 h-4 mr-2" />
                          回复
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-700/50">
                    {threadSummaries.length === 0 ? (
                      <div className="p-12 text-center text-neutral-500">
                        <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>暂无会话</p>
                      </div>
                    ) : (
                      threadSummaries.map(th => (
                        <div
                          key={th.threadId}
                          onClick={() => {
                            setActiveThreadPeerUserId(th.peerUserId);
                            loadThreadMessages(th.peerUserId);
                          }}
                          className="p-5 cursor-pointer transition-all hover:bg-neutral-700/20"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-neutral-400" />
                              <span className="text-sm text-white">{th.peerUserId}</span>
                              {th.unread > 0 && (
                                <Badge className="bg-red-500 text-white ml-1">{th.unread}</Badge>
                              )}
                            </div>
                            <span className="text-xs text-neutral-500">{th.lastMessageAt ? new Date(th.lastMessageAt).toLocaleString() : ''}</span>
                          </div>
                          <p className="text-sm text-neutral-500 truncate mt-2">{th.lastPreview || ''}</p>
                        </div>
                      ))
                    )}
                  </div>
                )
              ) : (
                <div className="divide-y divide-neutral-700/50">
                  {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500">
                      <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>暂无消息</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-5 cursor-pointer transition-all hover:bg-neutral-700/20 ${!message.read ? 'bg-neutral-700/10' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* 头像/图标 */}
                          <div className="flex-shrink-0">
                            {message.type === 'system' ? (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-white" />
                              </div>
                            ) : message.fromAvatar ? (
                              <img src={message.fromAvatar} alt={message.from} className="w-10 h-10 rounded-lg" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center">
                                <User className="w-5 h-5 text-neutral-400" />
                              </div>
                            )}
                          </div>
                          {/* 消息内容 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${!message.read ? 'text-white font-medium' : 'text-neutral-400'}`}>{message.from}</span>
                                {message.starred && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                              <span className="text-xs text-neutral-500 flex-shrink-0">{message.timestamp}</span>
                            </div>
                            <h3 className={`text-sm mb-1 ${!message.read ? 'text-white font-medium' : 'text-neutral-300'}`}>{message.subject}</h3>
                            <p className="text-sm text-neutral-500 truncate">{message.content}</p>
                          </div>
                          {/* 未读标记 */}
                          {!message.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
