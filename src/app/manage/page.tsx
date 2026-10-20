import { Suspense } from 'react';

import { ManageStudiesContent } from '@/app/manage/_components/studies-content';
import { ManageTableSkeleton } from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';

export default function ManagePage() {
  return (
    <>
      <PageHeader
        description="Review draft studies and transcript coverage"
        title="Studies"
      />
      <Suspense fallback={<ManageTableSkeleton resource="studies" />}>
        <ManageStudiesContent />
      </Suspense>
    </>
  );
}
