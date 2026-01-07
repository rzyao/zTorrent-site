import React from "react";
import { Card, List, Typography } from "antd";
import { GROUP_INFO } from "../constants";
import type { SettingGroup } from "../types";

interface SettingSidebarProps {
  selectedGroup: SettingGroup;
  onSelectGroup: (group: SettingGroup) => void;
  visible: boolean;
}

export const SettingSidebar: React.FC<SettingSidebarProps> = ({
  selectedGroup,
  onSelectGroup,
  visible,
}) => {
  if (!visible) return null;

  return (
    <Card
      className="scroll-area"
      style={{ width: 240, height: "100%", overflow: "auto" }}
    >
      <List
        dataSource={GROUP_INFO}
        renderItem={(group) => (
          <List.Item
            style={{ cursor: "pointer", borderRadius: 8 }}
            onClick={() => onSelectGroup(group.key)}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Typography.Text
                type={selectedGroup === group.key ? "success" : undefined}
              >
                {group.name}
              </Typography.Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};
