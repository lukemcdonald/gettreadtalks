import { getEntityEditPath } from '@/lib/entities/paths';
import { describe, expect, it, render, screen } from '@/test';

import { ManageEditButton } from './manage-edit-button';

describe('ManageEditButton', () => {
  it('opens the existing edit drawer url', () => {
    render(
      <ManageEditButton entity="talks" id="talk123" name="Justification" />
    );

    const editControl = screen.getByRole('link', {
      name: 'Edit Justification',
    });

    expect(editControl).toHaveAttribute(
      'href',
      getEntityEditPath('talks', 'talk123')
    );
    expect(editControl).not.toHaveAttribute('href', '');
  });
});
