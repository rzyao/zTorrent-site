import { Search, RotateCcw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { STORE_ORDER_STATUS_OPTIONS } from "../constants";
import type { StoreOrder } from "@/modules/admin/types/store";

interface StoreOrdersToolbarProps {
  filters: {
    userId?: string;
    itemId?: string;
    status?: StoreOrder["status"];
    dateRange?: [string, string];
  };
  setFilters: {
    setStatus: (s?: StoreOrder["status"]) => void;
    setDateRange: (dr?: [string, string]) => void;
  };
  handleSearch: (userId?: string, itemId?: string) => void;
  handleReset: () => void;
  pageSize: number;
  handlePageChange: (p: number, ps: number) => void;
}

export function StoreOrdersToolbar({
  filters,
  setFilters,
  handleSearch,
  handleReset,
  pageSize,
  handlePageChange,
}: StoreOrdersToolbarProps) {
  // Local state for text searches (standard pattern for better UX)
  const [localUserId, setLocalUserId] = useState(filters.userId || "");
  const [localItemId, setLocalItemId] = useState(filters.itemId || "");

  // Sync when filters change externally (like reset)
  useEffect(() => {
    setLocalUserId(filters.userId || "");
  }, [filters.userId]);

  useEffect(() => {
    setLocalItemId(filters.itemId || "");
  }, [filters.itemId]);

  const onSearchClick = useCallback(() => {
    handleSearch(localUserId, localItemId);
  }, [handleSearch, localUserId, localItemId]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearchClick();
      }
    },
    [onSearchClick],
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center">
        <Input
          placeholder="用户ID"
          value={localUserId}
          onChange={(e) => setLocalUserId(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-[160px] rounded-r-none focus-visible:z-10"
        />
        <Button
          variant="default"
          onClick={onSearchClick}
          className="rounded-l-none border-l-0 bg-gray-50 text-neutral-500 hover:text-neutral-700"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="商品ID"
          value={localItemId}
          onChange={(e) => setLocalItemId(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-[160px] rounded-r-none focus-visible:z-10"
        />
        <Button
          variant="default"
          onClick={onSearchClick}
          className="rounded-l-none border-l-0 bg-gray-50 text-neutral-500 hover:text-neutral-700"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Select
        value={filters.status || "all"}
        onValueChange={(v) => {
          setFilters.setStatus(v === "all" ? undefined : (v as StoreOrder["status"]));
          handlePageChange(1, pageSize);
        }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="订单状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          {STORE_ORDER_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Input
          type="date"
          value={filters.dateRange?.[0] || ""}
          onChange={(e) => {
            const from = e.target.value;
            const to = filters.dateRange?.[1] || "";
            if (from || to) {
              setFilters.setDateRange([from, to]);
            } else {
              setFilters.setDateRange(undefined);
            }
            handlePageChange(1, pageSize);
          }}
          className="w-[140px]"
          placeholder="开始日期"
        />
        <span className="text-neutral-400">~</span>
        <Input
          type="date"
          value={filters.dateRange?.[1] || ""}
          onChange={(e) => {
            const to = e.target.value;
            const from = filters.dateRange?.[0] || "";
            if (from || to) {
              setFilters.setDateRange([from, to]);
            } else {
              setFilters.setDateRange(undefined);
            }
            handlePageChange(1, pageSize);
          }}
          className="w-[140px]"
          placeholder="结束日期"
        />
      </div>

      <Button variant="default" onClick={handleReset} title="重置筛选">
        <RotateCcw className="mr-1 h-4 w-4" />
        重置
      </Button>
    </div>
  );
}
