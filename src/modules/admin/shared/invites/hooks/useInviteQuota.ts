import { useState, useEffect } from "react";
import { App, Form } from "antd";
import type { InviteQuota } from "../types";
import { Service as InvitesService } from "@/api/services/Service";
import type { ListInviteQuotaDto } from "@/api/models/ListInviteQuotaDto";

export function useInviteQuota() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InviteQuota[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [form] = Form.useForm();

  const fetchList = async ({ page, limit }: { page: number; limit: number }) => {
    setLoading(true);
    try {
      const v = form.getFieldsValue();
      const req: ListInviteQuotaDto = {
        page,
        limit,
        userId: v.userId,
        permanentOnly: v.permanentOnly,
        activeOnly: v.activeOnly,
      };
      const resp = await InvitesService.inviteQuotaControllerListQuotas(req);
      const data = (resp as any)?.data || {};
      const list = Array.isArray(data?.items) ? (data.items as InviteQuota[]) : [];
      setItems(list);
      setTotal(Number(data?.total || 0));
      setPage(Number(data?.page || page));
      setPageSize(Number(data?.limit || limit));
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "加载邀请名额失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  };
}
