import { Controller } from "react-hook-form";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";
import { categoryOptions, priorityOptions } from "../constants";

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  control: any;
  errors: any;
  onFinish: () => void;
  loading?: boolean;
}

export function TicketModal({
  open,
  onOpenChange,
  control,
  errors,
  onFinish,
  loading,
}: TicketModalProps) {
  return (
    <Modal
      title="新建工单"
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={onFinish}
      confirmLoading={loading}
      width={600}
    >
      <div className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label required>标题</Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} maxLength={200} placeholder="请输入工单标题" />
            )}
          />
          {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label required>类别</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={categoryOptions}
                  placeholder="请选择类别"
                />
              )}
            />
            {errors.category && (
              <p className="text-destructive text-xs">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label required>优先级</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={priorityOptions}
                  placeholder="请选择优先级"
                />
              )}
            />
            {errors.priority && (
              <p className="text-destructive text-xs">{errors.priority.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label required>内容</Label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder="请详细描述问题场景与期望" rows={5} />
            )}
          />
          {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
        </div>
      </div>
    </Modal>
  );
}
