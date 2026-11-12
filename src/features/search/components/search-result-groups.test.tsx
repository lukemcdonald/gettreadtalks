import type { SearchHit } from '@/features/search/types';
import type { RenderOptions } from '@/test';
import type { ComponentProps } from 'react';

import {
  describe,
  expect,
  expectTracked,
  expectTrackedTimes,
  it,
  render,
  screen,
} from '@/test';

import { SearchResultGroups } from './search-result-groups';

describe('SearchResultGroups', () => {
  const MOCK_HITS: SearchHit[] = [
    {
      href: '/talks/john-doe/romans-8',
      id: 'talk1',
      scripture: 'Romans 8:28',
      subtitle: 'John Doe',
      title: 'Romans 8',
      type: 'talk',
    },
    {
      href: '/topics/grace',
      id: 'topic1',
      title: 'Grace',
      type: 'topic',
    },
  ];
  const MOCK_QUERY = 'grace';

  function setup(
    props: Partial<ComponentProps<typeof SearchResultGroups>> = {},
    options?: RenderOptions
  ) {
    return render(
      <SearchResultGroups hits={MOCK_HITS} query={MOCK_QUERY} {...props} />,
      options
    );
  }

  it('renders nothing when there are no hits', () => {
    const { container } = setup({ hits: [], query: 'zzzz' });

    expect(container).toBeEmptyDOMElement();
  });

  it('groups hits and tracks a page result click with its list position', async () => {
    const { click } = setup();

    expect(screen.getByRole('heading', { name: 'Talks' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Topics' })).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Romans 8:28')).toBeInTheDocument();

    await click(screen.getByRole('link', { name: /romans 8/iu }));
    await click(screen.getByRole('link', { name: 'Grace' }));

    expectTrackedTimes(2);
    expectTracked('search_result_selected', {
      path: '/search',
      position: 1,
      query: MOCK_QUERY,
      result_type: 'talk',
      source: 'page',
    });
    expectTracked('search_result_selected', {
      path: '/search',
      position: 2,
      query: MOCK_QUERY,
      result_type: 'topic',
      source: 'page',
    });
  });
});
