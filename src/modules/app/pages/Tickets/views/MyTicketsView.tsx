import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageCircle,
  Filter,
  Search,
  Calendar,
  User,
  Download,
  Flag,
  Info,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/modules/app/components/ui/badge';
import { Button } from '@/modules/app/components/ui/button';
import { Input } from '@/modules/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/app/components/ui/select';
import { TicketDetailView } from './TicketDetailView';
import { CreateTicketView } from './CreateTicketView';
import { useTickets } from '@/modules/app/pages/Tickets/hooks/useTickets';

interface TicketMessage {
  id: string;
  author: string;
  authorRole: 'user' | 'staff';
  avatar?: string;
  content: string;
  timestamp: string;
}

export interface TicketItem {
  id: string;
  title: string;
  category: 'technical' | 'account' | 'resource' | 'report' | 'other';
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messagesCount?: number;
}

export function MyTicketsView() {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { listTickets, list, isLoading, error } = useTickets();

  useEffect(() => {
    const status = filterStatus === 'all' ? null : filterStatus;
    const category = filterCategory === 'all' ? null : filterCategory;
    listTickets({ page: 1, pageSize: 20, status, category, keyword: searchQuery });
  }, [filterStatus, filterCategory, searchQuery]);

  const tickets: TicketItem[] = useMemo(() => {
    const items = (list?.items ?? list) || [];
    return Array.isArray(items) ? items : [];
  }, [list]);

  const categoryConfig = {
    technical: {
      label: '技术问题',
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    account: {
      label: '账号问题',
      icon: <User className="w-4 h-4" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    resource: {
      label: '资源问题',
      icon: <Download className="w-4 h-4" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    report: {
      label: '投诉举报',
      icon: <Flag className="w-4 h-4" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    other: {
      label: '其他问题',
      icon: <Info className="w-4 h-4" />,
      color: 'text-neutral-400',
      bgColor: 'bg-neutral-500/20',
    },
  };

  const statusConfig = {
    pending: {
      label: '待处理',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    processing: {
      label: '处理中',
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    resolved: {
      label: '已解决',
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    closed: {
      label: '已关闭',
      icon: <XCircle className="w-4 h-4" />,
      color: 'text-neutral-400',
      bgColor: 'bg-neutral-500/20',
    },
  };

  const priorityConfig = {
    low: { label: '低', color: 'text-neutral-400', bgColor: 'bg-neutral-500/20' },
    normal: { label: '中', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    high: { label: '高', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    urgent: { label: '紧急', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    if (filterCategory !== 'all' && ticket.category !== filterCategory)
      return false;
    if (
      searchQuery &&
      !ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  if (view === 'create') {
    return (
      <CreateTicketView
        onBack={() => setView('list')}
        onCreate={() => setView('list')}
      />
    );
  }

  if (view === 'detail' && selectedTicketId) {
    return (
      <TicketDetailView
        ticketId={selectedTicketId}
        onBack={() => {
          setView('list');
          setSelectedTicketId(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-neutral-400 text-sm">共 {filteredTickets.length} 个工单</div>
        <Button
          onClick={() => setView('create')}
          className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          创建工单
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = tickets.filter((t) => t.status === key).length;
          return (
            <div
              key={key}
              className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`${config.color}`}>{config.label}</span>
                {config.icon}
              </div>
              <div className="text-white text-3xl">{count}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索工单标题或编号..."
              className="bg-neutral-900/50 border-neutral-700 text-white pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="筛选状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="筛选分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-12 text-center">
            <MessageCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">加载中...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-12 text-center">
            <MessageCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">暂无工单</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const categoryInfo = categoryConfig[ticket.category];
            const statusInfo = statusConfig[ticket.status];
            const priorityInfo = priorityConfig[ticket.priority];

            return (
              <div
                key={ticket.id}
                onClick={() => {
                  setSelectedTicketId(ticket.id);
                  setView('detail');
                }}
                className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-white group-hover:text-amber-400 transition-colors">
                        {ticket.title}
                      </h3>
                      <Badge className="bg-neutral-700/50 text-neutral-300 text-xs">
                        {ticket.id}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        className={`${categoryInfo.bgColor} ${categoryInfo.color} text-xs`}
                      >
                        {categoryInfo.icon}
                        <span className="ml-1">{categoryInfo.label}</span>
                      </Badge>
                      <Badge
                        className={`${statusInfo.bgColor} ${statusInfo.color} text-xs`}
                      >
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </Badge>
                      <Badge
                        className={`${priorityInfo.bgColor} ${priorityInfo.color} text-xs`}
                      >
                        {priorityInfo.label}
                      </Badge>
                      {ticket.assignedTo && (
                        <Badge className="bg-neutral-700/50 text-neutral-300 text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {ticket.assignedTo}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-neutral-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {ticket.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {(ticket as any).messagesCount ?? 0} 条消息
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        更新于 {ticket.updatedAt}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-amber-400 transition-colors shrink-0" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
