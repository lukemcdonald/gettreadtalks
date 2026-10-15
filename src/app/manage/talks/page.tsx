import type { StatusType } from '@/lib/entities/types';

import { Suspense } from 'react';

import { ManageTalksContent } from '@/app/manage/talks/_components/talks-content';
import { TalksFilters } from '@/app/manage/talks/_components/talks-filters';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewTalkButton } from '@/features/talks/components/new-talk-button';

export interface ManageTalksSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
}

interface ManageTalksPageProps {
  searchParams: Promise<ManageTalksSearchParams>;
}

export default function ManageTalksPage({
  searchParams,
}: ManageTalksPageProps) {
  return (
    <>
      <PageHeader
        actions={<NewTalkButton />}
        description="Manage all talks across all statuses"
        title="Manage Talks"
      />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <TalksFilters />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ManageTalksContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
