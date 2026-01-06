import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Clock,
  Calendar,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Shield,
  User as UserIcon,
  AlertCircle,
  Download,
  Flag,
  Info,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTickets } from "@/modules/app/pages/Tickets/hooks/useTickets";

interface TicketDetailViewProps {
  ticketId: string;
  onBack: () => void;
}

export function TicketDetailView({ ticketId, onBack }: TicketDetailViewProps) {
  const [newReply, setNewReply] = useState("");
  const {
    getDetail,
    detail,
    isLoading,
    assignTicket,
    replyTicket,
    markResolved,
    confirmResolved,
    closeTicket,
  } = useTickets();
  const assignedStaff = (detail?.assignedTo as string) || "unassigned";

  useEffect(() => {
    getDetail(ticketId);
  }, [ticketId]);

  const categoryConfig = {
    technical: {
      label: "技术问题",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    account: {
      label: "账号问题",
      icon: <UserIcon className="w-4 h-4" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    resource: {
      label: "资源问题",
      icon: <Download className="w-4 h-4" />,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    report: {
      label: "投诉举报",
      icon: <Flag className="w-4 h-4" />,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    other: {
      label: "其他问题",
      icon: <Info className="w-4 h-4" />,
      color: "text-neutral-400",
      bgColor: "bg-neutral-500/20",
    },
  };

  const statusConfig = {
    pending: {
      label: "待处理",
      icon: <Clock className="w-4 h-4" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    processing: {
      label: "处理中",
      icon: <MessageCircle className="w-4 h-4" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    resolved: {
      label: "已解决",
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    closed: {
      label: "已关闭",
      icon: <XCircle className="w-4 h-4" />,
      color: "text-neutral-400",
      bgColor: "bg-neutral-500/20",
    },
  };

  const priorityConfig = {
    low: {
      label: "低",
      color: "text-neutral-400",
      bgColor: "bg-neutral-500/20",
    },
    normal: { label: "中", color: "text-blue-400", bgColor: "bg-blue-500/20" },
    high: {
      label: "高",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    urgent: { label: "紧急", color: "text-red-400", bgColor: "bg-red-500/20" },
  };

  const categoryInfo = detail
    ? categoryConfig[detail.category as keyof typeof categoryConfig]
    : categoryConfig.technical;
  const statusInfo = detail
    ? statusConfig[detail.status as keyof typeof statusConfig]
    : statusConfig.pending;
  const priorityInfo = detail
    ? priorityConfig[detail.priority as keyof typeof priorityConfig]
    : priorityConfig.normal;

  const staffMembers = [
    { id: "1", name: "TechSupport", role: "技术支持" },
    { id: "2", name: "AdminTeam", role: "管理员" },
    { id: "3", name: "SupportTeam", role: "客服" },
  ];

  const handleSendReply = async () => {
    if (!newReply.trim() || !detail?.id) return;
    await replyTicket({ ticketId: detail.id, content: newReply });
    setNewReply("");
    await getDetail(ticketId);
  };

  const handleAssignStaff = async (staffName: string) => {
    if (!detail?.id) return;
    const assignee = staffName === "unassigned" ? null : staffName;
    await assignTicket({ ticketId: detail.id, assignee });
    await getDetail(ticketId);
  };

  return (
    <div>
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
            <h2 className="text-white text-2xl mb-4">{detail?.title || ""}</h2>
            <div className="flex flex-wrap gap-3">
              <Badge
                className={`${categoryInfo.bgColor} ${categoryInfo.color}`}
              >
                {categoryInfo.icon}
                <span className="ml-1">{categoryInfo.label}</span>
              </Badge>
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
              </Badge>
              <Badge
                className={`${priorityInfo.bgColor} ${priorityInfo.color}`}
              >
                优先级：{priorityInfo.label}
              </Badge>
              <Badge className="bg-neutral-700/50 text-neutral-300">
                {detail?.id}
              </Badge>
            </div>
          </div>

          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
            <h3 className="text-white mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-amber-400" />
              对话记录
            </h3>

            <div className="space-y-4 mb-6">
              {(detail?.messages ?? []).map((message: any) => {
                const isStaff = message.authorRole === "staff";
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isStaff ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isStaff
                          ? "bg-linear-to-br from-amber-500 to-orange-600"
                          : "bg-linear-to-br from-neutral-600 to-neutral-700"
                      }`}
                    >
                      {isStaff ? (
                        <Shield className="w-5 h-5 text-white" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-white" />
                      )}
                    </div>

                    <div
                      className={`flex-1 max-w-[80%] ${
                        isStaff ? "" : "flex flex-col items-end"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 mb-1 ${
                          isStaff ? "" : "flex-row-reverse"
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            isStaff ? "text-amber-400" : "text-neutral-300"
                          }`}
                        >
                          {message.author}
                        </span>
                        {isStaff && (
                          <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                            管理组
                          </Badge>
                        )}
                        <span className="text-neutral-500 text-xs">
                          {message.timestamp}
                        </span>
                      </div>

                      <div
                        className={`rounded-2xl p-4 ${
                          isStaff
                            ? "bg-linear-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20"
                            : "bg-linear-to-br from-neutral-700/50 to-neutral-800/50 border border-neutral-600/30"
                        }`}
                      >
                        <p className="text-neutral-200 leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="bg-neutral-700/50 mb-6" />

            {detail?.status !== "closed" && (
              <div>
                <h4 className="text-neutral-300 mb-3">添加回复</h4>
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
                    className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    发送回复
                  </Button>
                </div>
              </div>
            )}

            {detail?.status === "closed" && (
              <div className="bg-neutral-800/50 rounded-xl p-4 text-center">
                <XCircle className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <p className="text-neutral-400">此工单已关闭,无法继续回复</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
            <h3 className="text-white mb-4">工单详情</h3>
            <div className="space-y-4">
              <div>
                <div className="text-neutral-400 text-sm mb-1">工单编号</div>
                <div className="text-white">{detail?.id}</div>
              </div>
              <Separator className="bg-neutral-700/50" />
              <div>
                <div className="text-neutral-400 text-sm mb-1">创建时间</div>
                <div className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  {detail?.createdAt}
                </div>
              </div>
              <Separator className="bg-neutral-700/50" />
              <div>
                <div className="text-neutral-400 text-sm mb-1">最后更新</div>
                <div className="text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  {detail?.updatedAt}
                </div>
              </div>
              <Separator className="bg-neutral-700/50" />
              <div>
                <div className="text-neutral-400 text-sm mb-1">消息数量</div>
                <div className="text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-neutral-500" />
                  {detail?.messages?.length ?? 0} 条消息
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
            <h3 className="text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              分配工单
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">
                  指派给
                </label>
                <Select value={assignedStaff} onValueChange={handleAssignStaff}>
                  <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                    <SelectValue placeholder="选择管理员" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">未分配</SelectItem>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.name}>
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          <span>{staff.name}</span>
                          <span className="text-neutral-500 text-xs">
                            ({staff.role})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {assignedStaff && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <UserIcon className="w-4 h-4" />
                    <span>已分配给: {assignedStaff}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {detail?.status !== "closed" && (
            <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
              <h3 className="text-white mb-4">操作</h3>
              <div className="space-y-3">
                {detail?.status === "resolved" && (
                  <Button
                    onClick={async () => {
                      if (detail?.id) {
                        await confirmResolved({ ticketId: detail.id });
                        await getDetail(ticketId);
                      }
                    }}
                    className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                    variant="outline"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    确认已解决
                  </Button>
                )}
                {detail?.status !== "resolved" && (
                  <Button
                    onClick={async () => {
                      if (detail?.id) {
                        await markResolved({ ticketId: detail.id });
                        await getDetail(ticketId);
                      }
                    }}
                    className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                    variant="outline"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    标记为已解决
                  </Button>
                )}
                <Button
                  onClick={async () => {
                    if (detail?.id) {
                      await closeTicket({
                        ticketId: detail.id,
                        reason: "用户操作关闭",
                      });
                      await getDetail(ticketId);
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
  );
}
