import React from "react";
import { Modal, Form, Input, App } from "antd";
import type { FormInstance } from "antd";
import { UsersService } from "@/api/services/UsersService";
import type { UpdateUserBodyDto } from "@/api/models/UpdateUserBodyDto";

interface EditUserModalProps {
  editOpen: boolean;
  setEditOpen: (v: boolean) => void;
  editForm: FormInstance<UpdateUserBodyDto>;
  fetchList: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  editOpen,
  setEditOpen,
  editForm,
  fetchList,
}) => {
  const { message } = App.useApp();

  const handleOk = () => {
    const toArray = (v: any): string[] | undefined => {
      if (v == null || v === "") return undefined;
      if (Array.isArray(v)) return v;
      if (typeof v === "string")
        return v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      return undefined;
    };

    editForm
      .validateFields()
      .then(async (values: any) => {
        try {
          const payload: UpdateUserBodyDto = {
            id: values.id,
            email: values.email,
            password: values.password,
            roles: toArray(values.roles),
            permissions: toArray(values.permissions),
          };
          await UsersService.usersControllerUpdate(payload);
          message.success("更新成功");
          setEditOpen(false);
          fetchList();
        } catch (e: any) {
          message.error(e?.message || "更新失败");
        }
      })
      .catch(() => void 0);
  };

  return (
    <Modal
      title="编辑用户"
      open={editOpen}
      onCancel={() => setEditOpen(false)}
      onOk={handleOk}
    >
      <Form form={editForm} layout="vertical">
        <Form.Item
          name="id"
          hidden
          rules={[{ required: true, message: "缺少用户ID" }]}
        >
          <Input type="hidden" id="edit-user-id" />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input placeholder="更新邮箱" />
        </Form.Item>
        <Form.Item label="新密�? name="password">
          <Input.Password placeholder="不修改可留空" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
