import { Skeleton } from "@/modules/app/components/ui/skeleton";

export function MediaCardSkeleton() {
  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900">
      {/* Poster Aspect Ratio 2:3 */}
      <div className="relative aspect-2/3">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Content */}
      <div className="space-y-3 p-3 md:p-4">
        {/* Director / Meta Line 1 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>

        {/* Time / Country Line 2 */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>

        {/* Tags Line 3 */}
        <div className="flex gap-1.5">
          <Skeleton className="h-4 w-10 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-8 rounded-md" />
        </div>

        {/* Stats Line 4 (Border Top) */}
        <div className="flex justify-between border-t border-neutral-800 pt-3">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}
