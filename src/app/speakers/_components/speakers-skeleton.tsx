export function SpeakersListSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 3 }).map((_, groupIdx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader items are static and never reordered
        <div className="space-y-4" key={groupIdx}>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* biome-ignore lint/nursery/noShadow: Different scopes, no actual shadowing */}
            {Array.from({ length: 4 }).map((_, itemIdx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader items are static and never reordered
              <div className="h-32 animate-pulse rounded-lg bg-muted" key={itemIdx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
