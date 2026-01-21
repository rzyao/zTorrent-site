import { useCallback, useMemo } from "react";
import { useInviteQuotaLogic } from "./useInviteQuotaLogic";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { QuotaFilter } from "./components/QuotaFilter";
import type { InviteQuota } from "./types";

/** 行 Key 提取函数 */
const getRowKey = (record: InviteQuota) => record.id;

/**
 * 邀请名额管理页面
 * 已完成架构层重构：
 * - TanStack Query 数据管理
 * - Admin UI 组件
 * - 逻辑与视图分离
 * - 性能优化 (memo/useMemo/useCallback)
 */
export default function InviteQuotaPage() {
  const { items, total, isLoading, page, pageSize, setPage, setPageSize, onSearch, columns } =
    useInviteQuotaLogic();

  // 分页变更回调（稳定引用）
  const handlePageChange = useCallback(
    (p: number, s: number) => {
      setPage(p);
      setPageSize(s);
    },
    [setPage, setPageSize],
  );

  // 分页配置（memoize 以优化性能）
  const pagination = useMemo(
    () => ({
      current: page,
      pageSize: pageSize,
      total: total,
      onChange: handlePageChange,
    }),
    [page, pageSize, total, handlePageChange],
  );

  return (
    <div className="flex h-full flex-col">
      <DataTable
        className="min-h-0 flex-1"
        columns={columns}
        dataSource={items}
        rowKey={getRowKey}
        loading={isLoading}
        toolbarLeft={<QuotaFilter onSearch={onSearch} />}
        pagination={pagination}
      />
    </div>
  );
}
