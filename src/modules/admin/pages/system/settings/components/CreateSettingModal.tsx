import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Typography,
} from "antd";
import { GROUP_INFO, SETTING_TYPES } from "../constants";
import type { SettingGroup, SettingType } from "../types";

interface CreateSettingModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    group: SettingGroup;
    suffix: string;
    type: SettingType;
    description?: string;
    mutable?: boolean;
    sort?: number;
  }) => Promise<void>;
  confirmLoading: boolean;
  initialGroup: SettingGroup;
}

export const CreateSettingModal: React.FC<CreateSettingModalProps> = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  initialGroup,
}) => {
  const [form] = Form.useForm();

  // Reset form when opening
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        group: initialGroup,
        type: "string",
        description: "",
        mutable: true,
        sort: 0,
      });
    }
  }, [open, initialGroup, form]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      title="新增配置�?
      okText="创建"
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ group: initialGroup, type: "string" }}
      >
        <Form.Item
          label="分组"
          name="group"
          rules={[{ required: true, message: "请选择分组" }]}
        >
          <Select
            options={GROUP_INFO.map((g) => ({ label: g.name, value: g.key }))}
          />
        </Form.Item>
        <Form.Item
          label="键名后缀"
          name="suffix"
          rules={[
            { required: true, message: "请输入键名后缀" },
            {
              pattern: /^[A-Za-z][\w\-.]*$/,
              message: "后缀需以字母开头，仅包含字�?数字/下划�?�?连字�?,
            },
          ]}
        >
          <Input placeholder="例如：title �?mail.smtp.host" />
        </Form.Item>

        {/* 键名预览：group + '.' + suffix */}
        <Form.Item
          noStyle
          shouldUpdate={(prev, cur) =>
            prev.group !== cur.group || prev.suffix !== cur.suffix
          }
        >
          {() => {
            const g = form.getFieldValue("group") as string;
            const s = form.getFieldValue("suffix") as string;
            const preview = g && s ? `${g}.${s}` : "分组.后缀";
            return (
              <div style={{ marginBottom: 12 }}>
                <Typography.Text type="secondary">完整键：</Typography.Text>
                <Typography.Text code>{preview}</Typography.Text>
              </div>
            );
          }}
        </Form.Item>

        <Form.Item
          label="类型"
          name="type"
          rules={[{ required: true, message: "请选择类型" }]}
        >
          <Select
            options={SETTING_TYPES.map((t) => ({ label: t, value: t }))}
          />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <Input.TextArea rows={3} placeholder="该配置项的用途说�? />
        </Form.Item>

        <Form.Item label="可运行时修改" name="mutable" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="排序�? name="sort">
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
