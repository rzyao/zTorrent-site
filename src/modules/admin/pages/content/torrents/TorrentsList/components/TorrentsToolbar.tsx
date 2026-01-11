import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Search } from "@/modules/admin/components/ui/search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { Plus, Check, X, Filter, CheckCircle2, XCircle } from "lucide-react";
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
  selectedCount: number;
}

/**
 * 种子列表工具栏
 * 包含搜索、筛选、批量操作等功能
 */
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
  selectedCount,
}: TorrentsToolbarProps) => {
  // 回车触发搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  // 返回左右两部分内容，便于外部分别使用
  const left = (
    <div className="flex items-center gap-3">
      {/* 搜索框组件 */}
      <Search
        placeholder="搜索标题或关键词"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={onSearch}
        wrapperClassName="w-64"
      />

      {/* 分类筛选 */}
      <Select
        value={categoryFilter || "__all__"}
        onValueChange={(v) => {
          setCategoryFilter(v === "__all__" ? undefined : v);
          onSearch();
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">全部分类</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 审核状态筛选 */}
      <Select
        value={approvalStatus || "__all__"}
        onValueChange={(v) => {
          setApprovalStatus(v === "__all__" ? undefined : (v as TorrentItem["approvalStatus"]));
          onSearch();
        }}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="审核状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">全部状态</SelectItem>
          <SelectItem value="pending">待审核</SelectItem>
          <SelectItem value="approved">已通过</SelectItem>
          <SelectItem value="rejected">已驳回</SelectItem>
        </SelectContent>
      </Select>

      {/* 高级搜索按钮 */}
      <Button variant="default" onClick={onAdvSearch}>
        <Filter className="mr-1 h-4 w-4" />
        高级搜索
      </Button>
    </div>
  );

  const right = (
    <div className="flex items-center gap-2">
      <Button
        variant="default"
        onClick={() => onBatchReview("approve")}
        disabled={selectedCount === 0}
      >
        <CheckCircle2 className="mr-1 h-4 w-4" />
        全部通过
      </Button>
      <Button
        variant="default"
        danger
        onClick={() => onBatchReview("reject")}
        disabled={selectedCount === 0}
      >
        <XCircle className="mr-1 h-4 w-4" />
        全部驳回
      </Button>
      <Button variant="primary" onClick={onCreate}>
        <Plus className="mr-1 h-4 w-4" />
        新增种子
      </Button>
    </div>
  );

  return { left, right };
};
