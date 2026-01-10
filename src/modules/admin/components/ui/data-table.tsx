import * as React from "react";
import { cn } from "@/utils/cn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// ============================================================
// DataTable 高级表格组件
// 包含：操作栏 (Toolbar)、表格主体 (Table)、分页栏 (Pagination)
// ============================================================

export interface Column<T> {
  /** 列标识符 */
  key: string;
  /** 列标题 */
  title: React.ReactNode;
  /** 列宽度 */
  width?: string | number;
  /** 渲染函数 */
  render?: (value: any, record: T, index: number) => React.ReactNode;
  /** 数据字段名 */
  dataIndex?: keyof T;
  /** 对齐方式 */
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  /** 列配置 */
  columns: Column<T>[];
  /** 数据源 */
  dataSource: T[];
  /** 行唯一标识字段 */
  rowKey: keyof T | ((record: T) => string);
  /** 是否加载中 */
  loading?: boolean;
  /** 操作栏左侧内容 */
  toolbarLeft?: React.ReactNode;
  /** 操作栏右侧内容 */
  toolbarRight?: React.ReactNode;
  /** 分页配置 */
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    pageSizeOptions?: number[];
    onChange?: (page: number, pageSize: number) => void;
  };
  /** 空数据提示文案 */
  emptyText?: string;
  /** 自定义类名 */
  className?: string;
}

// ============================================================
// 分页组件
// ============================================================
interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
}

function Pagination({
  current,
  pageSize,
  total,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== current) {
      onChange?.(page, pageSize);
    }
  };

  // 生成页码按钮
  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 调整起始页
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={cn(
            "flex h-8 min-w-8 items-center justify-center rounded-md px-3 text-sm transition-colors",
            i === current ? "bg-antd-primary text-white" : "text-neutral-600 hover:bg-gray-100",
          )}
        >
          {i}
        </button>,
      );
    }

    return pages;
  };

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-3">
      {/* 左侧：显示条目信息 */}
      <div className="text-sm text-neutral-500">
        共 <span className="font-medium text-neutral-700">{total}</span> 条， 当前显示 {startItem}-
        {endItem} 条
      </div>

      {/* 右侧：分页控制 */}
      <div className="flex items-center gap-4">
        {/* 每页条数选择 */}
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap text-neutral-500">每页</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              onChange?.(1, newSize);
            }}
            className="focus:border-antd-primary focus:ring-antd-primary h-8 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-neutral-700 transition-all focus:ring-1 focus:outline-none"
          >
            {pageSizeOptions.map((v) => (
              <option key={v} value={v}>
                {v} 条
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          {/* 首页 */}
          <Button
            variant="text"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={current === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* 上一页 */}
          <Button
            variant="text"
            size="sm"
            onClick={() => handlePageChange(current - 1)}
            disabled={current === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* 页码 */}
          <div className="flex items-center gap-1">{renderPageNumbers()}</div>

          {/* 下一页 */}
          <Button
            variant="text"
            size="sm"
            onClick={() => handlePageChange(current + 1)}
            disabled={current === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* 末页 */}
          <Button
            variant="text"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={current === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DataTable 主组件
// ============================================================
export function DataTable<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  toolbarLeft,
  toolbarRight,
  pagination,
  emptyText = "暂无数据",
  className,
}: DataTableProps<T>) {
  // 获取行的唯一标识
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return String(record[rowKey] ?? index);
  };

  // 获取单元格的值
  const getCellValue = (record: T, column: Column<T>, index: number) => {
    const value = column.dataIndex ? record[column.dataIndex] : undefined;
    if (column.render) {
      return column.render(value, record, index);
    }
    return value ?? "-";
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white pt-1",
        className,
      )}
    >
      {/* ============== 操作栏 (Toolbar) ============== */}
      {(toolbarLeft || toolbarRight) && (
        <div className="flex shrink-0 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">{toolbarLeft}</div>
          <div className="flex items-center gap-2">{toolbarRight}</div>
        </div>
      )}

      {/* ============== 表格表头 (Header) - 固定不滚动 ============== */}
      <div className="mx-6 shrink-0 overflow-hidden bg-[#FAFAFA]">
        <Table className="table-fixed border-b border-gray-100">
          <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{ width: column.width, minWidth: column.width }}
                  className={cn(
                    "border-0 bg-[#FAFAFA]",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* ============== 表格表体 (Body) - 独立滚动 ============== */}
      <div className="table-scrollbar mx-6 flex-1 overflow-auto">
        <Table className="table-fixed">
          <TableBody>
            {loading && dataSource.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-neutral-400">
                  加载中...
                </TableCell>
              </TableRow>
            ) : dataSource.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-neutral-500">
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              dataSource.map((record, index) => (
                <TableRow key={getRowKey(record, index)}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${getRowKey(record, index)}-${column.key}`}
                      style={{ width: column.width, minWidth: column.width }}
                      className={cn(
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {getCellValue(record, column, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ============== 分页栏 (Pagination) ============== */}
      {pagination && (
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          pageSizeOptions={pagination.pageSizeOptions}
          onChange={pagination.onChange}
        />
      )}
    </div>
  );
}

export default DataTable;
