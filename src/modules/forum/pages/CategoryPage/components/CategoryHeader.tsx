import { getIconByName } from "@/modules/forum/components/ui/icon-picker";
import { useForumTheme } from "../../../context/ForumThemeContext";
import { cn } from "@/utils/cn";

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
  const { colors } = useForumTheme();

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
    </div>
  );
}
