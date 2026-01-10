import React from "react";
import { Card, Space, Typography, Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

interface RoleSearchProps {
  searchText: string;
  setSearchText: (v: string) => void;
  setPage: (p: number) => void;
  loading: boolean;
  onAdd: () => void;
}

export const RoleSearch: React.FC<RoleSearchProps> = ({
  searchText,
  setSearchText,
  setPage,
  loading,
  onAdd,
}) => {
  return (
    <Card>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Space>
          <Typography.Text type="secondary">
            管理系统角色及其权限分配
          </Typography.Text>
          <Input
            size="large"
            allowClear
            placeholder="搜索角色名称或描�?.."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            style={{ width: 360 }}
          />
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          loading={loading}
        >
          添加角色
        </Button>
      </Space>
    </Card>
  );
};
