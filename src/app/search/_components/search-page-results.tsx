import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui';
import { SearchResultGroups } from '@/features/search/components/search-result-groups';
import { searchSite } from '@/features/search/queries/search-site';
import {
  hasSearchHits,
  SEARCH_PAGE_LIMIT,
  toSearchHits,
} from '@/features/search/utils';

export interface SearchPageParams {
  search?: string;
}

interface SearchPageResultsProps {
  searchParams: Promise<SearchPageParams>;
}

export async function SearchPageResults({
  searchParams,
}: SearchPageResultsProps) {
  const params = await searchParams;
  const query = params.search?.trim() ?? '';

  if (!query) {
    return (
      <Empty>
        <EmptyTitle>Search the library</EmptyTitle>
        <EmptyDescription>
          Find published talks, speakers, topics, and clips.
        </EmptyDescription>
      </Empty>
    );
  }

  const results = await searchSite({
    limit: SEARCH_PAGE_LIMIT,
    query,
  });

  if (!hasSearchHits(results)) {
    return (
      <Empty>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          Nothing published matches &ldquo;{query}&rdquo;. Try another search.
        </EmptyDescription>
      </Empty>
    );
  }

  return <SearchResultGroups hits={toSearchHits(results)} />;
}
