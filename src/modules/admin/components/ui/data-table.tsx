import * as React from "react";
import { cn } from "@/utils/cn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Button } from "./button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Checkbox } from "./checkbox";

// ============================================================
// DataTable 高级表格组件
// 包含：操作栏 (Toolbar)、表格主体 (Table)、分页栏 (Pagination)
// ============================================================

/** 排序方向类型 */
export type SortOrder = "asc" | "desc" | null;

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
  /** 是否可排序 */
  sorter?: boolean;
  /** 当前排序方向 */
  sortOrder?: SortOrder;
  /** 文本溢出时显示省略号 */
  ellipsis?: boolean;
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
  /** 排序变化回调 */
  onSortChange?: (columnKey: string, order: SortOrder) => void;
  /** 行选择配置 */
  rowSelection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[]) => void;
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
            "flex h-8 min-w-8 items-center justify-center rounded-md border text-sm transition-all",
            i === current
              ? "border-antd-primary text-antd-primary bg-white font-medium"
              : "hover:border-antd-primary hover:text-antd-primary border-gray-200 bg-white text-neutral-600",
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
        <div className="flex items-center gap-1">
          {/* 首页 */}
          <Button
            variant="text"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={current === 1}
            className="hover:text-antd-primary h-8 w-8 p-0 disabled:hover:text-neutral-300"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* 上一页 */}
          <Button
            variant="text"
            size="sm"
            onClick={() => handlePageChange(current - 1)}
            disabled={current === 1}
            className="hover:text-antd-primary h-8 w-8 p-0 disabled:hover:text-neutral-300"
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
            className="hover:text-antd-primary h-8 w-8 p-0 disabled:hover:text-neutral-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* 末页 */}
          <Button
            variant="text"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={current === totalPages}
            className="hover:text-antd-primary h-8 w-8 p-0 disabled:hover:text-neutral-300"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 每页条数选择 */}
        <div className="flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              const newSize = Number(value);
              onChange?.(1, newSize);
            }}
          >
            <SelectTrigger className="h-8 w-[110px]">
              <SelectValue placeholder={`${pageSize} 条/页`} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((v) => (
                <SelectItem key={v} value={String(v)}>
                  {v} 条/页
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DataTable 主组件
// ============================================================
export function DataTable<T extends Record<string, any>>({
  columns: userColumns,
  dataSource,
  rowKey,
  loading = false,
  toolbarLeft,
  toolbarRight,
  pagination,
  onSortChange,
  rowSelection,
  emptyText = "暂无数据",
  className,
}: DataTableProps<T>) {
  // 获取行的唯一标识
  const getRowKey = React.useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === "function") {
        return rowKey(record);
      }
      return String(record[rowKey] ?? index);
    },
    [rowKey],
  );

  // 全选状态处理
  const selectedRowKeys = rowSelection?.selectedRowKeys || [];
  const onSelectionChange = rowSelection?.onChange;

  const rowKeysInPage = React.useMemo(
    () => dataSource.map((item, idx) => getRowKey(item, idx)),
    [dataSource, getRowKey],
  );

  const isAllSelected =
    rowKeysInPage.length > 0 && rowKeysInPage.every((key) => selectedRowKeys.includes(key));

  const isPartialSelected =
    !isAllSelected && rowKeysInPage.some((key) => selectedRowKeys.includes(key));

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (!onSelectionChange) return;
    if (checked === true) {
      // 全选当前页（合并已选中的）
      const newKeys = Array.from(new Set([...selectedRowKeys, ...rowKeysInPage]));
      onSelectionChange(newKeys);
    } else {
      // 取消选中当前页
      const newKeys = selectedRowKeys.filter((key) => !rowKeysInPage.includes(key));
      onSelectionChange(newKeys);
    }
  };

  const handleSelectRow = (key: string, checked: boolean | "indeterminate") => {
    if (!onSelectionChange) return;
    if (checked === true) {
      onSelectionChange([...selectedRowKeys, key]);
    } else {
      onSelectionChange(selectedRowKeys.filter((k) => k !== key));
    }
  };

  // 注入选择列
  const columns = React.useMemo(() => {
    if (!rowSelection) return userColumns;

    const selectionColumn: Column<T> = {
      key: "__selection",
      title: (
        <Checkbox
          checked={isAllSelected ? true : isPartialSelected ? "indeterminate" : false}
          onCheckedChange={handleSelectAll}
        />
      ),
      width: 40,
      align: "center",
      render: (_, record, index) => {
        const key = getRowKey(record, index);
        return (
          <Checkbox
            checked={selectedRowKeys.includes(key)}
            onCheckedChange={(checked) => handleSelectRow(key, checked)}
          />
        );
      },
    };

    return [selectionColumn, ...userColumns];
  }, [
    userColumns,
    rowSelection,
    isAllSelected,
    isPartialSelected,
    selectedRowKeys,
    getRowKey,
    rowKeysInPage,
  ]);

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

      {/* ============== 表格容器 (Header + Body 在同一滚动容器) ============== */}
      <div className="table-scrollbar mx-6 flex-1 overflow-auto">
        <Table className="table-auto">
          {/* 表头 - 使用 sticky 固定 */}
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="border-0 hover:bg-transparent">
              {columns.map((column) => {
                // 处理排序点击
                const handleSortClick = () => {
                  if (!column.sorter || !onSortChange) return;
                  // 切换排序方向：null -> asc -> desc -> null
                  const nextOrder: SortOrder =
                    column.sortOrder === null ? "asc" : column.sortOrder === "asc" ? "desc" : null;
                  onSortChange(column.key, nextOrder);
                };

                // 渲染排序图标
                const renderSortIcon = () => {
                  if (!column.sorter) return null;
                  const iconClass = "h-3.5 w-3.5 ml-1";
                  if (column.sortOrder === "asc") {
                    return <ArrowUp className={cn(iconClass, "text-antd-primary")} />;
                  }
                  if (column.sortOrder === "desc") {
                    return <ArrowDown className={cn(iconClass, "text-antd-primary")} />;
                  }
                  return <ArrowUpDown className={cn(iconClass, "text-neutral-400")} />;
                };

                return (
                  <TableHead
                    key={column.key}
                    style={{ width: column.width, minWidth: column.width }}
                    className={cn(
                      "border-0 bg-[#FAFAFA]",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.sorter && "cursor-pointer select-none hover:bg-neutral-100",
                    )}
                    onClick={column.sorter ? handleSortClick : undefined}
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        column.align === "center" && "justify-center",
                        column.align === "right" && "justify-end",
                      )}
                    >
                      {column.title}
                      {renderSortIcon()}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          {/* 表体 */}
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
                      style={{
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.ellipsis ? column.width : undefined,
                      }}
                      className={cn(
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        column.ellipsis && "overflow-hidden text-ellipsis whitespace-nowrap",
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
