import type { StatusType } from '@/convex/lib/validators/shared';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { AdminTalksContent } from '@/app/account/talks/_components/admin-talks-content';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui';

export type AdminTalksSearchParams = {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
};

type AdminTalksPageProps = {
  searchParams: Promise<AdminTalksSearchParams>;
};

export default async function AdminTalksPage({ searchParams }: AdminTalksPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all talks across all statuses" title="Manage Talks" />
        <Button render={<Link href="/talks/new" />} size="sm">
          <PlusIcon className="size-4" />
          New Talk
        </Button>
      </div>
      <AdminTalksContent searchParams={params} />
    </div>
  );
}
