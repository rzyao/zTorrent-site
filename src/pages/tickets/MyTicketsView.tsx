import { useState } from 'react';
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
import { TicketDetailView } from './TicketDetailView';
import { CreateTicketView } from './CreateTicketView';

interface TicketMessage {
  id: string;
  author: string;
  authorRole: 'user' | 'staff';
  avatar?: string;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  category: 'technical' | 'account' | 'resource' | 'report' | 'other';
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: TicketMessage[];
}

export function MyTicketsView() {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tickets: Ticket[] = [
    {
      id: 'TK-2024-001',
      title: '下载速度异常缓慢',
      category: 'technical',
      status: 'processing',
      priority: 'high',
      createdAt: '2024-11-26 10:30',
      updatedAt: '2024-11-26 14:15',
      assignedTo: 'TechSupport',
      messages: [
        {
          id: '1',
          author: 'UserName',
          authorRole: 'user',
          content:
            '您好,我最近下载种子的速度非常慢,平均只有100KB/s,但我的宽带是1000M的。已经尝试更换端口和重启客户端,问题依然存在。请帮忙查看一下是什么原因。',
          timestamp: '2024-11-26 10:30',
        },
        {
          id: '2',
          author: 'TechSupport',
          authorRole: 'staff',
          content:
            '您好,我们已经收到您的反馈。请问您使用的是什么BT客户端?另外,您的IP地址是否是动态IP?请提供更多信息以便我们进一步排查问题。',
          timestamp: '2024-11-26 12:45',
        },
        {
          id: '3',
          author: 'UserName',
          authorRole: 'user',
          content:
            '我使用的是qBittorrent 4.6.0版本,IP地址是固定的。另外我发现只有从你们站点下载的种子速度慢,其他站点的种子速度正常。',
          timestamp: '2024-11-26 13:20',
        },
        {
          id: '4',
          author: 'TechSupport',
          authorRole: 'staff',
          content:
            '感谢您提供的详细信息。我们检查发现您的账号触发了下载限速机制,这可能是因为您的分享率略低。建议您先上传一些种子提升分享率,或者下载一些FREE标记的种子。我们已经临时解除了限速,请重新尝试下载。',
          timestamp: '2024-11-26 14:15',
        },
      ],
    },
    {
      id: 'TK-2024-002',
      title: '账号无法登录',
      category: 'account',
      status: 'resolved',
      priority: 'urgent',
      createdAt: '2024-11-25 15:20',
      updatedAt: '2024-11-25 16:45',
      assignedTo: 'AdminTeam',
      messages: [
        {
          id: '1',
          author: 'UserName2',
          authorRole: 'user',
          content:
            '我的账号突然无法登录了,提示"账号已被禁用"。我没有违反任何规则,请帮忙查看一下。',
          timestamp: '2024-11-25 15:20',
        },
        {
          id: '2',
          author: 'AdminTeam',
          authorRole: 'staff',
          content:
            '您好,经查询您的账号因为连续H&R(下载后不做种)被系统自动禁用。我们看到您有5个种子下载后立即停止了做种,这违反了站点规则。请承诺以后遵守规则,我们可以解除禁用。',
          timestamp: '2024-11-25 16:00',
        },
        {
          id: '3',
          author: 'UserName2',
          authorRole: 'user',
          content:
            '非常抱歉,我是新手不太了解规则。我保证以后会遵守做种规则,下载后至少保持72小时。',
          timestamp: '2024-11-25 16:30',
        },
        {
          id: '4',
          author: 'AdminTeam',
          authorRole: 'staff',
          content:
            '好的,我们已经解除了您的账号禁用。请务必遵守站点规则,特别注意H&R规则。建议您阅读一下站点规则页面,避免再次违规。',
          timestamp: '2024-11-25 16:45',
        },
      ],
    },
    {
      id: 'TK-2024-003',
      title: '种子信息错误',
      category: 'resource',
      status: 'pending',
      priority: 'normal',
      createdAt: '2024-11-26 09:15',
      updatedAt: '2024-11-26 09:15',
      messages: [
        {
          id: '1',
          author: 'UserName3',
          authorRole: 'user',
          content:
            '种子ID #12345 的信息有误,标题写的是"星际穿越",但实际下载的是"盗梦空间"。建议修正或删除这个种子。',
          timestamp: '2024-11-26 09:15',
        },
      ],
    },
    {
      id: 'TK-2024-004',
      title: '举报恶意用户',
      category: 'report',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-11-26 08:30',
      updatedAt: '2024-11-26 08:30',
      messages: [
        {
          id: '1',
          author: 'UserName4',
          authorRole: 'user',
          content:
            '用户"BadUser123"在论坛中多次发布广告信息和不当内容,严重影响社区环境。请管理员处理。',
          timestamp: '2024-11-26 08:30',
        },
      ],
    },
    {
      id: 'TK-2024-005',
      title: '魔力值兑换问题',
      category: 'other',
      status: 'closed',
      priority: 'low',
      createdAt: '2024-11-24 14:00',
      updatedAt: '2024-11-24 15:30',
      messages: [
        {
          id: '1',
          author: 'UserName5',
          authorRole: 'user',
          content: '我兑换了1000魔力值购买VIP,但是VIP状态还没有生效。',
          timestamp: '2024-11-24 14:00',
        },
        {
          id: '2',
          author: 'SupportTeam',
          authorRole: 'staff',
          content:
            '您好,VIP生效需要几分钟时间,请退出后重新登录。如果还是没有生效,请告诉我们。',
          timestamp: '2024-11-24 14:30',
        },
        {
          id: '3',
          author: 'UserName5',
          authorRole: 'user',
          content: '已经生效了,谢谢!',
          timestamp: '2024-11-24 15:00',
        },
        {
          id: '4',
          author: 'SupportTeam',
          authorRole: 'staff',
          content: '不客气,祝您使用愉快!工单已关闭。',
          timestamp: '2024-11-24 15:30',
        },
      ],
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

  if (view === 'detail' && selectedTicket) {
    return (
      <TicketDetailView
        ticket={selectedTicket}
        onBack={() => {
          setView('list');
          setSelectedTicket(null);
        }}
      />
    );
  }

  // 工单列表视图
  return (
    <div>
      {/* 操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-neutral-400 text-sm">
          共 {filteredTickets.length} 个工单
        </div>
        <Button
          onClick={() => setView('create')}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          创建工单
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = tickets.filter((t) => t.status === key).length;
          return (
            <div
              key={key}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6"
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

      {/* 筛选和搜索 */}
      <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 mb-6">
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

      {/* 工单列表 */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-12 text-center">
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
                  setSelectedTicket(ticket);
                  setView('detail');
                }}
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
                        {ticket.messages.length} 条消息
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        更新于 {ticket.updatedAt}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
