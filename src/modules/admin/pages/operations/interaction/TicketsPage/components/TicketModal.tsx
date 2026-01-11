import { Form } from "antd";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { categoryOptions, priorityOptions } from "../constants";

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  onFinish: () => Promise<void>;
  loading?: boolean;
}

export function TicketModal({ open, onOpenChange, form, onFinish, loading }: TicketModalProps) {
  return (
    <Modal
      title="新建工单"
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={onFinish}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="title" label="标题" rules={[{ required: true, message: "请输入标题" }]}>
          <Input maxLength={200} placeholder="请输入工单标题" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label="类别"
            rules={[{ required: true, message: "请选择类别" }]}
          >
            <Select options={categoryOptions} />
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: "请选择优先级" }]}
          >
            <Select options={priorityOptions} />
          </Form.Item>
        </div>

        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: "请输入描述内容" }]}
        >
          <Textarea placeholder="请详细描述问题场景与期望" rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
