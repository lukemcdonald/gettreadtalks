import type { StatusType } from '@/lib/entities/types';

import { AccountTalksContent } from '@/app/account/talks/_components/talks-content';
import { PageHeader } from '@/components/page-header';
import { NewTalkButton } from '@/features/talks/components/new-talk-button';

export interface AccountTalksSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
}

interface AccountTalksPageProps {
  searchParams: Promise<AccountTalksSearchParams>;
}

export default async function AccountTalksPage({ searchParams }: AccountTalksPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all talks across all statuses" title="Manage Talks" />
        <NewTalkButton />
      </div>
      <AccountTalksContent searchParams={params} />
    </div>
  );
}
