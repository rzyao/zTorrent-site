import { useEffect, useMemo, useRef, useState } from "react";
import { App, Button, Form, Input, Select, Space, Table, Tag } from "antd";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { ColumnsType } from "antd/es/table";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import type { UserBonusBalance } from "@/modules/admin/pages/Bonus/types/bonus";
import { useNavigate } from "react-router-dom";
import { AdjustModal } from "./AdjustModal";

export default function BonusBalancesPage() {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UserBonusBalance[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<"balance" | "lockedBalance" | "updatedAt">("updatedAt");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [form] = Form.useForm();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number | undefined>(undefined);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ userId?: string; isFrozen?: 0 | 1 }>({});

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(rect.height - 220);
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const query = useMemo(() => {
    const v = form.getFieldsValue();
    return {
      userId: v.userId?.trim() || undefined,
      isFrozen: v.isFrozen === undefined ? undefined : v.isFrozen,
      min: v.min?.trim() || undefined,
      max: v.max?.trim() || undefined,
      page,
      pageSize,
      sortBy,
      order,
    };
  }, [form, page, pageSize, sortBy, order]);

  async function loadList() {
    setLoading(true);
    try {
      const resp = await BonusAdminService.bonusAccountControllerAdminListBalances(query as any);
      const data = resp?.data;
      setItems((data?.items || []) as UserBonusBalance[]);
      setTotal(data?.total || 0);
      setPage(data?.page || page);
      setPageSize(data?.pageSize || pageSize);
    } catch (e) {
      message.error("余额列表加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [query]);

  const columns: ColumnsType<UserBonusBalance> = [
    { title: "用户名", dataIndex: "username", width: 160 },
    {
      title: "可用魔力",
      dataIndex: "balance",
      width: 180,
      render: (s: string) => Number(s).toLocaleString(),
    },
    {
      title: "预占魔力",
      dataIndex: "lockedBalance",
      width: 180,
      render: (s: string) => Number(s).toLocaleString(),
    },
    {
      title: "冻结",
      dataIndex: "isFrozen",
      width: 120,
      render: (f: 0 | 1) => (f ? <Tag color="red">已冻结</Tag> : <Tag color="green">正常</Tag>),
    },
    { title: "更新时间", dataIndex: "updatedAt", width: 200, render: (v: string) => formatDate(v) },
    {
      title: "操作",
      key: "actions",
      fixed: "right",
      width: 360,
      render: (_, row) => (
        <Space>
          <Button onClick={() => navigate(`/bonus/ledger?userId=${row.userId}`)}>查看流水</Button>
          <Button
            onClick={() => {
              setCurrentUser({ userId: row.userId, isFrozen: row.isFrozen });
              setAdjustOpen(true);
            }}
          >
            调账
          </Button>
          {row.isFrozen ? (
            <Button type="primary" onClick={() => unfreeze(row.userId)}>
              解冻
            </Button>
          ) : (
            <Button danger onClick={() => freeze(row.userId)}>
              冻结
            </Button>
          )}
        </Space>
      ),
    },
  ];

  async function freeze(userId: string) {
    modal.confirm({
      title: "确认冻结该账户？",
      onOk: async () => {
        try {
          await BonusAdminService.bonusAccountControllerFreezeAccount({ userId });
          message.success("已冻结");
          loadList();
        } catch {
          message.error("冻结失败");
        }
      },
    });
  }

  async function unfreeze(userId: string) {
    modal.confirm({
      title: "确认解冻该账户？",
      onOk: async () => {
        try {
          await BonusAdminService.bonusAccountControllerUnfreezeAccount({ userId });
          message.success("已解冻");
          loadList();
        } catch {
          message.error("解冻失败");
        }
      },
    });
  }

  return (
    <div ref={containerRef} style={{ height: "100%" }}>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 12 }}
        onValuesChange={() => {
          setPage(1);
        }}
      >
        <Form.Item label="用户ID" name="userId">
          <Input placeholder="输入用户ID" style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="冻结" name="isFrozen">
          <Select
            allowClear
            placeholder="全部"
            style={{ width: 120 }}
            options={[
              { label: "正常", value: 0 },
              { label: "已冻结", value: 1 },
            ]}
          />
        </Form.Item>
        <Form.Item label="余额≥" name="min">
          <Input placeholder="字符串大整数" style={{ width: 160 }} />
        </Form.Item>
        <Form.Item label="余额≤" name="max">
          <Input placeholder="字符串大整数" style={{ width: 160 }} />
        </Form.Item>
        <Form.Item label="排序" name="sortBy" initialValue={sortBy}>
          <Select
            style={{ width: 160 }}
            value={sortBy}
            onChange={(v) => setSortBy(v)}
            options={[
              { label: "可用魔力", value: "balance" },
              { label: "预占魔力", value: "lockedBalance" },
              { label: "更新时间", value: "updatedAt" },
            ]}
          />
        </Form.Item>
        <Form.Item label="方向" name="order" initialValue={order}>
          <Select
            style={{ width: 120 }}
            value={order}
            onChange={(v) => setOrder(v)}
            options={[
              { label: "降序", value: "DESC" },
              { label: "升序", value: "ASC" },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={loadList}>
              查询
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setPage(1);
              }}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        bordered
        rowKey={(r) => `${r.userId}`}
        loading={loading}
        dataSource={items}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (p, s) => {
            setPage(p);
            setPageSize(s);
          },
        }}
        scroll={{ y: scrollY }}
        columns={columns}
      />

      <AdjustModal
        open={adjustOpen}
        userId={currentUser.userId}
        isFrozen={currentUser.isFrozen}
        onClose={() => setAdjustOpen(false)}
        onDone={() => loadList()}
      />
    </div>
  );
}
