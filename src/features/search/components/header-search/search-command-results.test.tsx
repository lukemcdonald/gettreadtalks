import type {
  CommandSearchGroup,
  HeaderSearchStatus,
} from '@/features/search/types';
import type { RenderOptions } from '@/test';
import type { ComponentProps } from 'react';

import { VIEW_ALL_SEARCH_GROUP } from '@/features/search/utils';
import { describe, expect, it, render, screen, vi } from '@/test';

import { SearchCommand } from './search-command';
import { SearchCommandResults } from './search-command-results';

describe('SearchCommandResults', () => {
  const MOCK_GROUPS: CommandSearchGroup[] = [
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

  function setup(
    props: Partial<ComponentProps<typeof SearchCommandResults>> = {},
    options?: RenderOptions
  ) {
    const onSelect = props.onSelect ?? vi.fn();
    const resultGroups = props.groups ?? MOCK_GROUPS;
    const status: HeaderSearchStatus = props.status ?? 'results';

    return {
      onSelect,
      ...render(
        <SearchCommand
          groups={resultGroups}
          onInputValueChange={vi.fn()}
          value=""
        >
          <SearchCommandResults
            groups={resultGroups}
            onSelect={onSelect}
            status={status}
          />
        </SearchCommand>,
        options
      ),
    };
  }

  it('shows an empty message only when the status is empty', () => {
    const { rerender } = setup({
      groups: [],
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

  it('omits a group label for view all and selects a result', async () => {
    const { click, onSelect } = setup();

    expect(screen.getByText('Talks')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText(VIEW_ALL_SEARCH_GROUP)).not.toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'View all results' })
    ).toBeInTheDocument();

    await click(screen.getByRole('option', { name: /romans 8/iu }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(MOCK_GROUPS[0]?.items[0]);
  });

  it('selects view all results', async () => {
    const { click, onSelect } = setup();

    await click(screen.getByRole('option', { name: 'View all results' }));

    expect(onSelect).toHaveBeenCalledWith(MOCK_GROUPS[1]?.items[0]);
  });
});
