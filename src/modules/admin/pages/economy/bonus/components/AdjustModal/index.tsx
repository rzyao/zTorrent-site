import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { BonusAdminService } from "@/api/services/BonusAdminService";

const formSchema = z.object({
  userId: z.string().min(1, "请输入用户ID"),
  delta: z.string().min(1, "请输入变动值"),
  reason: z.string().min(1, "请输入原因"),
  externalRef: z.string().optional(),
  correlationId: z.string().optional(),
  refType: z.string().optional(),
  refId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AdjustModal(props: {
  open: boolean;
  onClose: () => void;
  userId?: string;
  isFrozen?: 0 | 1;
  onDone?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (props.open) {
      reset({
        userId: props.userId || "",
        delta: "",
        reason: "",
        externalRef: "",
        correlationId: "",
        refType: "",
        refId: "",
      });
    }
  }, [props.open, props.userId, reset]);

  const onSubmit = async (values: FormValues) => {
    if (props.isFrozen === 1 && String(values.delta).startsWith("-")) {
      toast.error("账户已冻结，禁止负向调账");
      return;
    }

    try {
      await BonusAdminService.bonusAccountControllerAdminAdjust({
        userId: values.userId,
        delta: values.delta,
        reason: values.reason,
        externalRef: values.externalRef || undefined,
        correlationId: values.correlationId || undefined,
        refType: values.refType || undefined,
        refId: values.refId || undefined,
      });
      toast.success("调账成功");
      props.onClose();
      props.onDone?.();
    } catch (e: any) {
      toast.error(e?.message || "调账失败");
    }
  };

  return (
    <Modal
      title="手工调账"
      open={props.open}
      onCancel={props.onClose}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isSubmitting}
      okText="提交"
    >
      <form className="space-y-4 py-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label required>用户ID</Label>
          <Input {...register("userId")} placeholder="目标用户ID" />
          {errors.userId && <p className="text-xs text-red-500">{errors.userId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label required>变动值</Label>
          <Input {...register("delta")} placeholder="字符串大整数，负数为扣减" />
          {errors.delta && <p className="text-xs text-red-500">{errors.delta.message}</p>}
        </div>

        <div className="space-y-2">
          <Label required>原因</Label>
          <Input {...register("reason")} placeholder="必填，用于审计与业务场景标识" />
          {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>幂等键 (externalRef)</Label>
            <Input {...register("externalRef")} placeholder="唯一键" />
          </div>
          <div className="space-y-2">
            <Label>关联ID (correlationId)</Label>
            <Input {...register("correlationId")} placeholder="业务配对" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>引用类型 (refType)</Label>
            <Input {...register("refType")} placeholder="如 ORDER/TICKET" />
          </div>
          <div className="space-y-2">
            <Label>引用ID (refId)</Label>
            <Input {...register("refId")} placeholder="引用ID" />
          </div>
        </div>

        <div className="rounded-md bg-neutral-50 p-3 text-sm">
          <div className="mb-1 font-medium text-neutral-700">账户状态</div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${props.isFrozen === 1 ? "bg-red-500" : "bg-green-500"}`}
            />
            <span className="text-neutral-600">
              {props.isFrozen === 1 ? "已冻结 (仅允许正向入账)" : "正常状态"}
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
