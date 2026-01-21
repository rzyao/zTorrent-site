import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";
import { Switch } from "@/modules/admin/components/ui/switch";
import { PunishmentDictsService } from "@/api/services/PunishmentDictsService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { PUNISHMENT_TYPE_CATEGORY, PunishmentType } from "./types";

// 表单验证规则
const formSchema = z.object({
  key: z.string().min(1, "键值不能为空"),
  label: z.string().min(1, "显示名称不能为空"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  sort: z.number().default(0),
});

type FormValues = z.infer<typeof formSchema>;

interface PunishmentTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: PunishmentType | null;
  onSuccess: () => void;
}

/**
 * 处罚类型编辑/新增弹窗组件
 */
export const PunishmentTypeModal: React.FC<PunishmentTypeModalProps> = ({
  open,
  onOpenChange,
  record,
  onSuccess,
}) => {
  const isEdit = !!record;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      sort: 0,
    },
  });

  const enabledValue = watch("enabled");

  // 弹窗打开时重置表单
  useEffect(() => {
    if (open) {
      if (record) {
        reset({
          key: record.key,
          label: record.label,
          description: record.description || "",
          enabled: record.enabled ?? true,
          sort: record.sort ?? 0,
        });
      } else {
        reset({
          enabled: true,
          sort: 0,
          key: "",
          label: "",
          description: "",
        });
      }
    }
  }, [open, record, reset]);

  const { execute, loading } = useAsyncAction({
    successMessage: isEdit ? "修改成功" : "创建成功",
    onSuccess: () => {
      onOpenChange(false);
      onSuccess();
    },
  });

  const onSubmit = (data: FormValues) => {
    execute(async () => {
      if (isEdit && record) {
        // 更新
        await PunishmentDictsService.punishmentDictsControllerUpdate({
          id: record.id,
          data: {
            label: data.label,
            description: data.description,
            enabled: data.enabled,
            sort: data.sort,
          },
        });
      } else {
        // 创建
        await PunishmentDictsService.punishmentDictsControllerCreate({
          key: data.key,
          label: data.label,
          category: PUNISHMENT_TYPE_CATEGORY,
          description: data.description,
          enabled: data.enabled,
          sort: data.sort,
        });
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title={isEdit ? "编辑处罚类型" : "新增处罚类型"}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={loading}
      width={500}
    >
      <form className="space-y-4">
        {/* 键值 */}
        <div className="grid gap-2">
          <Label htmlFor="key" className="text-neutral-900">
            键值 <span className="text-error">*</span>
          </Label>
          <Input
            id="key"
            placeholder="请输入键值 (如: warning, ban)"
            {...register("key")}
            disabled={isEdit}
          />
          {errors.key && <p className="text-error text-xs">{errors.key.message}</p>}
        </div>

        {/* 显示名称 */}
        <div className="grid gap-2">
          <Label htmlFor="label" className="text-neutral-900">
            显示名称 <span className="text-error">*</span>
          </Label>
          <Input id="label" placeholder="请输入显示名称 (如: 警告, 封禁)" {...register("label")} />
          {errors.label && <p className="text-error text-xs">{errors.label.message}</p>}
        </div>

        {/* 排序权重 */}
        <div className="grid gap-2">
          <Label htmlFor="sort" className="text-neutral-900">
            排序权重
          </Label>
          <Input id="sort" type="number" {...register("sort", { valueAsNumber: true })} />
        </div>

        {/* 描述说明 */}
        <div className="grid gap-2">
          <Label htmlFor="description" className="text-neutral-900">
            描述说明
          </Label>
          <Textarea id="description" placeholder="请输入详细描述" {...register("description")} />
        </div>

        {/* 启用开关 */}
        <div className="flex items-center gap-2">
          <Switch
            id="enabled"
            checked={enabledValue}
            onCheckedChange={(checked) => setValue("enabled", checked)}
          />
          <Label htmlFor="enabled" className="cursor-pointer text-neutral-900">
            是否启用
          </Label>
        </div>
      </form>
    </Modal>
  );
};
