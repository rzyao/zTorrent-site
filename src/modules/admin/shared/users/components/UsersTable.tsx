import React from "react";
import { Table, Pagination } from "antd";
import type { UserDto } from "@/api/models/UserDto";

interface UsersTableProps {
  loading: boolean;
  data: UserDto[];
  total: number;
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (ps: number) => void;
  scrollY: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableContainerRef: React.RefObject<any>;
  expandCacheRef: React.MutableRefObject<WeakMap<any, string>>;
  columns: any[];
}

export const UsersTable: React.FC<UsersTableProps> = ({
  loading,
  data,
  total,
  page,
  pageSize,
  setPage,
  setPageSize,
  scrollY,
  tableContainerRef,
  expandCacheRef,
  columns,
}) => {
  return (
    <>
      <div
        ref={tableContainerRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table
          rowKey={(r) => String(r.id)}
          loading={loading}
          dataSource={Array.isArray(data) ? data : []}
          expandable={{
            expandedRowRender: (record) => {
              const cached = expandCacheRef.current.get(record);
              const text = cached ?? JSON.stringify(record, null, 2);
              if (!cached) expandCacheRef.current.set(record, text);
              return <pre style={{ margin: 0, maxHeight: 320, overflow: "auto" }}>{text}</pre>;
            },
          }}
          pagination={false}
          scroll={{ x: "max-content", y: scrollY }}
          style={{ flex: 1, minHeight: 0 }}
          columns={columns}
        />
      </div>
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          }}
        />
      </div>
    </>
  );
};
