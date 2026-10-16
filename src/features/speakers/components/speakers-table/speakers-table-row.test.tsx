/// <reference types="vitest/globals" />

import type { Speaker } from '@/features/speakers/types';

import { Table, TableBody } from '@/components/ui';
import { getSpeakerUrl } from '@/features/speakers/utils';
import { getEntityEditPath } from '@/lib/entities/paths';
import { describe, expect, it, render, screen } from '@/test';

import { SpeakersTableRow } from './speakers-table-row';

vi.mock('@/features/speakers/components/speaker-actions-menu', () => ({
  SpeakerActionsMenu: () => null,
}));

describe('SpeakersTableRow', () => {
  const speaker = {
    _id: 'speakers:john-piper' as Speaker['_id'],
    firstName: 'John',
    lastName: 'Piper',
    slug: 'john-piper',
  } as Speaker;

  function setup({
    clipCount = 0,
    talkCount = 0,
  }: {
    clipCount?: number;
    talkCount?: number;
  } = {}) {
    return render(
      <Table>
        <TableBody>
          <SpeakersTableRow
            clipCount={clipCount}
            speaker={speaker}
            talkCount={talkCount}
          />
        </TableBody>
      </Table>
    );
  }

  it('links a published speaker to the public page', () => {
    setup({ talkCount: 1 });

    expect(screen.getByRole('link', { name: 'John Piper' })).toHaveAttribute(
      'href',
      getSpeakerUrl(speaker.slug)
    );
    expect(
      screen.getByRole('link', { name: 'Edit John Piper' })
    ).toHaveAttribute('href', getEntityEditPath('speakers', speaker._id));
  });

  it('opens the edit drawer from a speaker with no public content', () => {
    setup();
    const titleLink = screen.getByRole('link', { name: 'John Piper' });

    expect(titleLink).toHaveAttribute(
      'href',
      getEntityEditPath('speakers', speaker._id)
    );
    expect(titleLink).not.toHaveAttribute('href', '');
  });
});
