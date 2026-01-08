import { useState, useMemo } from "react";
import { App, Button, Form, Input, Select, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { AdjustModal } from "../components/AdjustModal";
import { useBonusBalances } from "./hooks/useBonusBalances";
import { useContainerScroll } from "../utils/useContainerScroll";
import { getBalanceColumns } from "./components/BalanceTableColumns";
import type { UserBonusBalance } from "./types/bonus";

export default function BonusBalancesPage() {
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 1. Hooks 逻辑封装
  const { containerRef, scrollY } = useContainerScroll();
  const {
    items,
    total,
    loading,
    page,
    pageSize,
    sortBy,
    order,
    setPage,
    setPageSize,
    setSortBy,
    setOrder,
    refetch,
    handleFreeze,
    handleUnfreeze,
  } = useBonusBalances(form);

  // 2. 本地 UI 状态 (弹窗等)
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<UserBonusBalance>>({});

  // 3. 表格列定义 (使用 useMemo 保持引用稳定)
  const columns = useMemo(
    () =>
      getBalanceColumns({
        onViewLedger: (userId) => navigate(`/bonus/ledger?userId=${userId}`),
        onOpenAdjust: (row) => {
          setCurrentUser(row);
          setAdjustOpen(true);
        },
        onFreeze: (userId) => {
          modal.confirm({
            title: "确认冻结该账户？",
            onOk: () => handleFreeze(userId),
          });
        },
        onUnfreeze: (userId) => {
          modal.confirm({
            title: "确认解冻该账户？",
            onOk: () => handleUnfreeze(userId),
          });
        },
      }),
    [navigate, handleFreeze, handleUnfreeze, modal],
  );

  return (
    <div ref={containerRef} className="flex h-full flex-col rounded-lg bg-white p-4 shadow-sm">
      <Form form={form} layout="inline" className="mb-4" onValuesChange={() => setPage(1)}>
        <Form.Item label="用户ID" name="userId">
          <Input placeholder="输入用户ID" className="w-[180px]" />
        </Form.Item>
        <Form.Item label="冻结" name="isFrozen">
          <Select
            allowClear
            placeholder="全部"
            className="w-[120px]"
            options={[
              { label: "正常", value: 0 },
              { label: "已冻结", value: 1 },
            ]}
          />
        </Form.Item>
        <Form.Item label="余额≥" name="min">
          <Input placeholder="串大整数" className="w-[140px]" />
        </Form.Item>
        <Form.Item label="余额≤" name="max">
          <Input placeholder="串大整数" className="w-[140px]" />
        </Form.Item>
        <Form.Item label="排序" name="sortBy" initialValue={sortBy}>
          <Select
            className="w-[140px]"
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
            className="w-[100px]"
            onChange={(v) => setOrder(v)}
            options={[
              { label: "降序", value: "DESC" },
              { label: "升序", value: "ASC" },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={() => refetch()}>
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

      <div className="flex-1 overflow-hidden">
        <Table
          bordered
          rowKey="userId"
          loading={loading}
          dataSource={items}
          scroll={{ y: scrollY }}
          columns={columns}
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
        />
      </div>

      <AdjustModal
        open={adjustOpen}
        userId={currentUser.userId}
        isFrozen={currentUser.isFrozen}
        onClose={() => setAdjustOpen(false)}
        onDone={() => refetch()}
      />
    </div>
  );
}
