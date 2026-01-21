import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";
import { Permission, PermissionScope } from "../types";
import { PERMISSION_TYPE_OPTIONS } from "../constants";

const permissionSchema = z.object({
  key: z.string().min(1, "请输入权限键"),
  name: z.string().min(1, "请输入权限名称"),
  type: z.string().min(1, "请选择权限类型"),
  sort: z.coerce.number().min(0, "排序值必须大等于0"),
  scope: z.string(),
  description: z.string().optional(),
});

type PermissionFormValues = z.infer<typeof permissionSchema>;

interface PermissionModalProps {
  open: boolean;
  editingItem: Permission | null;
  parentId: string;
  scope: PermissionScope;
  loading: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

export function PermissionModal({
  open,
  editingItem,
  parentId,
  scope,
  loading,
  onCancel,
  onOk,
}: PermissionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      key: "",
      name: "",
      type: "page",
      sort: 1,
      scope: scope,
      description: "",
    },
  });

  const typeValue = watch("type");

  useEffect(() => {
    if (open) {
      if (editingItem) {
        reset({
          key: editingItem.key,
          name: editingItem.name,
          type: editingItem.type,
          description: editingItem.description || "",
          sort: 1, // API usually doesn't return sort, default to 1
          scope: scope,
        });
      } else {
        reset({
          key: `${scope}/`,
          name: "",
          type: "page",
          sort: 1,
          scope: scope,
          description: "",
        });
      }
    }
  }, [open, editingItem, scope, reset]);

  return (
    <Modal
      open={open}
      title={editingItem ? "编辑权限" : parentId ? "添加子权限" : "添加权限"}
      onClose={onCancel}
      onOk={handleSubmit(onOk)}
      confirmLoading={loading}
      okText={editingItem ? "保存" : "添加"}
      width={500}
    >
      <div className="space-y-4">
        {!editingItem && (
          <div className="space-y-2">
            <Label>
              权限键 <span className="text-red-500">*</span>
            </Label>
            <Input placeholder={`${scope}/users/create`} {...register("key")} />
            {errors.key && <p className="text-sm text-red-500">{errors.key.message}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label>
            权限名称 <span className="text-red-500">*</span>
          </Label>
          <Input placeholder="例如：创建用户" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>
            权限类型 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={typeValue}
            onValueChange={(val) => setValue("type", val)}
            options={PERMISSION_TYPE_OPTIONS.map((opt) => ({
              label: `${opt.label} - ${opt.description}`,
              value: opt.value,
            }))}
          />
          {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>
            排序值 <span className="text-red-500">*</span>
          </Label>
          <Input type="number" min={0} {...register("sort")} />
          {errors.sort && <p className="text-sm text-red-500">{errors.sort.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>作用范围</Label>
          <Select
            disabled
            value={scope}
            options={[
              {
                label: scope === "admin" ? "后台管理端" : "用户端网页",
                value: scope,
              },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>权限描述</Label>
          <Textarea rows={3} placeholder="权限的详细描述" {...register("description")} />
        </div>
      </div>
    </Modal>
  );
}
