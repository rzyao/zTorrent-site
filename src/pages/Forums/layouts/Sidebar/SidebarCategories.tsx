import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Pencil, LayoutGrid, Square } from "lucide-react";
import { useForumTheme } from "../../context/ForumThemeContext";
import { getIconByName } from "@/components/ui/icon-picker";
import { ExtendedForumCategory } from "./types";

interface SidebarCategoriesProps {
  categories: ExtendedForumCategory[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEditClick?: () => void;
  showEditButton?: boolean;
}

/**
 * 侧边栏话题分类列表组件
 */
export function SidebarCategories({
  categories,
  isExpanded,
  onToggleExpand,
  onEditClick,
  showEditButton = false,
}: SidebarCategoriesProps) {
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
          <span className="text-base font-medium">话题分类</span>
        </div>
        {showEditButton && onEditClick && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
            className={`rounded p-1 text-neutral-500 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700`}
            title="编辑分类"
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
        {categories.map((cat) => {
          // 使用路由路径判断激活状态
          const categoryPath = `/forum/category/${cat.id}`;
          const isActive =
            location.pathname === categoryPath || location.pathname.startsWith(categoryPath + "/");

          let buttonClass: string;
          if (isActive) {
            buttonClass =
              theme === "dark" ? "bg-[#31566c] text-white" : "bg-[#d1f0ff] text-[#0088CC]";
          } else {
            buttonClass = `${colors.textSecondary} ${colors.buttonHover}`;
          }

          return (
            <button
              key={cat.id}
              onClick={() => navigate(categoryPath)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg py-1.5 pr-4 pl-8 ${buttonClass}`}
            >
              <div className="flex items-center gap-3">
                {/* Category Icon or Color Block */}
                {(() => {
                  const IconComponent = cat.icon ? getIconByName(cat.icon) : null;
                  if (IconComponent) {
                    return <IconComponent className="h-3.5 w-3.5" style={{ color: cat.color }} />;
                  }
                  return cat.color ? (
                    <span
                      className="h-3 w-3 rounded-[2px]"
                      style={{ backgroundColor: cat.color }}
                    />
                  ) : (
                    <Square className="h-3 w-3 text-gray-400" />
                  );
                })()}
                <span className="text-base font-medium">{cat.name}</span>
              </div>
            </button>
          );
        })}

        <button
          onClick={() => navigate("/forum/categories")}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg py-1.5 pr-4 pl-8 ${colors.textSecondary} ${colors.buttonHover}`}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-4 w-4" />
            <span className="text-base font-medium">所有类别</span>
          </div>
        </button>
      </div>
    </div>
  );
}
