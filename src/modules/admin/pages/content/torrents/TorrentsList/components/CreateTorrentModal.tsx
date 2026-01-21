import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { StandardSelect } from "@/modules/admin/components/ui/select";
import { Switch } from "@/modules/admin/components/ui/switch";
import { CategoryOption } from "../types";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "请输入种子名称"),
  category: z.string().min(1, "请选择分类"),
  description: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTorrentModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => Promise<void>;
  confirmLoading: boolean;
  categories: CategoryOption[];
}

export const CreateTorrentModal = ({
  open,
  onCancel,
  onOk,
  confirmLoading,
  categories,
}: CreateTorrentModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isAnonymous: false,
    },
  });

  const isAnonymous = watch("isAnonymous");
  const category = watch("category");

  // 当弹窗打开时重置表单
  useEffect(() => {
    if (open) {
      reset({
        name: "",
        category: "",
        description: "",
        isAnonymous: false,
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    await onOk(data);
  };

  return (
    <Modal
      title="新增种子"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={confirmLoading}
      okText="保存"
    >
      <form className="space-y-4 py-2" onSubmit={handleSubmit(onSubmit)}>
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

        <div className="flex items-center space-x-2">
          <Switch checked={isAnonymous} onCheckedChange={(v) => setValue("isAnonymous", v)} />
          <Label>匿名发布</Label>
        </div>
      </form>
    </Modal>
  );
};
