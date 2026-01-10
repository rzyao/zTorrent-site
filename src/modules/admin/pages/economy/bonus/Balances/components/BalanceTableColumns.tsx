import { Button, Space, Tag } from "antd";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { ColumnsType } from "antd/es/table";
import type { UserBonusBalance } from "../types/bonus";

interface GetColumnsProps {
  onViewLedger: (userId: string) => void;
  onOpenAdjust: (row: UserBonusBalance) => void;
  onFreeze: (userId: string) => void;
  onUnfreeze: (userId: string) => void;
}

export const getBalanceColumns = ({
  onViewLedger,
  onOpenAdjust,
  onFreeze,
  onUnfreeze,
}: GetColumnsProps): ColumnsType<UserBonusBalance> => [
  { title: "用户名", dataIndex: "username", width: 160 },
  {
    title: "可用魔力",
    dataIndex: "balance",
    width: 180,
    render: (s: string) => Number(s).toLocaleString(),
  },
  {
    title: "预占魔力",
    dataIndex: "lockedBalance",
    width: 180,
    render: (s: string) => Number(s).toLocaleString(),
  },
  {
    title: "冻结",
    dataIndex: "isFrozen",
    width: 120,
    render: (f: 0 | 1) => (f ? <Tag color="red">已冻结</Tag> : <Tag color="green">正常</Tag>),
  },
  { title: "更新时间", dataIndex: "updatedAt", width: 200, render: (v: string) => formatDate(v) },
  {
    title: "操作",
    key: "actions",
    fixed: "right",
    width: 320,
    render: (_, row) => (
      <Space>
        <Button size="small" onClick={() => onViewLedger(row.userId)}>
          流水
        </Button>
        <Button size="small" onClick={() => onOpenAdjust(row)}>
          调账
        </Button>
        {row.isFrozen ? (
          <Button size="small" type="primary" onClick={() => onUnfreeze(row.userId)}>
            解冻
          </Button>
        ) : (
          <Button size="small" danger onClick={() => onFreeze(row.userId)}>
            冻结
          </Button>
        )}
      </Space>
    ),
  },
];
