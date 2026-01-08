import { useEffect, useMemo, useState } from "react";
import { App, Button, DatePicker, Drawer, Input, Select, Space, Table, Tag } from "antd";
import type { StoreOrder, ListStoreOrdersDto } from "@/modules/admin/types/store";
import { StoreService } from "@/api/services/StoreService";
import { formatDate } from "@/modules/admin/utils/formatDate";

/**
 * 订单列表页面
 * 职责：提供订单的分页与筛选查看，支持交付详情抽屉与导出 CSV
 */
export default function StoreOrdersPage() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<StoreOrder[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [itemId, setItemId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<StoreOrder["status"] | undefined>(undefined);
  const [range, setRange] = useState<[string, string] | null>(null);
  const [detail, setDetail] = useState<StoreOrder | null>(null);

  const query = useMemo<ListStoreOrdersDto>(
    () => ({
      userId,
      itemId,
      status,
      from: range ? range[0] : undefined,
      to: range ? range[1] : undefined,
      page,
      pageSize: limit,
    }),
    [userId, itemId, status, range, page, limit],
  );

  async function loadList() {
    setLoading(true);
    try {
      const resp = await StoreService.storeControllerListOrders(query as any);
      const data = resp?.data;
      setItems((data?.items || []) as StoreOrder[]);
      setTotal(data?.total || 0);
      setPage(data?.page || page);
      setLimit((data as any)?.pageSize || limit);
    } catch {
      message.error("订单列表加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [query]);

  function exportCsv() {
    const headers = ["id", "userId", "itemId", "status", "pointsCharged", "quantity", "createdAt"];
    const rows = items.map((it) => [
      it.id,
      it.userId,
      it.itemId,
      it.status,
      it.pointsCharged,
      it.quantity,
      it.createdAt || "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input
          allowClear
          placeholder="用户ID"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value || undefined);
            setPage(1);
          }}
          style={{ width: 160 }}
        />
        <Input
          allowClear
          placeholder="商品ID"
          value={itemId}
          onChange={(e) => {
            setItemId(e.target.value || undefined);
            setPage(1);
          }}
          style={{ width: 160 }}
        />
        <Select
          value={status as any}
          onChange={(v) => {
            setStatus(v as any);
            setPage(1);
          }}
          style={{ width: 160 }}
          options={[
            { label: "全部", value: undefined },
            { label: "created", value: "created" },
            { label: "paid", value: "paid" },
            { label: "delivered", value: "delivered" },
            { label: "failed", value: "failed" },
            { label: "refunded", value: "refunded" },
          ]}
        />
        <DatePicker.RangePicker
          value={undefined as any}
          onChange={(v) => {
            setRange(v ? [v[0]!.format("YYYY-MM-DD"), v[1]!.format("YYYY-MM-DD")] : null);
            setPage(1);
          }}
        />
        <Button onClick={exportCsv}>导出CSV</Button>
      </Space>

      <Table
        bordered
        // 启用边框以提升订单信息对齐与阅读体验
        rowKey="id"
        loading={loading}
        dataSource={items}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
        columns={[
          { title: "订单ID", dataIndex: "id", width: 180 },
          { title: "用户ID", dataIndex: "userId", width: 160 },
          { title: "商品ID", dataIndex: "itemId", width: 160 },
          {
            title: "状态",
            dataIndex: "status",
            width: 140,
            render: (s: StoreOrder["status"]) => (
              <Tag color={s === "delivered" ? "green" : s === "failed" ? "red" : "default"}>
                {s}
              </Tag>
            ),
          },
          { title: "扣除魔力", dataIndex: "pointsCharged", width: 140 },
          { title: "数量", dataIndex: "quantity", width: 100 },
          {
            title: "创建时间",
            dataIndex: "createdAt",
            width: 200,
            render: (t: string) => formatDate(t),
          },
          {
            title: "操作",
            width: 160,
            render: (_: any, r: StoreOrder) => (
              <Button type="link" onClick={() => setDetail(r)}>
                交付详情
              </Button>
            ),
          },
        ]}
      />

      <Drawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={`订单 ${detail?.id} 交付详情`}
        width={600}
      >
        {detail && (
          <pre
            style={{
              maxHeight: 480,
              overflow: "auto",
              background: "#f6f8fa",
              padding: 12,
              borderRadius: 8,
            }}
          >
            {JSON.stringify(detail.deliveryResult || {}, null, 2)}
          </pre>
        )}
        {detail?.status === "failed" && (
          <Tag color="red">交付失败：{String((detail?.deliveryResult as any)?.msg || "")}</Tag>
        )}
      </Drawer>
    </>
  );
}
