/**
 * 树节点标题渲染组件
 * 显示导航项的标签、路径、角色标签、可见开关及操作按钮
 */
import React from "react";
import { Space, Tag, Switch, Button, Typography, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { NavigationItem } from "@/types/navigation";

export interface TreeNodeTitleProps {
  /** 当前节点数据 */
  item: NavigationItem;
  /** 可见状态切换回调 */
  onVisibilityChange: (id: string, checked: boolean) => void;
  /** 编辑按钮点击回调 */
  onEdit: (item: NavigationItem) => void;
  /** 删除确认回调 */
  onDelete: (id: string) => void;
}

/**
 * 树节点标题组件
 */
export const TreeNodeTitle: React.FC<TreeNodeTitleProps> = ({
  item,
  onVisibilityChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingRight: 24,
      }}
    >
      {/* 左侧：图标、标签、路径 */}
      <Space>
        {item.icon && <i className={item.icon} />}
        <Typography.Text strong>{item.label}</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {item.path}
        </Typography.Text>
      </Space>

      {/* 右侧：角色标签、开关、操作按钮 */}
      <Space onClick={(e) => e.stopPropagation()}>
        {/* 角色标签 */}
        {(item.permissions || []).length > 0 ? (
          (item.permissions || []).map((perm) => <Tag key={perm}>{perm}</Tag>)
        ) : (
          <Tag color="default">Public</Tag>
        )}

        {/* 可见开关 */}
        <Switch
          size="small"
          checked={item.isVisible}
          onChange={(checked) => onVisibilityChange(item.id, checked)}
        />

        {/* 编辑按钮 */}
        <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(item)}
        />

        {/* 删除按钮 */}
        <Popconfirm title="Delete?" onConfirm={() => onDelete(item.id)}>
          <Button size="small" type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    </div>
  );
};

export default TreeNodeTitle;
