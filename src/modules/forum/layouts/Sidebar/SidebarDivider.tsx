import { useForumTheme } from "../../context/ForumThemeContext";

/**
 * 分割线组件
 * 用于分隔侧边栏的不同区块
 */
export function SidebarDivider({ className = "" }: { className?: string }) {
  const { colors } = useForumTheme();
  return <div className={`border-t ${colors.borderColor} ${className}`} />;
}
