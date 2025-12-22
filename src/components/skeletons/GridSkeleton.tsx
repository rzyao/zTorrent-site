import { MediaCardSkeleton } from "./MediaCardSkeleton";

interface GridSkeletonProps {
  count?: number;
}

export function GridSkeleton({ count = 20 }: GridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}
