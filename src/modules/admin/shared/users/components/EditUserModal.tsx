import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { toast } from "sonner";
import { UsersService } from "@/api/services/UsersService";
import type { UserDto } from "@/api/models/UserDto";
import type { UpdateUserBodyDto } from "@/api/models/UpdateUserBodyDto";

const formSchema = z.object({
  id: z.string().min(1, "缺少用户ID"),
  email: z.string().email("邮箱格式不忽略").optional().or(z.literal("")),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserModalProps {
  editOpen: boolean;
  setEditOpen: (v: boolean) => void;
  editingUser: UserDto | null;
  fetchList: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  editOpen,
  setEditOpen,
  editingUser,
  fetchList,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (editOpen && editingUser) {
      reset({
        id: editingUser.id || "",
        email: editingUser.email || "",
        password: "",
      });
    }
  }, [editOpen, editingUser, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: UpdateUserBodyDto = {
        id: values.id,
        email: values.email || undefined,
        password: values.password || undefined,
      };
      await UsersService.usersControllerUpdate(payload);
      toast.success("更新成功");
      setEditOpen(false);
      fetchList();
    } catch (e: any) {
      toast.error(e?.message || "更新失败");
    }
  };

  return (
    <Modal
      title="编辑用户"
      open={editOpen}
      onClose={() => setEditOpen(false)}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isSubmitting}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">邮箱</Label>
          <Input id="email" {...register("email")} placeholder="更新邮箱" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">新密码</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="不修改可留空"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
      </div>
    </Modal>
  );
};
