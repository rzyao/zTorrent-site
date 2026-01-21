import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PermissionsService } from "@/api/services/PermissionsService";
import { LevelsService } from "@/api/services/LevelsService";
import { ListPermissionsDto } from "@/api/models/ListPermissionsDto";
import { toast } from "sonner"; // 假设项目使用 sonner 或类似的通知

export const usePermissionAssign = (targetKey: string | undefined) => {
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);
  const [selectedWebIds, setSelectedWebIds] = useState<string[]>([]);
  const [idKeyMap, setIdKeyMap] = useState<Record<string, string>>({});
  const [keyIdMap, setKeyIdMap] = useState<Record<string, string>>({});

  // 1. 获取权限原始数据
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["permissions-raw-tree"],
    queryFn: async () => {
      const [respAdmin, respWeb] = await Promise.all([
        PermissionsService.permissionsCoreControllerListPermissionsTree({
          scope: ListPermissionsDto.scope.ADMIN,
        }),
        PermissionsService.permissionsCoreControllerListPermissionsTree({
          scope: ListPermissionsDto.scope.WEB,
        }),
      ]);
      return {
        admin: respAdmin.data ?? [],
        web: respWeb.data ?? [],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  // 2. 构建映射关系
  useEffect(() => {
    if (!rawData) return;
    const ik: Record<string, string> = {};
    const ki: Record<string, string> = {};
    const process = (items: any[]) => {
      items.forEach((p) => {
        if (p.id && p.key) {
          ik[p.id] = p.key;
          ki[p.key] = p.id;
        }
      });
    };
    process(rawData.admin);
    process(rawData.web);
    setIdKeyMap(ik);
    setKeyIdMap(ki);
  }, [rawData]);

  // 3. 构建树结构 (复用原有逻辑)
  const buildTree = useCallback((items: any[], scope: "admin" | "web") => {
    const map = new Map<string, any>();
    items.forEach((p) => {
      if (!p.id) return;
      map.set(p.id, {
        ...p,
        scope,
        children: [],
      });
    });
    const childIds = new Set<string>();
    const nodes = Array.from(map.values());
    nodes.forEach((node) => {
      const pid = node.parentId;
      if (pid && map.has(pid)) {
        map.get(pid).children.push(node);
        childIds.add(node.id);
        return;
      }
      // 兼容逻辑：通过 key 猜测父子关系
      let parentKey: string | undefined;
      if (node.type === "button") parentKey = node.key.split("/").slice(0, -1).join("/");
      else if (node.type === "api") parentKey = node.key.split(":")[0];

      if (parentKey) {
        const parentNode = nodes.find((n) => n.key === parentKey && n.scope === node.scope);
        if (parentNode) {
          parentNode.children.push(node);
          childIds.add(node.id);
        }
      }
    });
    return nodes.filter((n) => !childIds.has(n.id));
  }, []);

  const adminTree = useMemo(
    () => (rawData ? buildTree(rawData.admin, "admin") : []),
    [rawData, buildTree],
  );
  const webTree = useMemo(
    () => (rawData ? buildTree(rawData.web, "web") : []),
    [rawData, buildTree],
  );

  // 4. 获取当前等级已有的权限
  useEffect(() => {
    const loadCurrentPermissions = async () => {
      if (!targetKey || !Object.keys(keyIdMap).length) return;
      try {
        const resp = await LevelsService.levelsPermissionsControllerListPermissions({
          levelKey: targetKey,
        });
        const assigned = (resp.data ?? []) as any[];

        const aIds = assigned
          .filter((p) => p.scope === "admin")
          .map((p) => keyIdMap[p.key])
          .filter(Boolean);
        const wIds = assigned
          .filter((p) => p.scope === "web")
          .map((p) => keyIdMap[p.key])
          .filter(Boolean);

        setSelectedAdminIds(aIds);
        setSelectedWebIds(wIds);
      } catch (e) {
        console.error("加载已有权限失败", e);
      }
    };
    loadCurrentPermissions();
  }, [targetKey, keyIdMap]);

  // 5. 保存权限
  const savePermissions = useCallback(
    async (currentAdminIds: string[], currentWebIds: string[]) => {
      if (!targetKey) return;
      try {
        const allIds = [...currentAdminIds, ...currentWebIds];
        const permissionKeys = allIds.map((id) => idKeyMap[id]).filter(Boolean);
        await LevelsService.levelsPermissionsControllerSetPermissions({
          levelKey: targetKey,
          permissionKeys,
        });
        toast.success("权限已保存");
      } catch (e: any) {
        toast.error(e?.message || "配置权限失败");
      }
    },
    [targetKey, idKeyMap],
  );

  return {
    isLoading,
    adminTree,
    webTree,
    selectedAdminIds,
    setSelectedAdminIds,
    selectedWebIds,
    setSelectedWebIds,
    savePermissions,
  };
};
