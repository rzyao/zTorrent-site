import React from "react";
import { Modal, Form, Input, Space, Button } from "antd";
import type { Role } from "../types";

interface RoleEditModalProps {
  isModalOpen: boolean;
  editingRole: Role | null;
  onCancel: () => void;
  form: any;
  loading: boolean;
  onFinish: (values: any) => Promise<void>;
  roleKeys: Record<string, string>;
}

export const RoleEditModal: React.FC<RoleEditModalProps> = ({
  isModalOpen,
  editingRole,
  onCancel,
  form,
  loading,
  onFinish,
  roleKeys,
}) => {
  return (
    <Modal
      open={isModalOpen}
      title={editingRole ? "编辑角色" : "添加角色"}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="key"
          label="角色键（唯一标识�?
          tooltip="只允许小写字母、数字与短横线；用于后端唯一标识"
          rules={
            editingRole
              ? []
              : [
                  { required: true, message: "请输入角色键" },
                  { min: 3, message: "不少�?个字�? },
                  { max: 50, message: "不超�?0个字�? },
                  {
                    pattern: /^[a-z0-9-]+$/,
                    message: "仅限小写字母、数字与短横�?,
                  },
                  {
                    validator: (_, value) => {
                      const v = (value || "").toLowerCase();
                      const existing = new Set(Object.values(roleKeys));
                      if (v && existing.has(v)) {
                        return Promise.reject(
                          new Error("该角色键已存在，请更�?)
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]
          }
        >
          <Input
            placeholder="例如：content-admin �?editor"
            allowClear
            disabled={!!editingRole}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="角色名称"
          rules={[
            { required: true, message: "请输入角色名�? },
            { max: 50, message: "名称不超�?0字符" },
          ]}
        >
          <Input placeholder="例如：内容管理员" />
        </Form.Item>
        <Form.Item
          name="description"
          label="角色描述"
          rules={[
            { required: true, message: "请输入角色描�? },
            { max: 200, message: "描述不超�?00字符" },
          ]}
        >
          <Input.TextArea rows={3} placeholder="描述该角色的职责和权限范�? />
        </Form.Item>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onCancel} disabled={loading}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editingRole ? "保存" : "添加"}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};
