import { useEffect, useMemo, useRef, useState } from "react";
import {
  App,
  Button,
  Space,
  Table,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Popconfirm,
  Switch,
  Pagination,
  InputNumber,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlaylistsService } from "@/api/services/PlaylistsService";
import { PlaylistsReviewService } from "@/api/services/PlaylistsReviewService";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { ReviewDto } from "@/api/models/ReviewDto";
import { useNavigate } from "react-router-dom";

// 说明：片单列表项在后端为 PlaylistSummary，前端定义最小展示字段以驱动表格渲染
type PlaylistItem = {
  id?: string;
  title?: string;
  coverUrl?: string;
  type?: "general" | "topic" | "series" | "director" | "curation";
  visibility?: "public" | "private" | "friends";
  views?: number;
  likes?: number;
  enabled?: boolean;
  sort?: number;
  updatedAt?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  approvedAt?: string;
};

export default function Playlists() {
  const { message: msg } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<PlaylistItem["type"] | undefined>(undefined);
  const [visibility, setVisibility] = useState<PlaylistItem["visibility"] | undefined>(undefined);
  const [ownerUserId, setOwnerUserId] = useState<string | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PlaylistItem | null>(null);
  const [createForm] = Form.useForm<any>();
  const [editForm] = Form.useForm<{ id: string; data: any }>();
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<PlaylistItem["approvalStatus"] | undefined>(
    undefined,
  );
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<ReviewDto.action | "approve" | "reject">(
    "approve",
  );
  const [reviewForm] = Form.useForm<{ note?: string }>();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableScrollY, setTableScrollY] = useState<number | undefined>(undefined);

  const query = useMemo(
    () => ({
      page,
      limit,
      keyword: keyword || undefined,
      type,
      visibility,
      ownerUserId,
      approvalStatus: approvalStatus || undefined,
    }),
    [page, limit, keyword, type, visibility, ownerUserId, approvalStatus],
  );

  async function loadList() {
    setLoading(true);
    try {
      const resp: any = await PlaylistsService.playlistCoreControllerList(query as any);
      const data = resp?.data;
      const sourceItems = data?.items || resp?.items || resp?.list || [];
      setItems(
        sourceItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          coverUrl: item.coverUrl,
          type: item.type,
          visibility: item.visibility,
          views: item.views,
          likes: item.likes,
          enabled: item.enabled,
          sort: item.sort,
          updatedAt: item.updatedAt,
          approvalStatus: item.approvalStatus,
          approvedAt: item.approvedAt,
        })),
      );
      setTotal(Number(data?.total || resp?.total || sourceItems.length || 0));
    } catch (e: any) {
      msg.error(e?.message || "片单列表加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [query]);

  function openCreate() {
    createForm.resetFields();
    setCreateOpen(true);
  }

  async function submitCreate() {
    try {
      const values = await createForm.validateFields();
      setSaving(true);
      await PlaylistsService.playlistCoreControllerCreate(values as any);
      setCreateOpen(false);
      msg.success("新增片单成功");
      loadList();
    } catch (error: any) {
      msg.error(error?.message || "新增片单失败");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(record: PlaylistItem) {
    setEditing(record);
    editForm.setFieldsValue({
      id: record.id!,
      data: {
        title: record.title,
        description: undefined,
        coverUrl: record.coverUrl,
        type: record.type,
        visibility: record.visibility,
        enabled: record.enabled,
        sort: record.sort,
      },
    });
    setEditOpen(true);
  }

  async function submitEdit() {
    const id = editing?.id;
    if (!id) return;
    try {
      const values = await editForm.validateFields();
      setSaving(true);
      await PlaylistsService.playlistCoreControllerUpdate(values as any);
      setEditOpen(false);
      setEditing(null);
      msg.success("更新片单成功");
      loadList();
    } catch (error: any) {
      msg.error(error?.message || "更新片单失败");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    try {
      await PlaylistsService.playlistCoreControllerDelete({ id });
      msg.success("删除成功");
      loadList();
    } catch (e: any) {
      msg.error(e?.message || "删除失败");
    }
  }

  function openDetail(id: string) {
    navigate(`/playlists/${id}`);
  }
  async function doReview(ids: string[], action: ReviewDto.action, note?: string) {
    if (!ids.length) return;
    setSaving(true);
    try {
      for (const id of ids) {
        await PlaylistsReviewService.playlistReviewControllerReview({
          id,
          action,
          note,
        });
      }
      msg.success(action === ReviewDto.action.APPROVE ? "审核通过成功" : "审核驳回成功");
      setSelectedIds([]);
      loadList();
    } catch (e: any) {
      msg.error(e?.message || "审核操作失败");
    } finally {
      setSaving(false);
    }
  }

  const columns: ColumnsType<PlaylistItem> = [
    { title: "ID", dataIndex: "id", width: 80, ellipsis: true },
    { title: "标题", dataIndex: "title", ellipsis: true },
    { title: "封面", dataIndex: "coverUrl", ellipsis: true },
    {
      title: "类型",
      dataIndex: "type",
      width: 120,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "可见性",
      dataIndex: "visibility",
      width: 120,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    { title: "浏览", dataIndex: "views", width: 100 },
    { title: "点赞", dataIndex: "likes", width: 100 },
    {
      title: "启用",
      dataIndex: "enabled",
      width: 80,
      render: (v: boolean) => <Switch checked={!!v} disabled />,
    },
    { title: "排序", dataIndex: "sort", width: 80 },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      width: 160,
      render: (t: string) => formatDate(t),
    },
    {
      title: "审核状态",
      dataIndex: "approvalStatus",
      width: 120,
      render: (text: string) => (
        <Tag color={text === "approved" ? "green" : text === "rejected" ? "red" : "gold"}>
          {text || "-"}
        </Tag>
      ),
    },
    {
      title: "通过时间",
      dataIndex: "approvedAt",
      width: 180,
      ellipsis: true,
      render: (t: string) => formatDate(t),
    },
    {
      title: "操作",
      width: 220,
      render: (_: any, record: PlaylistItem) => (
        <Space>
          <Button type="link" onClick={() => openDetail(record.id!)}>
            详情
          </Button>
          <Button type="link" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除该片单？" onConfirm={() => remove(record.id)}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
          <Button type="link" onClick={() => doReview([record.id!], ReviewDto.action.APPROVE)}>
            通过
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              setReviewAction("reject");
              setReviewOpen(true);
              reviewForm.resetFields();
              setSelectedIds([record.id!]);
            }}
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const updateScrollY = () => {
      if (tableContainerRef.current) {
        const height = tableContainerRef.current.clientHeight;
        setTableScrollY(height - 55);
      }
    };
    const timer = setTimeout(updateScrollY, 0);
    const resizeObserver = new ResizeObserver(updateScrollY);
    const container = tableContainerRef.current;
    if (container) resizeObserver.observe(container);
    window.addEventListener("resize", updateScrollY);
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollY);
    };
  }, []);

  return (
    <>
      {/* 顶部筛选工具条：keyword/type/visibility/ownerUserId */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Space.Compact style={{ width: 260 }}>
          <Input
            allowClear
            placeholder="关键词"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => {
              setPage(1);
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              setPage(1);
            }}
          >
            搜索
          </Button>
        </Space.Compact>
        <Select
          value={approvalStatus}
          onChange={(v) => {
            setApprovalStatus(v as any);
            setPage(1);
          }}
          style={{ width: 160 }}
          placeholder="审核状态"
          allowClear
          options={[
            { label: "待审", value: "pending" },
            { label: "通过", value: "approved" },
            { label: "驳回", value: "rejected" },
          ]}
        />
        <Select
          value={type}
          onChange={(v) => {
            setType(v);
            setPage(1);
          }}
          style={{ width: 160 }}
          placeholder="类型"
          allowClear
          options={[
            { label: "通用", value: "general" },
            { label: "专题", value: "topic" },
            { label: "系列", value: "series" },
            { label: "导演", value: "director" },
            { label: "策展", value: "curation" },
          ]}
        />
        <Select
          value={visibility}
          onChange={(v) => {
            setVisibility(v);
            setPage(1);
          }}
          style={{ width: 160 }}
          placeholder="可见性"
          allowClear
          options={[
            { label: "公开", value: "public" },
            { label: "私密", value: "private" },
            { label: "好友", value: "friends" },
          ]}
        />
        <Input
          allowClear
          style={{ width: 180 }}
          placeholder="拥有者用户ID"
          value={ownerUserId}
          onChange={(e) => setOwnerUserId(e.target.value || undefined)}
        />
        <Button type="primary" onClick={openCreate}>
          新增片单
        </Button>
        {/* 批量操作：启用/禁用选中片单 */}
        <Button
          disabled={!selectedIds.length}
          onClick={async () => {
            try {
              setSaving(true);
              for (const id of selectedIds) {
                await PlaylistsService.playlistCoreControllerUpdate({
                  id,
                  data: { enabled: true },
                } as any);
              }
              msg.success("批量启用成功");
              setSelectedIds([]);
              loadList();
            } catch (e: any) {
              msg.error(e?.message || "批量启用失败");
            } finally {
              setSaving(false);
            }
          }}
        >
          批量启用
        </Button>
        <Button
          disabled={!selectedIds.length}
          danger
          onClick={async () => {
            try {
              setSaving(true);
              for (const id of selectedIds) {
                await PlaylistsService.playlistCoreControllerUpdate({
                  id,
                  data: { enabled: false },
                } as any);
              }
              msg.success("批量禁用成功");
              setSelectedIds([]);
              loadList();
            } catch (e: any) {
              msg.error(e?.message || "批量禁用失败");
            } finally {
              setSaving(false);
            }
          }}
        >
          批量禁用
        </Button>
        <Button
          disabled={!selectedIds.length}
          onClick={() => doReview(selectedIds, ReviewDto.action.APPROVE)}
        >
          批量通过
        </Button>
        <Button
          disabled={!selectedIds.length}
          danger
          onClick={() => {
            setReviewAction("reject");
            setReviewOpen(true);
            reviewForm.resetFields();
          }}
        >
          批量驳回
        </Button>
      </Space>

      {/* 列表表格 */}
      <div
        ref={tableContainerRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table
          bordered
          // 为片单列表开启边框，便于批量操作时按列定位
          rowKey="id"
          loading={loading}
          dataSource={items}
          pagination={false}
          scroll={{ x: "max-content", y: tableScrollY }}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: (keys) => setSelectedIds(keys as string[]),
          }}
          columns={columns}
        />
      </div>
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          showSizeChanger
          onChange={(p, ps) => {
            setPage(p);
            setLimit(ps);
          }}
        />
      </div>

      {/* 新增片单弹窗 */}
      <Modal
        title="新增片单"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        okText="保存"
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: "请输入标题" }]}>
            <Input placeholder="请输入片单标题" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="coverUrl" label="封面URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="type" label="类型">
            <Select
              options={[
                { label: "通用", value: "general" },
                { label: "专题", value: "topic" },
                { label: "系列", value: "series" },
                { label: "导演", value: "director" },
                { label: "策展", value: "curation" },
              ]}
            />
          </Form.Item>
          <Form.Item name="visibility" label="可见性">
            <Select
              options={[
                { label: "公开", value: "public" },
                { label: "私密", value: "private" },
                { label: "好友", value: "friends" },
              ]}
            />
          </Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑片单弹窗：按后端 /playlists/update-playlist 的 { id, data } 结构提交 */}
      <Modal
        title="编辑片单"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={submitEdit}
        okText="保存"
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {() => (
              <>
                <Form.Item
                  name={["data", "title"]}
                  label="标题"
                  rules={[{ required: true, message: "请输入标题" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name={["data", "description"]} label="描述">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name={["data", "coverUrl"]} label="封面URL">
                  <Input />
                </Form.Item>
                <Form.Item name={["data", "type"]} label="类型">
                  <Select
                    options={[
                      { label: "通用", value: "general" },
                      { label: "专题", value: "topic" },
                      { label: "系列", value: "series" },
                      { label: "导演", value: "director" },
                      { label: "策展", value: "curation" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name={["data", "visibility"]} label="可见性">
                  <Select
                    options={[
                      { label: "公开", value: "public" },
                      { label: "私密", value: "private" },
                      { label: "好友", value: "friends" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name={["data", "enabled"]} label="启用" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item name={["data", "sort"]} label="排序">
                  <InputNumber style={{ width: 160 }} />
                </Form.Item>
              </>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={reviewAction === "approve" ? "审核通过" : "审核驳回"}
        open={reviewOpen}
        onCancel={() => {
          setReviewOpen(false);
          setSelectedIds([]);
        }}
        onOk={async () => {
          const v = await reviewForm.validateFields().catch(() => null);
          setReviewOpen(false);
          await doReview(selectedIds, reviewAction as any, v?.note);
        }}
        okText="提交"
        destroyOnHidden
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="note" label="备注（≤500字）">
            <Input.TextArea
              rows={4}
              maxLength={500}
              showCount
              placeholder="请输入备注原因（可选）"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
