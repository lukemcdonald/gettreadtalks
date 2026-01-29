export function ClipsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static and never reordered
        <div className="h-48 animate-pulse rounded-lg bg-muted" key={i} />
      ))}
    </div>
  );
}
