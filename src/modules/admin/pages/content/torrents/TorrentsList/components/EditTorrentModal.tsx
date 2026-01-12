import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { StandardSelect } from "@/modules/admin/components/ui/select";
import { CategoryOption, TorrentItem } from "../types";
import { useEffect } from "react";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "请输入种子名称"),
  category: z.string().min(1, "请选择分类"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTorrentModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => Promise<void>;
  editing: TorrentItem | null;
  categories: CategoryOption[];
}

export const EditTorrentModal = ({
  open,
  onCancel,
  onOk,
  editing,
  categories,
}: EditTorrentModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const category = watch("category");

  // 当编辑项变化时重置表单
  useEffect(() => {
    if (editing) {
      reset({
        id: editing.id,
        name: editing.name || "",
        category: editing.categoryId || "",
        description: editing.description || "",
      });
    }
  }, [editing, reset]);

  const onSubmit = async (data: FormValues) => {
    await onOk(data);
  };

  return (
    <Modal
      title="编辑种子"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
      okText="保存"
    >
      <form className="space-y-4 py-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label>ID</Label>
          <Input value={editing?.id} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label required>种子名称</Label>
          <Input {...register("name")} placeholder="请输入种子名称" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label required>分类</Label>
          <StandardSelect
            options={categories}
            value={category}
            onValueChange={(v) => setValue("category", v)}
            placeholder="请选择分类"
          />
          {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>描述</Label>
          <textarea
            {...register("description")}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
            placeholder="请输入描述"
          />
        </div>
      </form>
    </Modal>
  );
};
