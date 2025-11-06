import { TalksListSkeleton } from './_components';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      <div className="h-10 w-full animate-pulse rounded bg-muted" />
      <TalksListSkeleton />
    </div>
  );
}
