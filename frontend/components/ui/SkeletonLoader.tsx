
  interface SkeletonProps {    className?: string;
    "aria-label"?: string;
  }

  export function Skeleton({ className = "", "aria-label": ariaLabel }: SkeletonProps) {
    return (
      <div
        className={`skeleton ${className}`}
        role="status"
        aria-label={ariaLabel ?? "Loading..."}
        aria-busy="true"
      />
    );
  }

  //─── Preset skeleton shapes ───────────────────────────────────────────────────

  export function SliderSkeleton() {
    return (
      <div
        className="w-full h-[60vh] md:h-[75vh] bg-background-elevated animate-pulse rounded-none"
        role="status"
        aria-label="Loading photographer gallery..."aria-busy="true"
      >
        <div className="w-full h-full skeleton" />
      </div>
    );
  }

  export function BlogCardSkeleton() {
    return (
      <div
        className="card-dark p-5 flex flex-col gap-3"
        role="status"
        aria-label="Loading blog post..."
        aria-busy="true"
      >
        <Skeleton className="h-44 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4 mt-2" />
        <Skeleton className="h-3w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  export function CalendarSkeleton() {
    return (
      <div
        className="card-dark p-6"
        role="status"
        aria-label="Loading calendar..."
        aria-busy="true"
      >
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }