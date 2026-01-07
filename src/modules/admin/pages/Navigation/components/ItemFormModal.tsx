/**
 * 导航项表单弹窗组件
 * 用于新建和编辑导航项
 */
import React from "react";
import {
  ModalForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import type { NavigationItem } from "@/types/navigation";
import { ROLE_OPTIONS } from "../constants";

export interface ItemFormModalProps {
  /** 弹窗是否可见 */
  open: boolean;
  /** 弹窗可见状态变更回调 */
  onOpenChange: (open: boolean) => void;
  /** 表单提交回调，返回 true 关闭弹窗 */
  onFinish: (values: ItemFormValues) => Promise<boolean>;
  /** 弹窗类型：create 创建 / edit 编辑 */
  modalType: "create" | "edit";
  /** 当前编辑的项（编辑模式下使用） */
  currentItem: NavigationItem | null;
  /** 树形数据（用于父级选择器） */
  treeData: NavigationItem[];
}

/**
 * 表单值类型
 */
export interface ItemFormValues {
  label: string;
  path: string;
  parentId?: string;
  isVisible?: boolean;
  permissions?: string[];
}

/**
 * 导航项表单弹窗
 */
export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  open,
  onOpenChange,
  onFinish,
  modalType,
  currentItem,
  treeData,
}) => {
  return (
    <ModalForm<ItemFormValues>
      // 使用 key 强制重新初始化表单，确保 initialValues 在编辑时生效
      key={currentItem?.id || "create"}
      title={
        modalType === "create" ? "New Navigation Item" : "Edit Navigation Item"
      }
      open={open}
      onOpenChange={onOpenChange}
      onFinish={onFinish}
      initialValues={currentItem || { isVisible: true }}
      modalProps={{ destroyOnHidden: true }}
    >
      <ProFormText
        name="label"
        label="Label"
        required
        rules={[{ required: true }]}
      />
      <ProFormText
        name="path"
        label="Path"
        required
        rules={[{ required: true }]}
      />
      <ProFormTreeSelect
        name="parentId"
        label="Parent Item"
        placeholder="Select parent (Optional)"
        fieldProps={{
          treeData: treeData as any[],
          fieldNames: { label: "label", value: "id", children: "children" },
          treeDefaultExpandAll: true,
          allowClear: true,
          variant: "outlined", // 使用新 API 替代废弃的 bordered
        }}
      />
      <ProFormSwitch name="isVisible" label="Visible" />
      <ProFormSelect
        name="permissions"
        label="Permissions"
        mode="multiple"
        options={[...ROLE_OPTIONS]}
      />
    </ModalForm>
  );
};

export default ItemFormModal;
