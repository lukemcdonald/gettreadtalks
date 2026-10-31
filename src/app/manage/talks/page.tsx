import type { ManageTalksSearchParams } from '@/app/manage/talks/_components/talks-content';

import { Suspense } from 'react';

import { ManageTalksContent } from '@/app/manage/talks/_components/talks-content';
import { TalksFilters } from '@/app/manage/talks/_components/talks-filters';
import { ManageTableSkeleton } from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewTalkButton } from '@/features/talks/components/new-talk-button';

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
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <TalksFilters />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="talks" />}>
        <ManageTalksContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
