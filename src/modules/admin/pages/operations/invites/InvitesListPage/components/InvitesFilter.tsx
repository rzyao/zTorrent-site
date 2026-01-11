import { memo, useCallback, useState } from "react";
import { DatePicker } from "antd";
import { Download, Search } from "lucide-react";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import { StandardSelect } from "@/modules/admin/components/ui/select";
import { Button } from "@/modules/admin/components/ui/button";
import { STATUS_OPTIONS, TYPE_OPTIONS } from "../constants";
import type { InviteStatus, InviteType } from "../types";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface InvitesFilterProps {
  /** 搜索回调 */
  onSearch: (values: {
    status?: InviteStatus;
    type?: InviteType;
    email?: string;
    issuerId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  /** 导出回调 */
  onExport?: () => void;
  /** 导出加载状态 */
  exportLoading?: boolean;
}

/**
 * 邀请列表筛选器组件
 * 使用 memo 优化，避免父组件重渲染导致不必要的重绘
 */
export const InvitesFilter = memo(function InvitesFilter({
  onSearch,
  onExport,
  exportLoading,
}: InvitesFilterProps) {
  const [status, setStatus] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [email, setEmail] = useState("");
  const [issuerId, setIssuerId] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const handleSearch = useCallback(() => {
    onSearch({
      status: status as InviteStatus | undefined,
      type: type as InviteType | undefined,
      email: email.trim() || undefined,
      issuerId: issuerId.trim() || undefined,
      dateFrom: dateRange?.[0]?.toISOString(),
      dateTo: dateRange?.[1]?.toISOString(),
    });
  }, [status, type, email, issuerId, dateRange, onSearch]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StandardSelect
        value={status}
        onValueChange={setStatus}
        placeholder="状态"
        options={STATUS_OPTIONS}
        allowClear
        className="w-28"
      />

      <StandardSelect
        value={type}
        onValueChange={setType}
        placeholder="类型"
        options={TYPE_OPTIONS}
        allowClear
        className="w-32"
      />

      <SearchInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onSearch={handleSearch}
        placeholder="被邀请邮箱"
        className="w-48"
      />

      <SearchInput
        value={issuerId}
        onChange={(e) => setIssuerId(e.target.value)}
        onSearch={handleSearch}
        placeholder="发起人ID"
        className="w-36"
        enterButton={false}
      />

      <RangePicker
        value={dateRange}
        onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
        placeholder={["开始日期", "结束日期"]}
        className="w-[260px]"
      />

      <Button variant="primary" onClick={handleSearch}>
        <Search className="mr-1.5 h-4 w-4" />
        查询
      </Button>

      {onExport && (
        <Button variant="default" onClick={onExport} loading={exportLoading}>
          <Download className="mr-1.5 h-4 w-4" />
          导出
        </Button>
      )}
    </div>
  );
});
