import type { RenderOptions } from '@/test/render';
import type { ComponentProps } from 'react';

import { describe, test } from 'vitest';

import {
  expectTracked,
  expectTrackedTimes,
  mockedTrack,
} from '@/test/analytics';
import { render } from '@/test/render';

import { SearchPageAnalytics } from './search-page-analytics';

describe('SearchPageAnalytics', () => {
  const MOCK_QUERY = 'grace';
  const MOCK_RESULT_COUNT = 4;

  function setup(
    props: Partial<ComponentProps<typeof SearchPageAnalytics>> = {},
    options?: RenderOptions
  ) {
    return render(
      <SearchPageAnalytics
        query={MOCK_QUERY}
        resultCount={MOCK_RESULT_COUNT}
        {...props}
      />,
      options
    );
  }

  test('tracks a settled search on the results page', () => {
    setup();

    expectTrackedTimes(1);
    expectTracked('search_performed', {
      path: '/search',
      query: MOCK_QUERY,
      result_count: MOCK_RESULT_COUNT,
      source: 'page',
    });
  });

  test('also tracks no-results when the query has zero hits', () => {
    setup({ query: 'zzzz', resultCount: 0 });

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
    const { rerender } = setup();

    mockedTrack().mockClear();
    rerender(
      <SearchPageAnalytics query={MOCK_QUERY} resultCount={MOCK_RESULT_COUNT} />
    );

    expectTrackedTimes(0);
  });
});
