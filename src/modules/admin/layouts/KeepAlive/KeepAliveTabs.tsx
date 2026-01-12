import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/modules/admin/components/ui/tabs";
import { Button } from "@/modules/admin/components/ui/button";
import { Bell, RefreshCw, LogOut, User } from "lucide-react";
import { cn } from "@/utils/cn";
import { useKeepAliveTabs } from "./useKeepAliveTabs";

interface KeepAliveTabsProps {
  items: any[];
  activeKey: string;
  onEdit: (targetKey: any, action: "add" | "remove") => void;
  onTabClick: (key: string) => void;
  handleRefresh: () => void;
  handleLogout: () => void;
}

const KeepAliveTabs: React.FC<KeepAliveTabsProps> = ({
  items,
  activeKey,
  onEdit,
  onTabClick,
  handleRefresh,
  handleLogout,
}) => {
  return (
    <div className="keep-alive-tabs-container flex shrink-0 flex-col border-b border-[#f0f0f0] bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-4 pt-1">
        <Tabs value={activeKey} onValueChange={onTabClick} className="w-full">
          <TabsList className="flex h-9 w-full justify-start space-x-1 overflow-x-auto bg-transparent p-0">
            {items.map((item) => (
              <TabsTrigger
                key={item.key}
                value={item.key}
                className={cn(
                  "group relative h-9 min-w-[100px] rounded-t-lg border border-transparent px-4 py-2 text-sm transition-all",
                  // 未选中状态：浅灰背景，浅灰边框，深灰文字
                  "text-antd-text-description hover:text-antd-text border-[#f0f0f0] bg-[#fafafa]",
                  // 选中状态：白底，主色文字，底部边框白色(遮挡容器线)，下移1px，层级提升
                  "data-[state=active]:text-antd-primary data-[state=active]:z-10 data-[state=active]:-mb-px data-[state=active]:border-[#f0f0f0] data-[state=active]:border-b-white data-[state=active]:bg-white",
                )}
              >
                {item.label}
                {item.closable && (
                  <span
                    className="ml-2 flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 opacity-60 transition-all hover:bg-neutral-200 hover:text-neutral-600 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item.key, "remove");
                    }}
                  >
                    ×
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2 pl-4">
          <Button variant="text" size="sm" className="h-8 w-8 px-0">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="text" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            刷新
          </Button>
          <div className="h-8 w-8 rounded-full bg-slate-200 p-1">
            <User className="h-full w-full text-slate-500" />
          </div>
          <Button variant="text" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-3.5 w-3.5" />
            退出
          </Button>
        </div>
      </div>

      {/* 渲染 Tab 内容 (为了保持 KeepAlive，这里隐藏非 active 的内容而不是卸载) */}
      <div className="relative flex-1 overflow-hidden" style={{ display: "none" }}>
        {/* 实际的内容渲染由 Router Outlet 处理，这里不需要重复渲染 children */}
      </div>
    </div>
  );
};

export default KeepAliveTabs;
