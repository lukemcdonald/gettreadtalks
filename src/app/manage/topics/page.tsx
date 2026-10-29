import type { ManageListSearchParams } from '@/components/manage-table';

import { Suspense } from 'react';

import { ManageTopicsContent } from '@/app/manage/topics/_components/topics-content';
import {
  ManageListToolbar,
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
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageListToolbar>
          <ManageSearchInput placeholder="Search topics..." />
        </ManageListToolbar>
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="topics" />}>
        <ManageTopicsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
