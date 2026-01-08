import { useEffect, useState } from "react";
import { App, Form } from "antd";
import { RolesService } from "@/api/services/RolesService";
import { PermissionsService } from "@/api/services/PermissionsService";
import { ListPermissionsDto } from "@/api/models/ListPermissionsDto";
// import type { Role } from "../types";
import type { Permission } from "@/modules/admin/pages/users-security/permissions/perms/types/permission";
import type { Role } from "../types";

export const useRoleManagement = () => {
  const { message, modal } = App.useApp();

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionsAdmin, setPermissionsAdmin] = useState<Permission[]>([]);
  const [permissionsWeb, setPermissionsWeb] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 表单实例，配合 Modal+Form 实现校验与提交流程
  const [form] = Form.useForm();
  // 仍保留 keys 映射与权限 key 映射逻辑（用于权限分配）
  const [roleKeys, setRoleKeys] = useState<Record<string, string>>({});
  const [permissionIdToKey, setPermissionIdToKey] = useState<Record<string, string>>({});
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);
  const [selectedWebIds, setSelectedWebIds] = useState<string[]>([]);

  useEffect(() => {
    loadRoles();
    loadPermissions();
    //@ts-ignore
  }, [page, searchText]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await RolesService.rolesControllerListRoles({
        page,
        limit: pageSize,
        name: searchText || undefined,
      });
      const items = response.data?.items ?? [];
      const mapped: Role[] = items.map((r: any) => ({
        id: r.id,
        key: r.key,
        name: r.name,
        description: r.description ?? "",
        permissions_count: r.permissionsCount ?? r.permissions_count ?? 0,
        created_at: r.createdAt ?? r.created_at ?? "",
        updated_at: r.updatedAt ?? r.updated_at ?? "",
      }));
      const keysMap: Record<string, string> = {};
      items.forEach((r: any) => {
        keysMap[r.id] = r.key;
      });
      setRoleKeys(keysMap);
      setRoles(mapped);
      setTotal(response.data?.total ?? 0);
    } catch (error) {
      console.error("加载角色失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const [respAdmin, respWeb] = await Promise.all([
        PermissionsService.permissionsCoreControllerListPermissionsTree({
          scope: ListPermissionsDto.scope.ADMIN,
        }),
        PermissionsService.permissionsCoreControllerListPermissionsTree({
          scope: ListPermissionsDto.scope.WEB,
        }),
      ]);
      const itemsAdmin = respAdmin.data ?? [];
      const itemsWeb = respWeb.data ?? [];

      const idKeyMap: Record<string, string> = {};
      itemsAdmin.forEach((p) => {
        if (p.id && p.key) {
          idKeyMap[p.id] = p.key;
        }
      });
      itemsWeb.forEach((p) => {
        if (p.id && p.key) {
          idKeyMap[p.id] = p.key;
        }
      });
      setPermissionIdToKey(idKeyMap);

      const buildTree = (items: any[], scope: "admin" | "web") => {
        const map = new Map<string, Permission & { children: Permission[] }>();
        items.forEach((p) => {
          if (!p.id) return;
          map.set(p.id, {
            id: p.id,
            key: p.key!,
            name: p.name!,
            description: p.description ?? undefined,
            type: p.type as any,
            scope,
            parent_id: p.parentId ?? undefined,
            children: [],
            created_at: p.createdAt,
            updated_at: p.updatedAt,
          });
        });
        const childIds = new Set<string>();
        const nodes = Array.from(map.values());
        nodes.forEach((node) => {
          const pid = node.parent_id;
          if (pid && map.has(pid)) {
            (map.get(pid) as any).children.push(node);
            childIds.add(node.id);
            return;
          }
          let parentKey: string | undefined;
          if (node.type === "button") {
            parentKey = node.key.split("/").slice(0, -1).join("/");
          } else if (node.type === "api") {
            parentKey = node.key.split(":")[0];
          }
          if (parentKey) {
            const expectedType =
              node.type === "button" ? "page" : node.type === "api" ? "button" : undefined;
            const parentNode = nodes.find(
              (n) =>
                n.key === parentKey &&
                n.scope === node.scope &&
                (!expectedType || n.type === expectedType),
            );
            if (parentNode) {
              (parentNode as any).children.push(node);
              childIds.add(node.id);
            }
          }
        });
        return nodes.filter((n) => !childIds.has(n.id));
      };

      setPermissionsAdmin(buildTree(itemsAdmin, "admin"));
      setPermissionsWeb(buildTree(itemsWeb, "web"));
    } catch (error) {
      console.error("加载权限失败:", error);
    }
  };

  const handleAdd = () => {
    setEditingRole(null);
    // 打开弹窗前重置表单字段，并要求用户手动输入角色键 key
    // 原因：key 作为后端唯一标识，应显式由管理员确定，避免自动生成造成语义不清或冲突
    form.setFieldsValue({ key: "", name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      key: role.key || roleKeys[role.id],
      name: role.name,
      description: role.description,
    });
    setIsModalOpen(true);
  };

  // 删除角色：通过 Antd 的确认弹窗与消息提示统一交互
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await RolesService.rolesControllerRemove({ id });
      message.success("删除成功");
      await loadRoles();
    } catch (error) {
      console.error("删除角色失败:", error);
      message.error("删除失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 删除前确认：包装确认流程，避免误操作
  const confirmDelete = (id: string) => {
    modal.confirm({
      title: "确定要删除这个角色吗？",
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () => handleDelete(id),
    });
  };

  // 表单提交：使用 antd Form 的 onFinish，统一校验与提交流程
  // 支持在添加角色时显式输入 key；编辑时不允许修改 key，仅更新名称与描述
  const handleSubmit = async (values: { key?: string; name: string; description: string }) => {
    setLoading(true);

    try {
      if (editingRole) {
        await RolesService.rolesControllerUpdate({
          id: editingRole.id,
          data: { name: values.name, description: values.description },
        });
        message.success("保存成功");
      } else {
        // 使用用户输入的 key 创建角色；增加基础校验与规范化
        const rawKey = (values.key || "").trim();
        const key = rawKey.toLowerCase();
        await RolesService.rolesControllerCreate({
          key,
          name: values.name,
          description: values.description,
        });
        message.success("添加成功");
      }
      setIsModalOpen(false);
      await loadRoles();
    } catch (error) {
      console.error("保存角色失败:", error);
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 取消自动生成 key，改为由用户在创建时明确输入（见 Form.Item[name="key"])。

  const handleAssignPermissions = async (role: Role) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
    try {
      const resp = await RolesService.rolesAclControllerRolePermissions({
        id: role.id,
      });
      const perms = resp.data ?? [];
      const adminIds = perms
        .filter((p: any) => p.scope === "admin")
        .map((p: any) => p.id)
        .filter(Boolean);
      const webIds = perms
        .filter((p: any) => p.scope === "web")
        .map((p: any) => p.id)
        .filter(Boolean);
      setSelectedAdminIds(adminIds);
      setSelectedWebIds(webIds);
    } catch {}
  };

  const getPermissionCount = (ids?: string[]) =>
    Array.isArray(ids) ? ids.length : selectedAdminIds.length + selectedWebIds.length;

  return {
    roles,
    permissionsAdmin,
    permissionsWeb,
    isModalOpen,
    setIsModalOpen,
    isPermissionModalOpen,
    setIsPermissionModalOpen,
    editingRole,
    selectedRole,
    loading,
    searchText,
    setSearchText,
    page,
    setPage,
    pageSize,
    total,
    form,
    roleKeys,
    permissionIdToKey,
    selectedAdminIds,
    setSelectedAdminIds,
    selectedWebIds,
    setSelectedWebIds,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSubmit,
    handleAssignPermissions,
    getPermissionCount,
    loadRoles,
  };
};
