import { describe, expect, it, render, screen } from '@/test';

import { ArchiveBackLink } from './archive-back-link';

describe('ArchiveBackLink', () => {
  it('links to the archive with the archive name', () => {
    render(<ArchiveBackLink href="/talks" label="Talks" />);

    expect(screen.getByRole('link', { name: 'Talks' })).toHaveAttribute(
      'href',
      '/talks'
    );
  });
});
