import { Form, FormInstance, Input, Modal } from "antd";

interface ReviewModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance<{ note?: string }>;
  reviewAction: "approve" | "reject";
}

export const ReviewModal = ({ open, onCancel, onOk, form, reviewAction }: ReviewModalProps) => {
  return (
    <Modal
      title={reviewAction === "approve" ? "审核通过" : "审核驳回"}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="提交"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="note" label="备注（≤500字）">
          <Input.TextArea rows={4} maxLength={500} showCount placeholder="请输入备注原因（可选）" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
