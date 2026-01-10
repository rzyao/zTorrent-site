import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import type { RecordItem } from "../types";
import type { RevokePunishmentDto } from "@/api/models/RevokePunishmentDto";
import { PunishmentsService } from "@/api/services/PunishmentsService";

interface RevokePunishmentModalProps {
  revokeOpen: boolean;
  setRevokeOpen: (v: boolean) => void;
  revokeTarget: RecordItem | null;
  revokeForm: any;
  revokeReasonOptions: { label: string; value: string }[];
  revokeReasonLoading: boolean;
  revokeLoading: boolean;
  setRevokeLoading: (v: boolean) => void;
  fetchList: (params: { page: number; limit: number }) => void;
  page: number;
  pageSize: number;
  message: any;
}

export const RevokePunishmentModal: React.FC<RevokePunishmentModalProps> = ({
  revokeOpen,
  setRevokeOpen,
  revokeTarget,
  revokeForm,
  revokeReasonOptions,
  revokeReasonLoading,
  revokeLoading,
  setRevokeLoading,
  fetchList,
  page,
  pageSize,
  message,
}) => {
  const handleRevoke = async () => {
    try {
      const values = await revokeForm.validateFields();
      if (!revokeTarget?.id) return;
      setRevokeLoading(true);
      const req: RevokePunishmentDto = {
        id: revokeTarget.id, // DTO expects 'id' for punishmentId
        revokeReason: values.reason, // DTO expects 'revokeReason'
        revokeDetailReason: values.detailReason, // DTO expects 'revokeDetailReason'
      };
      // 说明：后端API方法名为 punishmentsControllerRevoke�?punishments/revoke�?
      await PunishmentsService.punishmentsControllerRevoke(req);
      message.success("撤销成功");
      setRevokeOpen(false);
      fetchList({ page, limit: pageSize });
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.message || "撤销失败");
    } finally {
      setRevokeLoading(false);
    }
  };

  return (
    <Modal
      title="撤销处罚"
      open={revokeOpen}
      onCancel={() => setRevokeOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setRevokeOpen(false)}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={revokeLoading}
          onClick={handleRevoke}
        >
          确定撤销
        </Button>,
      ]}
    >
      <Form form={revokeForm} layout="vertical">
        <Form.Item
          name="reason"
          label="撤销原因"
          rules={[{ required: true, message: "请选择撤销原因" }]}
        >
          <Select
            options={revokeReasonOptions}
            loading={revokeReasonLoading}
            placeholder="请选择撤销原因"
          />
        </Form.Item>
        <Form.Item name="detailReason" label="撤销说明 (可�?">
          <Input.TextArea rows={3} placeholder="请输入撤销说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
