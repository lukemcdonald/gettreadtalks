import type { ManageListSearchParams } from '@/components/manage-table';

import { Suspense } from 'react';

import { ManageTopicsContent } from '@/app/manage/topics/_components/topics-content';
import { ManageNewButton } from '@/components/manage-new-button';
import { ManagePageHeader } from '@/components/manage-page-header';
import { ManageFilters, ManageTableSkeleton } from '@/components/manage-table';
import { Skeleton } from '@/components/ui';

interface ManageTopicsPageProps {
  searchParams: Promise<ManageListSearchParams>;
}

export default function ManageTopicsPage({
  searchParams,
}: ManageTopicsPageProps) {
  return (
    <>
      <ManagePageHeader
        action={<ManageNewButton entity="topics" />}
        title="Topics"
      />
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageFilters searchPlaceholder="Search topics..." />
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="topics" />}>
        <ManageTopicsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
