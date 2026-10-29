import { SearchInput } from '@/components/ui/search-input';

export function CollectionsFilters() {
  return (
    <SearchInput
      className="max-w-96 min-w-0 flex-1"
      label="Search"
      paramName="search"
      placeholder="Search collections..."
    />
  );
}
