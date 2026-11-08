import type { ManageStudiesSearchParams } from '@/app/manage/talks/studies/_components/studies-content';

import { Suspense } from 'react';

import { PublishStudyDraftsButton } from '@/app/manage/talks/studies/_components/publish-study-drafts-button';
import { ManageStudiesContent } from '@/app/manage/talks/studies/_components/studies-content';
import { ManagePageHeader } from '@/components/manage-page-header';
import {
  ManageFilters,
  ManageTableSkeleton,
  manageFilterSelectClassName,
} from '@/components/manage-table';
import { Skeleton } from '@/components/ui';
import { SelectFilter } from '@/components/ui/select-filter';
import { STUDY_STATUS_OPTIONS } from '@/lib/entities/manage-status';

interface ManageStudiesPageProps {
  searchParams: Promise<ManageStudiesSearchParams>;
}

export default function ManageStudiesPage({
  searchParams,
}: ManageStudiesPageProps) {
  return (
    <>
      <ManagePageHeader action={<PublishStudyDraftsButton />} title="Studies" />
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageFilters searchPlaceholder="Search talks and speakers...">
          <SelectFilter
            className={manageFilterSelectClassName}
            defaultValue="draft"
            label="Status"
            name="study"
            options={[...STUDY_STATUS_OPTIONS]}
          />
        </ManageFilters>
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="studies" />}>
        <ManageStudiesContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
