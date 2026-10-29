import { ManageSearchInput } from '@/components/manage-table';
import { SelectFilter } from '@/components/ui/select-filter';

const STATUS_FILTER_OPTIONS = [
  { label: 'Published', value: 'published' },
  { label: 'Approved', value: 'approved' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Archived', value: 'archived' },
];

const STUDY_FILTER_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

export function TalksFilters() {
  return (
    <div className="flex flex-wrap gap-4">
      <SelectFilter
        className="w-48"
        label="Status"
        name="status"
        options={STATUS_FILTER_OPTIONS}
        placeholder="All Statuses"
      />
      <SelectFilter
        className="w-48"
        label="Study"
        name="study"
        options={STUDY_FILTER_OPTIONS}
        placeholder="All"
      />
      <ManageSearchInput placeholder="Search talks and speakers..." />
    </div>
  );
}
