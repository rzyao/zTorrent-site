import React from "react";
import { Row, Col, Space, Input, Button, Select, Grid } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { ListPunishmentRecordsDto } from "@/api/models/ListPunishmentRecordsDto";

interface SearchFilterProps {
  searchText: string;
  setSearchText: (v: string) => void;
  searchUserAndFetch: (username: string) => void;
  typeSelect?: string;
  setTypeSelect: (v?: string) => void;
  typeOptions: { label: string; value: string }[];
  typeLoading: boolean;
  reasonSelect?: string;
  setReasonSelect: (v?: string) => void;
  reasonOptions: { label: string; value: string }[];
  reasonLoading: boolean;
  statusSelect?: boolean;
  setStatusSelect: (v?: boolean) => void;
  activeSelect?: boolean;
  setActiveSelect: (v?: boolean) => void;
  advOpen: boolean;
  setAdvOpen: (v: boolean) => void;
  fetchList: (
    params: { page: number; limit: number },
    overrides?: {
      userId?: string;
      type?: string;
      reason?: string;
      revoked?: boolean;
      active?: boolean;
      sortBy?: ListPunishmentRecordsDto["sortBy"];
      order?: ListPunishmentRecordsDto["order"];
      query?: string;
    }
  ) => void;
  pageSize: number;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchText,
  setSearchText,
  searchUserAndFetch,
  typeSelect,
  setTypeSelect,
  typeOptions,
  typeLoading,
  reasonSelect,
  setReasonSelect,
  reasonOptions,
  reasonLoading,
  statusSelect,
  setStatusSelect,
  activeSelect,
  setActiveSelect,
  advOpen,
  setAdvOpen,
  fetchList,
  pageSize,
}) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !!screens.xs && !screens.md;

  return (
    <div style={{ padding: isMobile ? "8px 12px" : "12px 16px" }}>
      <Row gutter={[12, 12]} wrap align="middle">
        {/* 搜索用户名 */}
        <Col xs={24} sm={24} md={8} lg={6}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="搜索用户（用户名）"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => searchUserAndFetch(searchText)}
            />
            <Button
              type="primary"
              onClick={() => searchUserAndFetch(searchText)}
            >
              搜索
            </Button>
          </Space.Compact>
        </Col>

        {/* 筛选：处罚类型 */}
        <Col xs={12} sm={8} md={4} lg={3}>
          <Select
            style={{ width: "100%" }}
            placeholder="类型"
            allowClear
            options={typeOptions}
            loading={typeLoading}
            value={typeSelect}
            onChange={(v) => {
              setTypeSelect(v);
              fetchList({ page: 1, limit: pageSize }, { type: v ? v : "" });
            }}
          />
        </Col>

        {/* 筛选：处罚原因 */}
        <Col xs={12} sm={8} md={4} lg={3}>
          <Select
            style={{ width: "100%" }}
            placeholder="原因"
            allowClear
            options={reasonOptions}
            loading={reasonLoading}
            value={reasonSelect}
            onChange={(v) => {
              setReasonSelect(v);
              fetchList({ page: 1, limit: pageSize }, { reason: v ? v : "" });
            }}
          />
        </Col>

        {/* 筛选：是否撤销 */}
        <Col xs={12} sm={8} md={4} lg={3}>
          <Select
            style={{ width: "100%" }}
            placeholder="撤销状态"
            allowClear
            options={[
              { label: "已撤销", value: true },
              { label: "未撤销", value: false },
            ]}
            value={statusSelect}
            onChange={(v) => {
              setStatusSelect(v);
              // 注意：undefined会被忽略，所以这里我们传递undefined给后端让其不生效
              fetchList(
                { page: 1, limit: pageSize },
                { revoked: typeof v === "boolean" ? v : undefined }
              );
            }}
          />
        </Col>

        {/* 筛选：是否处于处罚期（生效） */}
        <Col xs={12} sm={8} md={4} lg={3}>
          <Select
            style={{ width: "100%" }}
            placeholder="生效状态"
            allowClear
            options={[
              { label: "生效中", value: true },
              { label: "已失效", value: false },
            ]}
            value={activeSelect}
            onChange={(v) => {
              setActiveSelect(v);
              fetchList(
                { page: 1, limit: pageSize },
                { active: typeof v === "boolean" ? v : undefined }
              );
            }}
          />
        </Col>

        {/* 高级搜索按钮 */}
        <Col xs={24} sm={24} md={24} lg={6} style={{ textAlign: "right" }}>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setAdvOpen(true)}
            type={advOpen ? "primary" : "default"}
          >
            高级搜索
          </Button>
        </Col>
      </Row>
    </div>
  );
};
