import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { PermissionsService } from "@/api/services/PermissionsService";
import { ListPermissionsDto } from "@/api/models/ListPermissionsDto";
import { CreatePermissionDto } from "@/api/models/CreatePermissionDto";
import { UpdatePermissionRequestDto as UpdatePermissionDto } from "@/api/models/UpdatePermissionRequestDto";
import { Permission, PermissionType, PermissionScope } from "../types";

interface UsePermissionsLogicProps {
  scope: PermissionScope;
}

export function usePermissionsLogic({ scope }: UsePermissionsLogicProps) {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [parentId, setParentId] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<PermissionType | "">("");
  const [searchText, setSearchText] = useState("");

  // 1. 获取数据
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["permissions", scope, typeFilter],
    queryFn: async () => {
      if (typeFilter) {
        // 模式 1：指定类型的扁平列表
        const resp = await PermissionsService.permissionsCoreControllerListPermissions({
          scope: scope === "admin" ? ListPermissionsDto.scope.ADMIN : ListPermissionsDto.scope.WEB,
          type:
            typeFilter === "page"
              ? ListPermissionsDto.type.PAGE
              : typeFilter === "button"
                ? ListPermissionsDto.type.BUTTON
                : ListPermissionsDto.type.API,
          page: 1,
          limit: 1000, // 权限通常不多，拉取全部
        });
        const items = resp.data?.items ?? [];
        return items.map((p) => ({
          id: p.id,
          key: p.key,
          name: p.name,
          description: p.description ?? undefined,
          type: p.type as any,
          scope,
          parent_id: p.parentId ?? undefined,
          children: [],
          created_at: p.createdAt,
          updated_at: p.updatedAt,
        }));
      } else {
        // 模式 2：完整树形结构
        const resp = await PermissionsService.permissionsCoreControllerListPermissionsTree({
          scope: scope === "admin" ? ListPermissionsDto.scope.ADMIN : ListPermissionsDto.scope.WEB,
        });
        const items = resp.data ?? [];
        const map = new Map<string, Permission & { children: Permission[] }>();

        items.forEach((p) => {
          map.set(p.id!, {
            id: p.id!,
            key: p.key!,
            name: p.name!,
            description: p.description ?? undefined,
            type: p.type as any as PermissionType,
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

          // Fallback: 根据 Key 路径逻辑推断父级 (保留原逻辑)
          let parentKey: string | undefined;
          if (node.type === "button") {
            parentKey = node.key.split("/").slice(0, -1).join("/");
          } else if (node.type === "api") {
            parentKey = node.key.split(":")[0];
          }

          if (parentKey) {
            const expectedType: PermissionType | undefined =
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

        const roots = nodes.filter((n) => !childIds.has(n.id));
        // 默认展开根节点
        if (expandedIds.size === 0) {
          setExpandedIds(new Set(roots.map((p) => p.id)));
        }
        return roots;
      }
    },
  });

  // 2. 过滤逻辑
  const filteredPermissions = useMemo(() => {
    if (!searchText) return permissions;
    const search = searchText.toLowerCase();

    const filter = (perms: Permission[]): Permission[] => {
      return perms
        .filter((p) => {
          const match =
            p.name.toLowerCase().includes(search) ||
            p.key.toLowerCase().includes(search) ||
            p.description?.toLowerCase().includes(search);

          if (match) return true;
          if (p.children && p.children.length > 0) {
            const filteredChildren = filter(p.children);
            return filteredChildren.length > 0;
          }
          return false;
        })
        .map((p) => ({
          ...p,
          children: p.children ? filter(p.children) : undefined,
        }));
    };

    return filter(permissions);
  }, [permissions, searchText]);

  // 3. 变更操作 (Mutations)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => PermissionsService.permissionsCoreControllerRemove({ id }),
    onSuccess: () => {
      message.success("删除成功");
      queryClient.invalidateQueries({ queryKey: ["permissions", scope] });
    },
    onError: () => message.error("删除失败"),
  });

  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingPermission) {
        return PermissionsService.permissionsCoreControllerUpdate({
          id: editingPermission.id,
          name: values.name,
          description: values.description,
          type: values.type as any,
          scope:
            scope === "admin" ? UpdatePermissionDto.scope.ADMIN : UpdatePermissionDto.scope.WEB,
          parentId: parentId || undefined,
          sort: Number(values.sort ?? 1),
          sorts: String(values.sort ?? 1),
          parentIds: parentId ? String(parentId) : undefined,
          urls: "",
        } as any);
      } else {
        return PermissionsService.permissionsCoreControllerCreate({
          key: values.key,
          name: values.name,
          description: values.description,
          type: values.type as any,
          scope:
            scope === "admin" ? CreatePermissionDto.scope.ADMIN : CreatePermissionDto.scope.WEB,
          parentId: parentId || undefined,
          sort: Number(values.sort ?? 1),
          sorts: String(values.sort ?? 1),
          parentIds: parentId ? String(parentId) : undefined,
          urls: "",
        });
      }
    },
    onSuccess: () => {
      message.success("保存成功");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["permissions", scope] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "保存失败";
      message.error(msg);
    },
  });

  // 4. 事件处理
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleAdd = (parent?: Permission) => {
    setEditingPermission(null);
    setParentId(parent?.id || "");
    setIsModalOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setParentId(permission.parent_id || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    permissions: filteredPermissions,
    loading: isLoading || deleteMutation.isPending || saveMutation.isPending,
    expandedIds,
    toggleExpand,
    searchText,
    setSearchText,
    typeFilter,
    setTypeFilter,
    isModalOpen,
    setIsModalOpen,
    editingPermission,
    parentId,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit: saveMutation.mutate,
  };
}
