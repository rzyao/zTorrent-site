import { useEffect, useState } from "react";
import { App, Button, Form, Input, Select, Space, Table, Tag } from "antd";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { ReloadOutlined } from "@ant-design/icons";
import type { InviteQuota } from "@/modules/admin/pages/Invites/types/invites";
import type { ListInviteQuotaDto } from "@/api/models/ListInviteQuotaDto";
import { Service as InvitesService } from "@/api/services/Service";

/**
 * 邀请名额列表页
 * 功能：筛选（用户/永久/活跃）、分页展示
 */
export default function InviteQuotaList() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InviteQuota[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchList({ page: 1, limit: pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchList({ page, limit }: { page: number; limit: number }) {
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
  }

  return (
    <div style={{ padding: 12 }}>
      {/* 顶部筛选区：用户ID/永久/活跃 */}
      <Form form={form} layout="inline" onFinish={() => fetchList({ page: 1, limit: pageSize })}>
        <Form.Item name="userId" label="用户ID">
          <Input allowClear placeholder="用户ID" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="permanentOnly" label="仅永久">
          <Select
            allowClear
            style={{ width: 120 }}
            options={[
              { label: "是", value: true },
              { label: "否", value: false },
            ]}
          />
        </Form.Item>
        <Form.Item name="activeOnly" label="仅活跃">
          <Select
            allowClear
            style={{ width: 120 }}
            options={[
              { label: "是", value: true },
              { label: "否", value: false },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<ReloadOutlined />}>
              查询
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                fetchList({ page: 1, limit: pageSize });
              }}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 列表表格 */}
      <Table
        bordered
        // 统一开启表格边框以增强数据分隔与一致性
        style={{ marginTop: 12 }}
        rowKey="id"
        dataSource={items}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p, ps) => fetchList({ page: p, limit: ps }),
        }}
        columns={[
          { title: "名额ID", dataIndex: "id", width: 160 },
          { title: "用户ID", dataIndex: "userId", width: 160 },
          {
            title: "是否永久",
            dataIndex: "isPermanent",
            width: 120,
            render: (v: boolean) => (v ? <Tag color="purple">永久</Tag> : <Tag>临时</Tag>),
          },
          {
            title: "过期时间",
            dataIndex: "expiresAt",
            width: 180,
            render: (v: string) => formatDate(v),
          },
          {
            title: "消耗时间",
            dataIndex: "consumedAt",
            width: 180,
            render: (v: string) => formatDate(v),
          },
          { title: "消耗记录ID", dataIndex: "consumedRecordId", width: 180 },
        ]}
      />
    </div>
  );
}
