import { useEffect, useMemo, useState } from 'react';
import { FilmsService, PlaylistsService, TorrentsService, SettingsService } from '../api';
import { AuditService } from '../api/services/AuditService';
import { Film, List, Package, Check, X, Clock, User, Calendar, Tag, Eye, AlertTriangle, Search, Filter, ChevronDown, MessageSquare, History, Star, Shield, Image as ImageIcon } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

type ReviewType = 'movie' | 'playlist' | 'torrent';
type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface ReviewItem {
  id: string;
  type: ReviewType;
  title: string;
  submitter: string;
  submitterReputation: number;
  submitDate: string;
  status: ReviewStatus;
  category?: string;
  description?: string;
  image?: string;
  rating?: number;
  visibility?: 'public' | 'private' | 'members';
  notes?: string;
  missingFields?: string[];
  sensitiveWords?: string[];
  imdbRating?: number;
  tmdbId?: string;
  year?: string;
  screenshots?: string[];
}

type AuditHistory = { id: string; reviewer: string; action: 'approved' | 'rejected'; date: string; notes: string };

export function ReviewPage() {
  const [typeFilter, setTypeFilter] = useState<ReviewType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('pending');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [reviewSwitches, setReviewSwitches] = useState<{ film?: boolean; playlist?: boolean; torrent?: boolean }>({});
  const [historyItems, setHistoryItems] = useState<AuditHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 说明：统一响应解包，兼容后端两种返回风格（统一包裹/直返体）
  const unwrapResponse = (resp: any) => {
    const body = resp?.code !== undefined ? resp : resp?.data;
    return body?.data ?? body;
  };

  // 说明：统一错误信息抽取，优先从后端 body.message 获取
  const extractErrorMessage = (e: any) => {
    const msg = e?.body?.message || e?.message || '操作失败，请稍后重试';
    return String(msg);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const typeMatch = typeFilter === 'all' || item.type === typeFilter;
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      const searchMatch = searchQuery === '' ||
        item.title?.toLowerCase?.().includes(searchQuery.toLowerCase()) ||
        item.submitter?.toLowerCase?.().includes(searchQuery.toLowerCase());
      return typeMatch && statusMatch && searchMatch;
    });
  }, [items, typeFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    pending: items.filter(i => i.status === 'pending').length,
    pendingMovies: items.filter(i => i.status === 'pending' && i.type === 'movie').length,
    pendingPlaylists: items.filter(i => i.status === 'pending' && i.type === 'playlist').length,
    pendingTorrents: items.filter(i => i.status === 'pending' && i.type === 'torrent').length,
    todayApproved: items.filter(i => i.status === 'approved' && (i.submitDate || '').startsWith(new Date().toISOString().slice(0, 10))).length,
    todayRejected: items.filter(i => i.status === 'rejected' && (i.submitDate || '').startsWith(new Date().toISOString().slice(0, 10))).length,
  }), [items]);

  // 说明：管理员种子列表（支持高级筛选）。原因：用户端列表在开启审核开关后仅返回 approved，
  // 审核页需要拉取 pending/rejected，因此使用管理员端点，并通过 AdvancedRule 按 approvalStatus 过滤。
  const fetchTorrents = async () => {
    setLoading(true);
    try {
      const rules: any[] = [];
      if (statusFilter !== 'all') {
        rules.push({ field: 'approvalStatus', op: 'Equal', value: statusFilter });
      }
      const resp = await TorrentsService.torrentsControllerListTorrentsForAdmin({
        page,
        limit,
        keyword: searchQuery || undefined,
        sortBy: 'approvedAt',
        order: 'DESC',
        logic: rules.length > 0 ? 'AND' : undefined,
        rules: rules.length > 0 ? rules : undefined,
      } as any);
      const data = unwrapResponse(resp);
      const list: any[] = Array.isArray(data?.items) ? data.items : [];
      const mapped: ReviewItem[] = list.map((it: any) => ({
        id: String(it?.id ?? ''),
        type: 'torrent',
        title: String(it?.title ?? it?.name ?? '未命名种子'),
        submitter: String(it?.uploader?.username ?? it?.uploaderName ?? '未知'),
        submitterReputation: Number(it?.uploader?.reputation ?? 0),
        submitDate: String(it?.uploadedAt ?? it?.createdAt ?? ''),
        status: (String(it?.approvalStatus ?? 'pending') as ReviewStatus),
        category: String(it?.category ?? ''),
        description: String(it?.description ?? ''),
        visibility: (it?.visibility as any) ?? 'public',
        missingFields: Array.isArray(it?.missingFields) ? it.missingFields : undefined,
        sensitiveWords: Array.isArray(it?.sensitiveWords) ? it.sensitiveWords : undefined,
        screenshots: Array.isArray(it?.screenshots) ? it.screenshots : undefined,
      }));
      setItems(mapped);
      setTotal(Number(data?.total ?? mapped.length));
    } catch (e) {
      console.error(extractErrorMessage(e));
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const resp = await FilmsService.filmsControllerAdminList({
        page,
        limit,
        keyword: searchQuery || undefined,
        approvalStatus: statusFilter === 'all' ? undefined : statusFilter,
        sortBy: 'approvedAt',
        order: 'DESC',
      } as any);
      const data = unwrapResponse(resp);
      const list: any[] = Array.isArray(data?.items) ? data.items : [];
      const mapped: ReviewItem[] = list.map((it: any) => ({
        id: String(it?.id ?? ''),
        type: 'movie',
        title: String(it?.title ?? '未命名影片'),
        submitter: String(it?.uploader?.username ?? it?.uploaderName ?? '未知'),
        submitterReputation: Number(it?.uploader?.reputation ?? 0),
        submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ''),
        status: (String(it?.approvalStatus ?? 'pending') as ReviewStatus),
        category: String(it?.category ?? ''),
        description: String(it?.description ?? ''),
        image: String(it?.posterUrl ?? ''),
        rating: Number(it?.rating ?? it?.imdbRating ?? 0),
        year: String(it?.year ?? ''),
        visibility: (it?.visibility as any) ?? 'public',
      }));
      setItems(mapped);
      setTotal(Number(data?.total ?? mapped.length));
    } catch (e) {
      console.error(extractErrorMessage(e));
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const resp = await PlaylistsService.playlistsControllerAdminList({
        page,
        limit,
        keyword: searchQuery || undefined,
        approvalStatus: statusFilter === 'all' ? undefined : statusFilter,
        sortBy: 'approvedAt',
        order: 'DESC',
      } as any);
      const data = unwrapResponse(resp);
      const list: any[] = Array.isArray(data?.items) ? data.items : [];
      const mapped: ReviewItem[] = list.map((it: any) => ({
        id: String(it?.id ?? ''),
        type: 'playlist',
        title: String(it?.title ?? '未命名片单'),
        submitter: String(it?.owner?.username ?? it?.ownerUsername ?? '未知'),
        submitterReputation: Number(it?.owner?.reputation ?? 0),
        submitDate: String(it?.approvedAt ?? it?.updatedAt ?? it?.createdAt ?? ''),
        status: (String(it?.approvalStatus ?? 'pending') as ReviewStatus),
        category: String(it?.type ?? ''),
        description: String(it?.description ?? ''),
        image: String(it?.coverUrl ?? ''),
        visibility: (it?.visibility as any) ?? 'public',
      }));
      setItems(mapped);
      setTotal(Number(data?.total ?? mapped.length));
    } catch (e) {
      console.error(extractErrorMessage(e));
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeFilter === 'torrent') fetchTorrents();
    else if (typeFilter === 'movie') fetchFilms();
    else if (typeFilter === 'playlist') fetchPlaylists();
    else {
      // 全部：默认显示待审种子与影片的合并视图（分页以种子为准）
      Promise.all([fetchTorrents(), fetchFilms()]).then(() => {
        // 合并由各自函数设置 items；此处不做强合并，保持单类型切换体验
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, statusFilter, searchQuery, page, limit]);

  // 说明：读取审核开关状态（只读展示）改用只读端点
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await SettingsService.settingsControllerGetReviewSwitches();
        const data = unwrapResponse(resp);
        const film = Boolean(data?.filmReview ?? data?.film);
        const playlist = Boolean(data?.playlistReview ?? data?.playlist);
        const torrent = Boolean(data?.torrentReview ?? data?.torrent);
        if (!cancelled) setReviewSwitches({ film, playlist, torrent });
      } catch (e) {
        console.error(extractErrorMessage(e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // 说明：打开审核历史时拉取统一日志
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!showHistory || !selectedItem) return;
      setHistoryLoading(true);
      try {
        const resp = await AuditService.auditControllerHistory({ type: selectedItem.type === 'movie' ? 'film' : selectedItem.type, resourceId: selectedItem.id });
        const data = unwrapResponse(resp);
        const items: any[] = Array.isArray(data?.items) ? data.items : [];
        const mapped: AuditHistory[] = items.map((h: any, idx: number) => ({
          id: String(h?.id ?? idx),
          reviewer: String(h?.reviewer ?? h?.operator ?? ''),
          action: (String(h?.action ?? '').toLowerCase() === 'approved' ? 'approved' : 'rejected'),
          date: String(h?.timestamp ?? h?.createdAt ?? ''),
          notes: String(h?.note ?? h?.reason ?? ''),
        }));
        if (!cancelled) setHistoryItems(mapped);
      } catch (e) {
        console.error(extractErrorMessage(e));
        if (!cancelled) setHistoryItems([]);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [showHistory, selectedItem]);

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            待审核
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
            <Check className="w-3 h-3" />
            已通过
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
            <X className="w-3 h-3" />
            已驳回
          </span>
        );
    }
  };

  const getTypeIcon = (type: ReviewType) => {
    switch (type) {
      case 'movie': return <Film className="w-4 h-4" />;
      case 'playlist': return <List className="w-4 h-4" />;
      case 'torrent': return <Package className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: ReviewType) => {
    switch (type) {
      case 'movie': return '影片';
      case 'playlist': return '片单';
      case 'torrent': return '种子';
    }
  };

  const getVisibilityLabel = (visibility?: string) => {
    switch (visibility) {
      case 'public': return '公开';
      case 'members': return '会员可见';
      case 'private': return '私有';
      default: return '-';
    }
  };

  const handleAction = (item: ReviewItem, action: 'approve' | 'reject') => {
    setSelectedItem(item);
    setActionType(action);
    setActionNotes('');
  };

  // 说明：确认执行审核动作。根据类型调用对应的审核端点（/review），成功后更新本地状态。
  const confirmAction = async () => {
    if (!selectedItem || !actionType) return;
    try {
      const payload = { id: selectedItem.id, action: actionType, note: actionNotes.trim() } as any;
      if (selectedItem.type === 'torrent') {
        await TorrentsService.torrentsControllerReview(payload);
      } else if (selectedItem.type === 'movie') {
        await FilmsService.filmsControllerReview(payload);
      } else if (selectedItem.type === 'playlist') {
        await PlaylistsService.playlistsControllerReview(payload);
      }
      // 更新本地列表状态
      setItems(prev => prev.map(it => it.id === selectedItem.id ? { ...it, status: actionType === 'approve' ? 'approved' : 'rejected', notes: payload.note } : it));
    } catch (e) {
      console.error(extractErrorMessage(e));
    } finally {
      setActionType(null);
      setActionNotes('');
      setSelectedItem(null);
    }
  };

  const cancelAction = () => {
    setActionType(null);
    setActionNotes('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1600px] mx-auto p-8">
        {/* 页面标题 + 审核开关只读状态 */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            审核中心
          </h1>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-neutral-400">审核开关：</span>
            <span className={`px-2 py-1 rounded ${reviewSwitches.film ? 'bg-green-500/20 text-green-400' : 'bg-neutral-700/50 text-neutral-300'}`}>影片 {reviewSwitches.film ? '开启' : '关闭'}</span>
            <span className={`px-2 py-1 rounded ${reviewSwitches.playlist ? 'bg-green-500/20 text-green-400' : 'bg-neutral-700/50 text-neutral-300'}`}>片单 {reviewSwitches.playlist ? '开启' : '关闭'}</span>
            <span className={`px-2 py-1 rounded ${reviewSwitches.torrent ? 'bg-green-500/20 text-green-400' : 'bg-neutral-700/50 text-neutral-300'}`}>种子 {reviewSwitches.torrent ? '开启' : '关闭'}</span>
          </div>
          <p className="text-neutral-400 mt-2">
            集中管理影片、片单和种子的审核工作流
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">待审核总数</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl text-amber-400 mb-1">{stats.pending}</div>
            <div className="text-xs text-neutral-500">
              影片 {stats.pendingMovies} · 片单 {stats.pendingPlaylists} · 种子 {stats.pendingTorrents}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">今日通过</span>
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl text-green-400">{stats.todayApproved}</div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-rose-600/10 border border-red-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">今日驳回</span>
              <X className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl text-red-400">{stats.todayRejected}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">审核效率</span>
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl text-blue-400">94%</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">平均用时</span>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl text-purple-400">5.2<span className="text-lg">分</span></div>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* 搜索框 */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="搜索标题或提交人..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-neutral-200 text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* 资源类型 */}
            <div className="flex gap-2">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${typeFilter === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                全部
              </button>
              <button
                onClick={() => setTypeFilter('movie')}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${typeFilter === 'movie'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                <Film className="w-4 h-4" />
                影片
              </button>
              <button
                onClick={() => setTypeFilter('playlist')}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${typeFilter === 'playlist'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                <List className="w-4 h-4" />
                片单
              </button>
              <button
                onClick={() => setTypeFilter('torrent')}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${typeFilter === 'torrent'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                <Package className="w-4 h-4" />
                种子
              </button>
            </div>

            {/* 状态筛选 */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${statusFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                待审核
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${statusFilter === 'approved'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                已通过
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${statusFilter === 'rejected'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                已驳回
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${statusFilter === 'all'
                  ? 'bg-neutral-600 text-neutral-200'
                  : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                全部
              </button>
            </div>

            {/* 更多筛选 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg text-sm bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 transition-all flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              更多筛选
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 展开的筛选项 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-700/50 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">时间范围</label>
                <Select
                  value={timeRange}
                  onValueChange={(v) => setTimeRange(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部时间</SelectItem>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="week">本周</SelectItem>
                    <SelectItem value="month">本月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">评分区间（影片）</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择评分区间" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部评分</SelectItem>
                    <SelectItem value="9+">9.0+</SelectItem>
                    <SelectItem value="8+">8.0+</SelectItem>
                    <SelectItem value="7+">7.0+</SelectItem>
                    <SelectItem value="below7">7.0以下</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">提交人信誉</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择信誉级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="high">高信誉 (90+)</SelectItem>
                    <SelectItem value="medium">中等 (70-89)</SelectItem>
                    <SelectItem value="low">低信誉 (&lt;70)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* 审核列表 - 表格形式 */}
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-900/50 border-b border-neutral-700/50">
                  <th className="px-4 py-3 text-left text-xs text-neutral-400">封面/类型</th>
                  <th className="px-4 py-3 text-left text-xs text-neutral-400">标题</th>
                  <th className="px-4 py-3 text-left text-xs text-neutral-400">提交人</th>
                  <th className="px-4 py-3 text-left text-xs text-neutral-400">提交时间</th>
                  <th className="px-4 py-3 text-left text-xs text-neutral-400">可见性</th>
                  <th className="px-4 py-3 text-left text-xs text-neutral-400">状态</th>
                  <th className="px-4 py-3 text-left text-xs text-neutral-400">警告</th>
                  <th className="px-4 py-3 text-right text-xs text-neutral-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Tag className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                      <p className="text-neutral-400">暂无符合条件的审核项目</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-700/30 hover:bg-neutral-700/20 transition-colors">
                      {/* 封面/类型 */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {item.type === 'movie' && item.image ? (
                            <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-16 bg-neutral-700/50 rounded flex items-center justify-center">
                              {getTypeIcon(item.type)}
                            </div>
                          )}
                          <span className="text-xs text-neutral-400">{getTypeLabel(item.type)}</span>
                        </div>
                      </td>

                      {/* 标题 */}
                      <td className="px-4 py-4">
                        <div className="max-w-[300px]">
                          <div className="text-neutral-200 mb-1 truncate">{item.title}</div>
                          {item.category && (
                            <div className="text-xs text-amber-400">{item.category}</div>
                          )}
                          {item.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-yellow-400">{item.rating}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 提交人 */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-neutral-400" />
                          <div>
                            <div className="text-sm text-neutral-200">{item.submitter}</div>
                            <div className={`text-xs ${item.submitterReputation >= 90 ? 'text-green-400' :
                              item.submitterReputation >= 70 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                              信誉 {item.submitterReputation}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 提交时间 */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                          <Calendar className="w-4 h-4" />
                          {item.submitDate}
                        </div>
                      </td>

                      {/* 可见性 */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-neutral-300">
                          {getVisibilityLabel(item.visibility)}
                        </span>
                      </td>

                      {/* 状态 */}
                      <td className="px-4 py-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* 警告 */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {item.missingFields && item.missingFields.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-orange-400">
                              <AlertTriangle className="w-3 h-3" />
                              缺失字段
                            </div>
                          )}
                          {item.sensitiveWords && item.sensitiveWords.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-red-400">
                              <AlertTriangle className="w-3 h-3" />
                              敏感词
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 操作 */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4 text-neutral-400" />
                          </button>
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(item, 'approve')}
                                className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                                title="通过"
                              >
                                <Check className="w-4 h-4 text-green-400" />
                              </button>
                              <button
                                onClick={() => handleAction(item, 'reject')}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="驳回"
                              >
                                <X className="w-4 h-4 text-red-400" />
                              </button>
                            </>
                          )}
                          {(item.status === 'approved' || item.status === 'rejected') && (
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowHistory(true);
                              }}
                              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                              title="审核历史"
                            >
                              <History className="w-4 h-4 text-neutral-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 详情抽屉 */}
      {selectedItem && !actionType && !showHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-end z-50">
          <div className="bg-neutral-900 border-l border-neutral-700 w-full md:w-[600px] h-full md:h-screen overflow-y-auto">
            {/* 头部 */}
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-xl text-neutral-100">审核详情</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6">
              {/* 媒体预览 */}
              {selectedItem.type === 'movie' && selectedItem.image && (
                <div>
                  <h3 className="text-sm text-neutral-400 mb-3">封面预览</h3>
                  <img src={selectedItem.image} alt={selectedItem.title} className="w-full max-w-[300px] rounded-lg" />
                </div>
              )}

              {/* 截图预览 */}
              {selectedItem.screenshots && selectedItem.screenshots.length > 0 && (
                <div>
                  <h3 className="text-sm text-neutral-400 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    截图预览
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedItem.screenshots.map((screenshot, idx) => (
                      <img key={idx} src={screenshot} alt={`截图 ${idx + 1}`} className="w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              )}

              {/* 基本信息 */}
              <div>
                <h3 className="text-sm text-neutral-400 mb-3">基本信息</h3>
                <div className="space-y-3 bg-neutral-800/50 rounded-lg p-4">
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">类型</div>
                    <div className="text-neutral-200">{getTypeLabel(selectedItem.type)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">标题</div>
                    <div className="text-neutral-200">{selectedItem.title}</div>
                  </div>
                  {selectedItem.category && (
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">分类</div>
                      <div className="text-neutral-200">{selectedItem.category}</div>
                    </div>
                  )}
                  {selectedItem.year && (
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">年份</div>
                      <div className="text-neutral-200">{selectedItem.year}</div>
                    </div>
                  )}
                  {selectedItem.description && (
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">描述</div>
                      <div className="text-neutral-200">{selectedItem.description}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">可见性</div>
                    <div className="text-neutral-200">{getVisibilityLabel(selectedItem.visibility)}</div>
                  </div>
                  {selectedItem.rating && (
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">评分</div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-neutral-200">{selectedItem.rating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 提交人信息 */}
              <div>
                <h3 className="text-sm text-neutral-400 mb-3">提交人信息</h3>
                <div className="space-y-3 bg-neutral-800/50 rounded-lg p-4">
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">用户名</div>
                    <div className="text-neutral-200">{selectedItem.submitter}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">信誉分</div>
                    <div className={`${selectedItem.submitterReputation >= 90 ? 'text-green-400' :
                      selectedItem.submitterReputation >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                      {selectedItem.submitterReputation} / 100
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">提交时间</div>
                    <div className="text-neutral-200">{selectedItem.submitDate}</div>
                  </div>
                </div>
              </div>

              {/* 审核建议 */}
              <div>
                <h3 className="text-sm text-neutral-400 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  审核建议
                </h3>
                <div className="space-y-3">
                  {/* 缺失字段警告 */}
                  {selectedItem.missingFields && selectedItem.missingFields.length > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-orange-400 mb-2">缺失以下必填字段</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.missingFields.map((field, idx) => (
                              <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 敏感词警告 */}
                  {selectedItem.sensitiveWords && selectedItem.sensitiveWords.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-red-400 mb-2">检测到敏感词汇</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.sensitiveWords.map((word, idx) => (
                              <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 信誉评估 */}
                  <div className={`border rounded-lg p-4 ${selectedItem.submitterReputation >= 90
                    ? 'bg-green-500/10 border-green-500/30'
                    : selectedItem.submitterReputation >= 70
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    <div className="flex items-start gap-3">
                      <User className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedItem.submitterReputation >= 90 ? 'text-green-400' :
                        selectedItem.submitterReputation >= 70 ? 'text-yellow-400' : 'text-red-400'
                        }`} />
                      <div>
                        <div className={`text-sm mb-1 ${selectedItem.submitterReputation >= 90 ? 'text-green-400' :
                          selectedItem.submitterReputation >= 70 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                          提交人信誉评估
                        </div>
                        <div className="text-xs text-neutral-400">
                          {selectedItem.submitterReputation >= 90
                            ? '高信誉用户，历史提交质量优秀，建议优先审核通过'
                            : selectedItem.submitterReputation >= 70
                              ? '中等信誉用户，需要仔细审核内容质量'
                              : '低信誉用户，建议严格审核并关注内容合规性'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 质量评估 */}
                  {(!selectedItem.missingFields || selectedItem.missingFields.length === 0) &&
                    (!selectedItem.sensitiveWords || selectedItem.sensitiveWords.length === 0) && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm text-green-400 mb-1">内容质量良好</div>
                            <div className="text-xs text-neutral-400">
                              所有必填字段完整，未检测到违规内容，建议通过审核
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* 已有备注 */}
              {selectedItem.notes && (
                <div>
                  <h3 className="text-sm text-neutral-400 mb-3">审核备注</h3>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-300 text-sm">{selectedItem.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 操作区 */}
            {selectedItem.status === 'pending' && (
              <div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-700 p-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(selectedItem, 'approve')}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    通过审核
                  </button>
                  <button
                    onClick={() => handleAction(selectedItem, 'reject')}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    驳回申请
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 操作确认模态框 */}
      {actionType && selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-neutral-700">
              <h2 className="text-xl text-neutral-100">
                {actionType === 'approve' ? '通过审核' : '驳回申请'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-neutral-800/50 rounded-lg p-4">
                <div className="text-sm text-neutral-400 mb-2">操作项目</div>
                <div className="text-neutral-200">{selectedItem.title}</div>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">
                  审核备注 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={actionType === 'approve' ? '请输入通过理由...' : '请输入驳回原因...'}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-neutral-500 mt-1 text-right">
                  {actionNotes.length} / 500
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-700 flex gap-3">
              <button
                onClick={cancelAction}
                className="flex-1 py-2.5 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-all"
              >
                取消
              </button>
              <button
                onClick={confirmAction}
                disabled={actionNotes.trim().length === 0}
                className={`flex-1 py-2.5 rounded-lg transition-all ${actionNotes.trim().length === 0
                  ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  : actionType === 'approve'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/25'
                  }`}
              >
                确认{actionType === 'approve' ? '通过' : '驳回'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 审核历史模态框 */}
      {showHistory && selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <h2 className="text-xl text-neutral-100">审核历史</h2>
              <button
                onClick={() => {
                  setShowHistory(false);
                  setSelectedItem(null);
                }}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                {historyLoading ? (
                  <div className="text-center py-8 text-neutral-400">加载历史中…</div>
                ) : historyItems.length > 0 ? (
                  historyItems.map((history) => (
                    <div key={history.id} className="bg-neutral-800/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-neutral-400" />
                          <div>
                            <div className="text-neutral-200">{history.reviewer}</div>
                            <div className="text-xs text-neutral-500">{history.date}</div>
                          </div>
                        </div>
                        {history.action === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            <Check className="w-3 h-3" />
                            已通过
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                            <X className="w-3 h-3" />
                            已驳回
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-neutral-300 bg-neutral-900/50 rounded p-3">{history.notes}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-400">暂无审核历史</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
