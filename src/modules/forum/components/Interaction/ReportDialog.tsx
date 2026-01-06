import { useState } from "react";
import { Flag } from "lucide-react";
import { ForumsReportsService } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { toast } from "sonner";
import { CreateReportDto } from "@/api/models/CreateReportDto";

interface ReportDialogProps {
  targetType: "topic" | "post";
  targetId: string;
  trigger?: React.ReactNode;
}

const REPORT_REASONS = [
  { value: "spam", label: "垃圾广告" },
  { value: "abuse", label: "人身攻击" },
  { value: "inappropriate", label: "违规内容" },
  { value: "copyright", label: "侵权" },
  { value: "other", label: "其他" },
];

export function ReportDialog({ targetType, targetId, trigger }: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<string>("spam");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await ForumsReportsService.reportsControllerCreate({
        reason: reason as any,
        description,
        [targetType === "topic" ? "topicId" : "postId"]: targetId,
      } as CreateReportDto);

      toast.success("举报已提交，感谢您的反馈");
      setIsOpen(false);
      // 重置状态
      setReason("spam");
      setDescription("");
    } catch (error: any) {
      // 错误由拦截器处理，如果是已有的举报后端通常返回 400 或 403
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className="flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            title="举报"
          >
            <Flag className="h-5 w-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>举报内容</DialogTitle>
          <DialogDescription>如果您认为此内容违反了社区准则，请告知我们。</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">原因</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">详细说明 (可选)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请提供更多背景信息..."
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isLoading ? "提交中..." : "提交举报"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
