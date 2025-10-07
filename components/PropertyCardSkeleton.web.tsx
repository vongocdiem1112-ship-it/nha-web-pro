export default function PropertyCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-md border border-border animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-muted" />

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="h-6 bg-muted rounded w-1/2 mb-2" />
        <div className="h-4 bg-muted rounded w-full mb-2" />
        <div className="h-4 bg-muted rounded w-3/4 mb-3" />
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-24 flex-1" />
        </div>
      </div>
    </div>
  );
}
