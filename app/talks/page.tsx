import Link from 'next/link';

import { MainLayout } from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { getTalks } from '@/lib/features/talks';
import { getAuthUser } from '@/lib/services/auth/server';

import { StatusFilter, TalksList } from './_components';

interface TalksPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function TalksPage({ searchParams }: TalksPageProps) {
  const params = await searchParams;
  const user = await getAuthUser();

  // Determine status filter: authenticated users can filter, public users only see published
  const statusParam = params.status as 'published' | 'backlog' | 'archived' | undefined;
  const status = user ? statusParam : 'published';

  const talks = await getTalks(status);

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

      {user && (
        <div className="mb-6">
          <StatusFilter />
        </div>
      )}

      <TalksList talks={talks} />
    </MainLayout>
  );
}
