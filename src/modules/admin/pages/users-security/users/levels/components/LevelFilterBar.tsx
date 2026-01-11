import React, { memo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";

interface LevelFilterBarProps {
  onSearch: (text: string) => void;
  loading?: boolean;
}

/**
 * 性能优化：将搜索框拆分为独立组件
 * 1. 内部维护 localText，输入时不触发主页面重渲染
 * 2. 使用 memo 包裹，防止父组件重绘时无效刷新
 */
export const LevelFilterBar = memo(({ onSearch, loading }: LevelFilterBarProps) => {
  const [localText, setLocalText] = useState("");

  const handleSearchClick = () => {
    onSearch(localText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="搜索名称或标识..."
            className="w-[240px] rounded-r-none pl-9"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          variant="primary"
          className="-ml-px rounded-l-none"
          onClick={handleSearchClick}
          loading={loading}
        >
          搜索
        </Button>
      </div>
    </div>
  );
});

LevelFilterBar.displayName = "LevelFilterBar";
