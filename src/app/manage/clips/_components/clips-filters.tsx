import {
  ManageListToolbar,
  ManageSearchInput,
} from '@/components/manage-table';
import { SelectFilter } from '@/components/ui/select-filter';

const FILTER_OPTIONS = [
  { label: 'Published', value: 'published' },
  { label: 'Approved', value: 'approved' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Archived', value: 'archived' },
];

export function ClipsFilters() {
  return (
    <ManageListToolbar>
      <SelectFilter
        className="w-48"
        label="Status"
        name="status"
        options={FILTER_OPTIONS}
        placeholder="All Statuses"
      />
      <ManageSearchInput placeholder="Search clips..." />
    </ManageListToolbar>
  );
}
