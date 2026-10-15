import { SelectFilter } from '@/components/ui/select-filter';

const FILTER_OPTIONS = [
  { label: 'Published', value: 'published' },
  { label: 'Approved', value: 'approved' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Archived', value: 'archived' },
];

export function ClipsFilters() {
  return (
    <SelectFilter
      className="w-48"
      label="Status"
      name="status"
      options={FILTER_OPTIONS}
      placeholder="All Statuses"
    />
  );
}
