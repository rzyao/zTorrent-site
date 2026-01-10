import { Button, Form, Input, Select, Space, Table, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useInviteQuota } from "@/modules/admin/shared/invites/hooks/useInviteQuota";
import { formatDate } from "@/modules/admin/utils/formatDate";

export default function InviteQuotaPage() {
  const { loading, items, total, page, pageSize, form, fetchList } = useInviteQuota();

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <Form
        form={form}
        layout="inline"
        className="mb-4 gap-y-4"
        onFinish={() => fetchList({ page: 1, limit: pageSize })}
      >
        <Form.Item name="userId" label="用户ID">
          <Input allowClear placeholder="用户ID" className="w-48" />
        </Form.Item>
        <Form.Item name="permanentOnly" label="仅永�?>
          <Select
            allowClear
            className="w-32"
            options={[
              { label: "�?, value: true },
              { label: "�?, value: false },
            ]}
          />
        </Form.Item>
        <Form.Item name="activeOnly" label="仅活�?>
          <Select
            allowClear
            className="w-32"
            options={[
              { label: "�?, value: true },
              { label: "�?, value: false },
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

      <Table
        bordered
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
          { title: "用户ID", dataIndex: "userId", width: 140 },
          {
            title: "类型",
            dataIndex: "isPermanent",
            width: 100,
            render: (v: boolean) => (v ? <Tag color="purple">永久</Tag> : <Tag>临时</Tag>),
          },
          {
            title: "过期时间",
            dataIndex: "expiresAt",
            width: 180,
            render: (v: string) => formatDate(v),
          },
          {
            title: "消耗时�?,
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
