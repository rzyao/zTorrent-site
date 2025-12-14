import { useState } from 'react';
import { useHallQuery } from '@/pages/Requests/hooks/useHallQuery';
import { useRequestActions } from '@/pages/Requests/hooks/useRequestActions';
import { Search, SlidersHorizontal, TrendingUp, Clock, MessageSquare, ThumbsUp, Award, CheckCircle2, XCircle, AlertCircle, Bell } from 'lucide-react';

// 后端返回的 Request 结构可能比 UI 更丰富，这里定义最小展示模型并提供映射函数
interface UiRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  bounty: number;
  additionalBounty: number;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  deadline: string;
  author: string;
  commentsCount: number;
  votesCount: number;
  claimedBy?: string;
}

type SortOption = 'latest' | 'bounty' | 'comments' | 'votes';
type StatusFilter = 'all' | 'active' | 'completed' | 'expired';

export function RequestsHall() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { items, isLoading, error } = useHallQuery({
    keyword: searchQuery,
    sortBy,
    status: statusFilter,
    category: categoryFilter,
  });
  const actions = useRequestActions();

  const categories = ['全部', '电影', '剧集', '纪录片', '音乐', '动漫', '其他'];

  const filteredRequests = (items as any[])
    .map((r) => ({
      id: String(r?.id ?? r?._id ?? ''),
      title: String(r?.title ?? ''),
      description: String(r?.description ?? ''),
      category: String(r?.category ?? '其他'),
      bounty: Number(r?.bounty ?? 0),
      additionalBounty: Number(r?.additionalBounty ?? 0),
      status: (['active', 'completed', 'expired'].includes(String(r?.status)) ? String(r?.status) : 'active') as UiRequest['status'],
      createdAt: String(r?.createdAt ?? r?.created_at ?? ''),
      deadline: String(r?.deadlineAt ?? r?.deadline ?? ''),
      author: String(r?.author?.name ?? r?.author ?? ''),
      commentsCount: Number(r?.counts?.comments ?? r?.commentsCount ?? 0),
      votesCount: Number(r?.counts?.votes ?? r?.votesCount ?? 0),
      claimedBy: r?.claimedBy?.name ?? r?.claimedBy ?? undefined,
    }))
    .filter(req => {
      if (statusFilter !== 'all' && req.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && req.category !== categoryFilter) return false;
      if (searchQuery && !req.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !req.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'bounty':
          return (b.bounty + b.additionalBounty) - (a.bounty + a.additionalBounty);
        case 'comments':
          return b.commentsCount - a.commentsCount;
        case 'votes':
          return b.votesCount - a.votesCount;
        case 'latest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getStatusConfig = (status: UiRequest['status']) => {
    // 兼容后端更多状态，未覆盖的状态一律视为进行中
    switch (status) {
      case 'active':
        return {
          icon: AlertCircle,
          text: '进行中',
          color: 'text-amber-400',
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/30'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          text: '已完成',
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30'
        };
      case 'expired':
        return {
          icon: XCircle,
          text: '已过期',
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30'
        };
      default:
        return {
          icon: AlertCircle,
          text: '进行中',
          color: 'text-amber-400',
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/30'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
            <input
              type="text"
              placeholder="搜索求种标题或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-50 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2.5 bg-[#0F171E]/50 border border-amber-500/30 rounded-lg text-amber-50 focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="latest">最新发布</option>
              <option value="bounty">最高悬赏</option>
              <option value="comments">最热评论</option>
              <option value="votes">最多投票</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${showFilters
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-amber-500/20 space-y-3">
            {/* Status Filter */}
            <div>
              <label className="block text-amber-300/80 mb-2">状态筛选</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'active', 'completed', 'expired'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg transition-all ${statusFilter === status
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                      }`}
                  >
                    {status === 'all' ? '全部' : status === 'active' ? '进行中' : status === 'completed' ? '已完成' : '已过期'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-amber-300/80 mb-2">分类筛选</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat === '全部' ? 'all' : cat)}
                    className={`px-4 py-2 rounded-lg transition-all ${categoryFilter === (cat === '全部' ? 'all' : cat)
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误与加载处理 */}
      {error && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 text-red-300">
          {error.message}
        </div>
      )}
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '进行中', value: filteredRequests.filter(r => r.status === 'active').length, color: 'amber' },
          { label: '已完成', value: filteredRequests.filter(r => r.status === 'completed').length, color: 'green' },
          { label: '总悬赏', value: filteredRequests.reduce((sum, r) => sum + r.bounty + r.additionalBounty, 0).toLocaleString(), color: 'orange' },
          { label: '参与用户', value: '127', color: 'amber' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4"
          >
            <div className="text-amber-400/60 mb-1">{stat.label}</div>
            <div className="text-amber-50">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-amber-300/60">
        找到 <span className="text-amber-400">{filteredRequests.length}</span> 条求种信息
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-amber-300/60">加载中...</div>
        ) : filteredRequests.map((request) => {
          const statusConfig = getStatusConfig(request.status);
          const StatusIcon = statusConfig.icon;
          const totalBounty = request.bounty + request.additionalBounty;

          return (
            <div
              key={request.id}
              className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6 hover:border-amber-400/40 transition-all cursor-pointer group"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Content */}
                <div className="flex-1 space-y-3">
                  {/* Title and Status */}
                  <div className="flex items-start gap-3">
                    <h3 className="flex-1 text-amber-50 group-hover:text-amber-300 transition-colors">
                      {request.title}
                    </h3>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusConfig.bg} ${statusConfig.border} border ${statusConfig.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-amber-200/60 line-clamp-2">
                    {request.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-amber-300/60">
                    <span className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400">
                        {request.category}
                      </span>
                    </span>
                    <span>发布者: {request.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {request.createdAt}
                    </span>
                    <span>截止: {request.deadline}</span>
                    {request.claimedBy && (
                      <span className="text-green-400">
                        已认领 by {request.claimedBy}
                      </span>
                    )}
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-amber-300/60 hover:text-amber-300 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      {request.commentsCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-300/60 hover:text-amber-300 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      {request.votesCount}
                    </span>
                  </div>
                </div>

                {/* Bounty Card */}
                <div className="lg:w-48 flex lg:flex-col gap-2">
                  <div className="flex-1 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-400/70 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">悬赏金额</span>
                    </div>
                    <div className="text-amber-50 mb-1">{totalBounty.toLocaleString()}</div>
                    {request.additionalBounty > 0 && (
                      <div className="text-xs text-orange-400">
                        +{request.additionalBounty.toLocaleString()} 追加
                      </div>
                    )}
                  </div>

                  {request.status === 'active' && !request.claimedBy && (
                    <button
                      onClick={() => actions.claim.mutate({ id: request.id })}
                      disabled={actions.claim.isPending}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <TrendingUp className="w-4 h-4" />
                      {actions.claim.isPending ? '认领中...' : '立即认领'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && filteredRequests.length === 0 && (
        <div className="text-center py-12 text-amber-300/60">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>暂无符合条件的求种信息</p>
        </div>
      )}
    </div>
  );
}
