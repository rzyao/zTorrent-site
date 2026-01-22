import { useState } from "react";
import { useMyResponsesQuery } from "@/modules/app/pages/Requests/hooks/useMyResponsesQuery";
import { useRequestActions } from "@/modules/app/pages/Requests/hooks/useRequestActions";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  MessageSquare,
  Award,
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

interface MyResponse {
  id: string;
  requestId: string;
  requestTitle: string;
  category: string;
  bounty: number;
  claimedAt: string;
  deadline: string;
  status: "claimed" | "submitted" | "approved" | "rejected" | "disputed";
  requester: string;
  submittedAt?: string;
  rejectionReason?: string;
  timeRemaining: string;
}

// 将后端应答记录映射为 UI 需要的最小字段集

type StatusFilter = "all" | "claimed" | "submitted" | "approved" | "rejected" | "disputed";

export function MyResponses() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { items, isLoading, error } = useMyResponsesQuery();
  const actions = useRequestActions();

  // Submit Dialog state
  const [submitOpen, setSubmitOpen] = useState(false);
  const [resourceLink, setResourceLink] = useState("");
  const [targetClaimId, setTargetClaimId] = useState<string | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);

  const mappedResponses: MyResponse[] = (items as any[]).map((r) => ({
    id: String(r?.id ?? ""),
    requestId: String(r?.requestId ?? ""),
    requestTitle: String(r?.requestTitle ?? r?.request?.title ?? ""),
    category: String(r?.category ?? r?.request?.category ?? "其他"),
    bounty: Number(r?.bounty ?? r?.request?.bounty ?? 0),
    claimedAt: String(r?.claimedAt ?? ""),
    deadline: String(r?.deadlineAt ?? r?.deadline ?? ""),
    status: (["claimed", "submitted", "approved", "rejected", "disputed"].includes(
      String(r?.status),
    )
      ? String(r?.status)
      : "claimed") as MyResponse["status"],
    requester: String(r?.requester?.name ?? r?.requester ?? ""),
    submittedAt: r?.submittedAt ?? undefined,
    rejectionReason: r?.rejectionReason ?? undefined,
    timeRemaining: String(r?.timeRemaining ?? ""),
  }));

  const filteredResponses = mappedResponses.filter(
    (response) => statusFilter === "all" || response.status === statusFilter,
  );

  const getStatusConfig = (status: MyResponse["status"]) => {
    switch (status) {
      case "claimed":
        return {
          icon: Clock,
          text: "待提交",
          color: "text-amber-400",
          bg: "bg-amber-500/20",
          border: "border-amber-500/30",
        };
      case "submitted":
        return {
          icon: AlertTriangle,
          text: "待审核",
          color: "text-blue-400",
          bg: "bg-blue-500/20",
          border: "border-blue-500/30",
        };
      case "approved":
        return {
          icon: CheckCircle2,
          text: "已通过",
          color: "text-green-400",
          bg: "bg-green-500/20",
          border: "border-green-500/30",
        };
      case "rejected":
        return {
          icon: XCircle,
          text: "已拒绝",
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
        };
      case "disputed":
        return {
          icon: MessageSquare,
          text: "争议中",
          color: "text-purple-400",
          bg: "bg-purple-500/20",
          border: "border-purple-500/30",
        };
    }
  };

  const activeTasks = mappedResponses.filter((r) =>
    ["claimed", "submitted", "disputed"].includes(r.status),
  );
  const completedTasks = mappedResponses.filter((r) => r.status === "approved");
  const totalEarned = completedTasks.reduce((sum, r) => sum + r.bounty, 0);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            label: "进行中任务",
            value: activeTasks.length,
            color: "amber",
            description: "需要跟进",
          },
          {
            label: "已完成",
            value: completedTasks.length,
            color: "green",
            description: "成功交付",
          },
          {
            label: "总收入",
            value: totalEarned.toLocaleString(),
            color: "orange",
            description: "积分",
          },
          {
            label: "被拒绝",
            value: mappedResponses.filter((r) => r.status === "rejected").length,
            color: "red",
            description: "需改进",
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

      {/* 错误与加载处理 */}
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-300">
          {error.message}
        </div>
      )}

      {/* Status Filter */}
      <div className="rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/10 to-orange-600/10 p-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "全部" },
              { value: "claimed", label: "待提交" },
              { value: "submitted", label: "待审核" },
              { value: "approved", label: "已通过" },
              { value: "rejected", label: "已拒绝" },
              { value: "disputed", label: "争议中" },
            ] as { value: StatusFilter; label: string }[]
          ).map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-lg px-4 py-2 transition-all ${
                statusFilter === filter.value
                  ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                  : "border border-amber-500/30 bg-[#0F171E]/50 text-amber-300 hover:bg-amber-500/10"
              }`}
            >
              {filter.label}
              {filter.value !== "all" && (
                <span className="ml-2 text-xs opacity-70">
                  ({mappedResponses.filter((r) => r.status === filter.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Important Alert */}
      {activeTasks.some((r) => r.status === "claimed" && r.timeRemaining.includes("小时")) && (
        <div className="rounded-lg border border-red-400/30 bg-linear-to-r from-red-500/20 to-orange-500/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div className="flex-1">
              <div className="mb-1 text-red-300">紧急提醒</div>
              <div className="text-red-200/70">
                您有任务即将到期，请尽快提交资源，避免影响信用评分
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredResponses.map((response) => {
          const statusConfig = getStatusConfig(response.status);
          const StatusIcon = statusConfig.icon;
          const isUrgent = response.status === "claimed" && response.timeRemaining.includes("小时");

          return (
            <div
              key={response.id}
              className={`rounded-lg border bg-linear-to-br from-amber-600/5 to-orange-600/5 p-6 transition-all hover:border-amber-400/40 ${
                isUrgent ? "border-red-400/40" : "border-amber-500/20"
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 text-amber-50">{response.requestTitle}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-amber-300/60">
                      <span className="rounded border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-amber-400">
                        {response.category}
                      </span>
                      <span>需求方: {response.requester}</span>
                      <span>认领于 {response.claimedAt}</span>
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm whitespace-nowrap ${statusConfig.bg} ${statusConfig.border} border ${statusConfig.color}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusConfig.text}
                  </span>
                </div>

                {/* Progress Info */}
                <div className="grid grid-cols-1 gap-4 rounded-lg border border-amber-500/10 bg-[#0F171E]/50 p-4 md:grid-cols-3">
                  <div>
                    <div className="mb-1 text-sm text-amber-400/60">悬赏金额</div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-400" />
                      <span className="text-amber-50">{response.bounty.toLocaleString()} 积分</span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-sm text-amber-400/60">截止时间</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span className="text-amber-50">{response.deadline}</span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-sm text-amber-400/60">剩余时间</div>
                    <div
                      className={`flex items-center gap-2 ${isUrgent ? "text-red-400" : "text-amber-50"}`}
                    >
                      <Clock className="h-4 w-4" />
                      <span>{response.timeRemaining}</span>
                    </div>
                  </div>
                </div>

                {/* Submission Info */}
                {response.submittedAt && (
                  <div className="rounded-lg border border-blue-400/30 bg-blue-500/10 p-4">
                    <div className="mb-1 text-sm text-blue-300">
                      提交时间: {response.submittedAt}
                    </div>
                    {response.status === "submitted" && (
                      <div className="text-sm text-blue-200/70">等待需求方验收中...</div>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {response.rejectionReason && (
                  <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4">
                    <div className="mb-1 text-red-300">拒绝原因</div>
                    <div className="text-sm text-red-200/70">{response.rejectionReason}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {response.status === "claimed" && (
                    <>
                      <button
                        onClick={() => {
                          setTargetClaimId(response.id);
                          setIsResubmitting(false);
                          setSubmitOpen(true);
                        }}
                        disabled={actions.submit.isPending}
                        className="flex items-center gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm text-white transition-all hover:from-amber-600 hover:to-orange-600 disabled:opacity-60"
                      >
                        <Upload className="h-4 w-4" />
                        {actions.submit.isPending ? "提交中..." : "提交资源"}
                      </button>
                      <button className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400">
                        联系需求方
                      </button>
                      <button
                        onClick={() => actions.abandon.mutate({ claimId: response.id })}
                        disabled={actions.abandon.isPending}
                        className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm text-red-300 transition-all hover:bg-red-500/30 disabled:opacity-60"
                      >
                        <XCircle className="h-4 w-4" />
                        {actions.abandon.isPending ? "放弃中..." : "放弃任务"}
                      </button>
                    </>
                  )}

                  {response.status === "submitted" && (
                    <>
                      <button className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400">
                        查看提交详情
                      </button>
                      <button className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400">
                        联系需求方
                      </button>
                    </>
                  )}

                  {response.status === "rejected" && (
                    <>
                      <button
                        onClick={() => {
                          setTargetClaimId(response.id);
                          setIsResubmitting(true);
                          setSubmitOpen(true);
                        }}
                        disabled={actions.resubmit.isPending}
                        className="rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm text-white transition-all hover:from-amber-600 hover:to-orange-600 disabled:opacity-60"
                      >
                        {actions.resubmit.isPending
                          ? "提交中..."
                          : isResubmitting && targetClaimId === response.id
                            ? "重新提交"
                            : "重新提交"}
                      </button>
                      <button className="flex items-center gap-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm text-white transition-all hover:from-purple-600 hover:to-pink-600">
                        <MessageSquare className="h-4 w-4" />
                        发起仲裁
                      </button>
                    </>
                  )}

                  {response.status === "disputed" && (
                    <>
                      <button className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400">
                        查看仲裁进度
                      </button>
                      <button className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400">
                        补充证据
                      </button>
                    </>
                  )}

                  {response.status === "approved" && (
                    <button className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 px-4 py-2 text-sm text-amber-300 transition-all hover:border-amber-400">
                      查看详情
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && filteredResponses.length === 0 && (
        <div className="py-12 text-center text-amber-300/60">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 opacity-40" />
          <p>暂无符合条件的应答记录</p>
        </div>
      )}

      {/* Resource Submission Dialog */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="border-amber-500/20 bg-[#0F171E] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isResubmitting ? "重新提交资源" : "提交资源"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resource-link">资源链接</Label>
              <Input
                id="resource-link"
                value={resourceLink}
                onChange={(e) => setResourceLink(e.target.value)}
                placeholder="请输入有效的磁力链接或网盘地址..."
                className="border-white/10 bg-white/5 text-white"
              />
              <p className="text-xs text-amber-400/60">请确保链接有效且包含完整资源。</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSubmitOpen(false)}>
              取消
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (targetClaimId && resourceLink.trim()) {
                  if (isResubmitting) {
                    actions.resubmit.mutate({
                      submissionId: targetClaimId,
                      resource: { link: resourceLink },
                    });
                  } else {
                    actions.submit.mutate({
                      claimId: targetClaimId,
                      resource: { link: resourceLink },
                    });
                  }
                  setSubmitOpen(false);
                  setResourceLink("");
                  toast.success("已发起提交请求");
                } else {
                  toast.error("请输入有效的链接");
                }
              }}
            >
              确定提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
