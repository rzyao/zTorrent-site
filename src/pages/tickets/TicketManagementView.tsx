import { useState } from 'react';
import {
  Settings,
  Search,
  Filter,
  Calendar,
  User,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Flag,
  Info,
  ChevronDown,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TicketManagementView() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssigned, setFilterAssigned] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟所有工单（包括其他用户的）
  const allTickets = [
    {
      id: 'TK-2024-001',
      title: '下载速度异常缓慢',
      user: 'UserName',
      category: 'technical',
      status: 'processing',
      priority: 'high',
      assignedTo: 'TechSupport',
      createdAt: '2024-11-26 10:30',
      messagesCount: 4,
    },
    {
      id: 'TK-2024-002',
      title: '账号无法登录',
      user: 'UserName2',
      category: 'account',
      status: 'resolved',
      priority: 'urgent',
      assignedTo: 'AdminTeam',
      createdAt: '2024-11-25 15:20',
      messagesCount: 4,
    },
    {
      id: 'TK-2024-003',
      title: '种子信息错误',
      user: 'UserName3',
      category: 'resource',
      status: 'pending',
      priority: 'normal',
      assignedTo: null,
      createdAt: '2024-11-26 09:15',
      messagesCount: 1,
    },
    {
      id: 'TK-2024-004',
      title: '举报恶意用户',
      user: 'UserName4',
      category: 'report',
      status: 'pending',
      priority: 'high',
      assignedTo: null,
      createdAt: '2024-11-26 08:30',
      messagesCount: 1,
    },
    {
      id: 'TK-2024-005',
      title: '魔力值兑换问题',
      user: 'UserName5',
      category: 'other',
      status: 'closed',
      priority: 'low',
      assignedTo: 'SupportTeam',
      createdAt: '2024-11-24 14:00',
      messagesCount: 4,
    },
    {
      id: 'TK-2024-006',
      title: '无法上传种子文件',
      user: 'TesterUser',
      category: 'technical',
      status: 'pending',
      priority: 'normal',
      assignedTo: null,
      createdAt: '2024-11-26 16:20',
      messagesCount: 1,
    },
    {
      id: 'TK-2024-007',
      title: '积分计算错误',
      user: 'PowerUser',
      category: 'account',
      status: 'processing',
      priority: 'normal',
      assignedTo: 'AdminTeam',
      createdAt: '2024-11-26 11:45',
      messagesCount: 3,
    },
  ];

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
    low: { label: '低', color: 'text-neutral-400' },
    normal: { label: '中', color: 'text-blue-400' },
    high: { label: '高', color: 'text-orange-400' },
    urgent: { label: '紧急', color: 'text-red-400' },
  };

  const filteredTickets = allTickets.filter((ticket) => {
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    if (filterAssigned !== 'all') {
      if (filterAssigned === 'unassigned' && ticket.assignedTo !== null)
        return false;
      if (filterAssigned !== 'unassigned' && ticket.assignedTo !== filterAssigned)
        return false;
    }
    if (
      searchQuery &&
      !ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ticket.user.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const stats = {
    total: allTickets.length,
    unassigned: allTickets.filter((t) => !t.assignedTo).length,
    pending: allTickets.filter((t) => t.status === 'pending').length,
    urgent: allTickets.filter((t) => t.priority === 'urgent').length,
  };

  return (
    <div>
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">全部工单</span>
            <Settings className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-white text-3xl">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-400">未分配</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-white text-3xl">{stats.unassigned}</div>
        </div>
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-400">待处理</span>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-white text-3xl">{stats.pending}</div>
        </div>
        <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-400">紧急</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-white text-3xl">{stats.urgent}</div>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索工单、用户..."
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
          <Select value={filterAssigned} onValueChange={setFilterAssigned}>
            <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
              <Users className="w-4 h-4 mr-2" />
              <SelectValue placeholder="分配状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部工单</SelectItem>
              <SelectItem value="unassigned">未分配</SelectItem>
              <SelectItem value="TechSupport">TechSupport</SelectItem>
              <SelectItem value="AdminTeam">AdminTeam</SelectItem>
              <SelectItem value="SupportTeam">SupportTeam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 工单列表 */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-12 text-center">
            <MessageCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">暂无工单</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const categoryInfo = categoryConfig[ticket.category as keyof typeof categoryConfig];
            const statusInfo = statusConfig[ticket.status as keyof typeof statusConfig];
            const priorityInfo = priorityConfig[ticket.priority as keyof typeof priorityConfig];

            return (
              <div
                key={ticket.id}
                className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 hover:border-amber-500/30 transition-all cursor-pointer group"
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
                      <Badge className="bg-neutral-700/50 text-neutral-300 text-xs">
                        <User className="w-3 h-3 mr-1" />
                        {ticket.user}
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
                      <Badge className={`${priorityInfo.color} bg-neutral-700/30 text-xs`}>
                        优先级: {priorityInfo.label}
                      </Badge>
                      {ticket.assignedTo ? (
                        <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {ticket.assignedTo}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400 text-xs">
                          未分配
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
                        {ticket.messagesCount} 条消息
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!ticket.assignedTo && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('分配工单:', ticket.id);
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        <Users className="w-4 h-4 mr-1" />
                        分配
                      </Button>
                    )}
                    <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
