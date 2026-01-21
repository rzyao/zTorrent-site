import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";
import type { Role } from "../types";

const roleSchema = z.object({
  key: z
    .string()
    .min(3, "不少于3个字符")
    .max(50, "不超过50个字符")
    .regex(/^[a-z0-9-]+$/, "仅限小写字母、数字与短横线"),
  name: z.string().min(1, "请输入角色名称").max(50, "名称不超过50字符"),
  description: z.string().min(1, "请输入角色描述").max(200, "描述不超过200字符"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleEditModalProps {
  isModalOpen: boolean;
  editingRole: Role | null;
  onCancel: () => void;
  loading: boolean;
  onFinish: (values: RoleFormValues) => Promise<void>;
}

export const RoleEditModal: React.FC<RoleEditModalProps> = ({
  isModalOpen,
  editingRole,
  onCancel,
  loading,
  onFinish,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      if (editingRole) {
        reset({
          key: editingRole.key,
          name: editingRole.name,
          description: editingRole.description || "",
        });
      } else {
        reset({
          key: "",
          name: "",
          description: "",
        });
      }
    }
  }, [isModalOpen, editingRole, reset]);

  return (
    <Modal
      open={isModalOpen}
      title={editingRole ? "编辑角色" : "添加角色"}
      onClose={onCancel}
      onOk={handleSubmit(onFinish)}
      confirmLoading={loading}
      okText={editingRole ? "保存" : "添加"}
      cancelText="取消"
      width={500}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            角色键（唯一标识） <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="例如：content-admin 或 editor"
            disabled={!!editingRole}
            {...register("key")}
          />
          {errors.key && <p className="text-sm text-red-500">{errors.key.message}</p>}
          {!errors.key && !editingRole && (
            <p className="text-muted-foreground text-xs">
              只允许小写字母、数字与短横线；用于后端唯一标识
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            角色名称 <span className="text-red-500">*</span>
          </Label>
          <Input placeholder="例如：内容管理员" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>
            角色描述 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            placeholder="描述该角色的职责和权限范围"
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
