import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Label } from "@/modules/admin/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/modules/admin/components/ui/dialog";
import { Loader2 } from "lucide-react";

const adjustSchema = z.object({
  userId: z.string().min(1, "用户ID必填"),
  amount: z.coerce.number().min(0.01, "金额必须大于0"),
  type: z.enum(["credit", "debit"]),
  reason: z.string().min(2, "原因至少2个字符"),
  ref: z.string().optional(),
});

type AdjustFormValues = z.infer<typeof adjustSchema>;

interface AdjustmentFormProps {
  onAdjust: (values: AdjustFormValues) => Promise<void>;
  loading?: boolean;
}

export function AdjustmentForm({ onAdjust, loading }: AdjustmentFormProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<AdjustFormValues | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustFormValues>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      userId: "",
      amount: undefined,
      type: "credit",
      reason: "",
      ref: "",
    },
  });

  const onSubmit = (values: AdjustFormValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;
    try {
      await onAdjust(pendingValues);
      setConfirmOpen(false);
      setPendingValues(null);
      reset({
        userId: "",
        amount: undefined,
        type: "credit",
        reason: "",
        ref: "",
      });
    } catch {
      // Error handling is managed by hook (sonner)
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label>用户ID</Label>
          <div className="w-[180px]">
            <Controller
              control={control}
              name="userId"
              render={({ field }) => <Input {...field} placeholder="输入用户ID" />}
            />
            {errors.userId && (
              <p className="absolute text-xs text-red-500">{errors.userId.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>金额</Label>
          <div className="w-[160px]">
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <Input {...field} type="number" step="1" min="0" placeholder="0" />
              )}
            />
            {errors.amount && (
              <p className="absolute text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>类型</Label>
          <div className="w-[140px]">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={[
                    { label: "credit(加)", value: "credit" },
                    { label: "debit(减)", value: "debit" },
                  ]}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>原因</Label>
          <div className="w-[240px]">
            <Controller
              control={control}
              name="reason"
              render={({ field }) => <Input {...field} placeholder="填写原因以便审计" />}
            />
            {errors.reason && (
              <p className="absolute text-xs text-red-500">{errors.reason.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>引用 (可选)</Label>
          <div className="w-[200px]">
            <Controller
              control={control}
              name="ref"
              render={({ field }) => <Input {...field} placeholder="关联单据/工单号" />}
            />
          </div>
        </div>

        <div className="pb-0.5">
          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            提交调账
          </Button>
        </div>
      </form>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认执行人工调账？</DialogTitle>
            <DialogDescription>请仔细核对以下信息，此操作执行后将立即生效。</DialogDescription>
          </DialogHeader>

          {pendingValues && (
            <div className="bg-muted/30 space-y-2 rounded-md border p-4 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">用户 ID:</span>
                <span className="font-mono">{pendingValues.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">调账类型:</span>
                <span
                  className={
                    pendingValues.type === "credit"
                      ? "font-bold text-green-600"
                      : "font-bold text-red-600"
                  }
                >
                  {pendingValues.type === "credit" ? "增加 (Credit)" : "扣除 (Debit)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">变动金额:</span>
                <span className="font-mono text-lg">{pendingValues.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">调账原因:</span>
                <span>{pendingValues.reason}</span>
              </div>
              {pendingValues.ref && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">关联单据:</span>
                  <span className="font-mono">{pendingValues.ref}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="default" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={handleConfirm} loading={loading}>
              确认执行
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
