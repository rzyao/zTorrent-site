import React, { memo } from "react";
import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  /** 图标名称，格式为 "Prefix:Name"，如 "Lucide:Home" */
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
 * 根据 "Prefix:Name" 格式的图标名称，自动从 Lucide 图标库中加载对应图标。
 * (已移除 Ant Design 图标库支持，建议平替为 Lucide)
 *
 * @example
 * <DynamicIcon iconName="Lucide:Home" />
 */
const DynamicIcon: React.FC<DynamicIconProps> = memo(
  ({ iconName, className, size = 16, style }) => {
    if (!iconName) return null;

    // 解析 "Prefix:Name" 格式
    const colonIndex = iconName.indexOf(":");
    let prefix = "";
    let name = "";

    if (colonIndex === -1) {
      // 兼容旧格式或无前缀格式，默认为 Lucide
      prefix = "Lucide";
      name = iconName;
    } else {
      prefix = iconName.substring(0, colonIndex);
      name = iconName.substring(colonIndex + 1);
    }

    if (!name) return null;

    // Lucide 图标
    if (prefix === "Lucide") {
      const IconComponent = (LucideIcons as any)[name];
      if (IconComponent) {
        return <IconComponent className={className} size={size} style={style} />;
      }
      return null;
    }

    // 已移除 Ant Design 图标支持
    if (prefix === "Antd") {
      console.warn(`[DynamicIcon] 已不再支持 Antd 图标库 (${name})，请更换为 Lucide 格式。`);
      return null;
    }

    // 未知前缀
    return null;
  },
);

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
