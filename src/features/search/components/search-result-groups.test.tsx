import type { SearchHit } from '@/features/search/types';

import { describe, expect, test } from 'vitest';

import { expectTracked, expectTrackedTimes } from '@/test/analytics';
import { render, screen } from '@/test/render';

import { SearchResultGroups } from './search-result-groups';

const hits: SearchHit[] = [
  {
    href: '/talks/john-doe/romans-8',
    id: 'talk1',
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

describe('SearchResultGroups', () => {
  test('renders nothing when there are no hits', () => {
    const { container } = render(<SearchResultGroups hits={[]} query="zzzz" />);

    expect(container).toBeEmptyDOMElement();
  });

  test('groups hits and tracks a page result click with its list position', async () => {
    const { user } = render(<SearchResultGroups hits={hits} query="grace" />);

    expect(screen.getByRole('heading', { name: 'Talks' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Topics' })).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /romans 8/iu }));
    await user.click(screen.getByRole('link', { name: 'Grace' }));

    expectTrackedTimes(2);
    expectTracked('search_result_selected', {
      path: '/search',
      position: 1,
      query: 'grace',
      result_type: 'talk',
      source: 'page',
    });
    expectTracked('search_result_selected', {
      path: '/search',
      position: 2,
      query: 'grace',
      result_type: 'topic',
      source: 'page',
    });
  });
});
