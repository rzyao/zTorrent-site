import { useState } from "react";
import { Flag, RefreshCw } from "lucide-react";
import { PageContainer } from "@/modules/app/components/PageContainer";
import { Button } from "@/modules/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/app/components/ui/select";
import { useReportData } from "./hooks/useReportData";
import { ReportStats } from "./components/ReportStats";
import { ReportList } from "./components/ReportList";
import { ReportActionDialog } from "./components/ReportActionDialog";
import { ForumReport } from "@/api/models/ForumReport";

export default function ReportsPage() {
  const { items, total, limit, page, setPage, status, setStatus, stats, isLoading, refetch } =
    useReportData();

  const [selectedReport, setSelectedReport] = useState<ForumReport | null>(null);
  const [actionType, setActionType] = useState<
    "resolve" | "reject" | "delete_content" | "ban_user" | null
  >(null);

  const handleAction = (
    report: ForumReport,
    action: "resolve" | "reject" | "delete_content" | "ban_user",
  ) => {
    setSelectedReport(report);
    setActionType(action);
  };

  const handleCloseDialog = () => {
    setSelectedReport(null);
    setActionType(null);
  };

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30">
            <Flag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">举报管理</h1>
            <p className="mt-1 text-sm text-neutral-400">查看并处理来自用户的举报</p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          className="border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          刷新数据
        </Button>
      </div>

      <ReportStats stats={stats} />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val as any);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] border-neutral-800 bg-[#1a1f26] text-neutral-200">
              <SelectValue placeholder="筛选状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="resolved">已解决</SelectItem>
              <SelectItem value="rejected">已驳回</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-neutral-500">共 {total} 条记录</div>
      </div>

      <ReportList items={items} isLoading={isLoading} onAction={handleAction} />

      <div className="mt-4 flex justify-end gap-2">
        {/* 简单的分页逻辑 */}
        <Button
          variant="outline"
          disabled={page === 1 || isLoading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="border-neutral-700 hover:bg-neutral-800"
        >
          上一页
        </Button>
        <Button
          variant="outline"
          disabled={items.length < limit || isLoading}
          onClick={() => setPage((p) => p + 1)}
          className="border-neutral-700 hover:bg-neutral-800"
        >
          下一页
        </Button>
      </div>

      <ReportActionDialog
        report={selectedReport}
        action={actionType}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
