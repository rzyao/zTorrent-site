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
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const getActionTitle = () => {
    switch (action) {
      case "resolve":
        return t('reports.actions.resolve');
      case "reject":
        return t('reports.actions.reject');
      case "delete_content":
        return t('reports.actions.deleteContent');
      case "ban_user":
        return t('reports.actions.banUser');
      default:
        return "";
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case "resolve":
        return t('reports.descriptions.resolve');
      case "reject":
        return t('reports.descriptions.reject');
      case "delete_content":
        return t('reports.descriptions.deleteContent');
      case "ban_user":
        return t('reports.descriptions.banUser');
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

      toast.success(t('reports.success'));
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
          <label className="mb-2 block text-sm font-medium text-neutral-300">{t('reports.handlerNote')}</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('reports.notePlaceholder')}
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
            {t('app.cancel')}
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
            {loading ? t('reports.processing') : t('app.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
