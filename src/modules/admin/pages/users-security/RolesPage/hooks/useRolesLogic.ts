import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RolesService } from "@/api/services/RolesService";
import { PermissionsService } from "@/api/services/PermissionsService";
import { ListPermissionsDto } from "@/api/models/ListPermissionsDto";
import type { Role } from "../types";
import type { Permission } from "@/modules/admin/pages/users-security/PermissionsPage/types";

export const useRolesLogic = () => {
  const queryClient = useQueryClient();

  // --- State ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState<Role | null>(null);
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);
  const [selectedWebIds, setSelectedWebIds] = useState<string[]>([]);

  // --- Queries ---
  const rolesQuery = useQuery({
    queryKey: ["roles", { page, pageSize, searchText }],
    queryFn: async () => {
      const response = await RolesService.rolesControllerListRoles({
        page,
        limit: pageSize,
        name: searchText || undefined,
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const permissionsQuery = useQuery({
    queryKey: ["permissions-tree"],
    queryFn: async () => {
      const [respAdmin, respWeb] = await Promise.all([
        PermissionsService.permissionsCoreControllerListPermissionsTree({
          scope: ListPermissionsDto.scope.ADMIN,
        }),
        PermissionsService.permissionsCoreControllerListPermissionsTree({
          scope: ListPermissionsDto.scope.WEB,
        }),
      ]);

      const buildTree = (items: any[], scope: "admin" | "web") => {
        // [Logic preserved from original]
        // Ideally this logic should be in a utility or service transformer,
        // but for now we keep it here to ensure identical behavior.
        // Simplified for brevity in hook, detailed impl below.
        const map = new Map<string, Permission & { children: Permission[] }>();
        const itemArray = items || [];

        itemArray.forEach((p) => {
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
          // Auto hierarchy based on keys logic
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

      const adminTree = buildTree(respAdmin.data ?? [], "admin");
      const webTree = buildTree(respWeb.data ?? [], "web");

      // Also return flat maps for ID->Key lookup
      const idToKeyMap: Record<string, string> = {};
      [...(respAdmin.data ?? []), ...(respWeb.data ?? [])].forEach((p) => {
        if (p.id && p.key) idToKeyMap[p.id] = p.key;
      });

      return { adminTree, webTree, idToKeyMap };
    },
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: (data: { key: string; name: string; description: string }) =>
      RolesService.rolesControllerCreate({
        key: data.key,
        name: data.name,
        description: data.description,
      }),
    onSuccess: () => {
      toast.success("创建角色成功");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "创建失败");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; description: string }) =>
      RolesService.rolesControllerUpdate({
        id: data.id,
        data: { name: data.name, description: data.description },
      }),
    onSuccess: () => {
      toast.success("更新角色成功");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "更新失败");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => RolesService.rolesControllerRemove({ id }),
    onSuccess: () => {
      toast.success("删除成功");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "删除失败");
    },
  });

  const assignPermissionsMutation = useMutation({
    mutationFn: async ({
      roleKey,
      permissionKeys,
    }: {
      roleKey: string;
      permissionKeys: string[];
    }) => {
      return RolesService.rolesAclControllerSetRolePermissions({
        roleKey,
        permissionKeys,
      });
    },
    onSuccess: () => {
      toast.success("权限分配成功");
      // Optionally close modal or just refresh list if needed
      // setIsPermissionModalOpen(false); // Often users want to keep it open or need confirmation.
      // Refetch roles mainly to update perm count if needed
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "分配失败");
    },
  });

  // --- Handlers ---

  const handleCreate = () => {
    setEditingRole(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsEditModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    // Ideally use confirmation dialog from UI.
    // For now, we will perform mutation immediately if called,
    // assuming UI handles confirmation (e.g. Popconfirm or AlertDialog wrapper).
    deleteMutation.mutate(role.id);
  };

  const handleOpenPermissions = async (role: Role) => {
    setSelectedRoleForPerms(role);
    setIsPermissionModalOpen(true);

    // Fetch current permissions for this role
    try {
      const resp = await RolesService.rolesAclControllerRolePermissions({ id: role.id });
      const perms = resp.data ?? [];

      setSelectedAdminIds(
        perms
          .filter((p: any) => p.scope === "admin")
          .map((p: any) => p.id)
          .filter(Boolean),
      );
      setSelectedWebIds(
        perms
          .filter((p: any) => p.scope === "web")
          .map((p: any) => p.id)
          .filter(Boolean),
      );
    } catch (e) {
      console.error(e);
      toast.error("无法加载该角色的现有权限");
    }
  };

  const savePermissions = async () => {
    if (!selectedRoleForPerms) return;

    const allIds = [...selectedAdminIds, ...selectedWebIds];
    const idMap = permissionsQuery.data?.idToKeyMap || {};

    const permissionKeys = allIds.map((id) => idMap[id]).filter(Boolean);

    // Need role KEY not ID for the API
    // We often have it in the role object, but let's confirm.
    // The role object in list has 'key'.
    const roleKey = selectedRoleForPerms.key;

    if (!roleKey) {
      toast.error("角色数据缺失 Key，无法分配权限");
      return;
    }

    await assignPermissionsMutation.mutateAsync({ roleKey, permissionKeys });
    setIsPermissionModalOpen(false);
  };

  // derived data
  const roles = (rolesQuery.data?.items ?? []).map((r: any) => ({
    id: r.id,
    key: r.key,
    name: r.name,
    description: r.description ?? "",
    permissions_count: r.permissionsCount ?? r.permissions_count ?? 0,
    created_at: r.createdAt ?? r.created_at ?? "",
    updated_at: r.updatedAt ?? r.updated_at ?? "",
  }));

  // Create a quick lookup for all role keys if needed for validation (though server should handle it)
  const roleKeysMap: Record<string, string> = {};
  roles.forEach((r) => (roleKeysMap[r.id] = r.key));

  return {
    // Data
    roles,
    total: rolesQuery.data?.total ?? 0,
    loading: rolesQuery.isLoading,
    permissionTree: {
      admin: permissionsQuery.data?.adminTree || [],
      web: permissionsQuery.data?.webTree || [],
      idToKey: permissionsQuery.data?.idToKeyMap || {},
    },

    // State
    page,
    setPage,
    pageSize,
    setPageSize,
    searchText,
    setSearchText,

    // Modal State
    isEditModalOpen,
    setIsEditModalOpen,
    editingRole,

    isPermissionModalOpen,
    setIsPermissionModalOpen,
    selectedRoleForPerms,
    selectedAdminIds,
    setSelectedAdminIds,
    selectedWebIds,
    setSelectedWebIds,

    // Actions
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmitRole: async (values: any) => {
      if (editingRole) {
        await updateMutation.mutateAsync({ ...values, id: editingRole.id });
      } else {
        await createMutation.mutateAsync(values);
      }
    },
    handleOpenPermissions,
    handleSavePermissions: savePermissions,
    isSavingPermissions: assignPermissionsMutation.isPending,
    isSavingRole: createMutation.isPending || updateMutation.isPending,
    roleKeysMap,
  };
};
