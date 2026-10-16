/// <reference types="vitest/globals" />

import type { Speaker } from '@/features/speakers/types';

import { Table, TableBody } from '@/components/ui';
import { getEntityEditPath } from '@/lib/entities/paths';
import { describe, expect, it, render, screen } from '@/test';

import { SpeakersTableRow } from './speakers-table-row';

vi.mock('@/features/speakers/components/speaker-actions-menu', () => ({
  SpeakerActionsMenu: () => null,
}));

describe('SpeakersTableRow', () => {
  const speaker = {
    _creationTime: 1,
    _id: 'speakers:john-piper' as Speaker['_id'],
    firstName: 'John',
    lastName: 'Piper',
    slug: 'john-piper',
  } as Speaker;

  function setup({
    clipCount = 0,
    status = 'published',
    talkCount = 0,
  }: {
    clipCount?: number;
    status?: 'draft' | 'published';
    talkCount?: number;
  } = {}) {
    return render(
      <Table>
        <TableBody>
          <SpeakersTableRow
            clipCount={clipCount}
            speaker={speaker}
            status={status}
            talkCount={talkCount}
          />
        </TableBody>
      </Table>
    );
  }

  it('opens the edit drawer from the name and has no pencil control', () => {
    setup({ talkCount: 1 });
    const titleLink = screen.getByRole('link', { name: 'John Piper' });

    expect(titleLink).toHaveAttribute(
      'href',
      getEntityEditPath('speakers', speaker._id)
    );
    expect(titleLink).not.toHaveAttribute('href', '');
    expect(
      screen.queryByRole('link', { name: 'Edit John Piper' })
    ).not.toBeInTheDocument();
  });

  it('opens the edit drawer from a speaker with no public content', () => {
    setup({ status: 'draft' });
    const titleLink = screen.getByRole('link', { name: 'John Piper' });

    expect(titleLink).toHaveAttribute(
      'href',
      getEntityEditPath('speakers', speaker._id)
    );
  });
});
