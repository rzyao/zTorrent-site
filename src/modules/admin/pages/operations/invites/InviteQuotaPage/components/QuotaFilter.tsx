import { memo, useCallback, useState } from "react";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import { StandardSelect } from "@/modules/admin/components/ui/select";

interface QuotaFilterProps {
  /** 搜索回调 */
  onSearch: (values: { userId?: string; permanentOnly?: boolean; activeOnly?: boolean }) => void;
  /** 初始用户 ID */
  initUserId?: string;
}

// 布尔选项
const BOOL_OPTIONS = [
  { label: "是", value: "true" },
  { label: "否", value: "false" },
];

/**
 * 邀请名额筛选器组件
 * 使用 memo 优化，避免父组件重渲染导致不必要的重绘
 */
export const QuotaFilter = memo(function QuotaFilter({ onSearch, initUserId }: QuotaFilterProps) {
  const [userId, setUserId] = useState(initUserId || "");
  const [permanentOnly, setPermanentOnly] = useState<string | undefined>();
  const [activeOnly, setActiveOnly] = useState<string | undefined>();

  const handleSearch = useCallback(() => {
    onSearch({
      userId: userId.trim() || undefined,
      permanentOnly:
        permanentOnly === "true" ? true : permanentOnly === "false" ? false : undefined,
      activeOnly: activeOnly === "true" ? true : activeOnly === "false" ? false : undefined,
    });
  }, [userId, permanentOnly, activeOnly, onSearch]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onSearch={handleSearch}
        placeholder="搜索用户ID"
        className="w-48"
      />

      <StandardSelect
        value={permanentOnly}
        onValueChange={setPermanentOnly}
        placeholder="仅永久"
        options={BOOL_OPTIONS}
        allowClear
        className="w-28"
      />

      <StandardSelect
        value={activeOnly}
        onValueChange={setActiveOnly}
        placeholder="仅活跃"
        options={BOOL_OPTIONS}
        allowClear
        className="w-28"
      />
    </div>
  );
});
