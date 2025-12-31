import { getIconByName } from "@/components/ui/icon-picker";
import { useForumTheme } from "../../../context/ForumThemeContext";
import { cn } from "@/components/ui/utils";

interface CategoryHeaderProps {
  category: {
    id?: string;
    name: string;
    color: string;
    description?: string;
    icon?: string;
  };
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const { colors, theme } = useForumTheme();

  const IconComponent = category.icon ? getIconByName(category.icon) : null;

  return (
    <div className="mb-2 px-4 pt-2 sm:px-0">
      <div className="flex items-center gap-3">
        {IconComponent ? (
          <IconComponent
            className="h-9 w-9"
            color={
              category.color
                ? category.color.startsWith("#")
                  ? category.color
                  : `#${category.color}`
                : undefined
            }
            style={{
              color: category.color
                ? category.color.startsWith("#")
                  ? category.color
                  : `#${category.color}`
                : undefined,
            }}
          />
        ) : (
          <div
            className="h-6 w-6 rounded-sm"
            style={{
              backgroundColor: category.color
                ? category.color.startsWith("#")
                  ? category.color
                  : `#${category.color}`
                : undefined,
            }}
          />
        )}

        <h1 className={cn("text-2xl font-bold", colors.textPrimary)}>{category.name}</h1>
      </div>

      {category.description && (
        <div className={cn("mt-2 max-w-4xl text-base", colors.textSecondary)}>
          {category.description}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex">
        <button
          onClick={() => {
            import("../../../components/Composer/ComposerStore").then(({ useComposerStore }) => {
              useComposerStore.getState().open("CREATE_TOPIC", {
                categoryId: category.id || "",
              });
            });
          }}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90",
            theme === "dark" ? "bg-amber-600" : "bg-blue-600",
          )}
        >
          <span>创建新话题</span>
        </button>
      </div>
    </div>
  );
}
