import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import { cn } from "@/utils/cn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Button } from "./button";
import { ChevronRight, ChevronDown, Search } from "lucide-react";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

// ============================================================
// TreeTable 树形表格组件
// 支持嵌套数据展开/折叠，适用于分类管理等场景
// ============================================================

export interface TreeColumn<T> {
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
  /** 是否固定在右侧 */
  fixed?: "right";
}

export interface TreeTableProps<T> {
  /** 列配置 */
  columns: TreeColumn<T>[];
  /** 数据源（树形结构） */
  dataSource: T[];
  /** 行唯一标识字段 */
  rowKey: keyof T | ((record: T) => string);
  /** 子节点字段名，默认 'children' */
  childrenKey?: string;
  /** 是否加载中 */
  loading?: boolean;
  /** 操作栏左侧内容 */
  toolbarLeft?: React.ReactNode;
  /** 操作栏右侧内容 */
  toolbarRight?: React.ReactNode;
  /** 默认展开所有行 */
  defaultExpandAll?: boolean;
  /** 默认展开的行 keys */
  defaultExpandedRowKeys?: string[];
  /** 空数据提示文案 */
  emptyText?: string;
  /** 自定义类名 */
  className?: string;
  /** 缩进宽度（每层级），默认 24px */
  indentSize?: number;
}

// ============================================================
// TreeTable 主组件
// ============================================================
export function TreeTable<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey,
  childrenKey = "children",
  loading = false,
  toolbarLeft,
  toolbarRight,
  defaultExpandAll = false,
  defaultExpandedRowKeys = [],
  emptyText = "暂无数据",
  className,
  indentSize = 24,
}: TreeTableProps<T>) {
  // 获取行的唯一标识
  const getRowKey = useCallback(
    (record: T): string => {
      if (typeof rowKey === "function") {
        return rowKey(record);
      }
      return String(record[rowKey] ?? "");
    },
    [rowKey],
  );

  // 收集所有可展开的节点 keys
  const allExpandableKeys = useMemo(() => {
    const keys: string[] = [];
    const collect = (nodes: T[]) => {
      for (const node of nodes || []) {
        const children = node[childrenKey as keyof T] as T[] | undefined;
        if (children && children.length > 0) {
          keys.push(getRowKey(node));
          collect(children);
        }
      }
    };
    collect(dataSource);
    return keys;
  }, [dataSource, childrenKey, getRowKey]);

  // 展开状态管理
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    if (defaultExpandAll) {
      return new Set(allExpandableKeys);
    }
    return new Set(defaultExpandedRowKeys);
  });

  // 切换展开状态
  const toggleExpand = useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // 获取单元格的值
  const getCellValue = (record: T, column: TreeColumn<T>, index: number) => {
    const value = column.dataIndex ? record[column.dataIndex] : undefined;
    if (column.render) {
      return column.render(value, record, index);
    }
    return value ?? "-";
  };

  // 递归渲染行
  const renderRows = (nodes: T[], depth: number = 0): React.ReactNode[] => {
    const rows: React.ReactNode[] = [];
    let globalIndex = 0;

    const renderNode = (node: T, level: number) => {
      const key = getRowKey(node);
      const children = node[childrenKey as keyof T] as T[] | undefined;
      const hasChildren = children && children.length > 0;
      const isExpanded = expandedKeys.has(key);
      const currentIndex = globalIndex++;

      rows.push(
        <TableRow key={key} data-depth={level}>
          {columns.map((column, colIndex) => {
            const isFirstColumn = colIndex === 0;
            const cellContent = getCellValue(node, column, currentIndex);

            return (
              <TableCell
                key={`${key}-${column.key}`}
                style={{ width: column.width, minWidth: column.width }}
                className={cn(
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.fixed === "right" && "sticky right-0 bg-white",
                )}
              >
                {isFirstColumn ? (
                  <div className="flex items-center" style={{ paddingLeft: level * indentSize }}>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpand(key)}
                        className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-gray-100"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-neutral-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-neutral-500" />
                        )}
                      </button>
                    ) : (
                      <span className="mr-2 w-5 shrink-0" />
                    )}
                    <span>{cellContent}</span>
                  </div>
                ) : (
                  cellContent
                )}
              </TableCell>
            );
          })}
        </TableRow>,
      );

      // 递归渲染子节点
      if (hasChildren && isExpanded) {
        for (const child of children) {
          renderNode(child, level + 1);
        }
      }
    };

    for (const node of nodes) {
      renderNode(node, depth);
    }

    return rows;
  };

  const renderedRows = useMemo(() => renderRows(dataSource), [dataSource, expandedKeys, columns]);

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white",
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

      {/* ============== 表格区域 ============== */}
      <div className="flex-1 overflow-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{ width: column.width, minWidth: column.width }}
                  className={cn(
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.fixed === "right" && "sticky right-0 bg-[#FAFAFA]",
                  )}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
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
              renderedRows
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TreeTable;
