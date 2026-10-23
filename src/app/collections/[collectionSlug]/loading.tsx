import { SidebarLayout } from '@/components/layouts';
import { MediaCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui';

function CollectionHeaderSkeleton() {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="max-w-prose min-w-0 space-y-2">
        <Skeleton className="h-14 w-1/2 lg:h-16" />
      </div>
    </header>
  );
}

function CollectionTalksSkeleton() {
  return (
    <ol className="relative flex flex-col gap-3">
      <div className="bg-input absolute top-6 bottom-6 left-4 w-px -translate-x-1/2" />
      {Array.from({ length: 4 }).map((_, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- static skeleton items never reorder
        <li className="flex items-center gap-4" key={i}>
          <Skeleton className="relative z-10 size-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <MediaCardSkeleton />
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function CollectionLoading() {
  return (
    <SidebarLayout
      content={<CollectionTalksSkeleton />}
      header={<CollectionHeaderSkeleton />}
      sidebar={null}
    />
  );
}
