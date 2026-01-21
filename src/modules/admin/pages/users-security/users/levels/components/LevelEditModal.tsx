import React, { useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";
import { Switch } from "@/modules/admin/components/ui/switch";
import { LevelItem } from "../types";

interface LevelEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: LevelItem | null;
  onSave: (values: any) => Promise<void>;
}

const LevelEditModalComponent: React.FC<LevelEditModalProps> = ({
  open,
  onOpenChange,
  level,
  onSave,
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const isActive = watch("isActive", true);

  useEffect(() => {
    if (open) {
      reset(
        level
          ? {
              key: level.key,
              label: level.label,
              rank: level.rank,
              description: level.description,
              isActive: level.isActive,
            }
          : {
              key: "",
              label: "",
              rank: 0,
              description: "",
              isActive: true,
            },
      );
    }
  }, [open, level, reset]);

  const onSubmit = async (data: any) => {
    await onSave(data);
  };

  return (
    <Modal
      title={level ? "编辑等级" : "新建等级"}
      open={open}
      onClose={() => onOpenChange(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">标识 (Key)</label>
          <Input
            {...register("key", { required: !level })}
            placeholder="例如：p1 或 novice"
            disabled={!!level}
          />
          <p className="text-xs text-neutral-500">
            唯一标识，创建后不可更改。仅限字母、数字与短横线。
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">显示名称 (Label)</label>
          <Input {...register("label", { required: true })} placeholder="例如：P1 或 新手" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">权重 (Rank)</label>
          <Input
            type="number"
            {...register("rank", { valueAsNumber: true })}
            placeholder="越大的 rank 等级越高"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">描述</label>
          <Input {...register("description")} placeholder="可选描述" />
        </div>

        <div className="flex items-center justify-between py-2">
          <label className="text-sm font-medium text-neutral-700">是否启用</label>
          <Switch checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="default" onClick={() => onOpenChange(false)} type="button">
            取消
          </Button>
          <Button variant="primary" type="submit">
            保存
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const LevelEditModal = memo(LevelEditModalComponent);
