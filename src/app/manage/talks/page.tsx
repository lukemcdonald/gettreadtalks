import type { ManageTalksSearchParams } from '@/app/manage/talks/_components/talks-content';

import { Suspense } from 'react';

import { ManageTalksContent } from '@/app/manage/talks/_components/talks-content';
import { ManageNewButton } from '@/components/manage-new-button';
import { ManagePageHeader } from '@/components/manage-page-header';
import {
  ManageFilters,
  ManageTableSkeleton,
  manageFilterSelectClassName,
} from '@/components/manage-table';
import { Skeleton } from '@/components/ui';
import { SelectFilter } from '@/components/ui/select-filter';
import { StudyBackfillControl } from '@/features/talks/components/study-backfill-control';
import { CONTENT_STATUS_OPTIONS } from '@/lib/entities/manage-status';

const STUDY_FILTER_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

interface ManageTalksPageProps {
  searchParams: Promise<ManageTalksSearchParams>;
}

export default function ManageTalksPage({
  searchParams,
}: ManageTalksPageProps) {
  return (
    <>
      <ManagePageHeader
        action={<ManageNewButton entity="talks" />}
        title="Talks"
      />
      <StudyBackfillControl />
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <ManageFilters
          searchPlaceholder="Search talks and speakers..."
          statusOptions={CONTENT_STATUS_OPTIONS}
        >
          <SelectFilter
            className={manageFilterSelectClassName}
            label="Study"
            name="study"
            options={STUDY_FILTER_OPTIONS}
            placeholder="All"
          />
        </ManageFilters>
      </Suspense>
      <Suspense fallback={<ManageTableSkeleton resource="talks" />}>
        <ManageTalksContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
