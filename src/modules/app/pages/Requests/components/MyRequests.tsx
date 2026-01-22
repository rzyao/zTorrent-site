import { useState } from "react";
import { useMyRequestsQuery } from "@/modules/app/pages/Requests/hooks/useMyRequestsQuery";
import { useRequestActions } from "@/modules/app/pages/Requests/hooks/useRequestActions";
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  TrendingUp,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/forum/components/ui/dialog";
import { Input } from "@/modules/forum/components/ui/input";
import { Button } from "@/modules/app/components/ui/button";
import { Label } from "@/modules/forum/components/ui/label";
import { toast } from "sonner";

interface UiMyRequest {
  id: string;
  title: string;
  category: string;
  bounty: number;
  additionalBounty: number;
  status: "draft" | "active" | "completed" | "cancelled" | "expired";
  createdAt: string;
  deadline: string;
  claimedBy?: string;
  pendingSubmissions: number;
  commentsCount: number;
}

type StatusGroup = "ongoing" | "history";

export function MyRequests() {
  const [statusGroup, setStatusGroup] = useState<StatusGroup>("ongoing");
  const { items, stats, isLoading, error } = useMyRequestsQuery();
  const actions = useRequestActions();

  // Bounty Dialog state
  const [bountyOpen, setBountyOpen] = useState(false);
  const [bountyAmount, setBountyAmount] = useState("");
  const [targetRequestId, setTargetRequestId] = useState<string | null>(null);

  const ongoingStatuses = ["draft", "active"];
  const historyStatuses = ["completed", "cancelled", "expired"];

  const mappedRequests: UiMyRequest[] = (items as any[]).map((r) => ({
    id: String(r?.id ?? ""),
    title: String(r?.title ?? ""),
    category: String(r?.category ?? "其他"),
    bounty: Number(r?.bounty ?? 0),
    additionalBounty: Number(r?.additionalBounty ?? 0),
    status: (["draft", "active", "completed", "cancelled", "expired"].includes(String(r?.status))
      ? String(r?.status)
      : "active") as UiMyRequest["status"],
    createdAt: String(r?.createdAt ?? ""),
    deadline: String(r?.deadlineAt ?? r?.deadline ?? ""),
    claimedBy: r?.claimedBy?.name ?? r?.claimedBy ?? undefined,
    pendingSubmissions: Number(r?.pendingSubmissions ?? 0),
    commentsCount: Number(r?.counts?.comments ?? r?.commentsCount ?? 0),
  }));

  const filteredRequests = mappedRequests.filter((req) =>
    statusGroup === "ongoing"
      ? ongoingStatuses.includes(req.status)
      : historyStatuses.includes(req.status),
  );

  const getStatusConfig = (status: UiMyRequest["status"]) => {
    switch (status) {
      case "draft":
        return {
          icon: Clock,
          text: "草稿",
          color: "text-gray-400",
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
        };
      case "active":
        return {
          icon: AlertCircle,
          text: "进行中",
          color: "text-amber-400",
          bg: "bg-amber-500/20",
          border: "border-amber-500/30",
        };
      case "completed":
        return {
          icon: CheckCircle2,
          text: "已完成",
          color: "text-green-400",
          bg: "bg-green-500/20",
          border: "border-green-500/30",
        };
      case "cancelled":
        return {
          icon: XCircle,
          text: "已取消",
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
        };
      case "expired":
        return {
          icon: XCircle,
          text: "已过期",
          color: "text-orange-400",
          bg: "bg-orange-500/20",
          border: "border-orange-500/30",
        };
    }
  };

  const ongoingRequests = mappedRequests.filter((r) => ongoingStatuses.includes(r.status));
  const historyRequests = mappedRequests.filter((r) => historyStatuses.includes(r.status));

  return (
    <div className="space-y-6">
      {/* 错误与加载处理 */}
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-300">
          {error.message}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            label: "进行中",
            value: ongoingRequests.length,
            color: "amber",
            description: "需要关注",
          },
          {
            label: "历史记录",
            value: historyRequests.length,
            color: "orange",
            description: "已归归档",
          },
          {
            label: "待验收",
            value: ongoingRequests.filter((r) => r.pendingSubmissions > 0).length,
            color: "green",
            description: "有新提交",
          },
          {
            label: "总支出",
            value: stats.totalSpent.toLocaleString(),
            color: "amber",
            description: "积分",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/10 to-orange-600/10 p-4"
          >
            <div className="mb-1 text-amber-400/60">{stat.label}</div>
            <div className="mb-1 text-amber-50">{stat.value}</div>
            <div className="text-xs text-amber-300/50">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Status Group Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setStatusGroup("ongoing")}
          className={`flex-1 rounded-lg px-6 py-3 transition-all ${
            statusGroup === "ongoing"
              ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
              : "border border-amber-500/20 bg-linear-to-br from-amber-600/10 to-orange-600/10 text-amber-300 hover:border-amber-400/40"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>进行中</span>
            {ongoingRequests.length > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">
                {ongoingRequests.length}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setStatusGroup("history")}
          className={`flex-1 rounded-lg px-6 py-3 transition-all ${
            statusGroup === "history"
              ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
              : "border border-amber-500/20 bg-linear-to-br from-amber-600/10 to-orange-600/10 text-amber-300 hover:border-amber-400/40"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>历史记录</span>
            {historyRequests.length > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">
                {historyRequests.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Pending Submissions Alert */}
      {statusGroup === "ongoing" && ongoingRequests.some((r) => r.pendingSubmissions > 0) && (
        <div className="rounded-lg border border-green-400/30 bg-linear-to-r from-green-500/20 to-emerald-500/20 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
            <div className="flex-1">
              <div className="mb-1 text-green-300">验收提醒</div>
              <div className="text-green-200/70">
                您有 {ongoingRequests.filter((r) => r.pendingSubmissions > 0).length}{" "}
                个求种收到了新的资源提交，请及时进行验收
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const statusConfig = getStatusConfig(request.status);
          if (!statusConfig) return null;
          const StatusIcon = statusConfig.icon;
          const totalBounty = request.bounty + request.additionalBounty;

          return (
            <div
              key={request.id}
              className="rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/5 to-orange-600/5 p-6 transition-all hover:border-amber-400/40"
            >
              <div className="flex flex-col gap-4 lg:flex-row">
                {/* Main Content */}
                <div className="flex-1 space-y-3">
                  {/* Title and Status */}
                  <div className="flex items-start gap-3">
                    <h3 className="flex-1 text-amber-50">{request.title}</h3>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${statusConfig.bg} ${statusConfig.border} border ${statusConfig.color}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-amber-300/60">
                    <span className="flex items-center gap-1.5">
                      <span className="rounded border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-amber-400">
                        {request.category}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      发布于 {request.createdAt}
                    </span>
                    {request.status !== "draft" && <span>截止 {request.deadline}</span>}
                    {request.claimedBy && (
                      <span className="text-green-400">已被 {request.claimedBy} 认领</span>
                    )}
                  </div>

                  {/* Bounty Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-300">
                      悬赏: {totalBounty.toLocaleString()} 积分
                    </span>
                    {request.additionalBounty > 0 && (
                      <span className="text-orange-400">
                        (含追加 {request.additionalBounty.toLocaleString()})
                      </span>
                    )}
                  </div>

                  {/* Pending Submissions Alert */}
                  {request.pendingSubmissions > 0 && (
                    <div className="rounded-lg border border-green-400/30 bg-green-500/20 px-3 py-2 text-sm">
                      <span className="text-green-300">
                        🎉 有 {request.pendingSubmissions} 个新的资源提交等待您验收
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {request.status === "draft" && (
                      <>
                        <button className="rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm text-white transition-all hover:from-amber-600 hover:to-orange-600">
                          继续编辑
                        </button>
                        <button
                          onClick={() => actions.publish.mutate({ id: request.id })}
                          disabled={actions.publish.isPending}
                          className="rounded-lg bg-linear-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm text-white transition-all hover:from-green-600 hover:to-emerald-600 disabled:opacity-60"
                        >
                          发布
                        </button>
                      </>
                    )}

                    {request.status === "active" && (
                      <>
                        {request.pendingSubmissions > 0 && (
                          <button className="flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm text-white transition-all hover:from-green-600 hover:to-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                            去验收
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setTargetRequestId(request.id);
                            setBountyOpen(true);
                          }}
                          disabled={actions.addBounty.isPending}
                          className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400 disabled:opacity-60"
                        >
                          <TrendingUp className="h-4 w-4" />
                          追加悬赏
                        </button>
                        <button
                          onClick={() => {
                            actions.cancel.mutate({ id: request.id });
                            toast.info("正在请求取消...");
                          }}
                          disabled={actions.cancel.isPending}
                          className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400 disabled:opacity-60"
                        >
                          <XCircle className="h-4 w-4" />
                          取消求种
                        </button>
                      </>
                    )}

                    {(request.status === "expired" || request.status === "cancelled") && (
                      <button
                        onClick={() => actions.republish.mutate({ id: request.id })}
                        disabled={actions.republish.isPending}
                        className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400 disabled:opacity-60"
                      >
                        <RefreshCw className="h-4 w-4" />
                        重新发布
                      </button>
                    )}

                    {request.status === "draft" && (
                      <button
                        className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm text-red-300 transition-all hover:bg-red-500/30"
                        disabled
                      >
                        <Trash2 className="h-4 w-4" />
                        删除草稿
                      </button>
                    )}

                    <button className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && filteredRequests.length === 0 && (
        <div className="py-12 text-center text-amber-300/60">
          <Plus className="mx-auto mb-4 h-12 w-12 opacity-40" />
          <p className="mb-4">{statusGroup === "ongoing" ? "暂无进行中的求种" : "暂无历史记录"}</p>
          <button className="rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-6 py-3 text-white transition-all hover:from-amber-600 hover:to-orange-600">
            发布新求种
          </button>
        </div>
      )}

      {/* Add Bounty Dialog */}
      <Dialog open={bountyOpen} onOpenChange={setBountyOpen}>
        <DialogContent className="border-amber-500/20 bg-[#0F171E] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>追加悬赏</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bounty-amount">追加金额</Label>
              <Input
                id="bounty-amount"
                type="number"
                value={bountyAmount}
                onChange={(e) => setBountyAmount(e.target.value)}
                placeholder="请输入积分值..."
                className="border-white/10 bg-white/5 text-white"
              />
              <p className="text-xs text-amber-400/60">追加金额将从您的账户余额中扣除。</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBountyOpen(false)}>
              取消
            </Button>
            <Button
              variant="default"
              onClick={() => {
                const amount = Number(bountyAmount);
                if (targetRequestId && Number.isFinite(amount) && amount > 0) {
                  actions.addBounty.mutate({ id: targetRequestId, amount });
                  setBountyOpen(false);
                  setBountyAmount("");
                  toast.success("已发起追加请求");
                } else {
                  toast.error("请输入有效的金额");
                }
              }}
            >
              确定追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
