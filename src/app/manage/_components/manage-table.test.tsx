import { TableCell, TableRow } from '@/components/ui';
import { describe, expect, it, render, screen } from '@/test';

import { ManageTable, ManageTableSkeleton } from './manage-table';

describe('ManageTable', () => {
  it('shows visible headers', () => {
    render(
      <ManageTable isEmpty={false} resource="talks">
        <TableRow>
          <TableCell>Published</TableCell>
          <TableCell>A talk</TableCell>
          <TableCell>Menu</TableCell>
        </TableRow>
      </ManageTable>
    );

    expect(screen.getByRole('columnheader', { name: 'Title' })).toBeVisible();
  });

  it('offers New when the catalog is empty, not when filters match nothing', () => {
    const { rerender } = render(
      <ManageTable
        emptyAction={<button type="button">New Talk</button>}
        isEmpty
        resource="talks"
      />
    );

    expect(
      screen.getByRole('button', { name: 'New Talk' })
    ).toBeInTheDocument();

    rerender(
      <ManageTable
        emptyAction={<button type="button">New Talk</button>}
        isEmpty
        isFiltered
        resource="talks"
      />
    );

    expect(screen.getByText('No talks found')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'New Talk' })
    ).not.toBeInTheDocument();
  });
});

describe('ManageTableSkeleton', () => {
  it('shows headers while loading', () => {
    render(<ManageTableSkeleton resource="talks" />);

    expect(screen.getByRole('columnheader', { name: 'Title' })).toBeVisible();
  });
});
