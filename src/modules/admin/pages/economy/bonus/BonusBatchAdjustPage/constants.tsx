import type { Column } from "@/modules/admin/components/ui/data-table";
import type { BatchItem, ResultItem } from "./types";
import { Tag } from "antd";

export const PREVIEW_COLUMNS: Column<BatchItem>[] = [
  { title: "用户ID", dataIndex: "userId", key: "userId", width: 160 },
  { title: "变动值", dataIndex: "delta", key: "delta", width: 140 },
  { title: "原因", dataIndex: "reason", key: "reason", width: 200 },
  { title: "External Ref", dataIndex: "externalRef", key: "externalRef", width: 220 },
];

export const RESULT_COLUMNS: Column<ResultItem>[] = [
  { title: "用户ID", dataIndex: "userId", key: "userId", width: 160 },
  {
    title: "结果",
    dataIndex: "ok",
    key: "ok",
    width: 120,
    render: (ok: boolean) => (ok ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag>),
  },
  { title: "变动值", dataIndex: "delta", key: "delta", width: 140 },
  {
    title: "错误信息",
    dataIndex: "error",
    key: "error",
    render: (error: string) => (error ? <span className="text-destructive">{error}</span> : null),
  },
];
