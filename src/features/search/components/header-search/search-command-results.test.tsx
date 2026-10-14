import type { CommandSearchGroup } from '@/features/search/types';

import { describe, expect, test, vi } from 'vitest';

import { VIEW_ALL_SEARCH_GROUP } from '@/features/search/utils';
import { render, screen } from '@/test/render';

import { SearchCommand } from './search-command';
import { SearchCommandResults } from './search-command-results';

const groups: CommandSearchGroup[] = [
  {
    items: [
      {
        href: '/talks/john-doe/romans-8',
        label: 'Romans 8',
        subtitle: 'John Doe',
        value: 'talk1',
      },
    ],
    value: 'Talks',
  },
  {
    items: [
      {
        href: '/search?search=grace',
        label: 'View all results',
        value: VIEW_ALL_SEARCH_GROUP,
      },
    ],
    value: VIEW_ALL_SEARCH_GROUP,
  },
];

function renderResults({
  resultGroups = groups,
  status = 'results' as const,
}: {
  resultGroups?: CommandSearchGroup[];
  status?: 'empty' | 'idle' | 'loading' | 'results';
} = {}) {
  const onSelect = vi.fn();
  const view = render(
    <SearchCommand groups={resultGroups} onInputValueChange={vi.fn()} value="">
      <SearchCommandResults
        groups={resultGroups}
        onSelect={onSelect}
        status={status}
      />
    </SearchCommand>
  );

  return { ...view, onSelect };
}

describe('SearchCommandResults', () => {
  test('shows an empty message only when the status is empty', () => {
    const { rerender } = renderResults({
      resultGroups: [],
      status: 'empty',
    });

    expect(screen.getByText('No results')).toBeInTheDocument();

    rerender(
      <SearchCommand groups={[]} onInputValueChange={vi.fn()} value="">
        <SearchCommandResults groups={[]} onSelect={vi.fn()} status="idle" />
      </SearchCommand>
    );

    expect(screen.queryByText('No results')).not.toBeInTheDocument();
  });

  test('omits a group label for view all and selects a result', async () => {
    const { onSelect, user } = renderResults();

    expect(screen.getByText('Talks')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText(VIEW_ALL_SEARCH_GROUP)).not.toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'View all results' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: /romans 8/iu }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(groups[0]?.items[0]);
  });

  test('selects view all results', async () => {
    const { onSelect, user } = renderResults();

    await user.click(screen.getByRole('option', { name: 'View all results' }));

    expect(onSelect).toHaveBeenCalledWith(groups[1]?.items[0]);
  });
});
