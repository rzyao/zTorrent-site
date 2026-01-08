import React from "react";
import { Modal, Form, Select, Input, App } from "antd";
import type { FormInstance } from "antd";
import { RolesService } from "@/api/services/RolesService";
import { PermissionsService } from "@/api/services/PermissionsService";

interface AssignRolesModalProps {
  assignOpen: boolean;
  setAssignOpen: (v: boolean) => void;
  assignForm: FormInstance;
  assigning: boolean;
  setAssigning: (v: boolean) => void;
  rolesOptions: any[];
  rolesLoading: boolean;
  fetchList: () => void;
}

export const AssignRolesModal: React.FC<AssignRolesModalProps> = ({
  assignOpen,
  setAssignOpen,
  assignForm,
  assigning,
  setAssigning,
  rolesOptions,
  rolesLoading,
  fetchList,
}) => {
  const { message } = App.useApp();

  const handleFinish = async (values: any) => {
    setAssigning(true);
    try {
      const userId = String(values.userId);
      const roles: string[] | undefined = Array.isArray(values.roles) ? values.roles : undefined;
      const permissionKeys: string[] | undefined = Array.isArray(values.permissionKeys)
        ? values.permissionKeys
        : undefined;
      if (roles && roles.length) {
        await RolesService.rolesAclControllerAssignRoles({
          userId,
          roleKeys: roles,
        } as any);
      }
      if (permissionKeys && permissionKeys.length) {
        await PermissionsService.permissionsAssignmentControllerAssign({
          userId,
          permissionKeys,
        } as any);
      }
      message.success("分配完成");
      setAssignOpen(false);
      fetchList();
    } catch (e: any) {
      message.error(e?.message || "分配失败");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Modal
      title="分配角色/权限到用户（覆盖式）"
      open={assignOpen}
      onCancel={() => setAssignOpen(false)}
      onOk={() => assignForm.submit()}
      confirmLoading={assigning}
      destroyOnHidden
    >
      <Form form={assignForm} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="用户ID" name="userId" rules={[{ required: true, message: "缺少用户ID" }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="角色列表" name="roles">
          <Select
            mode="tags"
            tokenSeparators={[",", " "]}
            placeholder="输入或选择角色名"
            options={rolesOptions}
            loading={rolesLoading}
          />
        </Form.Item>
        <Form.Item label="权限键列表" name="permissionKeys">
          <Select mode="tags" tokenSeparators={[",", " "]} placeholder="输入权限键并回车" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
