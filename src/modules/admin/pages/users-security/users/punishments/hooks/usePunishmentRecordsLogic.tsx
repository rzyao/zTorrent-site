import { useEffect, useMemo, useRef, useState } from "react";
import { App, Form, Grid, Tag, Space, Button } from "antd";
// import type { MenuProps } from "antd";
import { useSearchParams } from "react-router-dom";
import { ListPunishmentRecordsDto } from "@/api/models/ListPunishmentRecordsDto";
import { PunishmentsService } from "@/api/services/PunishmentsService";
import { UsersService } from "@/api/services/UsersService";
import { PunishmentDictsService } from "@/api/services/PunishmentDictsService";
import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import type { RecordItem, AdvRule } from "../types";
// import { ADV_FIELD_OPTIONS } from "../constants";

export const usePunishmentRecordsLogic = () => {
  const { message } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isMobile = !!screens.xs && !screens.md;
  // const [params, setParams] = useSearchParams();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageOffsetRef = useRef(0);
  // const navigate = useNavigate();

  useEffect(() => {
    pageOffsetRef.current = (page - 1) * pageSize;
  }, [page, pageSize]);

  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [initialUserId, setInitialUserId] = useState("");
  const [advOpen, setAdvOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<RecordItem | null>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeForm] = Form.useForm();
  const [revokeReasonOptions, setRevokeReasonOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [revokeReasonLoading, setRevokeReasonLoading] = useState(false);

  // 顶部筛选：类型、原因、状态（撤销）
  const [typeSelect, setTypeSelect] = useState<string | undefined>(undefined);
  const [reasonSelect, setReasonSelect] = useState<string | undefined>(
    undefined
  );
  const [statusSelect, setStatusSelect] = useState<boolean | undefined>(
    undefined
  );
  const [typeOptions, setTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [reasonOptions, setReasonOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [reasonLoading, setReasonLoading] = useState(false);

  // 排序
  const [sortBy, setSortBy] = useState<
    ListPunishmentRecordsDto["sortBy"] | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<
    ListPunishmentRecordsDto["order"] | undefined
  >(undefined);
  const [activeSelect, setActiveSelect] = useState<boolean | undefined>(
    undefined
  );

  const [advRules, setAdvRules] = useState<AdvRule[]>([]);
  const [advLogic, setAdvLogic] = useState<"AND" | "OR">("AND");

  const loadRevokeReasons = async () => {
    setRevokeReasonLoading(true);
    try {
      const res = await PunishmentDictsService.punishmentDictsControllerOptions(
        {
          category: "UNBAN_REASON",
        }
      );
      const opts = (res?.data || []).map((x: any) => ({
        label: String(x.label),
        value: String(x.key),
      }));
      setRevokeReasonOptions(opts);
    } catch (e: any) {
      // ignore
    } finally {
      setRevokeReasonLoading(false);
    }
  };

  const loadPunishTypes = async () => {
    setTypeLoading(true);
    try {
      const res = await PunishmentDictsService.punishmentDictsControllerOptions(
        {
          category: "PUNISHMENT_TYPE",
        }
      );
      const opts = (res?.data || []).map((x: any) => ({
        label: String(x.label),
        value: String(x.key),
      }));
      setTypeOptions(opts);
    } catch (e: any) {
      // ignore
    } finally {
      setTypeLoading(false);
    }
  };

  const loadBanReasons = async () => {
    setReasonLoading(true);
    try {
      const res = await PunishmentDictsService.punishmentDictsControllerOptions(
        {
          category: "BAN_REASON",
        }
      );
      const opts = (res?.data || []).map((x: any) => ({
        label: String(x.label),
        value: String(x.key),
      }));
      setReasonOptions(opts);
    } catch (e: any) {
      // ignore
    } finally {
      setReasonLoading(false);
    }
  };

  useEffect(() => {
    const username = params.get("username") || "";
    const userId = params.get("userId") || "";
    if (username) {
      setSearchText(username);
      searchUserAndFetch(username);
    } else if (userId) {
      setInitialUserId(userId);
      setSearchText(userId);
      setQuery(userId);
    }
    loadPunishTypes();
    loadBanReasons();
    fetchList({ page: 1, limit: pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchList(
    { page, limit }: { page: number; limit: number },
    overrides?: {
      userId?: string | undefined;
      type?: string;
      reason?: string;
      revoked?: boolean | undefined;
      active?: boolean | undefined;
      sortBy?: ListPunishmentRecordsDto["sortBy"];
      order?: ListPunishmentRecordsDto["order"];
      query?: string;
      rules?: AdvRule[];
      logic?: ListPunishmentRecordsDto["logic"];
    }
  ) {
    setLoading(true);
    try {
      const hasOverride = (
        k:
          | "userId"
          | "type"
          | "reason"
          | "revoked"
          | "active"
          | "sortBy"
          | "order"
          | "query"
          | "rules"
          | "logic"
      ) => overrides && Object.prototype.hasOwnProperty.call(overrides, k);
      const baseRules = overrides?.rules ?? advRules;
      const rulesMapped = baseRules.map((r) => {
        if (
          r.op === AdvancedRuleDto.op.BETWEEN &&
          r.range &&
          r.range.length === 2
        ) {
          const [from, to] = r.range;
          return {
            field: r.field,
            op: "range",
            range: [
              from && typeof from.toISOString === "function"
                ? from.toISOString()
                : String(from),
              to && typeof to.toISOString === "function"
                ? to.toISOString()
                : String(to),
            ],
          };
        }
        const opMap: Record<AdvancedRuleDto.op, string> = {
          [AdvancedRuleDto.op.EQUAL]: "eq",
          [AdvancedRuleDto.op.NOT_EQUAL]: "neq",
          [AdvancedRuleDto.op.LIKE]: "like",
          [AdvancedRuleDto.op.NOT_LIKE]: "like",
          [AdvancedRuleDto.op.LIKE_LEFT]: "like_left",
          [AdvancedRuleDto.op.LIKE_RIGHT]: "like_right",
          [AdvancedRuleDto.op.NOT_IN]: "contains",
          [AdvancedRuleDto.op.IN]: "contains",
          [AdvancedRuleDto.op.GREATER_THAN]: "gt",
          [AdvancedRuleDto.op.GREATER_THAN_OR_EQUAL]: "gte",
          [AdvancedRuleDto.op.LESS_THAN]: "lt",
          [AdvancedRuleDto.op.LESS_THAN_OR_EQUAL]: "lte",
          [AdvancedRuleDto.op.IS_NULL]: "is_null",
          [AdvancedRuleDto.op.IS_NOT_NULL]: "is_not_null",
          [AdvancedRuleDto.op.BETWEEN]: "range",
        };
        const value = (() => {
          if (!r.value) return undefined;
          if (Array.isArray(r.value)) return r.value;
          if (typeof r.value?.toISOString === "function")
            return r.value.toISOString();
          return r.value;
        })();
        return { field: r.field, op: opMap[r.op], value };
      });
      const req: ListPunishmentRecordsDto = {
        userId: hasOverride("userId")
          ? overrides!.userId
          : initialUserId || undefined,
        type: hasOverride("type") ? overrides!.type : typeSelect || undefined,
        // 原因下拉为精确匹配，若未选择则使用输入框模糊查询
        reason: hasOverride("reason")
          ? overrides!.reason
          : hasOverride("query")
          ? overrides!.query!
          : (reasonSelect ?? query) || undefined,
        revoked: hasOverride("revoked")
          ? overrides!.revoked
          : typeof statusSelect === "boolean"
          ? statusSelect
          : undefined,
        active: hasOverride("active")
          ? overrides!.active
          : typeof activeSelect === "boolean"
          ? activeSelect
          : undefined,
        logic: hasOverride("logic") ? overrides!.logic! : advLogic,
        rules: rulesMapped.length ? (rulesMapped as any) : undefined,
        sortBy: hasOverride("sortBy") ? overrides!.sortBy : sortBy,
        order: hasOverride("order") ? overrides!.order : sortOrder,
        page,
        limit,
      } as any;
      const res: any =
        await PunishmentsService.punishmentsControllerListPunishmentRecords(
          req
        );
      // 归一化后端返回结构
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
          res?.result?.items,
          res?.result?.list,
          res?.page?.items,
          res?.page?.list,
          res.content,
          res?.data?.content,
          Array.isArray(res?.data) ? res?.data : undefined,
          Array.isArray(res?.result) ? res?.result : undefined,
        ];
        for (const c of candidates) {
          if (Array.isArray(c)) {
            items = c;
            break;
          }
        }
      }
      setData(Array.isArray(items) ? items : []);
      const totalMaybe =
        res?.total ??
        res?.data?.total ??
        res?.count ??
        res?.data?.count ??
        res?.totalElements ??
        res?.data?.totalElements ??
        res?.totalCount ??
        res?.data?.totalCount ??
        res?.page?.total ??
        res?.result?.total ??
        res?.data?.result?.total ??
        res?.content?.total ??
        res?.data?.content?.total ??
        (Array.isArray(items) ? items.length : 0);
      setTotal(
        Number.isFinite(Number(totalMaybe))
          ? Number(totalMaybe)
          : Array.isArray(items)
          ? items.length
          : 0
      );
      const pageMaybe =
        res?.page ??
        res?.data?.page ??
        res?.pagination?.page ??
        res?.data?.pagination?.page;
      const sizeMaybe =
        res?.limit ??
        res?.data?.limit ??
        res?.perPage ??
        res?.data?.perPage ??
        res?.pagination?.size ??
        res?.data?.pagination?.size;
      setPage(Number(pageMaybe ?? page));
      setPageSize(Number(sizeMaybe ?? limit));
    } catch (e: any) {
      message.error(e?.message || "加载处罚记录失败");
    } finally {
      setLoading(false);
    }
  }

  async function searchUserAndFetch(username: string) {
    if (!username) {
      message.warning("请输入用户名进行搜索");
      return;
    }
    try {
      setSearchText(username);
      const res = (await UsersService.usersControllerListUsers({
        username,
        page: 1,
        limit: 1,
      })) as any;
      let users: any[] = [];
      if (Array.isArray(res)) {
        users = res;
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
          res?.result?.items,
          res?.result?.list,
          res?.page?.items,
          res?.page?.list,
          res.content,
          res?.data?.content,
          Array.isArray(res?.data) ? res?.data : undefined,
        ];
        for (const c of candidates) {
          if (Array.isArray(c)) {
            users = c;
            break;
          }
        }
      }
      const first = Array.isArray(users) ? users[0] : undefined;
      const firstId = first
        ? first.id ??
          first._id ??
          first.userId ??
          first.uid ??
          (first.user && (first.user.id ?? first.user._id))
        : undefined;
      if (!first || !firstId) {
        message.info("未找到匹配的用户");
        return;
      }
      setQuery(username);
      fetchList({ page: 1, limit: pageSize }, { userId: String(firstId) });
    } catch (e: any) {
      message.error("搜索用户失败");
    }
  }

  const formatDateYMD = (v: any): string => {
    if (!v) return "-";
    try {
      if (typeof v === "string" || typeof v === "number") {
        const d = new Date(v);
        if (!isNaN(d.getTime()))
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(d.getDate()).padStart(2, "0")}`;
      }
      if (typeof v === "object") {
        const maybe =
          (v as any).value ||
          (v as any).date ||
          (v as any).iso ||
          (v as any)._value ||
          (v as any)._date;
        if (maybe) {
          const d = new Date(maybe);
          if (!isNaN(d.getTime()))
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(d.getDate()).padStart(2, "0")}`;
        }
      }
    } catch {}
    return "-";
  };

  const expandedCacheRef = useRef<WeakMap<any, string>>(new WeakMap());
  const tableContainerRef = useRef<any>(null);

  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "index",
        width: 56,
        responsive: ["xs"],
        render: (_: any, __: any, idx: number) =>
          pageOffsetRef.current + idx + 1,
      },
      {
        title: "用户名",
        dataIndex: "userUsername",
        width: 120,
        ellipsis: true,
        responsive: ["xs"],
        render: (_: any, r: RecordItem) => r.userUsername || "-",
      },
      {
        title: "类型",
        dataIndex: "type",
        width: 120,
        responsive: ["xs"],
        render: (_: any, r: RecordItem) => (
          <Tag color="purple">{r.typeLabel || r.type || "-"}</Tag>
        ),
      },
      {
        title: "原因",
        dataIndex: "reason",
        width: 160,
        ellipsis: true,
        responsive: ["md"],
        render: (_: any, r: RecordItem) => r.reasonLabel || r.reason || "-",
      },
      {
        title: "说明",
        dataIndex: "detailReason",
        width: 240,
        ellipsis: true,
        responsive: ["lg"],
      },
      {
        title: "时长",
        dataIndex: "durationDays",
        width: 90,
        responsive: ["md"],
        render(value: any) {
          return value ? `${value}天` : "-";
        },
        sorter: true,
        sortOrder:
          sortBy === "durationDays"
            ? sortOrder === "ASC"
              ? "ascend"
              : sortOrder === "DESC"
              ? "descend"
              : null
            : null,
      },
      {
        title: "开始时间",
        dataIndex: "startsAt",
        width: 120,
        responsive: ["md"],
        render: (v: any) => formatDateYMD(v),
        sorter: true,
        sortOrder:
          sortBy === "startsAt"
            ? sortOrder === "ASC"
              ? "ascend"
              : sortOrder === "DESC"
              ? "descend"
              : null
            : null,
      },
      {
        title: "截止时间",
        dataIndex: "expiresAt",
        width: 120,
        responsive: ["md"],
        render: (v: any) => formatDateYMD(v),
        sorter: true,
        sortOrder:
          sortBy === "expiresAt"
            ? sortOrder === "ASC"
              ? "ascend"
              : sortOrder === "DESC"
              ? "descend"
              : null
            : null,
      },
      {
        title: "处理人",
        dataIndex: "handlerId",
        width: 120,
        responsive: ["lg"],
        render: (_: any, r: RecordItem) =>
          r.handlerUsername || r.handlerId || "-",
      },
      {
        title: "状态",
        dataIndex: "recordSource",
        width: 90,
        responsive: ["xs"],
        render: (s: RecordItem["recordSource"]) =>
          s === "active" ? (
            <Tag color="green">生效</Tag>
          ) : (
            <Tag color="#a6adb1ff">失效</Tag>
          ),
      },
      {
        title: "撤销",
        dataIndex: "revoked",
        width: 96,
        responsive: ["xs"],
        render: (v: boolean) => (v ? <Tag color="green">已撤销</Tag> : null),
      },
      {
        title: "撤销原因",
        dataIndex: "revokeReason",
        width: 140,
        ellipsis: true,
        responsive: ["md"],
        render: (_: any, r: RecordItem) =>
          r.revokeReasonLabel || r.revokeReason || "-",
      },
      {
        title: "操作",
        dataIndex: "op",
        width: 120,
        responsive: ["xs"],
        render: (_: any, r: RecordItem) => (
          <Space>
            <Button
              size="small"
              type="link"
              disabled={r.recordSource !== "active" || r.revoked}
              onClick={() => {
                setRevokeTarget(r);
                revokeForm.resetFields();
                loadRevokeReasons();
                setRevokeOpen(true);
              }}
            >
              撤销
            </Button>
          </Space>
        ),
      },
    ],
    [sortBy, sortOrder, revokeForm, setRevokeTarget, setRevokeOpen] // Added dependencies
  );

  return {
    isMobile,
    params,
    loading,
    data,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    pageOffsetRef,
    query,
    setQuery,
    searchText,
    setSearchText,
    initialUserId,
    advOpen,
    setAdvOpen,
    revokeOpen,
    setRevokeOpen,
    revokeTarget,
    setRevokeTarget,
    revokeLoading,
    setRevokeLoading,
    revokeForm,
    revokeReasonOptions,
    revokeReasonLoading,
    typeSelect,
    setTypeSelect,
    reasonSelect,
    setReasonSelect,
    statusSelect,
    setStatusSelect,
    typeOptions,
    typeLoading,
    reasonOptions,
    reasonLoading,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    activeSelect,
    setActiveSelect,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    fetchList,
    searchUserAndFetch,
    expandedCacheRef,
    tableContainerRef,
    columns,
    message,
    loadRevokeReasons,
  };
};
