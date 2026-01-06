import { useForumTheme } from "../../../context/ForumThemeContext";

export function ForumListSkeleton() {
  const { colors } = useForumTheme();

  return (
    <div className="space-y-0">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center border-b px-4 py-4 ${colors.dividerColor} gap-3`}
        >
          {/* Left: Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-neutral-800"></div>
            <div className="flex gap-2">
              <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-neutral-800"></div>
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-800"></div>
            </div>
          </div>

          {/* Middle: Avatars (Desktop) */}
          <div className="hidden shrink-0 items-center justify-end gap-1.5 md:flex">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-800"
              ></div>
            ))}
          </div>

          {/* Right: Stats (Desktop) */}
          <div className="ml-4 hidden shrink-0 items-center gap-5 md:flex">
            <div className="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-neutral-800"></div>
            <div className="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-neutral-800"></div>
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-neutral-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
