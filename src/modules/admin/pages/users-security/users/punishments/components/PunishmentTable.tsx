import React from "react";
import { Table, Pagination } from "antd";
import type { RecordItem } from "../types";

interface PunishmentTableProps {
  loading: boolean;
  data: RecordItem[];
  columns: any[];
  tableContainerRef: React.RefObject<any>;
  expandedCacheRef: React.MutableRefObject<WeakMap<any, string>>;
  total: number;
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (ps: number) => void;
  fetchList: (params: { page: number; limit: number }) => void;
}

export const PunishmentTable: React.FC<PunishmentTableProps> = ({
  loading,
  data,
  columns,
  tableContainerRef,
  expandedCacheRef,
  total,
  page,
  pageSize,
  setPage,
  setPageSize,
  fetchList,
}) => {
  return (
    <>
      {/* 列表区域：自适应高度 */}
      <div
        ref={tableContainerRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden", // 防止表格撑开外层
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: "max-content", y: "calc(100vh - 300px)" }} // 这里高度可以优化为 useAutoTableScroll
          style={{ flex: 1, overflow: "hidden" }}
          expandable={{
            expandedRowRender: (r) => {
              const cached = expandedCacheRef.current.get(r);
              const text = cached ?? JSON.stringify(r, null, 2);
              if (!cached) expandedCacheRef.current.set(r, text);
              return (
                <pre
                  style={{
                    margin: 0,
                    maxHeight: 300,
                    overflow: "auto",
                    background: "#f5f5f5",
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  {text}
                </pre>
              );
            },
          }}
        />
      </div>

      {/* 底部：分页 */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          background: "#fff",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
            fetchList({ page: p, limit: ps });
          }}
        />
      </div>
    </>
  );
};
