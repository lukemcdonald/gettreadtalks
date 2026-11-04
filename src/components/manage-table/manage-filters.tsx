import type { ReactNode } from 'react';

import {
  ManageListToolbar,
  ManageSearchInput,
} from '@/components/manage-table/manage-search-input';
import { SelectFilter } from '@/components/ui/select-filter';

export const manageFilterSelectClassName =
  'min-w-0 flex-1 basis-0 md:w-48 md:flex-none';

export function ManageFilters({
  children,
  searchPlaceholder,
  statusOptions,
}: {
  children?: ReactNode;
  searchPlaceholder: string;
  statusOptions?: readonly { label: string; value: string }[];
}) {
  return (
    <ManageListToolbar>
      {statusOptions ? (
        <SelectFilter
          className={manageFilterSelectClassName}
          defaultValue="published"
          label="Status"
          name="status"
          options={[{ label: 'All Statuses', value: 'all' }, ...statusOptions]}
        />
      ) : null}
      {children}
      <ManageSearchInput placeholder={searchPlaceholder} />
    </ManageListToolbar>
  );
}
