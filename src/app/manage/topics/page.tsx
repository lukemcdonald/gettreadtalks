import type { ManageListSearchParams } from '@/components/manage-table';

import { Suspense } from 'react';

import { ManageTopicsContent } from '@/app/manage/topics/_components/topics-content';
import {
  ManageSearchInput,
  ManageTableSkeleton,
} from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewTopicButton } from '@/features/topics/components/new-topic-button';

interface ManageTopicsPageProps {
  searchParams: Promise<ManageListSearchParams>;
}

export default function ManageTopicsPage({
  searchParams,
}: ManageTopicsPageProps) {
  return (
    <>
      <PageHeader
        actions={<NewTopicButton />}
        description="Manage all topics"
        title="Manage Topics"
      />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <ManageSearchInput placeholder="Search topics..." />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="topics" />}>
        <ManageTopicsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
