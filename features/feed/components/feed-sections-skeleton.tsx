import { Skeleton } from "@/shared/ui/skeleton";

export function FeedSectionsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <section className="section-shell">
        <div className="section-header">
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="metric-grid">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[calc(var(--radius)+0.125rem)] border border-border bg-card p-4"
            >
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-3 h-4 w-20" />
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <div className="feed-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[calc(var(--radius)+0.125rem)] border border-border bg-card p-6"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-4 w-44" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
