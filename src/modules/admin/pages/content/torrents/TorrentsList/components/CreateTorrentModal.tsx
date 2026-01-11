import { Form, FormInstance, Input, Modal, Select, Switch } from "antd";
import { CreateTorrentDto } from "@/api/models/CreateTorrentDto";
import { CategoryOption } from "../types";

interface CreateTorrentModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  confirmLoading: boolean;
  form: FormInstance<CreateTorrentDto>;
  categories: CategoryOption[];
}

export const CreateTorrentModal = ({
  open,
  onCancel,
  onOk,
  confirmLoading,
  form,
  categories,
}: CreateTorrentModalProps) => {
  return (
    <Modal
      title="新增种子"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="保存"
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="种子名称" rules={[{ required: true }]}>
          <Input placeholder="请输入种子名称" />
        </Form.Item>
        <Form.Item name="category" label="分类" rules={[{ required: true }]}>
          <Select placeholder="请选择分类" options={categories} />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
        <Form.Item name="isAnonymous" label="匿名发布" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
