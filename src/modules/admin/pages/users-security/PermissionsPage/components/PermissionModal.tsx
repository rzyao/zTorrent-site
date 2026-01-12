import { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { Permission, PermissionScope } from "../types";
import { PERMISSION_TYPE_OPTIONS } from "../constants";

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
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingItem) {
        form.setFieldsValue({
          key: editingItem.key,
          name: editingItem.name,
          type: editingItem.type,
          description: editingItem.description,
          sort: 1, // 默认或从后端获取，目前 API 没返回
        });
      } else {
        // 自动根据父级建议 Prefix (之前逻辑)
        // 这里简化为重置，因为 parentId 变了
        form.resetFields();
        form.setFieldsValue({
          scope,
          sort: 1,
          type: "page",
        });
      }
    }
  }, [open, editingItem, scope, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onOk(values);
  };

  return (
    <Modal
      open={open}
      title={editingItem ? "编辑权限" : parentId ? "添加子权限" : "添加权限"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editingItem ? "保存" : "添加"}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {!editingItem && (
          <Form.Item
            label="权限键"
            name="key"
            rules={[{ required: true, message: "请输入权限键" }]}
            initialValue={`${scope}/`}
          >
            <Input placeholder={`${scope}/users/create`} />
          </Form.Item>
        )}
        <Form.Item
          label="权限名称"
          name="name"
          rules={[{ required: true, message: "请输入权限名称" }]}
        >
          <Input placeholder="例如：创建用户" />
        </Form.Item>
        <Form.Item
          label="权限类型"
          name="type"
          rules={[{ required: true, message: "请选择权限类型" }]}
        >
          <Select
            options={PERMISSION_TYPE_OPTIONS.map((opt) => ({
              label: `${opt.label} - ${opt.description}`,
              value: opt.value,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="排序值"
          name="sort"
          initialValue={1}
          rules={[{ required: true, message: "请输入排序值" }]}
        >
          <Input type="number" min={0} placeholder="越小越靠前，如 1" />
        </Form.Item>
        <Form.Item label="作用范围" name="scope" initialValue={scope}>
          <Select
            options={[
              {
                label: scope === "admin" ? "后台管理端" : "用户端网页",
                value: scope,
              },
            ]}
            disabled
          />
        </Form.Item>
        <Form.Item label="权限描述" name="description">
          <Input.TextArea rows={3} placeholder="权限的详细描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
