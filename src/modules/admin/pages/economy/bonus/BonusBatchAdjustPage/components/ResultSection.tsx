import { DataTable } from "@/modules/admin/components/ui/data-table";
import { PREVIEW_COLUMNS, RESULT_COLUMNS } from "../constants";
import type { BatchItem, ResultItem } from "../types";

interface ResultSectionProps {
  items: BatchItem[];
  results: ResultItem[];
  loading: boolean;
}

export function ResultSection({ items, results, loading }: ResultSectionProps) {
  if (items.length === 0 && results.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8">
        <div className="text-center">
          <p>暂无数据</p>
          <p className="text-xs opacity-70">请从左侧导入数据进行操作</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-hidden">
      {/* 待提交预览 */}
      {items.length > 0 && results.length === 0 && (
        <div className="flex flex-col gap-2 overflow-hidden">
          <h3 className="flex shrink-0 items-center justify-between font-medium">
            待提交数据 ({items.length})
          </h3>
          <DataTable
            columns={PREVIEW_COLUMNS}
            dataSource={items}
            rowKey={(r) => `${r.userId}-${r.delta}-${r.reason}-${r.externalRef}`}
            className="flex-1"
            pagination={{ pageSize: 100, current: 1, total: items.length }}
          />
        </div>
      )}

      {/* 执行结果 */}
      {results.length > 0 && (
        <div className="flex flex-col gap-2 overflow-hidden">
          <h3 className="flex shrink-0 items-center justify-between font-medium">
            执行结果 ({results.length})
          </h3>
          <DataTable
            columns={RESULT_COLUMNS}
            dataSource={results}
            rowKey={(r) => `${r.userId}-${r.delta}-${r.error}`}
            className="flex-1"
            pagination={{ pageSize: 100, current: 1, total: results.length }}
          />
        </div>
      )}
    </div>
  );
}
