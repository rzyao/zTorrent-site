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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { CategoriesService } from "@/api/services/CategoriesService";
import { AdminTorrentsService } from "@/api/services/AdminTorrentsService";
import { TorrentsUploadService } from "@/api/services/TorrentsUploadService";
import { TorrentsReviewService } from "@/api/services/TorrentsReviewService";
import type { CreateTorrentDto } from "@/api/models/CreateTorrentDto";
import type { UpdateTorrentDto } from "@/api/models/UpdateTorrentDto";
import type { DeleteTorrentDto } from "@/api/models/DeleteTorrentDto";
import { ReviewDto } from "@/api/models/ReviewDto";
import { AdminListTorrentsDto } from "@/api/models/AdminListTorrentsDto";
import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import AdvancedQueryBuilder from "@/modules/admin/components/AdvancedQueryBuilder";
import { formatBytes } from "@/modules/admin/utils/formatBytes";
import { formatDate } from "@/modules/admin/utils/formatDate";

type TorrentItem = {
  id?: string;
  key?: string;
  title?: string;
  category?: string;
  categoryId?: string;
  size?: number;
  seeders?: number;
  leechers?: number;
  completed?: number;
  createdAt?: string;
  uploader?: string;
  uploaderId?: string;
  enabled?: boolean;
  name?: string;
  description?: string;
  // 新增：审核字段与可见�?
  approvalStatus?: "pending" | "approved" | "rejected";
  approvedAt?: string;
  visible?: boolean;
};

type SortOrderLocal = "ascend" | "descend" | null;

// 已移除页面级 Title，避免重复的头部展示

export default function Torrents() {
  const { message: msg } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TorrentItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [sortBy, setSortBy] = useState<AdminListTorrentsDto["sortBy"] | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<AdminListTorrentsDto["order"] | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<TorrentItem | null>(null);
  const [createForm] = Form.useForm<CreateTorrentDto>();
  const [editForm] = Form.useForm<UpdateTorrentDto>();
  const [uploading, setUploading] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const [advRules, setAdvRules] = useState<
    { field: string; op: AdvancedRuleDto.op; value?: any; range?: [any, any] }[]
  >([]);
  const [advLogic, setAdvLogic] = useState<"AND" | "OR">("AND");
  // 新增：审核筛�?
  const [approvalStatus, setApprovalStatus] = useState<TorrentItem["approvalStatus"] | undefined>(
    undefined,
  );
  // 新增：驳回备注弹窗（批量与单条复用）
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<ReviewDto.action | "approve" | "reject">(
    "approve",
  );
  const [reviewForm] = Form.useForm<{ note?: string }>();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableScrollY, setTableScrollY] = useState<number | undefined>(undefined);

  const query = useMemo<AdminListTorrentsDto>(
    () => ({
      page,
      limit,
      category: categoryFilter,
      sortBy,
      order: sortOrder,
      approvalStatus: approvalStatus || undefined,
    }),
    [categoryFilter, page, limit, sortBy, sortOrder, approvalStatus],
  );

  async function loadCategories() {
    try {
      const resp = await CategoriesService.categoriesControllerTree({
        kind: "torrent",
        enabled: true,
      });
      const tree = resp?.data || [];
      const arr: any[] = [];
      // Flatten the 2-level tree
      for (const p of tree) {
        arr.push(p);
        if (p.children && Array.isArray(p.children)) {
          arr.push(...p.children);
        }
      }
      const opts = arr.map((c) => ({
        label: String(c?.label ?? c?.key ?? ""),
        value: String(c?.id ?? c?.key ?? ""),
      }));
      setCategories(opts.filter((x) => x.value));
    } catch {}
  }

  async function loadList() {
    setLoading(true);
    try {
      // 说明：后端接口方法名已调整，生成的客户端方法�?torrentsControllerListTorrentsForAdmin
      // 原调�?torrentsControllerAdminList 在服务中不存在，会导致未发起请求或运行时错误
      const resp: any = await AdminTorrentsService.torrentAdminControllerList(query);
      const data = resp?.data;
      const sourceItems = data?.items || resp?.items || resp?.list || [];
      setItems(
        sourceItems.map((item: any) => ({
          id: item.id,
          key: item.key,
          title: item.title,
          category: item.category,
          categoryId: item.categoryId,
          size: item.size,
          seeders: item.seeders,
          leechers: item.leechers,
          completed: item.completed,
          createdAt: item.createdAt,
          uploader: item.uploader,
          uploaderId: item.uploaderId,
          enabled: item.enabled,
          name: item.name,
          description: item.description,
          approvalStatus: item.approvalStatus,
          approvedAt: item.approvedAt,
          visible: item.visible,
        })),
      );
      setTotal(Number(data?.total || resp?.total || sourceItems.length || 0));
    } catch (e) {
      msg.error("种子列表加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function openCreate() {
    createForm.resetFields();
    setCreateOpen(true);
  }

  async function submitCreate() {
    try {
      const values = await createForm.validateFields();
      setUploading(true);
      await TorrentsUploadService.torrentUploadControllerUpload(values as CreateTorrentDto);
      setCreateOpen(false);
      msg.success("新增种子成功");
      loadList();
    } catch (error: any) {
      msg.error(error?.message || "新增种子失败");
    } finally {
      setUploading(false);
    }
  }

  function openEdit(record: TorrentItem) {
    setEditing(record);
    editForm.setFieldsValue({
      id: record.id,
      name: record.name,
      description: record.description,
      category: record.categoryId,
    });
    setEditOpen(true);
  }

  async function submitEdit() {
    if (!editing?.id) return;
    try {
      const values = await editForm.validateFields();
      await TorrentsUploadService.torrentUploadControllerUpdate({
        ...values,
        id: editing.id,
      } as UpdateTorrentDto);
      setEditOpen(false);
      setEditing(null);
      msg.success("更新种子成功");
      loadList();
    } catch (error: any) {
      msg.error(error?.message || "更新种子失败");
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    try {
      await TorrentsUploadService.torrentUploadControllerDelete({
        id,
      } as DeleteTorrentDto);
      msg.success("删除成功");
      loadList();
    } catch {
      msg.error("删除失败");
    }
  }

  function openDetail(id: string) {
    msg.info(`查看种子详情: ${id}`);
    // TODO: 跳转到详情页
  }

  function downloadTorrent(id: string) {
    msg.info(`下载种子: ${id}`);
    // TODO: 实现下载逻辑
  }

  // 新增：审核方法（单条或批量），驳回需备注
  async function doReview(ids: string[], action: ReviewDto.action, note?: string) {
    if (!ids.length) return;
    setUploading(true);
    try {
      for (const id of ids) {
        await TorrentsReviewService.torrentReviewControllerReview({ id, action, note });
      }
      msg.success(action === ReviewDto.action.APPROVE ? "审核通过成功" : "审核驳回成功");
      loadList();
    } catch (e: any) {
      msg.error(e?.message || "审核操作失败");
    } finally {
      setUploading(false);
    }
  }

  const columns = useMemo<ColumnsType<TorrentItem>>(
    () => [
      { title: "ID", dataIndex: "id", width: 80, ellipsis: true },
      {
        title: "分类",
        dataIndex: "category",
        width: 100,
        render: (text: string) => <Tag>{text}</Tag>,
      },
      { title: "标题", dataIndex: "title", ellipsis: true },
      {
        title: "大小",
        dataIndex: "size",
        width: 100,
        render: (size: number) => formatBytes(size || 0),
        sorter: true,
        sortOrder: (sortBy === AdminListTorrentsDto.sortBy.SIZE
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      {
        title: "做种",
        dataIndex: "seeders",
        width: 80,
        align: "center" as const,
        sorter: true,
        sortOrder: (sortBy === AdminListTorrentsDto.sortBy.SEEDERS
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      {
        title: "完成",
        dataIndex: "completed",
        width: 80,
        align: "center" as const,
        sorter: true,
        sortOrder: (sortBy === AdminListTorrentsDto.sortBy.DOWNLOADS
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      {
        title: "添加时间",
        dataIndex: "createdAt",
        width: 160,
        render: (date: string) => formatDate(date),
        sorter: true,
        sortOrder: (sortBy === AdminListTorrentsDto.sortBy.UPLOADED_AT
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      { title: "发布�?, dataIndex: "uploader", width: 120 },
      {
        title: "审核状�?,
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
        width: 160,
        render: (date: string) => formatDate(date),
        sorter: true,
        sortOrder: (sortBy === (AdminListTorrentsDto as any).sortBy.APPROVED_AT
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      {
        title: "可见",
        dataIndex: "visible",
        width: 80,
        render: (v: boolean) => <Tag color={v ? "green" : "red"}>{String(v)}</Tag>,
      },
      {
        title: "操作",
        width: 200,
        render: (_: any, record: TorrentItem) => (
          <Space>
            <Button type="link" onClick={() => openDetail(record.id!)}>
              详情
            </Button>
            <Button type="link" onClick={() => downloadTorrent(record.id!)}>
              下载
            </Button>
            <Button type="link" onClick={() => openEdit(record)}>
              编辑
            </Button>
            <Popconfirm title="确认删除该种子？" onConfirm={() => remove(record.id)}>
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
                setEditing({ id: record.id } as any);
              }}
            >
              驳回
            </Button>
          </Space>
        ),
      },
    ],
    [sortBy, sortOrder],
  );

  const TORRENT_FIELD_OPTIONS = [
    { label: "标题", value: "title", type: "text" as const },
    { label: "发布者ID", value: "uploaderId", type: "text" as const },
    { label: "大小", value: "size", type: "text" as const },
    { label: "做种人数", value: "seeders", type: "text" as const },
    { label: "下载人数", value: "downloads", type: "text" as const },
    { label: "是否可见", value: "visible", type: "bool" as const },
    { label: "是否启用", value: "isEnabled", type: "bool" as const },
    { label: "是否封禁", value: "isBanned", type: "bool" as const },
    { label: "上传时间", value: "uploadedAt", type: "date" as const },
    { label: "更新时间", value: "updatedAt", type: "date" as const },
    { label: "审核通过时间", value: "approvedAt", type: "date" as const },
  ];

  async function fetchAdminWithRules() {
    setLoading(true);
    try {
      const mapped = advRules.map((r) => {
        if (r.op === AdvancedRuleDto.op.BETWEEN && r.range && r.range.length === 2) {
          const [from, to] = r.range;
          return {
            field: r.field,
            op: AdvancedRuleDto.op.BETWEEN,
            range: [String(from), String(to)],
          };
        }
        const v = (() => {
          if (!r.value) return undefined;
          if (Array.isArray(r.value)) return r.value;
          if (typeof r.value?.toISOString === "function") return r.value.toISOString();
          return r.value;
        })();
        return { field: r.field, op: r.op, value: v };
      }) as any;
      const req: AdminListTorrentsDto = {
        category: categoryFilter,
        logic: advLogic === "AND" ? AdminListTorrentsDto.logic.AND : AdminListTorrentsDto.logic.OR,
        rules: mapped,
        page,
        limit,
      };
      // 说明：与列表一致，使用新的管理员列表方�?torrentsControllerListTorrentsForAdmin 以适配后端命名
      const resp: any = await AdminTorrentsService.torrentAdminControllerList(req);
      const data = resp?.data;
      const sourceItems = data?.items || resp?.items || resp?.list || [];
      setItems(
        sourceItems.map((item: any) => ({
          id: item.id,
          key: item.key,
          title: item.title,
          category: item.category,
          categoryId: item.categoryId,
          size: item.size,
          seeders: item.seeders,
          leechers: item.leechers,
          completed: item.completed,
          createdAt: item.createdAt,
          uploader: item.uploader,
          uploaderId: item.uploaderId,
          enabled: item.enabled,
          name: item.name,
          description: item.description,
        })),
      );
      setTotal(Number(data?.total || resp?.total || sourceItems.length || 0));
    } catch (e) {
      msg.error("高级查询失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let rafId: number | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const updateScrollY = () => {
      // 使用 RAF 避免强制重排
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (tableContainerRef.current) {
          const height = tableContainerRef.current.clientHeight;
          setTableScrollY(height - 55);
        }
      });
    };

    // 防抖处理
    const debouncedUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateScrollY, 100);
    };

    // 初始计算
    updateScrollY();

    const resizeObserver = new ResizeObserver(debouncedUpdate);
    const container = tableContainerRef.current;
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (debounceTimer) clearTimeout(debounceTimer);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* 去掉页面左上角的标题 Title：保留工具条与表�?*/}
        <Space style={{ marginBottom: 16 }}>
          <Space.Compact style={{ width: 240 }}>
            <Input
              allowClear
              placeholder="搜索标题或关键词"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
            value={categoryFilter}
            onChange={(v) => {
              setCategoryFilter(v);
              setPage(1);
            }}
            style={{ width: 160 }}
            placeholder="选择分类"
            allowClear
            options={categories}
          />
          {/* 新增：审核状态筛�?*/}
          <Select
            value={approvalStatus}
            onChange={(v) => {
              setApprovalStatus(v as any);
              setPage(1);
            }}
            style={{ width: 160 }}
            placeholder="审核状�?
            allowClear
            options={[
              { label: "待审", value: "pending" },
              { label: "通过", value: "approved" },
              { label: "驳回", value: "rejected" },
            ]}
          />
          {/* 批量审核按钮（需结合高级搜索或自选多条） */}
          <Button
            onClick={() =>
              doReview(items.map((i) => i.id!).filter(Boolean), ReviewDto.action.APPROVE)
            }
          >
            全部通过
          </Button>
          <Button
            danger
            onClick={() => {
              setReviewAction("reject");
              setReviewOpen(true);
              reviewForm.resetFields();
            }}
          >
            全部驳回
          </Button>
          <Button type="primary" onClick={openCreate}>
            新增种子
          </Button>
          <Button onClick={() => setAdvOpen(true)}>高级搜索</Button>
        </Space>
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
            // 为数据密集的种子列表开启边框，便于按列快速浏�?
            rowKey="id"
            loading={loading}
            dataSource={items}
            pagination={false}
            scroll={{ x: "max-content", y: tableScrollY }}
            tableLayout="fixed"
            onChange={(_, __, sorter: any) => {
              const field = sorter?.field as keyof TorrentItem | undefined;
              const order = sorter?.order as "ascend" | "descend" | undefined;
              const fieldMap: Record<string, AdminListTorrentsDto["sortBy"]> = {
                createdAt: AdminListTorrentsDto.sortBy.UPLOADED_AT,
                size: AdminListTorrentsDto.sortBy.SIZE,
                seeders: AdminListTorrentsDto.sortBy.SEEDERS,
                completed: AdminListTorrentsDto.sortBy.DOWNLOADS,
              };
              const nextSortBy = field ? fieldMap[String(field)] : undefined;
              const nextOrder: AdminListTorrentsDto["order"] | undefined = order
                ? order === "ascend"
                  ? AdminListTorrentsDto.order.ASC
                  : AdminListTorrentsDto.order.DESC
                : undefined;
              setSortBy(nextSortBy);
              setSortOrder(nextOrder);
              setPage(1);
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
      </div>

      <Modal
        title="新增种子"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        okText="保存"
        confirmLoading={uploading}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label="种子名称" rules={[{ required: true }]}>
            <Input placeholder="请输入种子名�? />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select placeholder="请选择分类" options={categories} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描�? />
          </Form.Item>
          <Form.Item name="isAnonymous" label="匿名发布" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* 审核备注弹窗：用于驳回备注填�?*/}
      <Modal
        title={reviewAction === "approve" ? "审核通过" : "审核驳回"}
        open={reviewOpen}
        onCancel={() => setReviewOpen(false)}
        onOk={async () => {
          const v = await reviewForm.validateFields().catch(() => null);
          setReviewOpen(false);
          // 这里示例以“当前列表所有项”进行批量驳回；也可根据实际交互选中项集执行
          await doReview(items.map((i) => i.id!).filter(Boolean), reviewAction as any, v?.note);
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

      <Modal
        title="高级搜索"
        open={advOpen}
        onCancel={() => setAdvOpen(false)}
        onOk={() => {
          setAdvOpen(false);
          fetchAdminWithRules();
        }}
        width={860}
      >
        <AdvancedQueryBuilder
          fieldOptions={TORRENT_FIELD_OPTIONS as any}
          rules={advRules as any}
          logic={advLogic}
          onChange={(nextRules, nextLogic) => {
            setAdvRules(nextRules as any);
            setAdvLogic(nextLogic);
          }}
        />
      </Modal>

      <Modal
        title="编辑种子"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={submitEdit}
        okText="保存"
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="ID">
            <Input value={editing?.id} disabled />
          </Form.Item>
          <Form.Item name="name" label="种子名称" rules={[{ required: true }]}>
            <Input placeholder="请输入种子名�? />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select placeholder="请选择分类" options={categories} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描�? />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
