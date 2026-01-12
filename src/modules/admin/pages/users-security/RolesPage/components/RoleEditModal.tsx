import React, { useEffect } from "react";
import { Modal, Form, Input, Space, Button } from "antd";
import type { Role } from "../types";

interface RoleEditModalProps {
  isModalOpen: boolean;
  editingRole: Role | null;
  onCancel: () => void;
  loading: boolean;
  onFinish: (values: any) => Promise<void>;
}

export const RoleEditModal: React.FC<RoleEditModalProps> = ({
  isModalOpen,
  editingRole,
  onCancel,
  loading,
  onFinish,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen) {
      if (editingRole) {
        form.setFieldsValue({
          key: editingRole.key,
          name: editingRole.name,
          description: editingRole.description,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          key: "",
          name: "",
          description: "",
        });
      }
    }
  }, [isModalOpen, editingRole, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onFinish(values);
    } catch (e) {
      // validation failed
    }
  };

  return (
    <Modal
      open={isModalOpen}
      title={editingRole ? "编辑角色" : "添加角色"}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {editingRole ? "保存" : "添加"}
        </Button>,
      ]}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="key"
          label="角色键（唯一标识）"
          tooltip="只允许小写字母、数字与短横线；用于后端唯一标识"
          rules={[
            { required: true, message: "请输入角色键" },
            { min: 3, message: "不少于3个字符" },
            { max: 50, message: "不超过50个字符" },
            {
              pattern: /^[a-z0-9-]+$/,
              message: "仅限小写字母、数字与短横线",
            },
            // Removed client-side unique check for simplicity/isolation
          ]}
        >
          <Input placeholder="例如：content-admin 或 editor" allowClear disabled={!!editingRole} />
        </Form.Item>
        <Form.Item
          name="name"
          label="角色名称"
          rules={[
            { required: true, message: "请输入角色名称" },
            { max: 50, message: "名称不超过50字符" },
          ]}
        >
          <Input placeholder="例如：内容管理员" />
        </Form.Item>
        <Form.Item
          name="description"
          label="角色描述"
          rules={[
            { required: true, message: "请输入角色描述" },
            { max: 200, message: "描述不超过200字符" },
          ]}
        >
          <Input.TextArea rows={3} placeholder="描述该角色的职责和权限范围" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
