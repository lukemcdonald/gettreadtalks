import type { TalksSearchParams } from '@/app/talks/_components/talks-results';
import type { Metadata } from 'next';

import { Suspense } from 'react';

import { TalksResults } from '@/app/talks/_components/talks-results';
import { TalksSidebarContent } from '@/app/talks/_components/talks-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { TalksListSkeleton } from '@/features/talks/components/talks-list-skeleton';
import { buildTalksPath } from '@/features/talks/utils';
import { buildPageMetadata } from '@/lib/metadata';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

export const metadata: Metadata = buildPageMetadata({
  canonical: buildTalksPath(),
  description:
    'Browse Christ centered talks from faithful ministers of the Gospel and elevate your spiritual heartbeat with sermons you can listen to and share.',
  title: 'Talks',
});

interface TalksPageProps {
  searchParams: Promise<TalksSearchParams>;
}

export default function TalksPage({ searchParams }: TalksPageProps) {
  return (
    <SidebarLayout
      content={
        <Suspense fallback={<TalksListSkeleton />}>
          <TalksResults searchParams={searchParams} />
        </Suspense>
      }
      header={
        <PageHeader
          description="Elevate your spiritual heartbeat with Christ centered talks."
          size="lg"
          title="Talks"
        />
      }
      sidebar={
        <Suspense fallback={<SidebarFiltersSkeleton />}>
          <TalksSidebarContent searchParams={searchParams} />
        </Suspense>
      }
      sidebarSticky
    />
  );
}
