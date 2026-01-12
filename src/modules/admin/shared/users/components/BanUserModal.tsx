import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";
import { toast } from "sonner";
import { PunishmentsService } from "@/api/services/PunishmentsService";

const formSchema = z.object({
  punishType: z.string().min(1, "请选择处罚类型"),
  reason: z.string().min(1, "请选择封禁原因"),
  detailReason: z.string().optional(),
  banDays: z.string().min(1, "请选择封禁时长"), // Select value is string
});

type FormValues = z.infer<typeof formSchema>;

interface BanUserModalProps {
  banOpen: boolean;
  setBanOpen: (v: boolean) => void;
  banTargetId: string | undefined;
  punishTypeOptions: { label: string; value: string }[];
  banReasonOptions: { label: string; value: string }[];
  banTimeOptions: { label: string; value: number }[];
  banDictLoading: boolean;
  punishTypesLoading: boolean;
  fetchList: () => void;
}

export const BanUserModal: React.FC<BanUserModalProps> = ({
  banOpen,
  setBanOpen,
  banTargetId,
  punishTypeOptions,
  banReasonOptions,
  banTimeOptions,
  banDictLoading,
  punishTypesLoading,
  fetchList,
}) => {
  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      punishType: "",
      reason: "",
      detailReason: "",
      banDays: "",
    },
  });

  // Watch values for controlled components if needed, or rely on RHF Controller logic.
  // Shadcn Select needs explicit onValueChange binding.

  const punishType = watch("punishType");
  const reason = watch("reason");
  const banDays = watch("banDays");

  useEffect(() => {
    if (banOpen) {
      reset({
        punishType: "",
        reason: "",
        detailReason: "",
        banDays: "",
      });
    }
  }, [banOpen, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!banTargetId) return;
    try {
      await PunishmentsService.punishmentsControllerApplyPunishment({
        userId: banTargetId,
        type: values.punishType,
        reason: values.reason,
        detailReason: values.detailReason,
        durationDays: Number(values.banDays),
      } as any);
      toast.success("封禁成功");
      setBanOpen(false);
      fetchList();
    } catch (e: any) {
      toast.error(e?.message || "封禁失败");
    }
  };

  return (
    <Modal
      title="封禁用户"
      open={banOpen}
      onClose={() => setBanOpen(false)}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isSubmitting}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>处罚类型</Label>
          <Select
            value={punishType}
            onValueChange={(val) => setValue("punishType", val, { shouldValidate: true })}
            disabled={punishTypesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择处罚类型" />
            </SelectTrigger>
            <SelectContent>
              {punishTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.punishType && <p className="text-sm text-red-500">{errors.punishType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>封禁原因</Label>
          <Select
            value={reason}
            onValueChange={(val) => setValue("reason", val, { shouldValidate: true })}
            disabled={banDictLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择封禁原因" />
            </SelectTrigger>
            <SelectContent>
              {banReasonOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>详细原因</Label>
          <Textarea
            placeholder="可选，输入封禁的详细原因"
            className="resize-none"
            {
              // Register props for textarea
              ...{
                onChange: (e) => setValue("detailReason", e.target.value),
                onBlur: () => {},
                name: "detailReason",
                ref: () => {},
              }
            }
            // Better: use register directly
            {...{
              ...register("detailReason"),
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>封禁时长</Label>
          <Select
            value={banDays}
            onValueChange={(val) => setValue("banDays", val, { shouldValidate: true })}
            disabled={banDictLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择封禁时长" />
            </SelectTrigger>
            <SelectContent>
              {banTimeOptions.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.banDays && <p className="text-sm text-red-500">{errors.banDays.message}</p>}
        </div>
      </div>
    </Modal>
  );
};
