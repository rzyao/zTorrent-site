import { memo, useCallback } from "react";
import { Form, Select, InputNumber, DatePicker } from "antd";
import type { FormInstance } from "antd";
import { Button } from "@/modules/admin/components/ui/button";
import { Modal } from "@/modules/admin/components/ui/modal";
import { LOGIC_OPTIONS } from "../constants";
import type { SelectOption } from "../types";

interface BatchGrantModalProps {
  open: boolean;
  onClose: () => void;
  form: FormInstance;
  loading: boolean;
  rolesOptions: SelectOption[];
  levelsOptions: SelectOption[];
  previewCount: number;
  onPreview: () => void;
  onSubmit: () => void;
}

/**
 * 批量授予邀请名额弹窗
 * 使用 memo 优化性能
 */
export const BatchGrantModal = memo(function BatchGrantModal({
  open,
  onClose,
  form,
  loading,
  rolesOptions,
  levelsOptions,
  previewCount,
  onPreview,
  onSubmit,
}: BatchGrantModalProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal open={open} onClose={handleClose} title="批量授予邀请名额" className="max-w-[600px]">
      <Form form={form} layout="vertical" className="p-2">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="levels" label="用户等级（多选）">
            <Select mode="multiple" allowClear options={levelsOptions} placeholder="筛选等级" />
          </Form.Item>
          <Form.Item name="roles" label="用户角色（多选）">
            <Select mode="multiple" allowClear options={rolesOptions} placeholder="筛选角色" />
          </Form.Item>
        </div>

        <Form.Item name="logic" label="过滤逻辑" initialValue="OR">
          <Select options={LOGIC_OPTIONS} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="permanent" label="永久名额" initialValue={0}>
            <InputNumber min={0} className="w-full" placeholder="输入数量" />
          </Form.Item>
          <Form.Item name="temporaryCount" label="临时名额" initialValue={0}>
            <InputNumber min={0} className="w-full" placeholder="输入数量" />
          </Form.Item>
        </div>

        <Form.Item name="temporaryExpiresAt" label="临时名额过期时间">
          <DatePicker showTime className="w-full" />
        </Form.Item>

        <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div className="flex gap-2">
            <Button variant="default" onClick={onPreview} loading={loading}>
              预览匹配
            </Button>
            <Button variant="primary" onClick={onSubmit} loading={loading}>
              提交执行
            </Button>
          </div>
          <span className="font-semibold text-blue-600">匹配用户数：{previewCount}</span>
        </div>
      </Form>
    </Modal>
  );
});
