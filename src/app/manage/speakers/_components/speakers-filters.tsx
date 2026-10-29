import { SearchInput } from '@/components/ui/search-input';

export function SpeakersFilters() {
  return (
    <SearchInput
      className="max-w-96 min-w-0 flex-1"
      label="Search"
      paramName="search"
      placeholder="Search speakers..."
    />
  );
}
