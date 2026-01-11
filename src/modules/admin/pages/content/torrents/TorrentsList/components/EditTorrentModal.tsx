import { Form, FormInstance, Input, Modal, Select } from "antd";
import { UpdateTorrentDto } from "@/api/models/UpdateTorrentDto";
import { CategoryOption, TorrentItem } from "../types";

interface EditTorrentModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance<UpdateTorrentDto>;
  editing: TorrentItem | null;
  categories: CategoryOption[];
}

export const EditTorrentModal = ({
  open,
  onCancel,
  onOk,
  form,
  editing,
  categories,
}: EditTorrentModalProps) => {
  return (
    <Modal
      title="编辑种子"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="保存"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item label="ID">
          <Input value={editing?.id} disabled />
        </Form.Item>
        <Form.Item name="name" label="种子名称" rules={[{ required: true }]}>
          <Input placeholder="请输入种子名称" />
        </Form.Item>
        <Form.Item name="category" label="分类" rules={[{ required: true }]}>
          <Select placeholder="请选择分类" options={categories} />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
