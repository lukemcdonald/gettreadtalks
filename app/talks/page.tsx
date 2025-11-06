import Link from 'next/link';

import { MainLayout } from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import {
  getAllSpeakersForFilter,
  getAllTopicsForFilter,
  getTalks,
} from '@/lib/features/talks';
import { getAuthUser } from '@/lib/services/auth/server';

import { TalksFilters, TalksList } from './_components';

interface TalksPageProps {
  searchParams: Promise<{
    featured?: string;
    speaker?: string;
    status?: string;
    topic?: string;
  }>;
}

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;
  const user = await getAuthUser();

  // Parse filters from URL params
  const featured = params.featured === 'true' ? true : undefined;
  const speakerId = params.speaker || undefined;
  const topicId = params.topic || undefined;
  const statusParam = params.status as 'published' | 'backlog' | 'archived' | undefined;

  // Non-authenticated users only see published talks (unless other filters are applied)
  const status = user ? statusParam : statusParam || (featured === undefined && !speakerId && !topicId ? 'published' : undefined);

  // Fetch data
  const [talks, speakers, topics] = await Promise.all([
    getTalks({ featured, speakerId, status, topicId }),
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

      <TalksList talks={talks} />
    </MainLayout>
  );
}
