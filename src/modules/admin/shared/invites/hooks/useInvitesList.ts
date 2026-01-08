import { useState, useEffect, useMemo } from "react";
import { App, Form } from "antd";
import type { InviteRecord } from "../types";
import { Service as InvitesService } from "@/api/services/Service";
import type { ListInvitesDto } from "@/api/models/ListInvitesDto";

export function useInvitesList() {
  const { message, modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InviteRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [form] = Form.useForm();

  const perms = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]") as string[];
    } catch {
      return [];
    }
  }, []);

  const isSuperAdmin = (localStorage.getItem("username") || "") === "admin";
  const hasPerm = (key: string) => isSuperAdmin || perms.includes(key);

  const fetchList = async ({ page, limit }: { page: number; limit: number }) => {
    setLoading(true);
    try {
      const v = form.getFieldsValue();
      const req: ListInvitesDto = {
        page,
        limit,
        status: v.status,
        type: v.type,
        email: v.email,
        issuerId: v.issuerId,
        dateFrom: v.dateRange?.[0]?.toISOString?.() ?? undefined,
        dateTo: v.dateRange?.[1]?.toISOString?.() ?? undefined,
        sortBy: v.sortBy,
        order: v.order,
      };
      const resp = await InvitesService.inviteRecordControllerListInvites(req);
      const data = (resp as any)?.data || {};
      const list = Array.isArray(data?.items) ? (data.items as InviteRecord[]) : [];
      setItems(list);
      setTotal(Number(data?.total || 0));
      setPage(Number(data?.page || page));
      setPageSize(Number(data?.limit || limit));
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "加载邀请记录失败");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = (record: InviteRecord) => {
    modal.confirm({
      title: "确认撤销该邀请？",
      content: "仅允许未被接受且未过期的已发送邀请撤销；撤销后无法恢复。",
      okText: "撤销",
      cancelText: "取消",
      onOk: async () => {
        try {
          const resp = await InvitesService.inviteCoreControllerRevoke({ recordId: record.id });
          const ok = (resp as any)?.code === 1000 || (resp as any)?.data?.status === "revoked";
          if (ok) {
            message.success("已撤销");
            setItems((arr) =>
              arr.map((it) => (it.id === record.id ? { ...it, status: "revoked" } : it)),
            );
          } else {
            message.error((resp as any)?.message || "撤销失败");
          }
        } catch (e: any) {
          message.error(e?.response?.data?.message || e?.message || "撤销失败");
        }
      },
    });
  };

  const handleResend = (record: InviteRecord) => {
    modal.confirm({
      title: "确认重发该邀请？",
      content: "已接受或已撤销的邀请不可重发；过期的邀请重发后会重置过期时间并置为已发送。",
      okText: "重发",
      cancelText: "取消",
      onOk: async () => {
        try {
          const resp = await InvitesService.inviteCoreControllerResend({ recordId: record.id });
          const ok = (resp as any)?.code === 1000 || !!(resp as any)?.data?.recordId;
          if (ok) {
            message.success("已重发");
            fetchList({ page, limit: pageSize });
          } else {
            message.error((resp as any)?.message || "重发失败");
          }
        } catch (e: any) {
          message.error(e?.response?.data?.message || e?.message || "重发失败");
        }
      },
    });
  };

  const handleExport = async () => {
    try {
      const v = form.getFieldsValue();
      const req = {
        status: v.status,
        type: v.type,
        email: v.email,
        issuerId: v.issuerId,
        dateFrom: v.dateRange?.[0]?.toISOString?.(),
        dateTo: v.dateRange?.[1]?.toISOString?.(),
      };
      const resp = await InvitesService.inviteStatsControllerExport(req as any);
      const url = (resp as any)?.data?.url;
      const expiresAt = (resp as any)?.data?.expiresAt;
      if (url) {
        message.success(`导出文件已生成，有效期至：${expiresAt || "24小时内"}`);
        window.open(String(url), "_blank");
      } else {
        message.error((resp as any)?.message || "导出失败");
      }
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "导出失败");
    }
  };

  useEffect(() => {
    form.setFieldsValue({ sortBy: "createdAt", order: "DESC" });
    fetchList({ page: 1, limit: pageSize });
  }, []);

  return {
    loading,
    items,
    total,
    page,
    pageSize,
    form,
    fetchList,
    handleRevoke,
    handleResend,
    handleExport,
    hasPerm,
  };
}
