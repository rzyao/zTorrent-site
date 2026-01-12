import React from "react";
import { Button } from "@/modules/admin/components/ui/button";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import { toast } from "sonner";
import { Filter, RotateCcw, Plus } from "lucide-react";

interface SearchBarProps {
  searchText: string;
  setSearchText: (v: string) => void;
  setQuery: (v: string) => void;
  setAdvOpen: (v: boolean) => void;
  setAdvRules: (v: any[]) => void;
  setAdvLogic: (v: "AND" | "OR") => void;
  fetchList: () => void;
  can: (key: string) => boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  setSearchText,
  setQuery,
  setAdvOpen,
  setAdvRules,
  setAdvLogic,
  fetchList,
  can,
}) => {
  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="搜索用户名称或邮箱"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => setQuery(searchText)}
          wrapperClassName="w-80"
        />

        <Button variant="default" onClick={() => setAdvOpen(true)}>
          <Filter className="mr-1 h-4 w-4" />
          高级搜索
        </Button>

        <Button
          variant="text"
          size="sm"
          className="text-neutral-500 hover:text-neutral-900"
          onClick={() => {
            setAdvRules([]);
            setAdvLogic("AND");
            fetchList();
            toast.success("已清空高级搜索条件");
          }}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          清空高级
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {can("admin/users/create") && (
          <Button variant="primary">
            <Plus className="mr-1 h-4 w-4" />
            新增用户
          </Button>
        )}
      </div>
    </div>
  );
};
