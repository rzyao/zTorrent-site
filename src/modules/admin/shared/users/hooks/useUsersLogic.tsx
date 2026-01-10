import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { App, Form, Space, Tag, Descriptions, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
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
  const [editForm] = Form.useForm<UpdateUserBodyDto>();
  const [banOpen, setBanOpen] = useState(false);
  const [banForm] = Form.useForm();
  const [banTargetId, setBanTargetId] = useState<string | undefined>(undefined);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignForm] = Form.useForm();
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
      const text = s === "banned" ? "已封�? : s === "active" ? "正常" : "待激�?;
      return <Tag color={color}>{text}</Tag>;
    })();

    const vipNode = (
      <Space size={4}>
        <Tag color={d.isVip ? "magenta" : "default"}>{d.isVip ? "VIP" : "非VIP"}</Tag>
        {d.isVip && d.vipLevel && <Tag color="magenta">{d.vipLevel}</Tag>}
      </Space>
    );
    const lastLoginIp =
      typeof d.lastLoginIp === "string"
        ? d.lastLoginIp
        : d.lastLoginIp
          ? String(d.lastLoginIp)
          : "-";

    return (
      <div>
        <Descriptions title="基础信息" column={2} bordered size="small">
          <Descriptions.Item label="用户�?>{d.username || "-"}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{d.email || "-"}</Descriptions.Item>
          <Descriptions.Item label="角色">
            <Space size={4} wrap>
              {roles.length ? roles.map((x) => <Tag key={x}>{x}</Tag>) : <Tag>未设�?/Tag>}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="权限">
            <Space size={4} wrap>
              {permissions.length ? (
                permissions.map((x) => (
                  <Tag key={x} color="purple">
                    {x}
                  </Tag>
                ))
              ) : (
                <Tag>未设�?/Tag>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="等级">
            {d.level ? <Tag color="blue">{d.level}</Tag> : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="VIP">{vipNode}</Descriptions.Item>
        </Descriptions>

        <div style={{ height: 12 }} />

        <Descriptions title="账号状�? column={2} bordered size="small">
          <Descriptions.Item label="状�?>{statusTag}</Descriptions.Item>
          <Descriptions.Item label="下载权限">
            <Tag color={d.hasDownloadPermission ? "green" : "red"}>
              {d.hasDownloadPermission ? "允许" : "禁止"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <div style={{ height: 12 }} />

        <Descriptions title="活跃信息" column={2} bordered size="small">
          <Descriptions.Item label="最后访�?>
            {formatDate(d.lastVisitAt || d.lastVisitTime)}
          </Descriptions.Item>
          <Descriptions.Item label="最后登�?>
            {formatDate(d.lastLoginAt || d.lastLoginTime)}
          </Descriptions.Item>
          <Descriptions.Item label="最后登录IP">{lastLoginIp}</Descriptions.Item>
        </Descriptions>

        <div style={{ height: 12 }} />

        <Descriptions title="时间" column={2} bordered size="small">
          <Descriptions.Item label="创建时间">
            {formatDate(d.createdAt || d.createTime)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(d.updatedAt || d.updateTime)}
          </Descriptions.Item>
        </Descriptions>
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

  const userActions = useMemo<MenuProps["items"]>(() => {
    const items: MenuProps["items"] = [];
    items.push({ key: "detail", label: "查看详情" });
    items.push({ key: "downloads", label: "查看下载记录" });
    items.push({ key: "edit", label: "编辑用户" });
    items.push({ key: "assign", label: "分配角色/权限" });
    items.push(
      can("admin/users/ban")
        ? { key: "ban", label: "封禁用户" }
        : { key: "ban", label: "封禁用户", disabled: true },
    );
    items.push(
      can("admin/users/delete")
        ? { key: "delete", label: "删除用户" }
        : { key: "delete", label: "删除用户", disabled: true },
    );
    items.push({ key: "punishments", label: "解封（跳转处罚记录）" });
    return items;
  }, [can]);

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
            editForm.setFieldsValue({
              id,
              email: record?.email,
              password: undefined,
            } as any);
            setEditOpen(true);
            break;
          }
          case "assign": {
            assignForm.resetFields();
            const existingRoles: string[] = Array.isArray(record?.roles) ? record.roles : [];
            assignForm.setFieldsValue({ userId: id, roles: existingRoles });
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
              toast.info("无删除权�?);
              return;
            }
            setDeleteTargetId(id);
            setDeleteConfirmOpen(true);
            break;
          }
          case "ban": {
            if (!can("admin/users/ban")) {
              toast.info("无封禁权�?);
              return;
            }
            setBanTargetId(uid);
            banForm.resetFields();
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
    [
      assignForm,
      banForm,
      can,
      editForm,
      loadBanDictionaries,
      loadPunishTypes,
      navigate,
      renderDetailContent,
    ],
  );

  const columns = useMemo(
    () => [
      {
        title: "#",
        fixed: "left" as const,
        width: 50,
        align: "center" as const,
        render: (_: any, __: any, index: number) => pageOffsetRef.current + index + 1,
      },
      {
        title: "用户",
        dataIndex: "username",
        render: (_: any, r: any) => r.username || r.name,
        fixed: "left" as const,
        width: 80,
      },
      {
        title: "状�?,
        dataIndex: "status",
        render: (status: UserDto["status"]) => {
          const color = status === "banned" ? "red" : status === "active" ? "green" : "gold";
          const text = status === "banned" ? "已封�? : status === "active" ? "正常" : "待激�?;
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: "角色",
        dataIndex: "roles",
        render: (_: any, r: any) => {
          const list: string[] = Array.isArray(r?.roles) ? r.roles : r?.roles ? [r.roles] : [];
          return list.length ? (
            <Button type="link" onClick={() => openRolesModal(r)}>
              查看
            </Button>
          ) : (
            <Tag>未设�?/Tag>
          );
        },
      },
      {
        title: "权限",
        dataIndex: "permissions",
        render: (_: any, r: any) => {
          const list: string[] = Array.isArray(r?.permissions)
            ? r.permissions
            : r?.permissions
              ? [r.permissions]
              : [];
          return list.length ? (
            <Button type="link" onClick={() => openPermissionsModal(r)}>
              查看
            </Button>
          ) : (
            <Tag>未设�?/Tag>
          );
        },
      },
      {
        title: "等级",
        dataIndex: "level",
        render: (level: UserDto["level"]) =>
          level ? <Tag color="blue">{level}</Tag> : <Tag>未设�?/Tag>,
      },
      {
        title: "VIP",
        dataIndex: "isVip",
        render: (_: any, r: any) => {
          const isVip = Boolean(r.isVip);
          const vipLevel = r.vipLevel || "V0";
          return (
            <Space size={4}>
              <Tag color={isVip ? "magenta" : "default"}>{isVip ? "VIP" : "非VIP"}</Tag>
              {isVip && <Tag color="magenta">{vipLevel}</Tag>}
            </Space>
          );
        },
      },
      {
        title: "下载权限",
        dataIndex: "hasDownloadPermission",
        render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "允许" : "禁止"}</Tag>,
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        render: (_: any, r: any) => formatDate(r.createdAt || r.createTime),
      },
      {
        title: "最后访�?,
        dataIndex: "lastVisitAt",
        render: (_: any, r: any) => formatDate(r.lastVisitAt || r.lastVisitTime),
      },
      {
        title: "操作",
        fixed: "right" as const,
        width: 110,
        render: (_: any, r: any) => (
          <Dropdown
            menu={{
              items: userActions,
              onClick: ({ key }) => onAction(String(key), r),
            }}
            trigger={["click"]}
          >
            <Button type="link">操作</Button>
          </Dropdown>
        ),
      },
    ],
    [onAction, openPermissionsModal, openRolesModal, userActions],
  );

  const advFieldOptions = useMemo(
    () => [
      { label: "用户�?, value: "username", type: "text" as const },
      { label: "邮箱", value: "email", type: "text" as const },
      {
        label: "状�?,
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
      { label: "最后登录时�?, value: "lastLoginAt", type: "date" as const },
      { label: "最后访问时�?, value: "lastVisitAt", type: "date" as const },
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
    editForm,
    banOpen,
    setBanOpen,
    banForm,
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
    assignForm,
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
