import { Button, Input, Select, Space } from "antd";
import { ReviewDto } from "@/api/models/ReviewDto";
import { CategoryOption, TorrentItem } from "../types";

interface TorrentsToolbarProps {
  searchText: string;
  setSearchText: (v: string) => void;
  categoryFilter: string | undefined;
  setCategoryFilter: (v: string | undefined) => void;
  categories: CategoryOption[];
  approvalStatus: TorrentItem["approvalStatus"] | undefined;
  setApprovalStatus: (v: TorrentItem["approvalStatus"] | undefined) => void;
  onSearch: () => void;
  onCreate: () => void;
  onAdvSearch: () => void;
  onBatchReview: (action: "approve" | "reject") => void;
  items: TorrentItem[];
}

export const TorrentsToolbar = ({
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  categories,
  approvalStatus,
  setApprovalStatus,
  onSearch,
  onCreate,
  onAdvSearch,
  onBatchReview,
}: TorrentsToolbarProps) => {
  return (
    <Space style={{ marginBottom: 16 }}>
      <Space.Compact style={{ width: 240 }}>
        <Input
          allowClear
          placeholder="搜索标题或关键词"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={onSearch}
        />
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
      </Space.Compact>
      <Select
        value={categoryFilter}
        onChange={(v) => {
          setCategoryFilter(v);
          onSearch();
        }}
        style={{ width: 160 }}
        placeholder="选择分类"
        allowClear
        options={categories}
      />
      <Select
        value={approvalStatus}
        onChange={(v) => {
          setApprovalStatus(v as any);
          onSearch();
        }}
        style={{ width: 160 }}
        placeholder="审核状态"
        allowClear
        options={[
          { label: "待审", value: "pending" },
          { label: "通过", value: "approved" },
          { label: "驳回", value: "rejected" },
        ]}
      />
      <Button onClick={() => onBatchReview("approve")}>全部通过</Button>
      <Button danger onClick={() => onBatchReview("reject")}>
        全部驳回
      </Button>
      <Button type="primary" onClick={onCreate}>
        新增种子
      </Button>
      <Button onClick={onAdvSearch}>高级搜索</Button>
    </Space>
  );
};
