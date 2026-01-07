import React from "react";
import { Modal, Form, Input, InputNumber, Switch, Space, Button } from "antd";
import type { LevelItem } from "../types";

interface LevelEditModalProps {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  editing: LevelItem | null;
  form: any;
  onFinish: (values: any) => void;
  levels: LevelItem[];
}

export const LevelEditModal: React.FC<LevelEditModalProps> = ({
  editOpen,
  setEditOpen,
  editing,
  form,
  onFinish,
  levels,
}) => {
  return (
    <Modal
      open={editOpen}
      title={editing ? "编辑等级" : "新增等级"}
      onCancel={() => setEditOpen(false)}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={
          editing
            ? {
                key: editing.key,
                label: editing.label,
                rank: editing.rank,
                description: editing.description,
                isActive: editing.isActive,
              }
            : { key: "", label: "", rank: undefined, description: "" }
        }
      >
        {!editing && (
          <Form.Item
            name="key"
            label="等级键（唯一标识）"
            tooltip="仅限字母（大小写）、数字与短横线；用于后端唯一标识"
            rules={[
              { required: true, message: "请输入等级键" },
              { min: 2, message: "不少于2个字符" },
              { max: 50, message: "不超过50个字符" },
              {
                pattern: /^[A-Za-z0-9-]+$/,
                message: "仅限字母、数字与短横线",
              },
              {
                validator: async (_, value) => {
                  const v = String(value || "");
                  if (!v) return Promise.resolve();
                  const exists = levels.some((l) => l.key === v);
                  if (exists)
                    return Promise.reject(new Error("该等级键已存在，请更换"));
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="例如：p1 或 novice" allowClear />
          </Form.Item>
        )}
        <Form.Item
          name="label"
          label="显示名称"
          rules={[
            { required: true, message: "请输入显示名称" },
            { max: 50, message: "不超过50字符" },
          ]}
        >
          <Input placeholder="例如：P1 或 新手" />
        </Form.Item>
        <Form.Item
          name="rank"
          label="排序/权重"
          rules={[
            {
              type: "number",
              min: 0,
              message: "排序必须为不小于0的整数",
            },
          ]}
        >
          <InputNumber
            min={0}
            step={1}
            style={{ width: "100%" }}
            placeholder="越大越靠前（可选）"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ max: 200, message: "不超过200字符" }]}
        >
          <Input.TextArea rows={3} placeholder="可选，描述该等级用途" />
        </Form.Item>
        {editing && (
          <Form.Item name="isActive" label="是否启用" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={() => setEditOpen(false)}>取消</Button>
          <Button type="primary" htmlType="submit">
            {editing ? "保存" : "添加"}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};
