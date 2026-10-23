import { SpeakerHeroSkeleton } from '@/app/speakers/[speakerSlug]/_components/speaker-hero-skeleton';
import { EditorialProfileLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';

export function SpeakerContentSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      <aside className="lg:sticky lg:top-20 lg:col-start-2 lg:h-fit">
        <div className="space-y-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </aside>
    </div>
  );
}

export function SpeakerPageSkeleton() {
  return (
    <EditorialProfileLayout
      content={<SpeakerContentSkeleton />}
      hero={<SpeakerHeroSkeleton />}
    />
  );
}
