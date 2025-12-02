import { useEffect, useRef, useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
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
import { TicketsService, type ListTicketsDto, type CreateTicketDto, type UploadAttachmentDto, type ReplyDto, type CloseTicketDto, type ConfirmResolvedDto, type TicketDetailDto } from '@/api';
import { customToast } from '@/hooks/useToast';

interface TicketMessage {
  id: string;
  author: string;
  authorName: string;
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
  useDynamicTitle('工单');
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newReply, setNewReply] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({ pending: 0, processing: 0, resolved: 0, closed: 0 });
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // 新工单表单
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('technical');
  const [newTicketPriority, setNewTicketPriority] = useState('normal');
  const [newTicketContent, setNewTicketContent] = useState('');
  const [createAttachments, setCreateAttachments] = useState<Array<{ attachmentId: string; url: string; name: string; size: number }>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);



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

  function success(resp: any) {
    return resp && (resp.code === 0 || resp.code === 1000);
  }

  async function loadList() {
    setLoadingList(true);
    setListError(null);
    try {
      const body: ListTicketsDto = {
        page,
        pageSize,
        status: filterStatus !== 'all' ? (filterStatus as ListTicketsDto.status) : undefined,
        category: filterCategory !== 'all' ? (filterCategory as ListTicketsDto.category) : undefined,
        keyword: searchQuery || undefined,
      };
      const resp = await TicketsService.ticketsControllerList(body);
      if (success(resp)) {
        const data = resp.data || {};
        const items = (data.items || []) as any[];
        setTickets(
          items.map((t) => ({
            id: t.id,
            title: t.title,
            category: t.category,
            status: t.status,
            priority: t.priority,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            messages: Array.isArray(t.messages) ? t.messages : [],
          }))
        );
      } else {
        setListError(resp?.message || '加载失败');
        customToast.error(resp?.message || '加载工单列表失败');
      }
    } catch (e: any) {
      setListError(e?.message || '网络错误');
      customToast.error(e?.message || '网络错误');
    } finally {
      setLoadingList(false);
    }
  }

  async function loadStats() {
    try {
      const resp = await TicketsService.ticketsControllerStats();
      if (success(resp)) {
        setStats(resp.data || { pending: 0, processing: 0, resolved: 0, closed: 0 });
      }
    } catch { }
  }

  useEffect(() => {
    loadList();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filterStatus, filterCategory, searchQuery]);

  const filteredTickets = tickets;

  async function handleCreateTicket() {
    const body: CreateTicketDto = {
      title: newTicketTitle,
      category: newTicketCategory as CreateTicketDto.category,
      priority: newTicketPriority as CreateTicketDto.priority,
      content: newTicketContent,
      attachments: createAttachments,
      clientRequestId: (self as any)?.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    };
    try {
      const resp = await TicketsService.ticketsControllerCreate(body);
      if (resp && (resp.code === 0 || resp.code === 1000)) {
        customToast.success('工单创建成功');
        const newId = resp?.data?.ticketId as string;
        setNewTicketTitle('');
        setNewTicketCategory('technical');
        setNewTicketPriority('normal');
        setNewTicketContent('');
        setCreateAttachments([]);
        await loadList();
        if (newId) {
          await openDetail(newId);
          setView('detail');
        } else {
          setView('list');
        }
      } else {
        customToast.error(resp?.message || '创建失败');
      }
    } catch (e: any) {
      customToast.error(e?.message || '网络错误');
    }
  }

  async function handleSendReply() {
    if (!newReply.trim() || !selectedTicket) return;
    const body: ReplyDto = {
      ticketId: selectedTicket.id,
      content: newReply,
      attachments: [],
      clientRequestId: (self as any)?.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    };
    try {
      const resp = await TicketsService.ticketsControllerReply(body);
      if (resp && (resp.code === 0 || resp.code === 1000)) {
        customToast.success('回复已发送');
        setNewReply('');
        await openDetail(selectedTicket.id);
      } else {
        customToast.error(resp?.message || '回复失败');
      }
    } catch (e: any) {
      customToast.error(e?.message || '网络错误');
    }
  }

  async function openDetail(ticketId: string) {
    try {
      const body: TicketDetailDto = { ticketId };
      const resp = await TicketsService.ticketsControllerDetail(body);
      if (resp && (resp.code === 0 || resp.code === 1000)) {
        const t = resp.data;
        const normalized: Ticket = {
          id: t.id,
          title: t.title,
          category: t.category,
          status: t.status,
          priority: t.priority,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          messages: Array.isArray(t.messages) ? t.messages : [],
        };
        setSelectedTicket(normalized);
      }
    } catch (e: any) {
      customToast.error(e?.message || '加载详情失败');
    }
  }

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

              {/* 附件 */}
              <div>
                <label className="text-neutral-300 text-sm mb-2 block">
                  附件（可选）
                </label>
                <div
                  className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-neutral-400 text-sm">
                    点击上传截图或相关文件
                  </p>
                  <p className="text-neutral-600 text-xs mt-1">
                    支持 JPG、PNG、PDF，最大 10MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.txt"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const form: any = {
                        purpose: 'create' as UploadAttachmentDto['purpose'],
                        file,
                      };
                      const resp = await TicketsService.ticketsControllerUpload(form as any);
                      if (resp && (resp.code === 0 || resp.code === 1000)) {
                        const att = resp.data;
                        setCreateAttachments((prev) => [
                          ...prev,
                          {
                            attachmentId: att.attachmentId,
                            url: att.url,
                            name: att.name,
                            size: att.size,
                          },
                        ]);
                        customToast.success('附件上传成功');
                      } else {
                        customToast.error(resp?.message || '附件上传失败');
                      }
                    } catch (err: any) {
                      customToast.error(err?.message || '网络错误');
                    } finally {
                      e.target.value = '';
                    }
                  }}
                />
                {createAttachments.length > 0 && (
                  <div className="mt-3 text-neutral-400 text-sm">
                    已添加附件：{createAttachments.map((a) => a.name).join('、')}
                  </div>
                )}
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
                            {message.authorName ?? message.author}
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
                        onClick={async () => {
                          try {
                            const body: ConfirmResolvedDto = { ticketId: selectedTicket.id };
                            const resp = await TicketsService.ticketsControllerConfirmResolved(body);
                            if (resp && (resp.code === 0 || resp.code === 1000)) {
                              customToast.success('工单已结案');
                              await openDetail(selectedTicket.id);
                              await loadList();
                            } else {
                              customToast.error(resp?.message || '结案失败');
                            }
                          } catch (e: any) {
                            customToast.error(e?.message || '网络错误');
                          }
                        }}
                        className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        variant="outline"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        确认已解决
                      </Button>
                    )}
                    <Button
                      onClick={async () => {
                        try {
                          const body: CloseTicketDto = { ticketId: selectedTicket.id, reason: '用户主动关闭' };
                          const resp = await TicketsService.ticketsControllerClose(body);
                          if (resp && (resp.code === 0 || resp.code === 1000)) {
                            customToast.success('工单已关闭');
                            await openDetail(selectedTicket.id);
                            await loadList();
                          } else {
                            customToast.error(resp?.message || '关闭失败');
                          }
                        } catch (e: any) {
                          customToast.error(e?.message || '网络错误');
                        }
                      }}
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
            const count = (stats as any)[key] || 0;
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
                  onClick={async () => {
                    await openDetail(ticket.id);
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
