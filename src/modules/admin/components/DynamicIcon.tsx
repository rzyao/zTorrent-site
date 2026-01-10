import React, { memo } from "react";
import * as LucideIcons from "lucide-react";
import * as AntdIcons from "@ant-design/icons";

interface DynamicIconProps {
  /** 图标名称，格式为 "Prefix:Name"，如 "Lucide:Home" 或 "Antd:DashboardOutlined" */
  iconName?: string | null;
  /** 自定义 className */
  className?: string;
  /** 图标尺寸 (仅对 Lucide 有效) */
  size?: number;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 动态图标组件
 *
 * 根据 "Prefix:Name" 格式的图标名称，自动从 Lucide 或 Ant Design 图标库中加载对应图标。
 *
 * @example
 * <DynamicIcon iconName="Lucide:Home" />
 * <DynamicIcon iconName="Antd:DashboardOutlined" size={16} />
 */
const DynamicIcon: React.FC<DynamicIconProps> = memo(
  ({ iconName, className, size = 16, style }) => {
    if (!iconName) return null;

    // 解析 "Prefix:Name" 格式
    const colonIndex = iconName.indexOf(":");
    if (colonIndex === -1) return null;

    const prefix = iconName.substring(0, colonIndex);
    const name = iconName.substring(colonIndex + 1);

    if (!name) return null;

    // Lucide 图标
    if (prefix === "Lucide") {
      const IconComponent = (LucideIcons as any)[name];
      if (IconComponent) {
        return <IconComponent className={className} size={size} style={style} />;
      }
      return null;
    }

    // Ant Design 图标
    if (prefix === "Antd") {
      const IconComponent = (AntdIcons as any)[name];
      if (IconComponent) {
        return <IconComponent className={className} style={{ fontSize: size, ...style }} />;
      }
      return null;
    }

    // 未知前缀
    return null;
  },
);

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
