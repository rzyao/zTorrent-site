import { useEffect, useMemo, useRef, useState } from "react";
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
  Switch,
  Table,
  Row,
  Col,
} from "antd";
import { CategoriesService } from "@/api/services/CategoriesService";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";
import { OpenAPI } from "@/api/core/OpenAPI";
import { request as apiRequest } from "@/api/core/request";
import { formatDate } from "@/modules/admin/utils/formatDate";

type CategoryItem = {
  id?: string;
  key?: string;
  label?: string;
  description?: string | null;
  enabled?: boolean;
  isDefault?: boolean;
  sort?: number;
  createdAt?: string;
  updatedAt?: string;
  type?: "category" | "sub";
  parentId?: string;
  kind?: UpdateCategoryDto.kind;
  genre?: UpdateCategoryDto.genre;
  children?: CategoryItem[];
};

type CreateCategoryFormValues = any;

export default function CategoriesBase({
  kind,
  genre,
}: {
  kind: UpdateCategoryDto.kind;
  genre?: UpdateCategoryDto.genre;
}) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [enabledFilter, setEnabledFilter] = useState<boolean | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [createForm] = Form.useForm<CreateCategoryFormValues>();
  const [editForm] = Form.useForm<UpdateCategoryDto>();
  const [createInitial, setCreateInitial] = useState<Partial<CreateCategoryFormValues> | undefined>(
    undefined,
  );
  const [editInitial, setEditInitial] = useState<Partial<UpdateCategoryDto> | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableScrollY, setTableScrollY] = useState<number | undefined>(undefined);
  const [createKeyPrefix, setCreateKeyPrefix] = useState<string | undefined>(undefined);

  const treeData = useMemo<CategoryItem[]>(() => {
    const kw = (search || "").trim().toLowerCase();
    const matchText = (n: CategoryItem) => {
      if (!kw) return true;
      return (n.key || "").toLowerCase().includes(kw) || (n.label || "").toLowerCase().includes(kw);
    };
    const matchEnabled = (n: CategoryItem) => {
      if (enabledFilter === undefined) return true;
      return Boolean(n.enabled) === Boolean(enabledFilter);
    };
    const filterRec = (nodes: CategoryItem[]): CategoryItem[] => {
      const res: CategoryItem[] = [];
      for (const node of nodes || []) {
        const children = filterRec(node.children || []);
        const selfMatch = matchText(node) && matchEnabled(node);
        if (selfMatch || children.length > 0) {
          res.push({
            ...node,
            children: children.length > 0 ? children : undefined,
          });
        }
      }
      return res;
    };
    return filterRec(items);
  }, [items, search, enabledFilter]);

  async function loadList() {
    setLoading(true);
    try {
      const body: any = { kind };
      if (genre) body.genre = genre;
      const treeResp = await apiRequest(OpenAPI, {
        method: "POST",
        url: "/categories/tree",
        body,
        mediaType: "application/json",
      });
      const tree = (treeResp as any)?.data || [];
      const normalized = normalizeTree(tree);
      const roots = normalized.filter((n) => !n.parentId);
      setItems(roots);
    } catch (e) {
      message.error((e as any)?.message || "分类树加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

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
    if (container) {
      resizeObserver.observe(container);
    }
    window.addEventListener("resize", updateScrollY);
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollY);
    };
  }, []);

  function openCreate() {
    setCreateOpen(true);
    setCreateKeyPrefix(undefined);
    setCreateInitial({
      enabled: true,
      sort: 0,
      genre: genre ?? UpdateCategoryDto.genre.GENERAL,
      kind,
      parentId: undefined,
    });
  }

  function openCreateSub(parentId: string) {
    setCreateOpen(true);
    const node = findNodeById(items, parentId);
    setCreateKeyPrefix(node?.key || undefined);
    setCreateInitial({
      enabled: true,
      sort: 0,
      genre: genre ?? UpdateCategoryDto.genre.GENERAL,
      kind,
      parentId,
    });
  }

  async function submitCreate() {
    try {
      const values = await createForm.validateFields();
      const payload: any = { ...values, kind };
      if (payload.parentId === undefined || payload.parentId === null || payload.parentId === "")
        delete payload.parentId;
      if (createKeyPrefix) {
        const suffix = String((payload as any).keySuffix || "").trim();
        payload.key = suffix ? `${createKeyPrefix}.${suffix}` : `${createKeyPrefix}`;
        delete (payload as any).keySuffix;
      }
      await CategoriesService.categoriesControllerCreate(payload);
      setCreateOpen(false);
      message.success("新增分类成功");
      loadList();
    } catch {}
  }

  function openEdit(record: CategoryItem) {
    setEditing(record);
    setEditInitial({
      label: record.label,
      description: record.description ?? undefined,
      enabled: record.enabled,
      sort: record.sort,
      genre: (record.genre as any) ?? undefined,
    });
    setEditOpen(true);
  }

  async function submitEdit() {
    if (!editing?.id) return;
    try {
      const values = await editForm.validateFields();
      await CategoriesService.categoriesControllerUpdate({
        id: editing.id,
        data: values,
      });
      setEditOpen(false);
      setEditing(null);
      message.success("更新分类成功");
      loadList();
    } catch {}
  }

  async function remove(id?: string) {
    if (!id) return;
    try {
      try {
        const body: any = { kind };
        if (genre) body.genre = genre;
        const treeResp = await apiRequest(OpenAPI, {
          method: "POST",
          url: "/categories/tree",
          body,
          mediaType: "application/json",
        });
        const tree = (treeResp as any)?.data || [];
        const target = (tree as any[]).find((p: any) => p.id === id);
        if (
          target &&
          Array.isArray((target as any).children) &&
          (target as any).children.length > 0
        ) {
          message.error("删除失败：该主分类存在副分类，请先处理副分类");
          return;
        }
      } catch {}
      await CategoriesService.categoriesControllerDelete({ id });
      message.success("删除成功");
      loadList();
    } catch (e) {
      message.error((e as any)?.message || "删除失败");
    }
  }

  async function toggleEnabled(record: CategoryItem, value: boolean) {
    if (!record.id) return;
    try {
      await CategoriesService.categoriesControllerUpdate({
        id: record.id,
        data: { enabled: value },
      });
      setItems((prev) =>
        updateItemRecursive(prev, record.id!, (node) => ({
          ...node,
          enabled: value,
        })),
      );
      message.success(value ? "已启用" : "已禁用");
    } catch {
      message.error("更新状态失败");
    }
  }

  async function toggleDefault(record: CategoryItem, value: boolean) {
    if (!record.id) return;
    try {
      await CategoriesService.categoriesControllerUpdate({
        id: record.id,
        data: { isDefault: value },
      });
      setItems((prev) =>
        updateItemRecursive(prev, record.id!, (node) => ({
          ...node,
          isDefault: value,
        })),
      );
      message.success(value ? "已设置展示" : "已隐藏展示");
    } catch {
      message.error("更新展示状态失败");
    }
  }

  function normalizeTree(nodes: any[]): CategoryItem[] {
    return (nodes || []).map((n: any) => {
      const t: "category" | "sub" | undefined = n?.parentId
        ? "sub"
        : n?.type === "category"
          ? "category"
          : n?.type === "sub"
            ? "sub"
            : undefined;
      const children = normalizeTree(n?.children || []);
      const item: CategoryItem = {
        id: n?.id,
        key: n?.key,
        label: n?.label,
        description: n?.description ?? undefined,
        enabled: n?.enabled,
        isDefault: n?.isDefault,
        sort: n?.sort,
        createdAt: n?.createdAt,
        updatedAt: n?.updatedAt,
        type: t,
        parentId: n?.parentId,
        kind: n?.kind,
        genre: n?.genre,
        children: children.length > 0 ? children : undefined,
      };
      return item;
    });
  }

  function findNodeById(nodes: CategoryItem[], id?: string): CategoryItem | undefined {
    if (!id) return undefined;
    for (const n of nodes || []) {
      if (n.id === id) return n;
      const found = findNodeById(n.children || [], id);
      if (found) return found;
    }
    return undefined;
  }

  function updateItemRecursive(
    list: CategoryItem[],
    id: string,
    updater: (node: CategoryItem) => CategoryItem,
  ): CategoryItem[] {
    return (list || []).map((n) => {
      if (n.id === id) {
        return updater(n);
      }
      const children = n.children ? updateItemRecursive(n.children, id, updater) : undefined;
      return children ? { ...n, children } : n;
    });
  }

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
        <div style={{ paddingBottom: 8 }}>
          <Space style={{ marginBottom: 16 }}>
            <Space.Compact style={{ width: 240 }}>
              <Input
                allowClear
                placeholder="搜索键或名称"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={() => {
                  setSearch(searchText || undefined);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  setSearch(searchText || undefined);
                }}
              >
                搜索
              </Button>
            </Space.Compact>
            <Select
              value={enabledFilter as any}
              onChange={(v) => {
                setEnabledFilter(v === undefined ? undefined : Boolean(v));
              }}
              style={{ width: 140 }}
              options={[
                { label: "全部", value: undefined },
                { label: "启用", value: true },
                { label: "禁用", value: false },
              ]}
            />
            <Button type="primary" onClick={openCreate}>
              新增分类
            </Button>
          </Space>
        </div>
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
            dataSource={treeData}
            pagination={false}
            scroll={{ x: "max-content", y: tableScrollY }}
            expandable={{
              expandIconColumnIndex: 0,
              childrenColumnName: "children",
              defaultExpandAllRows: false,
            }}
            columns={[
              { title: "键", dataIndex: "key" },
              { title: "名称", dataIndex: "label" },
              { title: "描述", dataIndex: "description" },
              {
                title: "启用",
                dataIndex: "enabled",
                width: 60,
                render: (_: any, record: CategoryItem) => (
                  <Switch
                    checked={Boolean(record.enabled)}
                    onChange={(v) => toggleEnabled(record, v)}
                  />
                ),
              },
              {
                title: "默认显示",
                dataIndex: "isDefault",
                width: 100,
                render: (_: any, record: CategoryItem) => (
                  <Switch
                    checked={Boolean(record.isDefault)}
                    onChange={(v) => toggleDefault(record, v)}
                  />
                ),
              },
              { title: "排序", dataIndex: "sort", width: 100 },
              {
                title: "创建时间",
                dataIndex: "createdAt",
                width: 200,
                render: (t: string) => formatDate(t),
              },
              {
                title: "操作",
                width: 160,
                fixed: "right",
                render: (_: any, record: CategoryItem) => (
                  <Space>
                    <Button type="link" onClick={() => openEdit(record)}>
                      编辑
                    </Button>
                    <Button type="link" onClick={() => openCreateSub(record.id!)}>
                      新增子类
                    </Button>
                    <Popconfirm title="确认删除该分类？" onConfirm={() => remove(record.id)}>
                      <Button type="link" danger>
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </div>
      </div>

      <Modal
        title="新增分类"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        okText="保存"
        destroyOnHidden
        forceRender
        afterOpenChange={(open) => {
          if (open) {
            createForm.resetFields();
            if (createInitial) createForm.setFieldsValue(createInitial);
          } else {
            createForm.resetFields();
            setCreateKeyPrefix(undefined);
            setCreateInitial(undefined);
          }
        }}
      >
        <Form form={createForm} layout="horizontal">
          {createKeyPrefix ? (
            <>
              <Row gutter={12}>
                <Col span={24}>
                  <Form.Item name="keySuffix" label="键后缀" rules={[{ required: true }]}>
                    <Input placeholder="如 action 或 classic" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item shouldUpdate noStyle>
                    {() => (
                      <Form.Item
                        label={
                          <span>
                            <span
                              style={{
                                visibility: "hidden",
                                display: "inline-block",
                                width: 8,
                                color: "#ff4d4f",
                                marginRight: 4,
                              }}
                            >
                              *
                            </span>
                            完整键
                          </span>
                        }
                      >
                        <Input
                          value={`${createKeyPrefix}.${String(
                            createForm.getFieldValue("keySuffix") || "",
                          )}`}
                          disabled
                        />
                      </Form.Item>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row gutter={12}>
                <Col span={24}>
                  <Form.Item name="key" label="唯一键" rules={[{ required: true }]}>
                    <Input placeholder="如 movies" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item shouldUpdate noStyle>
                    {() => (
                      <Form.Item
                        label={
                          <span>
                            <span
                              style={{
                                visibility: "hidden",
                                display: "inline-block",
                                width: 8,
                                color: "#ff4d4f",
                                marginRight: 4,
                              }}
                            >
                              *
                            </span>
                            完整键
                          </span>
                        }
                      >
                        <Input value={String(createForm.getFieldValue("key") || "")} disabled />
                      </Form.Item>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item name="label" label="名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item
                name="sort"
                label={
                  <span>
                    <span
                      style={{
                        visibility: "hidden",
                        display: "inline-block",
                        width: 8,
                        color: "#ff4d4f",
                        marginRight: 4,
                      }}
                    >
                      *
                    </span>
                    排序
                  </span>
                }
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="enabled"
                label={
                  <span>
                    <span
                      style={{
                        visibility: "hidden",
                        display: "inline-block",
                        width: 8,
                        color: "#ff4d4f",
                        marginRight: 4,
                      }}
                    >
                      *
                    </span>
                    启用
                  </span>
                }
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                name="genre"
                label="分区"
                rules={[{ required: true, message: "请选择分区" }]}
              >
                <Select
                  options={[
                    { label: "普通", value: UpdateCategoryDto.genre.GENERAL },
                    { label: "成人", value: UpdateCategoryDto.genre.ADULT },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="description"
                label={
                  <span>
                    <span
                      style={{
                        visibility: "hidden",
                        display: "inline-block",
                        width: 8,
                        color: "#ff4d4f",
                        marginRight: 4,
                      }}
                    >
                      *
                    </span>
                    描述
                  </span>
                }
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="parentId" hidden>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑分类"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={submitEdit}
        okText="保存"
        destroyOnHidden
        forceRender
        afterOpenChange={(open) => {
          if (open) {
            editForm.resetFields();
            if (editInitial) editForm.setFieldsValue(editInitial);
          } else {
            editForm.resetFields();
            setEditing(null);
            setEditInitial(undefined);
          }
        }}
      >
        <Form form={editForm} layout="horizontal">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    <span
                      style={{
                        visibility: "hidden",
                        display: "inline-block",
                        width: 8,
                        color: "#ff4d4f",
                        marginRight: 4,
                      }}
                    >
                      *
                    </span>
                    唯一键
                  </span>
                }
              >
                <Input value={editing?.key} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="label" label="名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="sort"
                label={
                  <span>
                    <span
                      style={{
                        visibility: "hidden",
                        display: "inline-block",
                        width: 8,
                        color: "#ff4d4f",
                        marginRight: 4,
                      }}
                    >
                      *
                    </span>
                    排序
                  </span>
                }
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="enabled"
                label={
                  <span>
                    <span
                      style={{
                        visibility: "hidden",
                        display: "inline-block",
                        width: 8,
                        color: "#ff4d4f",
                        marginRight: 4,
                      }}
                    >
                      *
                    </span>
                    启用
                  </span>
                }
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                name="genre"
                label={
                  <span>
                    <span
                      style={{
                        visibility: "hidden",
                        display: "inline-block",
                        width: 8,
                        color: "#ff4d4f",
                        marginRight: 4,
                      }}
                    >
                      *
                    </span>
                    分区
                  </span>
                }
              >
                <Select
                  allowClear
                  options={[
                    { label: "普通", value: UpdateCategoryDto.genre.GENERAL },
                    { label: "成人", value: UpdateCategoryDto.genre.ADULT },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="description"
                label={
                  <span>
                    <span
                      style={{
                        visibility: "hidden",
                        display: "inline-block",
                        width: 8,
                        color: "#ff4d4f",
                        marginRight: 4,
                      }}
                    >
                      *
                    </span>
                    描述
                  </span>
                }
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
