import type { ReactNode } from 'react';

import {
  ManageListToolbar,
  ManageSearchInput,
} from '@/components/manage-table/manage-search-input';
import { SelectFilter } from '@/components/ui/select-filter';

export const manageFilterSelectClassName =
  'min-w-0 flex-1 basis-0 md:w-48 md:flex-none';

const ALL_STATUSES_OPTION = { label: 'All Statuses', value: 'all' };

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
      {statusOptions ? <ManageStatusFilter options={statusOptions} /> : null}
      {children}
      <ManageSearchInput placeholder={searchPlaceholder} />
    </ManageListToolbar>
  );
}

function ManageStatusFilter({
  options,
}: {
  options: readonly { label: string; value: string }[];
}) {
  return (
    <SelectFilter
      className={manageFilterSelectClassName}
      defaultValue="published"
      label="Status"
      name="status"
      options={[ALL_STATUSES_OPTION, ...options]}
    />
  );
}
