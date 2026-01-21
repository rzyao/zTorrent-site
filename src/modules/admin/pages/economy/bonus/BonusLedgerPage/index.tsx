import { useMemo } from "react";
import { useBonusLedgerLogic } from "./useBonusLedgerLogic";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { LedgerFilter } from "./components/LedgerFilter";
import type { UserBonusLedger } from "./types";

const getRowKey = (record: UserBonusLedger) =>
  String(record.id || `${record.userId}-${record.createdAt}`);

export default function BonusLedgerPage() {
  const {
    ledgerData,
    total,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    onSearch,
    columns,
    initUserId,
    handleExport,
  } = useBonusLedgerLogic();

  const toolbarRight = useMemo(
    () => (
      <Button variant="default" onClick={handleExport}>
        导出 CSV
      </Button>
    ),
    [handleExport],
  );

  const pagination = useMemo(
    () => ({
      current: page,
      pageSize: pageSize,
      total: total,
      onChange: (p: number, s: number) => {
        setPage(p);
        setPageSize(s);
      },
    }),
    [page, pageSize, total, setPage, setPageSize],
  );

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="text-muted-foreground bg-muted/50 border-border/50 shrink-0 rounded-md border p-3 text-sm">
        提示：导出最多 10,000 条；已被冲正的流水会显示为类型
        ADMIN_REVERSE，重复冲正将直接返回已有配对记录。
      </div>

      <DataTable
        className="min-h-0 flex-1"
        columns={columns}
        dataSource={ledgerData}
        rowKey={getRowKey}
        loading={isLoading}
        toolbarLeft={<LedgerFilter onSearch={onSearch} initUserId={initUserId} />}
        toolbarRight={toolbarRight}
        pagination={pagination}
      />
    </div>
  );
}
