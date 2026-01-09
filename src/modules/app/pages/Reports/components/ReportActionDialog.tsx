import { useState } from "react";
import { toast } from "sonner";
import { ForumReport } from "@/api/models/ForumReport";
import { ForumsReportsService } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/app/components/ui/dialog";
import { Button } from "@/modules/app/components/ui/button";
import { Textarea } from "@/modules/app/components/ui/textarea";

interface ReportActionDialogProps {
  report: ForumReport | null;
  action: "resolve" | "reject" | "delete_content" | "ban_user" | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReportActionDialog({
  report,
  action,
  onClose,
  onSuccess,
}: ReportActionDialogProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const getActionTitle = () => {
    switch (action) {
      case "resolve":
        return "标记已解决";
      case "reject":
        return "驳回举报";
      case "delete_content":
        return "删除内容并解决";
      case "ban_user":
        return "封禁用户";
      default:
        return "";
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case "resolve":
        return "确认该举报已得到妥善处理？这会将状态更新为已解决。";
      case "reject":
        return "确认忽略该举报？这将标记为已驳回。";
      case "delete_content":
        return "确认删除相关内容？该操作不可逆，并会自动将举报标记为已解决。";
      case "ban_user":
        return "确认封禁该用户？请在下方填写封禁原因和时长备注。";
      default:
        return "";
    }
  };

  const handleConfirm = async () => {
    if (!report || !action) return;

    setLoading(true);
    try {
      // 构造请求 DTO
      const dto: any = {
        reportId: (report as any).id, // 强制转换以规避类型定义缺失
        handlerNote: note,
      };

      if (action === "reject") {
        dto.status = "rejected";
      } else {
        // resolve, delete_content, ban_user 都视为 resolved
        dto.status = "resolved";
      }

      if (action === "delete_content") {
        dto.deleteContent = true;
      }

      // ban_user 暂无后端字段支持，仅在备注中体现，或依赖后端增强
      if (action === "ban_user") {
        dto.handlerNote = `[BAN USER] ${note}`;
      }

      await ForumsReportsService.reportsControllerHandle(dto);

      toast.success("操作成功");
      onSuccess();
      onClose();
    } catch (error: any) {
      // 全局拦截器可能已处理
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!report && !!action} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-neutral-800 bg-[#1a1f26] text-neutral-200 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getActionTitle()}</DialogTitle>
          <DialogDescription className="text-neutral-400">
            {getActionDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="mb-2 block text-sm font-medium text-neutral-300">处理备注 (可选)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="请输入处理说明..."
            className="min-h-[100px] border-neutral-700 bg-[#0F171E] text-neutral-200"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={
              action === "delete_content" || action === "ban_user"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }
          >
            {loading ? "处理中..." : "确认"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
