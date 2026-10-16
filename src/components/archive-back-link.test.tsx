import { describe, expect, it, render, screen } from '@/test';

import { ArchiveBackLink } from './archive-back-link';

describe('ArchiveBackLink', () => {
  it('links to the archive with an accessible name', () => {
    render(
      <ArchiveBackLink href="/talks" label="Back to Talks">
        <h1>The Cross</h1>
      </ArchiveBackLink>
    );

    expect(screen.getByRole('link', { name: 'Back to Talks' })).toHaveAttribute(
      'href',
      '/talks'
    );
    expect(screen.getByRole('heading', { name: 'The Cross' })).toBeVisible();
  });
});
