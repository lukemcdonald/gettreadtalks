import { TableCell, TableRow } from '@/components/ui';
import { describe, expect, it, render, screen } from '@/test';

import { ManageTable } from './manage-table';

describe('ManageTable', () => {
  it('shows headers and a New action only for an empty catalog', () => {
    const action = <button type="button">New Talk</button>;
    const { rerender } = render(
      <ManageTable isEmpty={false} resource="talks">
        <TableRow>
          <TableCell>Published</TableCell>
          <TableCell>A talk</TableCell>
          <TableCell>Menu</TableCell>
        </TableRow>
      </ManageTable>
    );

    expect(screen.getByRole('columnheader', { name: 'Title' })).toBeVisible();

    rerender(<ManageTable emptyAction={action} isEmpty resource="talks" />);
    expect(
      screen.getByRole('button', { name: 'New Talk' })
    ).toBeInTheDocument();

    rerender(
      <ManageTable emptyAction={action} isEmpty isFiltered resource="talks" />
    );
    expect(screen.getByText('No talks found')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'New Talk' })
    ).not.toBeInTheDocument();
  });
});
