import { SearchInput } from '@/components/ui/search-input';
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
      <SearchInput
        className="max-w-96 min-w-0 flex-1"
        label="Search"
        paramName="search"
        placeholder="Search clips..."
      />
    </div>
  );
}
