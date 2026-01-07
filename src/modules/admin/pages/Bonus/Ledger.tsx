import { useEffect, useMemo, useRef, useState } from "react";
import { App, Button, DatePicker, Form, Input, Space, Table } from "antd";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { ColumnsType } from "antd/es/table";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import type { UserBonusLedger } from "@/modules/admin/pages/Bonus/types/bonus";
import { useLocation } from "react-router-dom";

const { RangePicker } = DatePicker;

function useQueryParam(name: string) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name) || undefined, [search, name]);
}

export default function BonusLedgerPage() {
  const { message, modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UserBonusLedger[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number | undefined>(undefined);
  const initUserId = useQueryParam("userId");

  useEffect(() => {
    if (initUserId) {
      form.setFieldsValue({ userId: initUserId });
    }
  }, [initUserId]);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(rect.height - 260);
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const query = useMemo(() => {
    const v = form.getFieldsValue();
    const range = v.range as [any, any] | undefined;
    return {
      userId: v.userId?.trim() || undefined,
      type: v.type?.trim() || undefined,
      reason: v.reason?.trim() || undefined,
      externalRef: v.externalRef?.trim() || undefined,
      correlationId: v.correlationId?.trim() || undefined,
      from: range?.[0]?.toISOString(),
      to: range?.[1]?.toISOString(),
      page,
      pageSize,
    };
  }, [form, page, pageSize]);

  async function loadList() {
    setLoading(true);
    try {
      const resp = await BonusAdminService.bonusAccountControllerAdminListLedger(query as any);
      const data = resp?.data;
      setItems((data?.items || []) as UserBonusLedger[]);
      setTotal(data?.total || 0);
      setPage(data?.page || page);
      setPageSize(data?.pageSize || pageSize);
    } catch {
      message.error("流水列表加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [query]);

  async function handleReverse(record: any) {
    modal.confirm({
      title: "确认冲正该流水？",
      content: `流水ID: ${(record as any)?.id || ""}，金额: ${record.delta}，原因: ${record.reason}`,
      onOk: async () => {
        try {
          const adminUserId = localStorage.getItem("userId") || "0";
          await BonusAdminService.bonusAccountControllerAdminReverse({
            ledgerId: String((record as any)?.id || ""),
            adminUserId,
            reason: "admin_reverse",
          });
          message.success("已冲正");
          loadList();
        } catch {
          message.error("冲正失败或已存在配对记录");
        }
      },
    });
  }

  async function handleExport() {
    /* 暂时注释掉，因为 API 中缺少导出方法
    try {
      const resp = await (BonusAdminService as any).bonusControllerExportLedger(query);
      const data = resp?.data || {};
      const filename = (data.filename || "bonus-ledger.csv") as string;
      const csv = (data.csv || "") as string;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      message.error("导出失败");
    }
    */
    message.warning("导出功能暂不可用");
  }

  const columns: ColumnsType<UserBonusLedger & { id?: string | number }> = [
    { title: "时间", dataIndex: "createdAt", width: 200, render: (s: string) => formatDate(s) },
    { title: "用户名", dataIndex: "username", width: 160 },
    { title: "类型", dataIndex: "type", width: 160 },
    { title: "原因", dataIndex: "reason", width: 200 },
    { title: "变动值", dataIndex: "delta", width: 140 },
    { title: "余额(后)", dataIndex: "balanceAfter", width: 160 },
    { title: "引用类型", dataIndex: "refType", width: 140 },
    { title: "引用ID", dataIndex: "refId", width: 140 },
    { title: "幂等键", dataIndex: "externalRef", width: 220 },
    { title: "关联ID", dataIndex: "correlationId", width: 220 },
    {
      title: "操作",
      key: "actions",
      fixed: "right",
      width: 140,
      render: (_, row) => (
        <Button onClick={() => handleReverse(row)} disabled={row.type === "ADMIN_REVERSE"}>
          冲正
        </Button>
      ),
    },
  ];

  return (
    <div ref={containerRef} style={{ height: "100%" }}>
      <Space style={{ marginBottom: 12 }}>
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => {
            setPage(1);
          }}
        >
          <Form.Item label="用户ID" name="userId">
            <Input style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="类型" name="type">
            <Input style={{ width: 160 }} placeholder="ADMIN_ADJUST/ADMIN_REVERSE/GENERIC" />
          </Form.Item>
          <Form.Item label="原因" name="reason">
            <Input style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="幂等键" name="externalRef">
            <Input style={{ width: 220 }} />
          </Form.Item>
          <Form.Item label="关联ID" name="correlationId">
            <Input style={{ width: 220 }} />
          </Form.Item>
          <Form.Item label="时间范围" name="range">
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={loadList}>
                查询
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setPage(1);
                }}
              >
                重置
              </Button>
              <Button onClick={handleExport}>导出CSV</Button>
            </Space>
          </Form.Item>
        </Form>
      </Space>
      <div style={{ marginBottom: 8, color: "#888" }}>
        提示：导出最多 10,000 条；已被冲正的流水会显示为类型
        ADMIN_REVERSE，重复冲正将直接返回已有配对记录。
      </div>

      <Table
        bordered
        rowKey={(r) => String((r as any)?.id) || `${r.userId}-${r.createdAt}`}
        loading={loading}
        dataSource={items}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (p, s) => {
            setPage(p);
            setPageSize(s);
          },
        }}
        scroll={{ x: 1200, y: scrollY }}
        columns={columns}
      />
    </div>
  );
}
