import type { StatusType } from '@/lib/entities/types';

import { Suspense } from 'react';

import { AccountTalksContent } from '@/app/account/talks/_components/talks-content';
import { TalksFilters } from '@/app/account/talks/_components/talks-filters';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui';
import { NewTalkButton } from '@/features/talks/components/new-talk-button';

export interface AccountTalksSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
}

interface AccountTalksPageProps {
  searchParams: Promise<AccountTalksSearchParams>;
}

export default function AccountTalksPage({
  searchParams,
}: AccountTalksPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          description="Manage all talks across all statuses"
          title="Manage Talks"
        />
        <NewTalkButton />
      </div>
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <TalksFilters />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AccountTalksContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
