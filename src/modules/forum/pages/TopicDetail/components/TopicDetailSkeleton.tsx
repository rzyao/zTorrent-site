import { useForumTheme } from "../../../context/ForumThemeContext";
import { cn } from "@/utils/cn";

export function TopicDetailSkeleton() {
  const { colors } = useForumTheme();

  return (
    <div className={`min-h-screen pb-20 ${colors.pageBg}`}>
      <div className="mx-auto max-w-[1100px] px-4 pt-6 sm:px-6">
        {/* Title Section Skeleton */}
        <div className="mb-4">
          <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="flex gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>

        {/* Header Divider */}
        <div className={cn("mt-2 mb-2 border-t", colors.dividerColor)}></div>

        {/* Main Layout */}
        <div className="flex items-start gap-4">
          {/* Left: Posts Stream Skeleton */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Post 1 */}
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-800" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
                </div>
                <div className="h-24 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
              </div>
            </div>

            {/* Post 2 */}
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-800" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
                </div>
                <div className="h-16 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
              </div>
            </div>

            {/* Post 3 */}
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-800" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
                </div>
                <div className="h-32 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
              </div>
            </div>
          </div>

          {/* Right: Timeline Skeleton */}
          <div className="hidden w-[140px] shrink-0 lg:block">
            <div className="mt-4 h-[300px] w-4 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
