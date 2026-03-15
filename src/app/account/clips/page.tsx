import type { StatusType } from '@/lib/entities/types';

import { AccountClipsContent } from '@/app/account/clips/_components/clips-content';
import { PageHeader } from '@/components/page-header';
import { NewClipButton } from '@/features/clips/components/new-clip-button';

export interface AccountClipsSearchParams {
  cursor?: string;
  status?: StatusType | 'all';
}

interface AccountClipsPageProps {
  searchParams: Promise<AccountClipsSearchParams>;
}

export default async function AccountClipsPage({ searchParams }: AccountClipsPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all clips across all statuses" title="Manage Clips" />
        <NewClipButton />
      </div>
      <AccountClipsContent searchParams={params} />
    </div>
  );
}
