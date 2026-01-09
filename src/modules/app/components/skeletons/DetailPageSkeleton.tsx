import { Skeleton } from "@/modules/app/components/ui/skeleton";
import { PageContainer } from "@/modules/app/components/PageContainer";

export function DetailPageSkeleton() {
  return (
    <PageContainer className="pb-20 text-white md:px-8 lg:px-20">
      {/* Hero Section */}
      <div className="flex w-full flex-col gap-8 pt-12 pb-4 md:flex-row">
        {/* Poster */}
        <div className="shrink-0">
          <Skeleton className="aspect-2/3 w-48 rounded-lg md:w-64" />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-6">
          {/* Title & Subtitle */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4 md:h-12" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Badges & Rating */}
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" /> {/* Rating */}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Description */}
          <div className="max-w-3xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Director / Cast */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
        {/* Left Content */}
        <div className="space-y-6">
          {/* Stills */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-2 overflow-hidden">
              <Skeleton className="h-32 w-48 shrink-0 rounded-md" />
              <Skeleton className="h-32 w-48 shrink-0 rounded-md" />
              <Skeleton className="h-32 w-48 shrink-0 rounded-md" />
            </div>
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex gap-4 border-b border-neutral-800 pb-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden space-y-6 lg:block">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </PageContainer>
  );
}
