import React from "react";
import { Modal, Form, Select, Input, App } from "antd";
import type { FormInstance } from "antd";
import { PunishmentsService } from "@/api/services/PunishmentsService";

interface BanUserModalProps {
  banOpen: boolean;
  setBanOpen: (v: boolean) => void;
  banForm: FormInstance;
  banTargetId: string | undefined;
  punishTypeOptions: any[];
  banReasonOptions: any[];
  banTimeOptions: any[];
  banDictLoading: boolean;
  punishTypesLoading: boolean;
  fetchList: () => void;
}

export const BanUserModal: React.FC<BanUserModalProps> = ({
  banOpen,
  setBanOpen,
  banForm,
  banTargetId,
  punishTypeOptions,
  banReasonOptions,
  banTimeOptions,
  banDictLoading,
  punishTypesLoading,
  fetchList,
}) => {
  const { message } = App.useApp();

  const handleOk = () => {
    banForm
      .validateFields()
      .then(async (values) => {
        try {
          await PunishmentsService.punishmentsControllerApplyPunishment({
            userId: banTargetId!,
            type: values.punishType,
            reason: values.reason,
            detailReason: values.detailReason,
            durationDays: Number(values.banDays),
          } as any);
          message.success("封禁成功");
          setBanOpen(false);
          fetchList();
        } catch (e: any) {
          message.error(e?.message || "封禁失败");
        }
      })
      .catch(() => void 0);
  };

  return (
    <Modal
      title="封禁用户"
      open={banOpen}
      onCancel={() => setBanOpen(false)}
      onOk={handleOk}
    >
      <Form form={banForm} layout="vertical">
        <Form.Item
          label="处罚类型"
          name="punishType"
          rules={[{ required: true, message: "请选择处罚类型" }]}
        >
          <Select
            placeholder="选择处罚类型"
            options={punishTypeOptions}
            loading={punishTypesLoading}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="封禁原因"
          name="reason"
          rules={[{ required: true, message: "请选择封禁原因" }]}
        >
          <Select
            placeholder="选择封禁原因"
            options={banReasonOptions}
            loading={banDictLoading}
            allowClear
          />
        </Form.Item>
        <Form.Item label="详细原因" name="detailReason">
          <Input.TextArea placeholder="可选，输入封禁的详细原�? rows={3} />
        </Form.Item>
        <Form.Item
          label="封禁时长"
          name="banDays"
          rules={[{ required: true, message: "请选择封禁时长" }]}
        >
          <Select
            placeholder="选择封禁时长"
            options={banTimeOptions.map((opt) => ({
              label: `${opt.label}`,
              value: opt.value,
            }))}
            loading={banDictLoading}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
