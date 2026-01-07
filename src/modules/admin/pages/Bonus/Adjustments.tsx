import { useEffect, useMemo, useState } from "react";
import { App, Button, Form, Input, InputNumber, Select, Space, Table } from "antd";
import type {
  AdjustBonusDto,
  BonusAdjustment,
  ListBonusAdjustmentsDto,
} from "@/modules/admin/types/store";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import { formatDate } from "@/modules/admin/utils/formatDate";

/**
 * 人工调账页面
 * 职责：为管理员提供对用户魔力值的人工增减能力，并展示审计记录
 * 设计：
 * - 顶部表单提交时二次确认，体内包含 reason/ref 以便后端审计
 * - 下方列表分页与导出可按需扩展
 */
export default function BonusAdjustmentsPage() {
  const { message, modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BonusAdjustment[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [userFilter, setUserFilter] = useState<string | undefined>(undefined);
  const [form] = Form.useForm<AdjustBonusDto>();

  const query = useMemo<ListBonusAdjustmentsDto>(
    () => ({ userId: userFilter, page, pageSize: limit }),
    [userFilter, page, limit],
  );

  async function loadList() {
    setLoading(true);
    try {
      const resp: any = await BonusAdminService.bonusAccountControllerAdminListLedger(query as any);
      const data = resp?.data ?? resp;
      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(resp?.items)
          ? resp.items
          : [];
      const total = Number(data?.total ?? resp?.total ?? items.length);
      const nextPage = Number(data?.page ?? page);
      const nextPageSize = Number(data?.pageSize ?? limit);
      setItems(items);
      setTotal(total);
      setPage(nextPage);
      setLimit(nextPageSize);
    } catch {
      message.error("调账记录加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [query]);

  async function submitAdjust() {
    try {
      const values = await form.validateFields();
      modal.confirm({
        title: "确认执行人工调账？",
        content: `用户 ${values.userId}，金额 ${values.amount}，类型 ${values.type}，原因 ${values.reason}`,
        onOk: async () => {
          const delta = String(
            values.type === "debit"
              ? -Math.abs(Number(values.amount))
              : Math.abs(Number(values.amount)),
          );
          const payload = {
            userId: String(values.userId),
            delta,
            reason: String(values.reason),
            externalRef: values.ref ? String(values.ref) : undefined,
          } as any;
          await BonusAdminService.bonusAccountControllerAdminAdjust(payload);
          message.success("调账成功");
          form.resetFields();
          loadList();
        },
      });
    } catch {}
  }

  return (
    <>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="userId" label="用户ID" rules={[{ required: true }]}>
          <Input placeholder="输入用户ID" style={{ width: 180 }} />
        </Form.Item>
        <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
          <InputNumber style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="type" label="类型" rules={[{ required: true }]}>
          <Select
            style={{ width: 140 }}
            options={[
              { label: "credit(加)", value: "credit" },
              { label: "debit(减)", value: "debit" },
            ]}
          />
        </Form.Item>
        <Form.Item name="reason" label="原因" rules={[{ required: true, min: 2 }]}>
          <Input style={{ width: 240 }} placeholder="填写原因以便审计" />
        </Form.Item>
        <Form.Item name="ref" label="引用" tooltip="关联单据/工单号(可选)">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={submitAdjust}>
            提交调账
          </Button>
        </Form.Item>
      </Form>

      <Space style={{ marginBottom: 8 }}>
        <Input
          allowClear
          placeholder="筛选用户ID"
          value={userFilter}
          onChange={(e) => {
            setUserFilter(e.target.value || undefined);
            setPage(1);
          }}
          style={{ width: 200 }}
        />
      </Space>

      <Table
        bordered
        // 统一开启表格边框，保障审计类数据的可读性
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
          { title: "记录ID", dataIndex: "id", width: 180 },
          { title: "用户ID", dataIndex: "userId", width: 160 },
          { title: "金额", dataIndex: "amount", width: 120 },
          { title: "类型", dataIndex: "type", width: 120 },
          { title: "原因", dataIndex: "reason" },
          { title: "引用", dataIndex: "ref", width: 160 },
          { title: "操作人", dataIndex: "operator", width: 140 },
          {
            title: "时间",
            dataIndex: "createdAt",
            width: 200,
            render: (t: string) => formatDate(t),
          },
        ]}
      />
    </>
  );
}
