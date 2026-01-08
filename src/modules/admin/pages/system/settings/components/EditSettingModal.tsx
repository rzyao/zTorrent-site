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
import type { SettingGroup, SettingType, SystemSetting } from "../types";

interface EditSettingModalProps {
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
  setting: SystemSetting | null;
}

export const EditSettingModal: React.FC<EditSettingModalProps> = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  setting,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && setting) {
      const group = setting.group;
      const suffix = String(setting.key).split(".").slice(1).join(".") || "";
      form.resetFields();
      form.setFieldsValue({
        group,
        suffix,
        type: setting.type,
        description: setting.description || "",
        mutable: !!setting.mutable,
        sort: typeof setting.sort === "number" ? setting.sort : 0,
      });
    }
  }, [open, setting, form]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      title="编辑配置项"
      okText="保存"
      width={720}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
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
              message: "后缀需以字母开头，仅包含字母/数字/下划线/点/连字符",
            },
          ]}
        >
          <Input />
        </Form.Item>
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
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="可运行时修改" name="mutable" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="排序值" name="sort">
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
