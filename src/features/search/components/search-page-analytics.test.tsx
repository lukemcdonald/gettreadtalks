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

function setup(
  props: Partial<ComponentProps<typeof SearchPageAnalytics>> = {},
  options?: RenderOptions
) {
  return render(
    <SearchPageAnalytics query="grace" resultCount={4} {...props} />,
    options
  );
}

describe('SearchPageAnalytics', () => {
  test('tracks a settled search on the results page', () => {
    setup();

    expectTrackedTimes(1);
    expectTracked('search_performed', {
      path: '/search',
      query: 'grace',
      result_count: 4,
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
    rerender(<SearchPageAnalytics query="grace" resultCount={4} />);

    expectTrackedTimes(0);
  });
});
