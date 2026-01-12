import { useCallback, useMemo } from "react";
import { useInvitesListLogic } from "./useInvitesListLogic";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { InvitesFilter } from "./components/InvitesFilter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/admin/components/ui/dialog";
import { Button } from "@/modules/admin/components/ui/button";
import { Loader2 } from "lucide-react";
import type { InviteRecord } from "./types";

/** 行 Key 提取函数 */
const getRowKey = (record: InviteRecord) => record.id;

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
    // 弹窗状态
    confirmOpen,
    setConfirmOpen,
    pendingAction,
    handleConfirmAction,
    isProcessing,
  } = useInvitesListLogic();

  // 分页变更回调
  const handlePageChange = useCallback(
    (p: number, s: number) => {
      setPage(p);
      setPageSize(s);
    },
    [setPage, setPageSize],
  );

  // 分页配置
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
    <div className="flex h-full flex-col space-y-4">
      <InvitesFilter onSearch={onSearch} onExport={handleExport} />

      <DataTable
        className="min-h-0 flex-1"
        columns={columns}
        dataSource={items}
        rowKey={getRowKey}
        loading={isLoading}
        pagination={pagination}
      />

      {/* 确认操作弹窗 */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{pendingAction?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-neutral-500">{pendingAction?.content}</div>
          <DialogFooter>
            <Button variant="default" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={handleConfirmAction} loading={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认执行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
