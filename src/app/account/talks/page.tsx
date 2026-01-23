import type { StatusType } from '@/lib/entities/types';

import { AdminTalksClient } from '@/app/account/talks/_components/admin-talks-client';
import { AdminTalksContent } from '@/app/account/talks/_components/talks-content';
import { PageHeader } from '@/components/page-header';

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
        <AdminTalksClient />
      </div>
      <AdminTalksContent searchParams={params} />
    </div>
  );
}
