import { useEffect, useMemo, useState } from "react";
import { App, Button, Form, Input, Select, Space, Table, Tag, DatePicker } from "antd";
import {
  ReloadOutlined,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type {
  InviteRecord,
  InviteStatus,
  InviteType,
} from "@/modules/admin/pages/Invites/types/invites";
import type { ListInvitesDto } from "@/api/models/ListInvitesDto";
import { Service as InvitesService } from "@/api/services/Service";
import { formatDate } from "@/modules/admin/utils/formatDate";

/**
 * 邀请记录列表页
 * 功能：查询、筛选、分页、撤销、重发、导出
 * 权限：页面进入需 manage-invites；按钮权限在路由层已处理，这里按业务规则控制显示与二次确认
 */
export default function InvitesList() {
  const { message, modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InviteRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [form] = Form.useForm();

  // 读取当前用户权限集合，用于操作按钮显隐控制（例如：撤销/重发需要 manage-invites）
  const perms = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]") as string[];
    } catch {
      return [];
    }
  }, []);
  const isSuperAdmin = (localStorage.getItem("username") || "") === "admin";
  const hasPerm = (key: string) => isSuperAdmin || perms.includes(key);

  useEffect(() => {
    // 默认筛选：按创建时间倒序
    form.setFieldsValue({ sortBy: "createdAt", order: "DESC" });
    fetchList({ page: 1, limit: pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 拉取列表数据：透传筛选条件并解析统一响应壳
   */
  async function fetchList({ page, limit }: { page: number; limit: number }) {
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
  }

  /** 撤销邀请：仅允许 status='sent' */
  const handleRevoke = (record: InviteRecord) => {
    modal.confirm({
      title: "确认撤销该邀请？",
      icon: <ExclamationCircleOutlined />,
      content: "仅允许未被接受且未过期的已发送邀请撤销；撤销后无法恢复。",
      okText: "撤销",
      cancelText: "取消",
      onOk: async () => {
        try {
          const resp = await InvitesService.inviteCoreControllerRevoke({ recordId: record.id });
          const ok = (resp as any)?.code === 1000 || (resp as any)?.data?.status === "revoked";
          if (ok) {
            message.success("已撤销");
            // 行内更新状态为 revoked
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

  /** 重发邀请：sent/expired 可重发；expired 重置过期并置为 sent */
  const handleResend = (record: InviteRecord) => {
    modal.confirm({
      title: "确认重发该邀请？",
      icon: <ExclamationCircleOutlined />,
      content: "已接受或已撤销的邀请不可重发；过期的邀请重发后会重置过期时间并置为已发送。",
      okText: "重发",
      cancelText: "取消",
      onOk: async () => {
        try {
          const resp = await InvitesService.inviteCoreControllerResend({ recordId: record.id });
          const ok = (resp as any)?.code === 1000 || !!(resp as any)?.data?.recordId;
          if (ok) {
            message.success("已重发");
            // 重发后刷新当前页以获取最新 expiresAt / 状态
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

  /** 导出 CSV：使用当前筛选条件 */
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
        columns: undefined,
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

  /** 渲染遮挡的邀请 code */
  const CodeCell: React.FC<{ code?: string }> = ({ code }) => {
    const [show, setShow] = useState(false);
    const masked = useMemo(() => {
      if (!code) return "";
      if (code.length <= 4) return "****";
      return `${"*".repeat(Math.max(0, code.length - 4))}${code.slice(-4)}`;
    }, [code]);
    return (
      <Space>
        <span style={{ fontFamily: "monospace" }}>{show ? code : masked}</span>
        <Button
          size="small"
          type="text"
          icon={show ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          onClick={() => setShow((s) => !s)}
        />
      </Space>
    );
  };

  return (
    <div style={{ padding: 12 }}>
      {/* 顶部筛选区：状态/类型/邮箱/发起人/日期范围/排序 */}
      <Form form={form} layout="inline" onFinish={() => fetchList({ page: 1, limit: pageSize })}>
        <Form.Item name="status" label="状态">
          <Select
            allowClear
            style={{ width: 160 }}
            options={[
              { label: "已发送", value: "sent" },
              { label: "已接受", value: "accepted" },
              { label: "已过期", value: "expired" },
              { label: "已撤销", value: "revoked" },
            ]}
          />
        </Form.Item>
        <Form.Item name="type" label="类型">
          <Select
            allowClear
            style={{ width: 200 }}
            options={[
              { label: "私人邀请", value: "private-invitation" },
              { label: "官方邀请", value: "office-invitation" },
            ]}
          />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input allowClear placeholder="被邀请邮箱" style={{ width: 220 }} />
        </Form.Item>
        <Form.Item name="issuerId" label="发起人ID">
          <Input allowClear placeholder="邀请发起人用户ID" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="dateRange" label="日期范围">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item name="sortBy" label="排序字段">
          <Select
            style={{ width: 160 }}
            options={[
              { label: "创建时间", value: "createdAt" },
              { label: "过期时间", value: "expiresAt" },
              { label: "接受时间", value: "acceptedAt" },
            ]}
          />
        </Form.Item>
        <Form.Item name="order" label="排序方向">
          <Select
            style={{ width: 120 }}
            options={[
              { label: "降序", value: "DESC" },
              { label: "升序", value: "ASC" },
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
            <Button type="dashed" icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 列表表格 */}
      <Table
        bordered
        // 开启表格边框以统一视觉风格、提升数据可读性
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
          { title: "ID", dataIndex: "id", width: 180 },
          {
            title: "创建时间",
            dataIndex: "createdAt",
            width: 180,
            render: (t: string) => formatDate(t),
          },
          { title: "发起人ID", dataIndex: "inviterUserId", width: 160 },
          { title: "被邀请邮箱", dataIndex: "inviteeEmail", width: 220 },
          {
            title: "邀请码",
            dataIndex: "code",
            width: 160,
            render: (v: string) => <CodeCell code={v} />,
          },
          {
            title: "状态",
            dataIndex: "status",
            width: 120,
            render: (v: InviteStatus) =>
              v === "sent" ? (
                <Tag color="blue">已发送</Tag>
              ) : v === "accepted" ? (
                <Tag color="green">已接受</Tag>
              ) : v === "expired" ? (
                <Tag color="orange">已过期</Tag>
              ) : v === "revoked" ? (
                <Tag color="red">已撤销</Tag>
              ) : (
                v
              ),
          },
          {
            title: "类型",
            dataIndex: "type",
            width: 160,
            render: (v: InviteType) =>
              v === "private-invitation" ? (
                <Tag color="purple">私人邀请</Tag>
              ) : v === "office-invitation" ? (
                <Tag color="gold">官方邀请</Tag>
              ) : (
                v
              ),
          },
          {
            title: "过期时间",
            dataIndex: "expiresAt",
            width: 180,
            render: (t: string) => formatDate(t),
          },
          {
            title: "接受时间",
            dataIndex: "acceptedAt",
            width: 180,
            render: (t: string) => formatDate(t),
          },
          {
            title: "操作",
            fixed: "right" as const,
            width: 200,
            render: (_: any, record: InviteRecord) => {
              const canRevoke = hasPerm("manage-invites") && record.status === "sent";
              const canResend =
                hasPerm("manage-invites") &&
                (record.status === "sent" || record.status === "expired");
              return (
                <Space>
                  <Button size="small" disabled={!canRevoke} onClick={() => handleRevoke(record)}>
                    撤销
                  </Button>
                  <Button size="small" disabled={!canResend} onClick={() => handleResend(record)}>
                    重发
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
    </div>
  );
}
