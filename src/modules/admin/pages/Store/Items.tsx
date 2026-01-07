import { useEffect, useMemo, useState } from "react";
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import type { StoreItem, CreateStoreItemDto, UpdateStoreItemDto } from "../../types/store";
import { StoreService } from "@/api/services/StoreService";
import { formatDate } from "@/modules/admin/utils/formatDate";

/**
 * 商品管理页面
 * 职责：提供商城商品的创建/更新/删除/上下架能力，并展示基本信息
 * 设计说明：
 * - 使用 Antd Table 呈现列表；新增/编辑使用 Modal+Form
 * - 写操作（新增、更新、删除、上下架）统一二次确认，满足审计要求
 * - 字段校验与默认值遵循后端契约；类型、状态为枚举选择
 */
export default function StoreItemsPage() {
  const { message, modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<StoreItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<StoreItem | null>(null);
  const [createForm] = Form.useForm<CreateStoreItemDto>();
  const [editForm] = Form.useForm<UpdateStoreItemDto>();

  const filtered = useMemo(() => {
    const s = searchText.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) =>
      [it.key, it.title, it.type, it.status].some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [items, searchText]);

  async function loadList() {
    setLoading(true);
    try {
      // 说明：这里调用用户端列表接口以校验上架可见性；后端如有管理端专用列表可替换
      // Add timestamp to prevent caching
      const resp = await StoreService.storeControllerListItemsPost({} as any);
      const data = resp?.data?.items || [];
      // Cast the loose Record<string, any> to StoreItem[]
      setItems(data as StoreItem[]);
      setTotal(resp?.data?.total || (data || []).length);
    } catch {
      message.error("商品列表加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  function openCreate() {
    setCreateOpen(true);
  }

  async function submitCreate() {
    try {
      const values = await createForm.validateFields();
      modal.confirm({
        title: "确认创建商品？",
        content: "写操作将记录审计日志，请确认信息无误",
        onOk: async () => {
          await StoreService.storeControllerCreateItem(values as any);
          setCreateOpen(false);
          message.success("新增商品成功");
          loadList();
        },
      });
    } catch {}
  }

  function openEdit(record: StoreItem) {
    setEditing(record);
    setEditOpen(true);
  }

  async function submitEdit() {
    if (!editing) return;
    try {
      const values = await editForm.validateFields();
      const { key: _omitKey, ...payload } = values as any;
      modal.confirm({
        title: "确认更新商品？",
        onOk: async () => {
          await StoreService.storeControllerUpdateItem({
            ...payload,
            // Ensure id is passed if needed by DTO
            id: editing.id,
          } as any);
          setEditOpen(false);
          setEditing(null);
          message.success("更新商品成功");
          loadList();
        },
      });
    } catch {}
  }

  async function remove(record: StoreItem) {
    modal.confirm({
      title: `确认删除商品 ${record.title}？`,
      okText: "删除",
      okButtonProps: { danger: true },
      onOk: async () => {
        await StoreService.storeControllerDeleteItem({
          id: record.id!,
        });
        message.success("删除成功");
        loadList();
      },
    });
  }

  async function toggle(record: StoreItem, toActive: boolean) {
    modal.confirm({
      title: `确认${toActive ? "上架" : "下架"}该商品？`,
      onOk: async () => {
        await StoreService.storeControllerToggleItem({
          id: record.id!,
          status: (toActive ? "active" : "inactive") as any,
        });
        message.success(toActive ? "已上架" : "已下架");
        loadList();
      },
    });
  }

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Space.Compact style={{ width: 280 }}>
          <Input
            allowClear
            placeholder="搜索键/名称/类型/状态"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Space.Compact>
        <Button type="primary" onClick={openCreate}>
          新增商品
        </Button>
      </Space>
      <Table
        bordered
        // 开启表格边框，便于区分商品列并提高信息密度的可读性
        rowKey={(r) => r.id || r.key}
        loading={loading}
        dataSource={filtered.slice((page - 1) * limit, (page - 1) * limit + limit)}
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
          { title: "Key", dataIndex: "key", width: 160 },
          { title: "名称", dataIndex: "title" },
          {
            title: "类型",
            dataIndex: "type",
            width: 140,
            render: (t: StoreItem["type"]) => <Tag>{t}</Tag>,
          },
          { title: "价格(魔力)", dataIndex: "pricePoints", width: 140 },
          { title: "库存", dataIndex: "stock", width: 120 },
          {
            title: "状态",
            dataIndex: "status",
            width: 120,
            render: (s: StoreItem["status"]) => (
              <Tag color={s === "active" ? "green" : "default"}>{s}</Tag>
            ),
          },
          {
            title: "更新时间",
            dataIndex: "updatedAt",
            width: 200,
            render: (t: string) => formatDate(t),
          },
          {
            title: "操作",
            width: 220,
            render: (_: any, record: StoreItem) => (
              <Space>
                <Button type="link" onClick={() => openEdit(record)}>
                  编辑
                </Button>
                <Popconfirm title="确认删除该商品？" onConfirm={() => remove(record)}>
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
                {record.status === "active" ? (
                  <Button type="link" onClick={() => toggle(record, false)}>
                    下架
                  </Button>
                ) : (
                  <Button type="link" onClick={() => toggle(record, true)}>
                    上架
                  </Button>
                )}
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="新增商品"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        okText="保存"
        destroyOnHidden
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{ type: "virtual", status: "inactive" }}
        >
          <Form.Item
            name="key"
            label="唯一键"
            rules={[{ required: true, message: "请输入唯一键" }]}
          >
            <Input placeholder="如 invite_code" />
          </Form.Item>
          <Form.Item name="title" label="名称" rules={[{ required: true, message: "请输入名称" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "virtual", value: "virtual" },
                { label: "privilege", value: "privilege" },
                { label: "service", value: "service" },
              ]}
            />
          </Form.Item>
          <Form.Item name="pricePoints" label="价格(魔力)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="stock" label="库存(可选)">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "active", value: "active" },
                { label: "inactive", value: "inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑商品"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={submitEdit}
        okText="保存"
        destroyOnHidden
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={
            editing
              ? {
                  id: editing.id,
                  title: editing.title,
                  type: editing.type,
                  pricePoints: editing.pricePoints,
                  status: editing.status,
                  stock: editing.stock ?? undefined,
                }
              : undefined
          }
        >
          <Form.Item name="id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item label="唯一键">
            <Input value={editing?.key} disabled />
          </Form.Item>
          <Form.Item name="title" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "virtual", value: "virtual" },
                { label: "privilege", value: "privilege" },
                { label: "service", value: "service" },
              ]}
            />
          </Form.Item>
          <Form.Item name="pricePoints" label="价格(魔力)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="stock" label="库存(可选)">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "active", value: "active" },
                { label: "inactive", value: "inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
