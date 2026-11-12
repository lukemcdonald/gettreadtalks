import type { SpeakersSearchParams } from '@/app/speakers/_components/speakers-results';
import type { Metadata } from 'next';

import { Suspense } from 'react';

import { SpeakersResults } from '@/app/speakers/_components/speakers-results';
import { SpeakersSidebar } from '@/app/speakers/_components/speakers-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { SpeakersListSkeleton } from '@/features/speakers/components/speakers-list-skeleton';
import { loadSpeakerRoles } from '@/features/speakers/queries/load-speaker-roles';
import { buildSpeakersPath } from '@/features/speakers/utils';
import { buildPageMetadata } from '@/lib/metadata';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

export const metadata: Metadata = buildPageMetadata({
  canonical: buildSpeakersPath(),
  description:
    'Discover faithful ministers of the Gospel and be strengthened by their teaching. Browse speakers and listen to Christ centered talks.',
  title: 'Speakers',
});

interface SpeakersPageProps {
  searchParams: Promise<SpeakersSearchParams>;
}

export default async function SpeakersPage({
  searchParams,
}: SpeakersPageProps) {
  const { count, roles } = await loadSpeakerRoles();

  return (
    <SidebarLayout
      content={
        <Suspense fallback={<SpeakersListSkeleton />}>
          <SpeakersResults searchParams={searchParams} />
        </Suspense>
      }
      header={
        <PageHeader
          description={`Listen to ${count} faithful ambassadors of Christ and be blessed.`}
          size="lg"
          title="Speakers"
        />
      }
      sidebar={
        <Suspense fallback={<SidebarFiltersSkeleton />}>
          <SpeakersSidebar roles={roles} />
        </Suspense>
      }
      sidebarSticky
    />
  );
}
