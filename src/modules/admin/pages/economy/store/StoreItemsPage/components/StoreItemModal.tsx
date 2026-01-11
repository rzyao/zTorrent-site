import { useEffect } from "react";
import { Form, Input, InputNumber } from "antd";
import { Modal } from "@/modules/admin/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { StoreItem } from "@/modules/admin/types/store";
import { StoreService } from "@/api/services/StoreService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";

interface StoreItemModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingItem: StoreItem | null;
}

export function StoreItemModal({ open, onClose, onSuccess, editingItem }: StoreItemModalProps) {
  const [form] = Form.useForm();
  const isEdit = !!editingItem;

  const { execute: submit, loading } = useAsyncAction({
    successMessage: isEdit ? "更新商品成功" : "新增商品成功",
    onSuccess: () => {
      onClose();
      onSuccess();
    },
  });

  useEffect(() => {
    if (open) {
      if (editingItem) {
        form.setFieldsValue({
          ...editingItem,
          stock: editingItem.stock ?? undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          type: "virtual",
          status: "inactive",
        });
      }
    }
  }, [open, editingItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await submit(async () => {
        if (isEdit) {
          const { key: _omitKey, ...payload } = values;
          await StoreService.storeControllerUpdateItem({
            ...payload,
            id: editingItem.id,
          } as any);
        } else {
          await StoreService.storeControllerCreateItem(values as any);
        }
      });
    } catch (error) {
      // 表单校验失败不处理
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑商品" : "新增商品"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={480}
    >
      <Form form={form} layout="vertical" initialValues={{ type: "virtual", status: "inactive" }}>
        {isEdit && (
          <Form.Item name="id" label="ID">
            <Input disabled className="bg-stone-50 text-stone-500" />
          </Form.Item>
        )}

        <Form.Item
          name="key"
          label="唯一键"
          rules={[{ required: true, message: "请输入唯一键" }]}
          tooltip="商品的唯一标识符，创建后不可修改"
        >
          <Input
            placeholder="如 invite_code"
            disabled={isEdit}
            className={isEdit ? "bg-stone-50 text-stone-500" : ""}
          />
        </Form.Item>

        <Form.Item name="title" label="名称" rules={[{ required: true, message: "请输入名称" }]}>
          <Input placeholder="输入商品展示名称" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select
              onValueChange={(value) => form.setFieldValue("type", value)}
              value={form.getFieldValue("type")}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virtual">Virtual (虚拟物品)</SelectItem>
                <SelectItem value="privilege">Privilege (特权)</SelectItem>
                <SelectItem value="service">Service (服务)</SelectItem>
              </SelectContent>
            </Select>
          </Form.Item>

          <Form.Item name="pricePoints" label="价格 (魔力)" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" placeholder="0" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="stock" label="库存 (可选)">
            <InputNumber min={0} className="w-full" placeholder="不限" />
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              onValueChange={(value) => form.setFieldValue("status", value)}
              value={form.getFieldValue("status")}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active (已上架)</SelectItem>
                <SelectItem value="inactive">Inactive (已下架)</SelectItem>
              </SelectContent>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
