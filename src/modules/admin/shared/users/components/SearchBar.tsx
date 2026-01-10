import React from "react";
import { Button, Input, Space, App } from "antd";

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
  const { message } = App.useApp();

  return (
    <div
      className="border-b border-gray-100 px-4"
      style={{ height: 64, display: "flex", alignItems: "center" }}
    >
      <Space>
        <Space.Compact style={{ width: 360 }}>
          <Input
            placeholder="搜索用户名称或邮�?
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setQuery(searchText)}
          />
          <Button type="primary" onClick={() => setQuery(searchText)}>
            搜索
          </Button>
        </Space.Compact>
        <Button onClick={() => setAdvOpen(true)}>高级搜索</Button>
        <Button
          onClick={() => {
            setAdvRules([]);
            setAdvLogic("AND");
            fetchList();
            message.success("已清空高级搜索条�?);
          }}
        >
          清空高级
        </Button>
        {can("admin/users/create") && <Button type="primary">新增用户</Button>}
      </Space>
    </div>
  );
};
