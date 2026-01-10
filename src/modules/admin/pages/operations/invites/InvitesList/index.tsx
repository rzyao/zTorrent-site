import { useMemo, useState } from "react";
import { Button, Form, Input, Select, Space, Table, Tag, DatePicker } from "antd";
import {
  ReloadOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useInvitesList } from "@/modules/admin/shared/invites/hooks/useInvitesList";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { InviteStatus, InviteType, InviteRecord } from "@/modules/admin/shared/invites/types";

const CodeCell: React.FC<{ code?: string }> = ({ code }) => {
  const [show, setShow] = useState(false);
  const masked = useMemo(() => {
    if (!code) return "";
    if (code.length <= 4) return "****";
    return `${"*".repeat(Math.max(0, code.length - 4))}${code.slice(-4)}`;
  }, [code]);
  return (
    <Space>
      <span className="font-mono">{show ? code : masked}</span>
      <Button
        size="small"
        type="text"
        icon={show ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={() => setShow((s) => !s)}
      />
    </Space>
  );
};

export default function InvitesListPage() {
  const {
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
  } = useInvitesList();

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <Form
        form={form}
        layout="inline"
        className="mb-4 gap-y-4"
        onFinish={() => fetchList({ page: 1, limit: pageSize })}
      >
        <Form.Item name="status" label="状�?>
          <Select
            allowClear
            className="w-40"
            options={[
              { label: "已发�?, value: "sent" },
              { label: "已接�?, value: "accepted" },
              { label: "已过�?, value: "expired" },
              { label: "已撤销", value: "revoked" },
            ]}
          />
        </Form.Item>
        <Form.Item name="type" label="类型">
          <Select
            allowClear
            className="w-48"
            options={[
              { label: "私人邀�?, value: "private-invitation" },
              { label: "官方邀�?, value: "office-invitation" },
            ]}
          />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input allowClear placeholder="被邀请邮�? className="w-56" />
        </Form.Item>
        <Form.Item name="issuerId" label="发起人ID">
          <Input allowClear placeholder="用户ID" className="w-40" />
        </Form.Item>
        <Form.Item name="dateRange" label="时间">
          <DatePicker.RangePicker />
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
            <Button type="dashed" icon={<DownloadOutlined />} onClick={handleExport}>
              导出
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
        scroll={{ x: "max-content" }}
        columns={[
          { title: "ID", dataIndex: "id", width: 180 },
          {
            title: "创建时间",
            dataIndex: "createdAt",
            width: 170,
            render: (t: string) => formatDate(t),
          },
          { title: "发起人ID", dataIndex: "inviterUserId", width: 120 },
          { title: "被邀请邮�?, dataIndex: "inviteeEmail", width: 200 },
          {
            title: "邀请码",
            dataIndex: "code",
            width: 160,
            render: (v: string) => <CodeCell code={v} />,
          },
          {
            title: "状�?,
            dataIndex: "status",
            width: 100,
            render: (v: InviteStatus) => {
              const map: any = {
                sent: ["blue", "已发�?],
                accepted: ["green", "已接�?],
                expired: ["orange", "已过�?],
                revoked: ["red", "已撤销"],
              };
              const [color, label] = map[v] || ["default", v];
              return <Tag color={color}>{label}</Tag>;
            },
          },
          {
            title: "类型",
            dataIndex: "type",
            width: 130,
            render: (v: InviteType) => {
              const map: any = {
                "private-invitation": ["purple", "私人邀�?],
                "office-invitation": ["gold", "官方邀�?],
              };
              const [color, label] = map[v] || ["default", v];
              return <Tag color={color}>{label}</Tag>;
            },
          },
          {
            title: "过期/接受时间",
            width: 170,
            render: (_, record: InviteRecord) => formatDate(record.acceptedAt || record.expiresAt),
          },
          {
            title: "操作",
            fixed: "right",
            width: 150,
            render: (_: any, record: InviteRecord) => (
              <Space>
                <Button
                  size="small"
                  disabled={!(hasPerm("manage-invites") && record.status === "sent")}
                  onClick={() => handleRevoke(record)}
                >
                  撤销
                </Button>
                <Button
                  size="small"
                  disabled={
                    !(
                      hasPerm("manage-invites") &&
                      (record.status === "sent" || record.status === "expired")
                    )
                  }
                  onClick={() => handleResend(record)}
                >
                  重发
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}
