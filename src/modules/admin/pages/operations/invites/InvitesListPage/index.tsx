import { useCallback, useMemo } from "react";
import { useInvitesListLogic } from "./useInvitesListLogic";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { InvitesFilter } from "./components/InvitesFilter";
import type { InviteRecord } from "./types";

/** 行 Key 提取函数 */
const getRowKey = (record: InviteRecord) => record.id;

/**
 * 邀请列表管理页面
 * 已完成架构层重构：
 * - TanStack Query 数据管理 (useQuery + useMutation)
 * - Admin UI 组件
 * - 逻辑与视图分离
 * - 性能优化 (memo/useMemo/useCallback)
 */
export default function InvitesListPage() {
  const {
    items,
    total,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    onSearch,
    columns,
    handleExport,
  } = useInvitesListLogic();

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

  // 工具栏左侧（筛选器）
  const toolbarLeft = useMemo(
    () => <InvitesFilter onSearch={onSearch} onExport={handleExport} />,
    [onSearch, handleExport],
  );

  return (
    <div className="flex h-full flex-col">
      <DataTable
        className="min-h-0 flex-1"
        columns={columns}
        dataSource={items}
        rowKey={getRowKey}
        loading={isLoading}
        toolbarLeft={toolbarLeft}
        pagination={pagination}
      />
    </div>
  );
}
