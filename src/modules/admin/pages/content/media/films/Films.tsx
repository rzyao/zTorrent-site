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
import { MoviesService } from "@/api/services/MoviesService";
import type { CreateMovieDto } from "@/api/models/CreateMovieDto";
import type { UpdateMovieDto } from "@/api/models/UpdateMovieDto";
import { ListMoviesDto } from "@/api/models/ListMoviesDto";
import { useNavigate } from "react-router-dom";

type MovieItem = {
  id?: string;
  title?: string;
  originalTitle?: string;
  year?: string;
  categories?: string[];
  genres?: string[];
  rating?: number;
  posterUrl?: string;
  viewsCount?: number;
  collectionsCount?: number;
  enabled?: boolean;
  sort?: number;
  createdAt?: string;
  updatedAt?: string;
};

type SortOrderLocal = "ascend" | "descend" | null;

export default function Films() {
  const { message: msg } = App.useApp();
  const navigate = useNavigate();
  const showError = (e: any, fallback: string) => {
    msg.error(e?.message || fallback);
  };

  // 列表状态与筛选条�?
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MovieItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [year, setYear] = useState<string | undefined>(undefined);
  const [genreIdsText, setGenreIdsText] = useState<string>("");

  const [sortBy, setSortBy] = useState<ListMoviesDto.sortBy | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<ListMoviesDto.order | undefined>(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<MovieItem | null>(null);
  const [createForm] = Form.useForm<any>();
  const [editForm] = Form.useForm<{ id: string; data: any }>();
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableScrollY, setTableScrollY] = useState<number | undefined>(undefined);
  const paginationRef = useRef<HTMLDivElement>(null);

  // 分类选项列表
  const [categoryOptions] = useState<{ label: string; value: string }[]>([
    { label: "动作", value: "Action" },
    { label: "喜剧", value: "Comedy" },
    { label: "剧情", value: "Drama" },
    { label: "科幻", value: "Sci-Fi" },
    { label: "惊悚", value: "Thriller" },
    { label: "恐�?, value: "Horror" },
    { label: "爱情", value: "Romance" },
    { label: "动画", value: "Animation" },
    { label: "纪录�?, value: "Documentary" },
  ]);

  const parseGenreIds = (text: string): string[] | undefined => {
    const arr = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return arr.length ? arr : undefined;
  };

  const query = useMemo<ListMoviesDto>(
    () => ({
      page,
      limit,
      keyword: keyword || undefined,
      categories: category ? [category] : undefined,
      year: year || undefined,
      genres: parseGenreIds(genreIdsText),
      sortBy,
      order: sortOrder,
    }),
    [page, limit, keyword, category, year, genreIdsText, sortBy, sortOrder],
  );

  async function loadList() {
    setLoading(true);
    try {
      const resp = await MoviesService.movieBaseControllerList(query);
      const data = resp.data;
      const sourceItems: any[] = data?.items || [];
      setItems(
        sourceItems.map((item: any) => ({
          ...item,
          id: item.id,
          title: item.title,
        })),
      );
      setTotal(Number(data?.total || 0));
    } catch (e: any) {
      showError(e, "电影列表加载失败");
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

      const payload: CreateMovieDto = {
        title: values.title,
        posterUrl: values.posterUrl,
        originalTitle: values.originalTitle,
        year: values.year,
        rating: values.rating,
        duration: values.duration,
        categories: values.categories,
        genres: values.genres,
        description: values.description,
        director: values.director,
        cast: values.cast,
        enabled: values.enabled,
        backdropUrl: values.backdropUrl,
      };

      await MoviesService.movieBaseControllerCreate(payload);

      setCreateOpen(false);
      msg.success("新增电影成功");
      loadList();
    } catch (error: any) {
      showError(error, "新增电影失败");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(record: MovieItem) {
    setEditing(record);
    editForm.setFieldsValue({
      id: record.id!,
      data: {
        title: record.title,
        originalTitle: record.originalTitle,
        year: record.year,
        rating: record.rating,
        posterUrl: record.posterUrl,
        categories: record.categories,
        genres: record.genres,
        enabled: record.enabled,
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

      const payload: UpdateMovieDto = {
        id,
        ...values.data,
      };

      await MoviesService.movieBaseControllerUpdate(payload);
      setEditOpen(false);
      setEditing(null);
      msg.success("更新电影成功");
      loadList();
    } catch (error: any) {
      showError(error, "更新电影失败");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    try {
      await MoviesService.movieBaseControllerDelete({ id } as any);
      msg.success("删除成功");
      loadList();
    } catch (e: any) {
      showError(e, "删除失败");
    }
  }

  function openDetail(id: string) {
    navigate(`/movies/${id}`);
  }

  const columns: ColumnsType<MovieItem> = [
    { title: "ID", dataIndex: "id", width: 80, ellipsis: true },
    { title: "标题", dataIndex: "title", width: 220, ellipsis: true },
    { title: "原名", dataIndex: "originalTitle", width: 220, ellipsis: true },
    { title: "年份", dataIndex: "year", width: 100, sorter: true },
    {
      title: "分类",
      dataIndex: "categories",
      width: 150,
      render: (cats: string[]) => (
        <Space wrap size={4}>
          {cats?.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </Space>
      ),
    },
    { title: "评分", dataIndex: "rating", width: 80, sorter: true },
    { title: "海报", dataIndex: "posterUrl", width: 160, ellipsis: true },
    { title: "热度", dataIndex: "viewsCount", width: 100, sorter: true },
    {
      title: "操作",
      width: 200,
      render: (_: any, record: MovieItem) => (
        <Space>
          <Button type="link" onClick={() => openDetail(record.id!)}>
            详情
          </Button>
          <Button type="link" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除该电影？" onConfirm={() => remove(record.id)}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    let rafId: number | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const recompute = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const container = tableContainerRef.current;
        if (!container) return;
        const top = container.getBoundingClientRect().top;
        const bottomBarH = paginationRef.current?.clientHeight || 56;
        const viewportH = window.innerHeight;
        const y = Math.max(120, viewportH - top - bottomBarH);
        setTableScrollY(y);
      });
    };

    const debouncedRecompute = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(recompute, 100);
    };

    recompute();
    window.addEventListener("resize", debouncedRecompute);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener("resize", debouncedRecompute);
    };
  }, [items, page, limit]);

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Space.Compact style={{ width: 260 }}>
          <Input
            allowClear
            placeholder="关键�?
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => setPage(1)}
          />
          <Button type="primary" onClick={() => setPage(1)}>
            搜索
          </Button>
        </Space.Compact>

        <Select
          value={category}
          onChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          style={{ width: 160 }}
          placeholder="分类"
          allowClear
          options={categoryOptions}
        />
        <Input
          allowClear
          style={{ width: 140 }}
          placeholder="年份"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <Input
          allowClear
          style={{ width: 200 }}
          placeholder="Tag ID (逗号分隔)"
          value={genreIdsText}
          onChange={(e) => setGenreIdsText(e.target.value)}
        />
        <Button type="primary" onClick={openCreate}>
          新增电影
        </Button>
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
          rowKey="id"
          loading={loading}
          dataSource={items}
          pagination={false}
          scroll={{ x: "max-content", y: tableScrollY }}
          tableLayout="fixed"
          onChange={(_, __, sorter: any) => {
            const s = Array.isArray(sorter) ? sorter[0] : sorter;
            const field = s?.field as string | undefined;
            const order = s?.order as SortOrderLocal | undefined;

            let apiOrder: ListMoviesDto.order | undefined;
            if (order === "ascend") apiOrder = ListMoviesDto.order.ASC;
            if (order === "descend") apiOrder = ListMoviesDto.order.DESC;

            if (field && Object.values(ListMoviesDto.sortBy).includes(field as any)) {
              setSortBy(field as ListMoviesDto.sortBy);
            } else {
              setSortBy(undefined);
            }

            setSortOrder(apiOrder);
            setPage(1);
          }}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: (keys) => setSelectedIds(keys as string[]),
          }}
          columns={columns}
        />
      </div>

      <div
        ref={paginationRef}
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

      <Modal
        title="新增电影"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        okText="保存"
        confirmLoading={saving}
        destroyOnHidden
        width={700}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: "请输入标�? }]}>
            <Input placeholder="请输入电影标�? />
          </Form.Item>
          <Form.Item name="originalTitle" label="原名">
            <Input placeholder="原始片名" />
          </Form.Item>
          <Space>
            <Form.Item name="year" label="年份">
              <Input placeholder="YYYY" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="rating" label="评分">
              <InputNumber min={0} max={10} step={0.1} />
            </Form.Item>
            <Form.Item name="duration" label="时长(分钟)">
              <InputNumber min={0} />
            </Form.Item>
          </Space>
          <Form.Item name="posterUrl" label="海报URL">
            <Input />
          </Form.Item>
          <Form.Item name="backdropUrl" label="背景URL">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="categories" label="分类">
            <Select mode="tags" options={categoryOptions} placeholder="选择或输入分�? />
          </Form.Item>
          <Form.Item name="genres" label="类型标签 (Genre IDs)">
            <Select mode="tags" placeholder="输入 ID" />
          </Form.Item>
          <Form.Item name="director" label="导演">
            <Input />
          </Form.Item>
          <Form.Item name="cast" label="演员 (以逗号或回车分�?">
            <Select mode="tags" open={false} placeholder="输入后回�? />
          </Form.Item>
          <Space>
            <Form.Item name="enabled" label="启用" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="sort" label="排序">
              <InputNumber />
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      <Modal
        title="编辑电影"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={submitEdit}
        confirmLoading={saving}
        destroyOnHidden
        width={700}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name={["data", "title"]} label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={["data", "originalTitle"]} label="原名">
            <Input />
          </Form.Item>
          <Space>
            <Form.Item name={["data", "year"]} label="年份">
              <Input style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name={["data", "rating"]} label="评分">
              <InputNumber min={0} max={10} step={0.1} />
            </Form.Item>
          </Space>
          <Form.Item name={["data", "posterUrl"]} label="海报URL">
            <Input />
          </Form.Item>
          <Form.Item name={["data", "categories"]} label="分类">
            <Select mode="tags" options={categoryOptions} />
          </Form.Item>
          <Form.Item name={["data", "genres"]} label="类型标签 (IDs)">
            <Select mode="tags" />
          </Form.Item>
          <Space>
            <Form.Item name={["data", "enabled"]} label="启用" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
