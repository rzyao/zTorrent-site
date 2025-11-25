import { useEffect, useMemo, useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  Pin,
  Flame,
  Star,
  Search,
  Plus,
  User,
  Reply,
  Award,
  TrendingUp,
  MessageCircle,
  X,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ForumCategoriesService } from '@/api/services/ForumCategoriesService';
import { ForumThreadsService } from '@/api/services/ForumThreadsService';
import { ForumPostsService } from '@/api/services/ForumPostsService';

/**
 * 统一响应解包辅助函数
 * 用途：兼容后端可能返回的两种结构（封装/直返）
 */
function unwrapResponse<T = any>(response: any): T {
  const body = response?.code !== undefined ? response : response?.data;
  return (body?.data ?? body) as T;
}

/**
 * 统一错误信息提取辅助函数
 * 用途：从 ApiError 中提取后端 `message`，无则回退通用 message
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
 * 后端论坛数据模型的前端简化版定义（仅用于类型标注与开发体验）
 */
interface IForumCategory {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  sort: number;
  lastThreadId?: string | null;
  lastPostAt?: string | null;
  threadsCount?: number;
  postsCount?: number;
}

interface IForumThread {
  id: string;
  categoryId: string;
  title: string;
  authorId: string;
  content: string;
  status: 'normal' | 'locked' | 'hidden' | 'deleted';
  highlightMeta?: { status?: string[]; timeType?: number | null; endTime?: string | null } | null;
  repliesCount: number;
  viewsCount: number;
  lastPostId?: string | null;
  lastPostAt?: string | null;
}

interface IForumPost {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  parentId?: string | null;
  status: 'normal' | 'hidden' | 'deleted';
  editedAt?: string | null;
  createdAt?: string | null;
}

type ForumCategory = 'all' | 'announcement' | 'help' | 'resource' | 'tech' | 'chat';

interface ForumPost {
  id: string;
  title: string;
  category: string;
  author: string;
  authorAvatar?: string;
  authorLevel: string;
  content: string;
  replies: number;
  views: number;
  likes: number;
  timestamp: string;
  lastReply?: string;
  isPinned?: boolean;
  isHot?: boolean;
  isElite?: boolean;
}

interface Reply {
  id: string;
  author: string;
  authorAvatar?: string;
  authorLevel: string;
  content: string;
  timestamp: string;
  likes: number;
}

export function ForumPage() {
  const [activeCategory, setActiveCategory] = useState<ForumCategory>('all');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * 新增：基于后端的真实数据状态管理（不影响旧模拟数据变量，后续将替换 UI 引用）
   */
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [serverCategories, setServerCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [threads, setThreads] = useState<IForumThread[]>([]);
  const [threadsTotal, setThreadsTotal] = useState(0);
  const [selectedThread, setSelectedThread] = useState<IForumThread | null>(null);
  const [posts, setPosts] = useState<IForumPost[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsLimit, setPostsLimit] = useState(20);
  const [postsTotal, setPostsTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 高亮样式解析：将后端的状态数组映射为布尔标志 */
  const parseHighlight = useMemo(() => (statuses?: string[]) => {
    const set = new Set(statuses || []);
    return { bold: set.has('bold'), red: set.has('red'), hot: set.has('badge:hot') };
  }, []);

  /** 拉取板块列表并注入一个虚拟“全部”项 */
  useEffect(() => {
    (async () => {
      try {
        const resp = await ForumCategoriesService.forumCategoriesControllerListCategories({ page: 1, limit: 100, enabled: true });
        const data = unwrapResponse<{ items?: IForumCategory[]; total?: number; page?: number; limit?: number }>(resp);
        const list = Array.isArray(data?.items) ? data.items! : [];
        const ordered = list.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
        setServerCategories([{ id: 'all', name: '全部' }, ...ordered.map(it => ({ id: it.id, name: it.name }))]);
      } catch (err: any) {
        setError(extractErrorMessage(err));
      }
    })();
  }, []);

  /** 拉取主题列表（置顶由后端排序优先） */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await ForumThreadsService.forumThreadsControllerListThreads({
          page,
          limit,
          categoryId: activeCategoryId === 'all' ? undefined : activeCategoryId,
          search: searchQuery || undefined,
        });
        const data = unwrapResponse<{ items?: IForumThread[]; total?: number; page?: number; limit?: number }>(resp);
        setThreads(Array.isArray(data?.items) ? data.items! : []);
        setThreadsTotal(Number(data?.total || 0));
      } catch (err: any) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [activeCategoryId, searchQuery, page, limit]);

  /** 当进入详情时，拉取主题详情与回帖列表 */
  useEffect(() => {
    (async () => {
      if (!selectedThread) return;
      try {
        const detailResp = await ForumThreadsService.forumThreadsControllerGetThread({ id: selectedThread.id });
        const detail = unwrapResponse<IForumThread>(detailResp);
        setSelectedThread(detail);

        const postsResp = await ForumPostsService.forumPostsControllerListPosts({ threadId: selectedThread.id, page: postsPage, limit: postsLimit });
        const postsData = unwrapResponse<{ items?: IForumPost[]; total?: number; page?: number; limit?: number }>(postsResp);
        setPosts(Array.isArray(postsData?.items) ? postsData.items! : []);
        setPostsTotal(Number(postsData?.total || 0));
      } catch (err: any) {
        setError(extractErrorMessage(err));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThread, postsPage, postsLimit]);

  // 模拟数据 - 帖子列表
  const forumPosts: ForumPost[] = [
    {
      id: '1',
      title: '【公告】站点升级维护通知 - 11月25日凌晨2:00',
      category: '公告',
      author: '管理员',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      authorLevel: '管理员',
      content: '各位用户大家好！\n\n为了提供更好的服务，本站将于11月25日凌晨2:00-4:00进行系统升级维护。届时网站将暂时无法访问。\n\n本次升级内容：\n1. 优化服务器性能\n2. 修复已知bug\n3. 增加新功能\n\n感谢大家的理解与支持！',
      replies: 45,
      views: 1283,
      likes: 89,
      timestamp: '2024-11-22 09:00',
      lastReply: '2024-11-22 15:30',
      isPinned: true,
    },
    {
      id: '2',
      title: '【教程】新手必看：如何保持良好的分享率',
      category: '教程',
      author: 'PTMaster',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PTMaster',
      authorLevel: 'VIP',
      content: '很多新手朋友经常问如何保持好的分享率，这里总结一些经验：\n\n1. 选择热门资源下载\n2. 下载完成后保持做种\n3. 合理使用魔力值\n4. 参与站点活动\n\n详细说明见正文...',
      replies: 234,
      views: 5678,
      likes: 456,
      timestamp: '2024-11-20 14:20',
      lastReply: '2024-11-22 16:45',
      isPinned: true,
      isElite: true,
    },
    {
      id: '3',
      title: '求助：下载速度一直很慢，怎么办？',
      category: '求助',
      author: 'Newbie123',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Newbie123',
      authorLevel: '新手',
      content: '我刚加入PT站，下载速度一直很慢，只有几百KB/s。我的宽带是100M的，应该不是网速问题。有老手能指点一下吗？',
      replies: 28,
      views: 892,
      likes: 15,
      timestamp: '2024-11-22 13:15',
      lastReply: '2024-11-22 16:20',
      isHot: true,
    },
    {
      id: '4',
      title: '【分享】4K HDR电影资源合集 - 持续更新',
      category: '资源',
      author: 'MovieLover',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MovieLover',
      authorLevel: 'VIP',
      content: '整理了一些优质的4K HDR电影资源，包括最新上映的大片和经典老片。画质都是顶级的，欢迎大家下载！',
      replies: 567,
      views: 12456,
      likes: 789,
      timestamp: '2024-11-18 10:30',
      lastReply: '2024-11-22 17:00',
      isHot: true,
      isElite: true,
    },
    {
      id: '5',
      title: '讨论：你们觉得Remux和原盘哪个更好？',
      category: '讨论',
      author: 'TechGeek',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechGeek',
      authorLevel: '资深',
      content: 'Remux去掉了菜单和花絮，文件小一些。原盘完整保留所有内容。大家更喜欢哪种？',
      replies: 145,
      views: 3421,
      likes: 67,
      timestamp: '2024-11-21 16:45',
      lastReply: '2024-11-22 15:50',
    },
    {
      id: '6',
      title: '【技术】详解PT下载客户端的配置优化',
      category: '技术',
      author: 'DevExpert',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevExpert',
      authorLevel: 'VIP',
      content: '分享一下qBittorrent、Transmission等客户端的详细配置方法，包括端口转发、连接数优化等。',
      replies: 89,
      views: 2134,
      likes: 123,
      timestamp: '2024-11-19 11:20',
      lastReply: '2024-11-22 14:30',
      isElite: true,
    },
    {
      id: '7',
      title: '感谢大佬们的分享！',
      category: '闲聊',
      author: 'ThankfulUser',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThankfulUser',
      authorLevel: '用户',
      content: '刚加入这个站点一个月，下载了很多优质资源。感谢所有发布者和做种的朋友们！',
      replies: 34,
      views: 678,
      likes: 45,
      timestamp: '2024-11-22 12:00',
      lastReply: '2024-11-22 16:10',
    },
    {
      id: '8',
      title: '【求助】上传的种子一直没有人下载怎么办？',
      category: '求助',
      author: 'Uploader001',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Uploader001',
      authorLevel: '用户',
      content: '我上传了几个蓝光原盘，但一直没什么人下载。是资源不够热门还是有什么问题？',
      replies: 23,
      views: 456,
      likes: 8,
      timestamp: '2024-11-22 10:30',
      lastReply: '2024-11-22 15:15',
    },
  ];

  // 模拟数据 - 回复列表
  const mockReplies: Reply[] = [
    {
      id: 'r1',
      author: 'Helper001',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helper001',
      authorLevel: 'VIP',
      content: '检查一下端口转发设置，还有确认客户端是否开启了DHT和PEX。',
      timestamp: '2024-11-22 13:30',
      likes: 12,
    },
    {
      id: 'r2',
      author: 'Expert123',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert123',
      authorLevel: '资深',
      content: '可能是Tracker连接有问题，试试手动更新Tracker。另外，选择做种人多的资源下载速度会更快。',
      timestamp: '2024-11-22 14:15',
      likes: 8,
    },
    {
      id: 'r3',
      author: 'PTMaster',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PTMaster',
      authorLevel: 'VIP',
      content: '建议参考这个教程：https://example.com/pt-guide 里面有详细的客户端配置说明。',
      timestamp: '2024-11-22 15:00',
      likes: 15,
    },
  ];

  const categories = [
    { id: 'all' as ForumCategory, name: '全部', icon: MessageSquare },
    { id: 'announcement' as ForumCategory, name: '公告', icon: Pin },
    { id: 'help' as ForumCategory, name: '求助', icon: MessageCircle },
    { id: 'resource' as ForumCategory, name: '资源', icon: Star },
    { id: 'tech' as ForumCategory, name: '技术', icon: Award },
    { id: 'chat' as ForumCategory, name: '闲聊', icon: MessageSquare },
  ];

  const filteredPosts = forumPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' ||
      (activeCategory === 'announcement' && post.category === '公告') ||
      (activeCategory === 'help' && post.category === '求助') ||
      (activeCategory === 'resource' && post.category === '资源') ||
      (activeCategory === 'tech' && post.category === '技术') ||
      (activeCategory === 'chat' && post.category === '闲聊');

    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // 置顶帖子排在前面
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl">论坛</h1>
                <p className="text-neutral-400 text-sm mt-1">
                  交流经验，分享资源，共建和谐社区
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewPost(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              发布帖子
            </Button>
          </div>
        </div>

        {/* 分类导航栏（后端板块 + 虚拟“全部”） */}
        <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700/50">
            <div className="flex items-center gap-2 flex-wrap">
              {serverCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    setSelectedThread(null);
                    setShowNewPost(false);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${activeCategoryId === category.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white'
                    : 'text-neutral-400 hover:bg-neutral-700/30 hover:text-white'
                    }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="搜索帖子..."
                className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg pl-10 pr-4 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div>
          {showNewPost ? (
            /* 发布新帖表单 */
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-400" />
                  发布新帖
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewPost(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    分类 <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                    value={activeCategoryId === 'all' ? '' : activeCategoryId}
                    onChange={(e) => setActiveCategoryId(e.target.value || 'all')}
                  >
                    {serverCategories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    标题 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="输入帖子标题"
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
                    id="new-thread-title"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    内容 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={12}
                    placeholder="输入帖子内容..."
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none resize-none transition-all"
                    id="new-thread-content"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewPost(false)}
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    onClick={async () => {
                      try {
                        const title = (document.getElementById('new-thread-title') as HTMLInputElement)?.value?.trim();
                        const content = (document.getElementById('new-thread-content') as HTMLTextAreaElement)?.value?.trim();
                        const catId = activeCategoryId === 'all' ? undefined : activeCategoryId;
                        if (!catId) { setError('请先选择板块'); return; }
                        if (!title || !content) { setError('标题与内容不能为空'); return; }
                        const resp = await ForumThreadsService.forumThreadsControllerCreate({ categoryId: catId, title, content });
                        unwrapResponse<IForumThread>(resp);
                        setShowNewPost(false);
                        setPage(1);
                        const listResp = await ForumThreadsService.forumThreadsControllerListThreads({ page: 1, limit, categoryId: catId, search: searchQuery || undefined });
                        const listData = unwrapResponse<{ items?: IForumThread[]; total?: number; page?: number; limit?: number }>(listResp);
                        setThreads(Array.isArray(listData?.items) ? listData.items! : []);
                        setThreadsTotal(Number(listData?.total || 0));
                        setError(null);
                      } catch (err: any) {
                        setError(extractErrorMessage(err));
                      }
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    发布
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedThread ? (
            /* 帖子详情 */
            <div className="space-y-6">
              {/* 帖子内容 */}
              <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {(() => { const h = parseHighlight(selectedThread?.highlightMeta?.status); return h.hot; })() && (
                          <Badge className="bg-orange-500 text-white">
                            <Flame className="w-3 h-3 mr-1" />
                            热帖
                          </Badge>
                        )}
                      </div>
                      <h2 className={`text-white text-xl mb-3 ${parseHighlight(selectedThread?.highlightMeta?.status).bold ? 'font-bold' : ''} ${parseHighlight(selectedThread?.highlightMeta?.status).red ? 'text-red-400' : ''}`}>
                        {selectedThread.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{selectedThread.authorId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{selectedThread.lastPostAt || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{selectedThread.viewsCount}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedThread(null)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-neutral-900/40 rounded-lg p-6 text-neutral-300 leading-relaxed whitespace-pre-wrap mb-6">
                    {selectedThread.content}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      点赞
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      回复
                    </Button>
                  </div>
                </div>
              </div>

              {/* 回复列表 */}
              <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-4">
                  <h3 className="text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-amber-400" />
                    回复 ({postsTotal})
                  </h3>
                </div>
                <div className="divide-y divide-neutral-700/50">
                  {posts.map((reply) => (
                    <div key={reply.id} className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center">
                            <User className="w-5 h-5 text-neutral-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white text-sm">{reply.authorId}</span>
                            <span className="text-neutral-500 text-xs ml-auto">
                              {reply.createdAt || ''}
                            </span>
                          </div>
                          <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                            {reply.content}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-neutral-400 hover:text-white h-8 px-3"
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              赞
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-neutral-400 hover:text-white h-8 px-3"
                            >
                              <Reply className="w-3 h-3 mr-1" />
                              回复
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 回复输入框 */}
                <div className="border-t border-neutral-700/50 p-6">
                  <textarea
                    rows={4}
                    placeholder="写下你的回复..."
                    className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none resize-none transition-all mb-3"
                    id="reply-content"
                    disabled={selectedThread?.status === 'locked'}
                  />
                  <div className="flex justify-end">
                    <Button
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      disabled={selectedThread?.status === 'locked'}
                      onClick={async () => {
                        if (!selectedThread) return;
                        try {
                          const content = (document.getElementById('reply-content') as HTMLTextAreaElement)?.value?.trim();
                          if (!content) { setError('回复内容不能为空'); return; }
                          const resp = await ForumPostsService.forumPostsControllerCreate({ threadId: selectedThread.id, content });
                          unwrapResponse<IForumPost>(resp);
                          const postsResp = await ForumPostsService.forumPostsControllerListPosts({ threadId: selectedThread.id, page: postsPage, limit: postsLimit });
                          const postsData = unwrapResponse<{ items?: IForumPost[]; total?: number; page?: number; limit?: number }>(postsResp);
                          setPosts(Array.isArray(postsData?.items) ? postsData.items! : []);
                          setPostsTotal(Number(postsData?.total || 0));
                          (document.getElementById('reply-content') as HTMLTextAreaElement).value = '';
                          setError(null);
                        } catch (err: any) {
                          setError(extractErrorMessage(err));
                        }
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      发送回复
                    </Button>
                  </div>
                  {selectedThread?.status === 'locked' && (
                    <p className="text-red-400 text-sm mt-2">该主题已锁定，禁止回帖</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* 帖子列表 */
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
              {/* 列表头部 */}
              <div className="bg-neutral-700/30 px-6 py-3 border-b border-neutral-700/50">
                <div className="grid grid-cols-12 gap-4 text-sm text-neutral-400">
                  <div className="col-span-6">标题</div>
                  <div className="col-span-2 text-center hidden md:block">作者</div>
                  <div className="col-span-1 text-center hidden lg:block">回复</div>
                  <div className="col-span-1 text-center hidden lg:block">查看</div>
                  <div className="col-span-2 text-center hidden md:block">最后回复</div>
                </div>
              </div>

              {/* 帖子列表 */}
              <div className="divide-y divide-neutral-700/50">
                {threads.length === 0 ? (
                  <div className="p-12 text-center text-neutral-500">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>暂无帖子</p>
                  </div>
                ) : (
                  threads.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => { setSelectedThread(post); setPostsPage(1); }}
                      className="px-6 py-4 cursor-pointer transition-all hover:bg-neutral-700/20"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* 标题列 */}
                        <div className="col-span-12 md:col-span-6">
                          <div className="flex items-start gap-2 mb-2">

                            <div className="flex-1 min-w-0">
                              <h3 className={`text-white text-sm mb-1 hover:text-amber-400 transition-colors line-clamp-1 ${parseHighlight(post.highlightMeta?.status).bold ? 'font-bold' : ''} ${parseHighlight(post.highlightMeta?.status).red ? 'text-red-400' : ''}`}>
                                {post.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                {parseHighlight(post.highlightMeta?.status).hot && (
                                  <Badge className="bg-orange-500 text-white text-xs">热帖</Badge>
                                )}
                                <Badge className="bg-neutral-700 text-neutral-300 text-xs">{post.categoryId}</Badge>
                                <span className="text-xs text-neutral-500 md:hidden">
                                  {post.authorId} · {post.repliesCount}回复 · {post.viewsCount}查看
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 作者列 */}
                        <div className="col-span-2 text-center hidden md:block">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-neutral-300 text-sm">{post.authorId}</span>
                          </div>
                        </div>

                        {/* 回复数 */}
                        <div className="col-span-1 text-center hidden lg:block">
                          <div className="flex flex-col items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-300 text-sm">{post.repliesCount}</span>
                          </div>
                        </div>

                        {/* 查看数 */}
                        <div className="col-span-1 text-center hidden lg:block">
                          <div className="flex flex-col items-center gap-1">
                            <Eye className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-300 text-sm">{post.viewsCount}</span>
                          </div>
                        </div>

                        {/* 最后回复 */}
                        <div className="col-span-2 text-center hidden md:block">
                          <span className="text-neutral-400 text-xs">{post.lastPostAt || ''}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-4">
            <div className="bg-red-500/15 border border-red-500/50 text-red-300 rounded-lg px-4 py-3 mx-4 md:mx-0">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
