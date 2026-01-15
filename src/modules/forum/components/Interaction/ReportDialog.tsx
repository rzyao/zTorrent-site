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
} from "@/modules/forum/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/forum/components/ui/select";
import { ActionButton } from "@/modules/forum/components/ui/ActionButton";
import { cn } from "@/utils/cn";
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
      <DialogContent className="bg-white sm:max-w-[425px] dark:border-neutral-800 dark:bg-[#1E1E1E]">
        <DialogHeader>
          <DialogTitle className="dark:text-neutral-100">举报内容</DialogTitle>
          <DialogDescription className="dark:text-neutral-400">
            如果您认为此内容违反了社区准则，请告知我们。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium dark:text-neutral-200">原因</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full hover:border-[#0088CC] focus:border-[#0088CC]">
                <SelectValue placeholder="选择举报原因" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium dark:text-neutral-200">详细说明 (可选)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请提供更多背景信息..."
              className="flex min-h-[80px] w-full rounded-md border border-transparent bg-neutral-100 px-3 py-2 text-sm transition-colors outline-none hover:border-[#0088CC]/50 focus:border-[#0088CC] disabled:cursor-not-allowed disabled:opacity-50 dark:border-transparent dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:hover:border-[#0088CC]/50 dark:focus:border-[#0088CC]"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            取消
          </button>
          <ActionButton onClick={handleSubmit} loading={isLoading} className="rounded-md">
            提交举报
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
