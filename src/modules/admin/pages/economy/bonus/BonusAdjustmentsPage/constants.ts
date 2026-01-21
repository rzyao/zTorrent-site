import type { Column } from "@/modules/admin/components/ui/data-table";
import type { BonusAdjustment } from "@/modules/admin/types/store";
import { formatDate } from "@/modules/admin/utils/formatDate";

export const ADJUSTMENT_COLUMNS: Column<BonusAdjustment>[] = [
  { title: "记录ID", dataIndex: "id", key: "id", width: 180 },
  { title: "用户ID", dataIndex: "userId", key: "userId", width: 160 },
  { title: "金额", dataIndex: "amount", key: "amount", width: 120 },
  { title: "类型", dataIndex: "type", key: "type", width: 120 },
  { title: "原因", dataIndex: "reason", key: "reason" },
  { title: "引用", dataIndex: "ref", key: "ref", width: 160 },
  { title: "操作人", dataIndex: "operator", key: "operator", width: 140 },
  {
    title: "时间",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 200,
    render: (t: string) => formatDate(t),
  },
];
