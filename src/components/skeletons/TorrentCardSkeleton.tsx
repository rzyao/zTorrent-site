import { Skeleton } from "@/components/ui/skeleton";

export function TorrentCardSkeleton() {
  return (
    <div className="group relative h-full overflow-hidden rounded-lg border border-transparent bg-[#1A1A1A] p-0">
      {/* Thumbnail Aspect Ratio 2:3 */}
      <div className="relative mb-2 aspect-2/3 w-full overflow-hidden rounded-md sm:mb-3">
        <Skeleton className="h-full w-full rounded-none bg-neutral-800" />
      </div>

      {/* Content */}
      <div className="space-y-2 px-1 pb-2">
        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-3/4 rounded bg-neutral-800" />
          <Skeleton className="h-3 w-1/2 rounded bg-neutral-800" />
        </div>

        {/* Bottom Stats (Size, Seeders, Leechers) */}
        <div className="flex items-center justify-between pt-1">
          {/* Size */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full bg-neutral-800" />
            <Skeleton className="h-3 w-8 rounded bg-neutral-800" />
          </div>

          {/* Seeders/Leechers */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-6 rounded bg-neutral-800" />
            <Skeleton className="h-3 w-6 rounded bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
