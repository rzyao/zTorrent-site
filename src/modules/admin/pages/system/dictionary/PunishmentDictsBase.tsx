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
  Switch,
  Table,
} from "antd";
import { PunishmentDictsService } from "@/api/services/PunishmentDictsService";
import type { ListPunishmentDictDto } from "@/api/models/ListPunishmentDictDto";
import type { CreatePunishmentDictDto } from "@/api/models/CreatePunishmentDictDto";
import type { UpdatePunishmentDictDto } from "@/api/models/UpdatePunishmentDictDto";
import { formatDate } from "@/modules/admin/utils/formatDate";

type PunishmentDictItem = {
  id: string;
  category: string;
  key: string;
  label: string;
  description?: string | null;
  enabled: boolean;
  sort: number;
  createdAt: string;
  updatedAt: string;
};

interface PunishmentDictsBaseProps {
  category: ListPunishmentDictDto.category;
  title: string;
}

export default function PunishmentDictsBase({ category, title }: PunishmentDictsBaseProps) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PunishmentDictItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [enabledFilter, setEnabledFilter] = useState<boolean | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PunishmentDictItem | null>(null);
  const [createForm] = Form.useForm<CreatePunishmentDictDto>();
  const [editForm] = Form.useForm<UpdatePunishmentDictDto>();
  const [searchText, setSearchText] = useState("");

  const query = useMemo<ListPunishmentDictDto>(
    () => ({
      category,
      search,
      enabled: enabledFilter,
      page,
      limit,
    }),
    [category, search, enabledFilter, page, limit],
  );

  async function loadList() {
    setLoading(true);
    try {
      const resp = await PunishmentDictsService.punishmentDictsControllerList(query);
      const data = resp?.data;
      setItems((data?.items || []) as PunishmentDictItem[]);
      setTotal(data?.total || 0);
      setPage(data?.page || page);
      setLimit(data?.limit || limit);
    } catch (e) {
      message.error(`${title}列表加载失败`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function openCreate() {
    createForm.resetFields();
    createForm.setFieldsValue({ category, enabled: true, sort: 0 });
    setCreateOpen(true);
  }

  async function submitCreate() {
    try {
      const values = await createForm.validateFields();
      await PunishmentDictsService.punishmentDictsControllerCreate({
        ...values,
        category,
      });
      setCreateOpen(false);
      message.success(`新增${title}成功`);
      loadList();
    } catch {}
  }

  function openEdit(record: PunishmentDictItem) {
    setEditing(record);
    editForm.resetFields();
    editForm.setFieldsValue({
      label: record.label,
      description: record.description ?? undefined,
      enabled: record.enabled,
      sort: record.sort,
    });
    setEditOpen(true);
  }

  async function submitEdit() {
    if (!editing?.id) return;
    try {
      const values = await editForm.validateFields();
      await PunishmentDictsService.punishmentDictsControllerUpdate({
        id: editing.id,
        data: values,
      });
      setEditOpen(false);
      setEditing(null);
      message.success(`更新${title}成功`);
      loadList();
    } catch {}
  }

  async function remove(id: string) {
    try {
      await PunishmentDictsService.punishmentDictsControllerDelete({ id });
      message.success("删除成功");
      loadList();
    } catch {
      message.error("删除失败");
    }
  }

  async function toggleEnabled(record: PunishmentDictItem, value: boolean) {
    try {
      await PunishmentDictsService.punishmentDictsControllerUpdate({
        id: record.id,
        data: { enabled: value },
      });
      setItems((prev) => prev.map((it) => (it.id === record.id ? { ...it, enabled: value } : it)));
      message.success(value ? "已启用" : "已禁用");
    } catch {
      message.error("更新状态失败");
    }
  }

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Space.Compact style={{ width: 240 }}>
          <Input
            allowClear
            placeholder="搜索键或名称"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => {
              setSearch(searchText || undefined);
              setPage(1);
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              setSearch(searchText || undefined);
              setPage(1);
            }}
          >
            搜索
          </Button>
        </Space.Compact>
        <Select
          value={enabledFilter as any}
          onChange={(v) => {
            setEnabledFilter(v === undefined ? undefined : Boolean(v));
            setPage(1);
          }}
          style={{ width: 140 }}
          options={[
            { label: "全部", value: undefined },
            { label: "启用", value: true },
            { label: "禁用", value: false },
          ]}
        />
        <Button type="primary" onClick={openCreate}>
          新增{title}
        </Button>
      </Space>
      <Table
        bordered
        rowKey="id"
        loading={loading}
        dataSource={items}
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
          { title: "ID", dataIndex: "id", width: 220, ellipsis: true },
          { title: "键", dataIndex: "key", width: 160 },
          { title: "名称", dataIndex: "label" },
          { title: "描述", dataIndex: "description" },
          {
            title: "启用",
            dataIndex: "enabled",
            width: 100,
            render: (_, record: PunishmentDictItem) => (
              <Switch
                checked={Boolean(record.enabled)}
                onChange={(v) => toggleEnabled(record, v)}
              />
            ),
          },
          { title: "排序", dataIndex: "sort", width: 100 },
          {
            title: "创建时间",
            dataIndex: "createdAt",
            width: 180,
            render: (t: string) => formatDate(t),
          },
          {
            title: "操作",
            width: 140,
            render: (_, record: PunishmentDictItem) => (
              <Space>
                <Button type="link" onClick={() => openEdit(record)}>
                  编辑
                </Button>
                <Popconfirm title={`确认删除该${title}？`} onConfirm={() => remove(record.id)}>
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={`新增${title}`}
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        okText="保存"
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="key" label="唯一键" rules={[{ required: true }]}>
            <Input placeholder="如 spam 或 7d" />
          </Form.Item>
          <Form.Item name="label" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`编辑${title}`}
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
          <Form.Item label="唯一键">
            <Input value={editing?.key} disabled />
          </Form.Item>
          <Form.Item name="label" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
