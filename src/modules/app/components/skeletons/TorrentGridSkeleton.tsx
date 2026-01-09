import { TorrentCardSkeleton } from "./TorrentCardSkeleton";

interface TorrentGridSkeletonProps {
  count?: number;
}

export function TorrentGridSkeleton({ count = 24 }: TorrentGridSkeletonProps) {
  return (
    <div className="mt-4 mb-18 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <TorrentCardSkeleton key={i} />
      ))}
    </div>
  );
}
