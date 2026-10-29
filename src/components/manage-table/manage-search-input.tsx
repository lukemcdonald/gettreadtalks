import { SearchInput } from '@/components/ui/search-input';

export interface ManageListSearchParams {
  cursor?: string;
  search?: string;
}

export function ManageSearchInput({ placeholder }: { placeholder: string }) {
  return (
    <SearchInput
      className="max-w-96 min-w-0 flex-1"
      label="Search"
      paramName="search"
      placeholder={placeholder}
    />
  );
}
