import { useForm } from "react-hook-form";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Label } from "@/modules/admin/components/ui/label";
import { useEffect } from "react";

interface ReviewModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: { note?: string }) => Promise<void>;
  reviewAction: "approve" | "reject";
}

export const ReviewModal = ({ open, onCancel, onOk, reviewAction }: ReviewModalProps) => {
  const { register, handleSubmit, reset } = useForm<{ note?: string }>();

  useEffect(() => {
    if (open) {
      reset({ note: "" });
    }
  }, [open, reset]);

  const onSubmit = async (data: { note?: string }) => {
    await onOk(data);
  };

  return (
    <Modal
      title={reviewAction === "approve" ? "审核通过" : "审核驳回"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
      okText="提交"
    >
      <form className="space-y-4 py-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label>备注（≤500字）</Label>
          <textarea
            {...register("note")}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
            maxLength={500}
            placeholder="请输入备注原因（可选）"
          />
        </div>
      </form>
    </Modal>
  );
};
