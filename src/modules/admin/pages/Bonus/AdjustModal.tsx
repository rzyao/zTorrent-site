import { App, Form, Input, Modal, Radio } from "antd";
import { useEffect } from "react";
import { BonusAdminService } from "@/api/services/BonusAdminService";

export function AdjustModal(props: {
  open: boolean;
  onClose: () => void;
  userId?: string;
  isFrozen?: 0 | 1;
  onDone?: () => void;
}) {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.open) {
      form.resetFields();
      if (props.userId) form.setFieldsValue({ userId: props.userId });
    }
  }, [props.open, props.userId]);

  async function handleOk() {
    try {
      const v = await form.validateFields();
      if (props.isFrozen === 1 && String(v.delta).startsWith("-")) {
        message.error("账户已冻结，禁止负向调账");
        return;
      }
      await BonusAdminService.bonusAccountControllerAdminAdjust({
        userId: v.userId,
        delta: String(v.delta),
        reason: v.reason,
        externalRef: v.externalRef,
        correlationId: v.correlationId,
        refType: v.refType,
        refId: v.refId,
      });
      message.success("调账成功");
      props.onClose();
      props.onDone?.();
    } catch {
      /* 验证失败或请求异常 */
    }
  }

  return (
    <Modal
      title="手工调账"
      open={props.open}
      onOk={handleOk}
      onCancel={props.onClose}
      okText="提交"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="用户ID" name="userId" rules={[{ required: true }]}>
          <Input placeholder="目标用户ID" />
        </Form.Item>
        <Form.Item label="变动值" name="delta" rules={[{ required: true }]}>
          <Input placeholder="字符串大整数，负数为扣减" />
        </Form.Item>
        <Form.Item label="原因" name="reason" rules={[{ required: true }]}>
          <Input placeholder="必填，用于审计与业务场景标识" />
        </Form.Item>
        <Form.Item label="幂等键 externalRef" name="externalRef" tooltip="建议填写以避免重复执行">
          <Input placeholder="可选，唯一键" />
        </Form.Item>
        <Form.Item label="关联ID correlationId" name="correlationId">
          <Input placeholder="可选，用于业务配对" />
        </Form.Item>
        <Form.Item label="引用类型 refType" name="refType">
          <Input placeholder="可选，例如 ORDER/TICKET" />
        </Form.Item>
        <Form.Item label="引用ID refId" name="refId">
          <Input placeholder="可选" />
        </Form.Item>
        <Form.Item
          label="冻结状态"
          help={props.isFrozen === 1 ? "冻结账户仅允许正向入账" : "当前为正常状态"}
        >
          <Radio.Group value={props.isFrozen === 1 ? 1 : 0} disabled>
            <Radio value={0}>正常</Radio>
            <Radio value={1}>已冻结</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
