import { Search, Filter } from "lucide-react";
import React, { memo } from "react";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { usePunishmentsLogic } from "./hooks/usePunishmentsLogic";
import { RevokePunishmentModal } from "./components/RevokePunishmentModal";
import { Modal as UIModal } from "@/modules/admin/components/ui/modal";
import AdvancedQueryBuilder from "@/modules/admin/components/AdvancedQueryBuilder";
import { ADV_FIELD_OPTIONS, OPS_BY_FIELD } from "./constants";

/**
 * 筛选栏组件 - 使用 memo 防止不必要的重渲染
 */
const PunishmentFilterBar = memo(
  ({
    searchText,
    setSearchText,
    handleSearch,
    loading,
    query,
    typeOptions,
    reasonOptions,
    handleFilterChange,
  }: any) => {
    return (
      <div className="flex items-center gap-2">
        {/* 搜索框 (用户名) */}
        <div className="flex">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="搜索用户名..."
              className="w-[200px] rounded-r-none pl-9"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            variant="primary"
            className="-ml-px rounded-l-none"
            onClick={handleSearch}
            loading={loading}
          >
            搜索
          </Button>
        </div>

        {/* 处罚类型筛选 */}
        <Select
          value={query.type || "all"}
          onValueChange={(val) => handleFilterChange("type", val === "all" ? undefined : val)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="所有类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有类型</SelectItem>
            {typeOptions.map((opt: any) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 处罚原因筛选 */}
        <Select
          value={query.reason || "all"}
          onValueChange={(val) => handleFilterChange("reason", val === "all" ? undefined : val)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="所有原因" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有原因</SelectItem>
            {reasonOptions.map((opt: any) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 撤销状态筛选 */}
        <Select
          value={query.revoked === undefined ? "all" : String(query.revoked)}
          onValueChange={(val) =>
            handleFilterChange("revoked", val === "all" ? undefined : val === "true")
          }
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="撤销状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">不限撤销</SelectItem>
            <SelectItem value="true">已撤销</SelectItem>
            <SelectItem value="false">未撤销</SelectItem>
          </SelectContent>
        </Select>

        {/* 生效状态筛选 */}
        <Select
          value={query.active === undefined ? "all" : String(query.active)}
          onValueChange={(val) =>
            handleFilterChange("active", val === "all" ? undefined : val === "true")
          }
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="生效状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">不限生效</SelectItem>
            <SelectItem value="true">生效中</SelectItem>
            <SelectItem value="false">已失效</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
);

export default function Punishments() {
  const {
    loading,
    data,
    total,
    query,
    columns,
    searchText,
    setSearchText,
    handleSearch,
    typeOptions,
    reasonOptions,
    revokeReasonOptions,
    // 弹窗
    revokeOpen,
    setRevokeOpen,
    revokeRecord,
    revokeLoading,
    handleRevokeExecute,
    // 高级搜索
    advOpen,
    setAdvOpen,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    handleFilterChange,
    handleReset,
    fetchList,
  } = usePunishmentsLogic();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">处罚记录管理</h1>
      </div>

      <DataTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        toolbarLeft={
          <PunishmentFilterBar
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
            loading={loading}
            query={query}
            typeOptions={typeOptions}
            reasonOptions={reasonOptions}
            handleFilterChange={handleFilterChange}
          />
        }
        toolbarRight={
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => setAdvOpen(true)}
          >
            <Filter className="h-4 w-4" />
            高级搜索
          </Button>
        }
        pagination={{
          current: query.page,
          pageSize: query.limit,
          total: total,
          onChange: (page, limit) => handleFilterChange("page" as any, page),
        }}
      />

      <RevokePunishmentModal
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        record={revokeRecord}
        reasonOptions={revokeReasonOptions}
        loading={revokeLoading}
        onConfirm={handleRevokeExecute}
      />

      {/* 高级搜索弹窗 */}
      <UIModal
        title="高级搜索"
        open={advOpen}
        onClose={() => setAdvOpen(false)}
        footer={null}
        width={800}
      >
        <div className="space-y-4 py-4">
          <AdvancedQueryBuilder
            fieldOptions={ADV_FIELD_OPTIONS as any}
            opsByField={OPS_BY_FIELD}
            rules={advRules}
            logic={advLogic}
            onChange={(nextRules, nextLogic) => {
              setAdvRules(nextRules as any);
              setAdvLogic(nextLogic as any);
            }}
          />
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="default" onClick={handleReset}>
              重置
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setAdvOpen(false);
                handleFilterChange("page" as any, 1);
                fetchList();
              }}
            >
              搜索
            </Button>
          </div>
        </div>
      </UIModal>
    </>
  );
}
