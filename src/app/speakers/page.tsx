import type { SpeakersSearchParams } from '@/app/speakers/_components/speakers-results';
import type { Metadata } from 'next';

import { Suspense } from 'react';

import { SpeakersResults } from '@/app/speakers/_components/speakers-results';
import { SpeakersSidebar } from '@/app/speakers/_components/speakers-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { SpeakersListSkeleton } from '@/features/speakers/components/speakers-list-skeleton';
import { getSpeakers } from '@/features/speakers/queries/get-speakers';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

export const metadata: Metadata = {
  description:
    'Discover faithful ministers of the Gospel and be strengthened by their teaching.',
  title: 'Speakers',
};

interface SpeakersPageProps {
  searchParams: Promise<SpeakersSearchParams>;
}

export default async function SpeakersPage({
  searchParams,
}: SpeakersPageProps) {
  const { speakers } = await getSpeakers();

  return (
    <SidebarLayout
      content={
        <Suspense fallback={<SpeakersListSkeleton />}>
          <SpeakersResults searchParams={searchParams} />
        </Suspense>
      }
      header={
        <PageHeader
          description={`Listen to ${speakers.length} faithful ambassadors of Christ and be blessed.`}
          size="lg"
          title="Speakers"
        />
      }
      sidebar={
        <Suspense fallback={<SidebarFiltersSkeleton />}>
          <SpeakersSidebar speakers={speakers} />
        </Suspense>
      }
      sidebarSticky
    />
  );
}
