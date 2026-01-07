import type { StatusType } from '@/convex/lib/validators/shared';

import { AdminTalksContent } from '@/app/admin/talks/_components/admin-talks-content';
import { PageHeader } from '@/components/page-header';

export type AdminTalksSearchParams = {
  cursor?: string;
  search?: string;
  status?: StatusType;
};

type AdminTalksPageProps = {
  searchParams: Promise<AdminTalksSearchParams>;
};

export default async function AdminTalksPage({ searchParams }: AdminTalksPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Manage all talks across all statuses"
        title="Manage Talks"
        variant="lg"
      />
      <AdminTalksContent searchParams={params} />
    </div>
  );
}
