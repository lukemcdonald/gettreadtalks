import type { ReactNode } from 'react';

import { SearchInput } from '@/components/ui/search-input';

export interface ManageListSearchParams {
  cursor?: string;
  search?: string;
}

export function ManageListToolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-4">{children}</div>;
}

export function ManageSearchInput({ placeholder }: { placeholder: string }) {
  return (
    <SearchInput
      className="w-full min-w-0 flex-1 basis-full md:basis-0"
      label="Search"
      paramName="search"
      placeholder={placeholder}
    />
  );
}
