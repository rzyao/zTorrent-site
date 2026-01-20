import { useMemo, useState, useEffect } from "react";
import { useAccess } from "@/context/AccessContext";
import { useForumTheme } from "@/modules/forum/context/ForumThemeContext";
import { Button } from "@/modules/forum/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/forum/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/modules/forum/components/ui/table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/modules/forum/components/ui/drawer";
import { customToast } from "@/hooks/useToast";
import { useForumReports, ReportStatus } from "./hooks/useForumReports";
import { useForumBountyCancel, BountyStatus } from "./hooks/useForumBountyCancel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/modules/forum/components/ui/dialog";
import { Textarea } from "@/modules/forum/components/ui/textarea";
import { Badge } from "@/modules/forum/components/ui/badge";
import { useSearchParams } from "react-router-dom";

type AuditType = "report" | "bounty-cancel";
// 由 hooks 文件导出的联合类型

/**
 * Forum 审核中心（仅论坛域）
 * - 聚合“举报审核”和“悬赏取消申请审核”
 * - 遵循论坛模块的 UI 组件与样式
 * - 采用统一的筛选栏与表格展示，右侧详情抽屉按需展开
 */
export function ForumAuditCenter() {
  const { access } = useAccess();
  const { colors } = useForumTheme();
  const isAdminOrMod = access?.roles?.includes("admin") || access?.roles?.includes("moderator");

  // 顶部筛选
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as AuditType) || "report";
  const [auditType, setAuditType] = useState<AuditType>(initialType === "bounty-cancel" ? "bounty-cancel" : "report");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | BountyStatus>("pending");
  const [keyword, setKeyword] = useState<string>("");

  // 数据层：分别初始化两个审核类型的 hooks
  const reports = useForumReports({ status: statusFilter as ReportStatus, keyword });
  const bounty = useForumBountyCancel({ status: statusFilter as BountyStatus });

  // 依据当前审核类型选择数据源
  const items = auditType === "report" ? reports.items : bounty.items;
  const page = auditType === "report" ? reports.page : bounty.page;
  const total = auditType === "report" ? reports.total : bounty.total;
  const loading = auditType === "report" ? reports.loading : bounty.loading;

  // 详情抽屉
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const openDetailItem = useMemo(() => items.find((it) => it.id === openDetailId) || null, [items, openDetailId]);

  // 驳回理由弹窗
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState<{ type: AuditType; id: string } | null>(null);

  // 分页加载代理
  const load = (nextPage = 1) => {
    if (auditType === "report") {
      reports.load(nextPage);
    } else {
      bounty.load(nextPage);
    }
  };

  useEffect(() => {
    const typeParam = auditType;
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("type", typeParam);
      return p;
    });
  }, [auditType, setSearchParams]);

  // 举报处理动作
  const handleReport = async (reportId: string, action: "resolve" | "reject", options?: { deleteContent?: boolean; lockTopic?: boolean; note?: string }) => {
    await reports.handle(reportId, action, options);
    customToast.success("举报处理已提交");
    load(page);
  };

  // 悬赏取消审核
  const reviewBountyCancel = async (topicId: string, action: "approve" | "reject", note?: string) => {
    await bounty.review(topicId, action, note);
    customToast.success("悬赏取消审核已提交");
    load(page);
  };

  const toReportReasonLabel = (reason?: string) => {
    const r = String(reason ?? "").toLowerCase();
    if (r === "spam") return "垃圾广告";
    if (r === "abuse") return "人身攻击";
    if (r === "inappropriate") return "违规内容";
    if (r === "copyright") return "侵权";
    if (r === "other") return "其他";
    return reason ?? "-";
  };
  const toReportStatusLabel = (status?: string) => {
    const s = String(status ?? "").toLowerCase();
    if (s === "pending") return "待处理";
    if (s === "resolved") return "已处理";
    if (s === "rejected") return "已驳回";
    return status ?? "-";
  };
  const toBountyStatusLabel = (status?: string) => {
    const s = String(status ?? "").toLowerCase();
    if (s === "pending") return "待审核";
    if (s === "approved") return "已同意";
    if (s === "rejected") return "已拒绝";
    return status ?? "-";
  };

  if (!isAdminOrMod) {
    return <div className={`p-6 ${colors.pageBg} ${colors.textSecondary}`}>无权限访问此页面</div>;
  }

  return (
    <div className={`p-4 ${colors.pageBg}`}>
      <h2 className={`mb-4 text-lg font-bold ${colors.titleColor}`}>论坛审核中心</h2>

      {/* 顶部筛选栏 */}
      <div className="mb-3 flex items-center gap-3">
        <label className={`text-sm ${colors.textMuted}`}>审核类型</label>
        <Select value={auditType} onValueChange={(val) => setAuditType(val as AuditType)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="report">举报审核</SelectItem>
            <SelectItem value="bounty-cancel">悬赏取消审核</SelectItem>
          </SelectContent>
        </Select>

        <label className={`ml-4 text-sm ${colors.textMuted}`}>状态</label>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            {auditType === "report" ? (
              <>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="resolved">已处理</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
                <SelectItem value="all">全部</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="approved">已同意</SelectItem>
                <SelectItem value="rejected">已拒绝</SelectItem>
                <SelectItem value="all">全部</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* 列表区 */}
      {loading && <div className="p-4">加载中...</div>}
      {!loading && items.length === 0 && <div className="p-4">暂无数据</div>}
      {!loading && items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className={colors.dividerColor}>
              {auditType === "report" ? (
                <>
                  <TableHead>目标</TableHead>
                  <TableHead>原因</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </>
              ) : (
                <>
                  <TableHead>话题</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>理由</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it: any) => (
              <TableRow key={it.id} className={colors.dividerColor}>
                {auditType === "report" ? (
                  <>
                    {(() => {
                      const statusStr = String(it.status ?? "").toLowerCase();
                      const isPending = statusStr === "pending";
                      return (
                        <>
                          <TableCell className="max-w-[320px]">
                            <Button variant="default" size="sm" onClick={() => setOpenDetailId(it.id)} className="mr-2">
                              查看详情
                            </Button>
                            {it.topicId ? `话题：${it.topicId}` : `帖子：${it.postId}`}
                          </TableCell>
                          <TableCell>
                            <Badge color="blue" size="sm">{toReportReasonLabel(it.reason)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge color={isPending ? "yellow" : String(it.status ?? "").toLowerCase() === "resolved" ? "green" : "red"} size="sm">
                              {toReportStatusLabel(it.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={!isPending}
                              onClick={() => handleReport(it.id, "resolve")}
                              className="mr-2"
                            >
                              标记处理
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={!isPending}
                              onClick={() => {
                                setRejectTarget({ type: "report", id: it.id });
                                setRejectReason("");
                                setRejectOpen(true);
                              }}
                            >
                              驳回
                            </Button>
                          </TableCell>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    {(() => {
                      const statusStr = String(it.cancelRequestStatus ?? "").toLowerCase();
                      const isPending = statusStr === "pending";
                      return (
                        <>
                          <TableCell className="max-w-[320px]">
                            <Button variant="default" size="sm" onClick={() => setOpenDetailId(it.id)} className="mr-2">
                              查看详情
                            </Button>
                            {it.topic?.title || it.topicId}
                          </TableCell>
                          <TableCell>{it.amount}</TableCell>
                          <TableCell className="wrap-break-word">
                            <Badge color="blue" size="sm">{it.cancelRequestReason || "-"}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge color={isPending ? "yellow" : String(it.cancelRequestStatus ?? "").toLowerCase() === "approved" ? "green" : "red"} size="sm">
                              {toBountyStatusLabel(it.cancelRequestStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={!isPending}
                              onClick={() => reviewBountyCancel(it.topicId, "approve")}
                              className="mr-2"
                            >
                              同意
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={!isPending}
                              onClick={() => {
                                setRejectTarget({ type: "bounty-cancel", id: it.topicId });
                                setRejectReason("");
                                setRejectOpen(true);
                              }}
                            >
                              拒绝
                            </Button>
                          </TableCell>
                        </>
                      );
                    })()}
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* 分页 */}
      {total > 0 && (
        <div className="mt-3 flex items-center justify-end gap-2">
          <Button variant="default" size="sm" disabled={page <= 1} onClick={() => load(page - 1)}>
            上一页
          </Button>
          <Button variant="default" size="sm" disabled={items.length < 20} onClick={() => load(page + 1)}>
            下一页
          </Button>
        </div>
      )}

      {/* 详情抽屉 */}
      <Drawer open={!!openDetailItem} onOpenChange={(open) => !open && setOpenDetailId(null)}>
        <DrawerContent className={`${colors.cardBg} ${colors.dividerColor}`}>
          <DrawerHeader className={`${colors.borderColor}`}>
            <DrawerTitle className={colors.titleColor}>
              {auditType === "report" ? "举报详情" : "悬赏取消详情"}
            </DrawerTitle>
          </DrawerHeader>
          <div className={`p-4 text-sm ${colors.textSecondary}`}>
            {auditType === "report" && openDetailItem && (
              <div className="space-y-2">
                <div>
                  目标：{openDetailItem.topicId ? `话题 ${openDetailItem.topicId}` : `帖子 ${openDetailItem.postId}`}
                </div>
                <div className="flex items-center gap-2">
                  <span className={colors.textMuted}>原因：</span>
                  <Badge color="blue" size="sm">{toReportReasonLabel(openDetailItem.reason)}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className={colors.textMuted}>状态：</span>
                  <Badge color={String(openDetailItem.status ?? "").toLowerCase() === "pending" ? "yellow" : String(openDetailItem.status ?? "").toLowerCase() === "resolved" ? "green" : "red"} size="sm">
                    {toReportStatusLabel(openDetailItem.status)}
                  </Badge>
                </div>
                {openDetailItem.description && <div>说明：{openDetailItem.description}</div>}
              </div>
            )}
            {auditType === "bounty-cancel" && openDetailItem && (
              <div className="space-y-2">
                <div>话题：{openDetailItem.topic?.title || openDetailItem.topicId}</div>
                <div>金额：{openDetailItem.amount}</div>
                <div className="flex items-center gap-2">
                  <span className={colors.textMuted}>状态：</span>
                  <Badge color={String(openDetailItem.cancelRequestStatus ?? "").toLowerCase() === "pending" ? "yellow" : String(openDetailItem.cancelRequestStatus ?? "").toLowerCase() === "approved" ? "green" : "red"} size="sm">
                    {toBountyStatusLabel(openDetailItem.cancelRequestStatus)}
                  </Badge>
                </div>
                {openDetailItem.cancelRequestReason && (
                  <div className="flex items-center gap-2">
                    <span className={colors.textMuted}>理由：</span>
                    <Badge color="blue" size="sm">{openDetailItem.cancelRequestReason}</Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* 驳回理由弹窗 */}
      <Dialog open={rejectOpen} onOpenChange={(open) => setRejectOpen(open)}>
        <DialogContent className={`${colors.cardBg} ${colors.dividerColor}`}>
          <DialogHeader>
            <DialogTitle className={colors.titleColor}>填写驳回理由</DialogTitle>
          </DialogHeader>
          <div className={`text-sm ${colors.textSecondary}`}>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入驳回理由"
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="cancel" onClick={() => setRejectOpen(false)}>
              取消
            </Button>
            <Button
              variant="danger"
              disabled={!rejectReason || rejectReason.trim().length < 2}
              onClick={async () => {
                if (!rejectTarget) return;
                const note = rejectReason.trim();
                if (rejectTarget.type === "report") {
                  await handleReport(rejectTarget.id, "reject", { note });
                } else {
                  await reviewBountyCancel(rejectTarget.id, "reject", note);
                }
                setRejectOpen(false);
                setRejectReason("");
                setRejectTarget(null);
              }}
            >
              提交驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ForumAuditCenter;
