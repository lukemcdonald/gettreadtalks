import { Suspense } from 'react';

import { MediaHealthContent } from '@/app/manage/media/_components/media-health-content';
import { ManageTableSkeleton } from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';

export default function ManageMediaPage() {
  return (
    <>
      <PageHeader
        description="Open private or missing talk and clip media. Ignore keeps an item out of the digest until its URL changes."
        title="Media health"
      />
      <Suspense fallback={<ManageTableSkeleton resource="media" />}>
        <MediaHealthContent />
      </Suspense>
    </>
  );
}
