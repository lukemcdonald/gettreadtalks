import { page } from './client';
import { getQueryChange } from './query-change';
import { track } from './track';

interface Location {
  path: string;
  search: string;
}

function trackSearch(path: string, query: string | undefined) {
  if (query === undefined) {
    return;
  }

  void track('search_performed', { path, query });
}

function trackFilters(
  path: string,
  filters: { filter: string; value: string }[]
) {
  for (const { filter, value } of filters) {
    void track('filter_applied', {
      filter,
      path,
      value,
    });
  }
}

export function trackLocationChange(
  previous: Location | null,
  current: Location
) {
  if (!previous || previous.path !== current.path) {
    void page();
    return;
  }

  const { filters, query } = getQueryChange(previous.search, current.search);

  trackSearch(current.path, query);
  trackFilters(current.path, filters);
}
