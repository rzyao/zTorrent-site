import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/admin/components/ui/dialog";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";

const categorySchema = z.object({
  label: z.string().min(1, "名称不能为空"),
  key: z.string().min(1, "Key不能为空"),
  description: z.string().optional(),
  sort: z.number().default(0),
  enabled: z.boolean().default(true),
  genre: z.nativeEnum(UpdateCategoryDto.genre).default(UpdateCategoryDto.genre.GENERAL),
  parentId: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface MovieCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<CategoryFormValues> | null;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  title: string;
  loading?: boolean;
}

export function MovieCategoryDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  title,
  loading,
}: MovieCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      label: "",
      key: "",
      description: "",
      sort: 0,
      enabled: true,
      genre: UpdateCategoryDto.genre.GENERAL,
    },
  });

  useEffect(() => {
    if (open && initialValues) {
      reset({
        label: initialValues.label || "",
        key: initialValues.key || "",
        description: initialValues.description || "",
        sort: initialValues.sort ?? 0,
        enabled: initialValues.enabled ?? true,
        genre: initialValues.genre || UpdateCategoryDto.genre.GENERAL,
        parentId: initialValues.parentId,
      });
    } else if (!open) {
      reset();
    }
  }, [open, initialValues, reset]);

  const enabled = watch("enabled");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">名称</Label>
            <Input id="label" {...register("label")} placeholder="分类显示名称" />
            {errors.label && <span className="text-error text-xs">{errors.label.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="key">Key</Label>
            <Input id="key" {...register("key")} placeholder="唯一标识符" />
            {errors.key && <span className="text-error text-xs">{errors.key.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="可选描述信息"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sort">排序</Label>
              <Input id="sort" type="number" {...register("sort", { valueAsNumber: true })} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                id="enabled"
                checked={enabled}
                onCheckedChange={(checked) => setValue("enabled", checked)}
              />
              <Label htmlFor="enabled">启用</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="default" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              确定
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
