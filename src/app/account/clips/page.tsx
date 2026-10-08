import type { StatusType } from '@/lib/entities/types';

import { Suspense } from 'react';

import { AccountClipsContent } from '@/app/account/clips/_components/clips-content';
import { ClipsFilters } from '@/app/account/clips/_components/clips-filters';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewClipButton } from '@/features/clips/components/new-clip-button';

export interface AccountClipsSearchParams {
  cursor?: string;
  status?: StatusType | 'all';
}

interface AccountClipsPageProps {
  searchParams: Promise<AccountClipsSearchParams>;
}

export default function AccountClipsPage({
  searchParams,
}: AccountClipsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          description="Manage all clips across all statuses"
          title="Manage Clips"
        />
        <NewClipButton />
      </div>
      <ClipsFilters />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AccountClipsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
