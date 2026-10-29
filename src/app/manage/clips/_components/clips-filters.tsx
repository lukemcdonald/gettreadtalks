import { ManageSearchInput } from '@/components/manage-table';
import { SelectFilter } from '@/components/ui/select-filter';

const FILTER_OPTIONS = [
  { label: 'Published', value: 'published' },
  { label: 'Approved', value: 'approved' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Archived', value: 'archived' },
];

export function ClipsFilters() {
  return (
    <div className="flex flex-wrap gap-4">
      <SelectFilter
        className="w-48"
        label="Status"
        name="status"
        options={FILTER_OPTIONS}
        placeholder="All Statuses"
      />
      <ManageSearchInput placeholder="Search clips..." />
    </div>
  );
}
