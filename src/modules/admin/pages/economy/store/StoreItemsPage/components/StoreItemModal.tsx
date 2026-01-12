import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { StoreItem } from "@/modules/admin/types/store";
import { StoreService } from "@/api/services/StoreService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { toast } from "sonner"; // Ensure we use sonner if useAsyncAction doesn't cover validation errors

interface StoreItemModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingItem: StoreItem | null;
}

const storeItemSchema = z.object({
  key: z.string().min(1, "唯一键必填"),
  title: z.string().min(1, "名称必填"),
  type: z.enum(["virtual", "privilege", "service"]),
  pricePoints: z.coerce.number().min(0, "价格必须大于等于0"),
  stock: z.coerce.number().optional().nullable(),
  status: z.enum(["active", "inactive"]),
  id: z.string().optional(),
});

type StoreItemFormValues = z.infer<typeof storeItemSchema>;

export function StoreItemModal({ open, onClose, onSuccess, editingItem }: StoreItemModalProps) {
  const isEdit = !!editingItem;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StoreItemFormValues>({
    resolver: zodResolver(storeItemSchema),
    defaultValues: {
      type: "virtual",
      status: "inactive",
      pricePoints: 0,
      stock: undefined,
    },
  });

  const { execute: submit, loading } = useAsyncAction({
    successMessage: isEdit ? "更新商品成功" : "新增商品成功",
    onSuccess: () => {
      onClose();
      onSuccess();
    },
  });

  useEffect(() => {
    if (open) {
      if (editingItem) {
        reset({
          key: editingItem.key,
          title: editingItem.title,
          type: editingItem.type,
          pricePoints: editingItem.pricePoints,
          stock: editingItem.stock,
          status: editingItem.status,
          id: editingItem.id,
        });
      } else {
        reset({
          key: "",
          title: "",
          type: "virtual",
          pricePoints: 0,
          stock: undefined,
          status: "inactive",
          id: undefined,
        });
      }
    }
  }, [open, editingItem, reset]);

  const onFormSubmit = async (values: StoreItemFormValues) => {
    await submit(async () => {
      if (isEdit && editingItem?.id) {
        const { key: _omitKey, ...payload } = values;
        await StoreService.storeControllerUpdateItem({
          ...payload,
          id: editingItem.id,
        } as any);
      } else {
        await StoreService.storeControllerCreateItem(values as any);
      }
    });
  };

  return (
    <Modal
      title={isEdit ? "编辑商品" : "新增商品"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit(onFormSubmit)}
      confirmLoading={loading}
      width={480}
    >
      <div className="space-y-4">
        {isEdit && (
          <div className="space-y-2">
            <Label>ID</Label>
            <Input value={editingItem?.id} disabled className="bg-stone-50 text-stone-500" />
          </div>
        )}

        <div className="space-y-2">
          <Label>唯一键 (Key) *</Label>
          <Controller
            control={control}
            name="key"
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  placeholder="如 invite_code"
                  disabled={isEdit}
                  className={isEdit ? "bg-stone-50 text-stone-500" : ""}
                />
                {errors.key && <p className="text-xs text-red-500">{errors.key.message}</p>}
                <p className="text-muted-foreground text-xs">商品的唯一标识符，创建后不可修改</p>
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>名称 (Title) *</Label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <>
                <Input {...field} placeholder="输入商品展示名称" />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>类型 (Type) *</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={[
                    { value: "virtual", label: "Virtual (虚拟物品)" },
                    { value: "privilege", label: "Privilege (特权)" },
                    { value: "service", label: "Service (服务)" },
                  ]}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>价格 (魔力) *</Label>
            <Controller
              control={control}
              name="pricePoints"
              render={({ field }) => (
                <>
                  <Input {...field} type="number" step="100" min="0" placeholder="0" />
                  {errors.pricePoints && (
                    <p className="text-xs text-red-500">{errors.pricePoints.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>库存 (Stock)</Label>
            <Controller
              control={control}
              name="stock"
              render={({ field }) => (
                <Input
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? null : Number(val));
                  }}
                  type="number"
                  min="0"
                  placeholder="不限"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>状态 (Status) *</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={[
                    { value: "active", label: "Active (已上架)" },
                    { value: "inactive", label: "Inactive (已下架)" },
                  ]}
                />
              )}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
