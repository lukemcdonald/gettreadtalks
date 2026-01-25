'use client';

import { SearchInput } from '@/components/ui/search-input';
import { SelectFilter } from '@/components/ui/select-filter';

export function TalksFilters() {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <SearchInput label="Search" paramName="search" placeholder="Search talks and speakers..." />
      </div>
      <div className="w-48">
        <SelectFilter
          label="Status"
          name="status"
          options={[
            { label: 'Published', value: 'published' },
            { label: 'Approved', value: 'approved' },
            { label: 'Backlog', value: 'backlog' },
            { label: 'Archived', value: 'archived' },
          ]}
          placeholder="All Statuses"
        />
      </div>
    </div>
  );
}
