import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { StandardSelect } from "@/modules/admin/components/ui/select";
import { CategoryOption, TorrentItem } from "../types";
import { useEffect, useCallback, useState } from "react";
import { ImagesService } from "@/api/services/ImagesService";
import { ImageUpload } from "@/components/ImageUpload";

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
  const [posterAttachmentId, setPosterAttachmentId] = useState<string>("");
  // 剧照 ID 列表
  const [stillAttachmentIds, setStillAttachmentIds] = useState<string[]>([]);
  // 剧照 URL 列表 (回显用)
  const [stillUrls, setStillUrls] = useState<string[]>([]);

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
      setPosterAttachmentId("");
      setStillAttachmentIds([]);
      setStillUrls([]);

      // 注意：这里缺少从 editing 数据中恢复 poster 和 still 的逻辑
      // 假设 editing 对象中有相关字段，如果后端返回了 attachmentId 或 url，应该在这里设置
      // 由于原代码也没有回显逻辑，这里暂保持一致，只做组件替换
    }
  }, [editing, reset]);

  const onSubmit = async (data: FormValues) => {
    await onOk({
      ...data,
      coverAttachmentId: posterAttachmentId || undefined,
      stillAttachmentIds: stillAttachmentIds.length ? stillAttachmentIds : undefined,
    });
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

        <div className="space-y-2">
          <Label>封面（上传后自动绑定附件）</Label>
          {/* 使用 ImageUpload 组件，单图模式 */}
          <ImageUpload
            value={posterAttachmentId}
            onChange={(id, _) => setPosterAttachmentId(id)}
            attachableType="torrent" // 假设 backend 支持此类型，或者通用
            field="cover"
            maxCount={1}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label>剧照（可多选，最多10张）</Label>
          {/* 使用 ImageUpload 组件，多图模式 */}
          <ImageUpload
            value={stillAttachmentIds} // 传入 ID 数组
            defaultPreview={stillUrls} // 传入 URL 数组以便预览 (虽然初始为空)
            onChange={(ids, urls) => {
              setStillAttachmentIds(Array.isArray(ids) ? ids : [ids]);
              setStillUrls(Array.isArray(urls) ? urls : [urls]);
            }}
            attachableType="torrent"
            field="stills"
            maxCount={10}
            className="mt-2"
          />
        </div>
      </form>
    </Modal>
  );
};
