import { page } from './client';
import { getLocationIntent } from './query-change';
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
  const intent = getLocationIntent(previous, current);

  if (intent.kind === 'page') {
    void page();
    return;
  }

  trackSearch(current.path, intent.query);
  trackFilters(current.path, intent.filters);
}
