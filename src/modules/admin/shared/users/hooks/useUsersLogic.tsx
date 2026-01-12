import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Form } from "antd";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "@/modules/admin/components/ui/tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/admin/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UsersService } from "@/api/services/UsersService";
import { RolesService } from "@/api/services/RolesService";
import { PunishmentDictsService } from "@/api/services/PunishmentDictsService";
import { LevelsService } from "@/api/services/LevelsService";
import { useAutoTableScroll } from "@/modules/admin/hooks/useAutoTableScroll";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { ListUsersDto } from "@/api/models/ListUsersDto";
import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import type { UpdateUserBodyDto } from "@/api/models/UpdateUserBodyDto";
import type { UserIdDto } from "@/api/models/UserIdDto";
import type { UserDto } from "@/api/models/UserDto";
import { STATUS_OPTIONS, VIP_LEVEL_OPTIONS } from "@/modules/admin/shared/users/constants";
import type { AdvRule } from "@/modules/admin/shared/users/types";
import { toast } from "sonner";

export const useUsersLogic = () => {
  const { scrollY, tableContainerRef } = useAutoTableScroll(60);
  const navigate = useNavigate();

  // State
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const pageOffsetRef = useRef(0);

  useEffect(() => {
    pageOffsetRef.current = (page - 1) * pageSize;
  }, [page, pageSize]);

  // Permission check
  const can = useCallback((key: string): boolean => {
    try {
      const raw = localStorage.getItem("permissions");
      const perms = raw ? JSON.parse(raw) : [];
      const isSuperAdmin = (localStorage.getItem("username") || "") === "admin";
      return isSuperAdmin || (Array.isArray(perms) && perms.includes(key));
    } catch {
      return false;
    }
  }, []);

  // Modals & Forms State
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [banOpen, setBanOpen] = useState(false);
  const [banTargetId, setBanTargetId] = useState<string | undefined>(undefined);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignData, setAssignData] = useState<{ userId: string; roles: string[] }>({
    userId: "",
    roles: [],
  });
  const [rolesOptions, setRolesOptions] = useState<{ label: string; value: string }[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  // Dictionary Options
  const [banReasonOptions, setBanReasonOptions] = useState<{ label: string; value: string }[]>([]);
  const [banTimeOptions, setBanTimeOptions] = useState<{ label: string; value: number }[]>([]);
  const [banDictLoading, setBanDictLoading] = useState(false);
  const [punishTypeOptions, setPunishTypeOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [punishTypesLoading, setPunishTypesLoading] = useState(false);

  // Advanced Search
  const [advOpen, setAdvOpen] = useState(false);
  const [advRules, setAdvRules] = useState<AdvRule[]>([]);
  const [advLogic, setAdvLogic] = useState<"AND" | "OR">("AND");
  const [levelOptions, setLevelOptions] = useState<{ label: string; value: string }[]>([]);

  // Delete Confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | undefined>(undefined);

  // Load Dictionaries
  const loadBanDictionaries = useCallback(async () => {
    setBanDictLoading(true);
    try {
      const reasonRes = await PunishmentDictsService.punishmentDictsControllerOptions({
        category: "BAN_REASON",
      });
      const reasonOpts = (reasonRes?.data || []).map((x: any) => ({
        label: String(x.label),
        value: String(x.key),
      }));
      setBanReasonOptions(reasonOpts);

      const timeRes = await PunishmentDictsService.punishmentDictsControllerOptions({
        category: "BAN_DAYS",
      });
      const timeOpts = (timeRes?.data || [])
        .map((x: any) => {
          const label = String(x.label);
          const raw = x.key;
          const num = typeof raw === "number" ? raw : parseInt(String(raw), 10);
          return { label, value: Number.isFinite(num) ? num : 0 };
        })
        .filter((opt: any) => Number.isFinite(opt.value) && opt.value > 0)
        .sort((a: any, b: any) => a.value - b.value);
      setBanTimeOptions(timeOpts);
    } catch (e: any) {
      toast.error(e?.message || "加载封禁字典失败");
    } finally {
      setBanDictLoading(false);
    }
  }, []);

  const loadPunishTypes = useCallback(async () => {
    setPunishTypesLoading(true);
    try {
      const res = await PunishmentDictsService.punishmentDictsControllerOptions({
        category: "PUNISHMENT_TYPE",
      });
      const opts = (res?.data || []).map((x: any) => ({
        label: String(x.label),
        value: String(x.key),
      }));
      setPunishTypeOptions(opts);
    } catch (e: any) {
      toast.error(e?.message || "加载处罚类型失败");
    } finally {
      setPunishTypesLoading(false);
    }
  }, []);

  // Fetch List
  const fetchListRef = useRef<null | (() => Promise<void>)>(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const rulesMapped = advRules.map((r) => {
        if (r.op === AdvancedRuleDto.op.BETWEEN && r.range && r.range.length === 2) {
          const [from, to] = r.range;
          return {
            field: r.field,
            op: AdvancedRuleDto.op.BETWEEN,
            range: [
              from && typeof from.toISOString === "function" ? from.toISOString() : String(from),
              to && typeof to.toISOString === "function" ? to.toISOString() : String(to),
            ],
          };
        }
        const value = (() => {
          if (!r.value) return undefined;
          if (Array.isArray(r.value)) return r.value;
          if (typeof r.value?.toISOString === "function") return r.value.toISOString();
          return r.value;
        })();
        return { field: r.field, op: r.op, value };
      });

      const params: ListUsersDto = {
        username: query || undefined,
        logic: advLogic === "AND" ? ListUsersDto.logic.AND : ListUsersDto.logic.OR,
        rules: rulesMapped.length ? (rulesMapped as any) : undefined,
        page,
        limit: pageSize,
      };

      const res: any = await UsersService.usersControllerListUsers(params);

      let items: any[] = [];
      if (Array.isArray(res)) {
        items = res;
      } else if (res && typeof res === "object") {
        const candidates = [
          res.items,
          res?.data?.items,
          res.list,
          res?.data?.list,
          res.records,
          res?.data?.records,
          res.rows,
          res?.data?.rows,
          Array.isArray(res?.data) ? res?.data : undefined,
        ];
        for (const c of candidates) {
          if (Array.isArray(c)) {
            items = c;
            break;
          }
        }
      }

      const totalMaybe =
        res?.total ??
        res?.data?.total ??
        res?.count ??
        res?.data?.count ??
        res?.totalElements ??
        res?.data?.totalElements ??
        items.length;

      setData(Array.isArray(items) ? items : []);
      setTotal(
        Number.isFinite(Number(totalMaybe))
          ? Number(totalMaybe)
          : Array.isArray(items)
            ? items.length
            : 0,
      );
    } catch (e: any) {
      toast.error(e?.message || "加载用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListRef.current = fetchList;
  });

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page, pageSize]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await LevelsService.levelsCoreControllerList({
          page: 1,
          limit: 200,
        });
        const items: any[] = resp?.data?.items ?? [];
        const opts = items.map((x: any) => ({
          label: String(x.label || x.key || ""),
          value: String(x.key || ""),
        }));
        setLevelOptions(opts);
      } catch {}
    })();
  }, []);

  const expandCacheRef = useRef<WeakMap<any, string>>(new WeakMap());

  // Helper modals
  const renderDetailContent = useCallback((d: any) => {
    const roles: string[] = Array.isArray(d.roles) ? d.roles : d.roles ? [d.roles] : [];
    const permissions: string[] = Array.isArray(d.permissions)
      ? d.permissions
      : d.permissions
        ? [d.permissions]
        : [];
    const statusTag = (() => {
      const s = d.status as UserDto["status"];
      const color = s === "banned" ? "red" : s === "active" ? "green" : "gold";
      const text = s === "banned" ? "已封禁" : s === "active" ? "正常" : "待激活";
      return <Tag color={color}>{text}</Tag>;
    })();

    const vipNode = (
      <div className="flex gap-1">
        <Tag color={d.isVip ? "magenta" : "default"}>{d.isVip ? "VIP" : "非VIP"}</Tag>
        {d.isVip && d.vipLevel && <Tag color="magenta">{d.vipLevel}</Tag>}
      </div>
    );
    const lastLoginIp =
      typeof d.lastLoginIp === "string"
        ? d.lastLoginIp
        : d.lastLoginIp
          ? String(d.lastLoginIp)
          : "-";

    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-medium">基础信息</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">用户名</span>
              <span>{d.username || "-"}</span>
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">邮箱</span>
              <span>{d.email || "-"}</span>
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">角色</span>
              <div className="flex flex-wrap gap-1">
                {roles.length ? roles.map((x) => <Tag key={x}>{x}</Tag>) : <Tag>未设置</Tag>}
              </div>
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">权限</span>
              <div className="flex flex-wrap gap-1">
                {permissions.length ? (
                  permissions.map((x) => (
                    <Tag key={x} color="purple">
                      {x}
                    </Tag>
                  ))
                ) : (
                  <Tag>未设置</Tag>
                )}
              </div>
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">等级</span>
              {d.level ? <Tag color="blue">{d.level}</Tag> : "-"}
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">VIP</span>
              {vipNode}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">账号状态</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">状态</span>
              {statusTag}
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">下载权限</span>
              <Tag color={d.hasDownloadPermission ? "green" : "red"}>
                {d.hasDownloadPermission ? "允许" : "禁止"}
              </Tag>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">活跃信息</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">最后访问</span>
              <span>{formatDate(d.lastVisitAt || d.lastVisitTime)}</span>
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">最后登录</span>
              <span>{formatDate(d.lastLoginAt || d.lastLoginTime)}</span>
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">最后登录IP</span>
              <span>{lastLoginIp}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">时间</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">创建时间</span>
              <span>{formatDate(d.createdAt || d.createTime)}</span>
            </div>
            <div className="flex bg-neutral-50 px-3 py-2">
              <span className="w-24 text-neutral-500">更新时间</span>
              <span>{formatDate(d.updatedAt || d.updateTime)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }, []);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

  const openRolesModal = useCallback((record: any) => {
    setDetailData({ title: "角色列表", type: "roles", record });
    setDetailOpen(true);
  }, []);

  const openPermissionsModal = useCallback((record: any) => {
    setDetailData({ title: "权限列表", type: "permissions", record });
    setDetailOpen(true);
  }, []);

  const onAction = useCallback(
    async (actionKey: string, record: any) => {
      try {
        const id = String(record?.id ?? record?._id ?? "");
        const uid = id;
        const uname = String(record?.username ?? record?.name ?? "");
        switch (actionKey) {
          case "detail": {
            const resp = await UsersService.usersControllerDetail({
              id,
            } as UserIdDto);
            const data = (resp as any)?.data ?? resp;
            setDetailData({ title: "用户详情", type: "info", record: data });
            setDetailOpen(true);
            break;
          }
          case "downloads": {
            if (!uid) return;
            navigate(`/torrents/user-records/${uid}`);
            break;
          }
          case "edit": {
            setEditingUser(record);
            setEditOpen(true);
            break;
          }
          case "assign": {
            const existingRoles: string[] = Array.isArray(record?.roles) ? record.roles : [];
            setAssignData({ userId: id, roles: existingRoles });
            setAssignOpen(true);
            (async () => {
              setRolesLoading(true);
              try {
                const res = await RolesService.rolesControllerListRoles({
                  page: 1,
                  limit: 100,
                } as any);
                const items: any[] = Array.isArray(res?.data?.items)
                  ? (res!.data!.items as any[])
                  : [];
                setRolesOptions(
                  items.map((x: any) => ({
                    label: x.name,
                    value: String(x.key),
                  })),
                );
              } catch {}
              setRolesLoading(false);
            })();
            break;
          }
          case "delete": {
            if (!can("admin/users/delete")) {
              toast.info("无删除权限");
              return;
            }
            setDeleteTargetId(id);
            setDeleteConfirmOpen(true);
            break;
          }
          case "ban": {
            if (!can("admin/users/ban")) {
              toast.info("无封禁权限");
              return;
            }
            setBanTargetId(uid);
            loadBanDictionaries();
            loadPunishTypes();
            setBanOpen(true);
            break;
          }
          case "punishments": {
            if (!uname) return;
            navigate(`/users/punishments?username=${encodeURIComponent(uname)}`);
            break;
          }
          default:
            break;
        }
      } catch (e: any) {
        toast.error(e?.message || "操作失败");
      }
    },
    [can, loadBanDictionaries, loadPunishTypes, navigate],
  );

  const columns = useMemo(
    () => [
      {
        title: "#",
        width: 50,
        align: "center" as const,
        render: (_: any, __: any, index: number) => pageOffsetRef.current + index + 1,
      },
      {
        title: "用户",
        dataIndex: "username" as const,
        render: (_: any, r: any) => r.username || r.name,
        width: 150,
      },
      {
        title: "状态",
        dataIndex: "status" as const,
        width: 100,
        render: (status: UserDto["status"]) => {
          const color = status === "banned" ? "red" : status === "active" ? "green" : "gold";
          const text = status === "banned" ? "已封禁" : status === "active" ? "正常" : "待激活";
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: "角色",
        dataIndex: "roles" as const,
        width: 120,
        render: (_: any, r: any) => {
          const list: string[] = Array.isArray(r?.roles) ? r.roles : r?.roles ? [r.roles] : [];
          return list.length ? (
            <Button
              variant="link"
              className="h-auto p-0 text-blue-600"
              onClick={() => openRolesModal(r)}
            >
              查看
            </Button>
          ) : (
            <Tag color="default">未设置</Tag>
          );
        },
      },
      {
        title: "权限",
        dataIndex: "permissions" as const,
        width: 120,
        render: (_: any, r: any) => {
          const list: string[] = Array.isArray(r?.permissions)
            ? r.permissions
            : r?.permissions
              ? [r.permissions]
              : [];
          return list.length ? (
            <Button
              variant="link"
              className="h-auto p-0 text-blue-600"
              onClick={() => openPermissionsModal(r)}
            >
              查看
            </Button>
          ) : (
            <Tag color="default">未设置</Tag>
          );
        },
      },
      {
        title: "等级",
        dataIndex: "level" as const,
        width: 100,
        render: (level: UserDto["level"]) =>
          level ? <Tag color="blue">{level}</Tag> : <Tag color="default">未设置</Tag>,
      },
      {
        title: "VIP",
        dataIndex: "isVip" as const,
        width: 150,
        render: (_: any, r: any) => {
          const isVip = Boolean(r.isVip);
          const vipLevel = r.vipLevel || "V0";
          return (
            <div className="flex gap-1">
              <Tag color={isVip ? "magenta" : "default"}>{isVip ? "VIP" : "非VIP"}</Tag>
              {isVip && <Tag color="magenta">{vipLevel}</Tag>}
            </div>
          );
        },
      },
      {
        title: "下载",
        dataIndex: "hasDownloadPermission" as const,
        width: 100,
        render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "允许" : "禁止"}</Tag>,
      },
      {
        title: "创建时间",
        dataIndex: "createdAt" as const,
        width: 160,
        render: (_: any, r: any) => formatDate(r.createdAt || r.createTime),
      },
      {
        title: "访问时间",
        dataIndex: "lastVisitAt" as const,
        width: 160,
        render: (_: any, r: any) => formatDate(r.lastVisitAt || r.lastVisitTime),
      },
      {
        title: "操作",
        width: 80,
        align: "center" as const,
        fixed: "right" as const,
        render: (_: any, r: any) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="text" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">打开菜单</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onAction("detail", r)}>查看详情</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("downloads", r)}>下载记录</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction("edit", r)}>编辑用户</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("assign", r)}>分配权限</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!can("admin/users/ban")}
                onClick={() => onAction("ban", r)}
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                封禁用户
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("punishments", r)}>
                解封/记录
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!can("admin/users/delete")}
                onClick={() => onAction("delete", r)}
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                删除用户
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onAction, openPermissionsModal, openRolesModal, can],
  );

  const advFieldOptions = useMemo(
    () => [
      { label: "用户名", value: "username", type: "text" as const },
      { label: "邮箱", value: "email", type: "text" as const },
      {
        label: "状态",
        value: "status",
        type: "enum" as const,
        enumOptions: STATUS_OPTIONS,
      },
      {
        label: "等级",
        value: "level",
        type: "enum" as const,
        enumOptions: levelOptions,
      },
      { label: "VIP", value: "isVip", type: "bool" as const },
      {
        label: "VIP等级",
        value: "vipLevel",
        type: "enum" as const,
        enumOptions: VIP_LEVEL_OPTIONS,
      },
      {
        label: "下载权限",
        value: "hasDownloadPermission",
        type: "bool" as const,
      },
      { label: "最后登录时间", value: "lastLoginAt", type: "date" as const },
      { label: "最后访问时间", value: "lastVisitAt", type: "date" as const },
      { label: "创建时间", value: "createdAt", type: "date" as const },
      { label: "最后登录IP", value: "lastLoginIp", type: "text" as const },
      { label: "角色", value: "roles", type: "array" as const },
      { label: "权限", value: "permissions", type: "array" as const },
      { label: "下载 passkey", value: "passkey", type: "text" as const },
    ],
    [levelOptions],
  );

  return {
    scrollY,
    tableContainerRef,
    searchText,
    setSearchText,
    setQuery,
    loading,
    data,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    expandCacheRef,
    columns,
    fetchList,
    can,
    // Modals state
    advOpen,
    setAdvOpen,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    advFieldOptions,
    editOpen,
    setEditOpen,
    editingUser,
    banOpen,
    setBanOpen,
    banTargetId,
    punishTypeOptions,
    banReasonOptions,
    banTimeOptions,
    banDictLoading,
    punishTypesLoading,
    assignOpen,
    setAssignOpen,
    assigning,
    setAssigning,
    assignData,
    rolesOptions,
    rolesLoading,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteTargetId,
    setDeleteTargetId,
    detailOpen,
    setDetailOpen,
    detailData,
    renderDetailContent,
    createOpen,
    setCreateOpen,
  };
};

export const handleDeleteUser = async (id: string, fetchList: () => void) => {
  try {
    await UsersService.usersControllerRemove({ id } as UserIdDto);
    toast.success("删除成功");
    fetchList();
  } catch (e: any) {
    toast.error(e?.message || "删除失败");
  }
};
