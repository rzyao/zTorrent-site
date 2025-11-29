import { useState } from 'react';
import {
  Ticket,
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
  Send,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Upload,
  Download,
  Flag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TicketMessage {
  id: string;
  author: string;
  authorRole: 'user' | 'staff';
  content: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  title: string;
  category: 'technical' | 'account' | 'resource' | 'report' | 'other';
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export function TicketsPage() {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newReply, setNewReply] = useState('');

  // 新工单表单
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('technical');
  const [newTicketPriority, setNewTicketPriority] = useState('normal');
  const [newTicketContent, setNewTicketContent] = useState('');

  const tickets: Ticket[] = [
    {
      id: 'TK-2024-001',
      title: '下载速度异常缓慢',
      category: 'technical',
      status: 'processing',
      priority: 'high',
      createdAt: '2024-11-26 10:30',
      updatedAt: '2024-11-26 14:15',
      messages: [
        {
          id: '1',
          author: 'UserName',
          authorRole: 'user',
          content:
            '您好，我最近下载种子的速度非常慢，平均只有100KB/s，但我的宽带是1000M的。已经尝试更换端口和重启客户端，问题依然存在。请帮忙查看一下是什么原因。',
          timestamp: '2024-11-26 10:30',
        },
        {
          id: '2',
          author: 'TechSupport',
          authorRole: 'staff',
          content:
            '您好，我们已经收到您的反馈。请问您使用的是什么BT客户端？另外，您的IP地址是否是动态IP？请提供更多信息以便我们进一步排查问题。',
          timestamp: '2024-11-26 12:45',
        },
        {
          id: '3',
          author: 'UserName',
          authorRole: 'user',
          content:
            '我使用的是qBittorrent 4.6.0版本，IP地址是固定的。另外我发现只有从你们站点下载的种子速度慢，其他站点的种子速度正常。',
          timestamp: '2024-11-26 13:20',
        },
        {
          id: '4',
          author: 'TechSupport',
          authorRole: 'staff',
          content:
            '感谢您提供的详细信息。我们检查发现您的账号触发了下载限速机制，这可能是因为您的分享率略低。建议您先上传一些种子提升分享率，或者下载一些FREE标记的种子。我们已经临时解除了限速，请重新尝试下载。',
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
      messages: [
        {
          id: '1',
          author: 'UserName2',
          authorRole: 'user',
          content:
            '我的账号突然无法登录了，提示"账号已被禁用"。我没有违反任何规则，请帮忙查看一下。',
          timestamp: '2024-11-25 15:20',
        },
        {
          id: '2',
          author: 'AdminTeam',
          authorRole: 'staff',
          content:
            '您好，经查询您的账号因为连续H&R（下载后不做种）被系统自动禁用。我们看到您有5个种子下载后立即停止了做种，这违反了站点规则。请承诺以后遵守规则，我们可以解除禁用。',
          timestamp: '2024-11-25 16:00',
        },
        {
          id: '3',
          author: 'UserName2',
          authorRole: 'user',
          content:
            '非常抱歉，我是新手不太了解规则。我保证以后会遵守做种规则，下载后至少保持72小时。',
          timestamp: '2024-11-25 16:30',
        },
        {
          id: '4',
          author: 'AdminTeam',
          authorRole: 'staff',
          content:
            '好的，我们已经解除了您的账号禁用。请务必遵守站点规则，特别注意H&R规则。建议您阅读一下站点规则页面，避免再次违规。',
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
            '种子ID #12345 的信息有误，标题写的是"星际穿越"，但实际下载的是"盗梦空间"。建议修正或删除这个种子。',
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
            '用户"BadUser123"在论坛中多次发布广告信息和不当内容，严重影响社区环境。请管理员处理。',
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
          content:
            '我兑换了1000魔力值购买VIP，但是VIP状态还没有生效。',
          timestamp: '2024-11-24 14:00',
        },
        {
          id: '2',
          author: 'SupportTeam',
          authorRole: 'staff',
          content:
            '您好，VIP生效需要几分钟时间，请退出后重新登录。如果还是没有生效，请告诉我们。',
          timestamp: '2024-11-24 14:30',
        },
        {
          id: '3',
          author: 'UserName5',
          authorRole: 'user',
          content: '已经生效了，谢谢！',
          timestamp: '2024-11-24 15:00',
        },
        {
          id: '4',
          author: 'SupportTeam',
          authorRole: 'staff',
          content: '不客气，祝您使用愉快！工单已关闭。',
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

  const handleCreateTicket = () => {
    // 这里处理创建工单的逻辑
    console.log('创建工单:', {
      title: newTicketTitle,
      category: newTicketCategory,
      priority: newTicketPriority,
      content: newTicketContent,
    });
    // 重置表单
    setNewTicketTitle('');
    setNewTicketCategory('technical');
    setNewTicketPriority('normal');
    setNewTicketContent('');
    setView('list');
  };

  const handleSendReply = () => {
    if (!newReply.trim() || !selectedTicket) return;
    console.log('发送回复:', newReply);
    setNewReply('');
  };

  // 创建工单视图
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl">创建工单</h1>
                <p className="text-neutral-400 text-sm mt-1">
                  填写工单信息，我们会尽快为您处理
                </p>
              </div>
            </div>
            <Button
              onClick={() => setView('list')}
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            >
              返回列表
            </Button>
          </div>

          {/* 创建表单 */}
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-8">
            <div className="space-y-6">
              {/* 标题 */}
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  工单标题 <span className="text-red-400">*</span>
                </label>
                <Input
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  placeholder="简要描述您的问题"
                  className="bg-neutral-900/50 border-neutral-700 text-white"
                />
              </div>

              {/* 分类和优先级 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    问题分类 <span className="text-red-400">*</span>
                  </label>
                  <Select
                    value={newTicketCategory}
                    onValueChange={setNewTicketCategory}
                  >
                    <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {config.icon}
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-neutral-300 text-sm mb-2 block">
                    优先级
                  </label>
                  <Select
                    value={newTicketPriority}
                    onValueChange={setNewTicketPriority}
                  >
                    <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 详细描述 */}
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  详细描述 <span className="text-red-400">*</span>
                </label>
                <Textarea
                  value={newTicketContent}
                  onChange={(e) => setNewTicketContent(e.target.value)}
                  placeholder="请详细描述您遇到的问题，包括相关的错误信息、截图等..."
                  className="bg-neutral-900/50 border-neutral-700 text-white min-h-[200px]"
                />
                <p className="text-neutral-500 text-xs mt-2">
                  提供详细信息有助于我们更快地解决您的问题
                </p>
              </div>

              {/* 附件（占位符） */}
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  附件（可选）
                </label>
                <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
                  <Paperclip className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-neutral-400 text-sm">
                    点击上传截图或相关文件
                  </p>
                  <p className="text-neutral-600 text-xs mt-1">
                    支持 JPG、PNG、PDF，最大 10MB
                  </p>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  onClick={() => setView('list')}
                  variant="outline"
                  className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  取消
                </Button>
                <Button
                  onClick={handleCreateTicket}
                  disabled={!newTicketTitle || !newTicketContent}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                >
                  提交工单
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 工单详情视图
  if (view === 'detail' && selectedTicket) {
    const categoryInfo = categoryConfig[selectedTicket.category];
    const statusInfo = statusConfig[selectedTicket.status];
    const priorityInfo = priorityConfig[selectedTicket.priority];

    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl">{selectedTicket.id}</h1>
                <p className="text-neutral-400 text-sm mt-1">
                  {selectedTicket.title}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setView('list');
                setSelectedTicket(null);
              }}
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            >
              返回列表
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：消息列表 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 工单信息卡片 */}
              <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                <div className="flex flex-wrap gap-3">
                  <Badge className={`${categoryInfo.bgColor} ${categoryInfo.color}`}>
                    {categoryInfo.icon}
                    <span className="ml-1">{categoryInfo.label}</span>
                  </Badge>
                  <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.label}</span>
                  </Badge>
                  <Badge className={`${priorityInfo.bgColor} ${priorityInfo.color}`}>
                    优先级：{priorityInfo.label}
                  </Badge>
                </div>
              </div>

              {/* 消息记录 */}
              <div className="space-y-4">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border ${message.authorRole === 'staff'
                      ? 'border-amber-500/30'
                      : 'border-neutral-700/50'
                      } p-6`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center flex-shrink-0">
                        {message.authorRole === 'staff' ? (
                          <Shield className="w-5 h-5 text-amber-400" />
                        ) : (
                          <User className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`${message.authorRole === 'staff'
                              ? 'text-amber-400'
                              : 'text-neutral-300'
                              }`}
                          >
                            {message.author}
                          </span>
                          {message.authorRole === 'staff' && (
                            <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                              管理组
                            </Badge>
                          )}
                          <span className="text-neutral-500 text-xs">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-neutral-300 leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 回复区域 */}
              {selectedTicket.status !== 'closed' && (
                <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                  <h3 className="text-white mb-4">添加回复</h3>
                  <Textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="输入您的回复..."
                    className="bg-neutral-900/50 border-neutral-700 text-white min-h-[120px] mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="border-neutral-700 text-neutral-400 hover:bg-neutral-800"
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      添加附件
                    </Button>
                    <Button
                      onClick={handleSendReply}
                      disabled={!newReply.trim()}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      发送回复
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧：工单详情 */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                <h3 className="text-white mb-4">工单详情</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">工单编号</div>
                    <div className="text-white">{selectedTicket.id}</div>
                  </div>
                  <Separator className="bg-neutral-700/50" />
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">创建时间</div>
                    <div className="text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      {selectedTicket.createdAt}
                    </div>
                  </div>
                  <Separator className="bg-neutral-700/50" />
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">最后更新</div>
                    <div className="text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      {selectedTicket.updatedAt}
                    </div>
                  </div>
                  <Separator className="bg-neutral-700/50" />
                  <div>
                    <div className="text-neutral-400 text-sm mb-1">消息数量</div>
                    <div className="text-white flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-neutral-500" />
                      {selectedTicket.messages.length} 条消息
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              {selectedTicket.status !== 'closed' && (
                <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                  <h3 className="text-white mb-4">操作</h3>
                  <div className="space-y-3">
                    {selectedTicket.status === 'resolved' && (
                      <Button
                        className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        variant="outline"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        确认已解决
                      </Button>
                    )}
                    <Button
                      className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      variant="outline"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      关闭工单
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 工单列表视图
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1600px] mx-auto px-4 md:px-4 py-4">
        {/* 页面标题 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">我的工单</h1>
              <p className="text-neutral-400 text-sm mt-1">
                提交问题、查看进度、管理工单
              </p>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <Ticket className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
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
    </div>
  );
}
