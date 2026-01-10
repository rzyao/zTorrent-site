import { useEffect, useState } from "react";
import { App, Button, Card, Form, Input, Modal, Select, Space, Statistic, Table, Tag } from "antd";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TicketsService } from "@/api/services/TicketsService";
import type { ListTicketsDto } from "@/api/models/ListTicketsDto";
import type { CloseTicketDto } from "@/api/models/CloseTicketDto";
import type { ConfirmResolvedDto } from "@/api/models/ConfirmResolvedDto";
import type { CreateTicketDto } from "@/api/models/CreateTicketDto";
import {
  statusText,
  statusColor,
  statusOptions,
  categoryText,
  categoryOptions,
  priorityText,
  priorityColor,
  priorityOptions,
} from "./_dicts";

/**
 * 工单管理 - 列表页
 * 功能：筛选、分页、统计、查看详情、关闭、确认已解决、新建工单
 * 设计原因：与项目内现有列表页保持一致的交互模式与视觉风格
 */
export default function TicketsList() {
  const nav = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>({ pending: 0, processing: 0, resolved: 0, closed: 0 });

  // 新建工单弹窗与表单状态
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm] = Form.useForm<CreateTicketDto>();

  const [form] = Form.useForm<ListTicketsDto>();

  /** 拉取统计数据：用于展示各状态工单数量 */
  const fetchStats = async () => {
    try {
      const res: any = await TicketsService.ticketsControllerStats();
      setStats(res?.data || { pending: 0, processing: 0, resolved: 0, closed: 0 });
    } catch (e: any) {
      // 统计失败不影响主流程
    }
  };

  /** 拉取列表数据：统一通过 OpenAPI 服务层调用 */
  const fetchList = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    try {
      const res: any = await TicketsService.ticketsControllerList({
        page,
        pageSize,
        status: values.status,
        category: values.category,
        keyword: values.keyword,
      });
      setItems(res?.data?.items ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  useEffect(() => {
    fetchList();
  }, [page, pageSize]);

  /** 关闭工单 */
  const handleClose = (ticketId: string) => {
    Modal.confirm({
      title: "确认关闭该工单？",
      onOk: async () => {
        try {
          await TicketsService.ticketsControllerClose({
            ticketId,
            reason: "后台关闭",
          } as CloseTicketDto);
          message.success("已关闭");
          fetchStats();
          fetchList();
        } catch (e: any) {
          message.error(e?.response?.data?.message || e?.message || "关闭失败");
        }
      },
    });
  };

  /** 确认已解决 */
  const handleConfirm = async (ticketId: string) => {
    try {
      await TicketsService.ticketsControllerConfirmResolved({ ticketId } as ConfirmResolvedDto);
      message.success("已确认");
      fetchStats();
      fetchList();
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "操作失败");
    }
  };

  /** 新建工单弹窗提交 */
  const submitCreate = async () => {
    const values = await createForm.validateFields();
    setCreateLoading(true);
    try {
      await TicketsService.ticketsControllerCreate(values as CreateTicketDto);
      message.success("新建成功");
      setCreateOpen(false);
      createForm.resetFields();
      setPage(1);
      fetchStats();
      fetchList();
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "新建失败");
    } finally {
      setCreateLoading(false);
    }
  };

  const columns = [
    { title: "工单ID", dataIndex: "id", width: 160 },
    { title: "标题", dataIndex: "title", ellipsis: true },
    {
      title: "优先级",
      dataIndex: "priority",
      render: (v: string) => <Tag color={priorityColor[v]}>{priorityText[v]}</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (v: string) => <Tag color={statusColor[v]}>{statusText[v]}</Tag>,
    },
    { title: "类别", dataIndex: "category", render: (v: string) => categoryText[v] },
    { title: "创建人", dataIndex: "creatorName" },
    { title: "创建时间", dataIndex: "createdAt", render: (v: string) => formatDate(v) },
    {
      title: "操作",
      fixed: "right" as const,
      width: 260,
      render: (_: any, row: any) => (
        <Space>
          <Button size="small" onClick={() => nav(`${row.id}`)}>
            查看详情
          </Button>
          <Button
            size="small"
            danger
            disabled={row.status === "closed"}
            onClick={() => handleClose(row.id)}
          >
            关闭
          </Button>
          <Button
            size="small"
            type="primary"
            disabled={row.status !== "resolved"}
            onClick={() => handleConfirm(row.id)}
          >
            确认已解决
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      {/* 顶部统计卡片：展示各状态工单数量 */}
      <Space wrap>
        <Card>
          <Statistic title="待处理" value={stats?.pending ?? 0} />
        </Card>
        <Card>
          <Statistic title="处理中" value={stats?.processing ?? 0} />
        </Card>
        <Card>
          <Statistic title="已解决" value={stats?.resolved ?? 0} />
        </Card>
        <Card>
          <Statistic title="已关闭" value={stats?.closed ?? 0} />
        </Card>
      </Space>

      {/* 工具条与筛选表单 */}
      <Card>
        <Form
          form={form}
          layout="inline"
          onFinish={() => {
            setPage(1);
            fetchList();
          }}
        >
          <Form.Item name="status" label="状态">
            <Select allowClear options={statusOptions} style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="category" label="类别">
            <Select allowClear options={categoryOptions} style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input allowClear placeholder="标题/内容/创建人" style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setPage(1);
                  fetchList();
                }}
              >
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
                新建工单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 列表表格 */}
      <Card>
        <Table
          bordered
          // 统一开启表格边框以提升可读性与视觉分隔
          rowKey="id"
          loading={loading}
          dataSource={items}
          columns={columns as any}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* 新建工单弹窗 */}
      <Modal
        title="新建工单"
        open={createOpen}
        confirmLoading={createLoading}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: "请输入标题" }]}>
            <Input maxLength={200} showCount placeholder="请输入工单标题" />
          </Form.Item>
          <Form.Item
            name="category"
            label="类别"
            rules={[{ required: true, message: "请选择类别" }]}
          >
            <Select options={categoryOptions} placeholder="请选择工单类别" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: "请选择优先级" }]}
          >
            <Select options={priorityOptions} placeholder="请选择优先级" />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: "请输入描述内容" }]}
          >
            <Input.TextArea
              rows={5}
              maxLength={4000}
              showCount
              placeholder="请详细描述问题场景与期望"
            />
          </Form.Item>
          {/* 附件上传：实际对接取决于后端返回结构，此处留待详情页统一实现与复用 */}
        </Form>
      </Modal>
    </Space>
  );
}
