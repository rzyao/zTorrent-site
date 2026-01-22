import { useState } from "react";
import { useModerationQuery } from "@/modules/app/pages/Requests/hooks/useModerationQuery";
import { useRequestActions } from "@/modules/app/pages/Requests/hooks/useRequestActions";
import { RequestsService } from "@/api/services/RequestsService";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  Image,
  Clock,
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

interface DisputeCase {
  id: string;
  requestId: string;
  requestTitle: string;
  category: string;
  bounty: number;
  requester: string;
  responder: string;
  claimedAt: string;
  submittedAt: string;
  rejectedAt: string;
  disputeCreatedAt: string;
  requesterStatement: string;
  responderStatement: string;
  submittedResource: string;
  chatHistory: string[];
  evidence: {
    type: "image" | "file" | "text";
    content: string;
    uploader: "requester" | "responder";
  }[];
  priority: "low" | "medium" | "high";
}

// 移除本地模拟数据，改为服务端数据源

export function ModerationCenter() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const { items, isLoading, error, selectCase, getSelectedCase } = useModerationQuery({
    priority: priorityFilter,
  });
  const actions = useRequestActions();

  // Reject Dialog state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingSubmissionId, setRejectingSubmissionId] = useState<string | null>(null);

  // Evidence Dialog state
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidenceNote, setEvidenceNote] = useState("");
  const [evidenceCaseId, setEvidenceCaseId] = useState<string | null>(null);

  const getPriorityConfig = (priority: DisputeCase["priority"]) => {
    switch (priority) {
      case "high":
        return {
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          label: "高优先级",
        };
      case "medium":
        return {
          color: "text-orange-400",
          bg: "bg-orange-500/20",
          border: "border-orange-500/30",
          label: "中优先级",
        };
      case "low":
        return {
          color: "text-amber-400",
          bg: "bg-amber-500/20",
          border: "border-amber-500/30",
          label: "低优先级",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <div className="rounded-lg border border-purple-400/30 bg-linear-to-r from-purple-500/20 to-pink-500/20 p-4">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
          <div className="flex-1">
            <div className="mb-1 text-purple-300">仲裁中心</div>
            <div className="text-sm text-purple-200/70">
              作为管理员，您需要公正地处理用户之间的争议。请仔细审查双方提供的证据，做出公平的裁决。
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "待处理", value: items.length, color: "amber" },
          {
            label: "高优先级",
            value: items.filter((d: any) => d.priority === "high").length,
            color: "red",
          },
          { label: "本月已处理", value: "23", color: "green" },
          { label: "平均处理时长", value: "2.5天", color: "orange" },
        ].map((stat, index) => (
          <div
            key={index}
            className="rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/10 to-orange-600/10 p-4"
          >
            <div className="mb-1 text-amber-400/60">{stat.label}</div>
            <div className="text-amber-50">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Priority Filter */}
      <div className="rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/10 to-orange-600/10 p-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "high", "medium", "low"] as const).map((priority) => (
            <button
              key={priority}
              onClick={() => setPriorityFilter(priority)}
              className={`rounded-lg px-4 py-2 transition-all ${
                priorityFilter === priority
                  ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                  : "border border-amber-500/30 bg-[#0F171E]/50 text-amber-300 hover:bg-amber-500/10"
              }`}
            >
              {priority === "all"
                ? "全部"
                : priority === "high"
                  ? "高优先级"
                  : priority === "medium"
                    ? "中优先级"
                    : "低优先级"}
              <span className="ml-2 text-xs opacity-70">
                (
                {priority === "all"
                  ? items.length
                  : items.filter((d: any) => d.priority === priority).length}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Disputes Queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* List */}
        <div className="space-y-4">
          <h3 className="text-amber-50">争议队列</h3>
          {isLoading ? (
            <div className="text-amber-300/60">加载中...</div>
          ) : (
            items.map((raw: any) => {
              const dispute = {
                id: String(raw?.id ?? ""),
                requestId: String(raw?.requestId ?? ""),
                requestTitle: String(raw?.requestTitle ?? raw?.request?.title ?? ""),
                category: String(raw?.category ?? raw?.request?.category ?? "其他"),
                bounty: Number(raw?.bounty ?? raw?.request?.bounty ?? 0),
                requester: String(raw?.requester?.name ?? raw?.requester ?? ""),
                responder: String(raw?.responder?.name ?? raw?.responder ?? ""),
                claimedAt: String(raw?.timeline?.claimedAt ?? ""),
                submittedAt: String(raw?.timeline?.submittedAt ?? ""),
                rejectedAt: String(raw?.timeline?.rejectedAt ?? ""),
                disputeCreatedAt: String(raw?.timeline?.disputeCreatedAt ?? ""),
                requesterStatement: String(raw?.statements?.requesterStatement ?? ""),
                responderStatement: String(raw?.statements?.responderStatement ?? ""),
                submittedResource: String(raw?.submittedResource ?? ""),
                chatHistory: Array.isArray(raw?.chatHistory) ? raw.chatHistory : [],
                evidence: Array.isArray(raw?.evidence) ? raw.evidence : [],
                priority: (["low", "medium", "high"].includes(String(raw?.priority))
                  ? String(raw?.priority)
                  : "low") as DisputeCase["priority"],
              } as DisputeCase;
              const priorityConfig = getPriorityConfig(dispute.priority);

              return (
                <div
                  key={dispute.id}
                  onClick={async () => {
                    setSelectedCaseId(dispute.id);
                    await selectCase(dispute.id);
                  }}
                  className={`cursor-pointer rounded-lg border bg-linear-to-br from-amber-600/5 to-orange-600/5 p-4 transition-all ${
                    selectedCaseId === dispute.id
                      ? "border-amber-400 bg-amber-500/10"
                      : "border-amber-500/20 hover:border-amber-400/40"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="flex-1 text-amber-50">{dispute.requestTitle}</h4>
                      <span
                        className={`rounded px-2 py-1 text-xs ${priorityConfig.bg} ${priorityConfig.border} border ${priorityConfig.color}`}
                      >
                        {priorityConfig.label}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-amber-300/60">
                      <div className="flex items-center gap-2">
                        <span className="rounded border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-amber-400">
                          {dispute.category}
                        </span>
                        <span>{dispute.bounty.toLocaleString()} 积分</span>
                      </div>
                      <div>需求方: {dispute.requester}</div>
                      <div>应答方: {dispute.responder}</div>
                      <div className="flex items-center gap-1 text-purple-400">
                        <Clock className="h-3 w-3" />
                        争议发起于 {dispute.disputeCreatedAt}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        <div className="h-fit lg:sticky lg:top-24">
          {selectedCaseId ? (
            <div className="space-y-6 rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/5 to-orange-600/5 p-6">
              <div>
                <h3 className="mb-4 text-amber-50">案件详情</h3>

                {/* Basic Info */}
                <div className="mb-4 space-y-2 rounded-lg bg-[#0F171E]/50 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-400/60">求种标题</span>
                    <span className="text-amber-50">
                      {(getSelectedCase(selectedCaseId) as any)?.requestTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-400/60">悬赏金额</span>
                    <span className="text-amber-50">
                      {Number(
                        (getSelectedCase(selectedCaseId) as any)?.bounty ?? 0,
                      ).toLocaleString()}{" "}
                      积分
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-400/60">提交资源</span>
                    <span className="text-right text-amber-50">
                      {String((getSelectedCase(selectedCaseId) as any)?.submittedResource ?? "")}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-4 rounded-lg bg-[#0F171E]/50 p-4">
                  <div className="mb-2 text-sm text-amber-400/60">时间线</div>
                  <div className="space-y-2 text-sm text-amber-300/60">
                    <div>
                      认领:{" "}
                      {String((getSelectedCase(selectedCaseId) as any)?.timeline?.claimedAt ?? "")}
                    </div>
                    <div>
                      提交:{" "}
                      {String(
                        (getSelectedCase(selectedCaseId) as any)?.timeline?.submittedAt ?? "",
                      )}
                    </div>
                    <div>
                      拒绝:{" "}
                      {String((getSelectedCase(selectedCaseId) as any)?.timeline?.rejectedAt ?? "")}
                    </div>
                    <div className="text-purple-400">
                      发起仲裁:{" "}
                      {String(
                        (getSelectedCase(selectedCaseId) as any)?.timeline?.disputeCreatedAt ?? "",
                      )}
                    </div>
                  </div>
                </div>

                {/* Statements */}
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-400/30 bg-blue-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-300">需求方陈述</span>
                    </div>
                    <p className="text-sm text-blue-200/70">
                      {String(
                        (getSelectedCase(selectedCaseId) as any)?.statements?.requesterStatement ??
                          "",
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-green-400/30 bg-green-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-400" />
                      <span className="text-green-300">应答方陈述</span>
                    </div>
                    <p className="text-sm text-green-200/70">
                      {String(
                        (getSelectedCase(selectedCaseId) as any)?.statements?.responderStatement ??
                          "",
                      )}
                    </p>
                  </div>
                </div>

                {/* Evidence */}
                {Array.isArray((getSelectedCase(selectedCaseId) as any)?.evidence) &&
                  (getSelectedCase(selectedCaseId) as any)?.evidence.length > 0 && (
                    <div className="rounded-lg bg-[#0F171E]/50 p-4">
                      <div className="mb-3 text-sm text-amber-400/60">证据材料</div>
                      <div className="space-y-2">
                        {(getSelectedCase(selectedCaseId) as any)?.evidence.map(
                          (ev: any, index: number) => {
                            const Icon =
                              ev.type === "image"
                                ? Image
                                : ev.type === "file"
                                  ? FileText
                                  : MessageSquare;
                            return (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                <div className="flex-1">
                                  <div className="text-amber-300/60">{ev.content}</div>
                                  <div className="text-xs text-amber-400/40">
                                    上传者:{" "}
                                    {ev.uploader === "requester"
                                      ? String(
                                          (getSelectedCase(selectedCaseId) as any)?.requester ?? "",
                                        )
                                      : String(
                                          (getSelectedCase(selectedCaseId) as any)?.responder ?? "",
                                        )}
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}

                {/* Chat History */}
                {Array.isArray((getSelectedCase(selectedCaseId) as any)?.chatHistory) &&
                  (getSelectedCase(selectedCaseId) as any)?.chatHistory.length > 0 && (
                    <div className="rounded-lg bg-[#0F171E]/50 p-4">
                      <div className="mb-3 text-sm text-amber-400/60">聊天记录</div>
                      <div className="space-y-2">
                        {(getSelectedCase(selectedCaseId) as any)?.chatHistory.map(
                          (msg: string, index: number) => (
                            <div key={index} className="text-sm text-amber-300/60">
                              {msg}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={() =>
                      actions.approveSubmission.mutate({
                        submissionId: String(
                          (getSelectedCase(selectedCaseId) as any)?.submissionId ?? "",
                        ),
                      })
                    }
                    disabled={actions.approveSubmission.isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 py-3 text-white transition-all hover:from-green-600 hover:to-emerald-600 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    裁决：通过验收（发放悬赏）
                  </button>

                  <button
                    onClick={() => {
                      const submissionId = String(
                        (getSelectedCase(selectedCaseId) as any)?.submissionId ?? "",
                      );
                      setRejectingSubmissionId(submissionId);
                      setRejectOpen(true);
                    }}
                    disabled={actions.rejectSubmission.isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-500 to-rose-500 py-3 text-white transition-all hover:from-red-600 hover:to-rose-600 disabled:opacity-60"
                  >
                    <XCircle className="h-4 w-4" />
                    裁决：拒绝验收（退款）
                  </button>

                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 py-3 text-white transition-all hover:from-purple-600 hover:to-pink-600">
                    <AlertTriangle className="h-4 w-4" />
                    处罚违规方
                  </button>

                  <button
                    onClick={() => {
                      setEvidenceCaseId(String(selectedCaseId));
                      setEvidenceOpen(true);
                    }}
                    className="w-full rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-600/20 to-orange-600/20 py-3 text-amber-300 transition-all hover:border-amber-400"
                  >
                    请求更多证据
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-500/20 bg-linear-to-br from-amber-600/5 to-orange-600/5 p-12 text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-amber-400/40" />
              <p className="text-amber-300/60">请从左侧选择一个案件查看详情</p>
            </div>
          )}
        </div>
      </div>

      {!isLoading && items.length === 0 && (
        <div className="py-12 text-center text-amber-300/60">
          <Shield className="mx-auto mb-4 h-12 w-12 opacity-40" />
          <p>暂无待处理的争议案件</p>
        </div>
      )}

      {/* Reject Reason Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="border-amber-500/20 bg-[#0F171E] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>拒绝验收</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">请输入拒绝原因</Label>
              <Input
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="在此处填写理由..."
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              取消
            </Button>
            <Button
              variant="default"
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (rejectingSubmissionId) {
                  actions.rejectSubmission.mutate({
                    submissionId: rejectingSubmissionId,
                    reason: rejectReason,
                  });
                  setRejectOpen(false);
                  setRejectReason("");
                }
              }}
            >
              确定拒绝
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evidence Request Dialog */}
      <Dialog open={evidenceOpen} onOpenChange={setEvidenceOpen}>
        <DialogContent className="border-amber-500/20 bg-[#0F171E] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>请求更多证据</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="evidence-note">证据说明</Label>
              <Input
                id="evidence-note"
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder="描述您需要的证据..."
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEvidenceOpen(false)}>
              取消
            </Button>
            <Button
              variant="default"
              onClick={async () => {
                if (evidenceCaseId) {
                  try {
                    await RequestsService.requestsDisputesControllerRequestEvidence({
                      id: evidenceCaseId,
                      note: evidenceNote,
                    } as any);
                    toast.success("已请求更多证据");
                    setEvidenceOpen(false);
                    setEvidenceNote("");
                  } catch (e) {
                    toast.error("请求失败");
                  }
                }
              }}
            >
              发送请求
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
