import { formatDate } from "@/modules/admin/utils/formatDate";
import type { ColumnsType } from "antd/es/table";
import type { BonusAdjustment } from "@/modules/admin/types/store";

export const ADJUSTMENT_COLUMNS: ColumnsType<BonusAdjustment> = [
  { title: "记录ID", dataIndex: "id", width: 180 },
  { title: "用户ID", dataIndex: "userId", width: 160 },
  { title: "金额", dataIndex: "amount", width: 120 },
  { title: "类型", dataIndex: "type", width: 120 },
  { title: "原因", dataIndex: "reason" },
  { title: "引用", dataIndex: "ref", width: 160 },
  { title: "操作人", dataIndex: "operator", width: 140 },
  {
    title: "时间",
    dataIndex: "createdAt",
    width: 200,
    render: (t: string) => formatDate(t),
  },
];
