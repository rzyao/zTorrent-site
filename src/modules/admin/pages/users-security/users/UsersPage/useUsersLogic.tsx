import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UsersService } from "@/api/services/UsersService";
import { RolesService } from "@/api/services/RolesService";
import { PunishmentDictsService } from "@/api/services/PunishmentDictsService";
import { LevelsService } from "@/api/services/LevelsService";
import { formatDate, formatDuration } from "@/modules/admin/utils/formatDate";
import { ListUsersDto } from "@/api/models/ListUsersDto";
import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import type { UserDto } from "@/api/models/UserDto";
import type { UserIdDto } from "@/api/models/UserIdDto";
import { STATUS_OPTIONS, VIP_LEVEL_OPTIONS } from "./constants";
import type { AdvRule } from "./types";
import { Column } from "@/modules/admin/components/ui/data-table";
import { Tag } from "@/modules/admin/components/ui/tag";
import { Button } from "@/modules/admin/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/admin/components/ui/dropdown-menu";

export const useUsersLogic = () => {
  const navigate = useNavigate();

  // 状态管理
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

  // 权限检查
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

  // 弹窗状态
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | undefined>(undefined);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

  // 字典数据
  const [banReasonOptions, setBanReasonOptions] = useState<{ label: string; value: string }[]>([]);
  const [banTimeOptions, setBanTimeOptions] = useState<{ label: string; value: number }[]>([]);
  const [banDictLoading, setBanDictLoading] = useState(false);
  const [punishTypeOptions, setPunishTypeOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [punishTypesLoading, setPunishTypesLoading] = useState(false);
  const [levelOptions, setLevelOptions] = useState<{ label: string; value: string }[]>([]);

  // 高级搜索
  const [advOpen, setAdvOpen] = useState(false);
  const [advRules, setAdvRules] = useState<AdvRule[]>([]);
  const [advLogic, setAdvLogic] = useState<"AND" | "OR">("AND");

  // 加载字典
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
      console.error(e?.message || "加载封禁字典失败");
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
      console.error(e?.message || "加载处罚类型失败");
    } finally {
      setPunishTypesLoading(false);
    }
  }, []);

  const loadLevelOptions = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadLevelOptions();
  }, [loadLevelOptions]);

  // 获取列表
  const fetchList = useCallback(async () => {
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
      console.error(e?.message || "加载用户列表失败");
    } finally {
      setLoading(false);
    }
  }, [advLogic, advRules, page, pageSize, query]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 搜索处理
  const handleSearch = () => {
    setPage(1);
    setQuery(searchText);
  };

  const handleClear = () => {
    setSearchText("");
    setQuery("");
    setAdvRules([]);
    setAdvLogic("AND");
    setPage(1);
  };

  // 操作处理
  const onAction = useCallback(
    async (actionKey: string, record: UserDto) => {
      try {
        const id = String(record.id);
        const uname = String(record.username || "");
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
            if (!id) return;
            navigate(`/torrents/user-records/${id}`);
            break;
          }
          case "edit": {
            setEditingUser(record);
            setEditOpen(true);
            break;
          }
          case "assign": {
            const existingRoles: string[] = Array.isArray(record?.roles)
              ? (record.roles as any)
              : [];
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
            setBanTargetId(id);
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
        }
      } catch (e: any) {
        console.error(e?.message || "操作失败");
      }
    },
    [can, loadBanDictionaries, loadPunishTypes, navigate],
  );

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await UsersService.usersControllerRemove({ id: deleteTargetId } as UserIdDto);
      toast.success("删除成功");
      setDeleteConfirmOpen(false);
      fetchList();
    } catch (e: any) {
      console.error(e?.message || "删除失败");
    }
  };

  const openRolesModal = useCallback((record: any) => {
    setDetailData({ title: "角色列表", type: "roles", record });
    setDetailOpen(true);
  }, []);

  const openPermissionsModal = useCallback((record: any) => {
    setDetailData({ title: "权限列表", type: "permissions", record });
    setDetailOpen(true);
  }, []);

  // 列定义
  const columns: Column<UserDto>[] = useMemo(
    () => [
      {
        key: "index",
        title: "#",
        width: 50,
        align: "center",
        render: (_: any, __: any, index: number) => pageOffsetRef.current + index + 1,
      },
      {
        key: "username",
        title: "用户",
        dataIndex: "username",
        width: 150,
      },
      {
        key: "status",
        title: "状态",
        dataIndex: "status",
        width: 100,
        render: (status: UserDto["status"]) => {
          const color = status === "banned" ? "red" : status === "active" ? "green" : "gold";
          const text = status === "banned" ? "已封禁" : status === "active" ? "正常" : "待激活";
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        key: "roles",
        title: "角色",
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
        key: "permissions",
        title: "权限",
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
        key: "level",
        title: "等级",
        dataIndex: "level",
        width: 100,
        render: (level: string) =>
          level ? <Tag color="blue">{level}</Tag> : <Tag color="default">未设置</Tag>,
      },
      {
        key: "vip",
        title: "VIP",
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
        key: "download",
        title: "下载",
        dataIndex: "hasDownloadPermission",
        width: 100,
        render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "允许" : "禁止"}</Tag>,
      },
      {
        key: "createdAt",
        title: "创建时间",
        dataIndex: "createdAt",
        width: 120,
        render: (v: string) => (
          <span title={formatDate(v)} className="cursor-help">
            {formatDuration(v)}
          </span>
        ),
      },
      {
        key: "lastVisitAt",
        title: "访问时间",
        dataIndex: "lastVisitAt",
        width: 120,
        render: (v: string) => (
          <span title={formatDate(v)} className="cursor-help">
            {formatDuration(v)}
          </span>
        ),
      },
      {
        key: "actions",
        title: "操作",
        width: 80,
        align: "center",
        fixed: "right",
        render: (_: any, r: UserDto) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="text" size="small" className="h-8 w-8 p-0">
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
    searchText,
    setSearchText,
    handleSearch,
    handleClear,
    loading,
    data,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    columns,
    fetchList,
    can,
    // Modals
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
    assignData,
    assigning,
    setAssigning,
    rolesOptions,
    rolesLoading,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleDelete,
    detailOpen,
    setDetailOpen,
    detailData,
    advOpen,
    setAdvOpen,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    advFieldOptions,
  };
};
