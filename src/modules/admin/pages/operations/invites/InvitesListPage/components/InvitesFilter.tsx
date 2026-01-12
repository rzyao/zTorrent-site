import { memo, useCallback, useState } from "react";
import { Download, Search } from "lucide-react";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import { StandardSelect } from "@/modules/admin/components/ui/select";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { STATUS_OPTIONS, TYPE_OPTIONS } from "../constants";
import type { InviteStatus, InviteType } from "../types";

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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSearch = useCallback(() => {
    onSearch({
      status: status as InviteStatus | undefined,
      type: type as InviteType | undefined,
      email: email.trim() || undefined,
      issuerId: issuerId.trim() || undefined,
      dateFrom: dateFrom ? new Date(dateFrom).toISOString() : undefined,
      dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
    });
  }, [status, type, email, issuerId, dateFrom, dateTo, onSearch]);

  const handleReset = useCallback(() => {
    setStatus(undefined);
    setType(undefined);
    setEmail("");
    setIssuerId("");
    setDateFrom("");
    setDateTo("");
    onSearch({});
  }, [onSearch]);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-slate-50/50 p-4 dark:bg-slate-900/20">
      <div className="space-y-1.5">
        <Label size="sm">状态</Label>
        <StandardSelect
          value={status}
          onValueChange={setStatus}
          placeholder="全部状态"
          options={STATUS_OPTIONS}
          allowClear
          className="w-32"
        />
      </div>

      <div className="space-y-1.5">
        <Label size="sm">类型</Label>
        <StandardSelect
          value={type}
          onValueChange={setType}
          placeholder="全部类型"
          options={TYPE_OPTIONS}
          allowClear
          className="w-32"
        />
      </div>

      <div className="space-y-1.5">
        <Label size="sm">被邀请邮箱</Label>
        <SearchInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onSearch={handleSearch}
          placeholder="搜索邮箱..."
          className="w-48"
          enterButton={false}
        />
      </div>

      <div className="space-y-1.5">
        <Label size="sm">发起人ID</Label>
        <SearchInput
          value={issuerId}
          onChange={(e) => setIssuerId(e.target.value)}
          onSearch={handleSearch}
          placeholder="搜索用户ID..."
          className="w-36"
          enterButton={false}
        />
      </div>

      <div className="space-y-1.5">
        <Label size="sm">起止时间</Label>
        <div className="flex items-center gap-2">
          <Input
            type="datetime-local"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[200px]"
          />
          <span className="text-muted-foreground text-xs">至</span>
          <Input
            type="datetime-local"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[200px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={handleSearch}>
          <Search className="mr-1.5 h-4 w-4" />
          查询
        </Button>
        <Button variant="default" onClick={handleReset}>
          重置
        </Button>
        {onExport && (
          <Button variant="default" onClick={onExport} loading={exportLoading}>
            <Download className="mr-1.5 h-4 w-4" />
            导出
          </Button>
        )}
      </div>
    </div>
  );
});
