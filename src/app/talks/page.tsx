import type { Id } from '@/convex/_generated/dataModel';
import type { StatusType } from '@/convex/lib/validators/shared';

import { Suspense } from 'react';
import Link from 'next/link';

import { ArchiveLayout, ArchiveSidebar, SidebarContent } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { getAllSpeakersForFilter, getAllTopicsForFilter, getTalks } from '@/lib/features/talks';
import { getCurrentUser } from '@/lib/services/auth/server';
import {
  ActiveFilters,
  Pagination,
  TalksFilters,
  TalksList,
  TalksListSkeleton,
} from './_components';

type TalksPageProps = {
  searchParams: Promise<{
    cursor?: string;
    featured?: string;
    search?: string;
    speaker?: string;
    status?: string;
    topic?: string;
  }>;
};

async function TalksContent({ params }: { params: Awaited<TalksPageProps['searchParams']> }) {
  const user = await getCurrentUser();

  const cursor = params.cursor || undefined;
  const featured = params.featured === 'true' ? true : undefined;
  const search = params.search || undefined;
  const speakerId = params.speaker as Id<'speakers'> | undefined;
  const topicId = params.topic as Id<'topics'> | undefined;
  const statusParam = params.status as StatusType | undefined;

  const status = user
    ? statusParam
    : statusParam ||
      (featured === undefined && !speakerId && !topicId && !search ? 'published' : undefined);

  const result = await getTalks({ cursor, featured, search, speakerId, status, topicId });

  return (
    <>
      <TalksList talks={result.talks} />
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
      />
    </>
  );
}

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  // Fetch filter data (not affected by pagination)
  const [speakers, topics] = await Promise.all([
    getAllSpeakersForFilter(),
    getAllTopicsForFilter(),
  ]);

  return (
    <ArchiveLayout
      header={
        <PageHeader
          actions={user ? <Button render={<Link href="/talks/new" />}>New Talk</Button> : undefined}
          description="Elevate your spiritual heartbeat with Christ centered talks."
          title="Talks"
        />
      }
      sidebar={
        <ArchiveSidebar>
          <SidebarContent title="Filters">
            <TalksFilters isAuthenticated={!!user} speakers={speakers} topics={topics} />
          </SidebarContent>
        </ArchiveSidebar>
      }
    >
      <div className="space-y-6">
        <ActiveFilters speakers={speakers} topics={topics} />

        <Suspense fallback={<TalksListSkeleton />}>
          <TalksContent params={params} />
        </Suspense>
      </div>
    </ArchiveLayout>
  );
}
