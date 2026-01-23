import type { StatusType } from '@/lib/entities/types';

import { AdminTalksContent } from '@/app/account/talks/_components/talks-content';
import { PageHeader } from '@/components/page-header';
import { NewTalkButton } from '@/features/talks/components/new-talk-button';

export interface AdminTalksSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
}

interface AdminTalksPageProps {
  searchParams: Promise<AdminTalksSearchParams>;
}

export default async function AdminTalksPage({ searchParams }: AdminTalksPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all talks across all statuses" title="Manage Talks" />
        <NewTalkButton />
      </div>
      <AdminTalksContent searchParams={params} />
    </div>
  );
}
