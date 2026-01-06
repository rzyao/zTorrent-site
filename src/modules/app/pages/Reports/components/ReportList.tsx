import { MoreHorizontal, AlertTriangle } from "lucide-react";
import { ForumReport } from "@/api/models/ForumReport";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReportListProps {
  items: ForumReport[];
  isLoading: boolean;
  onAction: (
    report: ForumReport,
    action: "resolve" | "reject" | "delete_content" | "ban_user",
  ) => void;
}

export function ReportList({ items, isLoading, onAction }: ReportListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge outline color="yellow" className="bg-yellow-500/10">
            待处理
          </Badge>
        );
      case "resolved":
        return (
          <Badge outline color="green" className="bg-green-500/10">
            已解决
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            outline
            color="gray"
            className="border-neutral-500/30 bg-neutral-500/10 text-neutral-500"
          >
            已驳回
          </Badge>
        );
      default:
        return <Badge outline>{status}</Badge>;
    }
  };

  const getReasonLabel = (reason: string) => {
    const map: Record<string, string> = {
      spam: "垃圾广告",
      abuse: "恶意攻击",
      inappropriate: "不当内容",
      copyright: "侵犯版权",
      other: "其他原因",
    };
    return map[reason] || reason;
  };

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-500">加载中...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-[#1a1f26] p-12 text-neutral-500">
        <AlertTriangle className="mb-4 h-10 w-10 opacity-50" />
        <p>暂无举报数据</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-[#1a1f26]">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-800 hover:bg-transparent">
            <TableHead className="w-[100px]">状态</TableHead>
            <TableHead className="w-[120px]">原因</TableHead>
            <TableHead>描述</TableHead>
            <TableHead className="w-[150px]">对象</TableHead>
            <TableHead className="w-[150px]">举报人</TableHead>
            <TableHead className="w-[150px]">时间</TableHead>
            <TableHead className="w-[80px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((report: any) => (
            <TableRow key={report.id} className="border-neutral-800 hover:bg-neutral-800/50">
              <TableCell>{getStatusBadge(report.status)}</TableCell>
              <TableCell className="font-medium text-neutral-300">
                {getReasonLabel(report.reason)}
              </TableCell>
              <TableCell
                className="max-w-[300px] truncate text-neutral-400"
                title={report.description}
              >
                {report.description || "-"}
              </TableCell>
              <TableCell className="text-neutral-300">
                {report.topicId ? (
                  <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                    话题 #{report.topicId}
                  </span>
                ) : report.postId ? (
                  <span className="rounded bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">
                    回复 #{report.postId}
                  </span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-neutral-400">
                {/* 暂时假设后端可能 populated user 对象，如果只有 ID 则显示 ID */}
                {report.reporter?.username || report.reporterId || "未知"}
              </TableCell>
              <TableCell className="text-xs text-neutral-500">
                {report.createdAt
                  ? new Date(report.createdAt).toLocaleString("zh-CN", {
                      hour12: false,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {report.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => onAction(report, "resolve")}>
                          标记已解决
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction(report, "delete_content")}>
                          删除内容
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction(report, "reject")}>
                          驳回/忽略
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => onAction(report, "ban_user")}
                      className="text-red-500 focus:text-red-500"
                    >
                      封禁用户
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
