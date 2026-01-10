import { Input, Space, Table } from "antd";
import { AdjustmentForm } from "./components/AdjustmentForm";
import { useBonusAdjustments } from "./hooks/useBonusAdjustments";
import { ADJUSTMENT_COLUMNS } from "./constants";

/**
 * 人工调账页面
 * 职责：为管理员提供对用户魔力值的人工增减能力，并展示审计记录
 */
export default function BonusAdjustmentsPage() {
  const {
    items,
    total,
    loading,
    adjusting,
    page,
    limit,
    userFilter,
    setPage,
    setLimit,
    setUserFilter,
    handleAdjust,
  } = useBonusAdjustments();

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      {/* 顶部调账操作表单 */}
      <AdjustmentForm onAdjust={handleAdjust} loading={adjusting} />

      {/* 列表过滤�?*/}
      <div className="mb-4">
        <Space>
          <Input
            allowClear
            placeholder="筛选用户ID"
            className="w-[200px]"
            value={userFilter}
            onChange={(e) => {
              setUserFilter(e.target.value || undefined);
              setPage(1);
            }}
          />
        </Space>
      </div>

      {/* 审计记录表格 */}
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
        columns={ADJUSTMENT_COLUMNS}
      />
    </div>
  );
}
