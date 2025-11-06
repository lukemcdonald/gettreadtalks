import Link from 'next/link';
import { Suspense } from 'react';

import { MainLayout } from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import {
  getAllSpeakersForFilter,
  getAllTopicsForFilter,
  getTalks,
} from '@/lib/features/talks';
import { getAuthUser } from '@/lib/services/auth/server';

import { Pagination, TalksFilters, TalksList, TalksListSkeleton } from './_components';

interface TalksPageProps {
  searchParams: Promise<{
    cursor?: string;
    featured?: string;
    speaker?: string;
    status?: string;
    topic?: string;
  }>;
}

async function TalksContent({ params }: { params: Awaited<TalksPageProps['searchParams']> }) {
  const user = await getAuthUser();

  // Parse filters from URL params
  const cursor = params.cursor || undefined;
  const featured = params.featured === 'true' ? true : undefined;
  const speakerId = params.speaker || undefined;
  const topicId = params.topic || undefined;
  const statusParam = params.status as 'published' | 'backlog' | 'archived' | undefined;

  // Non-authenticated users only see published talks (unless other filters are applied)
  const status =
    user
      ? statusParam
      : statusParam || (featured === undefined && !speakerId && !topicId ? 'published' : undefined);

  // Fetch talks with pagination
  const result = await getTalks({ cursor, featured, speakerId, status, topicId });

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
  const user = await getAuthUser();

  // Fetch filter data (not affected by pagination)
  const [speakers, topics] = await Promise.all([
    getAllSpeakersForFilter(),
    getAllTopicsForFilter(),
  ]);

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Talks</h1>
        {user && (
          <Button asChild>
            <Link href="/talks/new">New Talk</Link>
          </Button>
        )}
      </div>

      <div className="mb-6">
        <TalksFilters isAuthenticated={!!user} speakers={speakers} topics={topics} />
      </div>

      <Suspense fallback={<TalksListSkeleton />}>
        <TalksContent params={params} />
      </Suspense>
    </MainLayout>
  );
}
