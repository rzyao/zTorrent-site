import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Pencil, LayoutGrid, Hash } from "lucide-react";
import { useForumTheme } from "../../context/ForumThemeContext";
import { ExtendedForumTag } from "./types";

interface SidebarTagsProps {
  tags: ExtendedForumTag[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEditClick?: () => void;
  showEditButton?: boolean;
}

/**
 * 侧边栏热门标签列表组件
 */
export function SidebarTags({
  tags,
  isExpanded,
  onToggleExpand,
  onEditClick,
  showEditButton = false,
}: SidebarTagsProps) {
  const { colors, theme } = useForumTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="group">
      {/* 可点击的模块标题 */}
      <button
        onClick={onToggleExpand}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg py-1.5 pr-4 pl-8 ${colors.textSecondary} ${colors.buttonHover}`}
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isExpanded ? "" : "-rotate-90"
            }`}
          />
          <span className="text-base font-medium">热门标签</span>
        </div>
        {showEditButton && onEditClick && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
            className={`rounded p-1 text-neutral-500 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700`}
            title="编辑标签"
          >
            <Pencil className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {/* 可折叠的内容区域 */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {tags.map((tag) => {
          const tagPath = `/forum/tag/${tag.id}`;
          const isActive = location.pathname === tagPath;

          let buttonClass: string;
          if (isActive) {
            buttonClass =
              theme === "dark" ? "bg-[#31566c] text-white" : "bg-[#d1f0ff] text-[#0088CC]";
          } else {
            buttonClass = `${colors.textSecondary} ${colors.buttonHover}`;
          }

          return (
            <button
              key={tag.id}
              onClick={() => navigate(tagPath)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg py-1.5 pr-4 pl-8 ${buttonClass}`}
            >
              <div className="flex items-center gap-3">
                <Hash className="h-3 w-3 opacity-50" />
                <span className="text-base font-medium">{tag.name}</span>
              </div>
            </button>
          );
        })}

        <button
          onClick={() => navigate("/forum/tags")}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg py-1.5 pr-4 pl-8 ${colors.textSecondary} ${colors.buttonHover}`}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-4 w-4" />
            <span className="text-base font-medium">所有标签</span>
          </div>
        </button>
      </div>
    </div>
  );
}
