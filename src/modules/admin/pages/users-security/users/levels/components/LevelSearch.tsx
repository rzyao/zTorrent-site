import React from "react";
import { Card, Space, Typography, Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

interface LevelSearchProps {
  searchKey: string;
  setSearchKey: (v: string) => void;
  searchLabel: string;
  setSearchLabel: (v: string) => void;
  setPage: (p: number) => void;
  can: (perm: string) => boolean;
  onAdd: () => void;
  loading: boolean;
}

export const LevelSearch: React.FC<LevelSearchProps> = ({
  searchKey,
  setSearchKey,
  searchLabel,
  setSearchLabel,
  setPage,
  can,
  onAdd,
  loading,
}) => {
  return (
    <Card>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Space>
          <Typography.Text type="secondary">
            管理系统的用户等级（键、名称与排序）
          </Typography.Text>
          <Input
            size="large"
            allowClear
            placeholder="按等级键搜索..."
            prefix={<SearchOutlined />}
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
              setPage(1);
            }}
            style={{ width: 240 }}
          />
          <Input
            size="large"
            allowClear
            placeholder="按显示名称搜索..."
            prefix={<SearchOutlined />}
            value={searchLabel}
            onChange={(e) => {
              setSearchLabel(e.target.value);
              setPage(1);
            }}
            style={{ width: 240 }}
          />
        </Space>
        {can("admin/levels/create") ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
            loading={loading}
          >
            新增等级
          </Button>
        ) : (
          <Button type="primary" icon={<PlusOutlined />} disabled>
            新增等级
          </Button>
        )}
      </Space>
    </Card>
  );
};
