import { Button, Form, Input, InputNumber, Select, App } from "antd";
import type { AdjustBonusDto } from "@/modules/admin/types/store";

interface AdjustmentFormProps {
  onAdjust: (values: any) => Promise<void>;
  loading?: boolean;
}

export function AdjustmentForm({ onAdjust, loading }: AdjustmentFormProps) {
  const [form] = Form.useForm<AdjustBonusDto>();
  const { modal } = App.useApp();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      modal.confirm({
        title: "确认执行人工调账？",
        content: `用户 ${values.userId}，金额 ${values.amount}，类型 ${values.type}，原因 ${values.reason}`,
        onOk: async () => {
          await onAdjust(values);
          form.resetFields();
        },
      });
    } catch (err) {
      // 这里的错误通常是表单校验失败，不需要额外处理
    }
  };

  return (
    <Form form={form} layout="inline" className="mb-4">
      <Form.Item name="userId" label="用户ID" rules={[{ required: true }]}>
        <Input placeholder="输入用户ID" className="w-[180px]" />
      </Form.Item>
      <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
        <InputNumber className="w-[160px]" />
      </Form.Item>
      <Form.Item name="type" label="类型" rules={[{ required: true }]}>
        <Select
          className="w-[140px]"
          options={[
            { label: "credit(加)", value: "credit" },
            { label: "debit(减)", value: "debit" },
          ]}
        />
      </Form.Item>
      <Form.Item name="reason" label="原因" rules={[{ required: true, min: 2 }]}>
        <Input className="w-[240px]" placeholder="填写原因以便审计" />
      </Form.Item>
      <Form.Item name="ref" label="引用" tooltip="关联单据/工单号(可选)">
        <Input className="w-[200px]" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          提交调账
        </Button>
      </Form.Item>
    </Form>
  );
}
