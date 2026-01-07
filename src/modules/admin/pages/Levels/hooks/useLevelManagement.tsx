import { useEffect, useState } from "react";
import { App, Form } from "antd";
import { LevelsService } from "@/api/services/LevelsService";
import type { CreateLevelDto } from "@/api/models/CreateLevelDto";
import type { UpdateLevelDto } from "@/api/models/UpdateLevelDto";
import { PermissionsService } from "@/api/services/PermissionsService";
import { ListPermissionsDto } from "@/api/models/ListPermissionsDto";
import type { LevelItem } from "../types";

export const useLevelManagement = () => {
  const { message, modal } = App.useApp();

  // 列表与查询状态
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [searchLabel, setSearchLabel] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 页面内按钮权限显隐：读取本地缓存的权限集合（admin 用户放行）
  const can = (perm: string): boolean => {
    try {
      const raw = localStorage.getItem("permissions");
      const perms = raw ? JSON.parse(raw) : [];
      const isSuperAdmin = (localStorage.getItem("username") || "") === "admin";
      return isSuperAdmin || (Array.isArray(perms) && perms.includes(perm));
    } catch {
      return false;
    }
  };

  // 详情弹窗
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

  // 新增/编辑弹窗
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<LevelItem | null>(null);
  const [form] = Form.useForm();

  // 权限分配弹窗
  const [permOpen, setPermOpen] = useState(false);
  const [permTarget, setPermTarget] = useState<LevelItem | null>(null);
  const [permissionsAdmin, setPermissionsAdmin] = useState<any[]>([]);
  const [permissionsWeb, setPermissionsWeb] = useState<any[]>([]);
  const [permissionIdToKey, setPermissionIdToKey] = useState<Record<string, string>>({});
  const [permissionKeyToId, setPermissionKeyToId] = useState<Record<string, string>>({});
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);
  const [selectedWebIds, setSelectedWebIds] = useState<string[]>([]);

  const loadLevels = async () => {
    setLoading(true);
    try {
      const resp = await LevelsService.levelsCoreControllerList({
        key: searchKey || undefined,
        label: searchLabel || undefined,
        page,
        limit: pageSize,
      });
      const items: any[] = resp?.data?.items ?? [];
      const mapped: LevelItem[] = items.map((x: any) => ({
        id: String(x.id || x._id || ""),
        key: String(x.key || ""),
        label: String(x.label || ""),
        rank: (typeof x.rank === "number" ? x.rank : Number(x.rank)) || undefined,
        description: x.description ?? undefined,
        isActive: Boolean(x.isActive ?? x.enabled ?? true),
        createdAt: x.createdAt ?? x.created_at,
        updatedAt: x.updatedAt ?? x.updated_at,
      }));
      setLevels(mapped);
      setTotal(Number(resp?.data?.total ?? mapped.length));
    } catch (e: any) {
      message.error(e?.message || "加载等级列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLevels();
  }, [searchKey, searchLabel, page, pageSize]);

  const handleShowDetail = async (id: string) => {
    try {
      const resp = await LevelsService.levelsCoreControllerDetail({ id });
      const data = resp?.data ?? resp;
      setDetailData(data);
      setDetailOpen(true);
    } catch (e: any) {
      message.error(e?.message || "获取详情失败");
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setEditOpen(true);
  };

  const handleEdit = (it: LevelItem) => {
    setEditing(it);
    setEditOpen(true);
  };

  const submitEdit = async (values: any) => {
    try {
      if (editing) {
        const payload: { id: string; data: UpdateLevelDto } = {
          id: editing.id,
          data: {
            label: values.label,
            rank:
              values.rank === null || values.rank === undefined
                ? undefined
                : Math.max(0, Math.floor(Number(values.rank))),
            description: values.description,
            isActive: values.isActive,
          },
        };
        await LevelsService.levelsCoreControllerUpdate(payload);
        message.success("保存成功");
      } else {
        const rawKey = String(values.key || "").trim();
        const rankNum =
          values.rank === null || values.rank === undefined || values.rank === ""
            ? undefined
            : Math.max(0, Math.floor(Number(values.rank)));
        const dto: CreateLevelDto = {
          key: rawKey,
          label: values.label,
          rank: rankNum,
          description: values.description,
        };
        await LevelsService.levelsCoreControllerCreate(dto);
        message.success("添加成功");
      }
      setEditOpen(false);
      loadLevels();
    } catch (e: any) {
      message.error(e?.message || "保存失败，请重试");
    }
  };

  const confirmDelete = (id: string) => {
    modal.confirm({
      title: "确定要删除这个等级吗？",
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          await LevelsService.levelsCoreControllerRemove({ id });
          message.success("删除成功");
          loadLevels();
        } catch (e: any) {
          message.error(e?.message || "删除失败，请重试");
        }
      },
    });
  };

  const openAssignPermissions = async (lvl: LevelItem) => {
    setPermTarget(lvl);
    setPermOpen(true);
    try {
      // 加载权限树（Admin/Web），并建立 id<->key 双向映射
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
      const keyIdMap: Record<string, string> = {};
      const collect = (items: any[]) => {
        items.forEach((p) => {
          if (p.id && p.key) {
            idKeyMap[p.id] = p.key;
            keyIdMap[p.key] = p.id;
          }
        });
      };
      collect(itemsAdmin);
      collect(itemsWeb);

      const buildTree = (items: any[], scope: "admin" | "web") => {
        const map = new Map<string, any & { children: any[] }>();
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
          if (node.type === "button") parentKey = node.key.split("/").slice(0, -1).join("/");
          else if (node.type === "api") parentKey = node.key.split(":")[0];
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
      setPermissionIdToKey(idKeyMap);
      setPermissionKeyToId(keyIdMap);

      // 加载当前等级已有权限，并转换为选中 ID 集合
      const resp = await LevelsService.levelsPermissionsControllerListPermissions({
        levelKey: lvl.key,
      });
      const assigned = Array.isArray(resp?.data) ? (resp!.data as any[]) : [];
      const adminIds = assigned
        .filter((p) => p.scope === "admin")
        .map((p) => permissionKeyToId[p.key!])
        .filter(Boolean);
      const webIds = assigned
        .filter((p) => p.scope === "web")
        .map((p) => permissionKeyToId[p.key!])
        .filter(Boolean);
      setSelectedAdminIds(adminIds);
      setSelectedWebIds(webIds);
    } catch (e: any) {
      message.error(e?.message || "加载权限数据失败");
    }
  };

  return {
    levels,
    loading,
    searchKey,
    setSearchKey,
    searchLabel,
    setSearchLabel,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    can,
    detailOpen,
    setDetailOpen,
    detailData,
    editOpen,
    setEditOpen,
    editing,
    form,
    permOpen,
    setPermOpen,
    permTarget,
    permissionsAdmin,
    permissionsWeb,
    permissionIdToKey,
    selectedAdminIds,
    setSelectedAdminIds,
    selectedWebIds,
    setSelectedWebIds,
    handleAdd,
    handleEdit,
    submitEdit,
    confirmDelete,
    openAssignPermissions,
    handleShowDetail,
  };
};
