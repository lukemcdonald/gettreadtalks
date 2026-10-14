import { describe, test } from 'vitest';

import {
  expectTracked,
  expectTrackedTimes,
  mockedTrack,
} from '@/test/analytics';
import { render } from '@/test/render';

import { SearchPageAnalytics } from './search-page-analytics';

describe('SearchPageAnalytics', () => {
  test('tracks a settled search on the results page', () => {
    render(<SearchPageAnalytics query="grace" resultCount={4} />);

    expectTrackedTimes(1);
    expectTracked('search_performed', {
      path: '/search',
      query: 'grace',
      result_count: 4,
      source: 'page',
    });
  });

  test('also tracks no-results when the query has zero hits', () => {
    render(<SearchPageAnalytics query="zzzz" resultCount={0} />);

    expectTrackedTimes(2);
    expectTracked('search_performed', {
      path: '/search',
      query: 'zzzz',
      result_count: 0,
      source: 'page',
    });
    expectTracked('search_no_results', {
      path: '/search',
      query: 'zzzz',
      source: 'page',
    });
  });

  test('does not track an empty query change as a new search when counts stay the same', () => {
    const { rerender } = render(
      <SearchPageAnalytics query="grace" resultCount={4} />
    );

    mockedTrack().mockClear();
    rerender(<SearchPageAnalytics query="grace" resultCount={4} />);

    expectTrackedTimes(0);
  });
});
